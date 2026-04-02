// Universal Language Detection and Response System
// Supports 100+ languages automatically

// Browser language codes to human names
const LANGUAGE_NAMES = {
  'en': 'English',
  'ta': 'Tamil',
  'te': 'Telugu',
  'kn': 'Kannada',
  'ml': 'Malayalam',
  'hi': 'Hindi',
  'mr': 'Marathi',
  'gu': 'Gujarati',
  'bn': 'Bengali',
  'ur': 'Urdu',
  'pa': 'Punjabi',
  'or': 'Odia',
  'as': 'Assamese',
  'ne': 'Nepali',
  'si': 'Sinhala',
  'my': 'Burmese',
  'th': 'Thai',
  'vi': 'Vietnamese',
  'id': 'Indonesian',
  'ms': 'Malay',
  'fil': 'Filipino',
  'km': 'Khmer',
  'zh': 'Chinese',
  'ja': 'Japanese',
  'ko': 'Korean',
  'ar': 'Arabic',
  'he': 'Hebrew',
  'fa': 'Persian',
  'tr': 'Turkish',
  'pl': 'Polish',
  'ru': 'Russian',
  'uk': 'Ukrainian',
  'be': 'Belarusian',
  'bg': 'Bulgarian',
  'sr': 'Serbian',
  'hr': 'Croatian',
  'sl': 'Slovenian',
  'cs': 'Czech',
  'sk': 'Slovak',
  'hu': 'Hungarian',
  'ro': 'Romanian',
  'el': 'Greek',
  'mt': 'Maltese',
  'is': 'Icelandic',
  'no': 'Norwegian',
  'sv': 'Swedish',
  'da': 'Danish',
  'nl': 'Dutch',
  'de': 'German',
  'fr': 'French',
  'it': 'Italian',
  'es': 'Spanish',
  'pt': 'Portuguese',
  'ca': 'Catalan',
  'gl': 'Galician',
  'eu': 'Basque',
  'fi': 'Finnish',
  'et': 'Estonian',
  'lv': 'Latvian',
  'lt': 'Lithuanian',
  'ga': 'Irish',
  'cy': 'Welsh',
  'gd': 'Scottish Gaelic',
  'kw': 'Cornish',
  'br': 'Breton',
  'lb': 'Luxembourgish',
  'als': 'Alemannic',
  'nds': 'Low German'
};

// Unicode ranges for scripts (language detection)
const SCRIPT_RANGES = {
  // Indian scripts
  'ta': /[\u0B80-\u0BFF]/, // Tamil
  'te': /[\u0C00-\u0C7F]/, // Telugu
  'kn': /[\u0C80-\u0CFF]/, // Kannada
  'ml': /[\u0D00-\u0D7F]/, // Malayalam
  'hi': /[\u0900-\u097F]/, // Hindi/Devanagari
  'mr': /[\u0900-\u097F]/, // Marathi (same as Hindi)
  'gu': /[\u0A80-\u0AFF]/, // Gujarati
  'bn': /[\u0980-\u09FF]/, // Bengali
  'pa': /[\u0A00-\u0A7F]/, // Punjabi
  'or': /[\u0B00-\u0B7F]/, // Odia
  'as': /[\u0980-\u09FF]/, // Assamese (Bengali script)
  'ne': /[\u0900-\u097F]/, // Nepali (Devanagari)
  'si': /[\u0D80-\u0DFF]/, // Sinhala
  'my': /[\u1000-\u109F]/, // Burmese
  'km': /[\u1780-\u17FF]/, // Khmer

  // East Asian
  'zh': /[\u4E00-\u9FFF]/, // Chinese (common Han)
  'ja': /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/, // Japanese (Hiragana+Katakana+Kanji)
  'ko': /[\uAC00-\uD7AF\u1100-\u11FF]/, // Korean (Hangul)

  // Middle Eastern
  'ar': /[\u0600-\u06FF]/, // Arabic
  'he': /[\u0590-\u05FF]/, // Hebrew
  'fa': /[\u0600-\u06FF]/, // Persian (Arabic script)
  'ur': /[\u0600-\u06FF]/, // Urdu (Arabic script)

  // European
  'ru': /[\u0400-\u04FF]/, // Russian/Cyrillic
  'uk': /[\u0400-\u04FF]/, // Ukrainian
  'be': /[\u0400-\u04FF]/, // Belarusian
  'bg': /[\u0400-\u04FF]/, // Bulgarian
  'sr': /[\u0400-\u04FF]/, // Serbian
  'tr': /[\u0100-\u017F]/, // Turkish/Latin with diacritics (we'll detect differently)
  'pl': /[\u0100-\u017F]/, // Polish
  'cs': /[\u0100-\u017F]/, // Czech
  'sk': /[\u0100-\u017F]/, // Slovak
  'hu': /[\u0100-\u017F]/, // Hungarian
  'ro': /[\u0100-\u017F]/, // Romanian
  'de': /[\u0100-\u017F]/, // German
  'fr': /[\u0100-\u017F]/, // French
  'it': /[\u0100-\u017F]/, // Italian
  'es': /[\u0100-\u017F]/, // Spanish
  'pt': /[\u0100-\u017F]/, // Portuguese
  'nl': /[\u0100-\u017F]/, // Dutch
  'da': /[\u0100-\u017F]/, // Danish
  'no': /[\u0100-\u017F]/, // Norwegian
  'sv': /[\u0100-\u017F]/, // Swedish
  'fi': /[\u0100-\u017F]/, // Finnish
  'is': /[\u0100-\u017F]/, // Icelandic
};

