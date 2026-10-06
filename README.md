# 🏠 NoBroker — Production Property Marketplace

A full-stack residential property marketplace for India. Find, list, buy, and rent properties with zero brokerage.

---

## 📁 Project Structure

```
NOBROKER/
├── backend/          ← Next.js 14 (API + Admin Panel) → Vercel
└── mobile/           ← React Native Expo (iOS + Android)
```

---

## 🔧 Tech Stack

| Layer | Technology |
|---|---|
| Mobile App | React Native (Expo SDK 51) |
| Backend API | Next.js 14 App Router |
| Admin Panel | Next.js (Tailwind CSS) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (JWT) |
| Deployment | Vercel |

---

## ⚡ Quick Start

### Step 1: Set Up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → paste the full contents of `backend/supabase/schema.sql` → click **Run**
3. Copy your credentials (Project URL, anon key, service_role key)

### Step 2: Backend

```bash
cd backend
npm install
cp .env.example .env.local
# Add your Supabase credentials to .env.local
npm run dev
# → http://localhost:3000/admin
```

**Admin login:** admin@nobroker.com / Admin@123

### Step 3: Mobile App

```bash
cd mobile
npm install
# Edit src/config/api.ts — set API_BASE_URL to your backend URL
npx expo start
```

> Add placeholder images in `mobile/assets/`: `icon.png`, `splash.png`, `adaptive-icon.png`

---

## 🌐 API Reference

### Public Endpoints
- `GET /api/properties` — List with filters (listingType, city, locality, propertyType, minPrice, maxPrice, bedrooms, furnishing, sort, page, limit)
- `GET /api/properties/[id]` — Full property detail (increments view count)
- `GET /api/properties/featured` — Featured properties
- `GET /api/properties/search?q=` — Search with city/locality suggestions

### Auth Endpoints (returns JWT token)
- `POST /api/auth/login` — `{ email, password }` → `{ token, user }`
- `POST /api/auth/register` — `{ name, email, password, phone, role }` → `{ token, user }`
- `GET /api/auth/me` — Current user profile

### Authenticated
- `GET /api/favorites` — User's saved properties
- `POST /api/favorites` — `{ propertyId }` → save property
- `DELETE /api/favorites/[propertyId]` — Remove saved
- `POST /api/leads` — `{ propertyId, contactType, userName, userPhone }` → returns owner phone
- `POST /api/properties` — Create listing
- `PUT /api/properties/[id]` — Update own listing
- `DELETE /api/properties/[id]` — Delete own listing

### Admin Only
- `GET /api/admin/stats` — Dashboard KPIs
- `GET /api/admin/properties` — All properties with search/filter
- `PATCH /api/admin/properties/[id]` — Change status, verify, feature
- `GET /api/admin/users` — User management
- `GET /api/admin/leads` — Lead tracking

---

## 🗄️ Seed Data

| User | Email | Password | Role |
|---|---|---|---|
| Admin | admin@nobroker.com | Admin@123 | admin |
| Owner 1 | rahul@owner.com | Owner@123 | owner |
| Owner 2 | priya@owner.com | Owner@123 | owner |
| Owner 3 | amit@owner.com | Owner@123 | owner |
| Seeker | seeker1@test.com | Test@123 | seeker |

**20 sample properties** across Bangalore, Mumbai, Delhi, Hyderabad, Chennai, Pune.

---

## 🚀 Deploy to Vercel

```bash
cd backend
vercel --prod
```

Set these env vars in Vercel Dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

---

## 🔐 Security Model

- Admin routes: protected by Next.js middleware (checks DB role)
- Supabase RLS: row-level security on all tables
- Owner phone: revealed **only** after lead creation — never in public listing
- Admin uses service_role key (server-side only, never exposed to client)
