import React, { useState, useMemo } from 'react';
import AdminLayout from './AdminLayout';
import { useToast } from '../../ToastContext';
import { Phone, MessageCircle, Search, CheckCircle2, Clock, X } from 'lucide-react';

type LeadStatus = 'all' | 'new' | 'contacted' | 'closed';

interface Lead {
  id: number;
  property: string;
  city: string;
  seekerName: string;
  seekerPhone: string;
  ownerName: string;
  type: 'Phone' | 'WhatsApp';
  status: 'new' | 'contacted' | 'closed';
  time: string;
}

const INITIAL_LEADS: Lead[] = [
  { id: 1,  property: 'Sea-View 2 BHK Bandra West',     city: 'Mumbai',    seekerName: 'Rahul Sharma',  seekerPhone: '+91 98765 43210', ownerName: 'Amit Kumar',   type: 'Phone',    status: 'new',       time: '2 mins ago'  },
  { id: 2,  property: 'Premium 4 BHK Villa Whitefield', city: 'Bangalore', seekerName: 'Priya Patel',   seekerPhone: '+91 98765 43211', ownerName: 'Rahul Sharma', type: 'WhatsApp', status: 'contacted', time: '1 hour ago'  },
  { id: 3,  property: 'Cozy Studio Electronic City',    city: 'Bangalore', seekerName: 'Amit Kumar',    seekerPhone: '+91 98765 43212', ownerName: 'Priya Patel',  type: 'Phone',    status: 'new',       time: '3 hours ago' },
  { id: 4,  property: 'Luxury Penthouse Juhu',          city: 'Mumbai',    seekerName: 'Neha Singh',    seekerPhone: '+91 98765 43213', ownerName: 'Rahul Sharma', type: 'WhatsApp', status: 'closed',    time: '5 hours ago' },
  { id: 5,  property: '3 BHK Builder Floor Hauz Khas',  city: 'Delhi',     seekerName: 'Arjun Kapoor',  seekerPhone: '+91 97700 11223', ownerName: 'Amit Kumar',   type: 'Phone',    status: 'new',       time: '1 day ago'   },
  { id: 6,  property: 'Modern 2 BHK Indiranagar',      city: 'Bangalore', seekerName: 'Deepika Rao',   seekerPhone: '+91 90001 22334', ownerName: 'Priya Patel',  type: 'WhatsApp', status: 'contacted', time: '1 day ago'   },
  { id: 7,  property: '3 BHK Jubilee Hills',           city: 'Hyderabad', seekerName: 'Vikram Nair',   seekerPhone: '+91 91234 56789', ownerName: 'Amit Kumar',   type: 'Phone',    status: 'closed',    time: '2 days ago'  },
  { id: 8,  property: '2 BHK near Besant Nagar Beach', city: 'Chennai',   seekerName: 'Sunita Mehta',  seekerPhone: '+91 99887 66554', ownerName: 'Rahul Sharma', type: 'WhatsApp', status: 'new',       time: '2 days ago'  },
];

const STATUS_STYLES: Record<string, string> = {
  new:       'bg-blue-100 text-blue-700',
  contacted: 'bg-amber-100 text-amber-700',
  closed:    'bg-emerald-100 text-emerald-700',
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  new:       <Clock size={11} />,
  contacted: <Phone size={11} />,
  closed:    <CheckCircle2 size={11} />,
};

export default function AdminLeads() {
  const { showToast } = useToast();
  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [query,        setQuery]        = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus>('all');

  const filtered = useMemo(() => leads.filter(l => {
    const matchQ = !query || l.seekerName.toLowerCase().includes(query.toLowerCase()) ||
      l.property.toLowerCase().includes(query.toLowerCase());
    const matchS = statusFilter === 'all' || l.status === statusFilter;
    return matchQ && matchS;
  }), [leads, query, statusFilter]);

  const markContacted = (id: number) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status: 'contacted' } : l));
    showToast('Lead marked as contacted');
  };

  const markClosed = (id: number) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status: 'closed' } : l));
    showToast('Lead closed');
  };

  const newCount       = leads.filter(l => l.status === 'new').length;
  const contactedCount = leads.filter(l => l.status === 'contacted').length;
  const closedCount    = leads.filter(l => l.status === 'closed').length;
  const phoneCount     = leads.filter(l => l.type === 'Phone').length;
  const waCount        = leads.filter(l => l.type === 'WhatsApp').length;

  const statusTabs: { key: LeadStatus; label: string; count: number }[] = [
    { key: 'all',       label: 'All',       count: leads.length    },
    { key: 'new',       label: 'New',       count: newCount        },
    { key: 'contacted', label: 'Contacted', count: contactedCount  },
    { key: 'closed',    label: 'Closed',    count: closedCount     },
  ];

  return (
    <AdminLayout>
      <div className="p-4 space-y-4 page-enter">

        <div className="flex items-center justify-between">
          <h1 className="text-xl font-black text-slate-800">Leads</h1>
          <span className="text-sm text-slate-400">{filtered.length} leads</span>
        </div>

        {/* Contact type breakdown */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Phone size={18} />
            </div>
            <div>
              <p className="font-black text-xl text-slate-800">{phoneCount}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Phone Calls</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <MessageCircle size={18} />
            </div>
            <div>
              <p className="font-black text-xl text-slate-800">{waCount}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase">WhatsApp</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search leads..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
          />
        </div>

        {/* Status filter */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {statusTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors btn-press ${
                statusFilter === tab.key
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-slate-500 border-slate-200'
              }`}
            >
              {tab.label} <span className="opacity-60">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* Leads list */}
        {filtered.length === 0 ? (
          <div className="py-12 text-center">
            <Phone size={40} className="mx-auto mb-3 text-slate-200" />
            <p className="font-bold text-slate-500">No leads found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(lead => (
              <div key={lead.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 text-sm truncate">{lead.property}</p>
                    <p className="text-xs text-slate-400">{lead.city}</p>
                  </div>
                  <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full shrink-0 ${STATUS_STYLES[lead.status]}`}>
                    {STATUS_ICONS[lead.status]}
                    {lead.status.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${lead.type === 'WhatsApp' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                    {lead.type === 'WhatsApp' ? <MessageCircle size={15} /> : <Phone size={15} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-700 text-sm">{lead.seekerName}</p>
                    <p className="text-xs text-slate-400">{lead.seekerPhone} • via {lead.type}</p>
                  </div>
                  <p className="text-[10px] text-slate-300 shrink-0">{lead.time}</p>
                </div>

                <p className="text-xs text-slate-400 mt-2">Owner: <span className="font-semibold text-slate-600">{lead.ownerName}</span></p>

                {/* Actions */}
                {lead.status !== 'closed' && (
                  <div className="flex gap-2 mt-3 pt-3 border-t border-slate-50">
                    {lead.status === 'new' && (
                      <button
                        onClick={() => markContacted(lead.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-amber-50 text-amber-600 text-xs font-bold rounded-xl btn-press border border-amber-100"
                      >
                        <Phone size={12} /> Mark Contacted
                      </button>
                    )}
                    <button
                      onClick={() => markClosed(lead.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-xl btn-press border border-emerald-100"
                    >
                      <CheckCircle2 size={12} /> Close Lead
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
