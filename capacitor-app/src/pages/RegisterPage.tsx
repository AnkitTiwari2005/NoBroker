import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft, ArrowRight, AlertCircle, Home, Key } from 'lucide-react'
import { useAuth } from '../AuthContext'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [step, setStep] = useState(1)
  const [role, setRole] = useState<'seeker' | 'owner'>('seeker')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleNext = () => {
    setStep(2)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !phone || !email || !password) { setError('Please fill in all fields'); return }
    setError('')
    setLoading(true)
    try {
      await register({ name, phone, email, password, role })
      navigate('/', { replace: true })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Top header */}
      <div className="px-6 pt-12 pb-6 bg-gradient-to-b from-primary to-primary-light flex items-center gap-4">
        <button onClick={() => step === 2 ? setStep(1) : navigate(-1)} className="text-white active:opacity-70">
          <ArrowLeft size={24} />
        </button>
        <div className="text-white text-xl font-bold">Create Account</div>
      </div>

      <div className="flex-1 -mt-4 bg-white rounded-t-3xl px-6 pt-8 overflow-y-auto pb-8">
        {step === 1 ? (
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Choose your role</h2>
            <p className="text-slate-500 text-sm mt-1 mb-8">What are you looking to do?</p>
            
            <div className="space-y-4">
              <button 
                onClick={() => setRole('seeker')}
                className={`w-full p-4 rounded-2xl border-2 flex items-center gap-4 text-left transition-all ${role === 'seeker' ? 'border-primary bg-primary/5' : 'border-slate-200'}`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${role === 'seeker' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <Key size={24} />
                </div>
                <div>
                  <div className="font-bold text-slate-900">I'm a Seeker</div>
                  <div className="text-slate-500 text-sm mt-0.5">Looking to rent or buy a property</div>
                </div>
              </button>
              
              <button 
                onClick={() => setRole('owner')}
                className={`w-full p-4 rounded-2xl border-2 flex items-center gap-4 text-left transition-all ${role === 'owner' ? 'border-primary bg-primary/5' : 'border-slate-200'}`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${role === 'owner' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <Home size={24} />
                </div>
                <div>
                  <div className="font-bold text-slate-900">I'm an Owner</div>
                  <div className="text-slate-500 text-sm mt-0.5">Looking to list my property</div>
                </div>
              </button>
            </div>
            
            <button
              onClick={handleNext}
              className="w-full mt-8 bg-primary text-white py-3.5 rounded-xl font-semibold text-base flex items-center justify-center gap-2 active:opacity-80"
            >
              Continue <ArrowRight size={18} />
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Your details</h2>
            <p className="text-slate-500 text-sm mt-1">Almost there! Fill in your information.</p>
            
            <form onSubmit={handleRegister} className="mt-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>
              </div>
              
              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="9999999999"
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full pl-10 pr-12 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3">
                  <AlertCircle size={16} />{error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-primary text-white py-3.5 rounded-xl font-semibold text-base disabled:opacity-60 active:opacity-80"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
          </div>
        )}
        
        <p className="text-center text-sm text-slate-600 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-semibold">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
