import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { MOCK_PROPERTIES } from '../../mockData';
import { useToast } from '../../ToastContext';
import { Search, CheckCircle2, XCircle, Star, Tag } from 'lucide-react';
import { Property } from '../../types';

export default function AdminProperties() {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);

  const filteredProperties = properties.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const updateStatus = (id: string, status: Property['status']) => {
    setProperties(properties.map(p => p.id === id ? { ...p, status } : p));
    showToast(`Property marked as ${status}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'featured': return 'bg-blue-100 text-blue-800';
      case 'sold': return 'bg-purple-100 text-purple-800';
      case 'rented': return 'bg-indigo-100 text-indigo-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 page-enter">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Properties</h2>
        
        <div className="bg-white p-3 rounded-lg shadow-sm mb-4 border border-gray-200">
          <div className="relative mb-3">
            <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by title or city..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1E3A5F]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex overflow-x-auto space-x-2 pb-1 scrollbar-hide">
            {['All', 'Published', 'Pending', 'Featured', 'Sold', 'Rented', 'Rejected'].map(status => (
              <button 
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap btn-press ${statusFilter === status ? 'bg-[#1E3A5F] text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredProperties.map(property => (
            <div key={property.id} className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 flex flex-col">
              <div className="flex mb-3">
                <img src={property.coverImageUrl || property.images?.[0]?.url || 'https://images.unsplash.com/photo-1560518884-ce5882228f44?auto=format&fit=crop&w=200&q=80'} alt={property.title} className="w-20 h-20 rounded-lg object-cover mr-3" />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm line-clamp-2">{property.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{property.city} • {property.propertyType}</p>
                  <div className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mt-2 uppercase ${getStatusColor(property.status)}`}>
                    {property.status}
                  </div>
                </div>
              </div>
              
              <div className="flex border-t pt-3 justify-between">
                {property.status === 'pending' ? (
                  <>
                    <button onClick={() => updateStatus(property.id, 'published')} className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-3 py-1.5 rounded-lg btn-press">
                      <CheckCircle2 className="w-4 h-4 mr-1" /> Approve
                    </button>
                    <button onClick={() => updateStatus(property.id, 'rejected')} className="flex items-center text-xs font-medium text-red-600 bg-red-50 px-3 py-1.5 rounded-lg btn-press">
                      <XCircle className="w-4 h-4 mr-1" /> Reject
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => updateStatus(property.id, 'featured')} className="flex items-center text-xs font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg btn-press">
                      <Star className="w-4 h-4 mr-1" /> Feature
                    </button>
                    <button onClick={() => updateStatus(property.id, property.listingType === 'buy' ? 'sold' : 'rented')} className="flex items-center text-xs font-medium text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg btn-press">
                      <Tag className="w-4 h-4 mr-1" /> Mark {property.listingType === 'buy' ? 'Sold' : 'Rented'}
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
          {filteredProperties.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              No properties found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};
