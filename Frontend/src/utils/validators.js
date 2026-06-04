// src/utils/validators.js
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^[\+]?[1-9][\d]{0,15}$/;
  return re.test(phone.replace(/[\s\-\(\)]/g, ''));
};

export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

export const validateMinLength = (value, min) => {
  return value && value.length >= min;
};

export const validateMaxLength = (value, max) => {
  return value && value.length <= max;
};

export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/;
  return re.test(password);
};

export const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Form validation schemas
export const membershipFormSchema = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 100
  },
  email: {
    required: true,
    validate: validateEmail
  },
  phone: {
    required: true,
    validate: validatePhone
  },
  company: {
    required: true,
    minLength: 2,
    maxLength: 100
  },
  industry: {
    required: true
  },
  experience: {
    required: true,
    min: 0
  }
};

export const contactFormSchema = {
  name: {
    required: true,
    minLength: 2
  },
  email: {
    required: true,
    validate: validateEmail
  },
  message: {
    required: true,
    minLength: 10,
    maxLength: 2000
  }
};