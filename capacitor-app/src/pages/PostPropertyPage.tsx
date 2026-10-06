import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Home, MapPin, DollarSign, Image as ImageIcon } from 'lucide-react'
import { useAuth } from '../AuthContext'

export default function PostPropertyPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)

  if (!user) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="text-7xl mb-6">🏡</div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">List your property for FREE</h2>
        <p className="text-slate-500 mb-8 max-w-xs">Sign in as an owner to post your property and find genuine tenants/buyers.</p>
        <button onClick={() => navigate('/login')} className="w-full max-w-xs py-3.5 bg-primary text-white font-bold rounded-xl shadow-md">
          Sign In to Post
        </button>
      </div>
    )
  }

  if (user.role === 'seeker') {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="text-6xl mb-6">🤔</div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Want to list a property?</h2>
        <p className="text-slate-500 mb-8 max-w-xs">Your account is registered as a Seeker. Please contact support to upgrade to an Owner account.</p>
        <button className="px-6 py-3 bg-primary text-white font-bold rounded-xl">
          Contact Support
        </button>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-white p-6 text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-6">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Listing Submitted!</h2>
        <p className="text-slate-500 mb-8 max-w-xs">Your property has been submitted for review. It will be live on NoBroker shortly.</p>
        <button onClick={() => navigate('/')} className="w-full max-w-xs py-3.5 bg-primary text-white font-bold rounded-xl">
          Go to Home
        </button>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="bg-primary text-white px-4 py-4 shadow-sm z-10">
        <h1 className="text-lg font-bold">Post Property</h1>
        <div className="flex items-center gap-2 mt-3">
          <div className="flex-1 h-1.5 rounded-full bg-white"></div>
          <div className={`flex-1 h-1.5 rounded-full ${step >= 2 ? 'bg-white' : 'bg-white/30'}`}></div>
          <div className={`flex-1 h-1.5 rounded-full ${step >= 3 ? 'bg-white' : 'bg-white/30'}`}></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-24">
        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold text-slate-800 mb-6">What kind of property?</h2>
            
            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-700">Listing Type</label>
              <div className="flex gap-4">
                <button className="flex-1 py-3 border-2 border-primary bg-primary/5 text-primary font-bold rounded-xl">Rent</button>
                <button className="flex-1 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl">Sell</button>
              </div>

              <div className="pt-4">
                <label className="block text-sm font-bold text-slate-700 mb-3">Property Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Apartment', 'Independent House', 'Villa', 'Plot'].map(type => (
                    <div key={type} className="p-4 border border-slate-200 rounded-xl flex flex-col items-center gap-2 text-center active:bg-slate-50">
                      <Home size={24} className="text-slate-400" />
                      <span className="text-sm font-medium text-slate-700">{type}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button onClick={() => setStep(2)} className="w-full mt-8 py-4 bg-primary text-white font-bold rounded-xl active:opacity-90">
              Next Step
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Property Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Property Title</label>
                <input type="text" placeholder="e.g. 2 BHK Modern Apartment" className="w-full p-3 border border-slate-200 rounded-xl focus:border-primary" />
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">City</label>
                  <input type="text" placeholder="e.g. Bangalore" className="w-full p-3 border border-slate-200 rounded-xl focus:border-primary" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Locality</label>
                  <input type="text" placeholder="e.g. HSR Layout" className="w-full p-3 border border-slate-200 rounded-xl focus:border-primary" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Expected Rent (₹/month)</label>
                <div className="relative">
                  <DollarSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="number" placeholder="25000" className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:border-primary" />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={() => setStep(1)} className="py-4 px-6 bg-slate-100 text-slate-700 font-bold rounded-xl">Back</button>
              <button onClick={() => setStep(3)} className="flex-1 py-4 bg-primary text-white font-bold rounded-xl active:opacity-90">Next Step</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Photos & Description</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                <textarea rows={4} placeholder="Describe your property..." className="w-full p-3 border border-slate-200 rounded-xl focus:border-primary resize-none"></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Add Photos</label>
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-slate-50">
                  <ImageIcon size={32} className="text-slate-400 mb-2" />
                  <div className="font-semibold text-slate-700">Upload Photos</div>
                  <div className="text-xs text-slate-500 mt-1">Tap to select from gallery</div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={() => setStep(2)} className="py-4 px-6 bg-slate-100 text-slate-700 font-bold rounded-xl">Back</button>
              <button onClick={() => {
                // In a real app we'd submit data here
                setSubmitted(true)
              }} className="flex-1 py-4 bg-emerald-500 text-white font-bold rounded-xl active:opacity-90">Submit Listing</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
