// Text-to-Speech Service using Web Speech Synthesis API + Sarvam AI
import { sarvamTTS } from './sarvamTTS.js';

class TextToSpeechService {
  constructor() {
    this.synthesis = window.speechSynthesis || null;
    this.utterance = null;
    this.isSpeaking = false;
    this.onStart = null;
    this.onEnd = null;
    this.onError = null;
    this.availableVoices = [];
    this.currentVoice = null;
    this.rate = 0.95;  // Slightly slower = more natural
    this.pitch = 1.0;
    this.volume = 0.95; // Slightly lower = less harsh
    this._voicesChangedBound = null;
    this.sarvam = sarvamTTS;

    // Set up Sarvam callbacks
    this.sarvam.onStart = () => {
      this.isSpeaking = true;
      this.onStart?.();
    };
    this.sarvam.onEnd = () => {
      this.isSpeaking = false;
      this.onEnd?.();
    };
    this.sarvam.onError = (error) => {
      console.warn('Sarvam TTS failed, falling back to Web Speech:', error);
      this.onError?.(error);
    };

    // Load voices when available
    if (this.synthesis && this.synthesis.onvoiceschanged !== undefined) {
      this._voicesChangedBound = () => this.loadVoices();
      this.synthesis.onvoiceschanged = this._voicesChangedBound;
    }

    // Load voices immediately (may be available already)
    setTimeout(() => this.loadVoices(), 100);
  }

  /**
   * Load available voices
   */
  loadVoices() {
    if (!this.synthesis) {
      console.warn('Speech synthesis not available');
      return;
    }
    this.availableVoices = this.synthesis.getVoices();

    // Chrome may return empty array initially
    if (this.availableVoices.length === 0) {
      console.log('Voices not loaded yet, will retry...');
      setTimeout(() => this.loadVoices(), 500);
      return;
    }

    console.log('Loaded voices:', this.availableVoices.map(v => ({ name: v.name, lang: v.lang })));

    // Select default voice based on language
    this.selectDefaultVoice();
  }

  /**
   * Language code to ISO 639-1 mapping
   * Supports language names, ISO codes, and regional variants
   */
  languageCodeMap = {
    // Indian languages (priority for Sarvam TTS - better quality!)
    'tamil': 'ta', 'ta': 'ta', 'தமிழ்': 'ta', 'tl': 'ta',
    'telugu': 'te', 'te': 'te', 'తెలుగు': 'te',
    'kannada': 'kn', 'kn': 'kn', 'ಕನ್ನಡ': 'kn',
    'malayalam': 'ml', 'ml': 'ml', 'മലയാളം': 'ml',
    'hindi': 'hi', 'hi': 'hi', 'हिन्दी': 'hi',
    'marathi': 'mr', 'mr': 'mr', 'मराठी': 'mr',
    'gujarati': 'gu', 'gu': 'gu', 'ગુજરાતી': 'gu',
    'bengali': 'bn', 'bn': 'bn', 'বাংলা': 'bn',
    
    // English variants
    'english': 'en', 'en': 'en', 'en-us': 'en', 'en-gb': 'en', 'en-au': 'en', 'en-in': 'en',
    
    // Other commonly used languages
    'urdu': 'ur', 'ur': 'ur',
    'punjabi': 'pa', 'pa': 'pa', 'پنجابی': 'pa',
    'odia': 'or', 'or': 'or', 'ଓଡ଼ିଆ': 'or',
    'assamese': 'as', 'as': 'as',
    'nepali': 'ne', 'ne': 'ne',
    'sinhala': 'si', 'si': 'si',
    'burmese': 'my', 'my': 'my',
    'thai': 'th', 'th': 'th',
    'vietnamese': 'vi', 'vi': 'vi',
    'indonesian': 'id', 'id': 'id',
    'malay': 'ms', 'ms': 'ms',
    'khmer': 'km', 'km': 'km',
    'chinese': 'zh', 'zh': 'zh', '중국어': 'zh', '中文': 'zh',
    'japanese': 'ja', 'ja': 'ja', '日本語': 'ja',
    'korean': 'ko', 'ko': 'ko', '한국어': 'ko',
    'arabic': 'ar', 'ar': 'ar',
    'hebrew': 'he', 'he': 'he',
    'persian': 'fa', 'fa': 'fa',
    'turkish': 'tr', 'tr': 'tr',
    'polish': 'pl', 'pl': 'pl',
    'russian': 'ru', 'ru': 'ru',
    'ukrainian': 'uk', 'uk': 'uk',
    'french': 'fr', 'fr': 'fr', 'fr-fr': 'fr',
    'spanish': 'es', 'es': 'es', 'es-es': 'es',
    'german': 'de', 'de': 'de',
    'italian': 'it', 'it': 'it',
    'portuguese': 'pt', 'pt': 'pt', 'pt-br': 'pt',
    'dutch': 'nl', 'nl': 'nl',
    'swedish': 'sv', 'sv': 'sv',
    'danish': 'da', 'da': 'da',
    'norwegian': 'no', 'no': 'no',
    'finnish': 'fi', 'fi': 'fi'
  };

