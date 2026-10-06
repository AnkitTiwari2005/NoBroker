import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Scale, X, Trash2 } from 'lucide-react'
import { useCompare } from '../AppContext'
import { getDisplayPrice, formatArea, formatPropertyType, formatFurnishing } from '../utils'

export default function ComparePage() {
  const navigate = useNavigate()
  const { compareList, removeFromCompare, clearCompare } = useCompare()

  if (compareList.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="text-6xl mb-6">⚖️</div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Nothing to compare</h2>
        <p className="text-slate-500 mb-8 max-w-xs">Add properties to comparison to see them side-by-side.</p>
        <button onClick={() => navigate('/search')} className="w-full max-w-xs py-3.5 bg-primary text-white font-bold rounded-xl active:opacity-90">
          Browse Properties
        </button>
      </div>
    )
  }

  const specs = [
    { label: 'Price', getValue: (p: any) => getDisplayPrice(p), highlightMin: true },
    { label: 'City', getValue: (p: any) => p.city },
    { label: 'Type', getValue: (p: any) => formatPropertyType(p.propertyType) },
    { label: 'Beds', getValue: (p: any) => p.bedrooms, highlightMax: true },
    { label: 'Baths', getValue: (p: any) => p.bathrooms },
    { label: 'Area', getValue: (p: any) => p.carpetArea ? formatArea(p.carpetArea) : 'N/A', highlightMax: true },
    { label: 'Furnishing', getValue: (p: any) => formatFurnishing(p.furnishingStatus) },
    { label: 'Age', getValue: (p: any) => `${p.ageYears} Yrs`, highlightMin: true },
  ]

  // Helper to determine highlighting
  const getHighlightIndices = (spec: any) => {
    if (!spec.highlightMin && !spec.highlightMax) return []
    const vals = compareList.map(p => {
      if (spec.label === 'Price') return p.price
      if (spec.label === 'Beds') return p.bedrooms
      if (spec.label === 'Area') return p.carpetArea || 0
      if (spec.label === 'Age') return p.propertyAge || 99
      return 0
    })
    
    const numVals = vals.map(v => v ?? 0) as number[]
    let targetVal = spec.highlightMax ? Math.max(...numVals) : Math.min(...numVals)
    return numVals.map((v, i) => v === targetVal && v > 0 ? i : -1).filter(i => i !== -1)
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="bg-white px-4 py-4 shadow-sm z-10 flex items-center justify-between border-b border-slate-100">
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Scale size={20} className="text-primary" /> Compare Properties
        </h1>
        <button onClick={clearCompare} className="text-sm text-red-500 font-medium flex items-center gap-1">
          <Trash2 size={16} /> Clear
        </button>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-auto pb-24">
        <div className="min-w-max p-4 flex">
          {/* Labels column */}
          <div className="w-24 flex-shrink-0 flex flex-col">
            <div className="h-32 mb-4"></div> {/* Spacer for image */}
            {specs.map(spec => (
              <div key={spec.label} className="h-14 flex items-center text-sm font-semibold text-slate-500">
                {spec.label}
              </div>
            ))}
          </div>

          {/* Properties columns */}
          {compareList.map((property, idx) => (
            <div key={property.id} className="w-44 flex-shrink-0 flex flex-col px-2 border-l border-slate-100 first:border-l-0">
              <div className="h-32 mb-4 relative rounded-xl overflow-hidden bg-slate-100">
                <img src={property.coverImageUrl} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 p-2">
                  <div className="text-white text-xs font-bold truncate">{property.title}</div>
                </div>
                <button 
                  onClick={() => removeFromCompare(property.id)}
                  className="absolute top-1 right-1 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center backdrop-blur"
                >
                  <X size={14} />
                </button>
              </div>

              {specs.map(spec => {
                const highlights = getHighlightIndices(spec)
                const isHighlighted = highlights.includes(idx)
                return (
                  <div key={spec.label} className={`h-14 flex items-center justify-center text-sm text-center px-2 rounded-lg ${isHighlighted ? 'bg-green-50 text-green-700 font-bold' : 'text-slate-800 font-medium'}`}>
                    {spec.getValue(property)}
                  </div>
                )
              })}
              
              <button 
                onClick={() => navigate(`/property/${property.id}`)}
                className="mt-4 py-2 bg-primary/10 text-primary font-bold text-sm rounded-lg"
              >
                View
              </button>
            </div>
          ))}

          {/* Add more placeholder */}
          {compareList.length < 3 && (
            <div className="w-44 flex-shrink-0 flex flex-col px-2 border-l border-slate-100 items-center justify-center">
              <div onClick={() => navigate('/search')} className="w-16 h-16 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 mb-2 cursor-pointer active:bg-slate-50">
                <span className="text-2xl">+</span>
              </div>
              <div className="text-sm font-medium text-slate-500">Add Property</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