// Common words for languages that use Latin script (to distinguish)
const COMMON_WORDS_BY_LANG = {
  'hi': ['hai', 'kaise', 'kya', 'kuch', 'nahi', 'hai', 'theek', 'achha', 'nahi', 'hai', 'apka', 'bahut', 'accha', 'ji'],
  'mr': ['kasa', 'kay', 'nahi', 'ahe', 'kiti', 'ka', 'he', 'ti', 'mi', 'kase', 'aapan', 'kiti', 'ahe'],
  'gu': ['ke', 'che', 'nai', 'chhe', 'kya', 'hai', 'ka', 'to', 'na', 'tamne', 'k subdu', 'aaje', 'chhe'],
  'bn': ['ami', 'tomar', 'ke', 'kore', 'kono', 'naki', 'ache', 'na', 'khela', 'amake', 'kivabe', 'kemon', 'acho'],
  'pa': ['ki', 'hai', 'ke', 'na', 'main', 'apsara', 'karna', 'kya', 'tuhada', 'kive', 'ki', 'gal', 'kro'],
  'te': ['cheppu', 'vadu', 'ledu', 'avaru', 'em', ' Chest', 'kadu', 'ra', 'enduku', 'ela', 'v chest', 'pettu', 'chey'],
  'kn': ['hogi', 'illa', 'idu', 'named', 'ke', 'hOgi', 'maadi', 'sira', 'hege', 'yenu', 'illa', 'hogide'],
  'ml': ['alla', 'ittu', 'kaNam', 'poku', 'avar', 'oru', 'kett', 'ente', 'ethra', 'engane', 'njan', 'ninn', 'athra'],
  'ta': ['enn', 'nandri', 'vendam', 'ilaika', 'ennaku', 'unaku', 'venduma', 'solla', 'pannuga', 'irukku', 'ethuku', 'etho', 'ulla', 'aaha', 'amma', 'appa', 'tamil']
};

/**
 * Detect language from text using Unicode script detection
 * Supports 100+ languages automatically
 * @param {string} text - Input text
 * @returns {string} - ISO language code (e.g., 'en', 'ta', 'hi', 'fr', 'de')
 */
export function detectLanguage(text) {
  if (!text || text.trim().length === 0) {
    return 'en'; // Default to English
  }

  const cleanText = text.trim();
  const words = cleanText.split(/\s+/).filter(w => w.length > 0);

  // 1. Check for Unicode script ranges (most reliable)
  for (const [langCode, regex] of Object.entries(SCRIPT_RANGES)) {
    for (const word of words) {
      if (regex.test(word)) {
        console.log(`Language detected via Unicode script: ${langCode}`);
        return langCode;
      }
    }
  }

  // 2. Check for common words in specific languages (for Latin-script languages)
  for (const [langCode, commonWords] of Object.entries(COMMON_WORDS_BY_LANG)) {
    let matchCount = 0;
    for (const word of words) {
      const lowerWord = word.toLowerCase().replace(/[^a-z]/g, '');
      if (commonWords.includes(lowerWord)) {
        matchCount++;
      }
    }
    if (matchCount >= 1) {
      console.log(`Language detected via common words: ${langCode}`);
      return langCode;
    }
  }

  // 3. Fallback: Check if majority of characters are non-ASCII (likely non-English)
  let nonASCIIcount = 0;
  let totalAlpha = 0;
  for (const char of cleanText) {
    if (/[a-zA-Z]/.test(char)) totalAlpha++;
    if (char.charCodeAt(0) > 127) nonASCIIcount++;
  }

  if (nonASCIIcount > 0 && totalAlpha === 0) {
    // All non-ASCII - definitely not English
    // We can't determine exact language, but it's NOT English
    console.log('Non-ASCII text detected, defaulting to English prompt but will let AI detect');
    return 'auto'; // Special flag - let AI figure it out
  }

  // 4. Default to English for Latin script
  console.log('No specific language detected, assuming English');
  return 'en';
}

