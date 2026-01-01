const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Property = require('../models/Property');
const Booking = require('../models/Booking');
require('dotenv').config();

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected for seeding');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

// Ethiopian property data
const ethiopianProperties = [
  {
    title: 'Modern Apartment in Bole',
    description: 'Beautiful modern apartment in the heart of Bole with stunning city views and premium amenities. Close to Bole International Airport and major shopping centers.',
    propertyType: 'Apartment',
    bedrooms: 2,
    bathrooms: 2,
    area: 120,
    location: {
      address: 'Bole Road, Addis Ababa',
      subcity: 'Bole',
      woreda: 'Woreda 03',
      kebele: 'Kebele 15',
      city: 'Addis Ababa',
      region: 'Addis Ababa',
      country: 'Ethiopia',
      coordinates: {
        latitude: 8.9806,
        longitude: 38.7578
      },
      nearbyPlaces: [
        { name: 'Bole International Airport', type: 'transport', distance: 2000 },
        { name: 'Edna Mall', type: 'mall', distance: 1500 }
      ]
    },
    pricing: {
      monthly: 25000,
      currency: 'ETB',
      deposit: 50000,
      serviceCharge: 2000,
      utilities: {
        electricity: false,
        water: true,
        internet: true
      },
      negotiable: false
    },
    amenities: ['WiFi', 'Parking', 'Security', 'Generator', 'Water Tank', 'Balcony'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
        publicId: 'yegnabet/properties/bole_apt_1',
        caption: 'Living Room',
        isPrimary: true
      }
    ],
    status: 'approved',
    availability: {
      isAvailable: true,
      availableFrom: new Date()
    },
    featured: true,
    rating: 4.8,
    reviewCount: 15
  },
  {
    title: 'Luxury Penthouse in Kazanchis',
    description: 'Exclusive penthouse with panoramic views of Addis Ababa, premium finishes, and world-class amenities in the business district.',
    propertyType: 'Penthouse',
    bedrooms: 3,
    bathrooms: 3,
    area: 200,
    location: {
      address: 'Kazanchis Business District, Addis Ababa',
      subcity: 'Kirkos',
      woreda: 'Woreda 08',
      kebele: 'Kebele 12',
      city: 'Addis Ababa',
      coordinates: {
        latitude: 9.0192,
        longitude: 38.7525
      },
      nearbyPlaces: [
        { name: 'UN Economic Commission for Africa', type: 'transport', distance: 500 },
        { name: 'Sheraton Addis', type: 'restaurant', distance: 800 }
      ]
    },
    pricing: {
      monthly: 80000,
      currency: 'ETB',
      deposit: 160000,
      serviceCharge: 5000,
      utilities: {
        electricity: false,
        water: true,
        internet: true
      },
      negotiable: true
    },
    amenities: ['City View', 'Elevator', 'Parking', 'Generator', 'Water Tank', 'Modern Kitchen'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
        publicId: 'yegnabet/properties/kazanchis_penthouse_1',
        caption: 'City View',
        isPrimary: true
      }
    ],
    status: 'approved',
    availability: {
      isAvailable: true,
      availableFrom: new Date()
    },
    featured: true,
    rating: 4.9,
    reviewCount: 8
  },
  {
    title: 'Traditional Villa in Old Airport',
    description: 'Spacious traditional villa with beautiful garden in Old Airport area. Perfect for families with compound and 24/7 security.',
    propertyType: 'Villa',
    bedrooms: 4,
    bathrooms: 3,
    area: 250,
    location: {
      address: 'Old Airport Area, Addis Ababa',
      subcity: 'Bole',
      woreda: 'Woreda 02',
      kebele: 'Kebele 08',
      city: 'Addis Ababa',
      coordinates: {
        latitude: 9.0084,
        longitude: 38.7575
      },
      nearbyPlaces: [
        { name: 'Bole Medhanialem Church', type: 'church', distance: 1000 },
        { name: 'Atlas Hotel', type: 'restaurant', distance: 1200 }
      ]
    },
    pricing: {
      monthly: 45000,
      currency: 'ETB',
      deposit: 90000,
      serviceCharge: 3000,
      utilities: {
        electricity: false,
        water: true,
        internet: false
      },
      negotiable: true
    },
    amenities: ['Garden', 'Parking', 'WiFi', 'Security', 'Maid Quarter', 'Generator'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop',
        publicId: 'yegnabet/properties/old_airport_villa_1',
        caption: 'Front View',
        isPrimary: true
      }
    ],
    status: 'approved',
    availability: {
      isAvailable: true,
      availableFrom: new Date()
    },
    featured: true,
    rating: 4.6,
    reviewCount: 12
  },
  {
    title: 'Cozy Studio in Piazza',
    description: 'Charming studio in the historic Piazza area, perfect for young professionals. Walking distance to cultural sites and restaurants.',
    propertyType: 'Studio',
    bedrooms: 1,
    bathrooms: 1,
    area: 45,
    location: {
      address: 'Piazza, Addis Ababa',
      subcity: 'Arada',
      woreda: 'Woreda 01',
      kebele: 'Kebele 05',
      city: 'Addis Ababa',
      coordinates: {
        latitude: 9.0348,
        longitude: 38.7297
      },
      nearbyPlaces: [
        { name: 'St. George Cathedral', type: 'church', distance: 300 },
        { name: 'Addis Ababa Museum', type: 'transport', distance: 500 }
      ]
    },
    pricing: {
      monthly: 15000,
      currency: 'ETB',
      deposit: 30000,
      serviceCharge: 1000,
      utilities: {
        electricity: false,
        water: true,
        internet: true
      },
      negotiable: false
    },
    amenities: ['WiFi', 'Furnished', 'Near Transport', 'Historic Area'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&h=600&fit=crop',
        publicId: 'yegnabet/properties/piazza_studio_1',
        caption: 'Studio Interior',
        isPrimary: true
      }
    ],
    status: 'rented',
    availability: {
      isAvailable: false,
      availableFrom: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Available in 30 days
    },
    featured: false,
    rating: 4.3,
    reviewCount: 6
  },
  {
    title: 'Family House in CMC',
    description: 'Perfect family house in CMC area with garden and excellent schools nearby. Safe neighborhood with 24/7 security.',
    propertyType: 'House',
    bedrooms: 3,
    bathrooms: 2,
    area: 180,
    location: {
      address: 'CMC Area, Addis Ababa',
      subcity: 'Yeka',
      woreda: 'Woreda 07',
      kebele: 'Kebele 18',
      city: 'Addis Ababa',
      coordinates: {
        latitude: 9.0458,
        longitude: 38.7614
      },
      nearbyPlaces: [
        { name: 'CMC Hospital', type: 'hospital', distance: 800 },
        { name: 'International Community School', type: 'school', distance: 1200 }
      ]
    },
    pricing: {
      monthly: 35000,
      currency: 'ETB',
      deposit: 70000,
      serviceCharge: 2500,
      utilities: {
        electricity: false,
        water: true,
        internet: false
      },
      negotiable: true
    },
    amenities: ['Garden', 'Parking', 'Security', 'School Nearby', 'Generator'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
        publicId: 'yegnabet/properties/cmc_house_1',
        caption: 'House Exterior',
        isPrimary: true
      }
    ],
    status: 'pending',
    availability: {
      isAvailable: true,
      availableFrom: new Date()
    },
    featured: false,
    rating: 4.7,
    reviewCount: 9
  }
];

