import { Link } from "react-router-dom";

const footerLinks = {
  Shop: [
    { label: "All Products",  path: "/products"                       },
    { label: "Headsets",      path: "/products?category=headsets"     },
    { label: "Creams",        path: "/products?category=creams"       },
    { label: "Accessories",   path: "/products?category=accessories"  },
  ],
  Support: [
    { label: "FAQ",           path: "#" },
    { label: "Shipping Info", path: "#" },
    { label: "Returns",       path: "#" },
    { label: "Track Order",   path: "#" },
  ],
  Company: [
    { label: "About Us",      path: "#" },
    { label: "Careers",       path: "#" },
    { label: "Blog",          path: "#" },
    { label: "Contact",       path: "#" },
  ],
};

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "var(--bg-secondary)", borderTop: "1px solid var(--border)" }}>

      {/* Newsletter */}
      <div style={{ backgroundColor: "var(--accent-faint)", borderBottom: "1px solid var(--accent-border)" }}>
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-semibold text-lg mb-1" style={{ color: "var(--text-primary)" }}>
              Get deals before anyone else
            </h3>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Join 12,000+ shoppers getting weekly drops and exclusive offers.
            </p>
          </div>
          <div
            className="flex w-full md:w-auto rounded-xl overflow-hidden transition-colors"
            style={{ border: "1px solid var(--border)" }}
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="text-sm px-4 py-3 outline-none w-full md:w-64"
              style={{
                backgroundColor: "var(--bg-card)",
                color: "var(--text-primary)",
                fontFamily: "'DM Sans', sans-serif",
              }}
            />
            <button
              className="text-white text-sm font-medium px-5 py-3 flex-shrink-0 transition-colors"
              style={{ backgroundColor: "var(--accent)" }}
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "var(--accent)" }}>
              <span className="text-white font-bold text-sm syne">N</span>
            </div>
            <span className="syne font-bold text-xl" style={{ color: "var(--text-primary)" }}>
              nikkis<span style={{ color: "var(--accent)" }}>.</span>
            </span>
          </Link>
          <p className="text-sm leading-relaxed max-w-[200px]" style={{ color: "var(--text-muted)" }}>
            Your go-to store for headsets, skincare, and everyday accessories. Quality you can feel.
          </p>
          <div className="flex gap-3 mt-5">
            {[
              <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M6.5 6.5h11a1 1 0 011 1v11a1 1 0 01-1 1h-11a1 1 0 01-1-1v-11a1 1 0 011-1z"/>,
              <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>,
              <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>,
            ].map((icon, i) => (
              <button
                key={i}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
                style={{
                  backgroundColor: "var(--bg-elevated)",
                  border: "1px solid var(--border)",
                  color: "var(--text-muted)",
                }}
              >
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  {icon}
                </svg>
              </button>
            ))}
          </div>
        </div>

        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title}>
            <h4 className="font-semibold text-sm mb-4 tracking-wide" style={{ color: "var(--text-primary)" }}>
              {title}
            </h4>
            <ul className="space-y-3">
              {links.map((l) => (
                <li key={l.label}>
                  <Link to={l.path} className="text-sm transition-colors" style={{ color: "var(--text-muted)" }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid var(--border)" }}>
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: "var(--text-faint)" }}>
            © 2025 Nikkis. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            {["Visa", "Mastercard", "PayPal"].map((p) => (
              <span
                key={p}
                className="text-[10px] px-2.5 py-1 rounded font-medium"
                style={{ backgroundColor: "var(--bg-elevated)", color: "var(--text-muted)" }}
              >
                {p}
              </span>
            ))}
          </div>
          <div className="flex gap-4">
            {["Privacy", "Terms", "Cookies"].map((l) => (
              <a key={l} href="#" className="text-xs transition-colors" style={{ color: "var(--text-faint)" }}>
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}