import { useSearchParams } from "react-router-dom";
import { products, categories } from "../data/products";
import ProductCard from "../components/ui/ProductCard";
import { useState, useEffect } from "react";
import SkeletonCard from "../components/ui/SkeletonCard";

const SORT_OPTIONS = [
  { label: "Latest",       value: "latest"     },
  { label: "Price: Low",   value: "price-asc"  },
  { label: "Price: High",  value: "price-desc" },
  { label: "Top Rated",    value: "rating"     },
  { label: "Most Reviews", value: "reviews"    },
];

export default function ProductListing() {

    const [loading, setLoading] = useState(true);

useEffect(() => {
  const t = setTimeout(() => setLoading(false), 800);
  return () => clearTimeout(t);
}, []);

  const [searchParams, setSearchParams] = useSearchParams();
  const [search,  setSearch]  = useState("");
  const [sort,    setSort]    = useState("latest");
  const [inStock, setInStock] = useState(false);

  const activeCategory = searchParams.get("category") || "all";

  const setCategory = (cat) => {
    if (cat === "all") searchParams.delete("category");
    else searchParams.set("category", cat);
    setSearchParams(searchParams);
  };

  const filtered = products
    .filter((p) => activeCategory === "all" || p.category === activeCategory)
    .filter((p) => !inStock || p.inStock)
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "price-asc")  return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "rating")     return b.rating - a.rating;
      if (sort === "reviews")    return b.reviews - a.reviews;
      return b.id - a.id;
    });

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>

      {/* Header */}
      <div style={{ borderBottom: "1px solid var(--border)", backgroundColor: "var(--bg-secondary)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--accent)" }}>
            Our Store
          </p>
          <h1 className="syne text-3xl sm:text-4xl" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
            All Products
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar */}
          <aside className="w-full lg:w-56 flex-shrink-0">

            {/* Search */}
            <div
              className="flex items-center gap-2 px-4 py-3 mb-6 rounded-xl transition-colors"
              style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}
            >
              <svg width="14" height="14" fill="none" stroke="var(--text-muted)" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent outline-none text-sm w-full"
                style={{ color: "var(--text-primary)", fontFamily: "'DM Sans', sans-serif" }}
              />
            </div>

            {/* Categories */}
            <div className="mb-6">
              <p className="text-[11px] uppercase tracking-widest font-semibold mb-3" style={{ color: "var(--text-muted)" }}>
                Category
              </p>
              <div className="flex flex-col gap-1">
                {[{ id: "all", label: "All Products" }, ...categories].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className="text-left px-3 py-2.5 rounded-xl text-sm transition-all duration-200"
                    style={
                      activeCategory === cat.id
                        ? { backgroundColor: "var(--accent-faint)", color: "var(--accent)", border: "1px solid var(--accent-border)" }
                        : { color: "var(--text-secondary)", border: "1px solid transparent" }
                    }
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* In stock */}
            <div className="mb-6">
              <p className="text-[11px] uppercase tracking-widest font-semibold mb-3" style={{ color: "var(--text-muted)" }}>
                Availability
              </p>
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => setInStock(!inStock)}
                  className="relative w-10 h-5 rounded-full transition-colors duration-200 cursor-pointer"
                  style={{
                    backgroundColor: inStock ? "var(--accent)" : "var(--bg-elevated)",
                    border: inStock ? "none" : "1px solid var(--border)",
                  }}
                >
                  <div
                    className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200"
                    style={{ transform: inStock ? "translateX(20px)" : "translateX(2px)" }}
                  />
                </div>
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>In stock only</span>
              </label>
            </div>

            {/* Sort */}
            <div>
              <p className="text-[11px] uppercase tracking-widest font-semibold mb-3" style={{ color: "var(--text-muted)" }}>
                Sort by
              </p>
              <div className="flex flex-col gap-1">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSort(opt.value)}
                    className="text-left px-3 py-2.5 rounded-xl text-sm transition-all duration-200"
                    style={
                      sort === opt.value
                        ? { backgroundColor: "var(--accent-faint)", color: "var(--accent)", border: "1px solid var(--accent-border)" }
                        : { color: "var(--text-secondary)", border: "1px solid transparent" }
                    }
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Grid */}
          {loading ? (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
    {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
  </div>
) : filtered.length > 0 ? (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
    {filtered.map((product) => (
      <ProductCard key={product.id} product={product} />
    ))}
  </div>
) : (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <div
      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
      style={{ backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border)" }}
    >
      <svg width="28" height="28" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/>
      </svg>
    </div>
    <p className="font-semibold text-lg mb-2" style={{ color: "var(--text-primary)" }}>
      No products found
    </p>
    <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
      Try adjusting your filters or search term
    </p>
    <button
      onClick={() => { setSearch(""); setCategory("all"); setInStock(false); }}
      className="text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-colors"
      style={{ backgroundColor: "var(--accent)" }}
    >
      Reset filters
    </button>
  </div>
)}
        </div>
      </div>
    </div>
  );
}