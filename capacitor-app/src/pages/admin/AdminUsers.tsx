import React, { useState, useMemo } from 'react';
import AdminLayout from './AdminLayout';
import { useToast } from '../../ToastContext';
import {
  Search, UserCheck, UserX, ShieldCheck, Clock,
  Building2, Star, Users, Phone, MoreVertical
} from 'lucide-react';

type UserRole = 'all' | 'seeker' | 'owner';
type UserStatus = 'active' | 'disabled';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'seeker' | 'owner';
  isVerified: boolean;
  isActive: boolean;
  listings: number;
  joinedDays: number;
  avatarUrl?: string | null;
}

const INITIAL_USERS: AdminUser[] = [
  { id: 'u1', name: 'Rahul Sharma',   email: 'rahul@owner.com',   phone: '+91 98765 43210', role: 'owner',  isVerified: true,  isActive: true,  listings: 4,  joinedDays: 120 },
  { id: 'u2', name: 'Priya Patel',    email: 'priya@owner.com',   phone: '+91 98765 43211', role: 'owner',  isVerified: true,  isActive: true,  listings: 3,  joinedDays: 85  },
  { id: 'u3', name: 'Amit Kumar',     email: 'amit@owner.com',    phone: '+91 98765 43212', role: 'owner',  isVerified: false, isActive: true,  listings: 1,  joinedDays: 14  },
  { id: 'u4', name: 'Neha Singh',     email: 'neha@seeker.com',   phone: '+91 98765 43213', role: 'seeker', isVerified: false, isActive: true,  listings: 0,  joinedDays: 32  },
  { id: 'u5', name: 'Arjun Kapoor',   email: 'test@nobroker.com', phone: '+91 97700 11223', role: 'seeker', isVerified: false, isActive: true,  listings: 0,  joinedDays: 8   },
  { id: 'u6', name: 'Deepika Rao',    email: 'deepika@seeker.com',phone: '+91 90001 22334', role: 'seeker', isVerified: false, isActive: true,  listings: 0,  joinedDays: 45  },
  { id: 'u7', name: 'Vikram Nair',    email: 'vikram@owner.com',  phone: '+91 91234 56789', role: 'owner',  isVerified: false, isActive: false, listings: 2,  joinedDays: 200 },
  { id: 'u8', name: 'Sunita Mehta',   email: 'sunita@seeker.com', phone: '+91 99887 66554', role: 'seeker', isVerified: false, isActive: true,  listings: 0,  joinedDays: 3   },
];

const ROLE_STYLES: Record<string, string> = {
  owner:  'bg-purple-100 text-purple-700',
  seeker: 'bg-blue-100 text-blue-700',
  admin:  'bg-amber-100 text-amber-700',
};

export default function AdminUsers() {
  const { showToast } = useToast();
  const [users, setUsers] = useState(INITIAL_USERS);
  const [query, setQuery]           = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole>('all');
  const [menuOpen,   setMenuOpen]   = useState<string | null>(null);

  const filtered = useMemo(() => users.filter(u => {
    const matchQ = !query || u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase());
    const matchR = roleFilter === 'all' || u.role === roleFilter;
    return matchQ && matchR;
  }), [users, query, roleFilter]);

  const toggleActive = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u));
    const u = users.find(u => u.id === id);
    showToast(u?.isActive ? 'User account disabled' : 'User account re-enabled');
    setMenuOpen(null);
  };

  const verifyOwner = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, isVerified: true } : u));
    showToast('✓ Owner verified — their listings can now be published');
    setMenuOpen(null);
  };

  const ownerCount  = users.filter(u => u.role === 'owner').length;
  const seekerCount = users.filter(u => u.role === 'seeker').length;
  const pendingVerification = users.filter(u => u.role === 'owner' && !u.isVerified).length;

  return (
    <AdminLayout>
      <div className="p-4 space-y-4 page-enter">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-black text-slate-800">Users</h1>
          <span className="text-sm text-slate-400 font-medium">{filtered.length} users</span>
        </div>

        {/* Mini stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm text-center">
            <Users size={18} className="mx-auto mb-1 text-slate-400" />
            <p className="font-black text-lg text-slate-800">{users.length}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Total</p>
          </div>
          <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm text-center">
            <Building2 size={18} className="mx-auto mb-1 text-purple-400" />
            <p className="font-black text-lg text-slate-800">{ownerCount}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Owners</p>
          </div>
          <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm text-center">
            <Clock size={18} className="mx-auto mb-1 text-amber-400" />
            <p className="font-black text-lg text-slate-800">{pendingVerification}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Unverified</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
          />
        </div>

        {/* Role filter */}
        <div className="flex gap-2">
          {(['all', 'owner', 'seeker'] as UserRole[]).map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors btn-press ${
                roleFilter === r ? 'bg-primary text-white border-primary' : 'bg-white text-slate-500 border-slate-200'
              }`}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        {/* Users list */}
        {filtered.length === 0 ? (
          <div className="py-12 text-center">
            <Users size={40} className="mx-auto mb-3 text-slate-200" />
            <p className="font-bold text-slate-500">No users found</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filtered.map(user => (
              <div key={user.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 p-3">
                  {/* Avatar */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg shrink-0 ${
                    user.role === 'owner' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                  } ${!user.isActive ? 'opacity-40' : ''}`}>
                    {user.name.charAt(0)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className={`font-bold text-sm ${!user.isActive ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                        {user.name}
                      </p>
                      {user.isVerified && <ShieldCheck size={13} className="text-emerald-500 shrink-0" />}
                    </div>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ROLE_STYLES[user.role]}`}>
                        {user.role.toUpperCase()}
                      </span>
                      {user.role === 'owner' && (
                        <span className="text-[10px] text-slate-400">{user.listings} listing{user.listings !== 1 ? 's' : ''}</span>
                      )}
                      {!user.isActive && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600">DISABLED</span>
                      )}
                      <span className="text-[10px] text-slate-300 ml-auto">{user.joinedDays}d ago</span>
                    </div>
                  </div>

                  {/* Menu button */}
                  <button
                    onClick={() => setMenuOpen(menuOpen === user.id ? null : user.id)}
                    className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 btn-press"
                  >
                    <MoreVertical size={14} className="text-slate-400" />
                  </button>
                </div>

                {/* Action row */}
                {menuOpen === user.id && (
                  <div className="flex gap-2 p-3 pt-0">
                    {user.role === 'owner' && !user.isVerified && (
                      <button
                        onClick={() => verifyOwner(user.id)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500 text-white text-xs font-bold rounded-xl btn-press flex-1"
                      >
                        <UserCheck size={13} /> Verify Owner
                      </button>
                    )}
                    <button
                      onClick={() => toggleActive(user.id)}
                      className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl btn-press flex-1 ${
                        user.isActive
                          ? 'bg-red-50 text-red-500 border border-red-100'
                          : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      }`}
                    >
                      {user.isActive ? <><UserX size={13} /> Disable</> : <><UserCheck size={13} /> Enable</>}
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