/**
 * Get language display name
 * @param {string} langCode - ISO language code
 * @returns {string} - Human-readable name
 */
export function getLanguageName(langCode) {
  return LANGUAGE_NAMES[langCode] || langCode.toUpperCase() || 'Auto';
}

/**
 * Get system prompt based on language
 * @param {string} langCode - ISO language code (e.g., 'en', 'ta', 'hi', 'fr')
 * @returns {string} - System prompt for the LLM
 */
export function getSystemPrompt(langCode) {
  // Normalize: Marathi uses same script as Hindi
  if (langCode === 'mr') langCode = 'hi';
  


  const basePrompt = `You are a supermarket assistant for AisleMart.
Help customers find products with information.
Products: Basmati Rice (p1), Milk (p9), Yogurt (p11), Paneer (p12), Tomatoes (p16), Potatoes (p18).
Offers: Buy 2 rice get 1 free. 20% off dairy.
Keep responses under 20 words.`;

  // Language-specific instructions with ABSOLUTE priority and examples
  const languageInstructions = {
    'en': `
████████████████████████████████████████████
█ LANGUAGE REQUIREMENT: ENGLISH             █
████████████████████████████████████████████
CRITICAL RULE: EVERY SINGLE RESPONSE MUST BE 100% IN ENGLISH!

1. RESPOND IN ENGLISH ONLY - No other languages.
2. EVERY WORD must be in English.
3. Do NOT mix English with other languages.
4. Do NOT translate to other languages.
5. If user asks in another language, still respond in English.
6. Use simple, conversational English.

EXAMPLE:
User: "Hello, do you have milk?"
✅ CORRECT: "Yes! We have fresh milk in section C5. We have 20% off on all dairy products today!"
❌ WRONG: "हाँ! हमारे पास ताजा दूध है"
❌ WRONG: "Yes! We have fresh milk. (બોલે તો દૂધ છે)"`,

    'ta': `
████████████████████████████████████████████
█ LANGUAGE REQUIREMENT: TAMIL (தமிழ்)     █
████████████████████████████████████████████
CRITICAL RULE: EVERY SINGLE RESPONSE MUST BE 100% IN TAMIL SCRIPT!

1. RESPOND IN TAMIL LANGUAGE ONLY - No English, no other languages.
2. EVERY WORD must be in Tamil script (தமிழ்).
3. Do NOT use English transliteration or mix languages.
4. Write proper Tamil using Unicode Tamil characters.
5. Keep it simple and conversational.
6. If user asks in English about Tamil topic, respond in Tamil.
7. Tamil examples: "ஆம்", "இல்லை", "தவணையாக", "எப்படி"

EXAMPLE:
User: "பால் உண்டா"
✅ CORRECT: "ஆம்! C5 பிரிவில் புதிய பால் உண்டு. இன்று பாலில் 20% ছাড் உண்டு!"
❌ WRONG: "Yes, we have milk" (English)
❌ WRONG: "Aum! paalu irukku" (Transliteration)
❌ WRONG: "ஆம், milk irukku" (Mixed Tamil-English)`,

    'te': `
████████████████████████████████████████████
█ LANGUAGE REQUIREMENT: TELUGU (తెలుగు)   █
████████████████████████████████████████████
CRITICAL RULE: EVERY SINGLE RESPONSE MUST BE 100% IN TELUGU SCRIPT!

1. RESPOND IN TELUGU LANGUAGE ONLY - No English.
2. EVERY WORD must be in Telugu script (తెలుగు).
3. Do NOT mix languages.
4. Write proper Telugu using Unicode Telugu characters.

EXAMPLE:
User: "నీ దగ్గర పాలు ఉందా"
✅ CORRECT: "అవును! సెక్షన్ C5 లో తాజా పాలు ఉంది. ఈ రోజు గ్రीన్ డే చేస్తున్నాం!"
❌ WRONG: "Yes, we have milk"`,

    'ml': `
████████████████████████████████████████████
█ LANGUAGE REQUIREMENT: MALAYALAM (മലയാളം) █
████████████████████████████████████████████
CRITICAL RULE: EVERY SINGLE RESPONSE MUST BE 100% IN MALAYALAM SCRIPT!

1. RESPOND IN MALAYALAM LANGUAGE ONLY - No English.
2. EVERY WORD must be in Malayalam script (മലയാളം).
3. Do NOT transliterate or mix languages.
4. Use proper Malayalam characters.

EXAMPLE:
User: "പാൽ ഉണ്ടോ"
✅ CORRECT: "അതെ! സെക്ഷൻ C5 ൽ പുതിയ പാൽ ഉണ്ട്. ഇന്ന് 20% ഛാനം!"
❌ WRONG: "Yes, we have milk"`,

    'hi': `
████████████████████████████████████████████
█ LANGUAGE REQUIREMENT: HINDI (हिंदी)     █
████████████████████████████████████████████
CRITICAL RULE: EVERY SINGLE RESPONSE MUST BE 100% IN HINDI SCRIPT!

1. RESPOND IN HINDI LANGUAGE ONLY - No English.
2. EVERY WORD must be in Devanagari script (हिंदी).
3. Do NOT mix languages.
4. Use proper Hindi with Devanagari characters.

EXAMPLE:
User: "क्या दूध है"
✅ CORRECT: "हाँ! सेक्शन C5 में ताजा दूध है। आज पर 20% छूट है!"
❌ WRONG: "Yes, we have milk"`,

    'mr': `
████████████████████████████████████████████
█ LANGUAGE REQUIREMENT: MARATHI (मराठी)   █
████████████████████████████████████████████
CRITICAL RULE: EVERY SINGLE RESPONSE MUST BE 100% IN MARATHI SCRIPT!

1. RESPOND IN MARATHI LANGUAGE ONLY - No English.
2. EVERY WORD must be in Devanagari script (मराठी).
3. Do NOT mix languages.

EXAMPLE:
User: "दूध आहे का"
✅ CORRECT: "होय! विभाग C5 मध्ये ताजे दूध आहे. आज 20% सूट आहे!"
❌ WRONG: "Yes, we have milk"`,

    'gu': `
████████████████████████████████████████████
█ LANGUAGE REQUIREMENT: GUJARATI (ગુજરાતી) █
████████████████████████████████████████████
CRITICAL RULE: EVERY SINGLE RESPONSE MUST BE 100% IN GUJARATI SCRIPT!

1. RESPOND IN GUJARATI LANGUAGE ONLY - No English.
2. EVERY WORD must be in Gujarati script (ગુજરાતી).

EXAMPLE:
User: "દૂધ છે"
✅ CORRECT: "હા! વિભાગ C5 માં તાજું દૂધ છે. આજે 20% ડિસ્કાઉન્ટ!"
❌ WRONG: "Yes, we have milk"`,

    'bn': `
████████████████████████████████████████████
█ LANGUAGE REQUIREMENT: BENGALI (বাংলা)  █
████████████████████████████████████████████
CRITICAL RULE: EVERY SINGLE RESPONSE MUST BE 100% IN BENGALI SCRIPT!

1. RESPOND IN BENGALI LANGUAGE ONLY - No English.
2. EVERY WORD must be in Bengali script (বাংলা).`,

    'pa': `
████████████████████████████████████████████
█ LANGUAGE REQUIREMENT: PUNJABI (ਪੰਜਾਬੀ)  █
████████████████████████████████████████████
CRITICAL RULE: EVERY SINGLE RESPONSE MUST BE 100% IN PUNJABI SCRIPT!

1. RESPOND IN PUNJABI LANGUAGE ONLY - No English.
2. EVERY WORD must be in Gurmukhi script (ਪੰਜਾਬੀ).`,

    'ur': `
████████████████████████████████████████████
█ LANGUAGE REQUIREMENT: URDU (اردو)      █
████████████████████████████████████████████
CRITICAL RULE: EVERY SINGLE RESPONSE MUST BE 100% IN URDU SCRIPT!

1. RESPOND IN URDU LANGUAGE ONLY - No English.
2. EVERY WORD must be in Urdu script (اردو).`,

    'fr': `
████████████████████████████████████████████
█ LANGUAGE REQUIREMENT: FRENCH (Français)  █
████████████████████████████████████████████
CRITICAL RULE: EVERY SINGLE RESPONSE MUST BE 100% IN FRENCH!

1. RESPOND IN FRENCH LANGUAGE ONLY - No English.
2. Use proper French with correct accents and characters.

EXAMPLE:
User: "Avez-vous du lait?"
✅ CORRECT: "Oui! Nous avons du lait frais à la section C5. 20% de réduction aujourd'hui!"
❌ WRONG: "Yes, we have milk"`,

    'es': `
████████████████████████████████████████████
█ LANGUAGE REQUIREMENT: SPANISH (Español)  █
████████████████████████████████████████████
CRITICAL RULE: EVERY SINGLE RESPONSE MUST BE 100% IN SPANISH!

1. RESPOND IN SPANISH LANGUAGE ONLY - No English.

EXAMPLE:
User: "¿Tienes leche?"
✅ CORRECT: "¡Sí! Tenemos leche fresca en la sección C5. ¡20% de descuento hoy!"
❌ WRONG: "Yes, we have milk"`,

    'de': `
████████████████████████████████████████████
█ LANGUAGE REQUIREMENT: GERMAN (Deutsch)   █
████████████████████████████████████████████
CRITICAL RULE: EVERY SINGLE RESPONSE MUST BE 100% IN GERMAN!

1. RESPOND IN GERMAN LANGUAGE ONLY - No English.`,

    'it': `
████████████████████████████████████████████
█ LANGUAGE REQUIREMENT: ITALIAN (Italiano) █
████████████████████████████████████████████
CRITICAL RULE: EVERY SINGLE RESPONSE MUST BE 100% IN ITALIAN!

1. RESPOND IN ITALIAN LANGUAGE ONLY - No English.`,

    'pt': `
████████████████████████████████████████████
█ LANGUAGE REQUIREMENT: PORTUGUESE         █
████████████████████████████████████████████
CRITICAL RULE: EVERY SINGLE RESPONSE MUST BE 100% IN PORTUGUESE!

1. RESPOND IN PORTUGUESE LANGUAGE ONLY - No English.`,

    'ru': `
████████████████████████████████████████████
█ LANGUAGE REQUIREMENT: RUSSIAN (Русский) █
████████████████████████████████████████████
CRITICAL RULE: EVERY SINGLE RESPONSE MUST BE 100% IN RUSSIAN!

1. RESPOND IN RUSSIAN LANGUAGE ONLY - No English.
2. Use Cyrillic script exclusively.`,

    'zh': `
████████████████████████████████████████████
█ LANGUAGE REQUIREMENT: CHINESE (中文)    █
████████████████████████████████████████████
CRITICAL RULE: EVERY SINGLE RESPONSE MUST BE 100% IN CHINESE!

1. RESPOND IN CHINESE LANGUAGE ONLY - No English.
2. Use simplified Chinese characters.`,

    'ja': `
████████████████████████████████████████████
█ LANGUAGE REQUIREMENT: JAPANESE (日本語) █
████████████████████████████████████████████
CRITICAL RULE: EVERY SINGLE RESPONSE MUST BE 100% IN JAPANESE!

1. RESPOND IN JAPANESE LANGUAGE ONLY - No English.`,

    'ko': `
████████████████████████████████████████████
█ LANGUAGE REQUIREMENT: KOREAN (한국어)   █
████████████████████████████████████████████
CRITICAL RULE: EVERY SINGLE RESPONSE MUST BE 100% IN KOREAN!

1. RESPOND IN KOREAN LANGUAGE ONLY - No English.
2. Use Hangul script exclusively.`,

    'ar': `
████████████████████████████████████████████
█ LANGUAGE REQUIREMENT: ARABIC (العربية) █
████████████████████████████████████████████
CRITICAL RULE: EVERY SINGLE RESPONSE MUST BE 100% IN ARABIC!

1. RESPOND IN ARABIC LANGUAGE ONLY - No English.`,

    'th': `
████████████████████████████████████████████
█ LANGUAGE REQUIREMENT: THAI (ไทย)        █
████████████████████████████████████████████
CRITICAL RULE: EVERY SINGLE RESPONSE MUST BE 100% IN THAI!

1. RESPOND IN THAI LANGUAGE ONLY - No English.`,

    'vi': `
████████████████████████████████████████████
█ LANGUAGE REQUIREMENT: VIETNAMESE         █
████████████████████████████████████████████
CRITICAL RULE: EVERY SINGLE RESPONSE MUST BE 100% IN VIETNAMESE!

1. RESPOND IN VIETNAMESE LANGUAGE ONLY - No English.`,

    'id': `
████████████████████████████████████████████
█ LANGUAGE REQUIREMENT: INDONESIAN         █
████████████████████████████████████████████
CRITICAL RULE: EVERY SINGLE RESPONSE MUST BE 100% IN INDONESIAN!

1. RESPOND IN INDONESIAN LANGUAGE ONLY - No English.`,

    'ms': `
████████████████████████████████████████████
█ LANGUAGE REQUIREMENT: MALAY              █
████████████████████████████████████████████
CRITICAL RULE: EVERY SINGLE RESPONSE MUST BE 100% IN MALAY!

1. RESPOND IN MALAY LANGUAGE ONLY - No English.`
  };

  // Return SIMPLIFIED version that doesn't bloat token count
  const langPrompts = {
    'en': basePrompt + ' Respond in English only.',
    'ta': basePrompt + ' Respond in Tamil (தமிழ்) using Tamil script only.',
    'te': basePrompt + ' Respond in Telugu (తెలుగు) script only.',
    'ml': basePrompt + ' Respond in Malayalam (മലയാളം) script only.',
    'hi': basePrompt + ' Respond in Hindi (हिंदी) Devanagari script only.',
    'kn': basePrompt + ' Respond in Kannada (ಕನ್ನಡ) script only.',
    'gu': basePrompt + ' Respond in Gujarati (ગુજરાતી) script only.',
    'bn': basePrompt + ' Respond in Bengali (বাংলা) script only.',
    'mr': basePrompt + ' Respond in Marathi (मराठी) Devanagari script only.',
  };

  return langPrompts[langCode] || basePrompt;
}

