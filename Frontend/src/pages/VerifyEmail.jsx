import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { FaCheckCircle, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Missing verification token.');
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(`/api/cms/verify-email/${token}`);
        const data = await res.json();
        if (res.ok) {
          setStatus('success');
          setMessage(data.message);
        } else {
          setStatus('error');
          setMessage(data.error);
        }
      } catch (err) {
        setStatus('error');
        setMessage('A connection error occurred.');
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-10 text-center border border-slate-100">
        <div className="mb-8 flex justify-center">
          <img src="/scalelink-logo.png" alt="ScaleLink Alliance" className="h-12 w-auto" />
        </div>

        {status === 'loading' && (
          <div className="space-y-4">
            <FaSpinner className="mx-auto text-blue-500 animate-spin" size={48} />
            <h1 className="text-2xl font-bold text-slate-800">Verifying Email...</h1>
            <p className="text-slate-500 text-sm">Please wait while we validate your account invitation.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto border border-green-100">
              <FaCheckCircle className="text-green-500" size={40} />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Email Verified!</h1>
            <p className="text-slate-600 text-sm leading-relaxed">{message}</p>
            <Link
              to="/hub/login"
              className="block w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
            >
              Go to Login
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto border border-red-100">
              <FaExclamationTriangle className="text-red-500" size={40} />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Verification Failed</h1>
            <p className="text-slate-600 text-sm leading-relaxed">{message}</p>
            <div className="space-y-3">
              <Link
                to="/contact"
                className="block w-full py-4 bg-slate-800 text-white rounded-2xl font-bold text-sm hover:bg-slate-900 transition-all"
              >
                Contact Support
              </Link>
              <Link
                to="/"
                className="block text-sm font-bold text-blue-600 hover:underline"
              >
                Back to Homepage
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
