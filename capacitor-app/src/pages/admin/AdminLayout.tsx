import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Building2, Users, PhoneCall, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../../AuthContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/admin/properties', icon: Building2, label: 'Properties' },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/leads', icon: PhoneCall, label: 'Leads' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-[#1E3A5F] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-50 pt-safe" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
        <div className="flex items-center space-x-2">
          <Shield className="w-6 h-6 text-amber-500" />
          <span className="font-bold text-lg">NoBroker Admin</span>
        </div>
        <div className="text-sm text-white/80">
          Hi, {user?.name?.split(' ')[0]}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>

      <nav className="fixed bottom-0 w-full bg-white border-t flex items-center justify-around pb-safe" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)' }}>
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `flex flex-col items-center p-3 w-full btn-press ${isActive ? 'text-[#1E3A5F]' : 'text-gray-500'}`}
          >
            <item.icon className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
        <button onClick={handleLogout} className="flex flex-col items-center p-3 w-full btn-press text-red-500">
          <LogOut className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-medium">Logout</span>
        </button>
      </nav>
    </div>
  );
};
