// src/components/forms/MembershipForm.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { industries } from '../../data/industries';
import { FaSpinner, FaGlobe } from 'react-icons/fa';
import emailjs from '@emailjs/browser';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const schema = yup.object({
  firstName: yup.string().required('First name is required').min(2, 'Minimum 2 characters'),
  lastName: yup.string().required('Last name is required').min(2, 'Minimum 2 characters'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  phoneCountry: yup.string().optional(),
  company: yup.string().required('Company name is required').min(2, 'Minimum 2 characters'),
  title: yup.string().required('Job title is required'),
  industry: yup.string().required('Please select your industry'),
  experience: yup.number()
    .required('Years of experience is required')
    .min(0, 'Cannot be negative')
    .max(50, 'Maximum 50 years'),
  chapterInterest: yup.string().required('Please select chapter interest'),
  referralSource: yup.string(),
  businessDescription: yup.string().required('Please describe your business').min(20, 'Minimum 20 characters'),
  growthGoals: yup.string().required('Please describe your growth goals').min(20, 'Minimum 20 characters'),
  agreeTerms: yup.boolean().oneOf([true], 'You must agree to the terms'),
});

// Your EmailJS credentials
const EMAILJS_SERVICE_ID = 'service_z0n4bpa';
const EMAILJS_TEMPLATE_ID = 'template_uqi8xtz';  
const EMAILJS_PUBLIC_KEY = 'IRwXMIYIKhUnttcdY';

const MembershipForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [phoneValue, setPhoneValue] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    clearErrors
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      experience: 3,
      agreeTerms: false,
    }
  });

  const handlePhoneChange = (value, country) => {
    setPhoneValue(value);
    setValue('phone', value, { shouldValidate: true });
    setValue('phoneCountry', country?.countryCode || 'us');
    clearErrors('phone');
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      const templateParams = {
        to_email: 'support@scalelinkalliance.com',
        to_name: 'ScaleLink Alliance Team',
        from_name: `${data.firstName} ${data.lastName}`,
        from_email: data.email,
        reply_to: data.email,
        phone: data.phone,
        phone_country: data.phoneCountry || 'us',
        company: data.company,
        title: data.title,
        industry: data.industry,
        experience: data.experience,
        chapter_interest: data.chapterInterest,
        referral_source: data.referralSource || 'Not specified',
        business_description: data.businessDescription,
        growth_goals: data.growthGoals,
        application_date: new Date().toLocaleString(),
      };

      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      console.log('SUCCESS!', result.status, result.text);
      setIsSubmitted(true);
      reset();
      setPhoneValue('');
      
      setTimeout(() => {
        setIsSubmitted(false);
      }, 10000);
      
    } catch (error) {
      console.error('FAILED...', error);
      setErrorMessage(`Error: ${error.text || 'Failed to send email. Check your EmailJS configuration.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Application Submitted!</h3>
        <p className="text-gray-600 mb-6">
          Thank you for your interest in ScaleLink Alliance. Our membership team will review your application 
          and contact you within 24 hours to schedule your orientation call.
        </p>
        <div className="space-y-3">
          <p className="text-sm text-gray-500">
            <strong>Next Steps:</strong>
          </p>
          <ul className="text-sm text-gray-500 space-y-1">
            <li>✓ We'll verify industry availability in your preferred chapter</li>
            <li>✓ Schedule a chapter visit if there's an opening</li>
            <li>✓ Complete orientation and onboarding</li>
            <li>✓ Start attending weekly meetings</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Inline styles to fix PhoneInput dropdown overlap */}
      <style>{`
        .phone-input-container .react-tel-input .flag-dropdown {
          background-color: #f9fafb;
          border-right: 1px solid #d1d5db;
          border-radius: 8px 0 0 8px;
        }
        .phone-input-container .react-tel-input .flag-dropdown.open {
          z-index: 50;
        }
        .phone-input-container .react-tel-input .selected-flag {
          padding: 0 10px;
          width: 52px;
        }
        .phone-input-container .react-tel-input .form-control {
          width: 100% !important;
          padding-left: 58px !important;
          padding-right: 16px !important;
          padding-top: 12px !important;
          padding-bottom: 12px !important;
          border-radius: 8px !important;
          font-size: 14px !important;
          height: auto !important;
          line-height: 1.5 !important;
        }
        .phone-input-container .react-tel-input .country-list {
          z-index: 100;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
          max-height: 200px;
        }
      `}</style>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <strong>Error:</strong> {errorMessage}
          <p className="text-sm mt-1">Please check your EmailJS configuration or contact support.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            First Name *
          </label>
          <input
            {...register('firstName')}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.firstName ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="John"
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Last Name *
          </label>
          <input
            {...register('lastName')}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.lastName ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Smith"
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
          )}
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
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <div className="flex items-center">
              <FaGlobe className="mr-2 text-blue-600" />
              Phone Number *
            </div>
          </label>
          {/* phone-input-container class is targeted by the inline <style> above */}
          <div className={`phone-input-container ${errors.phone ? 'phone-input-error' : ''}`}>
            <PhoneInput
              country={'us'}
              value={phoneValue}
              onChange={handlePhoneChange}
              inputProps={{
                name: 'phone',
                id: 'phone',
                required: true,
              }}
              containerStyle={{ width: '100%' }}
              inputStyle={{
                width: '100%',
                paddingLeft: '58px',
                paddingTop: '12px',
                paddingBottom: '12px',
                borderRadius: '8px',
                border: errors.phone ? '1px solid #fca5a5' : '1px solid #d1d5db',
                fontSize: '14px',
                height: 'auto',
                lineHeight: '1.5',
              }}
              buttonStyle={{
                borderRadius: '8px 0 0 8px',
                border: errors.phone ? '1px solid #fca5a5' : '1px solid #d1d5db',
                borderRight: 'none',
                backgroundColor: '#f9fafb',
                width: '52px',
              }}
              dropdownStyle={{
                zIndex: 100,
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                maxHeight: '200px',
              }}
              searchClass="!mb-2"
              searchPlaceholder="Search country..."
              enableSearch={true}
              disableSearchIcon={false}
              countryCodeEditable={false}
              preferredCountries={['us', 'gb', 'ca', 'au', 'in', 'de', 'fr', 'jp', 'br', 'mx']}
              placeholder="Enter phone number"
              masks={{
                us: '(...) ...-....',
                gb: '.... ......',
                ca: '(...) ...-....',
                au: '... ... ...',
                in: '.....-.....',
                de: '... ........',
                fr: '. .. .. .. ..',
                jp: '.. .... ....',
                br: '(...) .........',
                mx: '... ... ....'
              }}
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Select your country code from the dropdown
          </p>
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
          {errors.company && (
            <p className="mt-1 text-sm text-red-600">{errors.company.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Job Title *
          </label>
          <input
            {...register('title')}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.title ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="CEO / Founder"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Industry / Profession *
          </label>
          <select
            {...register('industry')}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.industry ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Select Industry</option>
            {industries.map((industry) => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>
          {errors.industry && (
            <p className="mt-1 text-sm text-red-600">{errors.industry.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Years in Business/Profession *
          </label>
          <input
            {...register('experience')}
            type="number"
            min="0"
            max="50"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.experience ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="3"
          />
          {errors.experience && (
            <p className="mt-1 text-sm text-red-600">{errors.experience.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Preferred Chapter *
          </label>
          <select
            {...register('chapterInterest')}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.chapterInterest ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Select Preference</option>
            <option value="local">Local chapter only</option>
            <option value="flexible">Flexible (multiple locations)</option>
            <option value="virtual">Virtual chapter preferred</option>
            <option value="any">Any available chapter</option>
          </select>
          {errors.chapterInterest && (
            <p className="mt-1 text-sm text-red-600">{errors.chapterInterest.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            How did you hear about us?
          </label>
          <select
            {...register('referralSource')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select option</option>
            <option value="search">Search engine</option>
            <option value="social">Social media</option>
            <option value="referral">Member referral</option>
            <option value="event">Business event</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Describe your business / services *
        </label>
        <textarea
          {...register('businessDescription')}
          rows={3}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.businessDescription ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Briefly describe what your business does, who you serve, and your primary services..."
        />
        {errors.businessDescription && (
          <p className="mt-1 text-sm text-red-600">{errors.businessDescription.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          What are your primary business growth goals? *
        </label>
        <textarea
          {...register('growthGoals')}
          rows={3}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.growthGoals ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="What do you hope to achieve through ScaleLink Alliance membership?"
        />
        {errors.growthGoals && (
          <p className="mt-1 text-sm text-red-600">{errors.growthGoals.message}</p>
        )}
      </div>

      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          id="agreeTerms"
          {...register('agreeTerms')}
          className={`mt-1 h-4 w-4 rounded focus:ring-2 focus:ring-blue-500 ${
            errors.agreeTerms ? 'border-red-300' : 'border-gray-300'
          }`}
        />
        <label htmlFor="agreeTerms" className="text-sm text-gray-700">
          I agree to be contacted by ScaleLink Alliance regarding my membership application. 
          I understand that membership is subject to approval based on industry availability 
          and chapter fit. *
        </label>
      </div>
      {errors.agreeTerms && (
        <p className="text-sm text-red-600">{errors.agreeTerms.message}</p>
      )}

      <div className="pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-linear-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <FaSpinner className="animate-spin mr-3" />
              Submitting Application...
            </>
          ) : (
            'Submit Membership Application'
          )}
        </button>
        
        <p className="mt-3 text-sm text-gray-500 text-center">
          We'll contact you within 24 hours to schedule your orientation call.
        </p>
      </div>
    </form>
  );
};

export default MembershipForm;