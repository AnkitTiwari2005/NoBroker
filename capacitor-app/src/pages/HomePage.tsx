import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Building2, Home, Sofa, Map, Search, ChevronRight } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { FEATURED_PROPERTIES, CITIES, MOCK_PROPERTIES } from '../mockData';
import PropertyCard from '../components/PropertyCard';

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listingType, setListingType] = useState<'buy' | 'rent'>('rent');
  const [showNotifications, setShowNotifications] = useState(false);

  // Mock notifications
  const unreadCount = 2;
  const notifications = [
    { id: 1, title: 'New property match', body: 'A new 2BHK in Indiranagar matches your search.', time: '2 hours ago' },
    { id: 2, title: 'Price dropped', body: 'Price dropped for Modern Apartment.', time: '1 day ago' },
  ];

  const handleListingTypeToggle = (type: 'buy' | 'rent') => {
    setListingType(type);
    navigate(`/search?listingType=${type}`);
  };

  const handleSearchClick = () => {
    navigate(`/search?listingType=${listingType}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 page-enter">
      {/* Header */}
      <div className="bg-[#1E3A5F] text-white pt-safe" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
        <div className="px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">NoBroker</h1>
          <button onClick={() => setShowNotifications(true)} className="relative p-2 btn-press">
            <Bell className={`w-6 h-6 ${unreadCount > 0 ? 'text-amber-500' : 'text-white'}`} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#1E3A5F]" />
            )}
          </button>
        </div>

        {/* Hero Section */}
        <div className="px-4 pb-8 pt-2">
          <div className="flex bg-white/10 rounded-lg p-1 mb-6">
            <button
              onClick={() => handleListingTypeToggle('rent')}
              className={`flex-1 py-2 rounded-md text-sm font-semibold transition-colors btn-press ${listingType === 'rent' ? 'bg-white text-[#1E3A5F]' : 'text-white/80'}`}
            >
              RENT
            </button>
            <button
              onClick={() => handleListingTypeToggle('buy')}
              className={`flex-1 py-2 rounded-md text-sm font-semibold transition-colors btn-press ${listingType === 'buy' ? 'bg-white text-[#1E3A5F]' : 'text-white/80'}`}
            >
              BUY
            </button>
          </div>

          <button onClick={handleSearchClick} className="w-full bg-white text-gray-500 p-4 rounded-xl shadow-lg flex items-center justify-between btn-press">
            <div className="flex items-center">
              <Search className="w-5 h-5 mr-3 text-gray-400" />
              <span>Search in Bangalore...</span>
            </div>
            <div className="bg-[#1E3A5F] text-white p-2 rounded-lg">
              <Search className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>

      <div className="px-4 -mt-4">
        {/* Quick Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex overflow-x-auto space-x-3 scrollbar-hide pb-2">
          {['1 BHK', '2 BHK', '3 BHK'].map(bhk => (
            <button key={bhk} onClick={() => navigate(`/search?bedrooms=${bhk.charAt(0)}&listingType=${listingType}`)} className="flex-shrink-0 border border-gray-200 rounded-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 btn-press card-press">
              {bhk}
            </button>
          ))}
          <div className="w-px h-8 bg-gray-200 mx-1 self-center" />
          {[
            { label: 'Villa', icon: Home, type: 'villa' },
            { label: 'Studio', icon: Sofa, type: 'studio' },
            { label: 'Plot', icon: Map, type: 'plot' },
          ].map(pt => (
            <button key={pt.type} onClick={() => navigate(`/search?propertyType=${pt.type}`)} className="flex-shrink-0 flex items-center border border-gray-200 rounded-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 btn-press card-press">
              <pt.icon className="w-4 h-4 mr-2 text-gray-500" />
              {pt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Properties Horizontal Scroll */}
      <div className="mb-8 pl-4">
        <div className="flex justify-between items-center pr-4 mb-4">
          <h2 className="text-lg font-bold text-gray-800">Featured Properties</h2>
          <button onClick={() => navigate('/search')} className="text-sm font-semibold text-primary btn-press">View All</button>
        </div>
        <div className="flex overflow-x-auto space-x-4 pb-4 pr-4 scrollbar-hide">
          {FEATURED_PROPERTIES.map(prop => (
            <div key={prop.id} className="w-72 flex-shrink-0 card-press">
              <PropertyCard property={prop} compact />
            </div>
          ))}
        </div>
      </div>

      {/* Browse by City */}
      <div className="px-4 mb-8">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Browse by City</h2>
        <div className="grid grid-cols-2 gap-4">
          {CITIES.slice(0, 4).map(city => (
            <button key={city.name} onClick={() => navigate(`/search?city=${city.name}`)} className="relative h-24 rounded-xl overflow-hidden btn-press card-press">
              <img src={city.image} alt={city.name} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
                <span className="font-bold">{city.name}</span>
                <span className="text-xs text-white/80">{city.count} properties</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Property Types */}
      <div className="pl-4 mb-8">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Property Types</h2>
        <div className="flex overflow-x-auto space-x-4 pb-2 pr-4 scrollbar-hide">
          {[
            { type: 'Apartment', icon: Building2 },
            { type: 'Villa', icon: Home },
            { type: 'House', icon: Home },
            { type: 'Studio', icon: Sofa },
            { type: 'Plot', icon: Map },
          ].map(pt => (
            <button key={pt.type} onClick={() => navigate(`/search?propertyType=${pt.type.toLowerCase()}`)} className="flex-shrink-0 flex flex-col items-center btn-press card-press">
              <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-2 border border-gray-100">
                <pt.icon className="w-8 h-8 text-[#1E3A5F]" />
              </div>
              <span className="text-xs font-medium text-gray-700">{pt.type}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Latest Properties */}
      <div className="px-4 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">Latest Properties</h2>
          <button onClick={() => navigate('/search')} className="text-sm font-semibold text-primary btn-press flex items-center">
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-4">
          {MOCK_PROPERTIES.slice(0, 3).map(prop => (
            <div key={prop.id} className="card-press">
              <PropertyCard property={prop} />
            </div>
          ))}
        </div>
      </div>

      {/* Notifications Bottom Sheet */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowNotifications(false)} />
          <div className="bg-white rounded-t-2xl p-4 sheet-enter relative z-10 max-h-[80vh] flex flex-col">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Notifications</h2>
              <button onClick={() => setShowNotifications(false)} className="text-primary text-sm font-medium btn-press">Mark all read</button>
            </div>
            <div className="overflow-y-auto space-y-3">
              {notifications.map(n => (
                <div key={n.id} className="p-3 bg-gray-50 rounded-lg flex items-start">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-full mr-3 mt-1">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{n.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{n.body}</p>
                    <span className="text-[10px] text-gray-400 mt-2 block">{n.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
