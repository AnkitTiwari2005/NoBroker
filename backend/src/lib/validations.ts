import { z } from 'zod';

export const propertySchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().optional(),
  property_type: z.enum(['apartment', 'house', 'villa', 'builder_floor', 'studio', 'plot', 'other']),
  listing_type: z.enum(['buy', 'rent']),
  price: z.number().nullable().optional(),
  monthly_rent: z.number().nullable().optional(),
  security_deposit: z.number().nullable().optional(),
  address: z.string().min(10, "Full address is required"),
  city: z.string().min(2, "City is required"),
  locality: z.string().min(2, "Locality is required"),
  landmark: z.string().optional(),
  bedrooms: z.number().min(0).default(0),
  bathrooms: z.number().min(0).default(0),
  balconies: z.number().min(0).default(0),
  floor_number: z.number().nullable().optional(),
  total_floors: z.number().nullable().optional(),
  carpet_area: z.number().nullable().optional(),
  built_up_area: z.number().nullable().optional(),
  furnishing_status: z.enum(['unfurnished', 'semi_furnished', 'fully_furnished']).default('unfurnished'),
  property_age: z.number().nullable().optional(),
  facing: z.enum(['north', 'south', 'east', 'west', 'north_east', 'north_west', 'south_east', 'south_west']).nullable().optional(),
  parking: z.enum(['none', 'covered', 'open', 'both']).default('none'),
  status: z.enum(['draft', 'pending', 'published', 'featured', 'unavailable', 'sold', 'rented', 'rejected', 'archived']).default('pending'),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
