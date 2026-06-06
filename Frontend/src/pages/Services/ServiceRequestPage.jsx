// src/pages/Services/ServiceRequestPage.jsx
import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import {
  FaCheck, FaArrowRight, FaArrowLeft, FaPaintBrush, FaCode, FaChartLine, FaCogs,
  FaUser, FaEnvelope, FaPhone, FaBuilding, FaCalendar, FaDollarSign, FaPaperPlane,
  FaShieldAlt, FaFileContract, FaLock, FaCreditCard, FaSpinner, FaUpload, FaFile,
  FaTrash, FaCloudUploadAlt, FaGlobeAmericas, FaSearch, FaVideo, FaPenNib, FaPalette,
  FaCamera, FaShoppingCart, FaRocket, FaAd, FaEnvelope as FaEnvelopeIcon,
  FaSearch as FaSearchIcon, FaHeadset, FaProjectDiagram, FaDatabase, FaFileAlt,
  FaChartBar, FaUsers, FaRegBuilding, FaChevronDown, FaChevronUp, FaBriefcase
} from 'react-icons/fa';
import emailjs from '@emailjs/browser';
import { useDropzone } from 'react-dropzone';
import {
  COUNTRIES,
  CURRENCIES,
  SERVICES_WITH_PACKAGES,
  SERVICE_CATEGORIES,
  BUDGET_RANGES
} from '../../utils/formConstants';
import PhoneInput from '../../components/forms/PhoneInput';
import FileUpload from '../../components/forms/FileUpload';
import CurrencySelector from '../../components/forms/CurrencySelector';

// ─── Config ──────────────────────────────────────────────────────────────────
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const stripePromise = loadStripe('pk_live_51SuakDBMQmmi7eKWZSZGE9s1zpSfspXZEo2MCMLEcmid1NTppH6cc92B7xumi6kd5onkvULEK9dneaPQTHVqTD4400N9yjWxac');

//const EMAILJS_SERVICE_ID  = 'service_pal6nfn';
//const EMAILJS_TEMPLATE_ID = 'template_ockfprv';
//const EMAILJS_PUBLIC_KEY  = 'rPt33cxP6I1AxI5Bp';

const EMAILJS_SERVICE_ID = 'service_z0n4bpa';
const EMAILJS_TEMPLATE_ID = 'template_spxsoac';
const EMAILJS_PUBLIC_KEY = 'IRwXMIYIKhUnttcdY';

const MAX_FILE_SIZE = 100 * 1024 * 1024;
const MAX_TOTAL_SIZE = 500 * 1024 * 1024;
const MAX_FILES = 20;

// Data constants now imported from ../../utils/formConstants

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatPrice = (amount, currencyCode, currencySymbol) => {
  const currency = CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0];
  if (amount === 0) return 'Custom Quote';
  const decimalAmount = currency.zeroDecimal ? amount : amount / 100;
  try {
    return new Intl.NumberFormat(navigator.language, { style: 'currency', currency: currencyCode, minimumFractionDigits: currency.zeroDecimal ? 0 : 2, maximumFractionDigits: currency.zeroDecimal ? 0 : 2 }).format(decimalAmount);
  } catch { return `${currencySymbol}${decimalAmount.toFixed(currency.zeroDecimal ? 0 : 2)}`; }
};

const getServiceIcon = (name) => ({
  'Graphic Design': FaPaintBrush, 'Video Editing & Motion Graphics': FaVideo,
  'Copywriting & Content Creation': FaPenNib, 'Brand Identity & Logo Design': FaPalette,
  'Photography & Visual Assets': FaCamera, 'Website Development': FaCode,
  'Landing Pages & Sales Funnels': FaRocket, 'E-Commerce Development': FaShoppingCart,
  'Web Applications & SaaS Development': FaGlobeAmericas, 'API Integration & Automation': FaCloudUploadAlt,
  'Website Maintenance & Updates': FaShieldAlt, 'Social Media Management': FaUsers,
  'SEO & Search Marketing': FaSearchIcon, 'Paid Advertising Management': FaAd,
  'Email Marketing Campaigns': FaEnvelopeIcon, 'Lead Generation Services': FaRegBuilding,
  'CRM & Marketing Automation': FaCogs, 'Virtual Assistant Services': FaHeadset,
  'Data Analytics & Reporting': FaChartBar, 'Process Documentation & SOP Development': FaFileAlt,
  'Project Management Support': FaProjectDiagram, 'Data Entry & Processing': FaDatabase,
  'Request Custom Quote': FaCogs,
}[name.split(' - ')[0]] || FaCogs);

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024, sizes = ['Bytes', 'KB', 'MB', 'GB'], i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

// ─── Legal Content ────────────────────────────────────────────────────────────
const privacyPolicyContent = [
  { title: 'Information We Collect', content: 'We collect Personal Information (name, email, phone, company), Usage Information (IP, browser, pages visited), and use Cookies/Tracking technologies.' },
  { title: 'How We Use Your Information', content: 'We use your data to respond to inquiries, provide services, improve our website, send updates (with consent), and never sell your personal information.' },
  { title: 'Data Sharing & Security', content: 'We share data only with service providers (hosting, analytics), legal authorities when required, and implement reasonable security measures.' },
  { title: 'Your Rights', content: 'You may access, correct, or delete your personal information and opt out of marketing communications by contacting support@scalelinkalliance.com.' },
];
const termsContent = [
  { title: 'Acceptance & Services', content: 'By using scalelinkalliance.com, you agree to these terms. We provide professional business support, networking, and growth services.' },
  { title: 'User Conduct', content: "You agree not to use the site for unlawful purposes, impersonate others, upload malware, or violate others' rights. We may terminate accounts for violations." },
  { title: 'Intellectual Property', content: 'All content belongs to Scale Link Alliance and is protected by copyright. You may not reproduce content without permission.' },
  { title: 'Limitation of Liability', content: 'Services are provided "as is." We are not liable for indirect damages, loss of data, revenue, or profits beyond the amount paid for services.' },
  { title: 'Governing Law', content: 'These Terms are governed by Illinois law. Continued use constitutes acceptance of any updates.' },
];

// Currency Selector now uses shared CURRENCIES

// PhoneInput, FileUpload, and CurrencySelector are now imported from shared components

