const express = require("express");
const User = require("../models/User");
const Property = require("../models/Property");
const Booking = require("../models/Booking");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// All admin routes require admin authorization
router.use(protect);
router.use(authorize("admin"));

// @desc    Get admin dashboard statistics
// @route   GET /api/v1/admin/dashboard
// @access  Private (Admin only)
router.get("/dashboard", async (req, res) => {
  try {
    console.log("Dashboard route called");

    // Test basic counts one by one
    console.log("Getting user count...");
    const totalUsers = await User.countDocuments();
    console.log("User count:", totalUsers);

    console.log("Getting property count...");
    const totalProperties = await Property.countDocuments();
    console.log("Property count:", totalProperties);

    console.log("Getting booking count...");
    const totalBookings = await Booking.countDocuments();
    console.log("Booking count:", totalBookings);

    console.log("Getting pending count...");
    const pendingApprovals = await Property.countDocuments({
      status: "pending",
    });
    console.log("Pending count:", pendingApprovals);

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalProperties,
          totalBookings,
          pendingApprovals,
          totalRevenue: 0,
          thisMonthRevenue: 0,
        },
        bookingStats: [],
        propertyByArea: [],
        recentActivities: {
          bookings: [],
          properties: [],
          users: [],
        },
        topProperties: [],
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({
      success: false,
      error: "Server error fetching dashboard data",
      code: "DASHBOARD_FETCH_ERROR",
      details: error.message,
    });
  }
});

// @desc    Get all users with filtering and pagination
// @route   GET /api/v1/admin/users
// @access  Private (Admin only)
router.get("/users", async (req, res) => {
  try {
    const { role, isActive, search, page = 1, limit = 10 } = req.query;

    let filter = {};

    if (role) {
      filter.role = { $in: role.split(",") };
    }

    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const startIndex = (page - 1) * limit;
    const total = await User.countDocuments(filter);

    const users = await User.find(filter)
      .select("-password")
      .sort("-createdAt")
      .skip(startIndex)
      .limit(parseInt(limit));

    const pagination = {};
    const endIndex = page * limit;

    if (endIndex < total) {
      pagination.next = { page: parseInt(page) + 1, limit: parseInt(limit) };
    }

    if (startIndex > 0) {
      pagination.prev = { page: parseInt(page) - 1, limit: parseInt(limit) };
    }

    res.json({
      success: true,
      count: users.length,
      total,
      pagination,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server error fetching users",
      code: "USERS_FETCH_ERROR",
    });
  }
});

// @desc    Update user status (activate/deactivate)
// @route   PUT /api/v1/admin/users/:id/status
// @access  Private (Admin only)
router.put("/users/:id/status", async (req, res) => {
  try {
    const { isActive } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
        code: "USER_NOT_FOUND",
      });
    }

    // Prevent admin from deactivating themselves
    if (user._id.toString() === req.user.id && !isActive) {
      return res.status(400).json({
        success: false,
        error: "Cannot deactivate your own account",
        code: "CANNOT_DEACTIVATE_SELF",
      });
    }

    user.isActive = isActive;
    await user.save();

    res.json({
      success: true,
      message: `User ${isActive ? "activated" : "deactivated"} successfully`,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server error updating user status",
      code: "USER_STATUS_UPDATE_ERROR",
    });
  }
});

// @desc    Get pending property approvals
// @route   GET /api/v1/admin/properties/pending
// @access  Private (Admin only)
router.get("/properties/pending", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const startIndex = (page - 1) * limit;
    const total = await Property.countDocuments({ status: "pending" });

    const properties = await Property.find({ status: "pending" })
      .sort("-createdAt")
      .skip(startIndex)
      .limit(parseInt(limit))
      .populate("owner", "name email phone profile");

    const pagination = {};
    const endIndex = page * limit;

    if (endIndex < total) {
      pagination.next = { page: parseInt(page) + 1, limit: parseInt(limit) };
    }

    if (startIndex > 0) {
      pagination.prev = { page: parseInt(page) - 1, limit: parseInt(limit) };
    }

    res.json({
      success: true,
      count: properties.length,
      total,
      pagination,
      data: properties,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server error fetching pending properties",
      code: "PENDING_PROPERTIES_FETCH_ERROR",
    });
  }
});

// @desc    Approve or reject property
// @route   PUT /api/v1/admin/properties/:id/approval
// @access  Private (Admin only)
router.put("/properties/:id/approval", async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid approval status",
        code: "INVALID_STATUS",
      });
    }

    const property = await Property.findById(req.params.id).populate(
      "owner",
      "name email"
    );

    if (!property) {
      return res.status(404).json({
        success: false,
        error: "Property not found",
        code: "PROPERTY_NOT_FOUND",
      });
    }

    // Update status and store approval/rejection metadata under the `approval` subdocument
    property.status = status;
    if (!property.approval) property.approval = {};

    if (status === "approved") {
      property.approval.approvedBy = req.user.id;
      property.approval.approvedAt = new Date();
      // mark publishedAt for approved properties
      property.publishedAt = property.publishedAt || new Date();
    } else if (status === "rejected") {
      property.approval.rejectedBy = req.user.id;
      property.approval.rejectedAt = new Date();
      if (rejectionReason) property.approval.rejectionReason = rejectionReason;
    }

    await property.save();

    res.json({
      success: true,
      message: `Property ${status} successfully`,
      data: property,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server error updating property approval",
      code: "PROPERTY_APPROVAL_ERROR",
    });
  }
});

