import { Link } from "react-router-dom";
import { categories } from "../../data/products";

export default function Categories() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
      <style>{`
        .category-card img { transition:transform 0.6s cubic-bezier(0.16,1,0.3,1); }
        .category-card:hover img { transform:scale(1.08); }
        .category-card { transition:transform 0.4s cubic-bezier(0.16,1,0.3,1); }
        .category-card:hover { transform:translateY(-6px); }
      `}</style>

      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--accent)" }}>
            Browse by
          </p>
          <h2 className="syne text-3xl sm:text-4xl" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
            Shop by Category
          </h2>
        </div>
        <Link to="/products" className="text-sm transition-colors hidden sm:block"
          style={{ color: "var(--text-muted)" }}>
          View all →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <Link key={cat.id} to={`/products?category=${cat.id}`}>
            <div
              className="category-card relative overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer"
              style={{ border: "1px solid var(--border)" }}
            >
              <img src={cat.img} alt={cat.label} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div
                className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
                style={{ background: `radial-gradient(circle at center, ${cat.color}22, transparent 70%)` }}
              />
              <div className="absolute top-4 left-4">
                <span
                  className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
                  style={{
                    background: cat.color + "22",
                    color: cat.color,
                    border: `1px solid ${cat.color}44`,
                  }}
                >
                  {cat.id === "headsets" ? "3 items" : cat.id === "creams" ? "3 items" : "2 items"}
                </span>
              </div>
              <div
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: cat.color + "33", border: `1px solid ${cat.color}55` }}
              >
                <svg width="14" height="14" fill="none" stroke={cat.color} strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
              <div className="absolute bottom-5 left-5">
                <p className="text-[11px] font-semibold uppercase tracking-widest mb-1" style={{ color: cat.color }}>
                  {cat.desc}
                </p>
                <h3 className="syne text-white text-xl" style={{ fontWeight: 700 }}>{cat.label}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}