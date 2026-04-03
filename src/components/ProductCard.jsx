export function ProductCard({ product, isFloating = false }) {
  return (
    <div className={`group transition-all duration-500 rounded-3xl overflow-hidden relative ${
      isFloating 
        ? 'w-full min-w-[320px] shadow-2xl shadow-black/50 border border-white/20' 
        : 'h-full bg-slate-900/40 border border-white/5 hover:border-emerald-500/50 hover:bg-slate-800/60'
    }`}>
      {/* Design Accents */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-500/20 transition-all duration-700" />
      
      <div className="relative p-6 flex flex-col h-full z-10">
        {/* Floating Emoji with Glass Circle */}
        <div className="relative mb-6 self-start">
          <div className="absolute inset-0 bg-white/5 rounded-full blur-sm scale-150 group-hover:bg-emerald-500/10 transition-all duration-500" />
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-4xl shadow-lg border border-white/10 backdrop-blur-md transform -rotate-6 group-hover:rotate-0 transition-transform duration-500">
            {product.emoji}
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-black text-emerald-400/90 uppercase tracking-[0.2em] px-3 py-1 rounded-lg bg-emerald-400/10 border border-emerald-400/20 inline-block">
              AISLE {product.aisle} &bull; FRESH STOCK
            </span>
          </div>

          <h3 className="text-white font-bold text-2xl tracking-tight group-hover:text-emerald-300 transition-colors mb-4">
            {product.name}
          </h3>

          <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Standard Net Quantity</span>
              <span className="text-gray-200 text-sm font-semibold">{product.unit}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-emerald-500/80 font-black block mb-1">MRP INCL. TAXES</span>
              <div className="flex items-baseline gap-1">
                <span className="text-emerald-400 font-black text-2xl">₹</span>
                <span className="text-white font-black text-3xl tracking-tighter">{product.price}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Bottom Border */}
      <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 via-blue-500 to-emerald-500 bg-[length:200%_auto] animate-gradient-x transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
    </div>
  );
}
