import React from 'react'
import { useNavigate } from 'react-router-dom'
import { User, LogOut, ChevronRight, Heart, Scale, Settings, HelpCircle, FileText, Shield, UserCircle, Key } from 'lucide-react'
import { useAuth } from '../AuthContext'
import { useFavorites, useCompare } from '../AppContext'

export default function AccountPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { favorites } = useFavorites()
  const { compareList } = useCompare()

  if (!user) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="text-7xl mb-6">👤</div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Sign in to NoBroker</h2>
        <p className="text-slate-500 mb-8 max-w-xs">Manage your properties, save favorites, and contact owners directly.</p>
        
        <div className="w-full space-y-4 max-w-xs">
          <button onClick={() => navigate('/login')} className="w-full py-3.5 bg-primary text-white font-bold rounded-xl active:opacity-90 shadow-md">
            Login
          </button>
          <button onClick={() => navigate('/register')} className="w-full py-3.5 bg-white text-primary border-2 border-primary font-bold rounded-xl active:bg-primary/5">
            Create Account
          </button>
        </div>

        <div className="mt-12 text-sm text-slate-400">
          <div className="flex items-center justify-center gap-2 mb-2"><Shield size={16} /> Secure login</div>
          <div className="flex items-center justify-center gap-2"><Check size={16} /> Zero brokerage</div>
        </div>
      </div>
    )
  }

  const MenuSection = ({ title, items }: any) => (
    <div className="mb-6">
      <div className="text-xs font-bold text-slate-400 mb-2 px-4">{title}</div>
      <div className="bg-white border-y sm:border sm:rounded-2xl border-slate-200">
        {items.map((item: any, i: number) => (
          <div 
            key={i}
            onClick={item.onClick}
            className={`flex items-center p-4 active:bg-slate-50 ${i !== items.length - 1 ? 'border-b border-slate-100' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${item.color || 'bg-slate-100 text-slate-600'}`}>
              {item.icon}
            </div>
            <div className="flex-1 font-medium text-slate-700">{item.label}</div>
            {item.value && <div className="text-sm font-bold text-slate-400 mr-2">{item.value}</div>}
            <ChevronRight size={18} className="text-slate-300" />
          </div>
        ))}
      </div>
    </div>
  )

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-y-auto pb-24">
      {/* Profile Header */}
      <div className="bg-primary px-6 pt-8 pb-16 rounded-b-[40px]">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-white text-2xl font-bold border-2 border-white/40">
            {user.name.charAt(0)}
          </div>
          <div className="text-white">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <div className="text-primary-100 text-sm mt-0.5">{user.phone}</div>
            <div className="text-primary-100 text-sm">{user.email}</div>
          </div>
        </div>
      </div>

      {/* Stats Card */}
      <div className="-mt-8 px-4 mb-6">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex divide-x divide-slate-100">
          <div className="flex-1 text-center py-2" onClick={() => navigate('/favorites')}>
            <div className="text-2xl font-bold text-slate-800">{favorites.length}</div>
            <div className="text-xs font-medium text-slate-500 mt-1">Saved</div>
          </div>
          <div className="flex-1 text-center py-2">
            <div className="text-2xl font-bold text-slate-800">{user.role === 'owner' ? '2' : '0'}</div>
            <div className="text-xs font-medium text-slate-500 mt-1">Listings</div>
          </div>
          <div className="flex-1 text-center py-2">
            <div className="text-sm font-bold text-primary bg-primary/10 inline-block px-3 py-1 rounded-full mt-2">
              {user.role.toUpperCase()}
            </div>
            <div className="text-xs font-medium text-slate-500 mt-1">Role</div>
          </div>
        </div>
      </div>

      {/* Menus */}
      <MenuSection title="MY ACTIVITY" items={[
        { icon: <Heart size={16} />, label: 'Saved Properties', value: favorites.length, color: 'bg-red-50 text-red-500', onClick: () => navigate('/favorites') },
        { icon: <Scale size={16} />, label: 'Compare Properties', value: compareList.length, color: 'bg-blue-50 text-blue-500', onClick: () => navigate('/compare') },
      ]} />

      <MenuSection title="ACCOUNT" items={[
        { icon: <UserCircle size={16} />, label: 'Edit Profile', onClick: () => alert('Coming soon!') },
        { icon: <Key size={16} />, label: 'Change Password', onClick: () => alert('Coming soon!') },
      ]} />

      <MenuSection title="HELP & LEGAL" items={[
        { icon: <HelpCircle size={16} />, label: 'Help & Support' },
        { icon: <FileText size={16} />, label: 'Terms of Service' },
        { icon: <Shield size={16} />, label: 'Privacy Policy' },
      ]} />

      <div className="px-4 mt-2 mb-8">
        <button 
          onClick={handleLogout}
          className="w-full py-4 bg-white border border-red-200 text-red-500 font-bold rounded-2xl flex items-center justify-center gap-2 shadow-sm active:bg-red-50"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>

      <div className="text-center text-xs text-slate-400 pb-8">
        NoBroker App v1.0.0
      </div>
    </div>
  )
}

function Check({size}: {size: number}) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
}
