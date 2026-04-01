import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { products } from "../../data/products";

function Counter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref     = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const step = (target / 1800) * 16;
          const timer = setInterval(() => {
            start += step;
            if (start >= target) { setCount(target); clearInterval(timer); }
            else setCount(Math.floor(start));
          }, 16);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function Hero() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      className="relative min-h-[90vh] flex items-center overflow-hidden px-4 sm:px-6"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <style>{`
        .hero-fade { opacity:0; transform:translateY(24px); transition:opacity 0.8s ease,transform 0.8s cubic-bezier(0.16,1,0.3,1); }
        .hero-fade.in { opacity:1; transform:translateY(0); }
        .pulse-ring { position:absolute;inset:-8px;border-radius:9999px;border:2px solid var(--accent);animation:pulseRing 2s ease-out infinite; }
        @keyframes pulseRing { 0%{opacity:0.6;transform:scale(1)} 100%{opacity:0;transform:scale(1.4)} }
      `}</style>

      {/* Blobs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none"
        style={{ backgroundColor: "var(--accent-faint)" }} />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none"
        style={{ backgroundColor: "rgba(99,102,241,0.08)" }} />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-16">

        {/* Left */}
        <div>
          <div className={`hero-fade ${visible ? "in" : ""}`} style={{ transitionDelay: "0.05s" }}>
            <span
              className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full mb-6"
              style={{
                backgroundColor: "var(--accent-faint)",
                border: "1px solid var(--accent-border)",
                color: "var(--accent)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "var(--accent)" }} />
              New Arrivals Every Week
            </span>
          </div>

          <div className={`hero-fade ${visible ? "in" : ""}`} style={{ transitionDelay: "0.15s" }}>
            <h1 className="syne text-5xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight mb-6"
              style={{ color: "var(--text-primary)", fontWeight: 800 }}>
              Shop Smart.<br />
              <span style={{
                color: "transparent",
                backgroundImage: "linear-gradient(to right, var(--accent), #6366f1)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
              }}>
                Live Bold.
              </span>
            </h1>
          </div>

          <div className={`hero-fade ${visible ? "in" : ""}`} style={{ transitionDelay: "0.25s" }}>
            <p className="text-base sm:text-lg leading-relaxed max-w-md mb-8"
              style={{ color: "var(--text-secondary)" }}>
              Headsets that hit different. Skincare that works. Accessories built for your lifestyle. All in one place — all at the right price.
            </p>
          </div>

          <div className={`hero-fade flex flex-wrap gap-3 ${visible ? "in" : ""}`} style={{ transitionDelay: "0.35s" }}>
            <Link
              to="/products"
              className="font-semibold px-7 py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 text-sm text-white"
              style={{ backgroundColor: "var(--accent)" }}
            >
              Shop Now
            </Link>
            <Link
              to="/products?category=headsets"
              className="font-medium px-7 py-3.5 rounded-xl transition-all duration-200 text-sm"
              style={{
                backgroundColor: "var(--bg-elevated)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
              }}
            >
              View Headsets
            </Link>
          </div>

          {/* Stats */}
          <div
            className={`hero-fade flex gap-8 mt-10 pt-8 ${visible ? "in" : ""}`}
            style={{ transitionDelay: "0.45s", borderTop: "1px solid var(--border)" }}
          >
            {[
              { value: 12000, suffix: "+", label: "Happy Customers" },
              { value: 500,   suffix: "+", label: "Products"        },
              { value: 98,    suffix: "%", label: "Satisfaction"    },
            ].map((s) => (
              <div key={s.label}>
                <p className="syne text-2xl font-700" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
                  <Counter target={s.value} suffix={s.suffix} />
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right — collage */}
        <div className={`hero-fade relative hidden lg:flex items-center justify-center ${visible ? "in" : ""}`}
          style={{ transitionDelay: "0.2s" }}>
          <div className="relative w-[420px] h-[420px]">
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-3xl overflow-hidden z-20"
              style={{ border: "2px solid var(--accent-border)", boxShadow: "0 0 60px var(--accent-faint)" }}
            >
              <img src={products[0].images[0]} alt="featured" className="w-full h-full object-cover" />
            </div>

            {[
              { img: products[2].images[0], cls: "top-4 left-4 w-28 h-28",    delay: "0.5s"  },
              { img: products[4].images[0], cls: "top-4 right-4 w-24 h-24",   delay: "1s"    },
              { img: products[6].images[0], cls: "bottom-4 left-8 w-24 h-24", delay: "1.5s"  },
              { img: products[1].images[0], cls: "bottom-4 right-4 w-28 h-28",delay: "0.8s"  },
            ].map((f, i) => (
              <div key={i}
                className={`absolute ${f.cls} rounded-2xl overflow-hidden z-10`}
                style={{
                  border: "1px solid var(--border)",
                  animation: `float 4s ease-in-out ${f.delay} infinite`,
                }}
              >
                <img src={f.img} alt="" className="w-full h-full object-cover" />
              </div>
            ))}

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full z-0"
              style={{ border: "1px solid var(--accent-border)" }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full z-0"
              style={{ border: "1px solid rgba(99,102,241,0.05)" }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-3xl z-10 pointer-events-none">
              <div className="pulse-ring" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}