// ─── Checkout Form ────────────────────────────────────────────────────────────
const CheckoutForm = ({ amount, currency, onSuccess, onError, formData }) => {
  const stripe = useStripe(), elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setIsProcessing(true); setMessage(null);
    try {
      const { error: submitError } = await elements.submit();
      if (submitError) { setMessage(submitError.message); onError(submitError.message); setIsProcessing(false); return; }
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: `${window.location.origin}/payment-success`, payment_method_data: { billing_details: { name: `${formData.firstName} ${formData.lastName}`, email: formData.email, phone: formData.phone } } },
        redirect: 'if_required',
      });
      if (error) { setMessage(error.message); onError(error.message); setIsProcessing(false); }
      else if (paymentIntent?.status === 'succeeded') { onSuccess(paymentIntent); setIsProcessing(false); }
    } catch (err) { setMessage('An unexpected error occurred.'); onError('An unexpected error occurred.'); setIsProcessing(false); }
  };

  const currencyObj = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];
  const displayAmount = (() => {
    const dec = currencyObj.zeroDecimal ? amount : amount / 100;
    try { return new Intl.NumberFormat(navigator.language, { style: 'currency', currency, minimumFractionDigits: currencyObj.zeroDecimal ? 0 : 2 }).format(dec); }
    catch { return `${currencyObj.symbol}${dec.toFixed(currencyObj.zeroDecimal ? 0 : 2)}`; }
  })();

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="bg-white p-6 rounded-xl border-2 border-gray-200 mb-6"><PaymentElement /></div>
      {message && <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{message}</div>}
      <button type="submit" disabled={!stripe || isProcessing}
        className={`w-full py-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 transition-all ${!stripe || isProcessing ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'}`}>
        {isProcessing ? <><FaSpinner className="animate-spin" />Processing Payment...</> : <><FaCreditCard />Pay {displayAmount} Now</>}
      </button>
    </form>
  );
};

