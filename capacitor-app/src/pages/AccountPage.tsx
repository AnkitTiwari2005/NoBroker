import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserCircle, LogOut, ChevronRight, Heart, Scale, Settings,
  HelpCircle, FileText, Shield, Key, CheckCircle, Building2,
  Phone, X, Edit2, Lock, Clock
} from 'lucide-react';
import { useAuth } from '../AuthContext';
import { useFavorites, useCompare } from '../AppContext';
import { useToast } from '../ToastContext';

export default function AccountPage() {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { favorites } = useFavorites();
  const { compareList } = useCompare();

  const [showEditSheet, setShowEditSheet] = useState(false);
  const [showHelpSheet, setShowHelpSheet] = useState(false);

  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 page-enter" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
        <UserCircle className="w-24 h-24 text-slate-300 mb-6" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center">Sign in to NoBroker</h2>
        <p className="text-slate-500 mb-8 text-center max-w-[280px]">Access your saved properties, compare list, and manage your listings.</p>
        
        <button onClick={() => navigate('/login')} className="w-full max-w-xs py-3.5 bg-primary text-white rounded-xl font-bold text-lg mb-4 btn-press">
          Sign In
        </button>
        <button onClick={() => navigate('/register')} className="w-full max-w-xs py-3.5 border-2 border-primary text-primary rounded-xl font-bold text-lg mb-8 btn-press">
          Create Account
        </button>

        <div className="flex gap-6 text-slate-500 text-sm">
          <div className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" /> Zero Brokerage</div>
          <div className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-blue-500" /> Secure Login</div>
        </div>
      </div>
    );
  }

  const handleSaveProfile = () => {
    updateProfile({ name: editName, phone: editPhone });
    showToast('Profile updated');
    setShowEditSheet(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    showToast('Logged out successfully');
  };

  const FAQS = [
    { q: 'How do I list a property?', a: 'Go to the Post Property tab and fill in your details.' },
    { q: 'Is NoBroker really free?', a: 'Yes! We charge absolutely zero brokerage.' },
    { q: 'How are listings verified?', a: 'Our admin team manually reviews all properties within 24 hours.' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-24 page-enter flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-b from-primary to-primary-light rounded-b-[40px] px-6 pb-12 pt-10 text-white relative shadow-md" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 24px)' }}>
        <div className="flex items-center gap-4 relative z-10">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} className="w-16 h-16 rounded-full border-2 border-white/20 object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-primary text-2xl font-bold shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-xl font-bold mb-0.5">{user.name}</h1>
            <p className="text-white/70 text-sm mb-0.5">{user.email}</p>
            {user.phone && <p className="text-white/70 text-sm">{user.phone}</p>}
          </div>
        </div>
        
        {user.role === 'owner' && (
          <div className="mt-4 inline-block">
            {user.isVerified ? (
              <div className="bg-emerald-500/20 border border-emerald-400/30 text-emerald-100 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-sm">
                <Shield className="w-3.5 h-3.5" /> Verified Seller
              </div>
            ) : (
              <div className="bg-amber-500/20 border border-amber-400/30 text-amber-100 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-sm">
                <Clock className="w-3.5 h-3.5" /> Pending Verification
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stats Card */}
      <div className="mx-4 -mt-8 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4 flex justify-around relative z-20">
        <button onClick={() => navigate('/favorites')} className="flex flex-col items-center btn-press">
          <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-1">
            <Heart className="w-5 h-5 fill-red-500" />
          </div>
          <span className="text-lg font-bold text-slate-800">{favorites.length}</span>
          <span className="text-xs text-slate-500 font-medium">Saved</span>
        </button>
        <div className="w-px bg-slate-100 my-2" />
        <button onClick={() => navigate('/compare')} className="flex flex-col items-center btn-press">
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-1">
            <Scale className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold text-slate-800">{compareList.length}</span>
          <span className="text-xs text-slate-500 font-medium">Compare</span>
        </button>
        <div className="w-px bg-slate-100 my-2" />
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-1">
            <Shield className="w-5 h-5" />
          </div>
          <span className="text-sm font-bold text-slate-800 capitalize mt-1">{user.role}</span>
          <span className="text-xs text-slate-500 font-medium">Account</span>
        </div>
      </div>

      {/* Menus */}
      <div className="p-4 space-y-6 mt-2">
        <MenuSection title="My Activity">
          <MenuItem icon={Heart} label="Saved Properties" onClick={() => navigate('/favorites')} />
          <MenuItem icon={Scale} label="Compare Properties" onClick={() => navigate('/compare')} />
          {user.role === 'owner' && (
            <MenuItem icon={Building2} label="My Listings" value="2" onClick={() => navigate('/post')} />
          )}
        </MenuSection>

        <MenuSection title="Account Settings">
          <MenuItem icon={Edit2} label="Edit Profile" onClick={() => setShowEditSheet(true)} />
          <MenuItem icon={Key} label="Change Password" onClick={() => showToast('Password change available at nobroker.in/account', 'info')} />
        </MenuSection>

        <MenuSection title="Help & Legal">
          <MenuItem icon={HelpCircle} label="Help & Support" onClick={() => setShowHelpSheet(true)} />
          <MenuItem icon={FileText} label="Terms of Service" onClick={() => showToast('Visit nobroker.in/terms', 'info')} />
          <MenuItem icon={Shield} label="Privacy Policy" onClick={() => showToast('Visit nobroker.in/privacy', 'info')} />
        </MenuSection>

        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-4 mt-4 bg-red-50 text-red-600 rounded-xl font-bold btn-press">
          <LogOut className="w-5 h-5" /> Log Out
        </button>

        <p className="text-center text-xs font-medium text-slate-400 mt-6">NoBroker v1.0.0</p>
      </div>

      {/* Edit Profile Sheet */}
      {showEditSheet && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowEditSheet(false)} />
          <div className="relative bg-white rounded-t-3xl p-5 pb-10 sheet-enter">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800">Edit Profile</h3>
              <button onClick={() => setShowEditSheet(false)} className="p-2 -mr-2 bg-slate-100 rounded-full text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Phone Number</label>
                <input type="tel" value={editPhone} onChange={e => setEditPhone(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>
            
            <button onClick={handleSaveProfile} className="w-full py-3.5 bg-primary text-white font-bold rounded-xl btn-press">
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Help Sheet */}
      {showHelpSheet && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowHelpSheet(false)} />
          <div className="relative bg-white rounded-t-3xl p-5 pb-10 sheet-enter h-[70vh] flex flex-col">
            <div className="flex justify-between items-center mb-6 shrink-0">
              <h3 className="text-lg font-bold text-slate-800">Help & Support</h3>
              <button onClick={() => setShowHelpSheet(false)} className="p-2 -mr-2 bg-slate-100 rounded-full text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-2">
              {FAQS.map((faq, i) => (
                <button key={i} onClick={() => showToast(faq.a, 'info')} className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-xl btn-press text-left">
                  <span className="font-medium text-slate-700 pr-4">{faq.q}</span>
                  <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuSection({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 pl-2">{title}</h3>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {children}
      </div>
    </div>
  );
}

function MenuItem({ icon: Icon, label, value, onClick }: { icon: any, label: string, value?: string, onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center p-4 border-b border-slate-50 last:border-0 btn-press bg-white">
      <Icon className="w-5 h-5 text-slate-400 mr-3" />
      <span className="flex-1 text-left font-medium text-slate-700">{label}</span>
      {value && <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md mr-2">{value}</span>}
      <ChevronRight className="w-4 h-4 text-slate-300" />
    </button>
  );
}
