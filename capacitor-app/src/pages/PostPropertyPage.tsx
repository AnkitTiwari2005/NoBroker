import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useToast } from '../ToastContext';
import { ListingType, PropertyType, FurnishingStatus } from '../types';
import {
  Building2, Home, Trees, Sofa, Map, Layers, CheckCircle2,
  ImageIcon, Clock, UserX, ArrowLeft
} from 'lucide-react';

const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Apartment', Icon: Building2 },
  { value: 'house', label: 'House', Icon: Home },
  { value: 'villa', label: 'Villa', Icon: Trees },
  { value: 'studio', label: 'Studio', Icon: Sofa },
  { value: 'plot', label: 'Plot', Icon: Map },
  { value: 'builder_floor', label: 'Builder Floor', Icon: Layers },
];

export default function PostPropertyPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [listingType, setListingType] = useState<ListingType | null>(null);
  const [propertyType, setPropertyType] = useState<PropertyType | null>(null);
  const [title, setTitle] = useState('');
  const [city, setCity] = useState('');
  const [locality, setLocality] = useState('');
  const [bedrooms, setBedrooms] = useState<number>(2);
  const [bathrooms, setBathrooms] = useState<number>(1);
  const [price, setPrice] = useState('');
  const [deposit, setDeposit] = useState('');
  const [area, setArea] = useState('');
  const [furnishing, setFurnishing] = useState<FurnishingStatus>('unfurnished');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<FileList | null>(null);

  // Gate 1: Not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 page-enter" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
        <Building2 className="w-20 h-20 text-primary mb-6" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">List Your Property Free</h2>
        <p className="text-slate-500 mb-8 text-center">Sign in to post your property and connect with genuine buyers and tenants without paying brokerage.</p>
        <div className="flex gap-4 w-full max-w-xs">
          <button onClick={() => navigate('/login')} className="flex-1 py-3 bg-primary text-white rounded-xl font-bold btn-press">
            Sign In
          </button>
          <button onClick={() => navigate('/register')} className="flex-1 py-3 border-2 border-primary text-primary rounded-xl font-bold btn-press">
            Register
          </button>
        </div>
      </div>
    );
  }

  // Gate 2: Logged in but is seeker
  if (user.role === 'seeker') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 page-enter" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
        <UserX className="w-20 h-20 text-slate-400 mb-6" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center">Seller Account Required</h2>
        <p className="text-slate-500 mb-8 text-center">You are currently logged in as a Property Seeker. To list properties, you need a Property Owner account.</p>
        <button onClick={() => { localStorage.removeItem('nobroker_user'); navigate('/register'); }} className="px-6 py-3 bg-primary text-white rounded-xl font-bold btn-press">
          Create Seller Account
        </button>
      </div>
    );
  }

  // Gate 3: Owner but pending verification
  if (user.role === 'owner' && !user.isVerified) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 page-enter" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
        <Clock className="w-20 h-20 text-amber-500 mb-6" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center">Account Pending Verification</h2>
        <p className="text-slate-500 mb-8 text-center">Your seller account is currently under review by our admin team. You will be able to list properties once approved (usually within 24 hours).</p>
        <button onClick={() => navigate('/')} className="px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-bold btn-press">
          Back to Home
        </button>
      </div>
    );
  }

  // Success view
  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 page-enter" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
        <CheckCircle2 className="w-24 h-24 text-emerald-500 mb-6" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center">Listing Submitted!</h2>
        <p className="text-slate-500 mb-8 text-center px-4">Our admin will review and publish your listing within 24 hours. You'll receive a notification once it's live.</p>
        <button onClick={() => navigate('/')} className="px-8 py-3 bg-primary text-white rounded-xl font-bold btn-press">
          Go to Home
        </button>
      </div>
    );
  }

  // Multi-step form
  const nextStep = () => {
    if (step === 1) {
      if (!listingType || !propertyType) {
        showToast('Please select both listing and property type', 'error');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!title || !city || !locality || !price) {
        showToast('Please fill all mandatory fields', 'error');
        return;
      }
      setStep(3);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col page-enter">
      {/* Header */}
      <div className="bg-white px-4 py-3 border-b flex items-center sticky top-0 z-20" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
        {step > 1 ? (
          <button onClick={() => setStep(step - 1)} className="p-2 -ml-2 rounded-full hover:bg-slate-100 mr-2 btn-press">
            <ArrowLeft className="w-6 h-6 text-slate-700" />
          </button>
        ) : (
          <div className="w-10" />
        )}
        <h1 className="text-lg font-bold text-slate-800 flex-1 text-center">Post Property</h1>
        <div className="w-10" />
      </div>

      {/* Progress Bar */}
      <div className="flex bg-slate-200 h-1.5">
        <div className="bg-primary transition-all duration-300 h-full" style={{ width: `${(step / 3) * 100}%` }} />
      </div>

      <div className="p-5 pb-28">
        {step === 1 && (
          <div className="animate-fade-in space-y-8">
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-4">I want to...</h2>
              <div className="flex gap-4">
                <button
                  onClick={() => setListingType('rent')}
                  className={`flex-1 py-4 rounded-xl border-2 font-bold text-lg transition-colors btn-press ${listingType === 'rent' ? 'border-primary bg-primary/10 text-primary' : 'border-slate-200 bg-white text-slate-600'}`}
                >
                  Rent Out
                </button>
                <button
                  onClick={() => setListingType('buy')}
                  className={`flex-1 py-4 rounded-xl border-2 font-bold text-lg transition-colors btn-press ${listingType === 'buy' ? 'border-primary bg-primary/10 text-primary' : 'border-slate-200 bg-white text-slate-600'}`}
                >
                  Sell
                </button>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-4">Property Type</h2>
              <div className="grid grid-cols-2 gap-3">
                {PROPERTY_TYPES.map(pt => (
                  <button
                    key={pt.value}
                    onClick={() => setPropertyType(pt.value as PropertyType)}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-colors btn-press ${propertyType === pt.value ? 'border-primary bg-primary/10 text-primary' : 'border-slate-200 bg-white text-slate-500'}`}
                  >
                    <pt.Icon className="w-6 h-6" />
                    <span className="font-semibold text-sm">{pt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Property Title *</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Beautiful 2BHK in Koramangala" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">City *</label>
                <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. Bangalore" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Locality *</label>
                <input type="text" value={locality} onChange={e => setLocality(e.target.value)} placeholder="e.g. Indiranagar" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>

            {(propertyType !== 'plot' && propertyType !== 'studio') && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Bedrooms</label>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {[1,2,3,4,5].map(b => (
                    <button key={b} onClick={() => setBedrooms(b)} className={`px-5 py-2 rounded-full font-semibold shrink-0 border ${bedrooms === b ? 'bg-primary border-primary text-white' : 'bg-white border-slate-200 text-slate-600'}`}>
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {propertyType !== 'plot' && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Bathrooms</label>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {[1,2,3,4].map(b => (
                    <button key={b} onClick={() => setBathrooms(b)} className={`px-5 py-2 rounded-full font-semibold shrink-0 border ${bathrooms === b ? 'bg-primary border-primary text-white' : 'bg-white border-slate-200 text-slate-600'}`}>
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                {listingType === 'rent' ? 'Monthly Rent *' : 'Expected Price *'}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-500">₹</span>
                <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="0" className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-16 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                {listingType === 'rent' && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-medium">/mo</span>}
              </div>
            </div>

            {listingType === 'rent' && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Security Deposit</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-500">₹</span>
                  <input type="number" value={deposit} onChange={e => setDeposit(e.target.value)} placeholder="0" className="w-full bg-white border border-slate-200 rounded-xl pl-9 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Built-up Area (sq.ft)</label>
              <input type="number" value={area} onChange={e => setArea(e.target.value)} placeholder="e.g. 1200" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
            </div>

            {propertyType !== 'plot' && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Furnishing</label>
                <div className="flex gap-2 flex-wrap">
                  {['unfurnished', 'semi', 'fully'].map(f => (
                    <button key={f} onClick={() => setFurnishing(f as FurnishingStatus)} className={`px-4 py-2 rounded-full text-sm font-semibold border ${furnishing === f ? 'bg-primary border-primary text-white' : 'bg-white border-slate-200 text-slate-600'}`}>
                      {f === 'unfurnished' ? 'Unfurnished' : f === 'semi' ? 'Semi Furnished' : 'Fully Furnished'}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
              <textarea 
                rows={5} 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                placeholder="Tell buyers/tenants more about your property..." 
                className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Photos</label>
              <input type="file" id="imgInput" accept="image/*" multiple className="hidden" onChange={e => setImages(e.target.files)} />
              <label htmlFor="imgInput" className="w-full h-32 border-2 border-dashed border-slate-300 rounded-xl bg-white flex flex-col items-center justify-center text-slate-500 btn-press cursor-pointer">
                <ImageIcon className="w-8 h-8 mb-2 text-slate-400" />
                <span className="text-sm font-medium">
                  {images && images.length > 0 ? `${images.length} photo(s) selected` : 'Tap to add photos'}
                </span>
              </label>
            </div>
          </div>
        )}
      </div>

      {ReactDOM.createPortal(
        <div
          className="fixed left-0 right-0 px-4 bg-white border-t border-slate-100 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]"
          style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 64px)', pointerEvents: 'auto' }}
        >
          {step < 3 ? (
            <button onClick={nextStep} className="w-full py-3.5 bg-primary text-white rounded-xl font-bold text-lg btn-press">
              Continue →
            </button>
          ) : (
            <button onClick={() => setSubmitted(true)} className="w-full py-3.5 bg-emerald-500 text-white rounded-xl font-bold text-lg btn-press shadow-[0_4px_14px_rgba(16,185,129,0.39)]">
              Submit Listing
            </button>
          )}
        </div>,
        document.getElementById('modal-root')!
      )}
    </div>
  );
}