// ─── Selected Service Item ─────────────────────────────────────────────────────
const SelectedServiceItem = ({ service, selectedPackage, onPackageChange, onRemove, currency, convertedAmounts }) => {
  const [isOpen, setIsOpen] = useState(false);
  const serviceData = SERVICES_WITH_PACKAGES[service];
  const packages = serviceData?.packages || {};
  const ServiceIcon = getServiceIcon(service);
  const currencyObj = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];

  const isCustomQuote = service.includes('Request Custom Quote');
  const displayTitle = isCustomQuote
    ? `Custom Quote: ${service.split(' - ')[1]}`
    : service;

  if (!serviceData) return null;
  return (
    <div className="border border-blue-200 rounded-lg bg-blue-50 mb-3 overflow-hidden">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center flex-1">
          <ServiceIcon className="text-blue-600 mr-3" />
          <div>
            <h4 className="font-semibold text-gray-900">{displayTitle}</h4>
            {isCustomQuote ? (
              <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                {packages[selectedPackage]?.includes.map((item, idx) => (
                  <li key={idx} className="text-xs text-gray-600 flex items-center gap-1.5">
                    <FaCheck className="text-green-500 shrink-0" size={10} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-600">{selectedPackage ? `${packages[selectedPackage]?.name}: ${formatPrice(convertedAmounts[service]?.[selectedPackage] || 0, currency, currencyObj.symbol)}` : 'Select a package below'}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isCustomQuote && (
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">{isOpen ? <FaChevronUp /> : <FaChevronDown />}</button>
          )}
          <button onClick={() => onRemove(service)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors">×</button>
        </div>
      </div>
      {isOpen && !isCustomQuote && (
        <div className="px-4 pb-4 pt-2 border-t border-blue-200 bg-white">
          <p className="text-sm font-medium text-gray-700 mb-3">Choose a package:</p>
          <div className="space-y-2">
            {Object.entries(packages).map(([key, pkg]) => (
              <label key={key} className={`flex items-start p-3 border rounded-lg cursor-pointer transition-all ${selectedPackage === key ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <input type="radio" name={`package-${service}`} value={key} checked={selectedPackage === key} onChange={() => onPackageChange(service, key)} className="mt-1 w-4 h-4 text-blue-600" />
                <div className="ml-3 flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">{pkg.name}</span>
                    <span className="font-semibold text-blue-600">{formatPrice(convertedAmounts[service]?.[key] || 0, currency, currencyObj.symbol)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{pkg.description}</p>
                  <ul className="mt-2 space-y-1">
                    {pkg.includes.map((item, idx) => (
                      <li key={idx} className="text-xs text-gray-500 flex items-start"><FaCheck className="text-green-500 mr-1 mt-0.5 shrink-0" size={10} /><span>{item}</span></li>
                    ))}
                  </ul>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const RequestServicePage = () => {
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [activeLegalTab, setActiveLegalTab] = useState('privacy');
  const [paymentStep, setPaymentStep] = useState('review');
  const [clientSecret, setClientSecret] = useState(null);
  const [paymentError, setPaymentError] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedServices, setSelectedServices] = useState({});
  const [selectedCurrency, setSelectedCurrency] = useState('usd');
  const [exchangeRates, setExchangeRates] = useState(null);
  const [isLoadingRates, setIsLoadingRates] = useState(false);
  const [convertedAmounts, setConvertedAmounts] = useState({});
  const [serverFileUrls, setServerFileUrls] = useState([]);


  // Phone state — dial code kept separately so we can combine on submit
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '',
    phoneDialCode: '+1', phoneNumber: '',
    company: '', otherServiceDescription: '',
    projectDescription: '', timeline: '', budget: '',
    clientWebsite: '', clientLocation: '', clientIndustry: '',
    agreedToPrivacy: false, agreedToTerms: false,
  });

  const [customQuoteAnswers, setCustomQuoteAnswers] = useState({
    techStack: '',
    techIntegration: '',
    techHosting: '',
    opsSupportAreas: [],
    opsHours: '',
    opsTools: '',
    creativeFormats: [],
    creativeDirection: '',
    creativeTurnaround: '',
    marketingChannels: [],
    marketingAdSpend: '',
    marketingAudience: ''
  });

  // Full phone string for submission
  const fullPhone = formData.phoneNumber ? `${formData.phoneDialCode} ${formData.phoneNumber}` : '';

  // URL params auto-selection disabled

  // Fetch exchange rates
  useEffect(() => {
    setIsLoadingRates(true);
    fetch('https://open.er-api.com/v6/latest/USD')
      .then(r => r.json())
      .then(d => setExchangeRates(d.rates))
      .catch(() => setExchangeRates({ USD: 1, EUR: 0.92, GBP: 0.79, JPY: 150.5, CNY: 7.19, CAD: 1.35, AUD: 1.52, CHF: 0.88, INR: 83.12, SGD: 1.34 }))
      .finally(() => setIsLoadingRates(false));
  }, []);

  // Auto-detect currency
  useEffect(() => {
    try {
      const c = new Intl.NumberFormat(navigator.language, { style: 'currency', currency: 'USD' }).resolvedOptions().currency.toLowerCase();
      if (CURRENCIES.find(x => x.code === c)) setSelectedCurrency(c);
    } catch { }
  }, []);

  const convertAmount = useCallback((usd) => {
    if (!exchangeRates || usd === 0 || !selectedCurrency) return usd;
    const rate = exchangeRates[selectedCurrency.toUpperCase()];
    if (!rate) return usd;
    return Math.round(usd * rate);
  }, [exchangeRates, selectedCurrency]);

  // Recompute converted amounts for ALL packages (not just selected) so dropdowns show correct prices
  useEffect(() => {
    if (!exchangeRates) return;
    const result = {};
    Object.keys(SERVICES_WITH_PACKAGES).forEach(service => {
      result[service] = {};
      Object.entries(SERVICES_WITH_PACKAGES[service].packages).forEach(([key, pkg]) => {
        result[service][key] = convertAmount(pkg.price);
      });
    });
    setConvertedAmounts(result);
  }, [selectedCurrency, exchangeRates, convertAmount]);

  const totalAmount = Object.entries(selectedServices).reduce((sum, [service, pkg]) => {
    return sum + (convertedAmounts[service]?.[pkg] || 0);
  }, 0);

  const isStep1Complete = !!(
    formData.firstName?.trim() &&
    formData.lastName?.trim() &&
    formData.email?.trim() &&
    formData.phoneNumber?.trim() &&
    formData.company?.trim()
  );

  const steps = [
    { number: 1, title: 'Contact Info' }, { number: 2, title: 'Service Selection' },
    { number: 3, title: 'Project Details' }, { number: 4, title: 'Legal Agreement' },
    { number: 5, title: 'Review & Payment' },
  ];

  const handleInputChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleServiceToggle = service => {
    setSelectedServices(prev => {
      const next = { ...prev };
      if (prev[service]) delete next[service];
      else next[service] = service.includes('Request Custom Quote') ? 'custom' : 'starter';
      return next;
    });
  };

  const handleFilesAdded = f => setUploadedFiles(prev => [...prev, ...f]);
  const handleFileRemove = id => setUploadedFiles(prev => { const f = prev.find(x => x.id === id); if (f?.preview) URL.revokeObjectURL(f.preview); return prev.filter(x => x.id !== id); });
  const nextStep = () => { if (currentStep < 5) { setCurrentStep(p => p + 1); window.scrollTo(0, 0); } };
  const prevStep = () => { if (currentStep > 1) { setCurrentStep(p => p - 1); window.scrollTo(0, 0); } };
  const canProceedFromLegal = formData.agreedToPrivacy && formData.agreedToTerms;

  useEffect(() => () => uploadedFiles.forEach(f => { if (f.preview) URL.revokeObjectURL(f.preview); }), []);

  const uploadFiles = async () => {
    if (!uploadedFiles.length) return [];
    const fd = new FormData();
    uploadedFiles.forEach(f => fd.append('files', f.file));
    fd.append('requestId', Date.now().toString()); fd.append('email', formData.email); fd.append('company', formData.company);
    const res = await fetch(`/api/upload-files`, { method: 'POST', body: fd });
    const text = await res.text();
    let data; try { data = JSON.parse(text); } catch { throw new Error('Upload failed'); }
    if (!res.ok) throw new Error(data.error || 'Upload failed');
    return data.fileUrls || [];
  };

  // ── EMAIL TEMPLATE PARAMS ─────────────────────────────────────────────────
  // These variable names MUST match exactly what you have in your EmailJS template.
  // Copy-paste the variable names below into your EmailJS template as {{variable_name}}
  const buildTemplateParams = (paymentIntent = null) => {
    const currencyObj = CURRENCIES.find(c => c.code === selectedCurrency) || CURRENCIES[0];
    const serviceEntries = Object.entries(selectedServices);
    
    // Safety check for services line
    const servicesLine = serviceEntries
      .map(([svc, pkg]) => {
        const pkgName = SERVICES_WITH_PACKAGES[svc]?.packages?.[pkg]?.name || pkg;
        return `${svc} (${pkgName})`;
      })
      .join(', ') || 'None selected';
      
    const totalLine = totalAmount > 0 ? formatPrice(totalAmount, selectedCurrency, currencyObj.symbol) : 'Custom Quote';
    
    // File metadata with extra safety
    const totalSizeRaw = uploadedFiles.reduce((acc, f) => acc + (Number(f.size) || 0), 0);
    const fileListFormatted = uploadedFiles.length > 0 
      ? uploadedFiles.map(f => `• ${f.name || 'File'} (${formatFileSize(f.size || 0)})`).join('\n')
      : 'No files uploaded';

    const fullName = `${formData.firstName || ''} ${formData.lastName || ''}`.trim() || 'Valued Client';

    return {
      // Header variables
      title: serviceEntries.length > 0 ? serviceEntries[0][0] : 'New Service Request',
      name: fullName,
      email: formData.email || '',
      
      // Body variables
      from_name: fullName,
      from_email: formData.email || '',
      reply_to: formData.email || '',
      company: formData.company || 'Not provided',
      phone: fullPhone || 'Not provided',
      services: servicesLine,
      project_description: formData.projectDescription || 'Not provided',
      other_service_description: formData.otherServiceDescription || 'None',
      timeline: formData.timeline || 'Not specified',
      budget: formData.budget || 'Not specified',
      total_amount: totalLine,
      payment_status: paymentIntent ? `Paid (ID: ${paymentIntent.id})` : 'Quote Requested',
      file_count: uploadedFiles.length.toString(),
      total_file_size: formatFileSize(totalSizeRaw),
      uploaded_files: fileListFormatted,
      request_date: new Date().toLocaleString(),
    };
  };

  const sendEmailNotification = async (paymentIntent = null) => {
    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, buildTemplateParams(paymentIntent), EMAILJS_PUBLIC_KEY);
    } catch (err) { console.error('EmailJS error:', err); }
  };

  const createNoticeBoardJob = async (fileUrls = []) => {
    try {
      const res = await fetch('/api/public/service-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          phone: fullPhone,
          services: selectedServices,
          totalAmount,
          currency: selectedCurrency,
          files: fileUrls,
          projectScope: {
            customQuoteAnswers
          }
        })
      });
      if (!res.ok) {
        const errorData = await res.json();
        console.error('Failed to create notice board job:', errorData.error);
        throw new Error(errorData.error || 'Server error saving request.');
      }
    } catch (err) {
      console.error('Failed to create notice board job:', err);
      throw err;
    }
  };

  const initializePayment = async () => {
    setIsSubmitting(true); setPaymentError(null);
    try {
      let fileUrls = [];
      if (uploadedFiles.length) {
        fileUrls = await uploadFiles();
        setServerFileUrls(fileUrls);
      }
      
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          amount: totalAmount, currency: selectedCurrency, services: Object.keys(selectedServices), customer_email: formData.email,
          metadata: { firstName: formData.firstName, lastName: formData.lastName, company: formData.company, currency: selectedCurrency, fileCount: uploadedFiles.length.toString() }
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Server error: ${res.status}`);
      if (!data.clientSecret) throw new Error('No client secret received');
      setClientSecret(data.clientSecret); setPaymentStep('payment');
    } catch (err) { setPaymentError(err.message || 'Failed to initialize payment. Please try again.'); }
    finally { setIsSubmitting(false); }
  };

  const handleProceedToPayment = () => {
    if (isSubmitting) return;
    if (totalAmount > 0) { initializePayment(); }
    else {
      setIsSubmitting(true);
      uploadFiles()
        .then(async (fileUrls) => {
          await createNoticeBoardJob(fileUrls);
          return sendEmailNotification();
        })
        .then(() => { setSubmitSuccess(true); setIsSubmitting(false); })
        .catch(err => { 
          console.error('Submission error:', err);
          setPaymentError(err.message || 'Failed to submit. Please try again.'); 
          setIsSubmitting(false); 
        });
    }
  };

  const handlePaymentSuccess = async pi => { 
    try {
      await createNoticeBoardJob(serverFileUrls);
      await sendEmailNotification(pi); 
      setPaymentStep('success'); 
      setSubmitSuccess(true); 
    } catch (err) {
      console.error('Failed to create job after payment:', err);
      setPaymentError('Payment was successful, but we encountered an issue creating your service request in our system. Our team has been notified. Please contact support if you do not receive an email shortly.');
      setPaymentStep('success'); 
      setSubmitSuccess(true); 
    }
  };
  const handlePaymentError = msg => { setPaymentError(msg); setIsSubmitting(false); };

  const stripeOptions = useMemo(() => ({
    clientSecret,
    appearance: { theme: 'stripe', variables: { colorPrimary: '#2563eb', colorBackground: '#ffffff', colorText: '#1f2937', colorDanger: '#ef4444', borderRadius: '8px' } },
  }), [clientSecret]);

  const currencyObj = CURRENCIES.find(c => c.code === selectedCurrency) || CURRENCIES[0];

  // ── Success screen
  if (submitSuccess) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"><FaCheck className="text-3xl text-green-600" /></div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{totalAmount > 0 ? 'Payment Successful!' : 'Request Received!'}</h1>
            {paymentError ? (
              <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm text-left">
                <p className="font-semibold mb-1">Notice:</p>
                <p>{paymentError}</p>
              </div>
            ) : (
              <p className="text-gray-600 mb-8 text-lg">{totalAmount > 0 ? `Thank you for your payment of ${formatPrice(totalAmount, selectedCurrency, currencyObj.symbol)}. Our team will contact you within 24 hours.` : 'Thank you for your request. We will be in touch within 24 hours.'}</p>
            )}
            {uploadedFiles.length > 0 && !paymentError && <p className="text-sm text-gray-500 mb-8">{uploadedFiles.length} file(s) uploaded successfully</p>}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/" className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">Return to Home</Link>
              <button onClick={() => window.print()} className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors">Print Confirmation</button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50 pb-20">
      <div className="container mx-auto px-4">
        {/* Progress bar */}
        <div className="max-w-4xl mx-auto mb-8 pt-8">
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div key={step.number} className={`flex items-center flex-1 ${currentStep === step.number ? 'opacity-100' : 'opacity-60'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${currentStep >= step.number ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {currentStep > step.number ? <FaCheck /> : step.number}
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-xs font-semibold uppercase ${currentStep >= step.number ? 'text-blue-600' : 'text-gray-400'}`}>Step {step.number}</p>
                  <p className={`text-sm font-medium ${currentStep >= step.number ? 'text-gray-900' : 'text-gray-400'}`}>{step.title}</p>
                </div>
                {index < steps.length - 1 && <div className={`flex-1 h-1 mx-4 ${currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* ── Step 1: Contact Info ── */}
          {currentStep === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Let's Get Started</h2>
                <p className="text-gray-600 text-lg">First, tell us a bit about yourself and your company.</p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">First Name *</label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-3.5 text-gray-400" />
                    <input type="text" name="firstName" required value={formData.firstName} onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="John" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name *</label>
                  <input type="text" name="lastName" required value={formData.lastName} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Doe" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-3.5 text-gray-400" />
                    <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="john@company.com" />
                  </div>
                </div>
                {/* ── Phone with country code ── */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                  <PhoneInput
                    value={formData.phoneNumber}
                    dialCode={formData.phoneDialCode}
                    onNumberChange={val => setFormData(p => ({ ...p, phoneNumber: val }))}
                    onDialChange={val => setFormData(p => ({ ...p, phoneDialCode: val }))}
                  />
                  <p className="mt-1 text-xs text-gray-400">Select your country flag, then enter your number</p>
                </div>
                 <div>
                   <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name *</label>
                   <div className="relative">
                     <FaBuilding className="absolute left-3 top-3.5 text-gray-400" />
                     <input type="text" name="company" required value={formData.company} onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Acme Inc." />
                   </div>
                 </div>
                 <div>
                   <label className="block text-sm font-semibold text-gray-700 mb-2">Company Website (Optional)</label>
                   <div className="relative">
                     <FaGlobeAmericas className="absolute left-3 top-3.5 text-gray-400" />
                     <input type="text" name="clientWebsite" value={formData.clientWebsite} onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="e.g. www.example.com" />
                   </div>
                 </div>
                 <div>
                   <label className="block text-sm font-semibold text-gray-700 mb-2">Business Location (Optional)</label>
                   <div className="relative">
                     <FaRegBuilding className="absolute left-3 top-3.5 text-gray-400" />
                     <input type="text" name="clientLocation" value={formData.clientLocation} onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="e.g. Chicago, IL" />
                   </div>
                 </div>
                 <div>
                   <label className="block text-sm font-semibold text-gray-700 mb-2">Industry / Business Type (Optional)</label>
                   <div className="relative">
                     <FaBriefcase className="absolute left-3 top-3.5 text-gray-400" />
                     <input type="text" name="clientIndustry" value={formData.clientIndustry} onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="e.g. E-Commerce, SaaS, Retail" />
                   </div>
                 </div>
               </div>
              <div className="flex justify-end mt-8">
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!isStep1Complete}
                  className={`px-8 py-3 font-semibold rounded-lg transition-all ${!isStep1Complete ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'} flex items-center gap-2`}
                >
                  Continue <FaArrowRight />
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Step 2: Service Selection ── */}
          {currentStep === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
              <div className="text-center mb-10">
                <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">Step 2 of 5</span>
                <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-4">Service Selection</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">Which service(s) are you requesting? Select all that apply.</p>
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 text-sm font-semibold max-w-2xl mx-auto text-center shadow-sm">
                  Starting price options are shown during service selection. Custom quotes are available for larger or more detailed projects.
                </div>
              </div>
              <div className="grid gap-8">
                <div className="grid md:grid-cols-2 gap-8">
                  {[
                    { cat: 'creative-content', bg: 'bg-purple-100', iconColor: 'text-purple-600', border: 'hover:border-purple-200' },
                    { cat: 'tech-development', bg: 'bg-indigo-100', iconColor: 'text-indigo-600', border: 'hover:border-indigo-200' },
                    { cat: 'marketing-growth', bg: 'bg-green-100', iconColor: 'text-green-600', border: 'hover:border-green-200' },
                    { cat: 'operations-support', bg: 'bg-orange-100', iconColor: 'text-orange-600', border: 'hover:border-orange-200' },
                  ].map(({ cat, bg, iconColor, border }) => {
                    const catData = SERVICE_CATEGORIES[cat];
                    const categoryIcons = {
                      'creative-content': FaPaintBrush,
                      'tech-development': FaCode,
                      'marketing-growth': FaChartLine,
                      'operations-support': FaCogs
                    };
                    const CatIcon = categoryIcons[cat] || FaCogs;
                    return (
                      <div key={cat} className={`bg-white p-6 rounded-xl border-2 border-gray-100 ${border} transition-colors shadow-sm`}>
                        <div className="flex items-center mb-4">
                          <div className={`w-12 h-12 ${bg} rounded-lg flex items-center justify-center mr-3`}><CatIcon className={`${iconColor} text-xl`} /></div>
                          <h3 className="text-xl font-bold text-gray-900">{catData.label}</h3>
                        </div>
                        <div className="space-y-3">
                          {catData.services.map(service => {
                            const ServiceIcon = getServiceIcon(service);
                            const isSelected = !!selectedServices[service];
                            return (
                              <label key={service} className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}>
                                <input type="checkbox" checked={isSelected} onChange={() => handleServiceToggle(service)} className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300" />
                                <div className="ml-3 flex-1 flex items-center">
                                  <ServiceIcon className="mr-2 text-gray-500" />
                                  <span className="text-gray-700 font-medium">{service.split(' - ')[0]}</span>
                                </div>
                                {isSelected && <FaCheck className="text-green-500 ml-2" />}
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {Object.keys(selectedServices).length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Selected Services — Choose Your Packages</h3>
                    {Object.entries(selectedServices).map(([service, pkg]) => (
                      <SelectedServiceItem key={service} service={service} selectedPackage={pkg}
                        onPackageChange={(s, k) => setSelectedServices(p => ({ ...p, [s]: k }))}
                        onRemove={s => setSelectedServices(p => { const n = { ...p }; delete n[s]; return n; })}
                        currency={selectedCurrency} convertedAmounts={convertedAmounts} />
                    ))}
                    <div className="mt-6 bg-blue-50 p-6 rounded-xl border-2 border-blue-200">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-900 text-lg">Total Estimate:</span>
                        <span className="text-3xl font-bold text-blue-600">
                          {isLoadingRates ? <FaSpinner className="animate-spin inline" /> : totalAmount > 0 ? formatPrice(totalAmount, selectedCurrency, currencyObj.symbol) : 'Custom Quote'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">*Final pricing may vary based on project scope</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-between mt-12 pt-8 border-t border-gray-200">
                <button type="button" onClick={prevStep} className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors flex items-center gap-2"><FaArrowLeft /> Back</button>
                <button type="button" onClick={nextStep} disabled={Object.keys(selectedServices).length === 0}
                  className={`px-8 py-3 font-semibold rounded-lg transition-all ${Object.keys(selectedServices).length === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'}`}>
                  Continue to Project Details <FaArrowRight className="inline ml-2" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Step 3: Project Details ── */}
          {currentStep === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Project Details</h2>
                <p className="text-gray-600 text-lg">Tell us more about your project requirements.</p>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Project Description *</label>
                  <textarea name="projectDescription" required rows={4} maxLength={1000} value={formData.projectDescription} onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe your project, goals, and any specific requirements..." />
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-400">Please provide a clear description of your requirements.</span>
                    <span className="text-xs text-gray-500 font-medium">{(formData.projectDescription || '').length}/1000 characters</span>
                  </div>
                </div>

                {/* Dynamic Custom Quote Questions */}
                {Object.keys(selectedServices).filter(s => s.includes('Request Custom Quote')).map(service => {
                  const isTech = service.includes('Tech & Development');
                  const isOps = service.includes('Operations & Support');
                  const isCreative = service.includes('Creative & Content');
                  const isMarketing = service.includes('Marketing & Growth');
                  
                  return (
                    <div key={service} className="mt-8 pt-8 border-t border-slate-200 space-y-6 animate-fade-in">
                      <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-6">
                        <h3 className="text-base font-bold text-slate-800 mb-1">
                          Additional Specifications: {service.split(' - ')[1] || 'Custom Request'}
                        </h3>
                        <p className="text-slate-400 text-xs font-semibold mb-6">
                          Please answer these quick questions to help us prepare an accurate custom proposal.
                        </p>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                          {isTech && (
                            <>
                              <div className="md:col-span-2">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Current Technology Stack / Platform</label>
                                <select 
                                  value={customQuoteAnswers.techStack} 
                                  onChange={e => setCustomQuoteAnswers(p => ({ ...p, techStack: e.target.value }))}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                                >
                                  <option value="">Select current setup...</option>
                                  <option value="New Project / None">New Project / Starting from Scratch</option>
                                  <option value="WordPress">WordPress</option>
                                  <option value="Shopify">Shopify</option>
                                  <option value="React / Node">React / Node.js Custom Stack</option>
                                  <option value="Webflow">Webflow</option>
                                  <option value="Other">Other</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">System Integrations Required</label>
                                <input 
                                  type="text"
                                  placeholder="e.g. Stripe, HubSpot CRM, Salesforce, None"
                                  value={customQuoteAnswers.techIntegration}
                                  onChange={e => setCustomQuoteAnswers(p => ({ ...p, techIntegration: e.target.value }))}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Hosting & Domain Access</label>
                                <select 
                                  value={customQuoteAnswers.techHosting} 
                                  onChange={e => setCustomQuoteAnswers(p => ({ ...p, techHosting: e.target.value }))}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                                >
                                  <option value="">Select option...</option>
                                  <option value="Have my own hosting">I already have my own domain/hosting</option>
                                  <option value="Need setup assistance">I need help purchasing and setting up hosting</option>
                                  <option value="Not sure">I am not sure yet</option>
                                </select>
                              </div>
                            </>
                          )}
                          
                          {isOps && (
                            <>
                              <div className="md:col-span-2">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Operational Areas Needing Support</label>
                                <div className="grid sm:grid-cols-2 gap-3 mt-1">
                                  {[
                                    { id: 'customer_support', label: 'Customer Support / Inbox' },
                                    { id: 'calendar_email', label: 'Calendar & Email Management' },
                                    { id: 'billing_bookkeep', label: 'Billing & Basic Bookkeeping' },
                                    { id: 'data_entry', label: 'Data Entry & Processing' },
                                    { id: 'sop_writing', label: 'SOP & Process Documentation' }
                                  ].map(item => {
                                    const checked = customQuoteAnswers.opsSupportAreas.includes(item.id);
                                    return (
                                      <label key={item.id} className="flex items-center gap-2 p-3 border border-slate-200 hover:border-slate-300 rounded-xl bg-white cursor-pointer transition-all">
                                        <input 
                                          type="checkbox" 
                                          checked={checked}
                                          onChange={() => {
                                            const nextAreas = checked 
                                              ? customQuoteAnswers.opsSupportAreas.filter(a => a !== item.id)
                                              : [...customQuoteAnswers.opsSupportAreas, item.id];
                                            setCustomQuoteAnswers(p => ({ ...p, opsSupportAreas: nextAreas }));
                                          }}
                                          className="w-4 h-4 text-blue-600 rounded" 
                                        />
                                        <span className="text-xs font-semibold text-slate-700">{item.label}</span>
                                      </label>
                                    );
                                  })}
                                </div>
                              </div>
                              <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Estimated Support Hours Needed</label>
                                <select 
                                  value={customQuoteAnswers.opsHours} 
                                  onChange={e => setCustomQuoteAnswers(p => ({ ...p, opsHours: e.target.value }))}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                                >
                                  <option value="">Select estimated hours...</option>
                                  <option value="< 10 hours/week">Less than 10 hours per week</option>
                                  <option value="10-20 hours/week">10 to 20 hours per week</option>
                                  <option value="20-40 hours/week">20 to 40 hours per week</option>
                                  <option value="Full-time dedicated">Dedicated full-time assistant</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Current Collaboration/Admin Tools Used</label>
                                <input 
                                  type="text"
                                  placeholder="e.g. Slack, Trello, Zendesk, Excel, None"
                                  value={customQuoteAnswers.opsTools}
                                  onChange={e => setCustomQuoteAnswers(p => ({ ...p, opsTools: e.target.value }))}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                                />
                              </div>
                            </>
                          )}
                          
                          {isCreative && (
                            <>
                              <div className="md:col-span-2">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Required Creative Format Types</label>
                                <div className="grid sm:grid-cols-2 gap-3 mt-1">
                                  {[
                                    { id: 'social_graphics', label: 'Social Media Graphics' },
                                    { id: 'video_reels', label: 'Short Video / Reels Editing' },
                                    { id: 'copy_blog', label: 'Copywriting / Blog Content' },
                                    { id: 'branding_guide', label: 'Logos & Complete Branding' },
                                    { id: 'raw_sources', label: 'Vector/Raw Source Files' }
                                  ].map(item => {
                                    const checked = customQuoteAnswers.creativeFormats.includes(item.id);
                                    return (
                                      <label key={item.id} className="flex items-center gap-2 p-3 border border-slate-200 hover:border-slate-300 rounded-xl bg-white cursor-pointer transition-all">
                                        <input 
                                          type="checkbox" 
                                          checked={checked}
                                          onChange={() => {
                                            const nextFormats = checked 
                                              ? customQuoteAnswers.creativeFormats.filter(f => f !== item.id)
                                              : [...customQuoteAnswers.creativeFormats, item.id];
                                            setCustomQuoteAnswers(p => ({ ...p, creativeFormats: nextFormats }));
                                          }}
                                          className="w-4 h-4 text-blue-600 rounded" 
                                        />
                                        <span className="text-xs font-semibold text-slate-700">{item.label}</span>
                                      </label>
                                    );
                                  })}
                                </div>
                              </div>
                              <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Visual Brand Direction</label>
                                <select 
                                  value={customQuoteAnswers.creativeDirection} 
                                  onChange={e => setCustomQuoteAnswers(p => ({ ...p, creativeDirection: e.target.value }))}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                                >
                                  <option value="">Select brand direction...</option>
                                  <option value="Starting from scratch">Starting from scratch (Need design ideas)</option>
                                  <option value="Have existing guidelines">Have existing guidelines/visual preferences</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Turnaround Urgency</label>
                                <select 
                                  value={customQuoteAnswers.creativeTurnaround} 
                                  onChange={e => setCustomQuoteAnswers(p => ({ ...p, creativeTurnaround: e.target.value }))}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                                >
                                  <option value="">Select timeline option...</option>
                                  <option value="Standard">Standard turnaround (3-5 business days)</option>
                                  <option value="Rush">Rush projects (Less than 48 hours)</option>
                                  <option value="Ongoing monthly">Ongoing monthly assistance</option>
                                </select>
                              </div>
                            </>
                          )}
                          
                          {isMarketing && (
                            <>
                              <div className="md:col-span-2">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Target Marketing Channels</label>
                                <div className="grid sm:grid-cols-2 gap-3 mt-1">
                                  {[
                                    { id: 'seo_search', label: 'SEO & Search Engine visibility' },
                                    { id: 'meta_ads', label: 'Meta Ads (Facebook/Instagram)' },
                                    { id: 'google_ads', label: 'Google Search & Display Ads' },
                                    { id: 'email_news', label: 'Email Newsletters / Campaigns' },
                                    { id: 'cold_outbound', label: 'Cold Lead Outbound Campaigns' }
                                  ].map(item => {
                                    const checked = customQuoteAnswers.marketingChannels.includes(item.id);
                                    return (
                                      <label key={item.id} className="flex items-center gap-2 p-3 border border-slate-200 hover:border-slate-300 rounded-xl bg-white cursor-pointer transition-all">
                                        <input 
                                          type="checkbox" 
                                          checked={checked}
                                          onChange={() => {
                                            const nextChannels = checked 
                                              ? customQuoteAnswers.marketingChannels.filter(c => c !== item.id)
                                              : [...customQuoteAnswers.marketingChannels, item.id];
                                            setCustomQuoteAnswers(p => ({ ...p, marketingChannels: nextChannels }));
                                          }}
                                          className="w-4 h-4 text-blue-600 rounded" 
                                        />
                                        <span className="text-xs font-semibold text-slate-700">{item.label}</span>
                                      </label>
                                    );
                                  })}
                                </div>
                              </div>
                              <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Monthly Ad Spend Budget (If Ads)</label>
                                <select 
                                  value={customQuoteAnswers.marketingAdSpend} 
                                  onChange={e => setCustomQuoteAnswers(p => ({ ...p, marketingAdSpend: e.target.value }))}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                                >
                                  <option value="">Select ad spend range...</option>
                                  <option value="No ad budget">No ad budget / Organic SEO only</option>
                                  <option value="< $1,000">Less than $1,000 per month</option>
                                  <option value="$1,000 - $5,000">$1,000 to $5,000 per month</option>
                                  <option value="$5,000+">$5,000+ per month</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Ideal Target Customer Profile</label>
                                <input 
                                  type="text"
                                  placeholder="e.g. Local homeowners, B2B software companies"
                                  value={customQuoteAnswers.marketingAudience}
                                  onChange={e => setCustomQuoteAnswers(p => ({ ...p, marketingAudience: e.target.value }))}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                                />
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2"><FaUpload className="text-blue-600" />Project Files</h3>
                  <p className="text-gray-600 mb-4">Upload any relevant files (designs, documents, briefs, etc.)</p>
                  <FileUpload
                    files={uploadedFiles.map(f => ({ ...f.file, name: f.name, size: f.size, type: f.type }))}
                    onFilesAdded={files => setUploadedFiles(prev => [...prev, ...files.map(file => ({ file, id: Math.random().toString(36).substr(2, 9), name: file.name, size: file.size, type: file.type, preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null }))])}
                    onFileRemove={id => setUploadedFiles(prev => { const f = prev.find(x => x.id === id); if (f?.preview) URL.revokeObjectURL(f.preview); return prev.filter(x => x.id !== id); })}
                    maxFiles={MAX_FILES}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2"><FaCalendar className="inline mr-2" />Desired Timeline</label>
                    <select name="timeline" value={formData.timeline} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Select Timeline</option>
                      <option value="ASAP">As soon as possible</option>
                      <option value="1-2 weeks">1-2 weeks</option>
                      <option value="Within 1 month">Within 1 month</option>
                      <option value="2-3 months">2-3 months</option>
                      <option value="Flexible">Flexible</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2"><FaDollarSign className="inline mr-2" />Budget Range</label>
                    <select name="budget" value={formData.budget} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Select Budget Range</option>
                      {BUDGET_RANGES.map(range => (
                        <option key={range} value={range}>{range}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex justify-between mt-8">
                <button type="button" onClick={prevStep} className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"><FaArrowLeft /> Back</button>
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!formData.projectDescription?.trim()}
                  className={`px-8 py-3 font-semibold rounded-lg transition-all ${!formData.projectDescription?.trim() ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'} flex items-center gap-2`}
                >
                  Review Legal Terms <FaArrowRight />
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Step 4: Legal ── */}
          {currentStep === 4 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
              <div className="mb-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"><FaShieldAlt className="text-3xl text-blue-600" /></div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Legal Agreement</h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">Please review and agree to both documents to proceed.</p>
              </div>
              <div className="flex justify-center mb-8">
                <div className="bg-gray-100 p-1 rounded-lg inline-flex">
                  {[['privacy', 'Privacy Policy', FaLock], ['terms', 'Terms of Service', FaFileContract]].map(([id, label, Icon]) => (
                    <button key={id} type="button" onClick={() => setActiveLegalTab(id)}
                      className={`px-6 py-2 rounded-md font-semibold transition-all ${activeLegalTab === id ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
                      <Icon className="inline mr-2" />{label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 mb-8 max-h-96 overflow-y-auto border border-gray-200">
                {(activeLegalTab === 'privacy' ? privacyPolicyContent : termsContent).map((section, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200 mb-3">
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                      <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs mr-2">{idx + 1}</span>
                      {section.title}
                    </h4>
                    <p className="text-gray-700 text-sm leading-relaxed">{section.content}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-4 bg-white border-2 border-gray-200 rounded-xl p-6">
                <h4 className="font-bold text-gray-900 mb-4 text-lg">Acknowledgment Required</h4>
                {[['agreedToPrivacy', 'I agree to the Privacy Policy', 'I have read and understand how Scale Link Alliance collects, uses, and protects my personal information.'],
                ['agreedToTerms', 'I agree to the Terms of Service', 'I have read and agree to abide by the Terms of Service, including user conduct guidelines and liability limitations.']
                ].map(([name, title, desc]) => (
                  <label key={name} className="flex items-start p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input type="checkbox" name={name} checked={formData[name]} onChange={handleInputChange} className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300 mt-0.5" />
                    <div className="ml-3"><span className="block font-semibold text-gray-900">{title} *</span><span className="block text-sm text-gray-600 mt-1">{desc}</span></div>
                  </label>
                ))}
              </div>
              {!canProceedFromLegal && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start">
                  <span className="text-yellow-600 mr-2">⚠️</span>
                  <p className="text-sm text-yellow-800">You must agree to both the Privacy Policy and Terms of Service to proceed.</p>
                </div>
              )}
              <div className="flex justify-between mt-8">
                <button type="button" onClick={prevStep} className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"><FaArrowLeft /> Back</button>
                <button type="button" onClick={nextStep} disabled={!canProceedFromLegal}
                  className={`px-8 py-3 font-semibold rounded-lg transition-all flex items-center gap-2 ${!canProceedFromLegal ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'}`}>
                  Continue to Review <FaArrowRight />
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Step 5: Review & Payment ── */}
          {currentStep === 5 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
              {paymentStep === 'review' && (
                <>
                  <div className="mb-8"><h2 className="text-3xl font-bold text-gray-900 mb-4">Review & Payment</h2><p className="text-gray-600">Please review your information before completing payment.</p></div>
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Left: review */}
                    <div className="space-y-6 bg-gray-50 p-6 rounded-xl">
                      <div className="grid md:grid-cols-2 gap-4">
                        {[['Name', `${formData.firstName} ${formData.lastName}`], ['Company', formData.company], ['Email', formData.email], ['Phone', fullPhone || 'Not provided']].map(([label, val]) => (
                          <div key={label}><p className="text-sm text-gray-500">{label}</p><p className="font-semibold text-gray-900">{val}</p></div>
                        ))}
                      </div>
                      <div className="border-t border-gray-200 pt-4">
                        <p className="text-sm text-gray-500 mb-2">Selected Services & Packages</p>
                        <div className="space-y-2">
                          {Object.entries(selectedServices).map(([service, pkg]) => {
                            const ServiceIcon = getServiceIcon(service);
                            const pkgData = SERVICES_WITH_PACKAGES[service]?.packages[pkg];
                            return (
                              <div key={service} className="flex items-center text-sm bg-white p-2 rounded border border-gray-200">
                                <ServiceIcon className="mr-2 text-blue-600" />
                                <span className="font-medium">{service}</span>
                                <span className="mx-2 text-gray-400">→</span>
                                <span className="text-gray-600">{pkgData?.name}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      {formData.projectDescription && (
                        <div className="border-t border-gray-200 pt-4">
                          <p className="text-sm text-gray-500 mb-2">Project Description</p>
                          <p className="text-gray-900 bg-white p-3 rounded-lg border border-gray-200 text-sm">{formData.projectDescription}</p>
                        </div>
                      )}
                      {uploadedFiles.length > 0 && (
                        <div className="border-t border-gray-200 pt-4">
                          <p className="text-sm text-gray-500 mb-2">Uploaded Files ({uploadedFiles.length})</p>
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {uploadedFiles.map(file => (
                              <div key={file.id} className="flex items-center text-sm text-gray-700 bg-white p-2 rounded border border-gray-200">
                                <FaFile className="mr-2 text-blue-500 flex-shrink-0" />
                                <span className="truncate flex-1">{file.name}</span>
                                <span className="ml-2 text-xs text-gray-500">({formatFileSize(file.size)})</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="border-t border-gray-200 pt-4 bg-green-50 p-4 rounded-lg border border-green-200">
                        <div className="flex items-center"><FaCheck className="text-green-600 mr-2" /><p className="font-semibold text-green-900">Legal Agreements Confirmed</p></div>
                      </div>
                    </div>
                    {/* Right: payment */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-200 shadow-md">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><FaCreditCard className="text-blue-600" />Payment Summary</h3>
                      <div className="mb-6"><CurrencySelector selectedCurrency={selectedCurrency} onCurrencyChange={setSelectedCurrency} /></div>
                      <div className="space-y-3 mb-6 bg-white p-4 rounded-lg">
                        {Object.entries(selectedServices).map(([service, pkg]) => {
                          const ServiceIcon = getServiceIcon(service), amount = convertedAmounts[service]?.[pkg] || 0, pkgData = SERVICES_WITH_PACKAGES[service]?.packages[pkg];
                          return (
                            <div key={service} className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                              <span className="text-gray-700 flex items-center"><ServiceIcon className="mr-2 text-gray-500" />{service}<span className="text-xs text-gray-500 ml-1">({pkgData?.name})</span></span>
                              <span className="font-medium text-gray-900">{isLoadingRates ? '...' : amount > 0 ? formatPrice(amount, selectedCurrency, currencyObj.symbol) : 'Custom Quote'}</span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="border-t-2 border-blue-200 pt-4 mb-6">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-gray-900">Total Due Today:</span>
                          <span className="text-3xl font-bold text-blue-600">
                            {isLoadingRates ? <FaSpinner className="animate-spin inline" /> : totalAmount > 0 ? formatPrice(totalAmount, selectedCurrency, currencyObj.symbol) : 'Custom Quote'}
                          </span>
                        </div>
                      </div>
                      {paymentError && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex justify-between items-start">
                          <span>{paymentError}</span>
                          <button type="button" onClick={() => setPaymentError(null)} className="text-red-800 font-bold ml-2">✕</button>
                        </div>
                      )}
                      <button type="button" onClick={handleProceedToPayment} disabled={isSubmitting || isLoadingRates}
                        className="w-full py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-lg rounded-xl hover:from-blue-700 hover:to-blue-800 transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl mb-4">
                        {isSubmitting ? <><FaSpinner className="animate-spin" />{uploadedFiles.length > 0 ? 'Uploading Files...' : 'Processing...'}</> :
                          isLoadingRates ? <><FaSpinner className="animate-spin" />Loading Exchange Rates...</> :
                            totalAmount > 0 ? <><FaCreditCard className="text-xl" />Proceed to Payment<FaArrowRight className="text-sm" /></> :
                              <><FaPaperPlane />Submit Request for Quote</>}
                      </button>
                      <div className="flex items-center justify-center gap-2 text-xs text-gray-600 bg-white bg-opacity-50 p-3 rounded-lg">
                        <FaLock className="text-green-600" />
                        <span>Secured by <strong>Stripe</strong>. We never store your card information.</span>
                      </div>
                      <div className="mt-4 text-center">
                        <button type="button" onClick={prevStep} className="text-gray-500 hover:text-gray-700 text-sm flex items-center justify-center gap-1 mx-auto"><FaArrowLeft /> Back to edit information</button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {paymentStep === 'payment' && clientSecret && (
                <div className="max-w-2xl mx-auto">
                  <div className="mb-8 text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"><FaCreditCard className="text-3xl text-blue-600" /></div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Payment</h2>
                    <p className="text-gray-600">Enter your payment details below.</p>
                  </div>
                  <div className="bg-white p-8 rounded-xl border-2 border-gray-200 mb-6 shadow-lg">
                    <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-200">
                      <span className="text-gray-600">Amount to Pay:</span>
                      <span className="text-3xl font-bold text-blue-600">{formatPrice(totalAmount, selectedCurrency, currencyObj.symbol)}</span>
                    </div>
                    <Elements stripe={stripePromise} options={stripeOptions}>
                      <CheckoutForm amount={totalAmount} currency={selectedCurrency} onSuccess={handlePaymentSuccess} onError={handlePaymentError} formData={formData} />
                    </Elements>
                  </div>
                  <button type="button" onClick={() => setPaymentStep('review')} className="w-full py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors">Back to Review</button>
                </div>
              )}

              {paymentStep === 'payment' && !clientSecret && !paymentError && (
                <div className="flex flex-col items-center justify-center py-12">
                  <FaSpinner className="animate-spin text-4xl text-blue-600 mb-4" />
                  <p className="text-gray-600">Initializing secure payment...</p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestServicePage;