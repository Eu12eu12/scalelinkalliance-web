import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { FaLock, FaUser, FaPhone, FaMapMarkerAlt, FaGlobe, FaSpinner, FaEye, FaEyeSlash, FaCheckCircle, FaArrowRight, FaArrowLeft, FaSignOutAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

const CompleteProfile = () => {
  const [currentStep, setCurrentStep] = useState(2); // Start at Step 2: Set Password
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
    fullName: '',
    phoneNumber: '',
    address: '',
    zipCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('cms_token');

  // If no token, redirect to login
  if (!token) return <Navigate to="/hub/login" />;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    if (currentStep === 2) {
      if (!formData.password || !formData.confirmPassword) {
        return toast.error('Please fill in both password fields');
      }
      if (formData.password !== formData.confirmPassword) {
        return toast.error('Passwords do not match');
      }
      if (formData.password.length < 8) {
        return toast.error('Password must be at least 8 characters long');
      }
      setCurrentStep(3);
    }
  };

  const prevStep = () => {
    if (currentStep === 3) setCurrentStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phoneNumber || !formData.address || !formData.zipCode) {
      return toast.error('Please complete all profile fields');
    }

    setLoading(true);
    try {
      const res = await fetch('/api/cms/complete-profile', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Welcome! Your profile is now complete.');
        // Navigate straight to dashboard
        navigate('/hub');
      } else {
        toast.error(data.error || 'Failed to complete profile');
      }
    } catch (err) {
      toast.error('Connection error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('cms_token');
    toast.info('Signed out successfully');
    navigate('/hub/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <div className="max-w-2xl w-full bg-white rounded-[32px] shadow-2xl shadow-slate-200/50 overflow-hidden flex flex-col md:flex-row border border-slate-100 relative">
        
        {/* Decorative Side Panel */}
        <div className="hidden md:flex md:w-1/3 bg-blue-600 p-10 flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          
          <div className="relative z-10">
            <img src="/scalelink-logo.png" alt="Logo" className="h-8 w-auto mb-8 brightness-0 invert" />
            <h2 className="text-2xl font-bold text-white mb-4">
              {currentStep === 2 ? 'Security First' : 'Almost There!'}
            </h2>
            <p className="text-blue-100 text-sm leading-relaxed">
              {currentStep === 2 
                ? 'Choose a strong password to protect your worker account and projects.' 
                : 'Fill in your professional details to finalize your onboarding.'}
            </p>
          </div>
          
          <div className="relative z-10 space-y-3">
            {[
              { id: 1, label: 'Verify Identity' },
              { id: 2, label: 'Set Password' },
              { id: 3, label: 'Complete Profile' }
            ].map((step) => (
              <div key={step.id} className="flex items-center space-x-3">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] transition-all duration-300 ${
                  step.id < currentStep 
                    ? 'bg-green-400 border-green-400 text-white' 
                    : step.id === currentStep 
                      ? 'bg-white text-blue-600 border-white font-bold' 
                      : 'border-white/30 text-white/60'
                }`}>
                  {step.id < currentStep ? '✓' : step.id}
                </div>
                <span className={`text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  step.id === currentStep ? 'text-white scale-105 origin-left' : 'text-white/60'
                }`}>{step.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 p-8 md:p-12 relative">
          {/* Sign Out Button */}
          <button
            onClick={handleLogout}
            className="absolute top-6 right-6 flex items-center space-x-1.5 text-slate-400 hover:text-rose-500 transition-colors group"
            title="Sign Out"
          >
            <span className="text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Sign Out</span>
            <FaSignOutAlt size={16} />
          </button>

          <div className="mb-8">
            <div className="flex items-center space-x-2 text-blue-600 mb-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-blue-50 px-2.5 py-1 rounded-md">Step {currentStep} of 3</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-800">
              {currentStep === 2 ? 'Secure Your Account' : 'Profile Details'}
            </h1>
            <p className="text-slate-500 text-sm">
              {currentStep === 2 ? 'Please set your permanent access password.' : 'Tell us a bit more about yourself.'}
            </p>
          </div>

          <form onSubmit={currentStep === 2 ? (e) => { e.preventDefault(); nextStep(); } : handleSubmit} className="space-y-6">
            {currentStep === 2 ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">New Password</label>
                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-11 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm placeholder:text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                    >
                      {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Confirm Password</label>
                  <div className="relative">
                    <FaCheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm placeholder:text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={nextStep}
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center space-x-2 active:scale-[0.98]"
                >
                  <span>Continue to Profile</span>
                  <FaArrowRight size={12} />
                </button>
              </div>
            ) : (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</label>
                    <div className="relative">
                      <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                      <input
                        type="text"
                        required
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm placeholder:text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Phone Number</label>
                    <div className="relative">
                      <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                      <input
                        type="tel"
                        required
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm placeholder:text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Office/Home Address</label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                    <input
                      type="text"
                      required
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm placeholder:text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                      placeholder="123 Street Name, City"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">ZIP / Postal Code</label>
                  <div className="relative">
                    <FaGlobe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                    <input
                      type="text"
                      required
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm placeholder:text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                      placeholder="10001"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all flex items-center justify-center space-x-2"
                  >
                    <FaArrowLeft size={12} />
                    <span>Back</span>
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center space-x-2 active:scale-[0.98] disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        <span>Finishing...</span>
                      </>
                    ) : (
                      <>
                        <span>Complete Setup</span>
                        <FaCheckCircle size={14} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;
