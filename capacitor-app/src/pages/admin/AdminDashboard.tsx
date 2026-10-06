import React from 'react';
import AdminLayout from './AdminLayout';
import { MOCK_PROPERTIES } from '../../mockData';
import { useToast } from '../../ToastContext';
import { Building2, Users, Clock, CheckCircle2, XCircle, Phone, MessageCircle, BarChart3 } from 'lucide-react';

export default function AdminDashboard() {
  const { showToast } = useToast();

  const totalProperties = MOCK_PROPERTIES.length;
  const activeProperties = MOCK_PROPERTIES.filter(p => p.status === 'published' || p.status === 'featured').length;
  const pendingProperties = MOCK_PROPERTIES.filter(p => p.status === 'pending');
  const totalUsers = 347;

  const handleApprove = (id: string) => {
    showToast('Property approved');
  };

  const handleReject = (id: string) => {
    showToast('Property rejected');
  };

  return (
    <AdminLayout>
      <div className="p-4 page-enter">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <BarChart3 className="w-6 h-6 mr-2 text-primary" />
          Dashboard Overview
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
            <Building2 className="w-8 h-8 text-blue-500 mb-2" />
            <span className="text-3xl font-bold text-gray-800">{totalProperties}</span>
            <span className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-medium">Total Properties</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
            <CheckCircle2 className="w-8 h-8 text-green-500 mb-2" />
            <span className="text-3xl font-bold text-gray-800">{activeProperties}</span>
            <span className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-medium">Active / Published</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
            <Clock className="w-8 h-8 text-amber-500 mb-2" />
            <span className="text-3xl font-bold text-gray-800">{pendingProperties.length}</span>
            <span className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-medium">Pending Review</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
            <Users className="w-8 h-8 text-purple-500 mb-2" />
            <span className="text-3xl font-bold text-gray-800">{totalUsers}</span>
            <span className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-medium">Total Users</span>
          </div>
        </div>

        <h3 className="text-lg font-bold text-gray-800 mb-3">Pending Approvals</h3>
        <div className="space-y-3 mb-8">
          {pendingProperties.slice(0, 3).map(property => (
            <div key={property.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-sm truncate w-40">{property.title}</h4>
                <p className="text-xs text-gray-500">{property.city} • By {property.owner?.name}</p>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => handleApprove(property.id)} className="p-2 bg-green-50 text-green-600 rounded-full btn-press">
                  <CheckCircle2 className="w-5 h-5" />
                </button>
                <button onClick={() => handleReject(property.id)} className="p-2 bg-red-50 text-red-600 rounded-full btn-press">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
          {pendingProperties.length === 0 && (
            <div className="text-center p-4 text-gray-500 bg-gray-50 rounded-lg">No pending properties</div>
          )}
        </div>

        <h3 className="text-lg font-bold text-gray-800 mb-3">Recent Leads</h3>
        <div className="space-y-3">
          {[
            { id: 1, prop: 'Modern Apartment 2BHK', seeker: 'Rahul Sharma', type: 'Phone', time: '2 mins ago', icon: Phone },
            { id: 2, prop: 'Luxury Villa Indiranagar', seeker: 'Priya Patel', type: 'WhatsApp', time: '1 hour ago', icon: MessageCircle },
            { id: 3, prop: 'Cozy Studio HSR', seeker: 'Amit Kumar', type: 'Phone', time: '3 hours ago', icon: Phone }
          ].map(lead => (
            <div key={lead.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex items-center">
              <div className={`p-2 rounded-full mr-3 ${lead.type === 'WhatsApp' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                <lead.icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm">{lead.seeker}</h4>
                <p className="text-xs text-gray-500 truncate w-48">{lead.prop}</p>
              </div>
              <span className="text-xs text-gray-400">{lead.time}</span>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};
