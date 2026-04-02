import React, { useState, useEffect } from 'react';
import { textToSpeech } from '../services/textToSpeech.js';
import { sarvamTTS } from '../services/sarvamTTS.js';

/**
 * Voice Selector Component
 * Let users:
 * 1. See all available voices (Local vs Network)
 * 2. Listen to voice samples
 * 3. Choose preferred voice for each language
 * 4. Adjust speech parameters (rate, pitch, volume)
 */
export function VoiceSelector() {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [voices, setVoices] = useState([]);
  const [currentVoice, setCurrentVoice] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [rate, setRate] = useState(0.95);
  const [pitch, setPitch] = useState(1.0);
  const [volume, setVolume] = useState(0.95);
  const [sarvamSupported, setSarvamSupported] = useState(false);
  const [testText, setTestText] = useState('');

  const languages = {
    'en': { name: 'English', sample: 'Hello, this is a voice test.' },
    'ta': { name: 'Tamil (தமிழ்)', sample: 'வணக்கம், இது ஒரு குரல் சோதனை.' },
    'te': { name: 'Telugu (తెలుగు)', sample: 'నమస్కారం, ఇది ఒక వాయిస్ టెస్ట్.' },
    'hi': { name: 'Hindi (हिन्दी)', sample: 'नमस्ते, यह एक वॉयस टेस्ट है।' },
    'kn': { name: 'Kannada (ಕನ್ನಡ)', sample: 'ನಮಸ್ಕಾರ, ಇದು ವಾಯಿಸ್ ಟೆಸ್ಟ್ ಆಗಿದೆ.' },
    'ml': { name: 'Malayalam (മലയാളം)', sample: 'നമസ്കാരം, ഇത് ഒരു വോയ്സ് ടെസ്റ്റാണ്.' },
    'mr': { name: 'Marathi (मराठी)', sample: 'नमस्कार, हा एक व्हॉयस टेस्ट आहे.' },
    'gu': { name: 'Gujarati (ગુજરાતી)', sample: 'નમસ્તે, આ એક વોઈસ ટેસ્ટ છે.' },
    'bn': { name: 'Bengali (বাংলা)', sample: 'নমস্কার, এটি একটি ভয়েস পরীক্ষা।' },
  };

  // Load voices
  useEffect(() => {
    const loadVoices = () => {
      const allVoices = textToSpeech?.availableVoices || [];
      setVoices(allVoices);
      
      // Check if Sarvam is available for this language
      const isSarvam = sarvamTTS?.isLanguageSupported(selectedLanguage);
      setSarvamSupported(!!isSarvam);
    };

    loadVoices();
    
    // Reload voices when they change
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [selectedLanguage]);

  // Set up callbacks
  useEffect(() => {
    textToSpeech.onStart = () => setIsSpeaking(true);
    textToSpeech.onEnd = () => setIsSpeaking(false);
  }, []);

  const filteredVoices = voices.filter(voice => {
    const voiceLang = voice.lang.toLowerCase().split('-')[0];
    return voiceLang === selectedLanguage;
  });

  const handleTestVoice = (voice) => {
    if (voice) {
      setCurrentVoice(voice);
      const sampleText = testText || languages[selectedLanguage]?.sample || 'Test voice';
      
      // Use Web Speech with this specific voice
      textToSpeech.selectVoiceByLanguage(selectedLanguage);
      textToSpeech.useWebSpeechSynthesis(sampleText, selectedLanguage, rate);
    }
  };

  const handleTestSarvam = () => {
    const sampleText = testText || languages[selectedLanguage]?.sample || 'Test voice';
    textToSpeech.speak(sampleText, selectedLanguage, rate);
  };

  const handleStop = () => {
    textToSpeech.stop();
    setIsSpeaking(false);
  };

  return (
    <div className="rounded-lg p-8 max-w-4xl mx-auto shadow-2xl border border-slate-700 bg-slate-800">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">🎤 Voice Selector</h2>
        <p className="text-slate-300">Test different voices and find your favorite for each language</p>
      </div>

      {/* Language Selection */}
      <div className="mb-8">
        <label className="block text-white font-semibold mb-3">Select Language:</label>
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
        >
          {Object.entries(languages).map(([code, { name }]) => (
            <option key={code} value={code}>{name}</option>
          ))}
        </select>
      </div>

      {/* Sarvam TTS Status */}
      {sarvamSupported && (
        <div className="mb-8 p-4 bg-emerald-900/30 border border-emerald-500/50 rounded-lg">
          <p className="text-emerald-300 font-semibold mb-3">
            ✅ Sarvam AI TTS Available for {languages[selectedLanguage]?.name}
          </p>
          <button
            onClick={handleTestSarvam}
            disabled={isSpeaking}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-600 text-white font-semibold rounded-lg transition"
          >
            {isSpeaking ? '🔊 Speaking...' : '🎙️ Test Sarvam AI Voice'}
          </button>
          <p className="text-emerald-200 text-sm mt-2">
            Sarvam provides natural, fluent voices for Indian languages - premium quality!
          </p>
        </div>
      )}

      {/* Test Text Input */}
      <div className="mb-8">
        <label className="block text-white font-semibold mb-3">Test Text (optional):</label>
        <input
          type="text"
          value={testText}
          onChange={(e) => setTestText(e.target.value)}
          placeholder={languages[selectedLanguage]?.sample}
          className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none placeholder-slate-400"
        />
        <p className="text-slate-400 text-sm mt-2">Leave empty to use sample text</p>
      </div>

      {/* Speech Parameters */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        <div>
          <label className="block text-white font-semibold mb-2">Speed (Rate):</label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={rate}
            onChange={(e) => {
              const newRate = parseFloat(e.target.value);
              setRate(newRate);
              textToSpeech.setRate(newRate);
            }}
            className="w-full"
          />
          <p className="text-emerald-400 text-sm mt-1">{rate.toFixed(1)}x</p>
        </div>

        <div>
          <label className="block text-white font-semibold mb-2">Pitch:</label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={pitch}
            onChange={(e) => {
              const newPitch = parseFloat(e.target.value);
              setPitch(newPitch);
              textToSpeech.setPitch(newPitch);
            }}
            className="w-full"
          />
          <p className="text-emerald-400 text-sm mt-1">{pitch.toFixed(1)}</p>
        </div>

        <div>
          <label className="block text-white font-semibold mb-2">Volume:</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => {
              const newVolume = parseFloat(e.target.value);
              setVolume(newVolume);
              textToSpeech.setVolume(newVolume);
            }}
            className="w-full"
          />
          <p className="text-emerald-400 text-sm mt-1">{(volume * 100).toFixed(0)}%</p>
        </div>
      </div>

      {/* Available Voices */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">
            Web Speech Voices ({filteredVoices.length})
          </h3>
          <button
            onClick={handleStop}
            disabled={!isSpeaking}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-slate-600 text-white font-semibold rounded-lg transition disabled:cursor-not-allowed"
          >
            ⏹️ Stop
          </button>
        </div>

        {filteredVoices.length === 0 ? (
          <div className="p-4 bg-amber-900/30 border border-amber-500/50 rounded-lg">
            <p className="text-amber-300">
              ⚠️ No Web Speech voices available for {languages[selectedLanguage]?.name}
            </p>
            <p className="text-amber-200 text-sm mt-2">
              {sarvamSupported ? 'Use Sarvam AI TTS above for high-quality voice.' : 'Try selecting another language.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredVoices.map((voice, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border-2 transition ${
                  currentVoice?.name === voice.name
                    ? 'bg-emerald-900/40 border-emerald-500'
                    : 'bg-slate-700/50 border-slate-600 hover:border-emerald-500'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <p className="text-white font-semibold">{voice.name}</p>
                    <p className="text-slate-300 text-sm">
                      {voice.localService ? '✅ Local (Better)' : '🌐 Network (Robotic)'} • {voice.lang}
                      {voice.default && ' • Default'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleTestVoice(voice)}
                    disabled={isSpeaking}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-600 text-white font-semibold rounded transition text-sm ml-4 whitespace-nowrap"
                  >
                    {isSpeaking && currentVoice?.name === voice.name ? '🔊 Playing...' : '▶️ Test'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg text-blue-300 text-sm">
        <p className="mb-2">
          <strong>💡 Pro Tips:</strong>
        </p>
        <ul className="list-disc list-inside space-y-1 text-blue-200">
          <li>For Indian languages, Sarvam AI provides much better quality than Web Speech</li>
          <li>Local voices are better than Network (Google) voices</li>
          <li>Rate 0.8-0.95 sounds most natural</li>
          <li>Use Pitch 0.95-1.05 for neutral tone</li>
        </ul>
      </div>
    </div>
  );
}

export default VoiceSelector;
