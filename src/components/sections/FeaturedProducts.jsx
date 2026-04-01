import { Link } from "react-router-dom";
import { products } from "../../data/products";
import ProductCard from "../ui/ProductCard";

export default function FeaturedProducts() {
  const featured = products.slice(0, 4);

  return (
    <section style={{ backgroundColor: "var(--bg-secondary)" }} className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--accent)" }}>
              Handpicked
            </p>
            <h2 className="syne text-3xl sm:text-4xl" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
              Featured Products
            </h2>
          </div>
          <Link to="/products" className="text-sm transition-colors hidden sm:block"
            style={{ color: "var(--text-muted)" }}>
            See all →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 font-medium px-8 py-3.5 rounded-xl transition-all duration-200 text-sm"
            style={{
              backgroundColor: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
            }}
          >
            View All Products
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Promo banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-20">
        <div
          className="relative overflow-hidden rounded-3xl p-10 sm:p-14"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--accent-border)",
          }}
        >
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full blur-[80px] pointer-events-none"
            style={{ backgroundColor: "var(--accent-faint)" }} />
          <div className="absolute bottom-0 left-0 w-[200px] h-[200px] rounded-full blur-[60px] pointer-events-none"
            style={{ backgroundColor: "rgba(99,102,241,0.08)" }} />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
            <div>
              <span className="inline-block text-white text-xs font-bold px-3 py-1 rounded-full mb-4 tracking-wide"
                style={{ backgroundColor: "var(--danger)" }}>
                LIMITED OFFER
              </span>
              <h2 className="syne text-3xl sm:text-5xl mb-3 leading-tight"
                style={{ color: "var(--text-primary)", fontWeight: 800 }}>
                Up to{" "}
                <span style={{
                  color: "transparent",
                  backgroundImage: "linear-gradient(to right, var(--accent), #6366f1)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                }}>
                  40% Off
                </span>
                <br />on Headsets
              </h2>
              <p className="text-sm max-w-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Don't sleep on these deals. Premium audio at prices that actually make sense.
              </p>
            </div>
            <Link
              to="/products?category=headsets"
              className="flex-shrink-0 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5 text-sm whitespace-nowrap"
              style={{ backgroundColor: "var(--accent)" }}
            >
              Shop Headsets →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}