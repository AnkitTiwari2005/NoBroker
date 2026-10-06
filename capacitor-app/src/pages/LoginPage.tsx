import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Mail, Lock, Eye, EyeOff, AlertCircle, User, Building2 } from 'lucide-react';
import { useAuth } from '../AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await login(email, password);
      
      const stored = localStorage.getItem('nobroker_user');
      const u = stored ? JSON.parse(stored) : null;
      
      if (u?.role === 'admin') navigate('/admin', { replace: true });
      else navigate('/', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col page-enter" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
      <div className="flex-1 flex flex-col px-6 py-10 overflow-y-auto">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4 shadow-lg shadow-primary/30">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-slate-500 font-medium">Sign in to continue to NoBroker</p>
        </div>

        <div className="mb-8 flex gap-3">
          <button 
            onClick={() => { setEmail('demo@nobroker.com'); setPassword('password'); }}
            className="flex-1 bg-blue-50 border border-blue-100 p-3 rounded-xl flex flex-col items-center btn-press"
          >
            <User className="w-6 h-6 text-blue-600 mb-1" />
            <span className="text-xs font-bold text-slate-700">Seeker Demo</span>
          </button>
          <button 
            onClick={() => { setEmail('owner@nobroker.com'); setPassword('password'); }}
            className="flex-1 bg-amber-50 border border-amber-100 p-3 rounded-xl flex flex-col items-center btn-press"
          >
            <Building2 className="w-6 h-6 text-amber-600 mb-1" />
            <span className="text-xs font-bold text-slate-700">Owner Demo</span>
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 text-sm font-semibold rounded-xl flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3.5 text-slate-900 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-12 py-3.5 text-slate-900 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg mt-2 flex items-center justify-center btn-press disabled:opacity-70 disabled:active:scale-100 shadow-[0_4px_14px_rgba(30,58,95,0.2)]"
          >
            {loading ? (
              <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm font-medium text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary font-bold hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
