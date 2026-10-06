-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'seeker' CHECK (role IN ('seeker', 'owner', 'admin')),
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PROPERTIES table
CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  property_type TEXT NOT NULL CHECK (property_type IN ('apartment','house','villa','builder_floor','studio','plot','other')),
  listing_type TEXT NOT NULL CHECK (listing_type IN ('buy','rent')),
  price BIGINT,
  monthly_rent BIGINT,
  security_deposit BIGINT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  locality TEXT NOT NULL,
  landmark TEXT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  bedrooms INTEGER DEFAULT 0,
  bathrooms INTEGER DEFAULT 0,
  balconies INTEGER DEFAULT 0,
  floor_number INTEGER,
  total_floors INTEGER,
  carpet_area DECIMAL(10,2),
  built_up_area DECIMAL(10,2),
  furnishing_status TEXT DEFAULT 'unfurnished' CHECK (furnishing_status IN ('unfurnished','semi_furnished','fully_furnished')),
  property_age INTEGER,
  facing TEXT CHECK (facing IN ('north','south','east','west','north_east','north_west','south_east','south_west')),
  parking TEXT DEFAULT 'none' CHECK (parking IN ('none','covered','open','both')),
  availability_date DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('draft','pending','published','featured','unavailable','sold','rented','rejected','archived')),
  is_verified BOOLEAN DEFAULT FALSE,
  cover_image_url TEXT,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PROPERTY IMAGES
CREATE TABLE public.property_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  caption TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PROPERTY AMENITIES
CREATE TABLE public.property_amenities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  amenity TEXT NOT NULL
);

-- FAVORITES
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, property_id)
);

-- LEADS
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  owner_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  contact_type TEXT NOT NULL CHECK (contact_type IN ('phone','whatsapp')),
  user_phone TEXT,
  user_name TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new','contacted','closed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX idx_properties_city ON public.properties(city);
CREATE INDEX idx_properties_listing_type ON public.properties(listing_type);
CREATE INDEX idx_properties_status ON public.properties(status);
CREATE INDEX idx_properties_owner ON public.properties(owner_id);
CREATE INDEX idx_property_images_property ON public.property_images(property_id);
CREATE INDEX idx_favorites_user ON public.favorites(user_id);
CREATE INDEX idx_leads_property ON public.leads(property_id);

-- RLS POLICIES
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Public can read published properties
CREATE POLICY "Public read published properties" ON public.properties
  FOR SELECT USING (status IN ('published','featured'));

-- Owners can read their own properties
CREATE POLICY "Owners read own properties" ON public.properties
  FOR SELECT USING (auth.uid() = owner_id);

-- Owners can insert properties
CREATE POLICY "Owners insert properties" ON public.properties
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Owners can update own properties
CREATE POLICY "Owners update own properties" ON public.properties
  FOR UPDATE USING (auth.uid() = owner_id);

-- Users can read their own profile
CREATE POLICY "Users read own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Users can update own profile
CREATE POLICY "Users update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Favorites: users manage their own
CREATE POLICY "Users manage own favorites" ON public.favorites
  FOR ALL USING (auth.uid() = user_id);

-- Property images: public read for published properties
CREATE POLICY "Public read property images" ON public.property_images
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.properties p
      WHERE p.id = property_id AND p.status IN ('published','featured')
    )
  );

-- Property amenities: public read
CREATE POLICY "Public read amenities" ON public.property_amenities
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.properties p
      WHERE p.id = property_id AND p.status IN ('published','featured')
    )
  );

-- Seed data with real Unsplash images
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, role)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'admin@nobroker.com', crypt('Admin@123', gen_salt('bf')), NOW(), 'authenticated'),
  ('00000000-0000-0000-0000-000000000002', 'rahul@owner.com', crypt('Owner@123', gen_salt('bf')), NOW(), 'authenticated'),
  ('00000000-0000-0000-0000-000000000003', 'priya@owner.com', crypt('Owner@123', gen_salt('bf')), NOW(), 'authenticated'),
  ('00000000-0000-0000-0000-000000000004', 'amit@owner.com', crypt('Owner@123', gen_salt('bf')), NOW(), 'authenticated'),
  ('00000000-0000-0000-0000-000000000005', 'seeker1@test.com', crypt('Test@123', gen_salt('bf')), NOW(), 'authenticated');

