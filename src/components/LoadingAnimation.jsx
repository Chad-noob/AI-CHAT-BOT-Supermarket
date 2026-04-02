export function LoadingAnimation() {
  return (
    <div className="fixed inset-0 bg-[#0B0E14] flex items-center justify-center z-50">
      {/* Main Container */}
      <div className="flex flex-col items-center justify-center gap-8">
        
        {/* Animated Spinner */}
        <div className="relative w-24 h-24">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-400 border-r-emerald-300 animate-spin" style={{ animationDuration: '2s' }}></div>
          
          {/* Middle pulsing ring */}
          <div className="absolute inset-2 rounded-full border-2 border-emerald-400/30 animate-pulse"></div>
          
          {/* Inner rotating ring (opposite direction) */}
          <div className="absolute inset-4 rounded-full border-2 border-transparent border-b-blue-400 border-l-blue-300 animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }}></div>
          
          {/* Center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          </div>
        </div>

        {/* Loading Text with animation */}
        <div className="text-center">
          <p className="text-emerald-400 font-medium text-lg tracking-wider mb-2">
            Processing
          </p>
          
          {/* Animated dots */}
          <div className="flex items-center justify-center gap-1 h-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0s' }}></span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0.3s' }}></span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0.6s' }}></span>
          </div>
        </div>

        {/* Background glow effect */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-48 h-48 rounded-full bg-emerald-400/5 blur-3xl animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
