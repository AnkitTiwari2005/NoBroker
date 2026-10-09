import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, Trash2, X, Plus } from 'lucide-react';
import { useCompare } from '../AppContext';
import { Property } from '../types';
import { getDisplayPrice, formatArea, formatPropertyType, formatFurnishing } from '../utils';

export default function ComparePage() {
  const navigate = useNavigate();
  const { compareList, removeFromCompare, clearCompare } = useCompare();

  if (compareList.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 page-enter" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <Scale className="w-12 h-12 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center">Nothing to Compare</h2>
        <p className="text-slate-500 mb-8 text-center max-w-[280px]">Add properties using the Scale button on any listing to compare them side by side.</p>
        <button onClick={() => navigate('/search')} className="px-8 py-3 bg-primary text-white rounded-xl font-bold btn-press">
          Browse Properties
        </button>
      </div>
    );
  }

  const specs = [
    { label: 'Price', getValue: (p: Property) => getDisplayPrice(p), highlightMin: true },
    { label: 'City', getValue: (p: Property) => p.city },
    { label: 'Type', getValue: (p: Property) => formatPropertyType(p.propertyType) },
    { label: 'Beds', getValue: (p: Property) => p.bedrooms, highlightMax: true },
    { label: 'Baths', getValue: (p: Property) => p.bathrooms },
    { label: 'Area', getValue: (p: Property) => p.carpetArea ? formatArea(p.carpetArea) : 'N/A', highlightMax: true },
    { label: 'Furnishing', getValue: (p: Property) => formatFurnishing(p.furnishingStatus) },
    { label: 'Age', getValue: (p: Property) => p.propertyAge != null ? `${p.propertyAge} yrs` : 'New', highlightMin: true },
    { label: 'Parking', getValue: (p: Property) => p.parking || 'None' },
    { label: 'Amenities', getValue: (p: Property) => `${(p.amenities || []).length} amenities` },
  ];

  // Calculate best values for highlighting
  const bestValues: Record<number, any> = {};
  
  specs.forEach((spec, idx) => {
    if (spec.highlightMin || spec.highlightMax) {
      let values = compareList.map(p => {
        if (spec.label === 'Price') return p.price || p.monthlyRent || 0;
        if (spec.label === 'Age') return p.propertyAge != null ? p.propertyAge : 0; // 'New' = 0
        if (spec.label === 'Area') return p.carpetArea || 0;
        if (spec.label === 'Beds') return p.bedrooms || 0;
        return 0;
      });
      
      const best = spec.highlightMin ? Math.min(...values) : Math.max(...values);
      bestValues[idx] = best;
    }
  });

  const checkHighlight = (specIdx: number, p: Property) => {
    const spec = specs[specIdx];
    if (!spec.highlightMin && !spec.highlightMax) return false;
    
    let val = 0;
    if (spec.label === 'Price') val = p.price || p.monthlyRent || 0;
    if (spec.label === 'Age') val = p.propertyAge != null ? p.propertyAge : 0;
    if (spec.label === 'Area') val = p.carpetArea || 0;
    if (spec.label === 'Beds') val = p.bedrooms || 0;

    return val === bestValues[specIdx] && val !== 0;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col page-enter">
      <div className="bg-white px-4 py-3 border-b flex items-center justify-between sticky top-0 z-20" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
        <div className="flex items-center gap-2">
          <Scale className="w-6 h-6 text-primary" />
          <h1 className="text-lg font-bold text-slate-800">Compare</h1>
        </div>
        <button onClick={clearCompare} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full btn-press transition-colors">
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="w-full overflow-x-auto p-4 pb-28">
        <div className="flex gap-4 min-w-max">
          {/* Label Column */}
          <div className="w-24 shrink-0 pt-36 pb-4 bg-slate-50 sticky left-0 z-10 border-r border-slate-200/50">
            {specs.map((spec, idx) => (
              <div key={idx} className="h-14 flex items-center text-xs font-bold text-slate-500 px-2">
                {spec.label}
              </div>
            ))}
          </div>

          {/* Property Columns */}
          {compareList.map(property => (
            <div key={property.id} className="w-48 shrink-0 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
              <div className="h-32 relative">
                <img src={property.coverImageUrl} className="w-full h-full object-cover" alt="Property" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <button onClick={() => removeFromCompare(property.id)} className="absolute top-2 right-2 p-1.5 bg-black/40 backdrop-blur rounded-full text-white btn-press">
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-2 right-2 text-white font-bold text-sm truncate drop-shadow-md">
                  {property.title}
                </div>
              </div>

              <div className="flex-1">
                {specs.map((spec, idx) => {
                  const isBest = checkHighlight(idx, property);
                  return (
                    <div key={idx} className={`h-14 flex items-center px-3 border-b border-slate-100 last:border-0 text-sm font-medium ${isBest ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700'}`}>
                      {spec.getValue(property)}
                    </div>
                  );
                })}
              </div>

              <div className="p-3 border-t border-slate-100 bg-slate-50">
                <button onClick={() => navigate(`/property/${property.id}`)} className="w-full py-2 bg-primary text-white text-sm font-bold rounded-lg btn-press">
                  View Details
                </button>
              </div>
            </div>
          ))}

          {/* Add Placeholder */}
          {compareList.length < 3 && (
            <div className="w-48 shrink-0 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center p-6 btn-press cursor-pointer bg-slate-50/50" onClick={() => navigate('/search')}>
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
                <Plus className="w-6 h-6" />
              </div>
              <span className="font-bold text-slate-600 text-sm">Add Property</span>
              <span className="text-xs text-slate-400 mt-1">{3 - compareList.length} slots left</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
