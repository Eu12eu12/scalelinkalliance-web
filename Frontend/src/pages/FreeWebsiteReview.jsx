// Frontend/src/pages/FreeWebsiteReview.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaCheckCircle, FaClock, FaShieldAlt, FaUser,
  FaStar
} from 'react-icons/fa';
import axios from 'axios';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const FreeWebsiteReview = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    businessName: '',
    websiteUrl: '',
    email: '',
    phone: '',
    industry: '',
    message: '',
    agreeToContact: false
  });

    useEffect(() => {
      document.title = 'Free Business Website Review | ScaleLink Alliance';
  
      const setMeta = (name, content) => {
        let tag = document.querySelector(`meta[name="${name}"]`);
        if (!tag) {
          tag = document.createElement('meta');
          tag.setAttribute('name', name);
          document.head.appendChild(tag);
        }
        tag.setAttribute('content', content);
      };

      setMeta('description', 'Get in touch with ScaleLink Alliance for business services and partnerships.');
  }, []);

  
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear errors for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (submitError) setSubmitError('');
  };

  const handlePhoneChange = (value) => {
    setFormData(prev => ({
      ...prev,
      phone: value || ''
    }));
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: '' }));
    }
    if (submitError) setSubmitError('');
  };

  // Helper function to format URL
  const formatUrl = (url) => {
    url = url.trim();
    if (!url) return url;
    
    // If URL doesn't start with http:// or https://, add https://
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };

  // Helper function to validate URL
  const isValidUrl = (url) => {
    try {
      // Add https:// if missing for validation
      const formattedUrl = formatUrl(url);
      new URL(formattedUrl);
      return true;
    } catch {
      return false;
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    
    if (!formData.websiteUrl.trim()) {
      newErrors.websiteUrl = 'Website URL is required';
    } else if (!isValidUrl(formData.websiteUrl)) {
      newErrors.websiteUrl = 'Please enter a valid URL (e.g., youtube.com or www.youtube.com)';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+[1-9]\d{1,14}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (!formData.agreeToContact) newErrors.agreeToContact = 'You must agree to be contacted';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    setSubmitError('');
    
    try {
      // Format the URL before sending
      const formattedWebsiteUrl = formatUrl(formData.websiteUrl);
      
      const response = await axios.post('/api/leads/website-review', {
        ...formData,
        websiteUrl: formattedWebsiteUrl, // Send the formatted URL
        leadType: 'website_review',
        leadSource: 'website_review_form',
        reviewStatus: 'pending'
      });
      
      if (response.data.success) {
        setSubmitted(true);
        // Send confirmation email
        try {
          await axios.post('/api/leads/send-confirmation', {
            email: formData.email,
            firstName: formData.firstName
          });
        } catch (emailError) {
          console.log('Email notification error:', emailError);
        }
      } else {
        setSubmitError('Something went wrong. Please try again.');
      }
      
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError(error.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const reviewItems = [
    'Website Design & User Experience',
    'Mobile Responsiveness',
    'SEO & Search Visibility',
    'Speed & Performance',
    'Calls-to-Action & Lead Generation',
    'Trust & Credibility Signals',
    'Conversion Optimization',
    'Content Quality & Structure',
    'Technical Issues',
    'Overall Growth Opportunities'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            <FaStar className="text-amber-500" />
            100% Free • No Obligation
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Get Your Free <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Website Review</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Our team will personally review your website and deliver actionable recommendations 
            to help you grow your business online.
          </p>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10"
        >
          {[
            { icon: <FaClock className="text-amber-500" />, text: 'Review delivered within 24-48 hours' },
            { icon: <FaShieldAlt className="text-amber-500" />, text: 'No obligation, completely free' },
            { icon: <FaUser className="text-amber-500" />, text: 'Reviewed by real experts' }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="text-xl">{item.icon}</div>
              <span className="text-sm text-gray-700 font-medium">{item.text}</span>
            </div>
          ))}
        </motion.div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-10">
          
          {/* Left Column - Benefits */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                What We'll Review
              </h2>
              <ul className="space-y-2.5">
                {reviewItems.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-700">
                    <FaCheckCircle className="text-green-500 mt-0.5 shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
                <p className="text-sm text-gray-700">
                  <span className="font-bold text-amber-700">✓</span> You'll receive a personalized report with 
                  <span className="font-semibold"> actionable recommendations</span> and a 
                  <span className="font-semibold"> free consultation</span> to discuss next steps.
                </p>
              </div>
              
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                <FaClock className="text-amber-400" />
                <span>Review takes 2-3 minutes to request</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {!submitted ? (
              <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  Request Your Review
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Fill out the form below and we'll get started
                </p>
                
                {submitError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {submitError}
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent transition outline-none`}
                        placeholder="John"
                      />
                      {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent transition outline-none`}
                        placeholder="Doe"
                      />
                      {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Business Name <span className="text-gray-400 text-xs">(optional)</span>
                      </label>
                      <input
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent transition outline-none"
                        placeholder="Acme Corporation"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Website Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="websiteUrl"
                        value={formData.websiteUrl}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 border ${errors.websiteUrl ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent transition outline-none`}
                        placeholder="youtube.com or www.youtube.com"
                      />
                      {errors.websiteUrl && <p className="text-red-500 text-xs mt-1">{errors.websiteUrl}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent transition outline-none`}
                        placeholder="you@example.com"
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className={`relative ${errors.phone ? 'border-red-500' : ''}`}>
                        <PhoneInput
                          international
                          defaultCountry="US"
                          value={formData.phone}
                          onChange={handlePhoneChange}
                          className="w-full"
                          placeholder="Enter phone number"
                        />
                      </div>
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Industry <span className="text-gray-400 text-xs">(optional)</span>
                      </label>
                      <input
                        type="text"
                        name="industry"
                        value={formData.industry}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent transition outline-none"
                        placeholder="e.g., Real Estate, SaaS, Retail"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Message <span className="text-gray-400 text-xs">(optional)</span>
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="3"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent transition outline-none resize-none"
                        placeholder="Tell us about your website goals or specific concerns..."
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        name="agreeToContact"
                        checked={formData.agreeToContact}
                        onChange={handleChange}
                        className={`mt-1 w-4 h-4 text-amber-500 focus:ring-amber-400 rounded border-gray-300 ${errors.agreeToContact ? 'border-red-500' : ''}`}
                      />
                      <span className="text-sm text-gray-600">
                        I agree to be contacted regarding my website review.
                        <span className="text-red-500"> *</span>
                      </span>
                    </label>
                    {errors.agreeToContact && <p className="text-red-500 text-xs mt-1">{errors.agreeToContact}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-6 px-8 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 text-gray-900 font-bold rounded-xl hover:from-amber-500 hover:to-amber-600 transition-all shadow-lg shadow-amber-400/30 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      'Get My Free Review'
                    )}
                  </button>

                  <p className="text-center text-xs text-gray-400 mt-4">
                    By submitting, you agree to our Privacy Policy. Your information is secure and will never be shared.
                  </p>
                </form>
              </div>
            ) : (
              // Success State
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-green-200 text-center"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaCheckCircle className="text-green-500 text-4xl" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  Review Requested! ✓
                </h2>
                <p className="text-lg text-gray-600 mb-4 max-w-md mx-auto">
                  Thanks for requesting your free website review, {formData.firstName}!
                </p>
                <div className="bg-gray-50 rounded-xl p-6 text-left max-w-lg mx-auto">
                  <p className="text-sm text-gray-700 font-semibold mb-3">
                    Our team will review your website and evaluate:
                  </p>
                  <ul className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    {[
                      'Design & UX', 'SEO', 'Performance', 'Mobile Responsiveness',
                      'Lead Generation', 'Conversion Opportunities'
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <FaCheckCircle className="text-green-400 text-xs" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="text-gray-500 mt-4">
                  We'll contact you within <strong>24-48 hours</strong> with personalized recommendations.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                  <Link
                    to="/"
                    className="px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition"
                  >
                    Return to Home
                  </Link>
                  <Link
                    to="/services"
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                  >
                    Browse Services
                  </Link>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-gray-500">
            Already know what you need? <Link to="/services" className="text-blue-600 hover:underline font-semibold">Browse all services →</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default FreeWebsiteReview;