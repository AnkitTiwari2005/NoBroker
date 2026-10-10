import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { MOCK_PROPERTIES } from '../../mockData';
import { useToast } from '../../ToastContext';
import {
  Building2, Users, Clock, CheckCircle2, XCircle, Phone, MessageCircle,
  TrendingUp, Star, Home, BarChart3, ArrowUpRight, Eye, ShieldCheck, AlertTriangle
} from 'lucide-react';

type MockProperty = typeof MOCK_PROPERTIES[0] & { status?: string };

// Extended mock with some pending
const PENDING_PROPS: MockProperty[] = [
  {
    ...MOCK_PROPERTIES[3],
    status: 'pending',
    owner: { id: 'o1', name: 'Priya Patel', phone: '+91 98765 43211', avatarUrl: null, isVerified: true },
  },
  {
    ...MOCK_PROPERTIES[7],
    status: 'pending',
    owner: { id: 'o2', name: 'Amit Kumar', phone: '+91 98765 43212', avatarUrl: null, isVerified: false },
  },
];

const RECENT_LEADS = [
  { id: 1, property: 'Sea-View 2 BHK Bandra', seeker: 'Rahul Sharma', phone: '+91 9876543210', type: 'Phone',    time: '2 mins ago',  status: 'new' },
  { id: 2, property: 'Luxury Villa Whitefield', seeker: 'Priya Patel',  phone: '+91 9876543211', type: 'WhatsApp', time: '1 hour ago',  status: 'contacted' },
  { id: 3, property: 'Studio Electronic City', seeker: 'Amit Kumar',   phone: '+91 9876543212', type: 'Phone',    time: '3 hours ago', status: 'new' },
  { id: 4, property: 'Penthouse Juhu',         seeker: 'Neha Singh',   phone: '+91 9876543213', type: 'WhatsApp', time: '5 hours ago', status: 'closed' },
];

export default function AdminDashboard() {
  const { showToast } = useToast();
  const [pendingList, setPendingList] = useState(PENDING_PROPS);
  const [recentLeads]                = useState(RECENT_LEADS);

  const totalProperties  = MOCK_PROPERTIES.length;
  const activeProperties = MOCK_PROPERTIES.filter(p => !p.status || p.status === 'published' || p.status === 'featured').length;
  const featuredCount    = MOCK_PROPERTIES.filter(p => p.status === 'featured').length;
  const totalUsers       = 347;
  const newThisWeek      = 12;

  const handleApprove = (id: string) => {
    setPendingList(prev => prev.filter(p => p.id !== id));
    showToast('✓ Property approved and published');
  };

  const handleReject = (id: string) => {
    setPendingList(prev => prev.filter(p => p.id !== id));
    showToast('Property rejected and owner notified');
  };

  const stats = [
    { label: 'Total',    value: totalProperties,  icon: Building2,    color: 'bg-blue-500',    light: 'bg-blue-50 text-blue-600'   },
    { label: 'Active',   value: activeProperties,  icon: CheckCircle2, color: 'bg-emerald-500', light: 'bg-emerald-50 text-emerald-600' },
    { label: 'Pending',  value: pendingList.length + 1, icon: Clock,  color: 'bg-amber-500',   light: 'bg-amber-50 text-amber-600'  },
    { label: 'Users',    value: totalUsers,         icon: Users,        color: 'bg-purple-500',  light: 'bg-purple-50 text-purple-600' },
    { label: 'Featured', value: featuredCount,      icon: Star,         color: 'bg-pink-500',    light: 'bg-pink-50 text-pink-600'    },
    { label: 'New/Week', value: newThisWeek,         icon: TrendingUp,   color: 'bg-indigo-500',  light: 'bg-indigo-50 text-indigo-600' },
  ];

  const statusColor: Record<string, string> = {
    new:       'bg-blue-100 text-blue-700',
    contacted: 'bg-amber-100 text-amber-700',
    closed:    'bg-emerald-100 text-emerald-700',
  };

  return (
    <AdminLayout>
      <div className="p-4 space-y-6 page-enter">

        {/* Welcome banner */}
        <div className="bg-gradient-to-r from-[#0F172A] to-[#1E3A5F] rounded-2xl p-5 text-white">
          <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-1">Good {new Date().getHours() < 12 ? 'Morning' : 'Afternoon'}</p>
          <h1 className="text-xl font-black">Dashboard Overview</h1>
          <p className="text-white/50 text-sm mt-1">Here's what's happening on NoBroker today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <div className={`w-10 h-10 rounded-xl ${s.light} flex items-center justify-center mb-2`}>
                <s.icon size={20} />
              </div>
              <span className="text-2xl font-black text-slate-800">{s.value}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Pending Approvals */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <AlertTriangle size={16} className="text-amber-500" />
              Pending Approvals
              {pendingList.length > 0 && (
                <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full font-bold">{pendingList.length}</span>
              )}
            </h2>
          </div>

          {pendingList.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 text-center border border-slate-100">
              <ShieldCheck size={32} className="mx-auto mb-2 text-emerald-400" />
              <p className="font-bold text-slate-700">All caught up!</p>
              <p className="text-sm text-slate-400 mt-1">No pending listings to review.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingList.map(prop => (
                <div key={prop.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="flex gap-3 p-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                      {prop.images?.[0]?.url || prop.coverImageUrl ? (
                        <img
                          src={prop.images?.[0]?.url || prop.coverImageUrl}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Home size={20} className="text-slate-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2">{prop.title}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{prop.locality}, {prop.city}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-xs text-slate-500">By</span>
                        <span className={`text-xs font-semibold ${prop.owner?.isVerified ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {prop.owner?.name}
                        </span>
                        {prop.owner?.isVerified && <ShieldCheck size={11} className="text-emerald-500" />}
                      </div>
                    </div>
                  </div>
                  <div className="flex border-t border-slate-50">
                    <button
                      onClick={() => handleReject(prop.id)}
                      className="flex-1 py-2.5 flex items-center justify-center gap-1.5 text-red-500 font-bold text-sm border-r border-slate-50 active:bg-red-50"
                    >
                      <XCircle size={16} /> Reject
                    </button>
                    <button
                      onClick={() => handleApprove(prop.id)}
                      className="flex-1 py-2.5 flex items-center justify-center gap-1.5 text-emerald-600 font-bold text-sm active:bg-emerald-50"
                    >
                      <CheckCircle2 size={16} /> Approve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Leads */}
        <div>
          <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-3">
            <Phone size={16} className="text-blue-500" />
            Recent Leads
          </h2>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {recentLeads.map((lead, i) => (
              <div key={lead.id} className={`flex items-center px-4 py-3 gap-3 ${i < recentLeads.length - 1 ? 'border-b border-slate-50' : ''}`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${lead.type === 'WhatsApp' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                  {lead.type === 'WhatsApp' ? <MessageCircle size={16} /> : <Phone size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 text-sm truncate">{lead.seeker}</p>
                  <p className="text-xs text-slate-400 truncate">{lead.property}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColor[lead.status]}`}>
                    {lead.status.toUpperCase()}
                  </span>
                  <p className="text-[10px] text-slate-300 mt-1">{lead.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
