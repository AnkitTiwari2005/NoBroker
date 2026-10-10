import React, { useState, useMemo } from 'react';
import AdminLayout from './AdminLayout';
import { MOCK_PROPERTIES } from '../../mockData';
import { useToast } from '../../ToastContext';
import {
  Search, SlidersHorizontal, CheckCircle2, XCircle, Star,
  Eye, Trash2, Home, MapPin, Bed, Bath, Building2,
  MoreVertical, ShieldCheck, Clock, BadgeCheck
} from 'lucide-react';
import { getDisplayPrice } from '../../utils';

type Status = 'all' | 'published' | 'pending' | 'featured' | 'rejected';

const STATUS_STYLES: Record<string, string> = {
  published: 'bg-emerald-100 text-emerald-700',
  featured:  'bg-blue-100 text-blue-700',
  pending:   'bg-amber-100 text-amber-700',
  rejected:  'bg-red-100 text-red-700',
  draft:     'bg-slate-100 text-slate-500',
  sold:      'bg-purple-100 text-purple-700',
  rented:    'bg-indigo-100 text-indigo-700',
};

// Augment mock properties with editable status
function useProperties() {
  const initial = MOCK_PROPERTIES.map((p, i) => ({
    ...p,
    status: (i === 3 || i === 7 ? 'pending' : (p.status || 'published')) as string,
    isVerified: p.isVerified || false,
  }));
  const [props, setProps] = useState(initial);

  const approve = (id: string)  => setProps(prev => prev.map(p => p.id === id ? { ...p, status: 'published' } : p));
  const reject  = (id: string)  => setProps(prev => prev.map(p => p.id === id ? { ...p, status: 'rejected'  } : p));
  const feature = (id: string)  => setProps(prev => prev.map(p => p.id === id ? { ...p, status: 'featured'  } : p));
  const verify  = (id: string)  => setProps(prev => prev.map(p => p.id === id ? { ...p, isVerified: true    } : p));
  const remove  = (id: string)  => setProps(prev => prev.filter(p => p.id !== id));

  return { props, approve, reject, feature, verify, remove };
}

export default function AdminProperties() {
  const { showToast } = useToast();
  const { props, approve, reject, feature, verify, remove } = useProperties();

  const [query,      setQuery]      = useState('');
  const [statusFilter, setStatusFilter] = useState<Status>('all');
  const [menuOpen,   setMenuOpen]   = useState<string | null>(null);

  const filtered = useMemo(() => {
    return props.filter(p => {
      const matchQ = !query || p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.city.toLowerCase().includes(query.toLowerCase()) ||
        p.locality.toLowerCase().includes(query.toLowerCase());
      const matchS = statusFilter === 'all' || p.status === statusFilter;
      return matchQ && matchS;
    });
  }, [props, query, statusFilter]);

  const statusTabs: { key: Status; label: string }[] = [
    { key: 'all',       label: 'All' },
    { key: 'pending',   label: 'Pending' },
    { key: 'published', label: 'Live' },
    { key: 'featured',  label: 'Featured' },
    { key: 'rejected',  label: 'Rejected' },
  ];

  const handleAction = (action: string, id: string) => {
    setMenuOpen(null);
    switch (action) {
      case 'approve': approve(id); showToast('✓ Property published'); break;
      case 'reject':  reject(id);  showToast('Property rejected'); break;
      case 'feature': feature(id); showToast('★ Featured! Property promoted'); break;
      case 'verify':  verify(id);  showToast('✓ Property verified'); break;
      case 'delete':  remove(id);  showToast('Property deleted'); break;
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 space-y-4 page-enter">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-black text-slate-800">Properties</h1>
          <span className="text-sm text-slate-400 font-medium">{filtered.length} listings</span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, city, locality..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
          />
        </div>

        {/* Status filter tabs */}
        <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-hide">
          {statusTabs.map(tab => {
            const count = tab.key === 'all' ? props.length : props.filter(p => p.status === tab.key).length;
            return (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors btn-press ${
                  statusFilter === tab.key
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-slate-500 border-slate-200'
                }`}
              >
                {tab.label} {count > 0 && <span className="opacity-60">({count})</span>}
              </button>
            );
          })}
        </div>

        {/* Properties list */}
        {filtered.length === 0 ? (
          <div className="py-12 text-center">
            <Building2 size={40} className="mx-auto mb-3 text-slate-200" />
            <p className="font-bold text-slate-500">No properties found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(prop => (
              <div key={prop.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="flex gap-3 p-3">
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                    {(prop.images?.[0]?.url || prop.coverImageUrl) ? (
                      <img src={prop.images?.[0]?.url || prop.coverImageUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Home size={24} className="text-slate-200" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2 flex-1">{prop.title}</h3>
                      <button
                        onClick={() => setMenuOpen(menuOpen === prop.id ? null : prop.id)}
                        className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 btn-press"
                      >
                        <MoreVertical size={14} className="text-slate-500" />
                      </button>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin size={11} className="text-slate-400 shrink-0" />
                      <span className="text-xs text-slate-400 truncate">{prop.locality}, {prop.city}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${STATUS_STYLES[prop.status] || 'bg-slate-100 text-slate-500'}`}>
                        {prop.status}
                      </span>
                      {prop.isVerified && (
                        <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-600">
                          <ShieldCheck size={10} /> Verified
                        </span>
                      )}
                      <span className="text-xs font-bold text-primary ml-auto">
                        {getDisplayPrice(prop as any)}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">By {prop.owner?.name || 'Unknown'} • {prop.bedrooms > 0 ? `${prop.bedrooms} BHK` : prop.propertyType}</p>
                  </div>
                </div>

                {/* Action dropdown */}
                {menuOpen === prop.id && (
                  <div className="border-t border-slate-50 bg-slate-50 p-2 flex flex-wrap gap-2">
                    {prop.status === 'pending' && (
                      <>
                        <button onClick={() => handleAction('approve', prop.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded-xl btn-press">
                          <CheckCircle2 size={13} /> Approve
                        </button>
                        <button onClick={() => handleAction('reject', prop.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-xl btn-press">
                          <XCircle size={13} /> Reject
                        </button>
                      </>
                    )}
                    {prop.status === 'published' && (
                      <button onClick={() => handleAction('feature', prop.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 text-white text-xs font-bold rounded-xl btn-press">
                        <Star size={13} /> Feature
                      </button>
                    )}
                    {!prop.isVerified && (
                      <button onClick={() => handleAction('verify', prop.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white text-xs font-bold rounded-xl btn-press">
                        <BadgeCheck size={13} /> Verify
                      </button>
                    )}
                    <button onClick={() => handleAction('delete', prop.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-500 text-xs font-bold rounded-xl btn-press border border-red-100">
                      <Trash2 size={13} /> Delete
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