INSERT INTO public.users (id, name, email, phone, role, is_verified)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Admin User', 'admin@nobroker.com', '+919999999999', 'admin', true),
  ('00000000-0000-0000-0000-000000000002', 'Rahul Sharma', 'rahul@owner.com', '+919876543210', 'owner', true),
  ('00000000-0000-0000-0000-000000000003', 'Priya Patel', 'priya@owner.com', '+919876543211', 'owner', true),
  ('00000000-0000-0000-0000-000000000004', 'Amit Kumar', 'amit@owner.com', '+919876543212', 'owner', false),
  ('00000000-0000-0000-0000-000000000005', 'Neha Singh', 'seeker1@test.com', '+919876543213', 'seeker', false);

-- 20 Sample properties across major Indian cities
INSERT INTO public.properties (id, owner_id, title, description, property_type, listing_type, price, monthly_rent, security_deposit, address, city, locality, landmark, bedrooms, bathrooms, balconies, floor_number, total_floors, carpet_area, built_up_area, furnishing_status, property_age, facing, parking, status, is_verified, cover_image_url, created_at)
VALUES
  ('10000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000002','Luxurious 3 BHK Apartment in Koramangala','Stunning 3 BHK apartment in the heart of Koramangala with modern amenities and excellent connectivity. This spacious home features premium interiors, a modular kitchen, and breathtaking city views. Located just 2 km from Forum Mall and 5 minutes from Koramangala 1st Block.','apartment','rent',NULL,55000,110000,'3rd Block, Koramangala','Bangalore','Koramangala','Forum Mall',3,2,2,5,12,1450,1650,'fully_furnished',2,'east','covered','published',true,'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',NOW() - INTERVAL '5 days'),
  ('10000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000002','Modern 2 BHK in Indiranagar','Beautifully designed 2 BHK in premium Indiranagar location. Walking distance to 100 Feet Road restaurants and CMH Road metro station. Recently renovated with high-quality fixtures.','apartment','rent',NULL,38000,76000,'HAL 2nd Stage, Indiranagar','Bangalore','Indiranagar','100 Feet Road',2,2,1,3,8,1100,1250,'semi_furnished',4,'north','open','published',true,'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',NOW() - INTERVAL '3 days'),
  ('10000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000003','Premium 4 BHK Villa in Whitefield','Exquisite independent villa in gated community with private garden, swimming pool access, and 24x7 security. Perfect for families. Close to ITPL and Whitefield railway station.','villa','buy',28500000,NULL,NULL,'Prestige Shantiniketan, Whitefield','Bangalore','Whitefield','ITPL',4,4,3,1,2,3200,3800,'fully_furnished',3,'north_east','both','featured',true,'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',NOW() - INTERVAL '10 days'),
  ('10000000-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000003','Spacious 3 BHK in HSR Layout','Well-maintained 3 BHK flat in prime HSR Layout location. Vastu-compliant, great ventilation, and ample natural light. Close to Agara Lake and all essential amenities.','apartment','buy',12500000,NULL,NULL,'Sector 2, HSR Layout','Bangalore','HSR Layout','Agara Lake',3,3,2,7,15,1580,1800,'semi_furnished',5,'south','covered','published',false,'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800',NOW() - INTERVAL '7 days'),
  ('10000000-0000-0000-0000-000000000005','00000000-0000-0000-0000-000000000002','Cozy Studio near Electronic City','Compact and efficient studio apartment perfect for IT professionals. 5-minute drive to Infosys and Wipro campuses. Fully furnished with all appliances.','studio','rent',NULL,18000,36000,'Phase 1, Electronic City','Bangalore','Electronic City','Infosys Campus',0,1,0,2,6,480,550,'fully_furnished',1,'east','none','published',true,'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',NOW() - INTERVAL '2 days'),
  ('10000000-0000-0000-0000-000000000006','00000000-0000-0000-0000-000000000004','Sea-View 2 BHK in Bandra West','Rare sea-facing 2 BHK apartment in the most sought-after Bandra West location. Stunning Arabian Sea views from the living room. Walking distance to Bandstand and Carter Road.','apartment','rent',NULL,75000,150000,'Turner Road, Bandra West','Mumbai','Bandra West','Bandstand',2,2,1,8,16,950,1100,'fully_furnished',6,'west','covered','published',true,'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',NOW() - INTERVAL '4 days'),
  ('10000000-0000-0000-0000-000000000007','00000000-0000-0000-0000-000000000004','Spacious 3 BHK in Powai','Excellent 3 BHK in Hiranandani Gardens Powai. Premium amenities including gym, pool, and landscaped gardens. Close to IIT Bombay and Powai Lake.','apartment','buy',22000000,NULL,NULL,'Hiranandani Gardens, Powai','Mumbai','Powai','Powai Lake',3,3,2,12,25,1650,1900,'semi_furnished',7,'north','covered','published',false,'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',NOW() - INTERVAL '12 days'),
  ('10000000-0000-0000-0000-000000000008','00000000-0000-0000-0000-000000000002','Luxury Penthouse in Juhu','One-of-a-kind penthouse in Juhu with private terrace, plunge pool, and panoramic sea views. Fully furnished with designer interiors and premium appliances.','apartment','buy',95000000,NULL,NULL,'Juhu Tara Road, Juhu','Mumbai','Juhu','Juhu Beach',4,4,2,14,14,4200,5000,'fully_furnished',4,'west','both','featured',true,'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800',NOW() - INTERVAL '1 days'),
  ('10000000-0000-0000-0000-000000000009','00000000-0000-0000-0000-000000000003','Modern 2 BHK in Andheri East','Well-connected 2 BHK near Andheri metro station. Perfect for working professionals. Close to Western Express Highway and domestic airport.','apartment','rent',NULL,42000,84000,'Marol, Andheri East','Mumbai','Andheri East','SEEPZ Metro Station',2,2,1,4,10,950,1100,'semi_furnished',3,'south','open','published',false,'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',NOW() - INTERVAL '6 days'),
  ('10000000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000004','3 BHK Builder Floor in Hauz Khas','Independent builder floor in the artistic Hauz Khas Village area. Private terrace, dedicated parking. Walking distance to Hauz Khas Lake and Metro Station.','builder_floor','rent',NULL,65000,130000,'Hauz Khas Village, South Delhi','Delhi','Hauz Khas','Hauz Khas Lake',3,3,1,2,4,1800,2100,'fully_furnished',8,'north','covered','published',true,'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800',NOW() - INTERVAL '8 days'),
  ('10000000-0000-0000-0000-000000000011','00000000-0000-0000-0000-000000000002','4 BHK Independent House in Vasant Kunj','Elegant independent house in Vasant Kunj with servant quarters, manicured garden, and basement parking. Quiet residential area close to DLF Promenade Mall.','house','buy',45000000,NULL,NULL,'Block C, Vasant Kunj','Delhi','Vasant Kunj','DLF Promenade',4,4,2,1,2,3500,4200,'fully_furnished',10,'south','both','published',false,'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',NOW() - INTERVAL '15 days'),
  ('10000000-0000-0000-0000-000000000012','00000000-0000-0000-0000-000000000003','Compact 1 BHK in Lajpat Nagar','Affordable 1 BHK in the vibrant Lajpat Nagar market area. Great connectivity via Lajpat Nagar metro. Perfect for young professionals.','apartment','rent',NULL,22000,44000,'Central Market, Lajpat Nagar','Delhi','Lajpat Nagar','Central Market',1,1,1,3,7,580,680,'unfurnished',6,'east','none','published',false,'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',NOW() - INTERVAL '9 days'),
  ('10000000-0000-0000-0000-000000000013','00000000-0000-0000-0000-000000000004','Premium 3 BHK in Jubilee Hills','Sophisticated 3 BHK in Hyderabad premier Jubilee Hills. Walking distance to Road No.36 restaurants and entertainment zone. Gated community with 24x7 security.','apartment','buy',18000000,NULL,NULL,'Road No. 36, Jubilee Hills','Hyderabad','Jubilee Hills','KBR National Park',3,3,2,5,10,1750,2000,'fully_furnished',2,'east','covered','featured',true,'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',NOW() - INTERVAL '3 days'),
  ('10000000-0000-0000-0000-000000000014','00000000-0000-0000-0000-000000000002','2 BHK in Gachibowli IT Hub','Modern 2 BHK apartment in Gachibowli, minutes from major IT companies like Google, Microsoft, and Amazon. Great investment opportunity.','apartment','rent',NULL,32000,64000,'DLF Cyber City, Gachibowli','Hyderabad','Gachibowli','DLF Cyber City',2,2,1,6,12,1050,1200,'semi_furnished',3,'west','covered','published',false,'https://images.unsplash.com/photo-1615873968403-89e068629265?w=800',NOW() - INTERVAL '5 days'),
  ('10000000-0000-0000-0000-000000000015','00000000-0000-0000-0000-000000000003','Luxury Villa in Banjara Hills','Architectural masterpiece villa in Banjara Hills with private pool, home theatre, and lush garden. Premium finishes throughout. 24x7 security and power backup.','villa','buy',75000000,NULL,NULL,'Road No. 12, Banjara Hills','Hyderabad','Banjara Hills','GVK One Mall',5,5,3,1,2,5500,6800,'fully_furnished',1,'north','both','published',true,'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800',NOW() - INTERVAL '20 days'),
  ('10000000-0000-0000-0000-000000000016','00000000-0000-0000-0000-000000000004','2 BHK near Besant Nagar Beach','Charming 2 BHK apartment walking distance from Besant Nagar (Elliot Beach). Great sea breeze and community feel. Perfect for families and professionals.','apartment','rent',NULL,28000,56000,'Besant Nagar, Chennai','Chennai','Besant Nagar','Elliot Beach',2,2,1,2,5,950,1100,'semi_furnished',7,'south_east','covered','published',false,'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800',NOW() - INTERVAL '11 days'),
  ('10000000-0000-0000-0000-000000000017','00000000-0000-0000-0000-000000000002','3 BHK in OMR IT Corridor','Excellent 3 BHK in the IT corridor of OMR. Close to Tidel Park and multiple tech parks. Gated community with swimming pool and gym.','apartment','buy',9500000,NULL,NULL,'Perungudi, OMR','Chennai','OMR','Tidel Park',3,2,2,4,10,1350,1550,'unfurnished',4,'north','open','published',false,'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',NOW() - INTERVAL '14 days'),
  ('10000000-0000-0000-0000-000000000018','00000000-0000-0000-0000-000000000003','Penthouse in Koregaon Park','Exquisite penthouse in Pune prime Koregaon Park with rooftop terrace and city views. Walking distance to Osho Ashram and top restaurants.','apartment','buy',35000000,NULL,NULL,'Lane 5, Koregaon Park','Pune','Koregaon Park','Osho Ashram',4,4,2,8,8,3200,3800,'fully_furnished',3,'north','both','featured',true,'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',NOW() - INTERVAL '2 days'),
  ('10000000-0000-0000-0000-000000000019','00000000-0000-0000-0000-000000000004','1 BHK Studio in Kothrud','Compact, well-designed 1 BHK in Kothrud, close to Symbiosis University. Perfect for students and young professionals. Fully furnished.','studio','rent',NULL,15000,30000,'Model Colony, Kothrud','Pune','Kothrud','Symbiosis University',1,1,0,3,8,520,600,'fully_furnished',2,'east','none','pending',false,'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',NOW() - INTERVAL '1 days'),
  ('10000000-0000-0000-0000-000000000020','00000000-0000-0000-0000-000000000002','Residential Plot in Sarjapur','Excellent residential plot in rapidly developing Sarjapur area. BBMP approved layout with all utilities. Great investment opportunity near upcoming metro corridor.','plot','buy',8500000,NULL,NULL,'Sarjapur Road','Bangalore','Sarjapur','Amazon Campus',0,0,0,NULL,NULL,2400,NULL,'unfurnished',0,NULL,'none','published',false,'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',NOW() - INTERVAL '18 days');

