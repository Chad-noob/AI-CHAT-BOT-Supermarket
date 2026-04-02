// Sarvam AI Text-to-Speech Service
// Uses official Sarvam API for Indian languages

class SarvamTTSService {
  constructor() {
    this.apiKey = import.meta.env.VITE_SARVAM_API_KEY;
    this.baseUrl = 'https://api.sarvam.ai/text-to-speech';
    this.isAvailable = !!this.apiKey && this.apiKey.length > 20;

    this.currentAudio = null;
    this.isSpeaking = false;
    this.onStart = null;
    this.onEnd = null;
    this.onError = null;

    // Language to Sarvam voice mapping (with full region codes)
    this.languageVoiceMap = {
      'ta': { lang: 'Tamil', code: 'ta-IN' },
      'te': { lang: 'Telugu', code: 'te-IN' },
      'hi': { lang: 'Hindi', code: 'hi-IN' },
      'kn': { lang: 'Kannada', code: 'kn-IN' },
      'ml': { lang: 'Malayalam', code: 'ml-IN' },
      'mr': { lang: 'Marathi', code: 'mr-IN' },
      'gu': { lang: 'Gujarati', code: 'gu-IN' },
      'bn': { lang: 'Bengali', code: 'bn-IN' },
      'en': { lang: 'English', code: 'en-IN' }
    };

    if (this.isAvailable) {
      console.log('✅ Sarvam AI TTS initialized');
    } else {
      console.warn('⚠️ Sarvam API key not configured');
    }
  }

  /**
   * Check if Sarvam is available for a specific language
   */
  isLanguageSupported(languageCode) {
    return this.isAvailable && this.languageVoiceMap[languageCode];
  }

  /**
   * Speak text using Sarvam AI REST API
   */
  async speak(text, languageCode = 'en', options = {}) {
    if (!this.isAvailable) {
      console.warn('Sarvam AI not available');
      return false;
    }

    if (!text || !text.trim()) {
      return false;
    }

    try {
      this.isSpeaking = true;
      if (this.onStart) this.onStart();

      const voiceConfig = this.languageVoiceMap[languageCode];
      
      // Stop current audio if playing
      this.stop();

      console.log(`🎤 Sarvam TTS: ${voiceConfig.lang} (${languageCode})`);

      // Fetch audio from Sarvam API
      const audioBlob = await this.fetchAudioViaREST(text, languageCode, voiceConfig);
      
      if (!audioBlob) {
        throw new Error('Failed to fetch audio from Sarvam');
      }

      // Play the audio
      const audioUrl = URL.createObjectURL(audioBlob);
      this.currentAudio = new Audio(audioUrl);
      
      this.currentAudio.onended = () => {
        this.isSpeaking = false;
        if (this.onEnd) this.onEnd();
        URL.revokeObjectURL(audioUrl);
      };

      this.currentAudio.onerror = (error) => {
        console.error('Audio playback error:', error);
        this.isSpeaking = false;
        if (this.onError) this.onError(error);
      };

      // Set volume from options
      this.currentAudio.volume = options.volume || 1.0;

      // Play audio
      await this.currentAudio.play();
      return true;

    } catch (error) {
      console.error('Sarvam TTS Error:', error);
      this.isSpeaking = false;
      if (this.onError) this.onError(error);
      return false;
    }
  }

  /**
   * Fetch audio using Sarvam REST API directly
   */
  async fetchAudioViaREST(text, languageCode, voiceConfig) {
    try {
      console.log('📤 Calling Sarvam REST API...');

      // Use the full language code from the mapping (e.g., ta-IN, hi-IN)
      const fullLanguageCode = voiceConfig.code;

      // Simple payload - Sarvam format
      const payload = {
        inputs: [text],
        target_language_code: fullLanguageCode
      };

      console.log('📋 Payload:', JSON.stringify(payload).substring(0, 150) + '...');
      console.log('📍 Using language code:', fullLanguageCode);

      // Try with different authentication headers
      const headers = {
        'Content-Type': 'application/json',
        'api-subscription-key': this.apiKey
      };

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      try {
        const response = await fetch(this.baseUrl, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(payload),
          signal: controller.signal
        });

        clearTimeout(timeout);

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`❌ Sarvam HTTP ${response.status}`);
          
          try {
            const errorJson = JSON.parse(errorText);
            console.error('❌ Error details:', JSON.stringify(errorJson, null, 2));
          } catch (e) {
            console.error('❌ Error response (raw):', errorText.substring(0, 300));
          }
          
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Sarvam Response received');

        if (data.audios && data.audios[0]) {
          // Convert base64 to blob
          const audioData = data.audios[0];
          const binaryString = atob(audioData);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          return new Blob([bytes], { type: 'audio/wav' });
        }

        throw new Error('No audio in response');

      } catch (error) {
        clearTimeout(timeout);
        if (error.name === 'AbortError') {
          console.error('❌ Sarvam request timeout');
          throw new Error('Request timeout');
        }
        throw error;
      }
    } catch (error) {
      console.error('Failed to fetch audio from Sarvam:', error.message);
      throw error;
    }
  }

  /**
   * Stop current audio playback
   */
  stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.isSpeaking = false;
    }
  }
}

export const sarvamTTS = new SarvamTTSService();
