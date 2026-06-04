// src/pages/PaymentSuccessPage.jsx
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheck, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';

const PaymentSuccessPage = () => {
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('');
  const location = useLocation();

  useEffect(() => {
    // Get the payment intent from the URL query params
    const query = new URLSearchParams(location.search);
    const paymentIntent = query.get('payment_intent');
    const paymentIntentClientSecret = query.get('payment_intent_client_secret');
    const redirectStatus = query.get('redirect_status');

    console.log('Payment redirect params:', {
      paymentIntent,
      paymentIntentClientSecret,
      redirectStatus
    });

    if (redirectStatus === 'succeeded') {
      setStatus('success');
      setMessage('Your payment has been processed successfully.');
    } else if (redirectStatus === 'failed') {
      setStatus('failed');
      setMessage('Payment failed. Please try again.');
    } else if (redirectStatus === 'processing') {
      setStatus('processing');
      setMessage('Your payment is still processing.');
    } else {
      // Check if we have a payment intent but no status (might be direct success)
      if (paymentIntent) {
        setStatus('success');
        setMessage('Your payment has been processed successfully.');
      } else {
        setStatus('unknown');
        setMessage('No payment information found.');
      }
    }
  }, [location]);

  if (status === 'processing') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-12 text-center">
            <FaSpinner className="animate-spin text-5xl text-blue-600 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Verifying Payment...
            </h1>
            <p className="text-gray-600">
              Please wait while we confirm your payment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="min-h-screen pt-20 bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaExclamationTriangle className="text-3xl text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Payment Failed
            </h1>
            <p className="text-gray-600 mb-8">
              {message}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/request-service" 
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </Link>
              <Link 
                to="/" 
                className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'unknown') {
    return (
      <div className="min-h-screen pt-20 bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaExclamationTriangle className="text-3xl text-yellow-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Payment Status Unknown
            </h1>
            <p className="text-gray-600 mb-8">
              {message} Please check your email for confirmation or contact support.
            </p>
            <Link 
              to="/" 
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-12 text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheck className="text-3xl text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            Thank you for your payment. Our team will contact you within 24 hours to begin your project.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            A confirmation email has been sent to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/" 
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Return to Home
            </Link>
            <button 
              onClick={() => window.print()} 
              className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Print Receipt
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;