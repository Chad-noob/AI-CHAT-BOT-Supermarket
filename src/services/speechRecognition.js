// Speech Recognition Service using Web Speech API
// Supports continuous listening and silence detection

class SpeechRecognitionService {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.onResult = null;
    this.onError = null;
    this.onStart = null;
    this.onEnd = null;
    this.silenceTimeout = null;
    this.silenceThreshold = 2000; // 2 seconds of silence to stop
    this.continuousMode = false;
    this.currentTranscript = '';
    this.speechStartTime = null;
  }

  /**
   * Initialize speech recognition
   * @returns {Promise<boolean>} - Success status
   */
  async initialize() {
    // Check browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error('Speech Recognition API not supported');
      this.onError?.('Speech Recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return false;
    }

    this.recognition = new SpeechRecognition();

    // Configure recognition
    this.recognition.continuous = this.continuousMode;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US'; // Will be changed dynamically

    // Event handlers
    this.recognition.onstart = () => {
      this.isListening = true;
      this.onStart?.();
      this.speechStartTime = Date.now();
      this.startSilenceDetection();
    };

    this.recognition.onresult = (event) => {
      this.handleResult(event);
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      this.isListening = false;
      this.stopSilenceDetection();

      if (event.error === 'no-speech') {
        // Restart if no speech detected
        if (this.continuousMode) {
          setTimeout(() => this.start(), 100);
        }
      } else {
        this.onError?.(this.getErrorMessage(event.error));
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.stopSilenceDetection();
      this.onEnd?.();

      // Auto-restart in continuous mode if we were interrupted but haven't exceeded silence threshold
      if (this.continuousMode && !this.silenceTimeout) {
        setTimeout(() => {
          if (!this.isListening) {
            this.start();
          }
        }, 100);
      }
    };

    return true;
  }

  /**
   * Handle recognition results
   * @param {SpeechRecognitionEvent} event
   */
  handleResult(event) {
    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;

      if (event.results[i].isFinal) {
        finalTranscript += transcript;
      } else {
        interimTranscript += transcript;
      }
    }

    // Reset silence detection on speech
    if (interimTranscript || finalTranscript) {
      this.resetSilenceDetection();
    }

    // Send results to callback
    if (this.onResult) {
      this.onResult({
        interim: interimTranscript,
        final: finalTranscript,
        isFinal: !!finalTranscript,
        currentTranscript: this.currentTranscript
      });
    }

    if (finalTranscript) {
      this.currentTranscript += finalTranscript + ' ';
    }
  }

  /**
   * Map ISO language codes to Web Speech API language tags
   * Format: 'language-COUNTRY'
   */
  languageMap = {
    'en': 'en-US',
    'english': 'en-US',
    'ta': 'ta-IN',
    'tamil': 'ta-IN',
    'te': 'te-IN',
    'telugu': 'te-IN',
    'kn': 'kn-IN',
    'kannada': 'kn-IN',
    'ml': 'ml-IN',
    'malayalam': 'ml-IN',
    'hi': 'hi-IN',
    'hindi': 'hi-IN',
    'mr': 'mr-IN',
    'marathi': 'mr-IN',
    'gu': 'gu-IN',
    'gujarati': 'gu-IN',
    'bn': 'bn-IN',
    'bengali': 'bn-IN',
    'pa': 'pa-IN',
    'punjabi': 'pa-IN',
    'or': 'or-IN',
    'odia': 'or-IN',
    'ur': 'ur-PK',
    'urdu': 'ur-PK',
    'ne': 'ne-NP',
    'nepali': 'ne-NP',
    'si': 'si-LK',
    'sinhala': 'si-LK',
    'my': 'my-MM',
    'burmese': 'my-MM',
    'th': 'th-TH',
    'thai': 'th-TH',
    'vi': 'vi-VN',
    'vietnamese': 'vi-VN',
    'id': 'id-ID',
    'indonesian': 'id-ID',
    'ms': 'ms-MY',
    'malay': 'ms-MY',
    'km': 'km-KH',
    'khmer': 'km-KH',
    'zh': 'zh-CN',
    'chinese': 'zh-CN',
    'ja': 'ja-JP',
    'japanese': 'ja-JP',
    'ko': 'ko-KR',
    'korean': 'ko-KR',
    'ar': 'ar-SA',
    'arabic': 'ar-SA',
    'he': 'he-IL',
    'hebrew': 'he-IL',
    'fa': 'fa-IR',
    'persian': 'fa-IR',
    'tr': 'tr-TR',
    'turkish': 'tr-TR',
    'pl': 'pl-PL',
    'polish': 'pl-PL',
    'ru': 'ru-RU',
    'russian': 'ru-RU',
    'uk': 'uk-UA',
    'ukrainian': 'uk-UA',
    'fr': 'fr-FR',
    'french': 'fr-FR',
    'es': 'es-ES',
    'spanish': 'es-ES',
    'de': 'de-DE',
    'german': 'de-DE',
    'it': 'it-IT',
    'italian': 'it-IT',
    'pt': 'pt-BR',
    'portuguese': 'pt-BR',
    'nl': 'nl-NL',
    'dutch': 'nl-NL',
    'sv': 'sv-SE',
    'swedish': 'sv-SE',
    'da': 'da-DK',
    'danish': 'da-DK',
    'no': 'no-NO',
    'norwegian': 'no-NO',
    'fi': 'fi-FI',
    'finnish': 'fi-FI'
  };

  /**
   * Set language for recognition
   * @param {string} language - Language name (e.g., 'tamil', 'english') or ISO code (e.g., 'ta', 'en')
   */
  setLanguage(language) {
    if (this.recognition) {
      const normalizedLang = language?.toLowerCase().trim();
      const langTag = this.languageMap[normalizedLang] || 'en-US';
      this.recognition.lang = langTag;
      console.log(`Speech recognition language set to: ${langTag} (input: ${language})`);
    }
  }

  /**
   * Start listening
   */
  async start() {
    if (!this.recognition) {
      const initialized = await this.initialize();
      if (!initialized) return;
    }

    if (this.isListening) {
      return;
    }

    this.currentTranscript = '';

    try {
      await this.recognition.start();
    } catch (error) {
      console.error('Failed to start recognition:', error);
      this.onError?.('Failed to start microphone. Please check permissions.');
    }
  }

  /**
   * Stop listening
   */
  async stop() {
    if (this.recognition && this.isListening) {
      try {
        await this.recognition.stop();
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
    }
    this.stopSilenceDetection();
    this.isListening = false;
  }

  /**
   * Toggle listening state
   */
  async toggle() {
    if (this.isListening) {
      await this.stop();
    } else {
      await this.start();
    }
  }

  /**
   * Start silence detection timer
   */
  startSilenceDetection() {
    this.stopSilenceDetection();

    if (!this.continuousMode) {
      return;
    }

    this.silenceTimeout = setTimeout(() => {
      console.log('Silence detected, stopping...');
      if (this.isListening) {
        this.stop();
      }
    }, this.silenceThreshold);
  }

  /**
   * Reset silence detection timer
   */
  resetSilenceDetection() {
    if (this.silenceTimeout) {
      clearTimeout(this.silenceTimeout);
      this.silenceTimeout = null;
      this.startSilenceDetection();
    }
  }

  /**
   * Stop silence detection timer
   */
  stopSilenceDetection() {
    if (this.silenceTimeout) {
      clearTimeout(this.silenceTimeout);
      this.silenceTimeout = null;
    }
  }

  /**
   * Get user-friendly error message
   * @param {string} errorCode
   * @returns {string}
   */
  getErrorMessage(errorCode) {
    const errorMessages = {
      'not-allowed': 'Microphone access denied. Please allow microphone access and try again.',
      'network': 'Network error occurred. Please check your internet connection.',
      'audio-capture': 'No microphone found. Please connect a microphone.',
      'aborted': 'Speech recognition was interrupted. Please try again.',
      'no-speech': 'No speech detected. Please speak clearly.',
      'language-not-supported': 'The selected language is not supported.',
      'service-not-allowed': 'Speech service not allowed. Please check browser permissions.'
    };

    return errorMessages[errorCode] || `Error: ${errorCode}. Please try again.`;
  }

  /**
   * Set continuous mode
   * @param {boolean} continuous
   */
  setContinuousMode(continuous) {
    this.continuousMode = continuous;
    if (this.recognition) {
      this.recognition.continuous = continuous;
    }
  }

  /**
   * Clean up resources
   */
  destroy() {
    this.stop();
    this.recognition = null;
  }
}

// Export singleton instance
export const speechRecognition = new SpeechRecognitionService();
