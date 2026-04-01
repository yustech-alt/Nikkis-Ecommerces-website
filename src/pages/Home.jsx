import Hero from "../components/sections/Hero";
import Categories from "../components/sections/Categories";
import FeaturedProducts from "../components/sections/FeaturedProducts";
import Testimonials from "../components/sections/Testimonials";

export default function Home() {
  return (
    <main className="bg-[var(--bg-primary)] min-h-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        .syne { font-family: 'Syne', sans-serif; }
        * { font-family: 'DM Sans', sans-serif; }
        @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
      `}</style>

      <Hero />

      {/* Marquee strip */}
      <div className="border-y border-[var(--bg-elevated)] bg-[var(--bg-secondary)] py-3 overflow-hidden">
        <div
          className="flex whitespace-nowrap"
          style={{ animation: "marquee 25s linear infinite" }}
        >
          {[...Array(8)].map((_, i) => (
            <span
              key={i}
              className="text-[var(--text-faint)] text-xs font-medium tracking-widest uppercase px-10"
            >
              Free Delivery Over $50 &nbsp;·&nbsp; Secure Payments &nbsp;·&nbsp; 30-Day Returns &nbsp;·&nbsp; Authentic Products &nbsp;·&nbsp; 24/7 Support
            </span>
          ))}
        </div>
      </div>

      <Categories />
      <FeaturedProducts />
      <Testimonials />
    </main>
  );
}