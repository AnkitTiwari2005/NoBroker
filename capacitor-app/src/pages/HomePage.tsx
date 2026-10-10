import React, { useState, useMemo, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell, Building2, Home, Sofa, Map, Search, ChevronRight,
  MapPin, TrendingUp, Star, X, ArrowRight
} from 'lucide-react'
import { useAuth } from '../AuthContext'
import { FEATURED_PROPERTIES, CITIES, MOCK_PROPERTIES } from '../mockData'
import PropertyCard from '../components/PropertyCard'
import ModalSheet from '../components/ModalSheet'

export default function HomePage() {
  const navigate  = useNavigate()
  const { user }  = useAuth()

  const [listingType,       setListingType]       = useState<'buy' | 'rent'>('rent')
  const [searchQuery,       setSearchQuery]       = useState('')
  const [showSuggestions,   setShowSuggestions]   = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)

  // Filter all property lists by active listing type
  const filteredFeatured = useMemo(
    () => FEATURED_PROPERTIES.filter(p => p.listingType === listingType),
    [listingType]
  )
  const filteredLatest = useMemo(
    () => MOCK_PROPERTIES.filter(p => p.listingType === listingType).slice(0, 4),
    [listingType]
  )

  // Mock notifications
  const notifications = [
    { id: 1, icon: TrendingUp, color: 'blue',  title: 'New property match',   body: 'A new 2 BHK in Indiranagar matches your search.',    time: '2 hours ago' },
    { id: 2, icon: Star,       color: 'amber', title: 'Price dropped',         body: 'Price reduced on Sea-View 2 BHK in Bandra.',           time: '1 day ago'  },
    { id: 3, icon: Bell,       color: 'green', title: 'Listing verified',      body: 'A property you saved has been admin-verified.',         time: '2 days ago' },
  ]

  // Real-time search suggestions from mock data
  const suggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return []
    const results: Array<{ label: string; sub: string; icon: any; path: string }> = []

    // City matches
    CITIES.filter(c => c.name.toLowerCase().includes(q)).forEach(c =>
      results.push({ label: c.name, sub: `${c.count} properties`, icon: MapPin, path: `/search?city=${c.name}&listingType=${listingType}` })
    )

    // Locality matches
    const seen = new Set<string>()
    MOCK_PROPERTIES
      .filter(p => p.locality.toLowerCase().includes(q) && !seen.has(p.locality))
      .slice(0, 4)
      .forEach(p => {
        seen.add(p.locality)
        results.push({ label: p.locality, sub: p.city, icon: MapPin, path: `/search?q=${encodeURIComponent(p.locality)}&listingType=${listingType}` })
      })

    // Property title matches
    MOCK_PROPERTIES
      .filter(p => p.title.toLowerCase().includes(q))
      .slice(0, 2)
      .forEach(p =>
        results.push({ label: p.title, sub: `${p.locality}, ${p.city}`, icon: Building2, path: `/property/${p.id}` })
      )

    return results.slice(0, 6)
  }, [searchQuery, listingType])

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      setShowSuggestions(false)
      navigate(`/search?q=${encodeURIComponent(searchQuery)}&listingType=${listingType}`)
    } else {
      navigate(`/search?listingType=${listingType}`)
    }
  }

  const handleSuggestionClick = (path: string) => {
    setShowSuggestions(false)
    setSearchQuery('')
    navigate(path)
  }

  const handleBhkChip = (n: number) =>
    navigate(`/search?bedrooms=${n}&listingType=${listingType}`)

  const handleTypeChip = (type: string) =>
    navigate(`/search?propertyType=${type}&listingType=${listingType}`)

  return (
    <div className="min-h-screen bg-gray-50 pb-28 page-enter">

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div
        className="bg-[#1E3A5F] text-white"
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <div className="px-4 pt-4 pb-2 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">NoBroker</h1>
            <p className="text-white/60 text-xs mt-0.5">Zero Brokerage • Real Homes</p>
          </div>
          <button
            onClick={() => setShowNotifications(true)}
            className="relative p-2 btn-press"
          >
            <Bell size={24} className="text-amber-400" strokeWidth={2} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-[#1E3A5F]" />
          </button>
        </div>

        {/* Buy / Rent toggle */}
        <div className="px-4 pb-3">
          <div className="flex bg-white/10 rounded-xl p-1">
            {(['rent', 'buy'] as const).map(t => (
              <button
                key={t}
                onClick={() => setListingType(t)}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all btn-press ${
                  listingType === t ? 'bg-white text-[#1E3A5F] shadow-sm' : 'text-white/70'
                }`}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* ── Inline Search Bar ─────────────────────────────────────────── */}
        <div className="px-4 pb-8 relative">
          <div className="bg-white rounded-2xl shadow-xl flex items-center pr-2 pl-4">
            <Search size={18} className="text-slate-400 mr-3 shrink-0" />
            <input
              ref={searchRef}
              type="text"
              placeholder={`Search in ${user ? 'your city' : 'Bangalore'}...`}
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setShowSuggestions(true) }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              onKeyDown={e => e.key === 'Enter' && handleSearchSubmit()}
              className="flex-1 py-3.5 text-sm text-slate-800 placeholder-slate-400 bg-transparent outline-none"
            />
            {searchQuery ? (
              <button
                onMouseDown={e => e.preventDefault()}
                onClick={() => { setSearchQuery(''); searchRef.current?.focus() }}
                className="p-1.5 text-slate-400 btn-press"
              >
                <X size={16} />
              </button>
            ) : null}
            <button
              onMouseDown={e => e.preventDefault()}
              onClick={handleSearchSubmit}
              className="ml-1 bg-[#1E3A5F] text-white p-2.5 rounded-xl btn-press"
            >
              <Search size={16} />
            </button>
          </div>

          {/* Suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute left-4 right-4 top-full -mt-4 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-10">
              {suggestions.map((s, i) => {
                const Icon = s.icon
                return (
                  <button
                    key={i}
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => handleSuggestionClick(s.path)}
                    className="w-full flex items-center px-4 py-3 hover:bg-slate-50 active:bg-slate-100 border-b border-slate-50 last:border-0 text-left btn-press"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 shrink-0">
                      <Icon size={15} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{s.label}</p>
                      <p className="text-xs text-slate-400">{s.sub}</p>
                    </div>
                    <ArrowRight size={14} className="text-slate-300 shrink-0" />
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Quick filter chips ───────────────────────────────────────────── */}
      <div className="px-4 -mt-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-3 flex overflow-x-auto gap-2 scrollbar-hide">
          {[1, 2, 3, 4].map(n => (
            <button
              key={n}
              onClick={() => handleBhkChip(n)}
              className="flex-shrink-0 border border-slate-200 rounded-full px-4 py-1.5 text-sm font-semibold text-slate-700 bg-slate-50 btn-press hover:bg-primary hover:text-white hover:border-primary transition-colors"
            >
              {n} BHK
            </button>
          ))}
          <div className="w-px h-6 bg-slate-200 self-center mx-1" />
          {[
            { label: 'Villa',   icon: Home,     type: 'villa'   },
            { label: 'Studio',  icon: Sofa,     type: 'studio'  },
            { label: 'Plot',    icon: Map,      type: 'plot'    },
          ].map(pt => (
            <button
              key={pt.type}
              onClick={() => handleTypeChip(pt.type)}
              className="flex-shrink-0 flex items-center gap-1.5 border border-slate-200 rounded-full px-4 py-1.5 text-sm font-semibold text-slate-700 bg-slate-50 btn-press hover:bg-primary hover:text-white hover:border-primary transition-colors"
            >
              <pt.icon size={13} />
              {pt.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Featured Properties ──────────────────────────────────────────── */}
      <div className="mb-8 pl-4">
        <div className="flex justify-between items-center pr-4 mb-4">
          <h2 className="text-lg font-bold text-slate-800">
            Featured {listingType === 'rent' ? 'Rentals' : 'Properties for Sale'}
          </h2>
          <button onClick={() => navigate(`/search?listingType=${listingType}`)} className="text-sm font-semibold text-primary btn-press flex items-center gap-1">
            View All <ChevronRight size={16} />
          </button>
        </div>
        {filteredFeatured.length > 0 ? (
          <div className="flex overflow-x-auto gap-4 pb-2 pr-4 scrollbar-hide">
            {filteredFeatured.map(prop => (
              <div key={prop.id} className="w-72 shrink-0 card-press">
                <PropertyCard property={prop} compact />
              </div>
            ))}
          </div>
        ) : (
          <div className="mr-4 py-8 bg-white rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-slate-400">
            <Building2 size={32} className="mb-2 opacity-30" />
            <p className="text-sm">No featured {listingType === 'rent' ? 'rentals' : 'sale'} listings</p>
          </div>
        )}
      </div>

      {/* ── Browse by City ───────────────────────────────────────────────── */}
      <div className="px-4 mb-8">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Browse by City</h2>
        <div className="grid grid-cols-2 gap-3">
          {CITIES.slice(0, 4).map(city => (
            <button
              key={city.name}
              onClick={() => navigate(`/search?city=${city.name}&listingType=${listingType}`)}
              className="relative h-28 rounded-2xl overflow-hidden btn-press card-press"
            >
              <img
                src={city.image}
                alt={city.name}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white text-left">
                <p className="font-bold text-base leading-tight">{city.name}</p>
                <p className="text-xs text-white/70">{city.count.toLocaleString('en-IN')} properties</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Property Types ───────────────────────────────────────────────── */}
      <div className="pl-4 mb-8">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Property Types</h2>
        <div className="flex overflow-x-auto gap-4 pb-2 pr-4 scrollbar-hide">
          {[
            { type: 'apartment', label: 'Apartment', icon: Building2 },
            { type: 'villa',     label: 'Villa',     icon: Home      },
            { type: 'house',     label: 'House',     icon: Home      },
            { type: 'studio',    label: 'Studio',    icon: Sofa      },
            { type: 'plot',      label: 'Plot',      icon: Map       },
          ].map(pt => (
            <button
              key={pt.type}
              onClick={() => handleTypeChip(pt.type)}
              className="shrink-0 flex flex-col items-center btn-press card-press"
            >
              <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center mb-2 hover:bg-primary hover:border-primary group transition-colors">
                <pt.icon size={28} className="text-primary group-hover:text-white transition-colors" />
              </div>
              <span className="text-xs font-semibold text-slate-600">{pt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Latest Properties ────────────────────────────────────────────── */}
      <div className="px-4 mb-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-800">
            Latest {listingType === 'rent' ? 'Rentals' : 'For Sale'}
          </h2>
          <button onClick={() => navigate(`/search?listingType=${listingType}`)} className="text-sm font-semibold text-primary btn-press flex items-center gap-1">
            View All <ChevronRight size={16} />
          </button>
        </div>
        {filteredLatest.length > 0 ? (
          <div className="space-y-4">
            {filteredLatest.map(prop => (
              <div key={prop.id} className="card-press">
                <PropertyCard property={prop} />
            </div>
          ))}
          </div>
        ) : (
          <div className="py-8 bg-white rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-slate-400">
            <Building2 size={32} className="mb-2 opacity-30" />
            <p className="text-sm">No {listingType === 'rent' ? 'rental' : 'sale'} listings right now</p>
          </div>
        )}
      </div>

      {/* ── Notifications Sheet (portal) ─────────────────────────────────── */}
      {showNotifications && (
        <ModalSheet onClose={() => setShowNotifications(false)} height="70vh">
          <div className="px-5 pt-1 pb-4">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-slate-800">Notifications</h2>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-primary text-sm font-semibold btn-press"
              >
                Mark all read
              </button>
            </div>
            <div className="space-y-3">
              {notifications.map(n => {
                const Icon = n.icon
                const colorMap: Record<string, string> = {
                  blue: 'bg-blue-100 text-blue-600',
                  amber: 'bg-amber-100 text-amber-600',
                  green: 'bg-emerald-100 text-emerald-600',
                }
                return (
                  <div key={n.id} className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${colorMap[n.color]}`}>
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-slate-800">{n.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.body}</p>
                      <p className="text-[10px] text-slate-400 mt-1.5 font-medium">{n.time}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </ModalSheet>
      )}
    </div>
  )
}
