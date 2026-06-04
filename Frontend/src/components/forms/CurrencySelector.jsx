import React, { useState, useEffect, useRef } from 'react';
import { FaGlobeAmericas, FaChevronDown } from 'react-icons/fa';
import { CURRENCIES } from '../../utils/formConstants';

const CurrencySelector = ({ selectedCurrency, onCurrencyChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = CURRENCIES.find(c => c.code === selectedCurrency) || CURRENCIES[0];

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white border-2 border-blue-200 rounded-xl hover:border-blue-400 transition-all shadow-sm"
      >
        <div className="flex items-center gap-3">
          <FaGlobeAmericas className="text-blue-500" />
          <div className="text-left">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Payment Currency</p>
            <p className="text-sm font-bold text-gray-900">{selected.name} ({selected.code.toUpperCase()})</p>
          </div>
        </div>
        <FaChevronDown className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden animate-fadeIn">
          <ul className="max-h-64 overflow-y-auto">
            {CURRENCIES.map(c => (
              <li key={c.code}>
                <button
                  type="button"
                  onClick={() => { onCurrencyChange(c.code); setOpen(false); }}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-blue-50 transition-colors ${
                    selected.code === c.code ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-700'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-bold">{c.name}</span>
                    <span className="text-xs text-gray-400 uppercase">{c.code}</span>
                  </div>
                  <span className="text-lg font-mono text-gray-400">{c.symbol}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CurrencySelector;
