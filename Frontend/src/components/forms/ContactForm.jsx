// src/components/forms/ContactForm.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaUser, FaEnvelope, FaPhone, FaBuilding, 
  FaFileAlt, FaCalendar, FaUsers, FaCheck,
  FaSpinner, FaPaperPlane, FaExternalLinkAlt,
  FaChevronDown, FaSearch
} from 'react-icons/fa';
import emailjs from '@emailjs/browser';

// EmailJS Configuration - Replace with your actual credentials
const EMAILJS_SERVICE_ID = 'service_pal6nfn';
const EMAILJS_TEMPLATE_ID = 'template_wm2j04y';
const EMAILJS_PUBLIC_KEY = 'rPt33cxP6I1AxI5Bp';

const COUNTRIES = [
  { code: 'US', name: 'United States', dial: '+1', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', dial: '+44', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', dial: '+1', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', dial: '+61', flag: '🇦🇺' },
  { code: 'DE', name: 'Germany', dial: '+49', flag: '🇩🇪' },
  { code: 'FR', name: 'France', dial: '+33', flag: '🇫🇷' },
  { code: 'IN', name: 'India', dial: '+91', flag: '🇮🇳' },
  { code: 'CN', name: 'China', dial: '+86', flag: '🇨🇳' },
  { code: 'JP', name: 'Japan', dial: '+81', flag: '🇯🇵' },
  { code: 'BR', name: 'Brazil', dial: '+55', flag: '🇧🇷' },
  { code: 'MX', name: 'Mexico', dial: '+52', flag: '🇲🇽' },
  { code: 'ZA', name: 'South Africa', dial: '+27', flag: '🇿🇦' },
  { code: 'NG', name: 'Nigeria', dial: '+234', flag: '🇳🇬' },
  { code: 'KE', name: 'Kenya', dial: '+254', flag: '🇰🇪' },
  { code: 'EG', name: 'Egypt', dial: '+20', flag: '🇪🇬' },
  { code: 'SA', name: 'Saudi Arabia', dial: '+966', flag: '🇸🇦' },
  { code: 'AE', name: 'UAE', dial: '+971', flag: '🇦🇪' },
  { code: 'SG', name: 'Singapore', dial: '+65', flag: '🇸🇬' },
  { code: 'PH', name: 'Philippines', dial: '+63', flag: '🇵🇭' },
  { code: 'ID', name: 'Indonesia', dial: '+62', flag: '🇮🇩' },
  { code: 'PK', name: 'Pakistan', dial: '+92', flag: '🇵🇰' },
  { code: 'NZ', name: 'New Zealand', dial: '+64', flag: '🇳🇿' },
  { code: 'IE', name: 'Ireland', dial: '+353', flag: '🇮🇪' },
  { code: 'IT', name: 'Italy', dial: '+39', flag: '🇮🇹' },
  { code: 'ES', name: 'Spain', dial: '+34', flag: '🇪🇸' },
  { code: 'NL', name: 'Netherlands', dial: '+31', flag: '🇳🇱' },
  { code: 'SE', name: 'Sweden', dial: '+46', flag: '🇸🇪' },
  { code: 'NO', name: 'Norway', dial: '+47', flag: '🇳🇴' },
  { code: 'CH', name: 'Switzerland', dial: '+41', flag: '🇨🇭' },
  { code: 'PL', name: 'Poland', dial: '+48', flag: '🇵🇱' },
  { code: 'RU', name: 'Russia', dial: '+7', flag: '🇷🇺' },
  { code: 'TR', name: 'Turkey', dial: '+90', flag: '🇹🇷' },
  { code: 'GH', name: 'Ghana', dial: '+233', flag: '🇬🇭' },
  { code: 'TZ', name: 'Tanzania', dial: '+255', flag: '🇹🇿' },
  { code: 'CO', name: 'Colombia', dial: '+57', flag: '🇨🇴' },
  { code: 'AR', name: 'Argentina', dial: '+54', flag: '🇦🇷' },
  { code: 'CL', name: 'Chile', dial: '+56', flag: '🇨🇱' },
  { code: 'MY', name: 'Malaysia', dial: '+60', flag: '🇲🇾' },
  { code: 'TH', name: 'Thailand', dial: '+66', flag: '🇹🇭' },
  { code: 'VN', name: 'Vietnam', dial: '+84', flag: '🇻🇳' },
];

// ─── Phone Input with Country Code Picker ───────────────────────────────────
const PhoneInput = ({ value, onChange }) => {
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]); // US default
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  const filtered = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.dial.includes(search)
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setDropdownOpen(false);
    setSearch('');
    // Keep just the number digits, strip any existing dial code
    onChange({ target: { name: 'phone', value: value } });
  };

  const handleNumberChange = (e) => {
    // Only allow digits, spaces, dashes, parentheses
    const cleaned = e.target.value.replace(/[^\d\s\-()]/g, '');
    onChange({ target: { name: 'phone', value: cleaned } });
  };

  // The full phone value sent to the form (dial code + number)
  const fullPhone = value ? `${selectedCountry.dial} ${value}` : '';

  return (
    <div className="relative flex" ref={dropdownRef}>
      {/* Country Code Button */}
      <button
        type="button"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center space-x-1 px-3 py-3 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[90px]"
      >
        <span className="text-lg leading-none">{selectedCountry.flag}</span>
        <span className="text-sm font-medium text-gray-700">{selectedCountry.dial}</span>
        <FaChevronDown className={`text-gray-400 text-xs transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Number Input */}
      <input
        type="tel"
        name="phone"
        value={value}
        onChange={handleNumberChange}
        className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
        placeholder="(555) 000-0000"
      />

      {/* Hidden input with full value for form submission */}
      <input type="hidden" name="phone_full" value={fullPhone} />

      {/* Dropdown */}
      {dropdownOpen && (
        <div className="absolute top-full left-0 mt-1 w-72 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search country..."
                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>
          </div>

          {/* Country List */}
          <ul className="max-h-52 overflow-y-auto">
            {filtered.length > 0 ? filtered.map(country => (
              <li key={country.code}>
                <button
                  type="button"
                  onClick={() => handleCountrySelect(country)}
                  className={`w-full flex items-center space-x-3 px-4 py-2.5 text-sm hover:bg-blue-50 transition-colors text-left ${
                    selectedCountry.code === country.code ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                  }`}
                >
                  <span className="text-base">{country.flag}</span>
                  <span className="flex-1">{country.name}</span>
                  <span className="text-gray-400 text-xs font-mono">{country.dial}</span>
                </button>
              </li>
            )) : (
              <li className="px-4 py-3 text-sm text-gray-500 text-center">No results</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

// ─── Main ContactForm ────────────────────────────────────────────────────────
const ContactForm = ({ contactType = 'general' }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    website: '',
    subject: '',
    message: '',
    preferredContact: 'email',
    chapterInterest: '',
    serviceInterest: '',
    hearAboutUs: '',
    agreeToTerms: false,
    subscribeNewsletter: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState({});

  const getDynamicFields = () => {
    switch (contactType) {
      case 'membership':
        return { title: 'Membership Inquiry', placeholder: 'Tell us about your business and what you hope to gain from membership...', subjectPrefix: 'Membership Inquiry' };
      case 'chapter':
        return { title: 'Chapter Visit Request', placeholder: 'Which chapter are you interested in visiting? Preferred date? Number of attendees?...', subjectPrefix: 'Chapter Visit Request' };
      case 'services':
        return { title: 'Services Inquiry', placeholder: 'Describe the service you need, timeline, and budget...', subjectPrefix: 'Services Inquiry' };
      case 'director':
        return { title: 'Chapter Director Application', placeholder: 'Tell us about your leadership experience and why you want to start a chapter...', subjectPrefix: 'Director Application' };
      case 'press':
        return { title: 'Press & Media Inquiry', placeholder: 'Your media outlet, deadline, and specific questions...', subjectPrefix: 'Press Inquiry' };
      default:
        return { title: 'General Inquiry', placeholder: 'How can we help you today?...', subjectPrefix: 'General Inquiry' };
    }
  };

  const dynamicFields = getDynamicFields();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const templateParams = {
        to_email: 'support@scalelinkalliance.com',
        to_name: 'ScaleLink Alliance Team',
        from_name: `${formData.firstName} ${formData.lastName}`,
        from_email: formData.email,
        reply_to: formData.email,
        contact_type: dynamicFields.title,
        phone: formData.phone || 'Not provided',
        company: formData.company || 'Not provided',
        website: formData.website || 'Not provided',
        chapter_interest: formData.chapterInterest || 'N/A',
        service_interest: formData.serviceInterest || 'N/A',
        hear_about_us: formData.hearAboutUs || 'Not specified',
        preferred_contact: formData.preferredContact,
        newsletter_subscription: formData.subscribeNewsletter ? 'Yes' : 'No',
        message: formData.message,
        submission_date: new Date().toLocaleString(),
      };
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY);
      setSubmitSuccess(true);
      setTimeout(() => {
        setFormData({
          firstName: '', lastName: '', email: '', phone: '', company: '',
          website: '', subject: '', message: '', preferredContact: 'email',
          chapterInterest: '', serviceInterest: '', hearAboutUs: '',
          agreeToTerms: false, subscribeNewsletter: true
        });
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      setErrorMessage(`Error: ${error.text || 'Failed to send message. Please try again or email us directly at support@scalelinkalliance.com'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const hearAboutOptions = ['Referral from member', 'Google search', 'Social media', 'Event or conference', 'Email newsletter', 'Podcast or webinar', 'Other'];
  const serviceInterests = ['Graphic Design', 'Video Editing', 'Social Media Management', 'CRM & Automation', 'Copywriting', 'Digital Marketing', 'Web Development', 'Data Entry', 'Other'];

  if (submitSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-green-50 to-white p-8 rounded-xl border border-green-200"
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <FaCheck className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Message Sent Successfully!</h3>
          <p className="text-gray-600 mb-6">
            Thank you for contacting ScaleLink Alliance. We have received your {dynamicFields.title.toLowerCase()} and will respond within 24 hours.
          </p>
          <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
            <p className="text-sm text-gray-500">Sent To</p>
            <p className="text-lg font-bold text-gray-900">support@scalelinkalliance.com</p>
          </div>
          <p className="text-sm text-gray-500">A confirmation has been sent to {formData.email}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <strong>Error:</strong> {errorMessage}
        </div>
      )}

      <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
            <FaFileAlt className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{dynamicFields.title}</h3>
            <p className="text-sm text-gray-600">Fill out the form below and we'll get back to you within 24 hours.</p>
          </div>
        </div>
      </div>

      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="John"
            />
          </div>
          {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Doe"
            />
          </div>
          {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
        </div>
      </div>

      {/* Email + Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="john@example.com"
            />
          </div>
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        {/* ── Phone with Country Code ── */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <PhoneInput value={formData.phone} onChange={handleChange} />
          <p className="mt-1 text-xs text-gray-400">Select your country, then enter your number</p>
        </div>
      </div>

      {/* Business Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Company / Organization</label>
          <div className="relative">
            <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your Company LLC"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://example.com"
          />
        </div>
      </div>

      {contactType === 'chapter' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Chapter Location of Interest</label>
          <input
            type="text"
            name="chapterInterest"
            value={formData.chapterInterest}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., New York City, Los Angeles, Chicago, etc."
          />
        </div>
      )}

      {contactType === 'services' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Service(s) of Interest</label>
          <select
            name="serviceInterest"
            value={formData.serviceInterest}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a service</option>
            {serviceInterests.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">How did you hear about ScaleLink Alliance?</label>
        <select
          name="hearAboutUs"
          value={formData.hearAboutUs}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select an option</option>
          {hearAboutOptions.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={6}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.message ? 'border-red-500' : 'border-gray-300'}`}
          placeholder={dynamicFields.placeholder}
        />
        {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Preferred Contact Method</label>
        <div className="flex space-x-6">
          {['email', 'phone'].map(method => (
            <label key={method} className="flex items-center">
              <input
                type="radio"
                name="preferredContact"
                value={method}
                checked={formData.preferredContact === method}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700 capitalize">{method}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-start">
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
          />
          <label className="ml-2 text-sm text-gray-700">
            I agree to the{' '}
            <a href="/legal" className="text-blue-600 hover:underline">Privacy Policy</a>{' '}
            and understand that ScaleLink Alliance may contact me regarding my inquiry. *
          </label>
        </div>
        {errors.agreeToTerms && <p className="text-sm text-red-600">{errors.agreeToTerms}</p>}
        <div className="flex items-start">
          <input
            type="checkbox"
            name="subscribeNewsletter"
            checked={formData.subscribeNewsletter}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
          />
          <label className="ml-2 text-sm text-gray-700">
            Yes, I'd like to receive occasional updates, event invitations, and resources from ScaleLink Alliance.
          </label>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-4 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-3 ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl'
          }`}
        >
          {isSubmitting ? (
            <><FaSpinner className="animate-spin" /><span>Sending Message...</span></>
          ) : (
            <><FaPaperPlane /><span>Send Message to support@scalelinkalliance.com</span></>
          )}
        </button>
        <p className="mt-3 text-sm text-gray-500 text-center">
          Your message will be sent directly to our team. We typically respond within 24 hours.
        </p>
      </div>

      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-yellow-500 mt-0.5 mr-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm font-medium text-yellow-800">Need immediate assistance?</p>
            <p className="text-sm text-yellow-700 mt-1">
              For urgent matters, please call{' '}
              <a href="tel:+18156690642" className="font-semibold hover:underline">+1 (815) 669 0642</a>{' '}
              or email{' '}
              <a href="mailto:support@scalelinkalliance.com" className="font-semibold hover:underline">support@scalelinkalliance.com</a>
            </p>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ContactForm;