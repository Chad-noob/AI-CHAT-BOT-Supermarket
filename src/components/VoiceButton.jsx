export function VoiceButton({
  onClick,
  isListening,
  isProcessing,
  disabled = false,
}) {
  return (
    <div className="flex flex-col items-center justify-center">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`
          w-24 h-24 rounded-full flex items-center justify-center relative
          transition-all duration-300
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105 active:scale-95'}
          ${isListening
            ? 'bg-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.6)] ring-4 ring-emerald-400/30'
            : isProcessing
              ? 'bg-amber-500 shadow-[0_0_40px_rgba(245,158,11,0.6)] ring-4 ring-amber-400/30 animate-pulse'
              : 'bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.4)]'
          }
        `}
      >
        <span className="text-4xl relative z-10">🎤</span>

        {isListening && (
          <>
            <div className="absolute inset-0 rounded-full bg-emerald-400 opacity-40 animate-ping" style={{ animationDuration: '1.5s' }}></div>
            <div className="absolute inset-0 rounded-full bg-emerald-300 opacity-20 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.2s' }}></div>
          </>
        )}
      </button>

      <div className="mt-4 flex items-center gap-2 text-gray-400 text-sm">
        {isListening ? (
          <>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Listening...
          </>
        ) : isProcessing ? (
          <>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            Processing...
          </>
        ) : (
          <>
            <span className="text-gray-500">🪄</span>
            Tap to speak
          </>
        )}
      </div>
    </div>
  );
}

export default VoiceButton;
