import React from 'react';
import { ProductCard } from './ProductCard';
import { LanguageToggle } from './LanguageToggle';

export function VoiceAssistantUI({ 
  transcript, 
  response, 
  language, 
  processing, 
  listening, 
  toggleListening,
  selectedLanguage,
  onLanguageChange,
  foundProduct
}) {
  return (
    <div className="fixed inset-0 bg-[#0B0E14] z-50 flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-indigo-900/20 to-transparent pointer-events-none"></div>

      {/* Top Navigation / Status */}
      <div className="absolute top-8 left-8 right-8 flex justify-between items-center animate-fade-in z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform rotate-3">
            <span className="text-white font-black italic text-xl">A</span>
          </div>
          <div>
            <h1 className="text-white font-bold tracking-tight text-xl">Aisle<span className="text-indigo-400">Mart</span></h1>
            <div className="flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${listening ? 'bg-emerald-500 animate-pulse' : 'bg-gray-500'}`}></span>
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">
                {listening ? 'Listening' : 'Standby'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-md flex items-center gap-3">
            <span className="text-xs text-gray-400 whitespace-nowrap">Switch Language:</span>
            <LanguageToggle 
              currentLanguage={selectedLanguage} 
              onLanguageChange={onLanguageChange} 
            />
          </div>
        </div>
      </div>

      {/* Main Interaction Area */}
      <div className="w-full max-w-4xl flex flex-col items-center justify-center relative z-10">
        
        {/* User Transcript (Top Float) */}
        <div className={`transition-all duration-700 mb-12 text-center max-w-2xl ${transcript ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
           <p className="text-indigo-300/80 text-lg font-medium italic">"{transcript}"</p>
        </div>

        {/* Central Assistant State */}
        <div className="relative mb-16">
          {/* Animated Ripples when listening */}
          {listening && (
            <>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-500/20 rounded-full animate-ping scale-150"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full animate-ping delay-300 scale-125"></div>
            </>
          )}

          {/* Mic Button */}
          <button 
            onClick={toggleListening}
            className={`relative z-20 w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl ${
              listening 
                ? 'bg-indigo-600 scale-110 shadow-indigo-500/40 ring-4 ring-indigo-500/20' 
                : 'bg-white/10 hover:bg-white/15 hover:scale-105 border border-white/10'
            }`}
          >
            {processing ? (
              <div className="flex gap-1.5">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            ) : (
              <svg 
                className={`w-12 h-12 transition-colors ${listening ? 'text-white' : 'text-indigo-400'}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            )}
          </button>
        </div>

        {/* Response Area */}
        <div className="text-center space-y-8 w-full">
          {!response && !transcript && !processing && (
            <h2 className="text-4xl md:text-5xl font-light text-white tracking-tight animate-fade-in">
              What can I <span className="font-semibold text-indigo-400 italic">help you</span> with today?
            </h2>
          )}

          {response && (
             <div className="animate-slide-up bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl max-w-3xl mx-auto shadow-2xl relative group overflow-hidden">
                <div className="absolute -left-1 top-0 bottom-0 w-1 bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
                <p className="text-2xl md:text-3xl text-gray-100 font-light leading-relaxed">
                  {response}
                </p>
             </div>
          )}

          {/* Dynamic Product Reveal */}
          {foundProduct && (
            <div className="mt-12 animate-slide-up [animation-delay:400ms] flex justify-center">
              <div className="w-[280px] transform hover:scale-105 transition-transform duration-500 shadow-2xl shadow-indigo-500/20 rounded-2xl overflow-hidden ring-1 ring-white/20">
                 {foundProduct}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-10 left-0 w-full text-center">
        <p className="text-[10px] text-gray-500 uppercase tracking-[0.5em] font-medium">AisleMart Premium Retail OS • v2.0</p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 1s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}} />
    </div>
  );
}
