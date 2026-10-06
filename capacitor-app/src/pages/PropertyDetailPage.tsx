import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Heart, Share2, MapPin, Bed, Bath, Maximize2, Building, Calendar, Compass, Shield, CheckCircle2, Phone, MessageCircle, Scale, Copy } from 'lucide-react'
import { MOCK_PROPERTIES } from '../mockData'
import { getDisplayPrice, formatArea, timeAgo, formatPropertyType, formatFurnishing } from '../utils'
import { useFavorites, useCompare } from '../AppContext'
import PropertyCard from '../components/PropertyCard'

export default function PropertyDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const property = MOCK_PROPERTIES.find(p => p.id === id)
  const { toggleFavorite, isFavorited } = useFavorites()
  const { addToCompare, compareList } = useCompare()
  
  const [currentImageIdx, setCurrentImageIdx] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [showContact, setShowContact] = useState(false)
  const [expandedDesc, setExpandedDesc] = useState(false)

  if (!property) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="text-6xl mb-4">🏠</div>
        <h2 className="text-2xl font-bold text-slate-800">Property Not Found</h2>
        <p className="text-slate-500 mt-2 mb-8">This property might have been removed or doesn't exist.</p>
        <button onClick={() => navigate(-1)} className="px-6 py-3 bg-primary text-white rounded-xl font-bold">
          Go Back
        </button>
      </div>
    )
  }

  const favd = isFavorited(property.id)
  const isCompared = compareList.some(p => p.id === property.id)
  const images: string[] = property.images?.map(img => typeof img === 'string' ? img : img.url).filter(Boolean) as string[]
  if (!images.length && property.coverImageUrl) images.push(property.coverImageUrl)

  const onTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX)
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return
    const touchEnd = e.changedTouches[0].clientX
    const distance = touchStart - touchEnd
    if (distance > 50 && currentImageIdx < images.length - 1) setCurrentImageIdx(prev => prev + 1)
    if (distance < -50 && currentImageIdx > 0) setCurrentImageIdx(prev => prev - 1)
  }

  const handleContactOwner = () => setShowContact(true)

  const isSold = property.status === 'sold' || property.status === 'rented'

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Gallery */}
        <div 
          className="relative h-[300px] bg-slate-200"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <img src={images[currentImageIdx]} alt="Property" className="w-full h-full object-cover" />
          
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />
          
          {/* Top floating actions */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center safe-top">
            <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-sm">
              <ArrowLeft size={20} className="text-slate-800" />
            </button>
            <div className="flex gap-2">
              <button className="w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-sm">
                <Share2 size={18} className="text-slate-800" />
              </button>
              <button onClick={() => toggleFavorite(property)} className="w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-sm">
                <Heart size={18} fill={favd ? '#ef4444' : 'none'} stroke={favd ? '#ef4444' : '#1e293b'} />
              </button>
            </div>
          </div>

          {/* Image counter & dots */}
          <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-2">
            <div className="bg-black/60 text-white text-xs font-medium px-3 py-1 rounded-full">
              {currentImageIdx + 1} / {images.length}
            </div>
            <div className="flex gap-1.5">
              {images.map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all ${i === currentImageIdx ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`} />
              ))}
            </div>
          </div>
          
          {isSold && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
              <span className="text-white text-3xl font-extrabold border-4 border-white px-6 py-3 rounded-xl rotate-[-12deg]">
                {property.status === 'sold' ? 'SOLD' : 'RENTED'}
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          {/* Badges */}
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-white text-xs font-bold px-2.5 py-1 rounded-md ${property.listingType === 'rent' ? 'bg-purple-600' : 'bg-amber-500'}`}>
              FOR {property.listingType === 'buy' ? 'SALE' : 'RENT'}
            </span>
            {property.isVerified && (
              <span className="flex items-center gap-1 bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-md">
                <Shield size={12} /> Verified
              </span>
            )}
          </div>

          {/* Price & Title */}
          <h1 className={`text-3xl font-extrabold ${property.listingType === 'rent' ? 'text-purple-600' : 'text-amber-600'}`}>
            {getDisplayPrice(property)}
            {property.listingType === 'rent' && <span className="text-base text-slate-500 font-medium">/month</span>}
          </h1>
          <h2 className="text-lg font-semibold text-slate-800 mt-2">{property.title}</h2>
          <div className="flex items-center gap-1.5 mt-2 text-slate-500">
            <MapPin size={16} />
            <span>{property.locality}, {property.city}</span>
          </div>

          {/* Core Specs Bar */}
          <div className="bg-slate-50 rounded-2xl p-4 mt-6 flex items-center justify-between border border-slate-100">
            <div className="text-center flex-1 border-r border-slate-200 last:border-0">
              <div className="flex justify-center text-slate-400 mb-1"><Bed size={20} /></div>
              <div className="font-bold text-slate-800">{property.bedrooms}</div>
              <div className="text-xs text-slate-500">Beds</div>
            </div>
            <div className="text-center flex-1 border-r border-slate-200">
              <div className="flex justify-center text-slate-400 mb-1"><Bath size={20} /></div>
              <div className="font-bold text-slate-800">{property.bathrooms}</div>
              <div className="text-xs text-slate-500">Baths</div>
            </div>
            {property.carpetArea && (
              <div className="text-center flex-1 border-r border-slate-200">
                <div className="flex justify-center text-slate-400 mb-1"><Maximize2 size={20} /></div>
                <div className="font-bold text-slate-800">{formatArea(property.carpetArea)}</div>
                <div className="text-xs text-slate-500">Sq.ft</div>
              </div>
            )}
            <div className="text-center flex-1">
              <div className="flex justify-center text-slate-400 mb-1"><Building size={20} /></div>
              <div className="font-bold text-slate-800">{property.floorNumber ?? '—'}</div>
              <div className="text-xs text-slate-500">Floor</div>
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-500"><Building size={18} /></div>
              <div>
                <div className="text-xs text-slate-400">Type</div>
                <div className="text-sm font-semibold text-slate-800">{formatPropertyType(property.propertyType)}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-500"><CheckCircle2 size={18} /></div>
              <div>
                <div className="text-xs text-slate-400">Furnishing</div>
                <div className="text-sm font-semibold text-slate-800">{formatFurnishing(property.furnishingStatus)}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-500"><Calendar size={18} /></div>
              <div>
                <div className="text-xs text-slate-400">Age</div>
                <div className="text-sm font-semibold text-slate-800">{property.propertyAge != null ? `${property.propertyAge} Years` : 'New'}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-500"><Compass size={18} /></div>
              <div>
                <div className="text-xs text-slate-400">Facing</div>
                <div className="text-sm font-semibold text-slate-800">{property.facing || 'Not specified'}</div>
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100 my-6" />

          {/* Description */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">About Property</h3>
            <p className={`text-slate-600 text-sm leading-relaxed ${!expandedDesc && 'line-clamp-3'}`}>
              {property.description}
            </p>
            {(property.description?.length ?? 0) > 150 && (
              <button onClick={() => setExpandedDesc(!expandedDesc)} className="text-primary font-medium text-sm mt-2">
                {expandedDesc ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>

          <div className="h-px bg-slate-100 my-6" />

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4">Amenities</h3>
              <div className="grid grid-cols-3 gap-y-4">
                {property.amenities.map(amenity => (
                  <div key={amenity} className="flex flex-col items-center text-center gap-1.5">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-xl shadow-sm border border-slate-100">
                      {amenity === 'gym' ? '🏋️' : amenity === 'pool' ? '🏊' : amenity === 'security' ? '👮' : amenity === 'parking' ? '🚗' : amenity === 'elevator' ? '🛗' : '✨'}
                    </div>
                    <span className="text-xs font-medium text-slate-600 capitalize">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="h-px bg-slate-100 my-6" />

          {/* Location */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-3">Location</h3>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="font-semibold text-slate-800">{property.locality}</div>
                <div className="text-sm text-slate-500 mt-0.5">{property.city}</div>
              </div>
              <button className="p-2 bg-white rounded-lg shadow-sm text-slate-600 active:bg-slate-100">
                <Copy size={18} />
              </button>
            </div>
            <button className="w-full mt-3 py-2.5 text-primary font-semibold bg-primary/5 rounded-xl border border-primary/10">
              Open in Maps
            </button>
          </div>

          <div className="h-px bg-slate-100 my-6" />

          {/* Owner Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center text-white text-xl font-bold shadow-sm">
              {property.owner?.name?.charAt(0) || 'O'}
            </div>
            <div className="flex-1">
              <div className="font-bold text-slate-800 text-lg">
                {property.owner?.name?.split(' ')[0]} {property.owner?.name?.split(' ')[1]?.charAt(0) || ''}.
              </div>
              <div className="text-xs font-medium text-emerald-600 bg-emerald-50 inline-block px-2 py-0.5 rounded-full mt-1">Verified Owner</div>
              <div className="text-xs text-slate-400 mt-1">Listed {timeAgo(property.createdAt)}</div>
            </div>
          </div>

          {/* Similar properties */}
          <div className="mt-8 mb-4">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Similar Properties</h3>
            <div className="flex overflow-x-auto hide-scrollbar gap-4 pb-2 -mx-4 px-4">
              {MOCK_PROPERTIES.filter(p => p.id !== property.id && p.city === property.city).slice(0, 3).map(p => (
                <PropertyCard key={p.id} property={p} compact />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 pb-8 flex gap-3 safe-bottom z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => toggleFavorite(property)}
          className="w-14 h-14 border border-slate-200 rounded-xl flex items-center justify-center active:bg-slate-50"
        >
          <Heart size={24} fill={favd ? '#ef4444' : 'none'} stroke={favd ? '#ef4444' : '#64748b'} />
        </button>
        <button 
          onClick={() => addToCompare(property)}
          className={`w-14 h-14 border rounded-xl flex items-center justify-center active:bg-slate-50 ${isCompared ? 'border-primary text-primary bg-primary/5' : 'border-slate-200 text-slate-500'}`}
        >
          <Scale size={24} />
        </button>
        <button 
          disabled={isSold}
          onClick={handleContactOwner}
          className={`flex-1 rounded-xl font-bold text-lg text-white shadow-md active:opacity-90 ${isSold ? 'bg-slate-400' : 'bg-primary'}`}
        >
          {isSold ? 'Sold Out' : 'Contact Owner'}
        </button>
      </div>

      {/* Contact Bottom Sheet */}
      {showContact && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowContact(false)} />
          <div className="relative bg-white rounded-t-3xl p-6 pb-12 animate-slide-up">
            <h3 className="text-xl font-bold text-slate-900 mb-1">Contact Owner</h3>
            <p className="text-slate-500 text-sm mb-6">Reach out to {property.owner?.name} regarding {property.title}</p>
            
            <div className="space-y-3">
              <a 
                href={`tel:+91${property.owner?.phone?.replace(/\D/g, '') || '9999999999'}`}
                className="w-full py-4 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 text-lg"
              >
                <Phone size={20} /> Call Now
              </a>
              <a 
                href={`https://wa.me/91${property.owner?.phone?.replace(/\D/g, '') || '9999999999'}?text=Hi`}
                target="_blank" rel="noreferrer"
                className="w-full py-4 bg-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 text-lg"
              >
                <MessageCircle size={20} /> WhatsApp
              </a>
            </div>
            
            <button onClick={() => setShowContact(false)} className="w-full mt-4 py-3 text-slate-500 font-medium">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
