// src/components/forms/ServiceRequestForm.jsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FaSpinner, FaArrowLeft, FaArrowRight, FaCheck, FaInfoCircle } from 'react-icons/fa';
import emailjs from '@emailjs/browser';

// EmailJS Configuration - Replace with your actual credentials
const EMAILJS_SERVICE_ID = 'service_z0n4bpa';
const EMAILJS_TEMPLATE_ID = 'template_9ytrhff';
const EMAILJS_PUBLIC_KEY = 'IRwXMIYIKhUnttcdY';

// Service Data
const SERVICE_CATEGORIES = {
  website_web_app_development: {
    id: 'website_web_app_development',
    name: 'Website & Web App Development',
    services: [
      'Website Development',
      'Web Application Development',
      'E-Commerce Development',
      'Landing Pages & Sales Funnels',
      'Online Booking Systems'
    ]
  },
  website_growth_marketing: {
    id: 'website_growth_marketing',
    name: 'Website Growth & Marketing',
    services: [
      'SEO & Search Marketing',
      'Lead Generation Services',
      'Paid Advertising Management',
      'Email Marketing Campaigns',
      'Reputation & Review Management',
      'Social Media Management'
    ]
  },
  automation_crm_ai_systems: {
    id: 'automation_crm_ai_systems',
    name: 'Automation, CRM & AI Systems',
    services: [
      'AI Automation & Smart Business Systems',
      'CRM Setup & Marketing Automation',
      'API Integration',
      'Business Process Automation',
      'Data Analytics & Reports'
    ]
  },
  content_branding_creative: {
    id: 'content_branding_creative',
    name: 'Content, Branding & Creative',
    services: [
      'Copywriting & Content Creation',
      'Graphic Design',
      'Brand Identity & Logo Design',
      'Video Editing & Motion Graphics'
    ]
  },
  business_strategy_support: {
    id: 'business_strategy_support',
    name: 'Business Strategy & Support',
    services: [
      'Business Consulting & Growth Strategy',
      'Operations Support'
    ]
  }
};

// Package options
const PACKAGES = {
  basic: { id: 'basic', name: 'Basic', label: 'For simple needs and smaller projects.' },
  standard: { id: 'standard', name: 'Standard', label: 'For growing businesses that need a more complete setup.' },
  premium: { id: 'premium', name: 'Premium', label: 'For businesses that need advanced features, integrations, or stronger support.' },
  custom: { id: 'custom', name: 'Custom Quote', label: 'For larger, detailed, or multi-service projects.' }
};

// Add-ons by service category
const ADDONS_BY_CATEGORY = {
  website_web_app_development: [
    'SEO setup',
    'Copywriting',
    'Logo design',
    'Booking system',
    'Payment integration',
    'CRM setup',
    'Email automation',
    'API integration',
    'Analytics dashboard',
    'Website maintenance',
    'Lead generation',
    'Social media graphics'
  ],
  website_growth_marketing: [
    'Landing page',
    'CRM pipeline',
    'Email follow-up',
    'Paid ads',
    'SEO content',
    'Data reports',
    'Virtual assistant follow-up'
  ],
  automation_crm_ai_systems: [
    'CRM setup and integration',
    'Custom reporting dashboards',
    'Multi-channel notification routing',
    'Voice or call automation',
    'Ongoing automation maintenance'
  ],
  content_branding_creative: [
    'Email marketing sequences',
    'Long-form blog content (2,000+ words)',
    'Sales page copywriting',
    'Website rewrite packages',
    'Editing and proofreading'
  ],
  business_strategy_support: [
    'Team training documentation',
    'Workflow automation recommendations',
    'Internal operations manuals',
    'Onboarding process documentation',
    'Knowledge base development'
  ]
};

