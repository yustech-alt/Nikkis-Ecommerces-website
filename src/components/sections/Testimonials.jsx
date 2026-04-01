import { useState, useEffect } from "react";
import StarRating from "../ui/StarRating";

const testimonials = [
  {
    name: "Chisom A.", role: "Verified Buyer", product: "Nikkis Pro X Headset",
    text: "Got the Pro X headset and I literally can't take it off. Bass is insane, delivery was super fast. Nikkis is the real deal.",
    rating: 5,
  },
  {
    name: "Tunde M.", role: "Verified Buyer", product: "GlowVita Face Cream",
    text: "The GlowVita cream cleared my skin in two weeks. I've tried so many products — this one actually works. Will be ordering again.",
    rating: 5,
  },
  {
    name: "Fatima K.", role: "Verified Buyer", product: "PowerCore 20000 Bank",
    text: "PowerCore bank is slim, charges fast and lasts forever. Great price too. My whole family uses Nikkis now.",
    rating: 5,
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setActive((p) => (p + 1) % testimonials.length), 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section style={{ backgroundColor: "var(--bg-secondary)" }} className="py-20">
      <style>{`
        @keyframes tEnter { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .t-enter { animation: tEnter 0.5s cubic-bezier(0.16,1,0.3,1) forwards; }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--accent)" }}>
            Real Reviews
          </p>
          <h2 className="syne text-3xl sm:text-4xl" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
            What Customers Say
          </h2>
        </div>

        <div className="max-w-2xl mx-auto">
          <div
            key={active}
            className="t-enter rounded-2xl p-8 text-center"
            style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}
          >
            <StarRating rating={testimonials[active].rating} size={16} />
            <p className="text-base sm:text-lg leading-relaxed mt-5 mb-6 italic"
              style={{ color: "var(--text-secondary)" }}>
              "{testimonials[active].text}"
            </p>
            <div className="flex items-center justify-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: "var(--accent-faint)",
                  border: "1px solid var(--accent-border)",
                }}
              >
                <span className="syne font-bold text-sm" style={{ color: "var(--accent)" }}>
                  {testimonials[active].name[0]}
                </span>
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                  {testimonials[active].name}
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {testimonials[active].role} · {testimonials[active].product}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === active ? "24px" : "8px",
                  height: "8px",
                  backgroundColor: i === active ? "var(--accent)" : "var(--border)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-20">
          {[
            { icon: <path d="M5 12h14M12 5l7 7-7 7"/>,                title: "Fast Delivery",   desc: "2–5 business days"   },
            { icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>, title: "Secure Payments", desc: "100% protected"      },
            { icon: <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>, title: "Easy Returns",   desc: "30-day policy"       },
            { icon: <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>, title: "24/7 Support", desc: "Always here for you" },
          ].map((b) => (
            <div
              key={b.title}
              className="flex flex-col items-center text-center rounded-2xl p-6 transition-colors"
              style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: "var(--accent-faint)", border: "1px solid var(--accent-border)" }}
              >
                <svg width="20" height="20" fill="none" stroke="var(--accent)" strokeWidth="1.8" viewBox="0 0 24 24">
                  {b.icon}
                </svg>
              </div>
              <p className="syne text-sm font-600 mb-1" style={{ color: "var(--text-primary)", fontWeight: 600 }}>{b.title}</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}