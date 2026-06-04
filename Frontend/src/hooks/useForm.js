// src/hooks/useForm.js
import { useState } from 'react';

export const useForm = (initialValues, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues({
      ...values,
      [name]: type === 'checkbox' ? checked : value,
    });
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const handleSubmit = async (callback) => {
    setIsSubmitting(true);
    
    // Validate form
    const validationErrors = validate ? validate(values) : {};
    setErrors(validationErrors);
    
    // If no errors, submit form
    if (Object.keys(validationErrors).length === 0) {
      try {
        await callback(values);
      } catch (error) {
        console.error('Form submission error:', error);
        setErrors({
          ...errors,
          submit: error.message || 'An error occurred. Please try again.'
        });
      }
    }
    
    setIsSubmitting(false);
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
  };

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetForm,
    setValues,
  };
};