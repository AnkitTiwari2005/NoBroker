import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Heart, Share2, MapPin, Bed, Bath, Maximize2, Building,
  Calendar, Compass, Shield, CheckCircle2, Phone, MessageCircle, Scale,
  Copy, MapIcon, Dumbbell, Waves, Wifi, Zap, Users, Leaf, Camera, Car, Star, Home
} from 'lucide-react';
import { MOCK_PROPERTIES } from '../mockData';
import { getDisplayPrice, formatArea, formatPropertyType, formatFurnishing, timeAgo } from '../utils';
import { useToast } from '../ToastContext';
import { useFavorites, useCompare } from '../AppContext';
import ModalSheet from '../components/ModalSheet';

const AMENITY_ICONS: Record<string, any> = {
  gym: Dumbbell, pool: Waves, security: Shield, lift: Building,
  elevator: Building, wifi: Wifi, power_backup: Zap, clubhouse: Users,
  garden: Leaf, intercom: Phone, cctv: Camera, parking: Car, default: Star
};

export default function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { isFavorited, toggleFavorite } = useFavorites();
  const { addToCompare } = useCompare();

  const property = MOCK_PROPERTIES.find(p => p.id === id);

  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [showContactSheet, setShowContactSheet] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!property) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 page-enter">
        <Home className="w-20 h-20 text-primary mb-6" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Property Not Found</h2>
        <p className="text-slate-500 mb-8 text-center">The property you are looking for might have been removed or is temporarily unavailable.</p>
        <button onClick={() => navigate(-1)} className="px-6 py-3 bg-primary text-white rounded-xl font-semibold btn-press">
          Go Back
        </button>
      </div>
    );
  }

  const images = property.images?.length ? property.images.map(i => i.url) : [property.coverImageUrl || ''];

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 50) setCurrentImageIdx(prev => Math.min(images.length - 1, prev + 1));
    if (diff < -50) setCurrentImageIdx(prev => Math.max(0, prev - 1));
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: property.title, url }); } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      showToast('Link copied to clipboard!');
    }
  };

  const handleCompare = () => {
    const result = addToCompare(property);
    if (result === 'added') showToast('Added to compare');
    if (result === 'already') showToast('Already in compare list', 'info');
    if (result === 'full') showToast('Compare limit reached (max 3)', 'error');
  };

  const cleanPhone = property.owner?.phone?.replace(/[^0-9]/g, '').slice(-10) || '0000000000';

  const similarProperties = MOCK_PROPERTIES.filter(p => 
    p.id !== property.id && p.city === property.city && p.listingType === property.listingType
  ).slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-50 page-enter" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 72px)' }}>
      {/* Gallery */}
      <div className="relative h-72 sm:h-96 bg-black" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        {images.map((img, idx) => (
          <img 
            key={idx} 
            src={img} 
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${idx === currentImageIdx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`} 
            alt="Property" 
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 z-10 pointer-events-none" />
        
        {/* Top actions */}
        <div className="absolute top-0 left-0 right-0 z-20 flex justify-between p-4 pt-safe" style={{ paddingTop: 'env(safe-area-inset-top, 16px)' }}>
          <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center btn-press shadow-sm">
            <ArrowLeft className="w-5 h-5 text-slate-800" />
          </button>
          <div className="flex gap-2">
            <button onClick={handleShare} className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center btn-press shadow-sm">
              <Share2 className="w-5 h-5 text-slate-800" />
            </button>
            <button onClick={() => toggleFavorite(property)} className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center btn-press shadow-sm">
              <Heart className={`w-5 h-5 ${isFavorited(property.id) ? 'fill-red-500 text-red-500' : 'text-slate-800'}`} />
            </button>
          </div>
        </div>

        {/* Counter & Dots */}
        {images.length > 1 && (
          <>
            <div className="absolute bottom-4 right-4 z-20 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full">
              {currentImageIdx + 1} / {images.length}
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
              {images.map((_, idx) => (
                <div key={idx} className={`w-1.5 h-1.5 rounded-full transition-colors ${idx === currentImageIdx ? 'bg-white w-3' : 'bg-white/50'}`} />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="p-4 bg-white rounded-b-3xl shadow-sm mb-2">
        <div className="flex justify-between items-start mb-2">
          <div className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-1 rounded-md mb-2 inline-block">
            {formatPropertyType(property.propertyType)} for {property.listingType === 'buy' ? 'Sale' : 'Rent'}
          </div>
          <div className="text-slate-500 text-xs flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> {timeAgo(property.createdAt)}
          </div>
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-1 leading-tight">{property.title}</h1>
        <div className="flex items-center text-slate-600 text-sm mb-4">
          <MapPin className="w-4 h-4 mr-1 text-slate-400 flex-shrink-0" />
          {property.locality}, {property.city}
        </div>
        
        <div className="text-3xl font-black text-slate-900 mb-1">
          {getDisplayPrice(property)}
        </div>
        {property.listingType === 'rent' && property.securityDeposit && (
          <div className="text-sm text-slate-500 mb-4">
            Security Deposit: ₹{property.securityDeposit.toLocaleString('en-IN')}
          </div>
        )}
      </div>

      {/* Specs Horizontal */}
      <div className="bg-white p-4 mb-2 flex overflow-x-auto no-scrollbar gap-4 shadow-sm border-y border-slate-100">
        <div className="flex flex-col min-w-[80px]">
          <span className="text-xs text-slate-500 mb-1 flex items-center gap-1"><Bed className="w-3.5 h-3.5" /> Bedrooms</span>
          <span className="font-bold text-slate-800">{property.bedrooms} BHK</span>
        </div>
        <div className="w-px h-8 bg-slate-200 self-center" />
        <div className="flex flex-col min-w-[80px]">
          <span className="text-xs text-slate-500 mb-1 flex items-center gap-1"><Bath className="w-3.5 h-3.5" /> Bathrooms</span>
          <span className="font-bold text-slate-800">{property.bathrooms} Baths</span>
        </div>
        <div className="w-px h-8 bg-slate-200 self-center" />
        <div className="flex flex-col min-w-[80px]">
          <span className="text-xs text-slate-500 mb-1 flex items-center gap-1"><Maximize2 className="w-3.5 h-3.5" /> Area</span>
          <span className="font-bold text-slate-800">{property.carpetArea ? formatArea(property.carpetArea) : 'N/A'}</span>
        </div>
        <div className="w-px h-8 bg-slate-200 self-center" />
        <div className="flex flex-col min-w-[80px]">
          <span className="text-xs text-slate-500 mb-1 flex items-center gap-1"><Building className="w-3.5 h-3.5" /> Floor</span>
          <span className="font-bold text-slate-800">{property.floorNumber ? `${property.floorNumber} / ${property.totalFloors}` : 'N/A'}</span>
        </div>
      </div>

      {/* Description */}
      {property.description && (
        <div className="bg-white p-5 mb-2 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-3">About Property</h3>
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{property.description}</p>
        </div>
      )}

      {/* Overview Grid */}
      <div className="bg-white p-5 mb-2 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-4">Overview</h3>
        <div className="grid grid-cols-2 gap-y-4 gap-x-6">
          <div>
            <div className="text-xs text-slate-500 mb-0.5">Furnishing</div>
            <div className="text-sm font-medium text-slate-800">{formatFurnishing(property.furnishingStatus)}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-0.5">Age of Property</div>
            <div className="text-sm font-medium text-slate-800">{property.propertyAge !== undefined ? `${property.propertyAge} Years` : 'N/A'}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-0.5">Facing</div>
            <div className="text-sm font-medium text-slate-800 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-slate-400" /> {property.facing || 'N/A'}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-0.5">Parking</div>
            <div className="text-sm font-medium text-slate-800 flex items-center gap-1">
              <Car className="w-3.5 h-3.5 text-slate-400" /> {property.parking || 'None'}
            </div>
          </div>
        </div>
      </div>

      {/* Amenities */}
      {property.amenities && property.amenities.length > 0 && (
        <div className="bg-white p-5 mb-2 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4">Amenities</h3>
          <div className="grid grid-cols-3 gap-4">
            {property.amenities.map((amenity, idx) => {
              const Icon = AMENITY_ICONS[amenity.toLowerCase()] || AMENITY_ICONS.default;
              return (
                <div key={idx} className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-2 text-slate-600">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-medium text-slate-700 capitalize">{amenity.replace(/_/g, ' ')}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Location */}
      <div className="bg-white p-5 mb-2 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-4">Location</h3>
        <div className="bg-slate-50 rounded-xl p-4 flex gap-3 items-start mb-4">
          <MapIcon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-800 mb-1">{property.locality}</p>
            <p className="text-xs text-slate-500 mb-2">{property.address}, {property.city}</p>
            {property.landmark && (
              <p className="text-xs text-slate-500"><span className="font-semibold">Landmark:</span> {property.landmark}</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(property.address + ', ' + property.city)}`)}
            className="flex items-center justify-center gap-2 py-2.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold btn-press"
          >
            <MapPin className="w-4 h-4" /> Open Maps
          </button>
          <button 
            onClick={() => { navigator.clipboard.writeText(`${property.address}, ${property.locality}, ${property.city}`); showToast('Address copied!'); }}
            className="flex items-center justify-center gap-2 py-2.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold btn-press"
          >
            <Copy className="w-4 h-4" /> Copy Address
          </button>
        </div>
      </div>

      {/* Owner Info */}
      {property.owner && (
        <div className="bg-white p-5 mb-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4">Listed By</h3>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-xl font-bold">
              {property.owner.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base font-bold text-slate-800">{property.owner.name}</span>
                {property.owner.isVerified && (
                  <Shield className="w-4 h-4 text-emerald-500 fill-emerald-100" />
                )}
              </div>
              <p className="text-xs text-slate-500">Listed {timeAgo(property.createdAt)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Similar Properties */}
      {similarProperties.length > 0 && (
        <div className="px-4 py-6 bg-white mb-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Similar Properties</h3>
          <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar -mx-4 px-4">
            {similarProperties.map(sim => (
              <Link key={sim.id} to={`/property/${sim.id}`} className="block w-64 shrink-0 bg-white border border-slate-200 rounded-2xl overflow-hidden card-press">
                <div className="h-32 relative">
                  <img src={sim.coverImageUrl} className="w-full h-full object-cover" alt={sim.title} />
                  <div className="absolute top-2 left-2 bg-white/90 text-slate-800 text-[10px] font-bold px-2 py-1 rounded-md">
                    {sim.bedrooms} BHK
                  </div>
                </div>
                <div className="p-3">
                  <div className="text-sm font-bold text-slate-800 truncate mb-1">{sim.title}</div>
                  <div className="text-xs text-slate-500 truncate mb-2">{sim.locality}</div>
                  <div className="text-base font-black text-slate-900">{getDisplayPrice(sim)}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Contact bar — rendered via portal so it sits above TabBar */}
      {ReactDOM.createPortal(
        <div
          className="fixed left-0 right-0 bg-white border-t border-slate-100 flex gap-3 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
          style={{
            bottom: 'calc(env(safe-area-inset-bottom, 0px) + 64px)',
            pointerEvents: 'auto',
          }}
        >
          <button onClick={handleCompare} className="w-12 h-12 rounded-xl border-2 border-slate-200 flex items-center justify-center text-slate-600 btn-press active:bg-slate-50">
            <Scale className="w-5 h-5" />
          </button>
          <button onClick={() => toggleFavorite(property)} className="w-12 h-12 rounded-xl border-2 border-slate-200 flex items-center justify-center btn-press active:bg-red-50">
            <Heart className={`w-5 h-5 ${isFavorited(property.id) ? 'fill-red-500 text-red-500' : 'text-slate-600'}`} />
          </button>
          <button
            onClick={() => setShowContactSheet(true)}
            className="flex-1 bg-primary text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 btn-press"
          >
            <Phone className="w-4 h-4" />
            Contact Owner
          </button>
        </div>,
        document.getElementById('modal-root')!
      )}

      {/* Contact Sheet via portal */}
      {showContactSheet && (
        <ModalSheet onClose={() => setShowContactSheet(false)} title={`Contact ${property.owner?.name || 'Owner'}`} showClose>
          <div className="px-5 pb-4 space-y-3">
            <p className="text-sm text-slate-500 -mt-1 mb-4">Choose how you'd like to connect with the owner.</p>
            <a
              href={`tel:+91${cleanPhone}`}
              className="flex items-center p-4 bg-slate-50 border border-slate-200 rounded-2xl btn-press"
            >
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-4">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-800">Call Now</div>
                <div className="text-sm text-slate-500">+91 {cleanPhone}</div>
              </div>
            </a>
            <a
              href={`https://wa.me/91${cleanPhone}?text=Hi, I am interested in your property: ${encodeURIComponent(property.title)}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center p-4 bg-emerald-50 border border-emerald-100 rounded-2xl btn-press"
            >
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mr-4">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-emerald-900">WhatsApp</div>
                <div className="text-sm text-emerald-700">Chat with owner directly</div>
              </div>
            </a>
          </div>
        </ModalSheet>
      )}
    </div>
  );
}
