import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, MapPin, Bed, Bath, Maximize2, Phone, MessageCircle, Star, BadgeCheck } from 'lucide-react'
import { Property } from '../types'
import { getDisplayPrice, formatArea, timeAgo, formatPropertyType, formatFurnishing } from '../utils'
import { useFavorites } from '../AppContext'

interface Props {
  property: Property
  compact?: boolean
}

export default function PropertyCard({ property, compact = false }: Props) {
  const navigate = useNavigate()
  const { toggleFavorite, isFavorited } = useFavorites()
  const favd = isFavorited(property.id)

  const handleContact = (e: React.MouseEvent, type: 'phone' | 'whatsapp') => {
    e.stopPropagation()
    const phone = property.owner?.phone?.replace(/\D/g, '') || '9999999999'
    if (type === 'phone') window.location.href = `tel:+91${phone.slice(-10)}`
    else window.open(`https://wa.me/91${phone.slice(-10)}?text=${encodeURIComponent(`Hi! I'm interested in your property "${property.title}" listed on NoBroker. Please share more details.`)}`, '_blank')
  }

  const isSold = property.status === 'sold' || property.status === 'rented'

  return (
    <div
      onClick={() => navigate(`/property/${property.id}`)}
      className={`bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden active:opacity-90 cursor-pointer ${compact ? 'w-72 flex-shrink-0' : 'w-full'}`}
    >
      {/* Image */}
      <div className="relative" style={{ height: compact ? 160 : 200 }}>
        <img
          src={property.coverImageUrl || 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800'}
          alt={property.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`text-white text-xs font-bold px-2.5 py-1 rounded-full ${
            property.listingType === 'rent' ? 'bg-purple-600' : 'bg-amber-500'
          }`}>
            {property.listingType === 'buy' ? 'BUY' : 'RENT'}
          </span>
          {property.status === 'featured' && (
            <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <Star size={10} fill="currentColor" /> Featured
            </span>
          )}
        </div>

        {/* Favorite button */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleFavorite(property) }}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow"
        >
          <Heart size={16} fill={favd ? '#ef4444' : 'none'} stroke={favd ? '#ef4444' : '#666'} />
        </button>

        {/* Verified badge */}
        {property.isVerified && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-emerald-500/90 backdrop-blur text-white text-xs font-medium px-2 py-0.5 rounded-full">
            <BadgeCheck size={12} />
            Verified
          </div>
        )}

        {/* Image count */}
        {property.images && property.images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
            {property.images.length} Photos
          </div>
        )}

        {/* Sold/Rented overlay */}
        {isSold && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white text-xl font-bold border-4 border-white/70 px-4 py-2 rounded-lg rotate-[-12deg]">
              {property.status === 'sold' ? 'SOLD' : 'RENTED'}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Price */}
        <div className={`text-2xl font-bold ${
          property.listingType === 'rent' ? 'text-purple-600' : 'text-amber-600'
        }`}>
          {getDisplayPrice(property)}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-slate-900 text-base mt-0.5 line-clamp-1">{property.title}</h3>

        {/* Location */}
        <div className="flex items-center gap-1 mt-1 text-slate-500 text-sm">
          <MapPin size={13} className="flex-shrink-0" />
          <span className="truncate">{property.locality}, {property.city}</span>
        </div>

        {/* Specs */}
        {property.bedrooms > 0 && (
          <div className="flex items-center gap-3 mt-3 text-slate-600 text-sm">
            <span className="flex items-center gap-1"><Bed size={14} /> {property.bedrooms} Beds</span>
            <span className="text-slate-300">|</span>
            <span className="flex items-center gap-1"><Bath size={14} /> {property.bathrooms} Baths</span>
            {property.carpetArea && (
              <>
                <span className="text-slate-300">|</span>
                <span className="flex items-center gap-1"><Maximize2 size={14} /> {formatArea(property.carpetArea)}</span>
              </>
            )}
          </div>
        )}

        {/* Tags */}
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">
            {formatPropertyType(property.propertyType)}
          </span>
          <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">
            {formatFurnishing(property.furnishingStatus)}
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
          <span className="text-slate-400 text-xs">{timeAgo(property.createdAt)}</span>
          {!isSold && (
            <div className="flex gap-2">
              <button
                onClick={(e) => handleContact(e, 'phone')}
                className="w-8 h-8 bg-primary rounded-full flex items-center justify-center active:opacity-70"
              >
                <Phone size={14} color="white" />
              </button>
              <button
                onClick={(e) => handleContact(e, 'whatsapp')}
                className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center active:opacity-70"
              >
                <MessageCircle size={14} color="white" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