// AI Automation specific fields schema
const aiAutomationSchema = yup.object({
  automation_process: yup.string().when('path', {
    is: 'ai_automation_custom',
    then: () => yup.string().required('Please describe what you want to automate')
  }),
  current_tools: yup.string().when('path', {
    is: 'ai_automation_custom',
    then: () => yup.string().required('Please list your current tools')
  }),
  information_source: yup.string().when('path', {
    is: 'ai_automation_custom',
    then: () => yup.string()
  }),
  information_destination: yup.string().when('path', {
    is: 'ai_automation_custom',
    then: () => yup.string()
  }),
  automation_type: yup.array().when('path', {
    is: 'ai_automation_custom',
    then: () => yup.array().min(1, 'Please select at least one automation type')
  }),
  task_frequency: yup.string().when('path', {
    is: 'ai_automation_custom',
    then: () => yup.string().required('Please specify how often this task occurs')
  }),
  time_spent: yup.string().when('path', {
    is: 'ai_automation_custom',
    then: () => yup.string().required('Please estimate time spent')
  }),
  notification_recipients: yup.string().when('path', {
    is: 'ai_automation_custom',
    then: () => yup.string()
  }),
  success_definition: yup.string().when('path', {
    is: 'ai_automation_custom',
    then: () => yup.string().required('Please define what success looks like')
  })
});

// Main schema
const schema = yup.object({
  // Step 1: Path
  path: yup.string().required('Please select a path'),
  
  // Step 2: Service Selection
  service_category: yup.string().when('path', {
    is: (path) => path && path !== 'ai_automation_custom',
    then: () => yup.string().required('Please select a service category')
  }),
  service_name: yup.string().when('path', {
    is: (path) => path && path !== 'ai_automation_custom',
    then: () => yup.string().required('Please select a service')
  }),
  
  // Step 3: Package Selection
  package_tier: yup.string().when('path', {
    is: (path) => path && path !== 'ai_automation_custom',
    then: () => yup.string().required('Please select a package')
  }),
  
  // Step 4: Add-ons
  addons: yup.array(),
  
  // Step 5: Project Details
  business_name: yup.string().required('Business name is required'),
  contact_name: yup.string().required('Contact name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone is required'),
  current_website: yup.string().url('Please enter a valid URL'),
  project_goal: yup.string().required('Please describe your project goals'),
  timeline: yup.string().required('Timeline is required'),
  budget_range: yup.string(),
  additional_notes: yup.string(),
  
  // AI Automation specific fields (injected conditionally)
  ...aiAutomationSchema.fields,
  
  // Step 6: Terms
  escrow_terms_accepted: yup.boolean().oneOf([true], 'You must accept the payment terms to proceed'),
  consent_checkbox: yup.boolean().oneOf([true], 'You must agree to be contacted')
});

const ServiceRequestForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPath, setSelectedPath] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('');
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({});

  const { register, handleSubmit, formState: { errors }, watch, setValue, getValues, trigger } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      addons: [],
      automation_type: [],
      escrow_terms_accepted: false,
      consent_checkbox: false
    }
  });

  const watchPath = watch('path');
  const watchCategory = watch('service_category');
  const watchPackage = watch('package_tier');

  // Sync state with form values
  useEffect(() => {
    if (watchPath) setSelectedPath(watchPath);
  }, [watchPath]);

  useEffect(() => {
    if (watchCategory) {
      setSelectedCategory(watchCategory);
      // Reset service when category changes
      setValue('service_name', '');
      setSelectedService('');
    }
  }, [watchCategory, setValue]);

  useEffect(() => {
    if (watchPackage) setSelectedPackage(watchPackage);
  }, [watchPackage]);

  const totalSteps = 6;
  const isAIPath = selectedPath === 'ai_automation_custom';

  // Get available categories based on path
  const getAvailableCategories = () => {
    if (selectedPath === 'start_from_scratch') {
      return ['website_web_app_development', 'content_branding_creative'];
    }
    if (selectedPath === 'scale_existing') {
      return ['website_growth_marketing', 'automation_crm_ai_systems', 'business_strategy_support'];
    }
    if (selectedPath === 'ai_automation_custom') {
      return ['automation_crm_ai_systems'];
    }
    return Object.keys(SERVICE_CATEGORIES);
  };

  const getServicesForCategory = (categoryId) => {
    return SERVICE_CATEGORIES[categoryId]?.services || [];
  };

  const getAddonsForCategory = (categoryId) => {
    return ADDONS_BY_CATEGORY[categoryId] || [];
  };

  const toggleAddon = (addon) => {
    const current = getValues('addons') || [];
    if (current.includes(addon)) {
      setValue('addons', current.filter(a => a !== addon));
    } else {
      setValue('addons', [...current, addon]);
    }
  };

  const toggleAutomationType = (type) => {
    const current = getValues('automation_type') || [];
    if (current.includes(type)) {
      setValue('automation_type', current.filter(t => t !== type));
    } else {
      setValue('automation_type', [...current, type]);
    }
  };

  const canProceed = async () => {
    let fieldsToValidate = [];
    
    switch(currentStep) {
      case 1:
        fieldsToValidate = ['path'];
        break;
      case 2:
        if (!isAIPath) {
          fieldsToValidate = ['service_category', 'service_name'];
        } else {
          fieldsToValidate = ['automation_process', 'current_tools', 'automation_type', 'task_frequency', 'time_spent', 'success_definition'];
        }
        break;
      case 3:
        if (!isAIPath) {
          fieldsToValidate = ['package_tier'];
        } else {
          return true; // AI Automation skips package selection
        }
        break;
      case 4:
        return true; // Add-ons are optional
      case 5:
        fieldsToValidate = ['business_name', 'contact_name', 'email', 'phone', 'project_goal', 'timeline'];
        if (selectedPath === 'scale_existing') {
          fieldsToValidate.push('current_website');
        }
        break;
      case 6:
        fieldsToValidate = ['escrow_terms_accepted', 'consent_checkbox'];
        break;
      default:
        return true;
    }

    const result = await trigger(fieldsToValidate);
    return result;
  };

  const nextStep = async () => {
    const valid = await canProceed();
    if (valid) {
      const data = getValues();
      setFormData(data);
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // Build service names
      const categoryName = SERVICE_CATEGORIES[data.service_category]?.name || '';
      const packageName = PACKAGES[data.package_tier]?.name || '';
      const addonNames = data.addons?.join(', ') || 'None';
      
      // Build AI specific fields
      const aiFields = isAIPath ? {
        automation_process: data.automation_process,
        current_tools: data.current_tools,
        information_source: data.information_source || 'Not specified',
        information_destination: data.information_destination || 'Not specified',
        automation_type: data.automation_type?.join(', ') || 'Not specified',
        task_frequency: data.task_frequency,
        time_spent: data.time_spent,
        notification_recipients: data.notification_recipients || 'Not specified',
        success_definition: data.success_definition
      } : {};

      const templateParams = {
        // To
        to_email: 'support@scalelinkalliance.com',
        to_name: 'ScaleLink Alliance Team',
        
        // Client Info
        from_name: data.contact_name,
        from_email: data.email,
        reply_to: data.email,
        phone: data.phone,
        business_name: data.business_name,
        
        // Path & Service Selection
        path: data.path === 'start_from_scratch' ? 'Start From Scratch' :
              data.path === 'scale_existing' ? 'Scale Existing Website' :
              'AI Automation Custom Quote',
        service_category: categoryName,
        service_name: data.service_name || 'AI Automation',
        package_tier: isAIPath ? 'Custom Quote Only' : (packageName || 'Not specified'),
        addons: addonNames,
        
        // Project Details
        current_website: data.current_website || 'Not provided',
        project_goal: data.project_goal,
        timeline: data.timeline,
        budget_range: data.budget_range || 'Not specified',
        additional_notes: data.additional_notes || 'None',
        
        // AI Automation specific fields
        ...aiFields,
        
        // Terms
        escrow_terms_accepted: data.escrow_terms_accepted ? 'Yes' : 'No',
        consent_given: data.consent_checkbox ? 'Yes' : 'No',
        
        // Metadata
        request_date: new Date().toLocaleString(),
        lead_source: 'Service Request Form',
        status: 'New Service Request'
      };

      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      console.log('Service request sent successfully!', result.status, result.text);
      setIsSubmitted(true);
      
      // Reset form after submission
      setTimeout(() => {
        setIsSubmitted(false);
        setCurrentStep(1);
        setSelectedPath('');
        setSelectedCategory('');
        setSelectedService('');
        setSelectedPackage('');
        setSelectedAddons([]);
        setFormData({});
      }, 15000);
      
    } catch (error) {
      console.error('Failed to send service request:', error);
      setErrorMessage(`Error: ${error.text || 'Failed to send request. Please try again or contact support directly.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render step indicator
  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {[1, 2, 3, 4, 5, 6].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold ${
              step <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {step < currentStep ? <FaCheck /> : step}
            </div>
            {step < 6 && (
              <div className={`w-8 h-0.5 ${
                step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <span>Path</span>
        <span>Service</span>
        <span>Package</span>
        <span>Add-ons</span>
        <span>Details</span>
        <span>Review</span>
      </div>
    </div>
  );

  // Step 1: Choose Path
  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900">Choose Your Path</h3>
      <p className="text-gray-600">Select the path that best fits your business needs.</p>
      
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { id: 'start_from_scratch', label: 'Start From Scratch', desc: 'Build a new website or web app from the ground up', color: 'blue' },
          { id: 'scale_existing', label: 'Scale Existing Website', desc: 'Improve and optimize your current website', color: 'green' },
          { id: 'ai_automation_custom', label: 'AI Automation', desc: 'Custom AI workflows for your business', color: 'purple' }
        ].map((option) => (
          <label
            key={option.id}
            className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
              selectedPath === option.id 
                ? `border-${option.color}-600 bg-${option.color}-50 shadow-lg` 
                : 'border-gray-200 hover:border-gray-400'
            }`}
          >
            <input
              type="radio"
              value={option.id}
              {...register('path')}
              className="hidden"
              onChange={(e) => {
                setSelectedPath(e.target.value);
                setValue('path', e.target.value);
                // Reset dependent fields
                setValue('service_category', '');
                setValue('service_name', '');
                setValue('package_tier', '');
                setSelectedCategory('');
                setSelectedService('');
                setSelectedPackage('');
              }}
            />
            <div className="flex items-start space-x-3">
              <div className={`w-5 h-5 mt-0.5 rounded-full border-2 ${
                selectedPath === option.id 
                  ? `border-${option.color}-600 bg-${option.color}-600` 
                  : 'border-gray-300'
              } flex items-center justify-center`}>
                {selectedPath === option.id && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
              <div>
                <h4 className={`font-bold ${
                  selectedPath === option.id ? `text-${option.color}-700` : 'text-gray-900'
                }`}>
                  {option.label}
                </h4>
                <p className="text-sm text-gray-600">{option.desc}</p>
              </div>
            </div>
          </label>
        ))}
      </div>
      {errors.path && <p className="text-sm text-red-600">{errors.path.message}</p>}
    </div>
  );

  // Step 2: Select Service
  const renderStep2 = () => {
    if (isAIPath) {
      return renderAIAutomationForm();
    }

    const availableCategories = getAvailableCategories();
    const services = selectedCategory ? getServicesForCategory(selectedCategory) : [];

    return (
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-gray-900">Select Your Service</h3>
        <p className="text-gray-600">Choose the service category and specific service you need.</p>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Service Category *
          </label>
          <div className="grid md:grid-cols-2 gap-3">
            {availableCategories.map((catId) => {
              const cat = SERVICE_CATEGORIES[catId];
              return (
                <label
                  key={catId}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedCategory === catId 
                      ? 'border-blue-600 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="radio"
                    value={catId}
                    {...register('service_category')}
                    className="hidden"
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setValue('service_category', e.target.value);
                      setValue('service_name', '');
                      setSelectedService('');
                    }}
                  />
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      selectedCategory === catId 
                        ? 'border-blue-600 bg-blue-600' 
                        : 'border-gray-300'
                    } flex items-center justify-center`}>
                      {selectedCategory === catId && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <span className="font-medium text-gray-900">{cat.name}</span>
                  </div>
                </label>
              );
            })}
          </div>
          {errors.service_category && <p className="text-sm text-red-600">{errors.service_category.message}</p>}
        </div>

        {selectedCategory && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Specific Service *
            </label>
            <div className="grid md:grid-cols-2 gap-3">
              {services.map((service) => (
                <label
                  key={service}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedService === service 
                      ? 'border-blue-600 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="radio"
                    value={service}
                    {...register('service_name')}
                    className="hidden"
                    onChange={(e) => {
                      setSelectedService(e.target.value);
                      setValue('service_name', e.target.value);
                    }}
                  />
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      selectedService === service 
                        ? 'border-blue-600 bg-blue-600' 
                        : 'border-gray-300'
                    } flex items-center justify-center`}>
                      {selectedService === service && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <span className="font-medium text-gray-900">{service}</span>
                  </div>
                </label>
              ))}
            </div>
            {errors.service_name && <p className="text-sm text-red-600">{errors.service_name.message}</p>}
          </div>
        )}
      </div>
    );
  };

  // AI Automation specific form
  const renderAIAutomationForm = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900">AI Automation Details</h3>
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
        <p className="text-sm text-purple-800">
          <strong>Custom Quote Only:</strong> Every AI automation project is custom quoted based on your specific workflow, tools, and goals.
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          What process do you want to automate? *
        </label>
        <textarea
          {...register('automation_process')}
          rows={3}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
            errors.automation_process ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Describe the task or process you want to automate..."
        />
        {errors.automation_process && <p className="text-sm text-red-600">{errors.automation_process.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          What tools does your business currently use? *
        </label>
        <input
          {...register('current_tools')}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
            errors.current_tools ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="e.g., CRM, Email platform, Calendar, etc."
        />
        {errors.current_tools && <p className="text-sm text-red-600">{errors.current_tools.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Where does the information start?
          </label>
          <input
            {...register('information_source')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="e.g., Website form, Email, CRM"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Where should the information go?
          </label>
          <input
            {...register('information_destination')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="e.g., CRM, Spreadsheet, Dashboard"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          What type of automation do you need? * (Select all that apply)
        </label>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            'AI chat / chatbot',
            'AI voice automation',
            'AI email workflows',
            'AI reporting dashboards',
            'Workflow automation',
            'AI customer support',
            'AI lead follow-up',
            'AI appointment booking'
          ].map((type) => (
            <label key={type} className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                value={type}
                {...register('automation_type')}
                onChange={() => toggleAutomationType(type)}
                className="h-5 w-5 text-purple-600 rounded"
              />
              <span className="text-gray-700 text-sm">{type}</span>
            </label>
          ))}
        </div>
        {errors.automation_type && <p className="text-sm text-red-600">{errors.automation_type.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            How often does this task happen? *
          </label>
          <select
            {...register('task_frequency')}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
              errors.task_frequency ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Select frequency</option>
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="on-demand">On-demand</option>
          </select>
          {errors.task_frequency && <p className="text-sm text-red-600">{errors.task_frequency.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            How much time does it currently take? *
          </label>
          <input
            {...register('time_spent')}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
              errors.time_spent ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="e.g., 2 hours per week"
          />
          {errors.time_spent && <p className="text-sm text-red-600">{errors.time_spent.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Who should be notified when the automation runs?
        </label>
        <input
          {...register('notification_recipients')}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="e.g., Team email, Slack channel"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          What does success look like? *
        </label>
        <textarea
          {...register('success_definition')}
          rows={2}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
            errors.success_definition ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Describe what a successful automation would achieve..."
        />
        {errors.success_definition && <p className="text-sm text-red-600">{errors.success_definition.message}</p>}
      </div>
    </div>
  );

  // Step 3: Select Package
  const renderStep3 = () => {
    if (isAIPath) {
      // AI Automation skips package selection
      return (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-900">Custom Quote Only</h3>
          <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-8 text-center">
            <div className="inline-block bg-purple-100 text-purple-800 text-sm font-bold px-4 py-1.5 rounded-full mb-4">
              Custom Quote Only
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">AI Automation</h4>
            <p className="text-gray-600 mb-4 max-w-md mx-auto">
              Every AI automation project is custom quoted because the right solution depends on your specific workflow, tools, and goals.
            </p>
            <div className="bg-white rounded-lg p-4 text-left max-w-lg mx-auto">
              <p className="text-sm text-gray-700 font-medium mb-2">What's included in a custom quote:</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Discovery conversation about your current process</li>
                <li>• Recommended automation approach based on your tools</li>
                <li>• Transparent custom pricing before work begins</li>
                <li>• Clear scope of what the automation will and will not do</li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-gray-900">Choose Your Package</h3>
        <p className="text-gray-600">Select the package that best fits your needs.</p>

        <div className="grid md:grid-cols-2 gap-4">
          {Object.values(PACKAGES).map((pkg) => (
            <label
              key={pkg.id}
              className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                selectedPackage === pkg.id 
                  ? 'border-blue-600 bg-blue-50 shadow-lg' 
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <input
                type="radio"
                value={pkg.id}
                {...register('package_tier')}
                className="hidden"
                onChange={(e) => {
                  setSelectedPackage(e.target.value);
                  setValue('package_tier', e.target.value);
                }}
              />
              <div className="flex items-start space-x-3">
                <div className={`w-5 h-5 mt-0.5 rounded-full border-2 ${
                  selectedPackage === pkg.id 
                    ? 'border-blue-600 bg-blue-600' 
                    : 'border-gray-300'
                } flex items-center justify-center`}>
                  {selectedPackage === pkg.id && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <div>
                  <h4 className={`font-bold ${
                    selectedPackage === pkg.id ? 'text-blue-700' : 'text-gray-900'
                  }`}>
                    {pkg.name}
                  </h4>
                  <p className="text-sm text-gray-600">{pkg.label}</p>
                </div>
              </div>
            </label>
          ))}
        </div>
        {errors.package_tier && <p className="text-sm text-red-600">{errors.package_tier.message}</p>}
      </div>
    );
  };

  // Step 4: Add-ons
  const renderStep4 = () => {
    if (isAIPath) {
      return (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-900">Add-on Options</h3>
          <p className="text-gray-600">Select any additional features you'd like for your AI Automation project.</p>
          
          <div className="grid md:grid-cols-2 gap-3">
            {[
              'CRM setup and integration',
              'Custom reporting dashboards',
              'Multi-channel notification routing',
              'Voice or call automation',
              'Ongoing automation maintenance'
            ].map((addon) => (
              <label key={addon} className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  value={addon}
                  {...register('addons')}
                  onChange={() => toggleAddon(addon)}
                  className="h-5 w-5 text-blue-600 rounded"
                />
                <span className="text-gray-700">{addon}</span>
              </label>
            ))}
          </div>
        </div>
      );
    }

    const addons = selectedCategory ? getAddonsForCategory(selectedCategory) : [];

    return (
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-gray-900">Select Add-ons</h3>
        <p className="text-gray-600">Add optional services to enhance your project.</p>
        
        {addons.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-3">
            {addons.map((addon) => (
              <label key={addon} className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  value={addon}
                  {...register('addons')}
                  onChange={() => toggleAddon(addon)}
                  className="h-5 w-5 text-blue-600 rounded"
                />
                <span className="text-gray-700">{addon}</span>
              </label>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No add-ons available for this category.</p>
        )}
      </div>
    );
  };

  // Step 5: Project Details
  const renderStep5 = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900">Project Details</h3>
      <p className="text-gray-600">Provide more information about your business and project.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Business / Organization Name *
          </label>
          <input
            {...register('business_name')}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.business_name ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Your business name"
          />
          {errors.business_name && <p className="text-sm text-red-600">{errors.business_name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Contact Name *
          </label>
          <input
            {...register('contact_name')}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.contact_name ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Your full name"
          />
          {errors.contact_name && <p className="text-sm text-red-600">{errors.contact_name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            {...register('email')}
            type="email"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.email ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="your@email.com"
          />
          {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            {...register('phone')}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.phone ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="(555) 123-4567"
          />
          {errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}
        </div>
      </div>

      {selectedPath === 'scale_existing' && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Current Website URL *
          </label>
          <input
            {...register('current_website')}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.current_website ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="https://yourwebsite.com"
          />
          {errors.current_website && <p className="text-sm text-red-600">{errors.current_website.message}</p>}
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          What are your project goals? *
        </label>
        <textarea
          {...register('project_goal')}
          rows={3}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.project_goal ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Describe what you want to achieve, your objectives, and desired outcomes..."
        />
        {errors.project_goal && <p className="text-sm text-red-600">{errors.project_goal.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Timeline / Urgency *
          </label>
          <select
            {...register('timeline')}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.timeline ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Select timeline</option>
            <option value="urgent">Urgent (within 1 week)</option>
            <option value="soon">Soon (1-2 weeks)</option>
            <option value="flexible">Flexible (1+ month)</option>
          </select>
          {errors.timeline && <p className="text-sm text-red-600">{errors.timeline.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Budget Range (Optional)
          </label>
          <select
            {...register('budget_range')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select budget range</option>
            <option value="under-1k">Under $1,000</option>
            <option value="1k-5k">$1,000 - $5,000</option>
            <option value="5k-10k">$5,000 - $10,000</option>
            <option value="10k-25k">$10,000 - $25,000</option>
            <option value="25k-plus">$25,000+</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Additional Notes (Optional)
        </label>
        <textarea
          {...register('additional_notes')}
          rows={2}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Any other details, ideas, or special instructions..."
        />
      </div>
    </div>
  );

  // Step 6: Review & Submit
  const renderStep6 = () => {
    const formValues = getValues();
    
    return (
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-gray-900">Review & Submit</h3>
        <p className="text-gray-600">Review your selections before submitting.</p>

        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Path</p>
              <p className="font-medium text-gray-900">
                {formValues.path === 'start_from_scratch' ? 'Start From Scratch' :
                 formValues.path === 'scale_existing' ? 'Scale Existing Website' :
                 'AI Automation Custom Quote'}
              </p>
            </div>
            {!isAIPath && (
              <>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Service Category</p>
                  <p className="font-medium text-gray-900">
                    {SERVICE_CATEGORIES[formValues.service_category]?.name || 'Not selected'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Service</p>
                  <p className="font-medium text-gray-900">{formValues.service_name || 'Not selected'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Package</p>
                  <p className="font-medium text-gray-900">
                    {PACKAGES[formValues.package_tier]?.name || 'Not selected'}
                  </p>
                </div>
              </>
            )}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Add-ons</p>
              <p className="font-medium text-gray-900">
                {formValues.addons?.length > 0 ? formValues.addons.join(', ') : 'None selected'}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <p className="text-xs font-semibold text-gray-500 uppercase">Project Details</p>
            <div className="grid md:grid-cols-2 gap-2 mt-1">
              <p className="text-sm"><span className="font-medium">Business:</span> {formValues.business_name}</p>
              <p className="text-sm"><span className="font-medium">Contact:</span> {formValues.contact_name}</p>
              <p className="text-sm"><span className="font-medium">Email:</span> {formValues.email}</p>
              <p className="text-sm"><span className="font-medium">Phone:</span> {formValues.phone}</p>
              {formValues.current_website && (
                <p className="text-sm col-span-2"><span className="font-medium">Website:</span> {formValues.current_website}</p>
              )}
              <p className="text-sm col-span-2"><span className="font-medium">Timeline:</span> {formValues.timeline}</p>
              {formValues.budget_range && (
                <p className="text-sm col-span-2"><span className="font-medium">Budget:</span> {formValues.budget_range}</p>
              )}
              <p className="text-sm col-span-2"><span className="font-medium">Goals:</span> {formValues.project_goal}</p>
              {formValues.additional_notes && (
                <p className="text-sm col-span-2"><span className="font-medium">Notes:</span> {formValues.additional_notes}</p>
              )}
            </div>
          </div>

          {isAIPath && (
            <div className="border-t border-gray-200 pt-4">
              <p className="text-xs font-semibold text-gray-500 uppercase">AI Automation Details</p>
              <div className="grid grid-cols-1 gap-2 mt-1">
                <p className="text-sm"><span className="font-medium">Process:</span> {formValues.automation_process}</p>
                <p className="text-sm"><span className="font-medium">Tools:</span> {formValues.current_tools}</p>
                <p className="text-sm"><span className="font-medium">Type:</span> {formValues.automation_type?.join(', ')}</p>
                <p className="text-sm"><span className="font-medium">Frequency:</span> {formValues.task_frequency}</p>
                <p className="text-sm"><span className="font-medium">Time Spent:</span> {formValues.time_spent}</p>
                <p className="text-sm"><span className="font-medium">Success Definition:</span> {formValues.success_definition}</p>
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 pt-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <FaInfoCircle className="text-yellow-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-yellow-800 font-medium">Escrow & Payment Terms</p>
                  <p className="text-xs text-yellow-700 mt-1">
                    By accepting, you agree that your project may require a deposit, milestone payment, or escrow-based payment before work begins.
                    Funds are secure and released systematically upon successful milestone completion.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('escrow_terms_accepted')}
                  className="h-5 w-5 text-blue-600 rounded mt-0.5"
                />
                <span className="text-sm text-gray-700">
                  I agree to the ScaleLink Alliance Payment & Escrow Terms and understand that my project may require a deposit, milestone payment, or escrow-based payment before work begins. *
                </span>
              </label>
              {errors.escrow_terms_accepted && (
                <p className="text-sm text-red-600">{errors.escrow_terms_accepted.message}</p>
              )}

              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('consent_checkbox')}
                  className="h-5 w-5 text-blue-600 rounded mt-0.5"
                />
                <span className="text-sm text-gray-700">
                  I agree to be contacted by ScaleLink Alliance regarding my service request. *
                </span>
              </label>
              {errors.consent_checkbox && (
                <p className="text-sm text-red-600">{errors.consent_checkbox.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render current step
  const renderStep = () => {
    switch(currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      case 6: return renderStep6();
      default: return null;
    }
  };

  // Success screen
  if (isSubmitted) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Request Submitted!</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Thank you for your interest in ScaleLink Alliance services. Our team will review your request 
          and contact you within 24 hours to discuss your project.
        </p>
        
        <div className="bg-blue-50 rounded-xl p-6 max-w-md mx-auto text-left mb-6">
          <p className="text-sm font-semibold text-gray-900 mb-3">What happens next:</p>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-start">
              <FaCheck className="text-green-500 mt-0.5 mr-2 shrink-0" size={14} />
              <span>We review your service requirements</span>
            </li>
            <li className="flex items-start">
              <FaCheck className="text-green-500 mt-0.5 mr-2 shrink-0" size={14} />
              <span>Schedule a discovery consultation call</span>
            </li>
            <li className="flex items-start">
              <FaCheck className="text-green-500 mt-0.5 mr-2 shrink-0" size={14} />
              <span>Provide a customized proposal and quote</span>
            </li>
            <li className="flex items-start">
              <FaCheck className="text-green-500 mt-0.5 mr-2 shrink-0" size={14} />
              <span>Begin project onboarding and execution</span>
            </li>
          </ul>
        </div>
        
        <button
          onClick={() => {
            setIsSubmitted(false);
            setCurrentStep(1);
            setSelectedPath('');
            setSelectedCategory('');
            setSelectedService('');
            setSelectedPackage('');
            setSelectedAddons([]);
          }}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <strong>Error:</strong> {errorMessage}
          <p className="text-sm mt-1">Please try again or contact support directly at support@scalelinkalliance.com</p>
        </div>
      )}

      {renderStepIndicator()}
      
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        {renderStep()}
      </div>

      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={prevStep}
          className={`px-6 py-3 font-semibold rounded-lg transition-colors ${
            currentStep > 1 
              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
          disabled={currentStep === 1}
        >
          <FaArrowLeft className="inline mr-2" />
          Back
        </button>

        {currentStep < totalSteps ? (
          <button
            type="button"
            onClick={nextStep}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Next Step
            <FaArrowRight className="inline ml-2" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center"
          >
            {isSubmitting ? (
              <>
                <FaSpinner className="animate-spin mr-3" />
                Submitting...
              </>
            ) : (
              <>
                <FaCheck className="mr-2" />
                Submit Request
              </>
            )}
          </button>
        )}
      </div>
    </form>
  );
};

export default ServiceRequestForm;