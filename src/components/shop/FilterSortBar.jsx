const CATEGORIES = ['All', 'T-Shirts', 'Hoodies', 'Coats', 'Accessories'];

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
];

export default function FilterSortBar({ activeCategory, setActiveCategory, sortBy, setSortBy }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 font-barlow-condensed text-sm uppercase tracking-wider rounded-sm transition-colors ${
              activeCategory === cat
                ? 'bg-gold text-ink font-bold'
                : 'bg-white/5 text-cream/50 border border-cream/10 hover:text-cream hover:border-cream/20'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="bg-white/5 border border-cream/10 text-cream/60 font-barlow-condensed text-sm tracking-wider uppercase rounded-sm px-4 py-2 focus:outline-none focus:border-gold/40 cursor-pointer"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-ink text-cream">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}