-- Property images
INSERT INTO public.property_images (property_id, url, sort_order) VALUES
  ('10000000-0000-0000-0000-000000000001','https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',0),
  ('10000000-0000-0000-0000-000000000001','https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',1),
  ('10000000-0000-0000-0000-000000000001','https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',2),
  ('10000000-0000-0000-0000-000000000002','https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',0),
  ('10000000-0000-0000-0000-000000000002','https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800',1),
  ('10000000-0000-0000-0000-000000000003','https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',0),
  ('10000000-0000-0000-0000-000000000003','https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',1),
  ('10000000-0000-0000-0000-000000000003','https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',2),
  ('10000000-0000-0000-0000-000000000004','https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800',0),
  ('10000000-0000-0000-0000-000000000004','https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',1),
  ('10000000-0000-0000-0000-000000000005','https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',0),
  ('10000000-0000-0000-0000-000000000006','https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',0),
  ('10000000-0000-0000-0000-000000000006','https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',1),
  ('10000000-0000-0000-0000-000000000007','https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',0),
  ('10000000-0000-0000-0000-000000000007','https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800',1),
  ('10000000-0000-0000-0000-000000000008','https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800',0),
  ('10000000-0000-0000-0000-000000000008','https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',1),
  ('10000000-0000-0000-0000-000000000008','https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',2),
  ('10000000-0000-0000-0000-000000000009','https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',0),
  ('10000000-0000-0000-0000-000000000010','https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800',0),
  ('10000000-0000-0000-0000-000000000010','https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',1),
  ('10000000-0000-0000-0000-000000000011','https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',0),
  ('10000000-0000-0000-0000-000000000012','https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',0),
  ('10000000-0000-0000-0000-000000000013','https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',0),
  ('10000000-0000-0000-0000-000000000013','https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800',1),
  ('10000000-0000-0000-0000-000000000014','https://images.unsplash.com/photo-1615873968403-89e068629265?w=800',0),
  ('10000000-0000-0000-0000-000000000015','https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800',0),
  ('10000000-0000-0000-0000-000000000015','https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',1),
  ('10000000-0000-0000-0000-000000000016','https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800',0),
  ('10000000-0000-0000-0000-000000000017','https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',0),
  ('10000000-0000-0000-0000-000000000018','https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',0),
  ('10000000-0000-0000-0000-000000000018','https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800',1),
  ('10000000-0000-0000-0000-000000000019','https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',0),
  ('10000000-0000-0000-0000-000000000020','https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',0);

