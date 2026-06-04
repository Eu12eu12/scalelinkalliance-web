import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaLock, FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/cms/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('cms_token', data.token);
        
        // Check if user needs to complete profile
        if (data.user.role === 'worker' && (!data.user.isProfileComplete || data.user.mustChangePassword)) {
          toast.info('Please complete your profile setup.');
          navigate('/hub/complete-profile');
        } else {
          navigate('/hub');
        }
      } else {
        setError(data.error || 'Invalid credentials. Please try again.');
      }
    } catch {
      setError('A network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── Left panel — dark brand side ── */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ backgroundColor: '#0f172a' }}
      >
        {/* Decorative gradient blob */}
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #2563eb, transparent)' }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }}
        />

        {/* Logo */}
        <Link to="/" className="relative z-10 flex items-center space-x-3 group">
          <img 
            src="/scalelink-logo.png" 
            alt="ScaleLink Alliance" 
            className="h-10 w-auto transition-transform group-hover:scale-105"
          />
          <span className="text-white font-bold text-xl tracking-tight">ScaleLink Alliance</span>
        </Link>

        {/* Centre copy */}
        <div className="relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mb-6">
            <FaLock className="text-blue-400" size={22} />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            Secure Hub<br />Access Portal
          </h2>
          <p className="text-slate-400 text-base leading-relaxed max-w-sm">
            Manage your resources, partner network, and operations notice board — your all-in-one backend system, protected by enterprise-grade authentication.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 mt-8">
            {['Role Protected', 'Encrypted'].map(tag => (
              <span
                key={tag}
                className="px-3 py-1.5 rounded-full text-xs font-medium border"
                style={{ borderColor: 'rgba(148,163,184,0.2)', color: '#94a3b8', backgroundColor: 'rgba(148,163,184,0.05)' }}
              >
                ✓ {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="relative z-10 text-slate-600 text-xs">
          © {new Date().getFullYear()} ScaleLink Alliance. All rights reserved.
        </p>
      </div>

      {/* ── Right panel — login form ── */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <Link to="/" className="flex items-center space-x-3 mb-10 lg:hidden">
            <img 
              src="/scalelink-logo.png" 
              alt="ScaleLink Alliance" 
              className="h-8 w-auto"
            />
            <p className="font-bold text-slate-800 text-lg">ScaleLink Alliance</p>
          </Link>

          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 p-8 border border-slate-100">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h1>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="admin@scalelink.com"
                    className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center space-x-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                  <span>⚠</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 relative overflow-hidden disabled:opacity-70"
                style={{ background: loading ? '#3b82f6' : 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}
              >
                {loading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>Authenticating...</span>
                  </span>
                ) : (
                  'Sign In to Dashboard'
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            ScaleLink Alliance Management Hub
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