// Ethiopian users data
const ethiopianUsers = [
  {
    firstName: 'Abebe',
    lastName: 'Kebede',
    email: 'abebe@yegnabet.com',
    password: 'Password123',
    role: 'admin',
    phone: '+251911123456',
    status: 'active',
    location: {
      city: 'Addis Ababa',
      country: 'Ethiopia'
    },
    isVerified: true
  },
  {
    firstName: 'Sara',
    lastName: 'Alemayehu',
    email: 'sara@example.com',
    password: 'Password123',
    role: 'user',
    phone: '+251922234567',
    status: 'active',
    location: {
      city: 'Addis Ababa',
      country: 'Ethiopia'
    },
    isVerified: true
  },
  {
    firstName: 'Natnael',
    lastName: 'Zemene',
    email: 'natnaelzemene21@gmail.com',
    password: 'Password123',
    role: 'owner',
    phone: '+251933345678',
    status: 'active',
    location: {
      city: 'Addis Ababa',
      country: 'Ethiopia'
    },
    isVerified: true
  },
  {
    firstName: 'Hanan',
    lastName: 'Mohammed',
    email: 'hanan@example.com',
    password: 'Password123',
    role: 'user',
    phone: '+251944456789',
    status: 'active',
    location: {
      city: 'Addis Ababa',
      country: 'Ethiopia'
    },
    isVerified: true
  },
  {
    firstName: 'Michael',
    lastName: 'Haile',
    email: 'michael@example.com',
    password: 'Password123',
    role: 'user',
    phone: '+251955567890',
    status: 'active',
    location: {
      city: 'Addis Ababa',
      country: 'Ethiopia'
    },
    isVerified: true
  }
];

