import { useState, useEffect } from 'react';

export function GreetingAnimation({ onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const greetings = [
    { text: 'Hello', lang: 'English', code: 'en' },
    { text: 'வணக்கம்', lang: 'Tamil', code: 'ta' },
    { text: 'హలో', lang: 'Telugu', code: 'te' },
    { text: 'നമസ്കാരം', lang: 'Malayalam', code: 'ml' },
    { text: 'नमस्ते', lang: 'Hindi', code: 'hi' },
    { text: 'नमस्कार', lang: 'Marathi', code: 'mr' },
    { text: 'ನಮಸ್ಕಾರ', lang: 'Kannada', code: 'kn' },
    { text: 'নমস্কার', lang: 'Bengali', code: 'bn' },
    { text: 'ગુજરાતી', lang: 'Gujarati', code: 'gu' },
  ];

  useEffect(() => {
    if (currentIndex >= greetings.length) {
      // All greetings shown, complete the animation
      setTimeout(() => {
        onComplete();
      }, 800);
      return;
    }

    // Show greeting for 500ms
    const showTimer = setTimeout(() => {
      setIsVisible(false);
    }, 500);

    // Move to next greeting after 600ms (includes fade out)
    const nextTimer = setTimeout(() => {
      setIsVisible(true);
      setCurrentIndex(currentIndex + 1);
    }, 600);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(nextTimer);
    };
  }, [currentIndex, greetings.length, onComplete]);

  const greeting = greetings[currentIndex];

  return (
    <div className="fixed inset-0 bg-[#0B0E14] flex items-center justify-center z-50">
      {/* Container with glow effect */}
      <div className="relative flex flex-col items-center justify-center gap-8">
        
        {/* Main greeting display with smooth fade */}
        <div className="flex flex-col items-center gap-4">
          <div
            className={`text-7xl font-bold tracking-wider transition-all duration-500 ${
              isVisible
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-95'
            }`}
            style={{
              color: '#10B981',
              textShadow: '0 0 30px rgba(16, 185, 129, 0.5)',
            }}
          >
            {greeting?.text}
          </div>

          {/* Language label */}
          <div
            className={`text-lg text-gray-400 font-medium transition-all duration-500 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {greeting?.lang}
          </div>
        </div>

        {/* Progress indicator - dots */}
        <div className="flex gap-2">
          {greetings.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx < currentIndex
                  ? 'bg-emerald-400 w-6'
                  : idx === currentIndex
                  ? 'bg-emerald-400 w-6 animate-pulse'
                  : 'bg-gray-600 w-1.5'
              }`}
            ></div>
          ))}
        </div>

        {/* Background glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div 
            className="w-72 h-72 rounded-full blur-3xl animate-pulse"
            style={{
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