  /**
   * Select appropriate voice for language - PRIORITIZES LOCAL VOICES
   * @param {string} language - Language name (e.g., 'tamil', 'english') or ISO code (e.g., 'ta', 'en')
   */
  selectVoiceByLanguage(language) {
    if (this.availableVoices.length === 0) {
      console.warn('No voices available. Make sure your browser/OS has TTS voices installed.');
      return null;
    }

    // Normalize language input - convert to ISO code
    const normalizedLang = language?.toLowerCase().trim();
    const targetLang = this.languageCodeMap[normalizedLang] || normalizedLang || 'en';

    console.log(`Selecting voice for language: ${language} (target: ${targetLang})`);

    // Debug: log available voices grouped by local/network
    const localVoices = this.availableVoices.filter(v => v.localService);
    const networkVoices = this.availableVoices.filter(v => !v.localService);
    console.log(`Local voices: ${localVoices.map(v => `${v.name} (${v.lang})`).join(', ')}`);
    console.log(`Network voices: ${networkVoices.map(v => `${v.name} (${v.lang})`).join(', ')}`);

    // 1) Try LOCAL voices first (much better quality than network)
    let localMatches = this.availableVoices.filter(v => {
      const vLang = v.lang.toLowerCase();
      return v.localService && (vLang === targetLang || vLang.startsWith(targetLang + '-'));
    });

    if (localMatches.length > 0) {
      // For English, prefer Microsoft voices (they're the best local voices)
      if (targetLang === 'en') {
        const msVoice = localMatches.find(v => v.name.includes('Microsoft'));
        if (msVoice) {
          console.log(`✓ Selected LOCAL English voice: ${msVoice.name} (${msVoice.lang})`);
          this.currentVoice = msVoice;
          return msVoice;
        }
      }
      // For other languages, just pick first local
      console.log(`✓ Selected LOCAL voice: ${localMatches[0].name} (${localMatches[0].lang})`);
      this.currentVoice = localMatches[0];
      return localMatches[0];
    }

    // 2) Check if Sarvam can handle this language (Indian languages)
    // Sarvam will be called separately in speak(), this is just for Web Speech fallback
    // Sarvam is checked and used in the speak() method before this method is called for Web Speech
    // So if we're here, Sarvam either isn't available or failed

    // 3) Language family fallback - try local voices from same language family
    const languageFamilies = {
      indian: ['ta','te','kn','ml','hi','mr','gu','bn','pa','or','as','ne','si'],
      east_asian: ['zh','ja','ko'],
      middle_eastern: ['ar','he','fa','ur'],
      european: ['en','de','fr','it','es','pt','nl','sv','da','no','fi','pl','ru','uk','el','cs','sk','hu','ro','bg','sr','hr','sl','et','lv','lt','ga','cy','gd']
    };

    const targetFamily = Object.keys(languageFamilies).find(family =>
      languageFamilies[family].includes(targetLang)
    );
    if (targetFamily) {
      // First try local voices in the family (from localMatches or fresh search)
      let familyVoice = localMatches.length > 0 ? localMatches[0] : null;
      if (!familyVoice) {
        familyVoice = this.availableVoices.find(v => {
          const vLang = v.lang.toLowerCase().split('-')[0];
          return languageFamilies[targetFamily].includes(vLang) && v.localService;
        });
      }
      // If still no local, try ANY voice from the family (including network like Google Hindi)
      if (!familyVoice) {
        familyVoice = this.availableVoices.find(v => {
          const vLang = v.lang.toLowerCase().split('-')[0];
          return languageFamilies[targetFamily].includes(vLang);
        });
      }
      if (familyVoice) {
        console.log(`✓ Using ${targetFamily} voice: ${familyVoice.name} (${familyVoice.lang}) ${familyVoice.localService ? '(local)' : '(network)'}`);
        this.currentVoice = familyVoice;
        return familyVoice;
      }
    }

    // 4) If still not found and not English, try ANY English voice (local or network)
    if (targetLang !== 'en') {
      console.warn(`No local voice for ${targetLang}, trying ANY English voice`);
      let englishVoice = this.availableVoices.find(v =>
        v.lang.toLowerCase().startsWith('en')
      );
      if (englishVoice) {
        console.log(`✓ Using English voice: ${englishVoice.name} (${englishVoice.lang})`);
        this.currentVoice = englishVoice;
        return englishVoice;
      }
    }

    // 5) If no local voices at all, use first available (may be network)
    console.warn('No local voices found, using first available (may be network/robotic)');
    const voice = this.availableVoices[0];
    this.currentVoice = voice;
    return voice;
  }

