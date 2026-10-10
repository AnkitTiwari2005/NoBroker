import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Users, PhoneCall, LogOut,
  Shield, ChevronRight, Bell, Menu, X
} from 'lucide-react';
import { useAuth } from '../../AuthContext';

const NAV_ITEMS = [
  { to: '/admin',            icon: LayoutDashboard, label: 'Dashboard', end: true  },
  { to: '/admin/properties', icon: Building2,       label: 'Properties', end: false },
  { to: '/admin/users',      icon: Users,           label: 'Users',      end: false },
  { to: '/admin/leads',      icon: PhoneCall,       label: 'Leads',      end: false },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-100">

      {/* Top header */}
      <header
        className="bg-[#0F172A] text-white px-4 flex items-center justify-between shrink-0 shadow-lg z-50"
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)', height: 'calc(env(safe-area-inset-top, 0px) + 56px)' }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center shrink-0">
            <Shield size={16} className="text-white" />
          </div>
          <div>
            <p className="font-black text-sm leading-none">NoBroker</p>
            <p className="text-amber-400 text-[10px] font-bold leading-none mt-0.5">ADMIN PANEL</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right mr-1">
            <p className="text-xs font-bold text-white leading-none">{user?.name}</p>
            <p className="text-[10px] text-white/50 leading-none mt-0.5">Administrator</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center font-black text-white text-sm">
            {user?.name?.charAt(0)}
          </div>
        </div>
      </header>

      {/* Scrollable content */}
      <main className="flex-1 overflow-y-auto pb-24">
        {children}
      </main>

      {/* Bottom Tab Bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 bg-[#0F172A] border-t border-white/5 flex items-center z-50"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)', height: 'calc(env(safe-area-inset-bottom, 0px) + 64px)' }}
      >
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center gap-1 py-2 transition-colors ${
                isActive ? 'text-amber-400' : 'text-white/40'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${isActive ? 'bg-amber-400/15' : ''}`}>
                  <item.icon size={20} />
                </div>
                <span className="text-[10px] font-bold">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
        <button
          onClick={handleLogout}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-2 text-red-400/70"
        >
          <div className="w-8 h-8 rounded-xl flex items-center justify-center">
            <LogOut size={20} />
          </div>
          <span className="text-[10px] font-bold">Logout</span>
        </button>
      </nav>
    </div>
  );
}