// @desc    Get all properties for admin management
// @route   GET /api/v1/admin/properties
// @access  Private (Admin only)
router.get("/properties", async (req, res) => {
  try {
    const { status, area, type, search, page = 1, limit = 10 } = req.query;

    let filter = {};

    if (status) {
      filter.status = { $in: status.split(",") };
    }

    if (area) {
      filter["location.area"] = { $in: area.split(",") };
    }

    if (type) {
      filter.type = { $in: type.split(",") };
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { "location.address": { $regex: search, $options: "i" } },
      ];
    }

    const startIndex = (page - 1) * limit;
    const total = await Property.countDocuments(filter);

    const properties = await Property.find(filter)
      .sort("-createdAt")
      .skip(startIndex)
      .limit(parseInt(limit))
      .populate("owner", "name email phone");

    const pagination = {};
    const endIndex = page * limit;

    if (endIndex < total) {
      pagination.next = { page: parseInt(page) + 1, limit: parseInt(limit) };
    }

    if (startIndex > 0) {
      pagination.prev = { page: parseInt(page) - 1, limit: parseInt(limit) };
    }

    res.json({
      success: true,
      count: properties.length,
      total,
      pagination,
      data: properties,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server error fetching properties",
      code: "ADMIN_PROPERTIES_FETCH_ERROR",
    });
  }
});

// @desc    Delete property (Admin only)
// @route   DELETE /api/v1/admin/properties/:id
// @access  Private (Admin only)
router.delete("/properties/:id", async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        error: "Property not found",
        code: "PROPERTY_NOT_FOUND",
      });
    }

    // Check for active bookings
    const activeBookings = await Booking.countDocuments({
      property: req.params.id,
      status: { $in: ["pending", "confirmed"] },
    });

    if (activeBookings > 0) {
      return res.status(400).json({
        success: false,
        error: "Cannot delete property with active bookings",
        code: "PROPERTY_HAS_ACTIVE_BOOKINGS",
      });
    }

    await property.deleteOne();

    res.json({
      success: true,
      message: "Property deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server error deleting property",
      code: "PROPERTY_DELETE_ERROR",
    });
  }
});

// @desc    Get comprehensive analytics
// @route   GET /api/v1/admin/analytics
// @access  Private (Admin only)
router.get("/analytics", async (req, res) => {
  try {
    const { period = "30d" } = req.query;

    // Calculate date range
    let startDate = new Date();
    switch (period) {
      case "7d":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(startDate.getDate() - 30);
        break;
      case "90d":
        startDate.setDate(startDate.getDate() - 90);
        break;
      case "1y":
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 30);
    }

    // Simplified analytics to avoid aggregation issues
    const revenueAnalytics = [];
    const areaPerformance = [];
    const userGrowth = [];
    const bookingStatusDistribution = [];

    res.json({
      success: true,
      data: {
        period,
        revenueAnalytics,
        areaPerformance,
        userGrowth,
        bookingStatusDistribution,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server error fetching analytics",
      code: "ANALYTICS_FETCH_ERROR",
    });
  }
});

// @desc    Get system settings
// @route   GET /api/v1/admin/settings
// @access  Private (Admin only)
router.get("/settings", async (req, res) => {
  try {
    // This would typically come from a settings collection
    const settings = {
      siteName: "YegnaBet",
      currency: "ETB",
      supportedAreas: [
        "Bole",
        "Kazanchis",
        "Piazza",
        "CMC",
        "Old Airport",
        "Megenagna",
        "Gerji",
        "Sarbet",
      ],
      propertyTypes: [
        "Apartment",
        "Villa",
        "House",
        "Studio",
        "Penthouse",
        "Condo",
      ],
      amenities: [
        "WiFi",
        "Parking",
        "Security",
        "Generator",
        "Garden",
        "Water Tank",
        "Elevator",
        "Modern Kitchen",
        "Balcony",
        "Maid Quarter",
        "School Nearby",
        "Near Transport",
        "Historic Area",
        "Furnished",
        "City View",
      ],
      commissionRate: 10, // 10% commission
      maxImagesPerProperty: 10,
      maxFileSize: 5 * 1024 * 1024, // 5MB
      autoApprovalEnabled: false,
      maintenanceMode: false,
    };

    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server error fetching settings",
      code: "SETTINGS_FETCH_ERROR",
    });
  }
});

module.exports = router;
