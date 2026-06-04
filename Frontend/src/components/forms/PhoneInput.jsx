import React, { useState, useEffect, useRef } from 'react';
import { FaChevronDown, FaSearch } from 'react-icons/fa';
import { COUNTRIES } from '../../utils/formConstants';

const PhoneInput = ({ value, dialCode, onNumberChange, onDialChange, py = 'py-2.5' }) => {
  const [open, setOpen]     = useState(false);
  const [search, setSearch] = useState('');
  const ref                 = useRef(null);
  const selected            = COUNTRIES.find(c => c.dial === dialCode) || COUNTRIES[0];

  const filtered = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.dial.includes(search)
  );

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setSearch(''); } };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative flex w-full" ref={ref}>
      {/* Dial code button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1 px-3 ${py} border border-r-0 border-slate-200 rounded-l-xl bg-slate-50 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[88px]`}
      >
        <span className="text-lg leading-none">{selected.flag}</span>
        <span className="text-sm font-medium text-slate-700">{selected.dial}</span>
        <FaChevronDown className={`text-slate-400 text-xs transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Number input */}
      <input
        type="tel"
        value={value}
        onChange={e => onNumberChange(e.target.value.replace(/[^\d\s\-()+]/g, ''))}
        className={`flex-1 min-w-0 px-4 ${py} border border-slate-200 rounded-r-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-sm`}
        placeholder="800 000 0000"
      />

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 mt-1 w-72 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
              <input
                autoFocus
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search country..."
                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <ul className="max-h-52 overflow-y-auto">
            {filtered.length > 0 ? filtered.map(c => (
              <li key={c.code}>
                <button
                  type="button"
                  onClick={() => { onDialChange(c.dial); setOpen(false); setSearch(''); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-blue-50 transition-colors text-left ${
                    selected.code === c.code ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                  }`}
                >
                  <span className="text-base">{c.flag}</span>
                  <span className="flex-1">{c.name}</span>
                  <span className="text-gray-400 text-xs font-mono">{c.dial}</span>
                </button>
              </li>
            )) : (
              <li className="px-4 py-3 text-sm text-gray-500 text-center">No results</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PhoneInput;
