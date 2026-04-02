import React from 'react';

export function LanguageToggle({ currentLanguage, onLanguageChange }) {
  const languages = [
    { code: 'auto', label: 'Auto' },
    { code: 'en', label: 'EN' },
    { code: 'hi', label: 'HI' },
    { code: 'ta', label: 'TA' },
    { code: 'te', label: 'TE' },
    { code: 'ml', label: 'ML' },
    { code: 'kn', label: 'KN' },
    { code: 'fr', label: 'FR' },
    { code: 'ar', label: 'AR' }
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
      {languages.map((lang) => {
        const isActive = currentLanguage === lang.code;
        return (
          <button
            key={lang.code}
            onClick={() => onLanguageChange(lang.code)}
            className={`
              flex flex-shrink-0 items-center justify-center rounded-full px-4 py-1.5 text-xs font-medium transition-all
              ${isActive 
                ? 'bg-[#1e283b] text-emerald-400 border border-emerald-500/50 shadow-sm shadow-emerald-500/20' 
                : 'bg-[#13161f] text-gray-400 border border-[#212530] hover:bg-[#1e2634] hover:text-gray-300'
              }
            `}
          >
            {isActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2 animate-pulse"></span>
            )}
            {!isActive && lang.code !== 'auto' && (
              <span className="w-1 h-1 rounded-full bg-orange-400 mr-1.5 opacity-50"></span>
            )}
            {lang.label}
          </button>
        );
      })}
    </div>
  );
}

