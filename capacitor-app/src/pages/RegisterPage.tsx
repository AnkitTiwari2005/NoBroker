import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, User, Mail, Lock, Eye, EyeOff, Phone, Building2, Search, Shield, AlertCircle } from 'lucide-react';
import { useAuth } from '../AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [step, setStep] = useState(0); // 0 = role, 1 = form
  const [role, setRole] = useState<'seeker' | 'owner' | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (selectedRole: 'seeker' | 'owner') => {
    setRole(selectedRole);
    setStep(1);
  };

  const getPasswordStrength = () => {
    if (!password) return { level: 0, label: '' };
    if (password.length < 8 || /^[a-zA-Z]+$/.test(password)) return { level: 1, label: 'Weak', color: 'bg-red-500' };
    if (password.length >= 8 && /[0-9]/.test(password) && /[^a-zA-Z0-9]/.test(password)) return { level: 3, label: 'Strong', color: 'bg-emerald-500' };
    return { level: 2, label: 'Good', color: 'bg-amber-500' };
  };

  const strength = getPasswordStrength();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !phone || !password || !confirmPassword) {
      setError('All fields are required'); return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setError('Invalid email address'); return;
    }
    if (phone.length !== 10 || !/^\d+$/.test(phone)) {
      setError('Phone number must be 10 digits'); return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters'); return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match'); return;
    }

    try {
      setLoading(true);
      await register({ name, email, password, role: role!, phone });
      if (role === 'owner') {
        navigate('/account', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col page-enter" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
      {step === 0 && (
        <div className="flex-1 flex flex-col px-6 py-10">
          <div className="mb-10">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-100 mb-4 btn-press block">
              <ArrowLeft className="w-6 h-6 text-slate-800" />
            </button>
            <h1 className="text-3xl font-black text-slate-900 mb-2">Create Account</h1>
            <p className="text-slate-500 font-medium">How would you like to use NoBroker?</p>
          </div>

          <div className="space-y-4">
            <button 
              onClick={() => handleRoleSelect('seeker')}
              className="w-full p-6 text-left border-2 border-slate-200 rounded-2xl bg-white hover:border-blue-500 hover:bg-blue-50/50 transition-all btn-press flex flex-col group"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30 mb-4">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-700 mb-1">Property Seeker</h3>
              <p className="text-sm font-medium text-slate-500 group-hover:text-blue-600/70">Find your perfect home to rent or buy.</p>
            </button>

            <button 
              onClick={() => handleRoleSelect('owner')}
              className="w-full p-6 text-left border-2 border-slate-200 rounded-2xl bg-white hover:border-amber-500 hover:bg-amber-50/50 transition-all btn-press flex flex-col group"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-amber-500/30 mb-4">
                <Building2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 group-hover:text-amber-700 mb-1">Property Owner/Seller</h3>
              <p className="text-sm font-medium text-slate-500 group-hover:text-amber-600/70">List and sell properties without brokerage.</p>
            </button>
          </div>

          <div className="mt-auto text-center text-sm font-medium text-slate-500 pb-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-bold hover:underline">
              Log in
            </Link>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="flex-1 flex flex-col px-6 py-6 overflow-y-auto pb-24">
          <div className="flex items-center mb-6">
            <button onClick={() => setStep(0)} className="p-2 -ml-2 rounded-full hover:bg-slate-100 btn-press">
              <ArrowLeft className="w-6 h-6 text-slate-800" />
            </button>
            <div className="flex-1 text-center font-bold text-lg text-slate-800">
              {role === 'seeker' ? 'Seeker Registration' : 'Owner Registration'}
            </div>
            <div className="w-10" />
          </div>

          {role === 'owner' && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
              <Shield className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-amber-800 leading-snug">
                Your account will require admin approval before you can list properties.
              </p>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm font-semibold rounded-xl flex items-center gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" /> {error}
              </div>
            )}

            <div>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3.5 text-slate-900 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium" placeholder="Full Name" />
              </div>
            </div>

            <div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3.5 text-slate-900 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium" placeholder="Email Address" />
              </div>
            </div>

            <div>
              <div className="relative flex">
                <div className="flex items-center pl-4 pr-3 py-3.5 bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl text-slate-500 font-bold border-r">
                  <Phone className="w-4 h-4 mr-1.5" /> +91
                </div>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="flex-1 bg-slate-50 border border-slate-200 rounded-r-xl px-4 py-3.5 text-slate-900 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium" placeholder="Mobile Number" maxLength={10} />
              </div>
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-12 py-3.5 text-slate-900 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium" placeholder="Password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {password && (
                <div className="mt-2 px-1 flex items-center justify-between">
                  <div className="flex gap-1 w-24">
                    <div className={`h-1 flex-1 rounded-full ${strength.level >= 1 ? strength.color : 'bg-slate-200'}`} />
                    <div className={`h-1 flex-1 rounded-full ${strength.level >= 2 ? strength.color : 'bg-slate-200'}`} />
                    <div className={`h-1 flex-1 rounded-full ${strength.level >= 3 ? strength.color : 'bg-slate-200'}`} />
                  </div>
                  <span className={`text-[10px] font-bold uppercase ${strength.level === 1 ? 'text-red-500' : strength.level === 2 ? 'text-amber-500' : 'text-emerald-500'}`}>
                    {strength.label}
                  </span>
                </div>
              )}
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3.5 text-slate-900 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium" placeholder="Confirm Password" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg mt-6 flex items-center justify-center btn-press disabled:opacity-70 disabled:active:scale-100 shadow-[0_4px_14px_rgba(30,58,95,0.2)]">
              {loading ? <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" /> : 'Create Account'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
