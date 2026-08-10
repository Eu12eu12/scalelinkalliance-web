// src/pages/Services/ServiceRequestPage.jsx
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaCheck, FaArrowRight, FaArrowLeft, FaPaintBrush, FaCode, FaChartLine, FaCogs,
  FaUser, FaEnvelope, FaPhone, FaBuilding, FaCalendar, FaDollarSign, FaPaperPlane,
  FaShieldAlt, FaFileContract, FaLock, FaCreditCard, FaSpinner, FaUpload, FaFile,
  FaCloudUploadAlt, FaGlobeAmericas, FaVideo, FaPenNib, FaPalette,
  FaCamera, FaShoppingCart, FaRocket, FaAd, FaEnvelope as FaEnvelopeIcon,
  FaSearch as FaSearchIcon, FaHeadset, FaProjectDiagram, FaDatabase, FaFileAlt,
  FaChartBar, FaUsers, FaRegBuilding, FaBriefcase, FaRobot, FaInfoCircle
} from 'react-icons/fa';
import emailjs from '@emailjs/browser';
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

const EMAILJS_SERVICE_ID = 'service_z0n4bpa';
const EMAILJS_TEMPLATE_ID = 'template_spxsoac';
const EMAILJS_PUBLIC_KEY = 'IRwXMIYIKhUnttcdY';

const MAX_FILES = 20;

const CHECKOUT_STATE_KEY = 'sla_checkout_state';

// ─── Helper: Get service slug ───
const getServiceSlug = (serviceName) => {
  const slugMap = {
    'Copywriting & Content Creation': 'copywriting',
    'Graphic Design': 'graphic-design',
    'Brand Identity & Logo Design': 'brand-identity',
    'Video Editing & Motion Graphics': 'video-editing',
    'Photography & Visual Assets': 'photography',
    'Website Development': 'website-development',
    'Web Applications & SaaS Development': 'web-applications',
    'E-Commerce Development': 'ecommerce-development',
    'Landing Pages & Sales Funnels': 'landing-pages',
    'Online Booking Systems': 'online-booking-systems',
    'SEO & Search Marketing': 'seo-marketing',
    'Lead Generation Services': 'lead-generation',
    'Paid Advertising Management': 'paid-advertising',
    'Email Marketing Campaigns': 'email-marketing',
    'Reputation & Review Management': 'reputation-review-management',
    'Social Media Management': 'social-media-management',
    'AI Automation & Smart Business Systems': 'ai-automation',
    'CRM Setup & Marketing Automation': 'crm-automation',
    'API Integration': 'api-integration',
    'Business Process Automation': 'business-process-automation',
    'Data Analytics & Reports': 'data-analytics',
    'Business Consulting & Growth Strategy': 'business-consulting-growth-strategy',
    'Virtual Assistant Services': 'virtual-assistant',
    'Project Management Support': 'project-management',
    'Data Entry & Processing': 'data-entry',
    'Request Custom Quote - Content & Branding': 'custom-quote',
    'Request Custom Quote - Tech & Development': 'custom-quote',
    'Request Custom Quote - Marketing & Growth': 'custom-quote',
    'Request Custom Quote - AI': 'ai-custom-quote',
    'Request Custom Quote - Business Support': 'custom-quote'
  };
  return slugMap[serviceName] || serviceName.toLowerCase().replace(/[&\s]/g, '-').replace(/--+/g, '-');
};

// ─── Mirrors getServiceSlug() in ServiceDetailPage.jsx ───
const SLUG_TO_SERVICE_NAME = {
  'brand-identity': 'Brand Identity & Logo Design',
  'copywriting': 'Copywriting & Content Creation',
  'social-media-management': 'Social Media Management',
  'website-development': 'Website Development',
  'video-editing': 'Video Editing & Motion Graphics',
  'graphic-design': 'Graphic Design',
  'photography': 'Photography & Visual Assets',
  'paid-advertising': 'Paid Advertising Management',
  'seo-marketing': 'SEO & Search Marketing',
  'email-marketing': 'Email Marketing Campaigns',
  'lead-generation': 'Lead Generation Services',
  'crm-automation': 'CRM & Marketing Automation',
  'api-integration': 'API Integration & Automation',
  'web-applications': 'Web Applications & SaaS Development',
  'data-analytics': 'Data Analytics & Reporting',
  'process-documentation': 'Process Documentation & SOP Development',
  'virtual-assistant': 'Virtual Assistant Services',
  'project-management': 'Project Management Support',
  'data-entry': 'Data Entry & Processing',
  'website-maintenance': 'Website Maintenance & Updates',
  'ecommerce-development': 'E-Commerce Development',
  'landing-pages': 'Landing Pages & Sales Funnels',
  'ai-automation': 'AI Automation & Smart Business Systems',
  'online-booking-systems': 'Online Booking Systems',
  'reputation-review-management': 'Reputation & Review Management',
  'business-process-automation': 'Business Process Automation',
  'business-consulting-growth-strategy': 'Business Consulting & Growth Strategy',
  'ai-custom-quote': 'Request Custom Quote - AI',
  'custom-quote': 'Request Custom Quote - General'
};

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
  'Request Custom Quote - AI': FaRobot,
  'Request Custom Quote - General': FaCogs
}[name.split(' - ')[0]] || FaCogs);

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024, sizes = ['Bytes', 'KB', 'MB', 'GB'], i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

