// Language Selector Component
// Allows manual language selection (Tamil/English)

import { languageNames } from '../utils/languageDetector.js';

export function LanguageSelector({ currentLanguage, onLanguageChange }) {
  return (
    <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-xl p-2 shadow-sm border border-blue-100">
      <span className="text-sm font-medium text-gray-600 px-2">Language:</span>
      <div className="flex gap-1">
        <button
          onClick={() => onLanguageChange('english')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            currentLanguage === 'english'
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-blue-50'
          }`}
        >
          English
        </button>
        <button
          onClick={() => onLanguageChange('tamil')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            currentLanguage === 'tamil'
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-blue-50'
          }`}
        >
          தமிழ்
        </button>
      </div>
      <span className="text-xs text-gray-500 px-2">
        {languageNames[currentLanguage]}
      </span>
    </div>
  );
}

export default LanguageSelector;
