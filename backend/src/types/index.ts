export type Role = 'seeker' | 'owner' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  role: Role;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type PropertyType = 'apartment' | 'house' | 'villa' | 'builder_floor' | 'studio' | 'plot' | 'other';
export type ListingType = 'buy' | 'rent';
export type FurnishingStatus = 'unfurnished' | 'semi_furnished' | 'fully_furnished';
export type Facing = 'north' | 'south' | 'east' | 'west' | 'north_east' | 'north_west' | 'south_east' | 'south_west';
export type Parking = 'none' | 'covered' | 'open' | 'both';
export type PropertyStatus = 'draft' | 'pending' | 'published' | 'featured' | 'unavailable' | 'sold' | 'rented' | 'rejected' | 'archived';

export interface Property {
  id: string;
  owner_id: string | null;
  title: string;
  description: string | null;
  property_type: PropertyType;
  listing_type: ListingType;
  price: number | null;
  monthly_rent: number | null;
  security_deposit: number | null;
  address: string;
  city: string;
  locality: string;
  landmark: string | null;
  latitude: number | null;
  longitude: number | null;
  bedrooms: number;
  bathrooms: number;
  balconies: number;
  floor_number: number | null;
  total_floors: number | null;
  carpet_area: number | null;
  built_up_area: number | null;
  furnishing_status: FurnishingStatus;
  property_age: number | null;
  facing: Facing | null;
  parking: Parking;
  availability_date: string | null;
  status: PropertyStatus;
  is_verified: boolean;
  cover_image_url: string | null;
  view_count: number;
  created_at: string;
  updated_at: string;
  // Joins
  owner?: Partial<User>;
  images?: PropertyImage[];
  amenities?: PropertyAmenity[];
}

export interface PropertyImage {
  id: string;
  property_id: string;
  url: string;
  caption: string | null;
  sort_order: number;
  created_at: string;
}

export interface PropertyAmenity {
  id: string;
  property_id: string;
  amenity: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  property_id: string;
  created_at: string;
}

export type LeadStatus = 'new' | 'contacted' | 'closed';
export type ContactType = 'phone' | 'whatsapp';

export interface Lead {
  id: string;
  property_id: string | null;
  user_id: string | null;
  owner_id: string | null;
  contact_type: ContactType;
  user_phone: string | null;
  user_name: string | null;
  status: LeadStatus;
  created_at: string;
  // Joins
  property?: Partial<Property>;
  seeker?: Partial<User>;
  owner?: Partial<User>;
}

export interface AdminStats {
  totalProperties: number;
  publishedProperties: number;
  pendingProperties: number;
  featuredProperties: number;
  soldProperties: number;
  rentedProperties: number;
  totalUsers: number;
  ownerCount: number;
  seekerCount: number;
  totalLeads: number;
  phoneLeads: number;
  whatsappLeads: number;
  newListingsThisWeek: number;
}
