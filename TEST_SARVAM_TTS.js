// Test & Demo Script for Sarvam TTS Integration
// Copy-paste these examples in browser console to test

// ============================================
// EXAMPLE 1: Basic Tamil Text-to-Speech
// ============================================
import { textToSpeech } from './src/services/textToSpeech.js';

// Simple test - should use Sarvam AI for Tamil
textToSpeech.speak("வணக்கம், என்று சொல்லலாம்", "ta");

// ============================================
// EXAMPLE 2: Different Indian Languages
// ============================================

// Tamil
textToSpeech.speak("வணக்கம்", "ta");

// Telugu  
textToSpeech.speak("నమస్కారం", "te");

// Hindi
textToSpeech.speak("नमस्ते", "hi");

// Kannada
textToSpeech.speak("ನಮಸ್ಕಾರ", "kn");

// Malayalam
textToSpeech.speak("നമസ്കാരം", "ml");

// English
textToSpeech.speak("Hello!", "en");

// ============================================
// EXAMPLE 3: Check if Language is Supported
// ============================================
import { sarvamTTS } from './src/services/sarvamTTS.js';

console.log("Is Tamil supported?", sarvamTTS.isLanguageSupported('ta'));
// Output: true (if API key configured)

console.log("Supported languages:", sarvamTTS.getSupportedLanguages());
// Output: ['ta', 'te', 'hi', 'kn', 'ml', 'mr', 'gu', 'bn', 'en']

// ============================================
// EXAMPLE 4: Custom Settings
// ============================================

// Set volume
textToSpeech.setVolume(0.8);

// Set pitch
textToSpeech.setPitch(1.1);

// Set rate (speed)
textToSpeech.setRate(0.9); // Slower speech

// Speak with custom settings
textToSpeech.speak("வணக்கம்", "ta");

// ============================================
// EXAMPLE 5: Event Listeners
// ============================================

textToSpeech.onStart = () => {
  console.log('🎤 TTS started');
  document.getElementById('status').textContent = 'Speaking...';
};

textToSpeech.onEnd = () => {
  console.log('✅ TTS finished');
  document.getElementById('status').textContent = 'Done';
};

textToSpeech.onError = (err) => {
  console.error('❌ TTS error:', err);
  document.getElementById('status').textContent = `Error: ${err}`;
};

// ============================================
// EXAMPLE 6: Stop/Cancel Speech
// ============================================

// Stop current speech
textToSpeech.stop();

// ============================================
// EXAMPLE 7: Check Status
// ============================================

// Is currently speaking?
console.log(textToSpeech.getIsSpeaking());

// How many Web Speech voices available?
console.log("Available voices:", textToSpeech.getVoiceCount());

// ============================================
// EXAMPLE 8: Test Fallback
// ============================================

// Disable API key to test Web Speech fallback
// Edit .env and remove VITE_SARVAM_API_KEY, then:

textToSpeech.speak("Testing fallback", "ta");
// Will use Web Speech Synthesis instead of Sarvam

// ============================================
// TESTING CHECKLIST
// ============================================

/*
✅ CHECKLIST TO VERIFY SARVAM INTEGRATION:

1. API Key Setup
   □ Navigate to https://sarvam.ai
   □ Get free API key
   □ Add to .env: VITE_SARVAM_API_KEY=your_key

2. Restart Dev Server
   □ Kill current npm run dev
   □ Run npm run dev again

3. Test in Browser Console
   □ Open DevTools (F12)
   □ Copy-paste: textToSpeech.speak("வணக்கம்", "ta")
   □ Check console for: "🎤 Sarvam TTS: Tamil (ta)"
   □ Should hear Tamil speech

4. Check Fallback
   □ Verify Web Speech logs: "🎤 Using Web Speech Synthesis"
   □ Test with unsupported languages
   □ Should still produce audio

5. Test Multiple Languages
   □ Tamil (ta): வணக்கம்
   □ Telugu (te): నమస్కారం
   □ Hindi (hi): नमस्ते
   □ English (en): Hello

6. Check Voice Assistant Hook
   □ The useVoiceAssistant hook uses textToSpeech.speak()
   □ No changes needed - works automatically!
   □ Test by speaking into microphone

7. Monitor Sarvam API Usage
   □ Check dashboard at https://sarvam.ai
   □ View API call count and quota

*/
