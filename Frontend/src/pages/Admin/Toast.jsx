import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const icons = {
  success: { color: 'text-green-500', bg: 'bg-green-50 border-green-200' },
  error:   { color: 'text-red-500',   bg: 'bg-red-50 border-red-200'     },
  info:    { color: 'text-blue-500',  bg: 'bg-blue-50 border-blue-200'   },
};

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  const style = icons[type] || icons.info;

  return (
    <div
      className={`fixed bottom-6 right-6 z-[100] flex items-center space-x-3 px-4 py-3 rounded-xl border shadow-lg text-sm font-medium ${style.bg} animate-slide-in`}
      style={{ fontFamily: "'Inter', sans-serif", minWidth: '260px' }}
    >
      <div className={`flex-shrink-0 ${style.color}`}>
        {type === 'success' && <FaCheckCircle size={18} />}
        {type === 'error'   && <FaExclamationCircle size={18} />}
        {type === 'info'    && <FaInfoCircle size={18} />}
      </div>
      <p className="flex-1 text-slate-700">{message}</p>
      <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
        <FaTimes size={16} />
      </button>
    </div>
  );
};

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  const ToastContainer = () => (
    <div className="fixed bottom-6 right-6 z-[100] space-y-2">
      {toasts.map(t => (
        <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
      ))}
    </div>
  );

  return { showToast, ToastContainer };
};

export default Toast;
