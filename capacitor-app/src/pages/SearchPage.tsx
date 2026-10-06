import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import PropertyCard from '../components/PropertyCard'
import { filterProperties } from '../mockData'
import { SearchFilters } from '../types'

export default function SearchPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [showFilterSheet, setShowFilterSheet] = useState(false)
  
  const [filters, setFilters] = useState<SearchFilters>({
    listingType: (searchParams.get('listingType') as 'buy' | 'rent') || undefined,
    city: searchParams.get('city') || undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    bedrooms: searchParams.get('bedrooms') ? [Number(searchParams.get('bedrooms'))] : undefined,
  })

  const results = filterProperties({ ...filters, query })
  const activeFilterCount = Object.values(filters).filter(v => v !== undefined).length

  const handleApplyFilters = () => {
    setShowFilterSheet(false)
    const newParams = new URLSearchParams()
    if (query) newParams.set('q', query)
    if (filters.listingType) newParams.set('listingType', filters.listingType)
    if (filters.city) newParams.set('city', filters.city)
    if (filters.bedrooms) newParams.set('bedrooms', filters.bedrooms.toString())
    setSearchParams(newParams)
  }

  const clearFilters = () => {
    setFilters({})
    setQuery('')
    setSearchParams(new URLSearchParams())
  }

  const removeFilter = (key: keyof SearchFilters) => {
    const newFilters = { ...filters }
    delete newFilters[key]
    setFilters(newFilters)
    
    const newParams = new URLSearchParams(searchParams)
    newParams.delete(String(key))
    setSearchParams(newParams)
  }

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Top bar */}
      <div className="bg-white px-4 py-3 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-700 active:bg-slate-100 rounded-full">
            <ArrowLeft size={24} />
          </button>
          
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by locality, project..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          
          <button 
            onClick={() => setShowFilterSheet(true)}
            className="p-2.5 bg-slate-100 text-slate-700 rounded-xl relative active:bg-slate-200"
          >
            <SlidersHorizontal size={20} />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Buy/Rent Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-lg mt-3">
          <button 
            onClick={() => setFilters({...filters, listingType: 'buy'})}
            className={`flex-1 py-1.5 text-sm font-semibold rounded-md transition-colors ${filters.listingType === 'buy' ? 'bg-white text-primary shadow' : 'text-slate-500'}`}
          >
            BUY
          </button>
          <button 
            onClick={() => setFilters({...filters, listingType: 'rent'})}
            className={`flex-1 py-1.5 text-sm font-semibold rounded-md transition-colors ${filters.listingType === 'rent' ? 'bg-white text-primary shadow' : 'text-slate-500'}`}
          >
            RENT
          </button>
        </div>
      </div>

      {/* Results Header */}
      <div className="px-4 py-3 bg-slate-50 flex items-center justify-between">
        <div className="text-sm font-semibold text-slate-700">
          {results.length} {results.length === 1 ? 'property' : 'properties'} found
        </div>
        <button className="flex items-center gap-1 text-sm text-slate-600 font-medium">
          Sort <ChevronDown size={14} />
        </button>
      </div>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="px-4 pb-3 flex overflow-x-auto hide-scrollbar gap-2">
          {filters.city && (
            <span className="flex items-center gap-1 bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full border border-primary/20 whitespace-nowrap">
              {filters.city} <X size={12} onClick={() => removeFilter('city')} className="cursor-pointer" />
            </span>
          )}
          {filters.bedrooms && (
            <span className="flex items-center gap-1 bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full border border-primary/20 whitespace-nowrap">
              {filters.bedrooms} BHK <X size={12} onClick={() => removeFilter('bedrooms')} className="cursor-pointer" />
            </span>
          )}
        </div>
      )}

      {/* Results List */}
      <div className="flex-1 overflow-y-auto px-4 pb-24">
        {results.length > 0 ? (
          <div className="flex flex-col gap-4">
            {results.map(prop => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center py-12">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-3xl">
              🔍
            </div>
            <h3 className="text-lg font-bold text-slate-800">No properties found</h3>
            <p className="text-slate-500 text-sm mt-1 text-center max-w-xs">
              We couldn't find any properties matching your current filters. Try adjusting them.
            </p>
            <button onClick={clearFilters} className="mt-6 px-6 py-2.5 bg-primary text-white font-medium rounded-full active:opacity-80">
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Filter Bottom Sheet */}
      {showFilterSheet && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilterSheet(false)} />
          <div className="relative bg-white rounded-t-3xl h-[85vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Filters</h2>
              <button onClick={() => setShowFilterSheet(false)} className="p-2 -mr-2 text-slate-500 active:bg-slate-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
              {/* City */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-3">City</label>
                <input 
                  type="text"
                  value={filters.city || ''}
                  onChange={e => setFilters({...filters, city: e.target.value})}
                  placeholder="e.g. Bangalore, Mumbai"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary"
                />
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-3">Bedrooms (BHK)</label>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4].map(num => (
                    <button
                      key={num}
                      onClick={() => setFilters({...filters, bedrooms: [num]})}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border ${filters.bedrooms?.includes(num) ? 'bg-primary text-white border-primary' : 'bg-white text-slate-600 border-slate-200'}`}
                    >
                      {num} {num === 4 ? '4+ BHK' : 'BHK'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-slate-100 flex gap-4 bg-white">
              <button onClick={clearFilters} className="flex-1 py-3.5 text-slate-700 font-bold bg-slate-100 rounded-xl active:bg-slate-200">
                Clear All
              </button>
              <button onClick={handleApplyFilters} className="flex-[2] py-3.5 text-white font-bold bg-primary rounded-xl active:opacity-90">
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
