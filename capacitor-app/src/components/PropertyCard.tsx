import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bed, Bath, Maximize2, MapPin, Shield, Heart, Phone, MessageCircle, Star } from 'lucide-react';
import { Property } from '../types';
import { useFavorites } from '../AppContext';
import { getDisplayPrice, cleanPhone } from '../utils';

interface PropertyCardProps {
  property: Property;
  compact?: boolean;
}

export default function PropertyCard({ property, compact = false }: PropertyCardProps) {
  const navigate = useNavigate();
  const { isFavorited, toggleFavorite } = useFavorites();
  const favorite = isFavorited(property.id);

  const handleToggleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(property);
  };

  const getStatusBadge = () => {
    if (property.status === 'sold') return <div className="absolute top-2 left-2 bg-purple-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase">Sold</div>;
    if (property.status === 'rented') return <div className="absolute top-2 left-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase">Rented</div>;
    if (property.status === 'featured') return <div className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center uppercase"><Star className="w-3 h-3 mr-1" /> Featured</div>;
    if (property.isVerified) return <div className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center uppercase"><Shield className="w-3 h-3 mr-1" /> Verified</div>;
    return null;
  };

  return (
    <div onClick={() => navigate(`/property/${property.id}`)} className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden card-press ${compact ? 'flex flex-col' : 'flex flex-col'}`}>
      <div className={`relative ${compact ? 'h-32' : 'h-48'}`}>
        <img src={property.coverImageUrl || property.images?.[0]?.url || 'https://images.unsplash.com/photo-1560518884-ce5882228f44?auto=format&fit=crop&w=400&q=80'} alt={property.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {getStatusBadge()}
        <button onClick={handleToggleFav} className="absolute top-2 right-2 p-2 bg-white/20 backdrop-blur-md rounded-full btn-press">
          <Heart className={`w-5 h-5 ${favorite ? 'fill-red-500 text-red-500' : 'text-white'}`} />
        </button>
        <div className="absolute bottom-2 left-2 flex space-x-2">
          <span className={`text-[10px] font-bold px-2 py-1 rounded text-white ${property.listingType === 'rent' ? 'bg-purple-600' : 'bg-amber-600'}`}>
            FOR {property.listingType.toUpperCase()}
          </span>
        </div>
      </div>
      <div className="p-3">
        <div className="flex justify-between items-start mb-1">
          <h3 className={`font-bold text-gray-800 line-clamp-1 ${compact ? 'text-sm' : 'text-base'}`}>{property.title}</h3>
          <span className="font-bold text-[#1E3A5F] whitespace-nowrap ml-2">₹{getDisplayPrice(property)}</span>
        </div>
        <p className="text-xs text-gray-500 flex items-center mb-3">
          <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
          <span className="truncate">{property.locality}, {property.city}</span>
        </p>
        
        {!compact && (
          <>
            <div className="flex items-center space-x-4 mb-4 text-gray-600">
              <div className="flex items-center text-xs"><Bed className="w-4 h-4 mr-1 text-gray-400" /> {property.bedrooms} Beds</div>
              <div className="flex items-center text-xs"><Bath className="w-4 h-4 mr-1 text-gray-400" /> {property.bathrooms} Baths</div>
              {property.carpetArea && <div className="flex items-center text-xs"><Maximize2 className="w-4 h-4 mr-1 text-gray-400" /> {property.carpetArea} sqft</div>}
            </div>
            
            <div className="flex space-x-2 border-t pt-3">
              <a href={`tel:${property.owner?.phone?.replace(/\D/g, '')}`} onClick={e => e.stopPropagation()} className="flex-1 flex items-center justify-center border border-primary text-primary rounded-lg py-2 text-sm font-medium btn-press">
                <Phone className="w-4 h-4 mr-2" /> Call
              </a>
              <a href={`https://wa.me/91${property.owner?.phone?.replace(/\D/g, '')}?text=Hi, I am interested in ${property.title}`} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="flex-1 flex items-center justify-center bg-green-500 text-white rounded-lg py-2 text-sm font-medium btn-press">
                <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