  /**
   * Select default voice on startup
   */
  selectDefaultVoice() {
    this.selectVoiceByLanguage('english');
  }

  /**
   * Speak text - tries Sarvam AI first for Indian languages, falls back to Web Speech
   * IMPORTANT: Sarvam provides much better quality for Indian languages!
   * 
   * @param {string} text - Text to speak
   * @param {string} language - 'english', 'tamil', or ISO code (e.g., 'ta', 'en')
   * @param {number} rate - Speech rate (0.1-10), defaults to 0.95 for natural flow
   */
  async speak(text, language = 'english', rate = null) {
    if (!text || text.trim().length === 0) {
      console.warn('Empty text provided to speech');
      return;
    }

    // Cancel any ongoing speech before starting new one
    this.cancel();

    // Use default optimized rate if not specified
    if (rate === null) {
      rate = this.rate; // 0.95 - more natural
    }

    // Normalize language code - support both full names and ISO codes
    let normalizedLang = language?.toLowerCase().trim() || 'en';
    let langCode = this.languageCodeMap[normalizedLang] || normalizedLang || 'en';
    
    // Strip region codes (e.g., 'en-US' -> 'en')
    if (langCode.includes('-')) {
      langCode = langCode.split('-')[0];
    }

    console.log(`🔊 TTS Request: language="${language}" -> code="${langCode}", rate=${rate}`);

    // **PRIORITY 1: Try Sarvam AI first for Indian languages**
    // Sarvam gives MUCH better quality than Web Speech
    if (this.sarvam.isLanguageSupported(langCode)) {
      console.log(`🎤 [PRIMARY] Attempting Sarvam AI TTS for "${language}" (${langCode})`);
      try {
        const success = await this.sarvam.speak(text, langCode, {
          rate: rate,
          pitch: this.pitch,
          volume: this.volume
        });

        if (success) {
          this.isSpeaking = true;
          console.log(`✅ Sarvam TTS succeeded - using premium voice quality`);
          return; // Success - stop here, don't fall back
        }
      } catch (error) {
        console.warn(`⚠️ Sarvam TTS error for ${langCode}:`, error.message);
        // Fall through to Web Speech fallback
      }
    }

    // **PRIORITY 2: Fallback to Web Speech Synthesis** 
    // (for languages not supported by Sarvam or if Sarvam fails)
    console.log(`🎤 [FALLBACK] Using Web Speech Synthesis (Sarvam not available or failed)`);
    this.useWebSpeechSynthesis(text, language, rate);
  }