// ─── Service Hover Preview Component ────────────────────────────────────────────
const ServiceHoverPreview = ({ service, packageKey, onClose }) => {
  const serviceData = SERVICES_WITH_PACKAGES[service];
  const pkgData = serviceData?.packages?.[packageKey];
  const ServiceIcon = getServiceIcon(service);
  const isCustomQuote = service.includes('Request Custom Quote');
  
  if (!serviceData || !pkgData) return null;
  
  const slug = getServiceSlug(service);
  
  return (
    <div className="bg-white rounded-xl p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <ServiceIcon className="text-blue-600 text-lg" />
          <h4 className="font-bold text-gray-900 text-sm">{service.split(' - ')[0]}</h4>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
      </div>
      
      <div className="space-y-2 mb-3">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">{pkgData.name}</span>
          <span className="text-lg font-bold text-blue-600">
            {isCustomQuote || pkgData.price === 0 ? 'Custom Quote' : `$${(pkgData.price / 100).toFixed(2)}`}
          </span>
        </div>
        <p className="text-xs text-gray-600">{pkgData.description}</p>
      </div>
      
      {pkgData.includes && pkgData.includes.length > 0 && !isCustomQuote && pkgData.price > 0 && (
        <div className="border-t border-gray-100 pt-2 mb-3">
          <p className="text-xs font-semibold text-gray-700 mb-1">Includes:</p>
          <ul className="space-y-0.5">
            {pkgData.includes.slice(0, 3).map((item, idx) => (
              <li key={idx} className="flex items-start gap-1.5 text-xs text-gray-600">
                <FaCheck className="text-green-500 mt-0.5 shrink-0" size={10} />
                <span className="line-clamp-1">{item}</span>
              </li>
            ))}
            {pkgData.includes.length > 3 && (
              <li className="text-xs text-gray-400">+{pkgData.includes.length - 3} more items</li>
            )}
          </ul>
        </div>
      )}
      
      <Link 
        to={`/services/${slug}`}
        className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs rounded-lg flex items-center justify-center gap-2 transition-colors"
        onClick={onClose}
      >
        <FaInfoCircle size={12} />
        View Full Service Details
      </Link>
    </div>
  );
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

// ─── Fiverr-style package comparison table ────────────────────────────────────
const PackageComparisonTable = ({ service, selectedPackage, onSelect, currency, convertedAmounts }) => {
  const serviceData = SERVICES_WITH_PACKAGES[service];
  const packages = serviceData?.packages || {};
  const packageKeys = Object.keys(packages);
  const currencyObj = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];
  const isCustomQuote = service.includes('Request Custom Quote');

  if (!serviceData) return null;

  if (isCustomQuote) {
    return (
      <div className="border-2 border-blue-200 rounded-xl bg-blue-50/50 p-5">
        <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5">
          {packages.custom?.includes.map((item, idx) => (
            <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
              <FaCheck className="text-green-500 mt-0.5 shrink-0" size={11} /><span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const packageOrder = ['starter', 'growth', 'premium'];
  const sortedPackageKeys = packageKeys.sort((a, b) => {
    return packageOrder.indexOf(a) - packageOrder.indexOf(b);
  });

  const buildCascadingFeatures = () => {
    const featuresMap = {};
    const allFeatures = [];

    sortedPackageKeys.forEach(pkgKey => {
      const pkgFeatures = packages[pkgKey]?.includes || [];
      pkgFeatures.forEach(feature => {
        if (!featuresMap[feature]) {
          featuresMap[feature] = { 
            name: feature, 
            packages: {},
            order: allFeatures.length 
          };
          allFeatures.push(feature);
        }
      });
    });

    sortedPackageKeys.forEach((pkgKey, index) => {
      const pkgFeatures = packages[pkgKey]?.includes || [];
      allFeatures.forEach(feature => {
        const hasFeature = pkgFeatures.includes(feature) || 
          sortedPackageKeys.slice(0, index).some(prevKey => 
            packages[prevKey]?.includes?.includes(feature)
          );
        featuresMap[feature].packages[pkgKey] = hasFeature;
      });
    });

    return { featuresMap, allFeatures };
  };

  const { featuresMap, allFeatures } = buildCascadingFeatures();

  return (
    <div className="border-2 border-gray-200 rounded-xl overflow-hidden overflow-x-auto">
      <div className="grid min-w-[560px]" style={{ gridTemplateColumns: `1.4fr repeat(${sortedPackageKeys.length}, 1fr)` }}>
        <div className="bg-gray-50 p-3 border-b border-r border-gray-200" />
        {sortedPackageKeys.map(k => {
          const pkg = packages[k];
          const amount = convertedAmounts[service]?.[k] || 0;
          return (
            <button key={k} type="button" onClick={() => onSelect(service, k)}
              className={`p-3 border-b border-r last:border-r-0 border-gray-200 text-center transition-colors ${selectedPackage === k ? 'bg-blue-600 text-white' : 'bg-gray-50 hover:bg-blue-50'}`}>
              <div className="font-bold text-sm">{pkg?.name || k}</div>
              <div className={`text-xs mt-0.5 ${selectedPackage === k ? 'text-blue-100' : 'text-gray-500'}`}>
                {amount > 0 ? formatPrice(amount, currency, currencyObj.symbol) : 'Custom Quote'}
              </div>
            </button>
          );
        })}
        
        {allFeatures.map((feature) => (
          <React.Fragment key={feature}>
            <div className="p-3 text-xs text-gray-700 border-b border-r border-gray-200 bg-white">{feature}</div>
            {sortedPackageKeys.map(k => {
              const hasFeature = featuresMap[feature]?.packages[k] || false;
              const isSelected = selectedPackage === k;
              return (
                <div key={k} className={`p-3 border-b border-r last:border-r-0 border-gray-200 flex items-center justify-center ${isSelected ? 'bg-blue-50/50' : 'bg-white'}`}>
                  {hasFeature ? <FaCheck className="text-green-500" size={12} /> : <span className="text-gray-300">—</span>}
                </div>
              );
            })}
          </React.Fragment>
        ))}
        
        <div className="p-3 border-r border-gray-200 bg-gray-50" />
        {sortedPackageKeys.map(k => (
          <div key={k} className="p-3 border-r last:border-r-0 border-gray-200 bg-gray-50 flex justify-center">
            <button type="button" onClick={() => onSelect(service, k)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${selectedPackage === k ? 'bg-blue-600 text-white' : 'border border-gray-300 text-gray-700 hover:border-blue-400'}`}>
              {selectedPackage === k ? 'Selected' : 'Select'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Live order sidebar (Step 1) ──────────────────────────────────────────────
const OrderSidebar = ({ selectedServices, convertedAmounts, currency, totalAmount, isLoadingRates, onRemove, onContinue, onCustomQuoteDirect, continueLabel, continueDisabled }) => {
  const currencyObj = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];
  const entries = Object.entries(selectedServices);
  const hasCustomQuote = entries.some(([service]) => service.includes('Request Custom Quote'));
  const isOnlyCustomQuote = hasCustomQuote && entries.length === 1;
  const isCustomQuoteWithOthers = hasCustomQuote && entries.length > 1;

  return (
    <div className="lg:sticky lg:top-24 bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><FaShoppingCart className="text-blue-600" />Your Order</h3>
      {entries.length === 0 ? (
        <p className="text-sm text-gray-500">No services selected yet. Choose one or more services to get started.</p>
      ) : (
        <div className="space-y-3 mb-4 max-h-80 overflow-y-auto pr-1">
          {entries.map(([service, pkg]) => {
            const ServiceIcon = getServiceIcon(service);
            const pkgData = SERVICES_WITH_PACKAGES[service]?.packages[pkg];
            const amount = convertedAmounts[service]?.[pkg] || 0;
            return (
              <div key={service} className="flex items-start justify-between gap-2 text-sm border-b border-gray-100 pb-3">
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  <ServiceIcon className="text-blue-600 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">{service.split(' - ')[0]}</p>
                    <p className="text-xs text-gray-500">{pkgData?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-semibold text-gray-900 text-xs">{amount > 0 ? formatPrice(amount, currency, currencyObj.symbol) : 'Quote'}</span>
                  <button type="button" onClick={() => onRemove(service)} className="text-gray-400 hover:text-red-500">×</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div className="border-t-2 border-gray-100 pt-4 mb-5">
        <div className="flex justify-between items-center">
          <span className="font-bold text-gray-900">Total</span>
          <span className="text-2xl font-bold text-blue-600">
            {isLoadingRates ? <FaSpinner className="animate-spin inline" /> : totalAmount > 0 ? formatPrice(totalAmount, currency, currencyObj.symbol) : 'Custom Quote'}
          </span>
        </div>
      </div>
      
      {/* Custom Quote Direct Button */}
      {hasCustomQuote && totalAmount === 0 && (
        <button 
          type="button" 
          onClick={onCustomQuoteDirect}
          className="w-full py-3.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 bg-purple-600 text-white hover:bg-purple-700 hover:shadow-lg mb-3"
        >
          Proceed with Custom Quote <FaArrowRight />
        </button>
      )}
      
      <button type="button" onClick={onContinue} disabled={continueDisabled || (hasCustomQuote && totalAmount === 0)}
        className={`w-full py-3.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${continueDisabled || (hasCustomQuote && totalAmount === 0) ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'}`}>
        {continueLabel} <FaArrowRight />
      </button>
      
      {isCustomQuoteWithOthers && (
        <p className="text-xs text-amber-600 mt-2 text-center">
          Note: Custom quote services will be priced separately from standard packages.
        </p>
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
  const [agreedToEscrow, setAgreedToEscrow] = useState(false);
  const [activeLegalTab, setActiveLegalTab] = useState('privacy');
  const [paymentError, setPaymentError] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedServices, setSelectedServices] = useState({});
  const [selectedCurrency, setSelectedCurrency] = useState('usd');
  const [exchangeRates, setExchangeRates] = useState(null);
  const [isLoadingRates, setIsLoadingRates] = useState(false);
  const [convertedAmounts, setConvertedAmounts] = useState({});
  const [serverFileUrls, setServerFileUrls] = useState([]);
  
  // Hover preview state
  const [hoveredService, setHoveredService] = useState(null);
  const [previewTimer, setPreviewTimer] = useState(null);

  // Payment gate
  const [isPaid, setIsPaid] = useState(false);
  const [isRedirectingToStripe, setIsRedirectingToStripe] = useState(false);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [checkoutSessionId, setCheckoutSessionId] = useState(null);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '',
    phoneDialCode: '+1', phoneCountryCode: 'US', phoneNumber: '',
    company: '', otherServiceDescription: '',
    projectDescription: '', timeline: '', budget: '',
    clientWebsite: '', clientLocation: '', clientIndustry: '',
    agreedToPrivacy: false, agreedToTerms: false,
  });

  const [customQuoteAnswers, setCustomQuoteAnswers] = useState({
    techStack: '', techIntegration: '', techHosting: '',
    opsSupportAreas: [], opsSupportAreasOther: '', opsHours: '', opsTools: '',
    creativeFormats: [], creativeFormatsOther: '', creativeDirection: '', creativeTurnaround: '',
    marketingChannels: [], marketingChannelsOther: '', marketingAdSpend: '', marketingAudience: '',
    aiFeatures: [],
    aiFeaturesOther: '',
    aiCurrentTools: '',
    aiTimeSpent: '',
    aiSuccessLooksLike: '',
  });

  const fullPhone = formData.phoneNumber ? `${formData.phoneDialCode} ${formData.phoneNumber}` : '';

  // ── Handle direct custom quote to Step 2 ──
  const handleCustomQuoteDirect = () => {
    setIsPaid(true);
    setCurrentStep(2);
    window.scrollTo(0, 0);
  };

  // ── Check for step=2 param on load ──
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const stepParam = params.get('step');
    const serviceSlug = params.get('service');
    
    // If step=2 and there's a custom quote or no services selected yet
    if (stepParam === '2') {
      // Check if we have any custom quote services selected
      const hasCustomQuote = Object.keys(selectedServices).some(s => s.includes('Request Custom Quote'));
      
      // If custom quote is selected, go to step 2
      if (hasCustomQuote) {
        setIsPaid(true);
        setCurrentStep(2);
        window.scrollTo(0, 0);
      } 
      // If no services selected yet but we have a service slug, pre-select it
      else if (serviceSlug) {
        const serviceName = SLUG_TO_SERVICE_NAME[serviceSlug];
        if (serviceName && serviceName.includes('Request Custom Quote')) {
          // Select the custom quote service
          setSelectedServices(prev => ({ ...prev, [serviceName]: 'custom' }));
          // Then go to step 2
          setTimeout(() => {
            setIsPaid(true);
            setCurrentStep(2);
            window.scrollTo(0, 0);
          }, 100);
        }
      }
    }
  }, [location.search, selectedServices]);

  // ── Fetch exchange rates ──
  useEffect(() => {
    setIsLoadingRates(true);
    fetch('https://open.er-api.com/v6/latest/USD')
      .then(r => r.json())
      .then(d => setExchangeRates(d.rates))
      .catch(() => setExchangeRates({ USD: 1, EUR: 0.92, GBP: 0.79, JPY: 150.5, CNY: 7.19, CAD: 1.35, AUD: 1.52, CHF: 0.88, INR: 83.12, SGD: 1.34 }))
      .finally(() => setIsLoadingRates(false));
  }, []);

  // ── Auto-detect currency ──
  useEffect(() => {
    try {
      const c = new Intl.NumberFormat(navigator.language, { style: 'currency', currency: 'USD' }).resolvedOptions().currency.toLowerCase();
      if (CURRENCIES.find(x => x.code === c)) setSelectedCurrency(c);
    } catch { }
  }, []);

  // ── Pre-select the service + package passed from ServiceDetailPage's Continue link ──
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const serviceSlug = params.get('service');
    const pkgParam = params.get('package');
    const stepParam = params.get('step');
    
    if (!serviceSlug) return;

    const serviceName = SLUG_TO_SERVICE_NAME[serviceSlug];
    const serviceData = serviceName ? SERVICES_WITH_PACKAGES[serviceName] : null;
    if (!serviceData) return;

    const availablePackages = Object.keys(serviceData.packages || {});
    const packageKey = pkgParam && availablePackages.includes(pkgParam) ? pkgParam : availablePackages[0];
    if (!packageKey) return;

    setSelectedServices(prev => ({ ...prev, [serviceName]: packageKey }));
    
    // If step=2 and it's a custom quote, go directly to step 2
    if (stepParam === '2' && serviceName && serviceName.includes('Request Custom Quote')) {
      setTimeout(() => {
        setIsPaid(true);
        setCurrentStep(2);
        window.scrollTo(0, 0);
      }, 200);
    }
    
    window.history.replaceState({}, '', window.location.pathname);
  }, []);

  // ── Handle return from Stripe Checkout ──
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    const canceled = params.get('canceled');

    const restoreSelections = () => {
      try {
        const saved = JSON.parse(sessionStorage.getItem(CHECKOUT_STATE_KEY) || '{}');
        if (saved.selectedServices) setSelectedServices(saved.selectedServices);
        if (saved.selectedCurrency) setSelectedCurrency(saved.selectedCurrency);
      } catch { /* ignore malformed storage */ }
    };

    if (sessionId) {
      restoreSelections();
      setIsVerifyingPayment(true);
      fetch(`/api/verify-checkout-session?session_id=${encodeURIComponent(sessionId)}`)
        .then(r => r.json().then(data => ({ ok: r.ok, data })))
        .then(({ ok, data }) => {
          if (!ok || !data.paid) throw new Error(data.error || 'Payment could not be verified.');
          setIsPaid(true);
          setCheckoutSessionId(sessionId);
          if (data.email) setFormData(prev => ({ ...prev, email: data.email }));
          setCurrentStep(3);
          sessionStorage.removeItem(CHECKOUT_STATE_KEY);
        })
        .catch(err => {
          setPaymentError(err.message || 'We could not verify your payment. If you were charged, please contact support.');
          setCurrentStep(2);
        })
        .finally(() => {
          setIsVerifyingPayment(false);
          window.history.replaceState({}, '', window.location.pathname);
        });
    } else if (canceled) {
      restoreSelections();
      setCurrentStep(2);
      setPaymentError('Checkout was canceled. Your selections have been restored below — try again when ready.');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Guard: Step 3 is only reachable once payment (or the $0 custom-quote bypass) has cleared
  useEffect(() => {
    if (currentStep === 3 && !isPaid) setCurrentStep(2);
  }, [currentStep, isPaid]);

  const convertAmount = useCallback((usd) => {
    if (!exchangeRates || usd === 0 || !selectedCurrency) return usd;
    const rate = exchangeRates[selectedCurrency.toUpperCase()];
    if (!rate) return usd;
    return Math.round(usd * rate);
  }, [exchangeRates, selectedCurrency]);

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

  const steps = [
    { number: 1, title: 'Select Services' },
    { number: 2, title: 'Review & Pay' },
    { number: 3, title: 'Your Details' },
  ];

  const handleInputChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleServiceToggle = service => {
    setSelectedServices(prev => {
      const next = { ...prev };
      let categoryServices = [];
      for (const catKey in SERVICE_CATEGORIES) {
        if (SERVICE_CATEGORIES[catKey].services.includes(service)) {
          categoryServices = SERVICE_CATEGORIES[catKey].services;
          break;
        }
      }
      if (prev[service]) {
        delete next[service];
      } else {
        if (service.includes('Request Custom Quote')) {
          categoryServices.forEach(s => { if (s !== service) delete next[s]; });
          next[service] = 'custom';
        } else {
          categoryServices.forEach(s => { if (s.includes('Request Custom Quote')) delete next[s]; });
          next[service] = 'starter';
        }
      }
      return next;
    });
  };

  const removeService = service => setSelectedServices(p => { const n = { ...p }; delete n[service]; return n; });

  // ── Hover handlers ──
  const handleServiceHover = (service) => {
    if (previewTimer) clearTimeout(previewTimer);
    const timer = setTimeout(() => {
      setHoveredService(service);
    }, 300);
    setPreviewTimer(timer);
  };

  const handleServiceLeave = () => {
    if (previewTimer) clearTimeout(previewTimer);
    setTimeout(() => {
      setHoveredService(null);
    }, 200);
  };

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
  const buildTemplateParams = () => {
    const currencyObj = CURRENCIES.find(c => c.code === selectedCurrency) || CURRENCIES[0];
    const serviceEntries = Object.entries(selectedServices);
    const servicesLine = serviceEntries
      .map(([svc, pkg]) => `${svc} (${SERVICES_WITH_PACKAGES[svc]?.packages?.[pkg]?.name || pkg})`)
      .join(', ') || 'None selected';
    const totalLine = totalAmount > 0 ? formatPrice(totalAmount, selectedCurrency, currencyObj.symbol) : 'Custom Quote';
    const totalSizeRaw = uploadedFiles.reduce((acc, f) => acc + (Number(f.size) || 0), 0);
    const fileListFormatted = uploadedFiles.length > 0
      ? uploadedFiles.map(f => `• ${f.name || 'File'} (${formatFileSize(f.size || 0)})`).join('\n')
      : 'No files uploaded';
    const fullName = `${formData.firstName || ''} ${formData.lastName || ''}`.trim() || 'Valued Client';
    const paymentStatus = totalAmount > 0
      ? (isPaid ? `Paid via Stripe Checkout (Session: ${checkoutSessionId})` : 'Unpaid')
      : 'Quote Requested';

    return {
      title: serviceEntries.length > 0 ? serviceEntries[0][0] : 'New Service Request',
      name: fullName,
      email: formData.email || '',
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
      payment_status: paymentStatus,
      file_count: uploadedFiles.length.toString(),
      total_file_size: formatFileSize(totalSizeRaw),
      uploaded_files: fileListFormatted,
      request_date: new Date().toLocaleString(),
      // AI-specific fields
      ai_features: customQuoteAnswers.aiFeatures.join(', ') || 'Not specified',
      ai_features_other: customQuoteAnswers.aiFeaturesOther || '',
      ai_current_tools: customQuoteAnswers.aiCurrentTools || 'Not specified',
      ai_time_spent: customQuoteAnswers.aiTimeSpent || 'Not specified',
      ai_success_looks_like: customQuoteAnswers.aiSuccessLooksLike || 'Not specified',
    };
  };

  const sendEmailNotification = async () => {
    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, buildTemplateParams(), EMAILJS_PUBLIC_KEY);
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
          paymentStatus: totalAmount > 0 ? (isPaid ? 'paid' : 'unpaid') : 'quote_requested',
          checkoutSessionId,
          projectScope: { customQuoteAnswers }
        })
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Server error saving request.');
      }
    } catch (err) {
      console.error('Failed to create notice board job:', err);
      throw err;
    }
  };

  // ── Step 2 → Stripe Checkout (or bypass for $0 custom quote) ──
  const legalAgreed = formData.agreedToPrivacy && formData.agreedToTerms;
  const canProceedFromReview = legalAgreed && agreedToEscrow && !isSubmitting && !isLoadingRates;

  const handleContinueFromReview = async () => {
    if (!canProceedFromReview) return;

    if (totalAmount === 0) {
      setIsPaid(true);
      setCurrentStep(3);
      return;
    }

    setIsSubmitting(true);
    setIsRedirectingToStripe(true);
    setPaymentError(null);
    try {
      sessionStorage.setItem(CHECKOUT_STATE_KEY, JSON.stringify({ selectedServices, selectedCurrency }));
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          services: selectedServices,
          currency: selectedCurrency,
          amount: totalAmount,
          customer_email: formData.email || undefined,
          success_url: `${window.location.origin}${window.location.pathname}?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${window.location.origin}${window.location.pathname}?canceled=true`,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || 'Failed to start checkout.');
      window.location.href = data.url;
    } catch (err) {
      setPaymentError(err.message || 'Failed to start checkout. Please try again.');
      setIsSubmitting(false);
      setIsRedirectingToStripe(false);
    }
  };

  // ── Step 3 final submission (post-payment) ──
  const isStep3Complete = !!(
    formData.firstName?.trim() && formData.lastName?.trim() && formData.email?.trim() &&
    formData.phoneNumber?.trim() && formData.company?.trim() && formData.projectDescription?.trim()
  );

  const handleFinalSubmit = async () => {
    if (!isStep3Complete || isSubmitting) return;
    setIsSubmitting(true);
    setPaymentError(null);
    try {
      const fileUrls = await uploadFiles();
      setServerFileUrls(fileUrls);
      await createNoticeBoardJob(fileUrls);
      await sendEmailNotification();
      setSubmitSuccess(true);
    } catch (err) {
      console.error('Submission error:', err);
      setPaymentError(err.message || 'Failed to submit your details. Your payment was already processed — please contact support so we can finish setting up your project.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => { 
    // If custom quote is selected, go directly to step 2
    const hasCustomQuote = Object.keys(selectedServices).some(s => s.includes('Request Custom Quote'));
    if (hasCustomQuote && totalAmount === 0) {
      setIsPaid(true);
      setCurrentStep(2);
      window.scrollTo(0, 0);
      return;
    }
    if (currentStep < 3) { 
      setCurrentStep(p => p + 1); 
      window.scrollTo(0, 0); 
    } 
  };
  
  const prevStep = () => { if (currentStep > 1) { setCurrentStep(p => p - 1); window.scrollTo(0, 0); } };

  const currencyObj = CURRENCIES.find(c => c.code === selectedCurrency) || CURRENCIES[0];
  const categoryMeta = [
    { cat: 'creative-content', bg: 'bg-purple-100', iconColor: 'text-purple-600', border: 'hover:border-purple-200' },
    { cat: 'tech-development', bg: 'bg-indigo-100', iconColor: 'text-indigo-600', border: 'hover:border-indigo-200' },
    { cat: 'marketing-growth', bg: 'bg-green-100', iconColor: 'text-green-600', border: 'hover:border-green-200' },
    { cat: 'operations-support', bg: 'bg-orange-100', iconColor: 'text-orange-600', border: 'hover:border-orange-200' },
  ];
  const categoryIcons = {
    'creative-content': FaPaintBrush, 'tech-development': FaCode,
    'marketing-growth': FaChartLine, 'operations-support': FaCogs
  };

  // ── Verifying payment (full-page interstitial after Stripe redirect) ──
  if (isVerifyingPayment) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mb-4 mx-auto" />
          <p className="text-gray-600 font-medium">Confirming your payment...</p>
        </div>
      </div>
    );
  }

  // ── Success screen ──
  if (submitSuccess) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"><FaCheck className="text-3xl text-green-600" /></div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{totalAmount > 0 ? 'Payment Successful!' : 'Request Received!'}</h1>
            <p className="text-gray-600 mb-8 text-lg">{totalAmount > 0 ? `Thank you for your payment of ${formatPrice(totalAmount, selectedCurrency, currencyObj.symbol)}. Our team will contact you within 24 hours.` : 'Thank you for your request. We will be in touch within 24 hours.'}</p>
            {uploadedFiles.length > 0 && <p className="text-sm text-gray-500 mb-8">{uploadedFiles.length} file(s) uploaded successfully</p>}
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
        <div className="max-w-5xl mx-auto mb-8 pt-8">
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

        <div className="max-w-6xl mx-auto">
          {/* ── Step 1: Service Selection + Add-ons ── */}
          {currentStep === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
              <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                <div className="mb-8">
                  <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">Step 1 of 3</span>
                  <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-4">Service Selection</h2>
                  <p className="text-gray-600">Pick your services, then compare packages side-by-side.</p>
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 text-sm font-semibold">
                    Starting price options are shown during service selection. Custom quotes are available for larger or more detailed projects.
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-10">
                  {categoryMeta.map(({ cat, bg, iconColor, border }) => {
                    const catData = SERVICE_CATEGORIES[cat];
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
                            const serviceSlug = getServiceSlug(service);
                            const selectedPkg = selectedServices[service] || 'starter';
                            
                            return (
                              <div 
                                key={service} 
                                className="relative"
                                onMouseEnter={() => handleServiceHover(service)}
                                onMouseLeave={handleServiceLeave}
                              >
                                <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}>
                                  <input 
                                    type="checkbox" 
                                    checked={isSelected} 
                                    onChange={() => handleServiceToggle(service)} 
                                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300" 
                                  />
                                  <div className="ml-3 flex-1 flex items-center">
                                    <ServiceIcon className="mr-2 text-gray-500" />
                                    <span className="text-gray-700 font-medium">{service.split(' - ')[0]}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {isSelected && <FaCheck className="text-green-500" />}
                                    <Link
                                      to={`/services/${serviceSlug}`}
                                      className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded hover:bg-blue-200 transition-colors flex items-center gap-1"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <FaInfoCircle size={10} />
                                      View Detail
                                    </Link>
                                  </div>
                                </label>
                                
                                {/* Hover Preview */}
                                {hoveredService === service && isSelected && (
                                  <div 
                                    className="absolute z-50 w-80 bg-white rounded-xl shadow-2xl border-2 border-blue-200 p-5 left-full ml-3 top-0 animate-fade-in"
                                    onMouseEnter={() => {
                                      if (previewTimer) clearTimeout(previewTimer);
                                      setHoveredService(service);
                                    }}
                                    onMouseLeave={() => {
                                      setHoveredService(null);
                                    }}
                                    style={{ minWidth: '320px' }}
                                  >
                                    <ServiceHoverPreview 
                                      service={service} 
                                      packageKey={selectedPkg}
                                      onClose={() => setHoveredService(null)}
                                    />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {Object.keys(selectedServices).length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Compare Packages</h3>
                    <div className="space-y-8">
                      {Object.entries(selectedServices).map(([service, pkg]) => (
                        <div key={service}>
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            {React.createElement(getServiceIcon(service), { className: 'text-blue-600' })}
                            {service.includes('Request Custom Quote') ? `Custom Quote: ${service.split(' - ')[1]}` : service}
                          </h4>
                          <PackageComparisonTable
                            service={service}
                            selectedPackage={pkg}
                            onSelect={(s, k) => setSelectedServices(p => ({ ...p, [s]: k }))}
                            currency={selectedCurrency}
                            convertedAmounts={convertedAmounts}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <OrderSidebar
                selectedServices={selectedServices}
                convertedAmounts={convertedAmounts}
                currency={selectedCurrency}
                totalAmount={totalAmount}
                isLoadingRates={isLoadingRates}
                onRemove={removeService}
                onContinue={nextStep}
                onCustomQuoteDirect={handleCustomQuoteDirect}
                continueLabel="Continue to Review"
                continueDisabled={Object.keys(selectedServices).length === 0}
              />
            </motion.div>
          )}

          {/* ── Step 2: Review Terms & Pay ── */}
          {currentStep === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
              <div className="mb-8">
                <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">Step 2 of 3</span>
                <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-4">Review Terms & Pay</h2>
                <p className="text-gray-600">Agree to our terms, then complete secure checkout. You'll fill in your contact and project details right after.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Left: Legal */}
                <div>
                  <div className="flex mb-6">
                    <div className="bg-gray-100 p-1 rounded-lg inline-flex">
                      {[['privacy', 'Privacy Policy', FaLock], ['terms', 'Terms of Service', FaFileContract]].map(([id, label, Icon]) => (
                        <button key={id} type="button" onClick={() => setActiveLegalTab(id)}
                          className={`px-5 py-2 rounded-md font-semibold text-sm transition-all ${activeLegalTab === id ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
                          <Icon className="inline mr-2" />{label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 mb-6 max-h-72 overflow-y-auto border border-gray-200">
                    {(activeLegalTab === 'privacy' ? privacyPolicyContent : termsContent).map((section, idx) => (
                      <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200 mb-3">
                        <h4 className="font-bold text-gray-900 mb-2 flex items-center text-sm">
                          <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs mr-2">{idx + 1}</span>
                          {section.title}
                        </h4>
                        <p className="text-gray-700 text-sm leading-relaxed">{section.content}</p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3 bg-white border-2 border-gray-200 rounded-xl p-5">
                    {[['agreedToPrivacy', 'I agree to the Privacy Policy', 'I have read and understand how Scale Link Alliance collects, uses, and protects my personal information.'],
                    ['agreedToTerms', 'I agree to the Terms of Service', 'I have read and agree to abide by the Terms of Service, including user conduct guidelines and liability limitations.'] 
                    ].map(([name, title, desc]) => (
                      <label key={name} className="flex items-start p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="checkbox" name={name} checked={formData[name]} onChange={handleInputChange} className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300 mt-0.5" />
                        <div className="ml-3"><span className="block font-semibold text-gray-900 text-sm">{title} *</span><span className="block text-xs text-gray-600 mt-1">{desc}</span></div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Right: Payment Summary */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-200 shadow-md h-fit">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><FaCreditCard className="text-blue-600" />Order Summary</h3>
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

                  <div className="mb-4 bg-slate-50 border border-slate-200 p-4 rounded-xl text-left">
                    <p className="text-xs text-slate-600 mb-2 leading-relaxed font-medium">
                      For approved projects, ScaleLink Alliance may use deposit, milestone, or escrow-based payment terms to protect both the client and the service team. Payment details will be clearly listed in the approved quote, invoice, or project agreement before work begins.
                    </p>
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreedToEscrow}
                        onChange={e => setAgreedToEscrow(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mt-0.5 cursor-pointer"
                      />
                      <span className="text-xs font-semibold text-slate-700 leading-tight">
                        I agree to the <a href="/legal?tab=escrow" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ScaleLink Alliance Payment & Escrow Terms</a> and understand my project may require a deposit, milestone, or escrow-based payment.
                      </span>
                    </label>
                  </div>

                  <button type="button" onClick={handleContinueFromReview} disabled={!canProceedFromReview}
                    className="w-full py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-lg rounded-xl hover:from-blue-700 hover:to-blue-800 transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl mb-4">
                    {isRedirectingToStripe ? <><FaSpinner className="animate-spin" />Redirecting to Secure Checkout...</> :
                      isLoadingRates ? <><FaSpinner className="animate-spin" />Loading Exchange Rates...</> :
                        totalAmount > 0 ? <><FaCreditCard className="text-xl" />Proceed to Secure Checkout<FaArrowRight className="text-sm" /></> :
                          <><FaPaperPlane />Request Custom Quote</>}
                  </button>
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-600 bg-white bg-opacity-50 p-3 rounded-lg">
                    <FaLock className="text-green-600" />
                    <span>Secured by <strong>Stripe</strong>. We never store your card information.</span>
                  </div>
                  <div className="mt-4 text-center">
                    <button type="button" onClick={prevStep} className="text-gray-500 hover:text-gray-700 text-sm flex items-center justify-center gap-1 mx-auto"><FaArrowLeft /> Back to services</button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Step 3: Contact Info + Project Details (post-payment) ── */}
          {currentStep === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
              <div className="mb-8">
                {totalAmount > 0 && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                    <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center shrink-0"><FaCheck className="text-green-600" /></div>
                    <p className="text-sm text-green-800 font-semibold">Payment confirmed — {formatPrice(totalAmount, selectedCurrency, currencyObj.symbol)}. Just a few details left.</p>
                  </div>
                )}
                <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">Step 3 of 3</span>
                <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-4">Your Details</h2>
                <p className="text-gray-600 text-lg">Tell us who you are and more about your project.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-10">
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
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                  <PhoneInput
                    value={formData.phoneNumber}
                    dialCode={formData.phoneDialCode}
                    countryCode={formData.phoneCountryCode}
                    onNumberChange={val => setFormData(p => ({ ...p, phoneNumber: val }))}
                    onDialChange={(dial, code) => setFormData(p => ({ ...p, phoneDialCode: dial, phoneCountryCode: code }))}
                  />
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

                {/* ─── AI-SPECIFIC QUESTIONS ─── */}
                {/* Only show if an AI custom quote service is selected */}
                {Object.keys(selectedServices).some(service => 
                  service.includes('AI') || service.includes('ai') || service === 'Request Custom Quote - AI'
                ) && (
                  <>
                    <div className="md:col-span-2 border-t border-gray-200 pt-6 mt-2">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <FaRobot className="text-purple-600" />
                        AI Project Details
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">Help us understand your AI needs better.</p>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">What AI Features Are You Interested In?</label>
                      <div className="grid sm:grid-cols-2 gap-3 mt-1">
                        {[
                          { id: 'ai_chat', label: 'AI Chat' },
                          { id: 'ai_voice', label: 'AI Voice' },
                          { id: 'ai_email', label: 'AI Email' },
                          { id: 'ai_reporting', label: 'AI Reporting' },
                          { id: 'workflow_automation', label: 'Workflow Automation' },
                          { id: 'other', label: 'Others: Specify' }
                        ].map(item => {
                          const checked = customQuoteAnswers.aiFeatures.includes(item.id);
                          if (item.id === 'other') {
                            return (
                              <div key={item.id} className="flex flex-col gap-2 p-3 border border-slate-200 rounded-xl bg-white transition-all sm:col-span-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => {
                                      const nextFeatures = checked
                                        ? customQuoteAnswers.aiFeatures.filter(f => f !== item.id)
                                        : [...customQuoteAnswers.aiFeatures, item.id];
                                      setCustomQuoteAnswers(p => ({
                                        ...p,
                                        aiFeatures: nextFeatures,
                                        aiFeaturesOther: checked ? '' : p.aiFeaturesOther
                                      }));
                                    }}
                                    className="w-4 h-4 text-blue-600 rounded"
                                  />
                                  <span className="text-xs font-semibold text-slate-700">{item.label}</span>
                                </label>
                                {checked && (
                                  <input
                                    type="text"
                                    placeholder="Specify other AI features..."
                                    value={customQuoteAnswers.aiFeaturesOther || ''}
                                    onChange={e => setCustomQuoteAnswers(p => ({ ...p, aiFeaturesOther: e.target.value }))}
                                    className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                  />
                                )}
                              </div>
                            );
                          }
                          return (
                            <label key={item.id} className="flex items-center gap-2 p-3 border border-slate-200 hover:border-slate-300 rounded-xl bg-white cursor-pointer transition-all">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => {
                                  const nextFeatures = checked
                                    ? customQuoteAnswers.aiFeatures.filter(f => f !== item.id)
                                    : [...customQuoteAnswers.aiFeatures, item.id];
                                  setCustomQuoteAnswers(p => ({ ...p, aiFeatures: nextFeatures }));
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
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">What Tools Does Your Business Currently Use?</label>
                      <input
                        type="text"
                        placeholder="e.g. HubSpot, Zapier, Google Sheets, None"
                        value={customQuoteAnswers.aiCurrentTools}
                        onChange={e => setCustomQuoteAnswers(p => ({ ...p, aiCurrentTools: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">How Much Time Does Your Team Currently Spend on These Tasks?</label>
                      <input
                        type="text"
                        placeholder="e.g. 10 hours/week, 5 hours/day, Not sure"
                        value={customQuoteAnswers.aiTimeSpent}
                        onChange={e => setCustomQuoteAnswers(p => ({ ...p, aiTimeSpent: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">What Does AI-Powered Success Look Like for Your Business?</label>
                      <textarea
                        rows={3}
                        placeholder="Describe how you envision AI improving your business operations..."
                        value={customQuoteAnswers.aiSuccessLooksLike}
                        onChange={e => setCustomQuoteAnswers(p => ({ ...p, aiSuccessLooksLike: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                      />
                    </div>
                  </>
                )}

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

              {paymentError && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{paymentError}</div>
              )}

              <div className="flex justify-end mt-8 pt-8 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={!isStep3Complete || isSubmitting}
                  className={`px-8 py-4 font-semibold rounded-lg transition-all flex items-center gap-2 ${!isStep3Complete || isSubmitting ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'}`}
                >
                  {isSubmitting ? <><FaSpinner className="animate-spin" />{uploadedFiles.length > 0 ? 'Uploading Files...' : 'Submitting...'}</> : <><FaPaperPlane />Submit Request</>}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Add animation styles */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default RequestServicePage;