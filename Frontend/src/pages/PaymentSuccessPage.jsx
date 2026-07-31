// src/pages/PaymentSuccessPage.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaCheckCircle, FaSpinner, FaArrowRight, FaBuilding,
  FaUser, FaEnvelope, FaPhone, FaGlobe, FaRocket,
  FaClock, FaFileAlt, FaPaperPlane, FaExclamationTriangle
} from 'react-icons/fa';

const API_BASE = import.meta.env.VITE_API_URL || '';

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const serviceSlug = searchParams.get('service') || '';
  const packageTier = searchParams.get('package') || '';

  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [verifyError, setVerifyError] = useState('');

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const [form, setForm] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    websiteUrl: '',
    projectGoal: '',
    timeline: '',
    budgetNotes: '',
    additionalNotes: '',
  });

  // Verify payment on mount
  useEffect(() => {
    const verify = async () => {
      if (!sessionId) {
        setVerifyError('No payment session found.');
        setVerifying(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/api/payments/verify-session/${sessionId}`);
        const data = await res.json();
        if (data.paid) {
          setVerified(true);
          setPaymentInfo(data);
          // Pre-fill email if available
          if (data.customerEmail) {
            setForm(f => ({ ...f, email: data.customerEmail }));
          }
        } else {
          setVerifyError('Payment not confirmed. Please contact support.');
        }
      } catch (err) {
        setVerifyError('Could not verify payment. Please contact support.');
      } finally {
        setVerifying(false);
      }
    };
    verify();
  }, [sessionId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');

    try {
      const res = await fetch(`${API_BASE}/api/payments/save-project-details`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          serviceSlug,
          packageTier,
          ...form,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setFormSubmitted(true);
      } else {
        setSubmitError(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setSubmitError('Network error. Please try again or contact support.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Loading state ──────────────────────────────────────────────────────────
  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FaSpinner className="text-blue-600 text-4xl animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (verifyError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <FaExclamationTriangle className="text-red-500 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Verification Failed</h2>
          <p className="text-gray-600 mb-6">{verifyError}</p>
          <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors">
            Contact Support <FaArrowRight />
          </Link>
        </div>
      </div>
    );
  }

  // ── Form submitted success ─────────────────────────────────────────────────
  if (formSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-lg"
        >
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheckCircle className="text-green-500 text-5xl" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">You're All Set, {form.contactName || 'there'}!</h2>
          <p className="text-gray-600 mb-3 text-lg">
            Your payment is confirmed and your project details have been received.
          </p>
          <p className="text-gray-500 mb-8">
            A member of our team will reach out to <strong>{form.email}</strong> within <strong>24 hours</strong> to kick things off.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors">
              Back to Home
            </Link>
            <Link to="/services" className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors">
              Browse More Services
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Main: payment confirmed, show project details form ────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top confirmation banner */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center shrink-0">
              <FaCheckCircle className="text-white text-3xl" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Payment Confirmed!</h1>
              <p className="text-green-100 mt-1">
                {paymentInfo?.amountTotal
                  ? `$${paymentInfo.amountTotal.toLocaleString()} received.`
                  : 'Payment received.'}{' '}
                Now tell us about your project so we can get started.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Left: What happens next */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sticky top-6">
              <h3 className="font-bold text-gray-900 mb-5">What Happens Next</h3>
              <div className="space-y-5">
                {[
                  { icon: <FaFileAlt />, step: '1', title: 'Fill in your details', desc: 'Tell us about your business and project goals' },
                  { icon: <FaCheckCircle />, step: '2', title: 'We review & confirm', desc: 'Our team reviews your submission within 24 hours' },
                  { icon: <FaRocket />, step: '3', title: 'Work begins', desc: 'Your assigned specialist contacts you to kick off' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {paymentInfo && (
                <div className="mt-6 pt-5 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Payment Summary</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount paid</span>
                      <span className="font-bold text-green-600">${paymentInfo.amountTotal?.toLocaleString()}</span>
                    </div>
                    {serviceSlug && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Service</span>
                        <span className="font-medium text-gray-800 capitalize">{serviceSlug.replace(/-/g, ' ')}</span>
                      </div>
                    )}
                    {packageTier && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Package</span>
                        <span className="font-medium text-gray-800 capitalize">{packageTier}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Project details form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell Us About Your Project</h2>
              <p className="text-gray-500 mb-8">Fill in the details below so our team can get started on the right foot.</p>

              {submitError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                  {submitError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Business Info */}
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">Business Information</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Business Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FaBuilding className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                        <input
                          type="text"
                          name="businessName"
                          value={form.businessName}
                          onChange={handleChange}
                          required
                          placeholder="Your business name"
                          className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Contact Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                        <input
                          type="text"
                          name="contactName"
                          value={form.contactName}
                          onChange={handleChange}
                          required
                          placeholder="Your full name"
                          className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          required
                          placeholder="you@company.com"
                          className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
                      <div className="relative">
                        <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="+1 (555) 000-0000"
                          className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Current Website URL</label>
                    <div className="relative">
                      <FaGlobe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                      <input
                        type="url"
                        name="websiteUrl"
                        value={form.websiteUrl}
                        onChange={handleChange}
                        placeholder="https://yourwebsite.com (leave blank if none)"
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Project Details */}
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">Project Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        What is the main goal of this project? <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="projectGoal"
                        value={form.projectGoal}
                        onChange={handleChange}
                        required
                        rows={3}
                        placeholder="e.g. I want a website that generates leads for my consulting business, showcases my services, and allows clients to book appointments..."
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          <FaClock className="inline mr-1 text-gray-400" />
                          Preferred Timeline
                        </label>
                        <select
                          name="timeline"
                          value={form.timeline}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        >
                          <option value="">Select timeline</option>
                          <option value="asap">As soon as possible</option>
                          <option value="1-2weeks">1-2 weeks</option>
                          <option value="1month">Within 1 month</option>
                          <option value="2-3months">2-3 months</option>
                          <option value="flexible">Flexible</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Budget Notes</label>
                        <input
                          type="text"
                          name="budgetNotes"
                          value={form.budgetNotes}
                          onChange={handleChange}
                          placeholder="Any budget constraints or notes"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Additional Notes or Requirements</label>
                      <textarea
                        name="additionalNotes"
                        value={form.additionalNotes}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Share any specific requirements, inspiration websites, brand guidelines, or anything else that will help us deliver exactly what you need..."
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-base"
                >
                  {submitting ? (
                    <><FaSpinner className="animate-spin" /> Submitting...</>
                  ) : (
                    <><FaPaperPlane /> Submit Project Details</>
                  )}
                </button>

                <p className="text-center text-xs text-gray-400">
                  By submitting, you confirm your project details are accurate. Our team will reach out within 24 hours.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;