-- Amenities
INSERT INTO public.property_amenities (property_id, amenity) VALUES
  ('10000000-0000-0000-0000-000000000001','gym'),('10000000-0000-0000-0000-000000000001','pool'),('10000000-0000-0000-0000-000000000001','security'),('10000000-0000-0000-0000-000000000001','lift'),('10000000-0000-0000-0000-000000000001','power_backup'),
  ('10000000-0000-0000-0000-000000000002','security'),('10000000-0000-0000-0000-000000000002','lift'),('10000000-0000-0000-0000-000000000002','wifi'),
  ('10000000-0000-0000-0000-000000000003','gym'),('10000000-0000-0000-0000-000000000003','pool'),('10000000-0000-0000-0000-000000000003','security'),('10000000-0000-0000-0000-000000000003','clubhouse'),('10000000-0000-0000-0000-000000000003','garden'),('10000000-0000-0000-0000-000000000003','power_backup'),
  ('10000000-0000-0000-0000-000000000004','gym'),('10000000-0000-0000-0000-000000000004','security'),('10000000-0000-0000-0000-000000000004','lift'),('10000000-0000-0000-0000-000000000004','power_backup'),
  ('10000000-0000-0000-0000-000000000005','wifi'),('10000000-0000-0000-0000-000000000005','security'),
  ('10000000-0000-0000-0000-000000000006','gym'),('10000000-0000-0000-0000-000000000006','security'),('10000000-0000-0000-0000-000000000006','lift'),('10000000-0000-0000-0000-000000000006','power_backup'),('10000000-0000-0000-0000-000000000006','intercom'),
  ('10000000-0000-0000-0000-000000000007','gym'),('10000000-0000-0000-0000-000000000007','pool'),('10000000-0000-0000-0000-000000000007','security'),('10000000-0000-0000-0000-000000000007','clubhouse'),('10000000-0000-0000-0000-000000000007','garden'),
  ('10000000-0000-0000-0000-000000000008','gym'),('10000000-0000-0000-0000-000000000008','pool'),('10000000-0000-0000-0000-000000000008','security'),('10000000-0000-0000-0000-000000000008','lift'),('10000000-0000-0000-0000-000000000008','power_backup'),('10000000-0000-0000-0000-000000000008','clubhouse'),
  ('10000000-0000-0000-0000-000000000009','security'),('10000000-0000-0000-0000-000000000009','lift'),('10000000-0000-0000-0000-000000000009','power_backup'),
  ('10000000-0000-0000-0000-000000000010','security'),('10000000-0000-0000-0000-000000000010','garden'),('10000000-0000-0000-0000-000000000010','power_backup'),
  ('10000000-0000-0000-0000-000000000013','gym'),('10000000-0000-0000-0000-000000000013','pool'),('10000000-0000-0000-0000-000000000013','security'),('10000000-0000-0000-0000-000000000013','lift'),('10000000-0000-0000-0000-000000000013','power_backup'),
  ('10000000-0000-0000-0000-000000000015','gym'),('10000000-0000-0000-0000-000000000015','pool'),('10000000-0000-0000-0000-000000000015','security'),('10000000-0000-0000-0000-000000000015','clubhouse'),('10000000-0000-0000-0000-000000000015','garden'),('10000000-0000-0000-0000-000000000015','power_backup'),
  ('10000000-0000-0000-0000-000000000018','gym'),('10000000-0000-0000-0000-000000000018','pool'),('10000000-0000-0000-0000-000000000018','security'),('10000000-0000-0000-0000-000000000018','lift'),('10000000-0000-0000-0000-000000000018','power_backup'),('10000000-0000-0000-0000-000000000018','clubhouse');

-- Sample leads
INSERT INTO public.leads (property_id, user_id, owner_id, contact_type, user_phone, user_name, status)
VALUES
  ('10000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000005','00000000-0000-0000-0000-000000000002','phone','+919876543213','Neha Singh','new'),
  ('10000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000005','00000000-0000-0000-0000-000000000003','whatsapp','+919876543213','Neha Singh','contacted'),
  ('10000000-0000-0000-0000-000000000006',NULL,'00000000-0000-0000-0000-000000000004','phone','+919811223344','Arjun Mehta','new'),
  ('10000000-0000-0000-0000-000000000008',NULL,'00000000-0000-0000-0000-000000000002','whatsapp','+919922334455','Deepika Rao','new'),
  ('10000000-0000-0000-0000-000000000013','00000000-0000-0000-0000-000000000005','00000000-0000-0000-0000-000000000004','phone','+919876543213','Neha Singh','contacted');
