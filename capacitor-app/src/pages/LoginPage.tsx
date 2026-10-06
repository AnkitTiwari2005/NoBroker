import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react'
import { useAuth } from '../AuthContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) { setError('Please fill in all fields'); return }
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/', { replace: true })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = () => { setEmail('demo@nobroker.com'); setPassword('Demo@123') }

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Top gradient */}
      <div className="bg-gradient-to-b from-primary to-primary-light px-6 pt-16 pb-12 flex flex-col items-center">
        <div className="text-white text-3xl font-extrabold tracking-tight">NoBroker</div>
        <div className="text-blue-200 text-sm mt-1">Find your perfect home</div>
      </div>

      {/* Form card */}
      <div className="flex-1 -mt-6 bg-white rounded-t-3xl px-6 pt-8 overflow-y-auto">
        <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
        <p className="text-slate-500 text-sm mt-1">Sign in to continue</p>

        {/* Demo hint */}
        <button
          onClick={fillDemo}
          className="mt-4 w-full border-2 border-dashed border-amber-300 bg-amber-50 rounded-xl p-3 text-left"
        >
          <div className="text-amber-700 text-xs font-semibold">🧪 Demo Credentials</div>
          <div className="text-amber-600 text-xs mt-0.5">Email: demo@nobroker.com | Password: Demo@123</div>
          <div className="text-amber-500 text-xs">Tap to auto-fill →</div>
        </button>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
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
            className="w-full bg-primary text-white py-3.5 rounded-xl font-semibold text-base disabled:opacity-60 active:opacity-80"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-slate-400 text-xs">OR</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        <p className="text-center text-sm text-slate-600">
          New here?{' '}
          <Link to="/register" className="text-primary font-semibold">Create account</Link>
        </p>

        <p className="text-center text-xs text-slate-400 mt-6 pb-8">
          By continuing, you agree to our Terms of Service & Privacy Policy
        </p>
      </div>
    </div>
  )
}
