// Mock data for the Ethiopian property management application - YegnaBet
export const currentUser = {
  id: 1,
  name: "Abebe Kebede",
  email: "abebe@yegnabet.com",
  role: "admin",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
};

export const mockProperties = [
  {
    id: 1,
    title: "Modern Apartment in Bole",
    location: "Bole, Addis Ababa",
    price: 25000,
    bedrooms: 2,
    bathrooms: 2,
    area: 120,
    type: "Apartment",
    status: "available",
    featured: true,
    rating: 4.8,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop"
    ],
    amenities: ["WiFi", "Parking", "Security", "Generator", "Water Tank", "Balcony"],
    description: "Beautiful modern apartment in the heart of Bole with stunning city views and premium amenities. Close to Bole International Airport and major shopping centers."
  },
  {
    id: 2,
    title: "Traditional Villa in Old Airport",
    location: "Old Airport, Addis Ababa",
    price: 45000,
    bedrooms: 4,
    bathrooms: 3,
    area: 250,
    type: "Villa",
    status: "available",
    featured: true,
    rating: 4.6,
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"
    ],
    amenities: ["Garden", "Parking", "WiFi", "Security", "Maid Quarter", "Generator"],
    description: "Spacious traditional villa with beautiful garden in Old Airport area. Perfect for families with compound and 24/7 security."
  },
  {
    id: 3,
    title: "Luxury Penthouse in Kazanchis",
    location: "Kazanchis, Addis Ababa",
    price: 80000,
    bedrooms: 3,
    bathrooms: 3,
    area: 200,
    type: "Penthouse",
    status: "available",
    featured: true,
    rating: 4.9,
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop"
    ],
    amenities: ["City View", "Elevator", "Parking", "Generator", "Water Tank", "Modern Kitchen"],
    description: "Exclusive penthouse with panoramic views of Addis Ababa, premium finishes, and world-class amenities in the business district."
  },
  {
    id: 4,
    title: "Cozy Studio in Piazza",
    location: "Piazza, Addis Ababa",
    price: 15000,
    bedrooms: 1,
    bathrooms: 1,
    area: 45,
    type: "Studio",
    status: "rented",
    featured: false,
    rating: 4.3,
    images: [
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&h=600&fit=crop"
    ],
    amenities: ["WiFi", "Furnished", "Near Transport", "Historic Area"],
    description: "Charming studio in the historic Piazza area, perfect for young professionals. Walking distance to cultural sites and restaurants."
  },
  {
    id: 5,
    title: "Family House in CMC",
    location: "CMC, Addis Ababa",
    price: 35000,
    bedrooms: 3,
    bathrooms: 2,
    area: 180,
    type: "House",
    status: "pending",
    featured: false,
    rating: 4.7,
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=800&h=600&fit=crop"
    ],
    amenities: ["Garden", "Parking", "Security", "School Nearby", "Generator"],
    description: "Perfect family house in CMC area with garden and excellent schools nearby. Safe neighborhood with 24/7 security."
  },
  {
    id: 6,
    title: "Executive Apartment in Megenagna",
    location: "Megenagna, Addis Ababa",
    price: 55000,
    bedrooms: 3,
    bathrooms: 2,
    area: 160,
    type: "Apartment",
    status: "available",
    featured: true,
    rating: 4.7,
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop"
    ],
    amenities: ["WiFi", "Parking", "Security", "Generator", "Elevator", "Modern Kitchen"],
    description: "Executive apartment in Megenagna with modern amenities and excellent connectivity to business districts."
  },
  {
    id: 7,
    title: "Spacious Villa in Gerji",
    location: "Gerji, Addis Ababa",
    price: 65000,
    bedrooms: 4,
    bathrooms: 3,
    area: 300,
    type: "Villa",
    status: "available",
    featured: false,
    rating: 4.8,
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop"
    ],
    amenities: ["Garden", "Parking", "Security", "Generator", "Water Tank", "Maid Quarter"],
    description: "Beautiful villa in Gerji area with spacious compound and premium security features."
  },
  {
    id: 8,
    title: "Modern Studio in Sarbet",
    location: "Sarbet, Addis Ababa",
    price: 18000,
    bedrooms: 1,
    bathrooms: 1,
    area: 50,
    type: "Studio",
    status: "rented",
    featured: false,
    rating: 4.4,
    images: [
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&h=600&fit=crop"
    ],
    amenities: ["WiFi", "Furnished", "Near Transport", "Security"],
    description: "Cozy studio apartment in Sarbet, perfect for young professionals working in the city center."
  }
];

export const mockBookings = [
  {
    id: 1,
    propertyId: 1,
    userId: 1,
    startDate: "2024-01-15",
    endDate: "2024-07-15",
    status: "confirmed",
    totalAmount: 150000,
    property: mockProperties[0]
  }
];

export const amenityIcons = {
  "WiFi": "Wifi",
  "Parking": "Car",
  "Security": "Shield",
  "Generator": "Zap",
  "Garden": "Trees",
  "Water Tank": "Droplets",
  "Elevator": "ArrowUp",
  "Modern Kitchen": "ChefHat",
  "Balcony": "Home",
  "Maid Quarter": "Users",
  "School Nearby": "GraduationCap",
  "Near Transport": "Bus",
  "Historic Area": "Landmark",
  "Furnished": "Sofa",
  "City View": "Eye"
};