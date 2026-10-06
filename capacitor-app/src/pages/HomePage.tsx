import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Search } from 'lucide-react'
import PropertyCard from '../components/PropertyCard'
import { FEATURED_PROPERTIES, CITIES, MOCK_PROPERTIES } from '../mockData'

export default function HomePage() {
  const navigate = useNavigate()
  const [listingType, setListingType] = React.useState<'buy' | 'rent'>('buy')

  return (
    <div className="h-full overflow-y-auto pb-24 bg-slate-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-primary text-white px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="text-xl font-extrabold tracking-tight">NoBroker</div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 active:bg-white/20">
          <Bell size={20} />
        </button>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-b from-primary to-primary-light px-4 pt-4 pb-8 rounded-b-3xl shadow-md">
        <h1 className="text-white text-3xl font-bold max-w-[80%] leading-tight">Find Your Perfect Home</h1>
        
        <div className="flex bg-white/20 p-1 rounded-full mt-6 w-48">
          <button 
            onClick={() => setListingType('buy')}
            className={`flex-1 py-1.5 text-sm font-semibold rounded-full transition-colors ${listingType === 'buy' ? 'bg-white text-primary shadow-sm' : 'text-white'}`}
          >
            BUY
          </button>
          <button 
            onClick={() => setListingType('rent')}
            className={`flex-1 py-1.5 text-sm font-semibold rounded-full transition-colors ${listingType === 'rent' ? 'bg-white text-primary shadow-sm' : 'text-white'}`}
          >
            RENT
          </button>
        </div>

        <div className="mt-6 relative">
          <div 
            onClick={() => navigate('/search')}
            className="w-full bg-white text-slate-800 rounded-full py-3.5 pl-12 pr-4 shadow-lg flex items-center cursor-text active:opacity-90"
          >
            <Search className="absolute left-4 text-slate-400" size={20} />
            <span className="text-slate-400 text-base">Search city, locality...</span>
          </div>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="px-4 mt-6">
        <div className="flex overflow-x-auto hide-scrollbar gap-3 pb-2">
          {['1 BHK', '2 BHK', '3 BHK', 'Villa', 'Studio', 'Plot'].map(filter => (
            <button 
              key={filter} 
              onClick={() => navigate(`/search?q=${filter}`)}
              className="whitespace-nowrap px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-medium text-slate-700 shadow-sm active:bg-slate-50"
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Properties */}
      <div className="mt-8">
        <div className="px-4 flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Featured Properties</h2>
          <button onClick={() => navigate('/search?type=featured')} className="text-primary text-sm font-semibold">See all</button>
        </div>
        <div className="flex overflow-x-auto hide-scrollbar px-4 gap-4 pb-4">
          {FEATURED_PROPERTIES.map(prop => (
            <PropertyCard key={prop.id} property={prop} compact />
          ))}
        </div>
      </div>

      {/* Browse by City */}
      <div className="mt-6 px-4">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Browse by City</h2>
        <div className="grid grid-cols-2 gap-3">
          {CITIES.map(city => (
            <div 
              key={city.name}
              onClick={() => navigate(`/search?city=${city.name}`)}
              className="relative h-24 rounded-2xl overflow-hidden shadow-sm active:opacity-80"
            >
              <img src={city.image} alt={city.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-3">
                <div className="text-white font-bold text-sm">{city.name}</div>
                <div className="text-white/80 text-xs">{city.count} properties</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Browse by Type */}
      <div className="mt-8 px-4">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Browse by Type</h2>
        <div className="flex overflow-x-auto hide-scrollbar gap-3 pb-2">
          {[
            { icon: '🏢', label: 'Apartment' },
            { icon: '🏡', label: 'Villa' },
            { icon: '🏠', label: 'House' },
            { icon: '🛋️', label: 'Studio' },
            { icon: '📐', label: 'Plot' }
          ].map(type => (
            <button 
              key={type.label}
              onClick={() => navigate(`/search?q=${type.label}`)}
              className="flex-shrink-0 flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm active:bg-slate-50"
            >
              <span className="text-lg">{type.icon}</span>
              <span className="text-sm font-medium text-slate-700">{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Listings */}
      <div className="mt-8 px-4">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Latest Properties</h2>
        <div className="flex flex-col gap-4">
          {MOCK_PROPERTIES.slice(0, 6).map(prop => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
        <button 
          onClick={() => navigate('/search')}
          className="w-full mt-6 mb-8 py-3.5 bg-white border-2 border-primary text-primary rounded-xl font-bold active:bg-primary/5"
        >
          View All Properties
        </button>
      </div>
    </div>
  )
}
