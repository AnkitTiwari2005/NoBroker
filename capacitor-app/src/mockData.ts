// ─── Mock Data Layer ─────────────────────────────────────────────────────────
// All data is fabricated for demo/testing. No real backend needed.
// Test credentials: demo@nobroker.com / Demo@123

import type { Property, User } from './types'

export const DEMO_USER: User = {
  id: 'demo-user-001',
  name: 'Rahul Mehta',
  email: 'demo@nobroker.com',
  phone: '+91 98765 43210',
  role: 'seeker',
  avatarUrl: null,
  isVerified: true,
}

export const DEMO_OWNER: User = {
  id: 'demo-owner-001',
  name: 'Priya Sharma',
  email: 'owner@nobroker.com',
  phone: '+91 99887 76655',
  role: 'owner',
  avatarUrl: null,
  isVerified: true, // admin-approved seller
}

// ─── 20 Realistic Indian Properties ──────────────────────────────────────────
export const MOCK_PROPERTIES: Property[] = [
  {
    id: 'prop-001',
    title: 'Luxurious 3 BHK in Koramangala',
    description: 'Stunning 3 BHK apartment in the heart of Koramangala with modern amenities and excellent connectivity. Features premium interiors, modular kitchen, and breathtaking city views. Located just 2 km from Forum Mall and 5 minutes from Koramangala 1st Block. The apartment is fully furnished with high-end appliances including AC in all bedrooms, a premium kitchen chimney, and smart home features.',
    propertyType: 'apartment',
    listingType: 'rent',
    monthlyRent: 55000,
    securityDeposit: 110000,
    address: '3rd Block, Koramangala, Bangalore',
    city: 'Bangalore',
    locality: 'Koramangala',
    landmark: 'Forum Mall',
    bedrooms: 3,
    bathrooms: 2,
    balconies: 2,
    floorNumber: 5,
    totalFloors: 12,
    carpetArea: 1450,
    builtUpArea: 1650,
    furnishingStatus: 'fully_furnished',
    propertyAge: 2,
    facing: 'east',
    parking: 'covered',
    status: 'published',
    isVerified: true,
    coverImageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop',
    images: [
      { id: 'img-001-1', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop', sortOrder: 0 },
      { id: 'img-001-2', url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop', sortOrder: 1 },
      { id: 'img-001-3', url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&auto=format&fit=crop', sortOrder: 2 },
    ],
    amenities: ['gym', 'pool', 'security', 'lift', 'power_backup', 'clubhouse'],
    owner: { id: 'owner-001', name: 'Amit Verma', phone: '+91 98765 11223', isVerified: true, avatarUrl: null },
    viewCount: 342,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'prop-002',
    title: 'Modern 2 BHK in Indiranagar',
    description: 'Beautifully designed 2 BHK in premium Indiranagar location. Walking distance to 100 Feet Road restaurants and CMH Road metro station. Recently renovated with high-quality fixtures and contemporary design.',
    propertyType: 'apartment',
    listingType: 'rent',
    monthlyRent: 38000,
    securityDeposit: 76000,
    address: 'HAL 2nd Stage, Indiranagar, Bangalore',
    city: 'Bangalore',
    locality: 'Indiranagar',
    landmark: '100 Feet Road',
    bedrooms: 2,
    bathrooms: 2,
    balconies: 1,
    floorNumber: 3,
    totalFloors: 8,
    carpetArea: 1100,
    builtUpArea: 1250,
    furnishingStatus: 'semi_furnished',
    propertyAge: 4,
    facing: 'north',
    parking: 'open',
    status: 'published',
    isVerified: true,
    coverImageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop',
    images: [
      { id: 'img-002-1', url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop', sortOrder: 0 },
      { id: 'img-002-2', url: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&auto=format&fit=crop', sortOrder: 1 },
    ],
    amenities: ['security', 'lift', 'wifi', 'power_backup'],
    owner: { id: 'owner-002', name: 'Sneha Patel', phone: '+91 99001 22334', isVerified: false, avatarUrl: null },
    viewCount: 189,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'prop-003',
    title: 'Premium 4 BHK Villa in Whitefield',
    description: 'Exquisite independent villa in gated community with private garden, swimming pool access, and 24x7 security. Perfect for families. Close to ITPL and Whitefield railway station. Comes with 4 covered parking spots and dedicated servant quarters.',
    propertyType: 'villa',
    listingType: 'buy',
    price: 28500000,
    address: 'Prestige Shantiniketan, Whitefield, Bangalore',
    city: 'Bangalore',
    locality: 'Whitefield',
    landmark: 'ITPL',
    bedrooms: 4,
    bathrooms: 4,
    balconies: 3,
    floorNumber: 1,
    totalFloors: 2,
    carpetArea: 3200,
    builtUpArea: 3800,
    furnishingStatus: 'fully_furnished',
    propertyAge: 3,
    facing: 'north_east',
    parking: 'both',
    status: 'featured',
    isVerified: true,
    coverImageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop',
    images: [
      { id: 'img-003-1', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop', sortOrder: 0 },
      { id: 'img-003-2', url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop', sortOrder: 1 },
      { id: 'img-003-3', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop', sortOrder: 2 },
    ],
    amenities: ['gym', 'pool', 'security', 'clubhouse', 'garden', 'power_backup', 'cctv'],
    owner: { id: 'owner-003', name: 'Rajesh Kumar', phone: '+91 98800 55667', isVerified: true, avatarUrl: null },
    viewCount: 567,
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'prop-004',
    title: 'Spacious 3 BHK in HSR Layout',
    description: 'Well-maintained 3 BHK flat in prime HSR Layout location. Vastu-compliant, great ventilation, and ample natural light. Close to Agara Lake and all essential amenities including top schools and hospitals.',
    propertyType: 'apartment',
    listingType: 'buy',
    price: 12500000,
    address: 'Sector 2, HSR Layout, Bangalore',
    city: 'Bangalore',
    locality: 'HSR Layout',
    landmark: 'Agara Lake',
    bedrooms: 3,
    bathrooms: 3,
    balconies: 2,
    floorNumber: 7,
    totalFloors: 15,
    carpetArea: 1580,
    builtUpArea: 1800,
    furnishingStatus: 'semi_furnished',
    propertyAge: 5,
    facing: 'south',
    parking: 'covered',
    status: 'published',
    isVerified: false,
    coverImageUrl: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&auto=format&fit=crop',
    images: [
      { id: 'img-004-1', url: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&auto=format&fit=crop', sortOrder: 0 },
      { id: 'img-004-2', url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&auto=format&fit=crop', sortOrder: 1 },
    ],
    amenities: ['gym', 'security', 'lift', 'power_backup'],
    owner: { id: 'owner-004', name: 'Kavitha Rao', phone: '+91 97700 44556', isVerified: false, avatarUrl: null },
    viewCount: 234,
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'prop-005',
    title: 'Cozy Studio near Electronic City',
    description: 'Compact and efficient studio apartment perfect for IT professionals. 5-minute drive to Infosys and Wipro campuses. Fully furnished with all appliances including washing machine, refrigerator, and high-speed WiFi.',
    propertyType: 'studio',
    listingType: 'rent',
    monthlyRent: 18000,
    securityDeposit: 36000,
    address: 'Phase 1, Electronic City, Bangalore',
    city: 'Bangalore',
    locality: 'Electronic City',
    landmark: 'Infosys Campus',
    bedrooms: 1,
    bathrooms: 1,
    balconies: 0,
    floorNumber: 2,
    totalFloors: 6,
    carpetArea: 480,
    builtUpArea: 550,
    furnishingStatus: 'fully_furnished',
    propertyAge: 1,
    facing: 'east',
    parking: 'none',
    status: 'published',
    isVerified: true,
    coverImageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop',
    images: [
      { id: 'img-005-1', url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop', sortOrder: 0 },
    ],
    amenities: ['wifi', 'security', 'power_backup'],
    owner: { id: 'owner-005', name: 'Arun Nair', phone: '+91 96600 33445', isVerified: true, avatarUrl: null },
    viewCount: 412,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'prop-006',
    title: 'Sea-View 2 BHK in Bandra West',
    description: 'Rare sea-facing 2 BHK apartment in the most sought-after Bandra West location. Stunning Arabian Sea views from the living room. Walking distance to Bandstand and Carter Road promenade.',
    propertyType: 'apartment',
    listingType: 'rent',
    monthlyRent: 75000,
    securityDeposit: 150000,
    address: 'Turner Road, Bandra West, Mumbai',
    city: 'Mumbai',
    locality: 'Bandra West',
    landmark: 'Bandstand',
    bedrooms: 2,
    bathrooms: 2,
    balconies: 1,
    floorNumber: 8,
    totalFloors: 16,
    carpetArea: 950,
    builtUpArea: 1100,
    furnishingStatus: 'fully_furnished',
    propertyAge: 6,
    facing: 'west',
    parking: 'covered',
    status: 'featured',
    isVerified: true,
    coverImageUrl: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&auto=format&fit=crop',
    images: [
      { id: 'img-006-1', url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&auto=format&fit=crop', sortOrder: 0 },
      { id: 'img-006-2', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop', sortOrder: 1 },
      { id: 'img-006-3', url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop', sortOrder: 2 },
    ],
    amenities: ['gym', 'security', 'lift', 'power_backup', 'intercom'],
    owner: { id: 'owner-006', name: 'Deepak Shah', phone: '+91 98900 77889', isVerified: true, avatarUrl: null },
    viewCount: 678,
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'prop-007',
    title: 'Luxury Penthouse in Juhu',
    description: 'One-of-a-kind penthouse in Juhu with private terrace, plunge pool, and panoramic sea views. Fully furnished with designer interiors and premium appliances. This is the most exclusive listing in Mumbai.',
    propertyType: 'apartment',
    listingType: 'buy',
    price: 95000000,
    address: 'Juhu Tara Road, Juhu, Mumbai',
    city: 'Mumbai',
    locality: 'Juhu',
    landmark: 'Juhu Beach',
    bedrooms: 4,
    bathrooms: 4,
    balconies: 2,
    floorNumber: 14,
    totalFloors: 14,
    carpetArea: 4200,
    builtUpArea: 5000,
    furnishingStatus: 'fully_furnished',
    propertyAge: 4,
    facing: 'west',
    parking: 'both',
    status: 'featured',
    isVerified: true,
    coverImageUrl: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&auto=format&fit=crop',
    images: [
      { id: 'img-007-1', url: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&auto=format&fit=crop', sortOrder: 0 },
      { id: 'img-007-2', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop', sortOrder: 1 },
      { id: 'img-007-3', url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop', sortOrder: 2 },
    ],
    amenities: ['gym', 'pool', 'security', 'lift', 'power_backup', 'clubhouse'],
    owner: { id: 'owner-007', name: 'Vikram Malhotra', phone: '+91 99500 66778', isVerified: true, avatarUrl: null },
    viewCount: 1205,
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'prop-008',
    title: '3 BHK Builder Floor in Hauz Khas',
    description: 'Independent builder floor in the artistic Hauz Khas Village area. Private terrace, dedicated parking. Walking distance to Hauz Khas Lake and Metro Station. Surrounded by top cafes, galleries, and restaurants.',
    propertyType: 'builder_floor',
    listingType: 'rent',
    monthlyRent: 65000,
    securityDeposit: 130000,
    address: 'Hauz Khas Village, South Delhi',
    city: 'Delhi',
    locality: 'Hauz Khas',
    landmark: 'Hauz Khas Lake',
    bedrooms: 3,
    bathrooms: 3,
    balconies: 1,
    floorNumber: 2,
    totalFloors: 4,
    carpetArea: 1800,
    builtUpArea: 2100,
    furnishingStatus: 'fully_furnished',
    propertyAge: 8,
    facing: 'north',
    parking: 'covered',
    status: 'published',
    isVerified: true,
    coverImageUrl: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&auto=format&fit=crop',
    images: [
      { id: 'img-008-1', url: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&auto=format&fit=crop', sortOrder: 0 },
      { id: 'img-008-2', url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop', sortOrder: 1 },
    ],
    amenities: ['security', 'garden', 'power_backup'],
    owner: { id: 'owner-008', name: 'Ananya Singh', phone: '+91 97800 22334', isVerified: false, avatarUrl: null },
    viewCount: 298,
    createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    id: 'prop-009',
    title: 'Premium 3 BHK in Jubilee Hills',
    description: 'Sophisticated 3 BHK in Hyderabad\'s premier Jubilee Hills. Walking distance to Road No.36 restaurants and entertainment zone. Gated community with 24x7 security and dedicated children\'s play area.',
    propertyType: 'apartment',
    listingType: 'buy',
    price: 18000000,
    address: 'Road No. 36, Jubilee Hills, Hyderabad',
    city: 'Hyderabad',
    locality: 'Jubilee Hills',
    landmark: 'KBR National Park',
    bedrooms: 3,
    bathrooms: 3,
    balconies: 2,
    floorNumber: 5,
    totalFloors: 10,
    carpetArea: 1750,
    builtUpArea: 2000,
    furnishingStatus: 'fully_furnished',
    propertyAge: 2,
    facing: 'east',
    parking: 'covered',
    status: 'featured',
    isVerified: true,
    coverImageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop',
    images: [
      { id: 'img-009-1', url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop', sortOrder: 0 },
      { id: 'img-009-2', url: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&auto=format&fit=crop', sortOrder: 1 },
    ],
    amenities: ['gym', 'pool', 'security', 'lift', 'power_backup'],
    owner: { id: 'owner-009', name: 'Suresh Reddy', phone: '+91 96600 11223', isVerified: true, avatarUrl: null },
    viewCount: 445,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'prop-010',
    title: 'Luxury Villa in Banjara Hills',
    description: 'Architectural masterpiece villa in Banjara Hills with private pool, home theatre, and lush garden. Premium finishes throughout. One of Hyderabad\'s most prestigious addresses.',
    propertyType: 'villa',
    listingType: 'buy',
    price: 75000000,
    address: 'Road No. 12, Banjara Hills, Hyderabad',
    city: 'Hyderabad',
    locality: 'Banjara Hills',
    landmark: 'GVK One Mall',
    bedrooms: 5,
    bathrooms: 5,
    balconies: 3,
    floorNumber: 1,
    totalFloors: 2,
    carpetArea: 5500,
    builtUpArea: 6800,
    furnishingStatus: 'fully_furnished',
    propertyAge: 1,
    facing: 'north',
    parking: 'both',
    status: 'published',
    isVerified: true,
    coverImageUrl: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&auto=format&fit=crop',
    images: [
      { id: 'img-010-1', url: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&auto=format&fit=crop', sortOrder: 0 },
      { id: 'img-010-2', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop', sortOrder: 1 },
    ],
    amenities: ['gym', 'pool', 'security', 'clubhouse', 'garden', 'power_backup', 'cctv'],
    owner: { id: 'owner-010', name: 'Naresh Babu', phone: '+91 98700 99001', isVerified: true, avatarUrl: null },
    viewCount: 890,
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: 'prop-011',
    title: '2 BHK near Besant Nagar Beach',
    description: 'Charming 2 BHK apartment walking distance from Besant Nagar (Elliot Beach). Great sea breeze and community feel. Perfect for families and professionals. Newly painted with modern fittings.',
    propertyType: 'apartment',
    listingType: 'rent',
    monthlyRent: 28000,
    securityDeposit: 56000,
    address: 'Besant Nagar, Chennai',
    city: 'Chennai',
    locality: 'Besant Nagar',
    landmark: 'Elliot Beach',
    bedrooms: 2,
    bathrooms: 2,
    balconies: 1,
    floorNumber: 2,
    totalFloors: 5,
    carpetArea: 950,
    builtUpArea: 1100,
    furnishingStatus: 'semi_furnished',
    propertyAge: 7,
    facing: 'south_east',
    parking: 'covered',
    status: 'published',
    isVerified: false,
    coverImageUrl: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&auto=format&fit=crop',
    images: [
      { id: 'img-011-1', url: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&auto=format&fit=crop', sortOrder: 0 },
    ],
    amenities: ['security', 'lift', 'power_backup'],
    owner: { id: 'owner-011', name: 'Karthik Rajan', phone: '+91 95500 44556', isVerified: false, avatarUrl: null },
    viewCount: 156,
    createdAt: new Date(Date.now() - 11 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 86400000).toISOString(),
  },
  {
    id: 'prop-012',
    title: 'Penthouse in Koregaon Park, Pune',
    description: 'Exquisite penthouse in Pune\'s prime Koregaon Park with rooftop terrace and city views. Walking distance to Osho Ashram and top restaurants on Lane 5. Designer interiors with Italian marble flooring.',
    propertyType: 'apartment',
    listingType: 'buy',
    price: 35000000,
    address: 'Lane 5, Koregaon Park, Pune',
    city: 'Pune',
    locality: 'Koregaon Park',
    landmark: 'Osho Ashram',
    bedrooms: 4,
    bathrooms: 4,
    balconies: 2,
    floorNumber: 8,
    totalFloors: 8,
    carpetArea: 3200,
    builtUpArea: 3800,
    furnishingStatus: 'fully_furnished',
    propertyAge: 3,
    facing: 'north',
    parking: 'both',
    status: 'featured',
    isVerified: true,
    coverImageUrl: 'https://images.unsplash.com/photo-1615873968403-89e068629265?w=800&auto=format&fit=crop',
    images: [
      { id: 'img-012-1', url: 'https://images.unsplash.com/photo-1615873968403-89e068629265?w=800&auto=format&fit=crop', sortOrder: 0 },
      { id: 'img-012-2', url: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&auto=format&fit=crop', sortOrder: 1 },
    ],
    amenities: ['gym', 'pool', 'security', 'lift', 'power_backup', 'clubhouse'],
    owner: { id: 'owner-012', name: 'Rohan Joshi', phone: '+91 97700 88990', isVerified: true, avatarUrl: null },
    viewCount: 723,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'prop-013',
    title: '4 BHK Independent House in Vasant Kunj',
    description: 'Elegant independent house in Vasant Kunj with servant quarters, manicured garden, and basement parking. Quiet residential area close to DLF Promenade Mall and Ambience Mall.',
    propertyType: 'house',
    listingType: 'buy',
    price: 45000000,
    address: 'Block C, Vasant Kunj, New Delhi',
    city: 'Delhi',
    locality: 'Vasant Kunj',
    landmark: 'DLF Promenade',
    bedrooms: 4,
    bathrooms: 4,
    balconies: 2,
    floorNumber: 1,
    totalFloors: 2,
    carpetArea: 3500,
    builtUpArea: 4200,
    furnishingStatus: 'fully_furnished',
    propertyAge: 10,
    facing: 'south',
    parking: 'both',
    status: 'published',
    isVerified: false,
    coverImageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&auto=format&fit=crop',
    images: [
      { id: 'img-013-1', url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&auto=format&fit=crop', sortOrder: 0 },
    ],
    amenities: ['security', 'garden', 'power_backup'],
    owner: { id: 'owner-013', name: 'Pooja Gupta', phone: '+91 98800 77665', isVerified: false, avatarUrl: null },
    viewCount: 312,
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 86400000).toISOString(),
  },
  {
    id: 'prop-014',
    title: '2 BHK in Gachibowli IT Hub',
    description: 'Modern 2 BHK apartment in Gachibowli, minutes from major IT companies like Google, Microsoft, and Amazon. Ideal for tech professionals seeking proximity to work with top amenities.',
    propertyType: 'apartment',
    listingType: 'rent',
    monthlyRent: 32000,
    securityDeposit: 64000,
    address: 'DLF Cyber City, Gachibowli, Hyderabad',
    city: 'Hyderabad',
    locality: 'Gachibowli',
    landmark: 'DLF Cyber City',
    bedrooms: 2,
    bathrooms: 2,
    balconies: 1,
    floorNumber: 6,
    totalFloors: 12,
    carpetArea: 1050,
    builtUpArea: 1200,
    furnishingStatus: 'semi_furnished',
    propertyAge: 3,
    facing: 'west',
    parking: 'covered',
    status: 'published',
    isVerified: false,
    coverImageUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&auto=format&fit=crop',
    images: [
      { id: 'img-014-1', url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&auto=format&fit=crop', sortOrder: 0 },
    ],
    amenities: ['gym', 'security', 'lift', 'power_backup'],
    owner: { id: 'owner-014', name: 'Srinivas Reddy', phone: '+91 95500 22334', isVerified: false, avatarUrl: null },
    viewCount: 201,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'prop-015',
    title: 'Residential Plot in Sarjapur',
    description: 'Excellent residential plot in rapidly developing Sarjapur area. BBMP approved layout with all utilities. Great investment opportunity near upcoming metro corridor and Amazon campus.',
    propertyType: 'plot',
    listingType: 'buy',
    price: 8500000,
    address: 'Sarjapur Road, Bangalore',
    city: 'Bangalore',
    locality: 'Sarjapur',
    landmark: 'Amazon Campus',
    bedrooms: 0,
    bathrooms: 0,
    carpetArea: 2400,
    furnishingStatus: 'unfurnished',
    propertyAge: 0,
    parking: 'none',
    status: 'published',
    isVerified: false,
    coverImageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop',
    images: [
      { id: 'img-015-1', url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop', sortOrder: 0 },
    ],
    amenities: [],
    owner: { id: 'owner-015', name: 'Girish Naidu', phone: '+91 98100 55443', isVerified: false, avatarUrl: null },
    viewCount: 178,
    createdAt: new Date(Date.now() - 18 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 86400000).toISOString(),
  },
]

// Featured properties
export const FEATURED_PROPERTIES = MOCK_PROPERTIES.filter(p => p.status === 'featured')

// Get similar properties
export const getSimilarProperties = (property: Property): Property[] => {
  return MOCK_PROPERTIES
    .filter(p => p.id !== property.id && p.city === property.city && p.listingType === property.listingType)
    .slice(0, 5)
}

// Filter properties — handles all SearchFilter fields + freeform query
export const filterProperties = (filters: Record<string, unknown>): Property[] => {
  let results = [...MOCK_PROPERTIES]

  // listing type
  if (filters.listingType) {
    results = results.filter(p => p.listingType === filters.listingType)
  }

  // city
  if (filters.city) {
    results = results.filter(p =>
      p.city.toLowerCase().includes((filters.city as string).toLowerCase())
    )
  }

  // text query (searches title, city, locality, landmark, description)
  const rawQ = (filters.q || filters.query || '') as string
  if (rawQ.trim()) {
    const q = rawQ.trim().toLowerCase()
    results = results.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.city.toLowerCase().includes(q) ||
      p.locality.toLowerCase().includes(q) ||
      (p.landmark || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q) ||
      p.propertyType.toLowerCase().includes(q)
    )
  }

  // bedrooms — accepts number[]
  if (filters.bedrooms && (filters.bedrooms as number[]).length > 0) {
    results = results.filter(p => (filters.bedrooms as number[]).includes(p.bedrooms))
  }

  // propertyType — accepts string[]
  if (filters.propertyType && (filters.propertyType as string[]).length > 0) {
    results = results.filter(p =>
      (filters.propertyType as string[]).includes(p.propertyType)
    )
  }

  // price range
  if (filters.minPrice) {
    const min = filters.minPrice as number
    results = results.filter(p => {
      const val = p.listingType === 'rent' ? (p.monthlyRent || 0) : (p.price || 0)
      return val >= min
    })
  }
  if (filters.maxPrice) {
    const max = filters.maxPrice as number
    results = results.filter(p => {
      const val = p.listingType === 'rent' ? (p.monthlyRent || 0) : (p.price || 0)
      return val <= max
    })
  }

  // furnishing
  if (filters.furnishing && (filters.furnishing as string[]).length > 0) {
    results = results.filter(p =>
      (filters.furnishing as string[]).includes(p.furnishingStatus)
    )
  }

  // sort
  const sort = filters.sort as string | undefined
  if (sort === 'price_asc') {
    results.sort((a, b) => {
      const aP = a.listingType === 'rent' ? (a.monthlyRent || 0) : (a.price || 0)
      const bP = b.listingType === 'rent' ? (b.monthlyRent || 0) : (b.price || 0)
      return aP - bP
    })
  } else if (sort === 'price_desc') {
    results.sort((a, b) => {
      const aP = a.listingType === 'rent' ? (a.monthlyRent || 0) : (a.price || 0)
      const bP = b.listingType === 'rent' ? (b.monthlyRent || 0) : (b.price || 0)
      return bP - aP
    })
  } else if (sort === 'area_desc') {
    results.sort((a, b) => (b.carpetArea || 0) - (a.carpetArea || 0))
  } else {
    // default: newest first
    results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  return results
}

// Cities data
export const CITIES = [
  { name: 'Bangalore', count: 1842, image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=400&auto=format&fit=crop' },
  { name: 'Mumbai',    count: 2341, image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=400&auto=format&fit=crop' },
  { name: 'Delhi',     count: 1965, image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&auto=format&fit=crop' },
  { name: 'Hyderabad', count: 1234, image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&auto=format&fit=crop' },
  { name: 'Chennai',   count:  987, image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&auto=format&fit=crop' },
  { name: 'Pune',      count:  876, image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&auto=format&fit=crop' },
]