  /**
   * Use Web Speech Synthesis API (fallback method)
   */
  useWebSpeechSynthesis(text, language = 'english', rate = 1.0) {
    if (!this.synthesis) {
      console.warn('Speech synthesis not available');
      this.onError?.('Speech synthesis not available');
      return;
    }

    console.log(`🎤 Using Web Speech Synthesis for ${language}`);

    // Cancel any ongoing speech
    this.cancel();

    // Create utterance
    this.utterance = new SpeechSynthesisUtterance(text);

    // Select voice for language
    const voice = this.selectVoiceByLanguage(language);
    if (voice) {
      this.utterance.voice = voice;
    }

    // Configure utterance
    this.utterance.rate = rate;
    this.utterance.pitch = this.pitch;
    this.utterance.volume = this.volume;

    // Event handlers
    this.utterance.onstart = () => {
      this.isSpeaking = true;
      console.log('Web Speech started');
      this.onStart?.();
    };

    this.utterance.onend = () => {
      this.isSpeaking = false;
      console.log('Web Speech ended');
      this.onEnd?.();
    };

    this.utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      this.isSpeaking = false;
      this.onError?.(event.error);
    };

    // Start speaking
    this.synthesis.speak(this.utterance);
  }

  /**
   * Stop speaking (both Sarvam and Web Speech)
   */
  stop() {
    // Stop Web Speech
    if (this.synthesis) {
      this.synthesis.cancel();
    }
    // Stop Sarvam
    if (this.sarvam) {
      this.sarvam.stop();
    }
    this.isSpeaking = false;
  }

  /**
   * Pause speaking (Web Speech only)
   */
  pause() {
    if (this.isSpeaking && this.synthesis) {
      this.synthesis.pause();
    }
  }

  /**
   * Resume speaking
   */
  resume() {
    if (this.synthesis && this.synthesis.paused) {
      this.synthesis.resume();
    }
  }

  /**
   * Cancel current speech (both Sarvam and Web Speech)
   */
  cancel() {
    // Cancel Web Speech
    if (this.synthesis) {
      this.synthesis.cancel();
    }
    // Cancel Sarvam
    if (this.sarvam) {
      this.sarvam.stop();
    }
    this.isSpeaking = false;
  }

  /**
   * Check if currently speaking
   * @returns {boolean}
   */
  getIsSpeaking() {
    return this.isSpeaking || (this.synthesis?.speaking ?? false);
  }

  /**
   * Get available voices count
   * @returns {number}
   */
  getVoiceCount() {
    return this.availableVoices.length;
  }

  /**
   * Set speech rate
   * @param {number} rate - Rate (0.1-10)
   */
  setRate(rate) {
    this.rate = Math.max(0.1, Math.min(10, rate));
  }

  /**
   * Set speech pitch
   * @param {number} pitch - Pitch (0-2)
   */
  setPitch(pitch) {
    this.pitch = Math.max(0, Math.min(2, pitch));
  }

  /**
   * Set speech volume
   * @param {number} volume - Volume (0-1)
   */
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Check if speech synthesis is supported
   * @returns {boolean}
   */
  static isSupported() {
    return 'speechSynthesis' in window;
  }

  /**
   * Get supported languages
   * @returns {string[]}
   */
  getSupportedLanguages() {
    const langs = new Set();
    this.availableVoices.forEach(voice => {
      const lang = voice.lang.split('-')[0];
      langs.add(lang);
    });
    return Array.from(langs);
  }

  /**
   * Check if service is available
   * @returns {boolean}
   */
  isAvailable() {
    return !!this.synthesis;
  }

  /**
   * Clean up resources
   */
  destroy() {
    this.cancel();
    // Remove event listener to prevent calls on destroyed instance
    if (this.synthesis && this._voicesChangedBound) {
      this.synthesis.onvoiceschanged = null;
      this._voicesChangedBound = null;
    }
    // Don't nullify synthesis - keep it usable across HMR
    // Only clear the voice list
    this.availableVoices = [];
  }
}

// Export singleton instance
export const textToSpeech = new TextToSpeechService();
