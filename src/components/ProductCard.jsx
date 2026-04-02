export function ProductCard({ product }) {
  return (
    <div className="bg-[#13161f] border border-[#212530] rounded-2xl p-4 flex flex-col h-full hover:border-[#323847] transition-colors relative overflow-hidden group">
      {/* Product Image/Emoji */}
      <div className="text-4xl mb-3 mt-1">
        {product.emoji}
      </div>

      <div className="flex-1 flex flex-col justify-start">
        <h3 className="text-white font-medium text-sm lg:text-base leading-tight">
          {product.name}
        </h3>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-amber-500 font-bold text-[#e18e38]">₹{product.price}</span>
          <span className="text-gray-400 text-xs">/ {product.unit}</span>
        </div>
        <div className="mt-1 text-xs text-gray-500">
          Aisle {product.aisle}
        </div>
      </div>
    </div>
  );
}
