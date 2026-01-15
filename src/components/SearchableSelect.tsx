'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './SearchableSelect.module.css';

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
}

export default function SearchableSelect({
  id,
  name,
  value,
  onChange,
  options,
  placeholder = 'اختر من القائمة',
  label,
  required = false,
  disabled = false,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div ref={dropdownRef} className="relative w-full">
      {label && (
        <label htmlFor={id} className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Selected Value Display */}
      <button
        type="button"
        id={id}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full px-3 sm:px-4 py-2 sm:py-2.5 text-right bg-[#FAFAFA] border border-[#E9EAEB] 
          rounded-lg shadow-sm transition-all duration-200
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-400 cursor-pointer'}
          ${isOpen ? 'border-blue-500 ring-2 ring-blue-200' : ''}
        `}
        style={{
          fontFamily: 'Noto Kufi Arabic',
          fontSize: '14px',
          fontWeight: 400,
          lineHeight: '22px',
        }}
      >
        <div className="flex items-center justify-between">
          <span className={selectedOption ? 'text-gray-900 text-sm sm:text-base' : 'text-[#A4A7AE] text-sm sm:text-base'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <svg
            className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 sm:max-h-80 overflow-hidden">
          {/* Search Input */}
          <div className="p-2 sm:p-3 border-b border-gray-200 bg-gray-50">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث..."
                className="w-full px-3 sm:px-4 py-1.5 sm:py-2 pr-8 sm:pr-10 text-right bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                style={{
                  fontFamily: 'Noto Kufi Arabic',
                  fontSize: '14px',
                }}
                autoFocus
              />
              <svg
                className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Options List */}
          <div className={`max-h-48 sm:max-h-60 overflow-y-auto ${styles['dropdown-list'] || ''}`}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`
                    w-full px-3 sm:px-4 py-2.5 sm:py-3 text-right hover:bg-blue-50 transition-colors duration-150
                    ${value === option.value ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700'}
                  `}
                  style={{
                    fontFamily: 'Noto Kufi Arabic',
                    fontSize: '13px',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{option.label}</span>
                    {value === option.value && (
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </button>
              ))
            ) : (
              <div className="px-3 sm:px-4 py-6 sm:py-8 text-center text-gray-500">
                <svg
                  className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p style={{ fontFamily: 'Noto Kufi Arabic', fontSize: '13px' }}>
                  لا توجد نتائج
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hidden input for form submission */}
      <input type="hidden" name={name} value={value} />
    </div>
  );
}