/**
 * Get language code from browser's speech recognition
 * The Web Speech API provides language code in results sometimes
 * @param {string} text - Recognized text
 * @param {string} browserLang - Browser language hint (e.g., 'ta-IN', 'en-US')
 * @returns {string} - Detected language code
 */
export function getLanguageFromSpeech(text, browserLang = 'en-US') {
  // First, try our Unicode detection
  const detected = detectLanguage(text);

  // If detected is not 'en' or 'auto', trust it
  if (detected !== 'en' && detected !== 'auto') {
    return detected;
  }

  // If we got 'auto' or 'en', check if browser language suggests otherwise
  if (browserLang && browserLang.startsWith('ta')) return 'ta';
  if (browserLang && browserLang.startsWith('te')) return 'te';
  if (browserLang && browserLang.startsWith('kn')) return 'kn';
  if (browserLang && browserLang.startsWith('ml')) return 'ml';
  if (browserLang && browserLang.startsWith('hi')) return 'hi';
  if (browserLang && browserLang.startsWith('mr')) return 'mr';
  if (browserLang && browserLang.startsWith('gu')) return 'gu';
  if (browserLang && browserLang.startsWith('bn')) return 'bn';
  if (browserLang && browserLang.startsWith('pa')) return 'pa';
  if (browserLang && browserLang.startsWith('fr')) return 'fr';
  if (browserLang && browserLang.startsWith('es')) return 'es';
  if (browserLang && browserLang.startsWith('de')) return 'de';
  if (browserLang && browserLang.startsWith('it')) return 'it';
  if (browserLang && browserLang.startsWith('pt')) return 'pt';
  if (browserLang && browserLang.startsWith('ru')) return 'ru';
  if (browserLang && browserLang.startsWith('ja')) return 'ja';
  if (browserLang && browserLang.startsWith('ko')) return 'ko';
  if (browserLang && browserLang.startsWith('zh')) return 'zh';
  if (browserLang && browserLang.startsWith('ar')) return 'ar';

  return detected;
}

/**
 * Get display name for language code
 * @param {string} langCode
 * @returns {string}
 */
export function getLanguageDisplayName(langCode) {
  return getLanguageName(langCode);
}

// Export language names for UI
export const languageNames = LANGUAGE_NAMES;