// Seed function
const seedData = async () => {
  try {
    console.log('🌱 Starting data seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Property.deleteMany({});
    await Booking.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create users
    const users = [];
    for (const userData of ethiopianUsers) {
      // Don't hash password here - let the User model pre-save middleware handle it
      const user = await User.create({
        ...userData
      });
      users.push(user);
    }
    console.log(`👥 Created ${users.length} users`);

    // Create properties
    const properties = [];
    const ownerUser = users.find(u => u.role === 'owner');
    const adminUser = users.find(u => u.role === 'admin');

    for (const propertyData of ethiopianProperties) {
      const property = await Property.create({
        ...propertyData,
        owner: ownerUser._id,
        createdBy: adminUser._id
      });
      properties.push(property);
    }
    console.log(`🏠 Created ${properties.length} properties`);

    // Create sample bookings
    const regularUsers = users.filter(u => u.role === 'user');
    const availableProperties = properties.filter(p => p.status === 'approved' && p.availability.isAvailable);

    console.log(`👥 Regular users: ${regularUsers.length}`);
    console.log(`🏠 Available properties: ${availableProperties.length}`);

    const bookings = [];
    for (let i = 0; i < 3; i++) {
      const user = regularUsers[i % regularUsers.length];
      const property = availableProperties[i % availableProperties.length];
      
      const checkIn = new Date();
      checkIn.setDate(checkIn.getDate() + (i * 30) + 10);
      
      const checkOut = new Date(checkIn);
      checkOut.setDate(checkOut.getDate() + 7);

      const booking = await Booking.create({
        property: property._id,
        user: user._id,
        checkIn,
        checkOut,
        guests: {
          adults: 2,
          children: 0
        },
        totalAmount: property.pricing.monthly + Math.round(property.pricing.monthly * 0.005),
        currency: 'ETB',
        priceBreakdown: {
          basePrice: property.pricing.monthly,
          months: 1,
          serviceFee: Math.round(property.pricing.monthly * 0.005),
          cleaningFee: 0,
          taxes: 0,
          discount: 0
        },
        status: i === 0 ? 'confirmed' : i === 1 ? 'pending' : 'completed',
        paymentStatus: i === 2 ? 'paid' : 'pending',
        paymentMethod: 'chapa',
        guestDetails: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          nationality: 'Ethiopian'
        },
        specialRequests: 'Please provide extra towels'
      });
      bookings.push(booking);
    }
    console.log(`📅 Created ${bookings.length} bookings`);

    console.log('✅ Data seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Users: ${users.length}`);
    console.log(`   Properties: ${properties.length}`);
    console.log(`   Bookings: ${bookings.length}`);
    console.log('\n🔐 Admin Login:');
    console.log(`   Email: ${ethiopianUsers[0].email}`);
    console.log(`   Password: ${ethiopianUsers[0].password}`);
    console.log('\n🏠 Ethiopian Properties Created:');
    properties.forEach(p => {
      console.log(`   - ${p.title} (${p.location.subcity}) - ETB ${p.pricing.monthly.toLocaleString()}`);
    });

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    mongoose.connection.close();
    console.log('👋 Database connection closed');
  }
};

// Run seeding
const runSeed = async () => {
  await connectDB();
  await seedData();
};

// Check if script is run directly
if (require.main === module) {
  runSeed();
}

module.exports = { seedData, ethiopianProperties, ethiopianUsers };