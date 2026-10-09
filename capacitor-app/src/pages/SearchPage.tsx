import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  SearchX,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  CheckCircle2
} from 'lucide-react';
import { filterProperties, CITIES } from '../mockData';
import { getDisplayPrice, formatArea, formatPropertyType, formatFurnishing, timeAgo } from '../utils';
import { SearchFilters, PropertyType, FurnishingStatus, Property } from '../types';
import { useToast } from '../ToastContext';
import ModalSheet from '../components/ModalSheet';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [showSortSheet, setShowSortSheet] = useState(false);
  const [sortOption, setSortOption] = useState(searchParams.get('sort') || 'newest');

  // Parse filters from URL
  const initialFilters: SearchFilters = {
    listingType: (searchParams.get('listingType') as any) || 'rent',
    city: searchParams.get('city') || '',
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    bedrooms: searchParams.get('bedrooms') ? searchParams.get('bedrooms')?.split(',').map(Number) : undefined,
    propertyType: searchParams.get('propertyType') ? (searchParams.get('propertyType')?.split(',') as PropertyType[]) : undefined,
    furnishing: searchParams.get('furnishing') ? (searchParams.get('furnishing')?.split(',') as FurnishingStatus[]) : undefined,
  };

  const [filters, setFilters] = useState<SearchFilters>(initialFilters);

  // Local state for filter sheet
  const [sheetFilters, setSheetFilters] = useState<SearchFilters>(initialFilters);

  useEffect(() => {
    // Sync filters to URL
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (filters.listingType) params.set('listingType', filters.listingType);
    if (filters.city) params.set('city', filters.city);
    if (filters.minPrice) params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice.toString());
    if (filters.bedrooms?.length) params.set('bedrooms', filters.bedrooms.join(','));
    if (filters.propertyType?.length) params.set('propertyType', filters.propertyType.join(','));
    if (filters.furnishing?.length) params.set('furnishing', filters.furnishing.join(','));
    if (sortOption && sortOption !== 'newest') params.set('sort', sortOption);
    setSearchParams(params, { replace: true });
  }, [query, filters, sortOption, setSearchParams]);

  const results = useMemo(() => {
    return filterProperties({ ...filters, q: query, sort: sortOption });
  }, [filters, query, sortOption]);

  const applyFilters = () => {
    setFilters(sheetFilters);
    setShowFilterSheet(false);
    let count = 0;
    if (sheetFilters.city) count++;
    if (sheetFilters.minPrice) count++;
    if (sheetFilters.maxPrice) count++;
    if (sheetFilters.bedrooms?.length) count++;
    if (sheetFilters.propertyType?.length) count++;
    if (sheetFilters.furnishing?.length) count++;
    showToast(`${count} filter(s) applied`);
  };

  const clearAllFilters = () => {
    const defaultFilters: SearchFilters = { listingType: filters.listingType };
    setSheetFilters(defaultFilters);
    setFilters(defaultFilters);
    setShowFilterSheet(false);
    setQuery('');
    showToast('Filters cleared');
  };

  const removeFilter = (key: keyof SearchFilters, value?: any) => {
    setFilters(prev => {
      const updated = { ...prev };
      if (Array.isArray(updated[key])) {
        (updated as any)[key] = (updated[key] as any[]).filter(v => v !== value);
        if ((updated[key] as any[]).length === 0) delete updated[key];
      } else {
        delete updated[key];
      }
      setSheetFilters(updated);
      return updated;
    });
  };

  const toggleSheetArray = (key: 'bedrooms' | 'propertyType' | 'furnishing', val: any) => {
    setSheetFilters(prev => {
      const arr = prev[key] || [];
      const newArr = (arr as any[]).includes(val) ? (arr as any[]).filter(v => v !== val) : [...arr, val];
      return { ...prev, [key]: newArr.length > 0 ? newArr : undefined };
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col page-enter">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-20" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
        <div className="px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-100 btn-press">
            <ArrowLeft className="w-6 h-6 text-slate-700" />
          </button>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search locality, landmark..."
              className="w-full bg-slate-100 rounded-full pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button onClick={() => setShowFilterSheet(true)} className="p-2 rounded-full bg-slate-100 text-slate-700 btn-press relative">
            <SlidersHorizontal className="w-5 h-5" />
            {Object.keys(filters).length > 1 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            )}
          </button>
        </div>
        
        {/* Buy / Rent Toggle */}
        <div className="flex border-b">
          <button
            className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-colors ${filters.listingType === 'buy' ? 'border-primary text-primary' : 'border-transparent text-slate-500'}`}
            onClick={() => { setFilters({ ...filters, listingType: 'buy' }); setSheetFilters({ ...sheetFilters, listingType: 'buy' }); }}
          >
            Buy
          </button>
          <button
            className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-colors ${filters.listingType === 'rent' ? 'border-primary text-primary' : 'border-transparent text-slate-500'}`}
            onClick={() => { setFilters({ ...filters, listingType: 'rent' }); setSheetFilters({ ...sheetFilters, listingType: 'rent' }); }}
          >
            Rent
          </button>
        </div>

        {/* Filter Chips & Sort */}
        <div className="px-4 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button onClick={() => setShowSortSheet(true)} className="flex items-center gap-1 bg-white border border-slate-200 rounded-full px-3 py-1.5 text-xs font-medium text-slate-700 whitespace-nowrap btn-press">
            Sort: {sortOption === 'newest' ? 'Newest' : sortOption === 'price_asc' ? 'Price ↑' : sortOption === 'price_desc' ? 'Price ↓' : 'Largest'}
            <ChevronDown className="w-3 h-3" />
          </button>
          {filters.city && (
            <div className="flex items-center gap-1 bg-primary/10 text-primary rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap">
              {filters.city} <button onClick={() => removeFilter('city')}><X className="w-3 h-3" /></button>
            </div>
          )}
          {filters.bedrooms?.map(b => (
            <div key={`bed-${b}`} className="flex items-center gap-1 bg-primary/10 text-primary rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap">
              {b} BHK <button onClick={() => removeFilter('bedrooms', b)}><X className="w-3 h-3" /></button>
            </div>
          ))}
          {filters.propertyType?.map(pt => (
            <div key={pt} className="flex items-center gap-1 bg-primary/10 text-primary rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap">
              {formatPropertyType(pt)} <button onClick={() => removeFilter('propertyType', pt)}><X className="w-3 h-3" /></button>
            </div>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="px-4 py-4 pb-28">
        <div className="mb-4 text-sm font-medium text-slate-600">
          {results.length} properties found
        </div>
        
        {results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <SearchX className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">No properties found</h3>
            <p className="text-slate-500 mb-6 text-sm max-w-[250px]">
              Try adjusting your filters or searching for a different locality.
            </p>
            <button onClick={clearAllFilters} className="px-6 py-2 bg-primary text-white font-medium rounded-xl btn-press">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {results.map((property) => (
              <Link key={property.id} to={`/property/${property.id}`} className="bg-white rounded-2xl border border-slate-200 overflow-hidden card-press block">
                <div className="relative h-48">
                  <img src={property.coverImageUrl || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'} alt={property.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-slate-800 text-xs font-bold px-2.5 py-1 rounded-lg">
                    {timeAgo(property.createdAt)}
                  </div>
                  {property.isVerified && (
                    <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
                      Verified
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-base font-bold text-slate-800 line-clamp-1">{property.title}</h3>
                  </div>
                  <div className="flex items-center text-slate-500 text-xs mb-3">
                    <MapPin className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                    <span className="truncate">{property.locality}, {property.city}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mb-4">
                    <div className="flex items-center bg-slate-50 px-2 py-1 rounded-md">
                      <Bed className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> {property.bedrooms} Bed
                    </div>
                    <div className="flex items-center bg-slate-50 px-2 py-1 rounded-md">
                      <Bath className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> {property.bathrooms} Bath
                    </div>
                    {property.carpetArea && (
                      <div className="flex items-center bg-slate-50 px-2 py-1 rounded-md">
                        <Maximize2 className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> {formatArea(property.carpetArea)}
                      </div>
                    )}
                  </div>
                  <div className="flex items-end justify-between mt-2 pt-3 border-t border-slate-100">
                    <div>
                      <div className="text-xl font-black text-slate-800">
                        {getDisplayPrice(property)}
                      </div>
                      {property.listingType === 'rent' && property.securityDeposit && (
                        <div className="text-xs text-slate-500 mt-0.5">
                          Dep: ₹{property.securityDeposit.toLocaleString('en-IN')}
                        </div>
                      )}
                    </div>
                    <div className="text-xs font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-lg">
                      {formatPropertyType(property.propertyType)}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Sort Sheet via portal */}
      {showSortSheet && (
        <ModalSheet onClose={() => setShowSortSheet(false)} title="Sort Properties" showClose>
          <div className="px-4 pb-4 space-y-2">
            {[
              { id: 'newest',     label: 'Newest First',         sub: 'Recently listed properties first' },
              { id: 'price_asc',  label: 'Price: Low to High',   sub: 'Most affordable first' },
              { id: 'price_desc', label: 'Price: High to Low',   sub: 'Most expensive first' },
              { id: 'area_desc',  label: 'Largest Area',         sub: 'Biggest carpet area first' },
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => { setSortOption(opt.id); setShowSortSheet(false); showToast('Sorting updated'); }}
                className={`w-full flex items-center p-4 rounded-2xl border text-left ${sortOption === opt.id ? 'bg-primary/5 border-primary/30' : 'bg-slate-50 border-transparent'} btn-press`}
              >
                <div className="flex-1">
                  <p className={`font-semibold text-sm ${sortOption === opt.id ? 'text-primary' : 'text-slate-800'}`}>{opt.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{opt.sub}</p>
                </div>
                {sortOption === opt.id && <CheckCircle2 size={18} className="text-primary shrink-0" />}
              </button>
            ))}
          </div>
        </ModalSheet>
      )}

      {/* Filter Sheet via portal */}
      {showFilterSheet && (
        <ModalSheet onClose={() => setShowFilterSheet(false)} title="Filters" showClose height="88vh">
          <div className="px-5 pb-4 space-y-6">
            {/* City */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">City</label>
              <div className="flex flex-wrap gap-2">
                {CITIES.map(city => (
                  <button
                    key={city.name}
                    onClick={() => setSheetFilters({ ...sheetFilters, city: sheetFilters.city === city.name ? '' : city.name })}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors btn-press ${sheetFilters.city === city.name ? 'bg-primary text-white border-primary' : 'bg-white text-slate-600 border-slate-200'}`}
                  >
                    {city.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">Price Range</label>
              <div className="flex gap-3 items-center">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">₹</span>
                  <input type="number" placeholder="Min" className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                    value={sheetFilters.minPrice || ''} onChange={e => setSheetFilters({ ...sheetFilters, minPrice: e.target.value ? Number(e.target.value) : undefined })} />
                </div>
                <div className="w-4 h-px bg-slate-300" />
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">₹</span>
                  <input type="number" placeholder="Max" className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                    value={sheetFilters.maxPrice || ''} onChange={e => setSheetFilters({ ...sheetFilters, maxPrice: e.target.value ? Number(e.target.value) : undefined })} />
                </div>
              </div>
            </div>

            {/* BHK */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">BHK Type</label>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map(b => (
                  <button key={b} onClick={() => toggleSheetArray('bedrooms', b)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold border transition-colors btn-press ${sheetFilters.bedrooms?.includes(b) ? 'bg-primary text-white border-primary' : 'bg-white text-slate-600 border-slate-200'}`}>
                    {b} BHK
                  </button>
                ))}
              </div>
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">Property Type</label>
              <div className="flex flex-wrap gap-2">
                {['apartment', 'house', 'villa', 'builder_floor', 'studio', 'plot'].map(pt => (
                  <button key={pt} onClick={() => toggleSheetArray('propertyType', pt)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors btn-press ${sheetFilters.propertyType?.includes(pt as PropertyType) ? 'bg-primary text-white border-primary' : 'bg-white text-slate-600 border-slate-200'}`}>
                    {formatPropertyType(pt as PropertyType)}
                  </button>
                ))}
              </div>
            </div>

            {/* Furnishing */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">Furnishing</label>
              <div className="flex flex-wrap gap-2">
                {(['unfurnished', 'semi_furnished', 'fully_furnished'] as FurnishingStatus[]).map(f => (
                  <button key={f} onClick={() => toggleSheetArray('furnishing', f)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors btn-press ${sheetFilters.furnishing?.includes(f) ? 'bg-primary text-white border-primary' : 'bg-white text-slate-600 border-slate-200'}`}>
                    {formatFurnishing(f)}
                  </button>
                ))}
              </div>
            </div>

            {/* Apply / Clear */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button onClick={clearAllFilters} className="py-3.5 text-slate-700 font-bold border-2 border-slate-200 rounded-xl btn-press">
                Clear All
              </button>
              <button onClick={applyFilters} className="py-3.5 bg-primary text-white font-bold rounded-xl btn-press">
                Apply Filters
              </button>
            </div>
          </div>
        </ModalSheet>
      )}
    </div>
  );
}
