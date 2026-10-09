import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserCircle, LogOut, ChevronRight, Heart, Scale, Shield,
  HelpCircle, FileText, Key, CheckCircle, Building2,
  Phone, Edit2, Clock, Bell, Star, Download, Share2,
  MessageSquare, AlertCircle, ChevronDown, ChevronUp, Lock
} from 'lucide-react';
import { useAuth } from '../AuthContext';
import { useFavorites, useCompare } from '../AppContext';
import { useToast } from '../ToastContext';
import ModalSheet from '../components/ModalSheet';

export default function AccountPage() {
  const { user, logout, updateProfile } = useAuth();
  const navigate  = useNavigate();
  const { showToast } = useToast();
  const { favorites }  = useFavorites();
  const { compareList } = useCompare();

  const [showEditSheet,     setShowEditSheet]     = useState(false);
  const [showHelpSheet,     setShowHelpSheet]     = useState(false);
  const [showPasswordSheet, setShowPasswordSheet] = useState(false);
  const [showNotifSheet,    setShowNotifSheet]    = useState(false);

  const [editName,    setEditName]    = useState(user?.name  || '');
  const [editPhone,   setEditPhone]   = useState(user?.phone || '');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Password change state
  const [curPass,  setCurPass]  = useState('');
  const [newPass,  setNewPass]  = useState('');
  const [confPass, setConfPass] = useState('');

  // Notification prefs
  const [notifMatch,  setNotifMatch]  = useState(true);
  const [notifPrice,  setNotifPrice]  = useState(true);
  const [notifAdmin,  setNotifAdmin]  = useState(true);

  const FAQS = [
    { q: 'How do I list a property?',      a: 'Go to the Post (+) tab, register as an owner, and fill in your property details. Our admin will review and publish within 24 hours.' },
    { q: 'Is NoBroker really free?',       a: 'Yes! We charge absolutely zero brokerage. You connect directly with owners at no cost.' },
    { q: 'How are listings verified?',     a: 'Our admin team manually reviews all submitted listings within 24 hours and verifies owner identity.' },
    { q: 'How do I edit my listing?',      a: 'Go to My Listings in your profile to view, edit, or delete your active listings.' },
    { q: 'What if the owner is unresponsive?', a: 'Use the Report Issue option on the property page. Our team will follow up within 24 hours.' },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 page-enter" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
        <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mb-6">
          <UserCircle size={52} className="text-slate-300" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center">Sign in to NoBroker</h2>
        <p className="text-slate-500 mb-8 text-center max-w-[280px] text-sm">Access your saved properties, compare list, and manage your listings.</p>
        <button onClick={() => navigate('/login')} className="w-full max-w-xs py-3.5 bg-primary text-white rounded-xl font-bold mb-3 btn-press">Sign In</button>
        <button onClick={() => navigate('/register')} className="w-full max-w-xs py-3.5 border-2 border-primary text-primary rounded-xl font-bold mb-8 btn-press">Create Account</button>
        <div className="flex gap-6 text-slate-400 text-xs">
          <div className="flex items-center gap-1"><CheckCircle size={13} className="text-emerald-500" /> Zero Brokerage</div>
          <div className="flex items-center gap-1"><Shield size={13} className="text-blue-500" /> Secure Login</div>
        </div>
      </div>
    );
  }

  const handleSaveProfile = () => {
    if (!editName.trim()) { showToast('Name cannot be empty', 'error'); return; }
    updateProfile({ name: editName, phone: editPhone });
    showToast('Profile updated successfully');
    setShowEditSheet(false);
  };

  const handleChangePassword = () => {
    if (!curPass || !newPass || !confPass) { showToast('Please fill all fields', 'error'); return; }
    if (newPass !== confPass) { showToast('New passwords do not match', 'error'); return; }
    if (newPass.length < 6)  { showToast('Password must be at least 6 characters', 'error'); return; }
    showToast('Password changed successfully');
    setCurPass(''); setNewPass(''); setConfPass('');
    setShowPasswordSheet(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    showToast('Logged out successfully');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-28 page-enter">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#1E3A5F] to-[#2B5BA0] px-6 pb-14 text-white"
        style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 24px)' }}
      >
        <div className="flex items-center gap-4">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} className="w-18 h-18 rounded-full border-2 border-white/30 object-cover" />
          ) : (
            <div className="w-18 h-18 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center text-white text-2xl font-black shrink-0 w-16 h-16">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold truncate">{user.name}</h1>
            <p className="text-white/60 text-sm truncate">{user.email}</p>
            {user.phone && <p className="text-white/60 text-sm">{user.phone}</p>}
          </div>
          <button
            onClick={() => setShowEditSheet(true)}
            className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center btn-press shrink-0"
          >
            <Edit2 size={16} />
          </button>
        </div>

        {user.role === 'owner' && (
          <div className="mt-4">
            {user.isVerified ? (
              <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-400/30 text-emerald-100 text-xs font-bold px-3 py-1.5 rounded-full">
                <Shield size={12} /> Verified Seller
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 bg-amber-500/20 border border-amber-400/30 text-amber-100 text-xs font-bold px-3 py-1.5 rounded-full">
                <Clock size={12} /> Pending Verification
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Stats Card ─────────────────────────────────────────────────── */}
      <div className="mx-4 -mt-8 bg-white rounded-2xl shadow-lg border border-slate-100 p-4 flex justify-around relative z-20">
        <button onClick={() => navigate('/favorites')} className="flex flex-col items-center btn-press">
          <div className="w-11 h-11 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-1">
            <Heart size={20} className="fill-red-500" />
          </div>
          <span className="text-lg font-black text-slate-800">{favorites.length}</span>
          <span className="text-xs text-slate-400 font-medium">Saved</span>
        </button>
        <div className="w-px bg-slate-100 my-1" />
        <button onClick={() => navigate('/compare')} className="flex flex-col items-center btn-press">
          <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-1">
            <Scale size={20} />
          </div>
          <span className="text-lg font-black text-slate-800">{compareList.length}</span>
          <span className="text-xs text-slate-400 font-medium">Compare</span>
        </button>
        <div className="w-px bg-slate-100 my-1" />
        <div className="flex flex-col items-center">
          <div className="w-11 h-11 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-1">
            <Shield size={20} />
          </div>
          <span className="text-sm font-black text-slate-800 capitalize mt-0.5">{user.role}</span>
          <span className="text-xs text-slate-400 font-medium">Account</span>
        </div>
      </div>

      {/* ── Menu Sections ───────────────────────────────────────────────── */}
      <div className="p-4 space-y-5 mt-2">

        {/* My Activity */}
        <MenuSection title="My Activity">
          <MenuItem icon={Heart}     label="Saved Properties"    badge={favorites.length > 0 ? String(favorites.length) : undefined} onClick={() => navigate('/favorites')} />
          <MenuItem icon={Scale}     label="Compare Properties"  badge={compareList.length > 0 ? String(compareList.length) : undefined} onClick={() => navigate('/compare')} />
          {user.role === 'owner' && (
            <MenuItem icon={Building2} label="My Listings" badge="2" onClick={() => navigate('/post')} />
          )}
          <MenuItem icon={Star}      label="Recently Viewed"     onClick={() => showToast('Recently viewed properties coming soon', 'info')} />
        </MenuSection>

        {/* Account Settings */}
        <MenuSection title="Account Settings">
          <MenuItem icon={Edit2}     label="Edit Profile"        onClick={() => setShowEditSheet(true)} />
          <MenuItem icon={Key}       label="Change Password"     onClick={() => setShowPasswordSheet(true)} />
          <MenuItem icon={Bell}      label="Notification Prefs"  onClick={() => setShowNotifSheet(true)} />
          <MenuItem icon={Phone}     label="Linked Phone"        value={user.phone || 'Not set'} onClick={() => setShowEditSheet(true)} />
        </MenuSection>

        {/* Help & Legal */}
        <MenuSection title="Help & Legal">
          <MenuItem icon={HelpCircle}   label="Help & Support"   onClick={() => setShowHelpSheet(true)} />
          <MenuItem icon={MessageSquare} label="Contact Us"      onClick={() => showToast('Email: support@nobroker.in', 'info')} />
          <MenuItem icon={Share2}       label="Share App"        onClick={() => { navigator.share?.({ title: 'NoBroker', text: 'Find homes without brokerage!', url: 'https://nobroker.in' }).catch(() => showToast('Link copied!')) }} />
          <MenuItem icon={FileText}     label="Terms of Service" onClick={() => showToast('Visit nobroker.in/terms', 'info')} />
          <MenuItem icon={Shield}       label="Privacy Policy"   onClick={() => showToast('Visit nobroker.in/privacy', 'info')} />
        </MenuSection>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-4 bg-red-50 text-red-600 rounded-2xl font-bold btn-press border border-red-100"
        >
          <LogOut size={18} /> Log Out
        </button>

        <p className="text-center text-xs text-slate-300 font-medium">NoBroker v1.0.0 • Zero Brokerage</p>
      </div>

      {/* ── Edit Profile Sheet ─────────────────────────────────────────── */}
      {showEditSheet && (
        <ModalSheet onClose={() => setShowEditSheet(false)} title="Edit Profile" showClose>
          <div className="px-5 pb-4 space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Full Name</label>
              <input
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Phone Number</label>
              <input
                type="tel"
                value={editPhone}
                onChange={e => setEditPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="+91 XXXXX XXXXX"
              />
            </div>
            <button onClick={handleSaveProfile} className="w-full py-3.5 bg-primary text-white font-bold rounded-xl btn-press mt-2">
              Save Changes
            </button>
          </div>
        </ModalSheet>
      )}

      {/* ── Change Password Sheet ──────────────────────────────────────── */}
      {showPasswordSheet && (
        <ModalSheet onClose={() => setShowPasswordSheet(false)} title="Change Password" showClose>
          <div className="px-5 pb-4 space-y-4">
            {[
              { label: 'Current Password', value: curPass,  set: setCurPass  },
              { label: 'New Password',     value: newPass,  set: setNewPass  },
              { label: 'Confirm Password', value: confPass, set: setConfPass },
            ].map(field => (
              <div key={field.label}>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">{field.label}</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    value={field.value}
                    onChange={e => field.set(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            ))}
            {newPass && confPass && newPass !== confPass && (
              <div className="flex items-center gap-2 text-red-500 text-xs">
                <AlertCircle size={13} /> Passwords don't match
              </div>
            )}
            <button onClick={handleChangePassword} className="w-full py-3.5 bg-primary text-white font-bold rounded-xl btn-press mt-2">
              Update Password
            </button>
          </div>
        </ModalSheet>
      )}

      {/* ── Notification Preferences Sheet ────────────────────────────── */}
      {showNotifSheet && (
        <ModalSheet onClose={() => setShowNotifSheet(false)} title="Notifications" showClose>
          <div className="px-5 pb-4 space-y-1">
            {[
              { label: 'Property Match Alerts',  sub: 'When a new listing matches your search', val: notifMatch,  set: setNotifMatch },
              { label: 'Price Drop Alerts',       sub: 'When a saved property drops in price',   val: notifPrice,  set: setNotifPrice },
              { label: 'Admin Updates',           sub: 'Listing approvals and status changes',    val: notifAdmin,  set: setNotifAdmin },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0">
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{item.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.sub}</p>
                </div>
                <button
                  onClick={() => { item.set(!item.val); showToast(item.val ? 'Notification disabled' : 'Notification enabled') }}
                  className={`w-12 h-6 rounded-full transition-colors btn-press ${item.val ? 'bg-primary' : 'bg-slate-200'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform mx-0.5 ${item.val ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            ))}
            <button onClick={() => setShowNotifSheet(false)} className="w-full py-3 bg-primary text-white font-bold rounded-xl btn-press mt-3">
              Done
            </button>
          </div>
        </ModalSheet>
      )}

      {/* ── Help & FAQs Sheet ─────────────────────────────────────────── */}
      {showHelpSheet && (
        <ModalSheet onClose={() => setShowHelpSheet(false)} title="Help & Support" showClose height="80vh">
          <div className="px-5 pb-4">
            <p className="text-sm text-slate-500 mb-4">Frequently asked questions</p>
            <div className="space-y-2">
              {FAQS.map((faq, i) => (
                <div key={i} className="border border-slate-100 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 bg-slate-50 text-left btn-press"
                  >
                    <span className="font-semibold text-slate-700 text-sm pr-4 leading-snug">{faq.q}</span>
                    {expandedFaq === i ? <ChevronUp size={16} className="text-slate-400 shrink-0" /> : <ChevronDown size={16} className="text-slate-400 shrink-0" />}
                  </button>
                  {expandedFaq === i && (
                    <div className="px-4 pb-4 pt-2 bg-white">
                      <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-primary/5 border border-primary/10 rounded-2xl">
              <p className="text-sm font-bold text-primary mb-1">Still need help?</p>
              <p className="text-xs text-slate-500">Email us at <span className="text-primary font-semibold">support@nobroker.in</span> or call <span className="text-primary font-semibold">1800-102-1345</span></p>
            </div>
          </div>
        </ModalSheet>
      )}
    </div>
  );
}

function MenuSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 pl-1">{title}</h3>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {children}
      </div>
    </div>
  );
}

function MenuItem({ icon: Icon, label, value, badge, onClick }: {
  icon: any; label: string; value?: string; badge?: string; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center px-4 py-3.5 border-b border-slate-50 last:border-0 btn-press bg-white active:bg-slate-50"
    >
      <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center mr-3 shrink-0">
        <Icon size={16} className="text-slate-500" />
      </div>
      <span className="flex-1 text-left font-medium text-slate-700 text-sm">{label}</span>
      {badge && (
        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-lg mr-2">{badge}</span>
      )}
      {value && !badge && (
        <span className="text-xs text-slate-400 mr-2 truncate max-w-[120px]">{value}</span>
      )}
      <ChevronRight size={15} className="text-slate-300 shrink-0" />
    </button>
  );
}
