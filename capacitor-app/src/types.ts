export type ListingType = 'buy' | 'rent'
export type PropertyType = 'apartment' | 'house' | 'villa' | 'builder_floor' | 'studio' | 'plot' | 'other'
export type PropertyStatus = 'draft' | 'pending' | 'published' | 'featured' | 'sold' | 'rented' | 'rejected' | 'archived'
export type FurnishingStatus = 'unfurnished' | 'semi_furnished' | 'fully_furnished'
export type UserRole = 'seeker' | 'owner' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  avatarUrl: string | null
  role: UserRole
  isVerified: boolean
}

export interface PropertyImage {
  id: string
  url: string
  caption?: string
  sortOrder: number
}

export interface Property {
  id: string
  title: string
  description?: string
  propertyType: PropertyType
  listingType: ListingType
  price?: number
  monthlyRent?: number
  securityDeposit?: number
  address: string
  city: string
  locality: string
  landmark?: string
  latitude?: number
  longitude?: number
  bedrooms: number
  bathrooms: number
  balconies?: number
  floorNumber?: number
  totalFloors?: number
  carpetArea?: number
  builtUpArea?: number
  furnishingStatus: FurnishingStatus
  propertyAge?: number
  facing?: string
  parking?: string
  availabilityDate?: string
  status: PropertyStatus
  isVerified: boolean
  coverImageUrl?: string
  images?: PropertyImage[]
  amenities?: string[]
  owner?: {
    id: string
    name: string
    phone?: string
    avatarUrl: string | null
    isVerified: boolean
  }
  viewCount?: number
  createdAt: string
  updatedAt: string
}

export interface SearchFilters {
  listingType?: ListingType
  city?: string
  locality?: string
  propertyType?: PropertyType[]
  minPrice?: number
  maxPrice?: number
  bedrooms?: number[]
  furnishing?: FurnishingStatus[]
  amenities?: string[]
  q?: string
}
