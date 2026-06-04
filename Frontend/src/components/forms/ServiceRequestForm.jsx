// src/components/forms/ServiceRequestForm.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { services } from '../../data/services';
import { FaSpinner } from 'react-icons/fa';
import emailjs from '@emailjs/browser';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone is required'),
  company: yup.string().required('Company name is required'),
  service: yup.string(),
  goal: yup.string().required('Please describe your project goals'),
  timeline: yup.string().required('Timeline is required'),
  budget: yup.string()
});

// EmailJS Configuration - Replace with your actual credentials
const EMAILJS_SERVICE_ID = 'service_z0n4bpa';     // From EmailJS dashboard
const EMAILJS_TEMPLATE_ID = 'template_9ytrhff';   // From EmailJS dashboard  
const EMAILJS_PUBLIC_KEY = 'IRwXMIYIKhUnttcdY';      // From EmailJS account settings

const ServiceRequestForm = () => {
  const [selectedServices, setSelectedServices] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const selectedServiceNames = services
        .filter(s => selectedServices.includes(s.id))
        .map(s => s.name)
        .join(', ');

      const templateParams = {
        to_email: 'support@scalelinkalliance.com',
        to_name: 'ScaleLink Alliance Team',
        from_name: data.name,
        from_email: data.email,
        reply_to: data.email,
        phone: data.phone,
        company: data.company,
        services: selectedServiceNames || 'No specific services selected',
        project_goal: data.goal,
        timeline: data.timeline,
        budget: data.budget || 'Not specified',
        request_date: new Date().toLocaleString(),
      };

      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      console.log('Service request sent successfully!', result.status, result.text);
      setIsSubmitted(true);
      reset();
      setSelectedServices([]);
      
      setTimeout(() => {
        setIsSubmitted(false);
      }, 10000);
      
    } catch (error) {
      console.error('Failed to send service request:', error);
      setErrorMessage(`Error: ${error.text || 'Failed to send request. Check your EmailJS configuration.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleService = (serviceId) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const creativeServices = services.filter(s => s.category === 'Creative & Content');
  const marketingServices = services.filter(s => s.category === 'Marketing & Growth');

  if (isSubmitted) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Request Submitted!</h3>
        <p className="text-gray-600 mb-6">
          Thank you for your interest in ScaleLink Alliance services. Our team will review your request 
          and contact you within 24 hours to discuss your project.
        </p>
        <div className="space-y-3">
          <p className="text-sm text-gray-500">
            <strong>What happens next:</strong>
          </p>
          <ul className="text-sm text-gray-500 space-y-1">
            <li>✓ We'll review your service requirements</li>
            <li>✓ Schedule a consultation call</li>
            <li>✓ Provide a customized proposal</li>
            <li>✓ Begin project onboarding</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <strong>Error:</strong> {errorMessage}
          <p className="text-sm mt-1">Please check your EmailJS configuration or contact support.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            {...register('name')}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.name ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="John Smith"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Company Name *
          </label>
          <input
            {...register('company')}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.company ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Acme Inc"
          />
          {errors.company && <p className="mt-1 text-sm text-red-600">{errors.company.message}</p>}
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
            placeholder="john@example.com"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
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
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
        </div>
      </div>

      {/* Service Selection */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-4">
          Which services are you interested in?
        </label>
        
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Creative & Content</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {creativeServices.map(service => (
                <label key={service.id} className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    value={service.id}
                    checked={selectedServices.includes(service.id)}
                    onChange={() => toggleService(service.id)}
                    className="h-5 w-5 text-blue-600 rounded"
                  />
                  <span className="text-gray-700">{service.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Marketing, Sales & Growth</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {marketingServices.map(service => (
                <label key={service.id} className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    value={service.id}
                    checked={selectedServices.includes(service.id)}
                    onChange={() => toggleService(service.id)}
                    className="h-5 w-5 text-blue-600 rounded"
                  />
                  <span className="text-gray-700">{service.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Project Details */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          What are you trying to achieve? *
        </label>
        <textarea
          {...register('goal')}
          rows={4}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.goal ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Describe your project goals, objectives, and desired outcomes..."
        />
        {errors.goal && <p className="mt-1 text-sm text-red-600">{errors.goal.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          {errors.timeline && <p className="mt-1 text-sm text-red-600">{errors.timeline.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Budget Range (Optional)
          </label>
          <select
            {...register('budget')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select budget range</option>
            <option value="under-1k">Under $1,000</option>
            <option value="1k-5k">$1,000 - $5,000</option>
            <option value="5k-10k">$5,000 - $10,000</option>
            <option value="10k-plus">$10,000+</option>
          </select>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id="consent"
          required
          className="h-4 w-4 text-blue-600 rounded"
        />
        <label htmlFor="consent" className="text-sm text-gray-700">
          I agree to be contacted by ScaleLink Alliance regarding my service request
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 bg-linear-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition-all flex items-center justify-center"
      >
        {isSubmitting ? (
          <>
            <FaSpinner className="animate-spin mr-3" />
            Submitting Request...
          </>
        ) : (
          'Submit Service Request'
        )}
      </button>
    </form>
  );
};

export default ServiceRequestForm;