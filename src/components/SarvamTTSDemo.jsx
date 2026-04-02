import React, { useState } from 'react';
import { textToSpeech } from '../services/textToSpeech.js';
import { sarvamTTS } from '../services/sarvamTTS.js';

/**
 * Sarvam TTS Demo Component
 * Shows how to test Sarvam vs Web Speech voices
 */
export function SarvamTTSDemo() {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [customText, setCustomText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const languages = {
    'en': { name: '🟦 English', sample: 'Hello! This is a voice test.' },
    'ta': { name: '🟥 Tamil (தமிழ்)', sample: 'வணக்கம், இது ஒரு குரல் சோதனை.' },
    'te': { name: '🟨 Telugu (తెలుగు)', sample: 'నమస్కారం, ఇది వాయిస్ టెస్ట్.' },
    'hi': { name: '🟠 Hindi (हिन्दी)', sample: 'नमस्ते, यह एक वॉयस टेस्ट है।' },
    'kn': { name: '🟪 Kannada (ಕನ್ನಡ)', sample: 'ನಮಸ್ಕಾರ, ಇದು ವಾಯಿಸ್ ಟೆಸ್ಟ್.' },
    'ml': { name: '🟫 Malayalam (മലയാളം)', sample: 'നമസ്കാരം, ഇത് വോയ്സ് ടെസ്റ്റാണ്.' },
  };

  const sampleText = customText || languages[selectedLanguage]?.sample || '';

  const handleSpeakWithSarvam = async () => {
    if (!sampleText.trim()) return;
    setIsSpeaking(true);
    await textToSpeech.speak(sampleText, selectedLanguage);
  };

  const handleCheckStatus = () => {
    console.clear();
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🎤 SARVAM TTS STATUS CHECK');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('Sarvam AI Available:', sarvamTTS.isAvailable);
    console.log('API Key Present:', !!sarvamTTS.apiKey);
    console.log('Current Language:', selectedLanguage);
    console.log('Sarvam Supported:', sarvamTTS.isLanguageSupported(selectedLanguage));
    console.log('═══════════════════════════════════════════════════════════');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 rounded-xl shadow-2xl border border-slate-700 bg-slate-800">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">
          🎙️ Sarvam TTS Demo
        </h2>
        <p className="text-slate-300">
          Test natural, fluent voices for Indian languages (completely free!)
        </p>
      </div>

      {/* Status Banner */}
      <div className={`mb-6 p-4 rounded-lg border-2 ${
        sarvamTTS.isAvailable 
          ? 'bg-emerald-900/20 border-emerald-500 text-emerald-300'
          : 'bg-red-900/20 border-red-500 text-red-300'
      }`}>
        <p className="font-semibold">
          {sarvamTTS.isAvailable ? '✅ Sarvam AI Ready' : '⚠️ Sarvam AI Unavailable'}
        </p>
        <p className="text-sm mt-1">
          {sarvamTTS.isAvailable 
            ? 'Premium voices available for Indian languages' 
            : 'Using Web Speech fallback'}
        </p>
      </div>

      {/* Language Selection */}
      <div className="mb-6">
        <label className="block text-white font-semibold mb-3">Select Language:</label>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(languages).map(([code, { name }]) => (
            <button
              key={code}
              onClick={() => setSelectedLanguage(code)}
              className={`p-3 rounded-lg font-semibold transition-all ${
                selectedLanguage === code
                  ? 'bg-emerald-600 text-white shadow-lg ring-2 ring-emerald-400'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Text Input */}
      <div className="mb-6">
        <label className="block text-white font-semibold mb-3">Custom Text (optional):</label>
        <textarea
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          placeholder={languages[selectedLanguage]?.sample}
          className="w-full p-4 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none placeholder-slate-400 h-24 resize-none"
        />
        <p className="text-slate-400 text-sm mt-2">Leave empty to use default sample</p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <button
          onClick={handleSpeakWithSarvam}
          disabled={isSpeaking || !sampleText.trim()}
          className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-600 text-white font-bold rounded-lg transition-all shadow-lg disabled:cursor-not-allowed"
        >
          {isSpeaking ? '🔊 Speaking...' : '🎙️ Speak'}
        </button>

        <button
          onClick={() => textToSpeech.stop()}
          disabled={!isSpeaking}
          className="px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-slate-600 text-white font-bold rounded-lg transition disabled:cursor-not-allowed"
        >
          ⏹️ Stop
        </button>

        <button
          onClick={handleCheckStatus}
          className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition"
        >
          ℹ️ Status
        </button>
      </div>

      {/* Info Box */}
      <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
        <p className="text-blue-300 text-sm">
          <strong>💡 Pro Tip:</strong> Open browser developer tools (F12) to see Sarvam TTS logs in the console. 
          Look for "✅ Sarvam TTS succeeded" for confirmation it's working!
        </p>
      </div>
    </div>
  );
}

export default SarvamTTSDemo;
