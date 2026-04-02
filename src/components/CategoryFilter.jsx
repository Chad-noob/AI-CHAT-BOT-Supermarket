import { categories } from '../utils/products';

export function CategoryFilter({ activeCategory, onSelectCategory }) {
  return (
    <div className="flex overflow-x-auto hide-scrollbar gap-2 py-2 mb-6 w-full">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 border ${
            activeCategory === category.id
              ? 'bg-[#1e283b] text-blue-400 border-blue-500/50 shadow-sm shadow-blue-500/20'
              : 'bg-[#151b27] text-gray-400 border-transparent hover:bg-[#1e2634] hover:text-gray-300'
          }`}
        >
          {category.emoji && <span className="text-base">{category.emoji}</span>}
          {category.name}
        </button>
      ))}
    </div>
  );
}
