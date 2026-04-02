import { useEffect, useState } from 'react';
import { textToSpeech } from '../services/textToSpeech.js';

export function WelcomeTransition({ onComplete }) {
  const [isFullyVisible, setIsFullyVisible] = useState(false);
  const [startExit, setStartExit] = useState(false);

  useEffect(() => {
    // Speak welcome message
    const welcomeMessage = "Welcome to AisleMart. I'm your voice assistant. Ask me anything about our products!";
    textToSpeech.speak(welcomeMessage, 'en');

    // Show welcome text for 3.5 seconds
    const showTimer = setTimeout(() => {
      setIsFullyVisible(true);
    }, 300);

    const exitTimer = setTimeout(() => {
      setStartExit(true);
    }, 3500);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3800);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 bg-[#0B0E14] flex items-center justify-center z-40 transition-opacity duration-500 ${
        startExit ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Container */}
      <div className="flex flex-col items-center justify-center gap-12 px-6 max-w-2xl">
        
        {/* Main Welcome Text */}
        <div
          className={`text-center transition-all duration-700 transform ${
            isFullyVisible
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-95 translate-y-8'
          }`}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-emerald-400 mb-6 tracking-tight">
            Welcome to
            <br />
            <span className="text-white">AisleMart</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
            I'm your voice assistant.
            <br />
            Ask me anything about our products!
          </p>
        </div>

        {/* Animated line */}
        <div
          className={`w-24 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent rounded-full transition-all duration-700 ${
            isFullyVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-50'
          }`}
        ></div>

        {/* Background glow effect */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className={`w-96 h-96 rounded-full blur-3xl transition-opacity duration-700 ${
              isFullyVisible ? 'opacity-20' : 'opacity-0'
            }`}
            style={{
              backgroundColor: 'rgba(16, 185, 129, 0.3)',
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
