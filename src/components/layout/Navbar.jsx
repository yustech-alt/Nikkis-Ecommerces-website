import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useTheme } from "../../context/ThemeContext";

const NAV_LINKS = [
  { label: "Home",        path: "/"                          },
  { label: "Products",    path: "/products"                  },
  { label: "Headsets",    path: "/products?category=headsets"},
  { label: "Creams",      path: "/products?category=creams"  },
  { label: "Accessories", path: "/products?category=accessories" },
];

export default function Navbar() {
  const { cartCount }       = useCart();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        .nav-link-item {
          position: relative;
          color: var(--text-secondary);
          transition: color 0.25s;
          font-size: 13px;
          font-weight: 400;
          letter-spacing: 0.02em;
        }
        .nav-link-item::after {
          content: '';
          position: absolute;
          bottom: -4px; left: 0;
          width: 0; height: 2px;
          background: var(--accent);
          border-radius: 2px;
          transition: width 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .nav-link-item:hover,
        .nav-link-item.active { color: var(--text-primary); }
        .nav-link-item:hover::after,
        .nav-link-item.active::after { width: 100%; }
        .cart-btn {
          position: relative;
          background: var(--accent);
          border-radius: 10px;
          padding: 8px 16px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 500;
          color: #fff;
          transition: background 0.25s, transform 0.2s;
        }
        .cart-btn:hover { background: var(--accent-hover); transform: translateY(-1px); }
        .cart-badge {
          position: absolute;
          top: -6px; right: -6px;
          background: var(--danger);
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          width: 18px; height: 18px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          border: 2px solid var(--bg-primary);
        }
      `}</style>

      <nav
        style={{
          backgroundColor: scrolled ? "var(--bg-primary)" : "var(--bg-primary)",
          borderBottom: scrolled ? "1px solid var(--border)" : "none",
          backdropFilter: scrolled ? "blur(12px)" : "none",
        }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      >
        {/* Announcement bar */}
        <div style={{ backgroundColor: "var(--accent)" }} className="text-white text-center py-1.5 text-xs font-medium tracking-wide">
          🔥 Free delivery on orders over $50 — Limited time!
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 gap-4">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <div style={{ backgroundColor: "var(--accent)" }} className="w-8 h-8 rounded-lg flex items-center justify-center">
                <span className="syne text-white font-bold text-sm">N</span>
              </div>
              <span className="syne font-800 text-xl tracking-tight" style={{ color: "var(--text-primary)" }}>
                nikkis<span style={{ color: "var(--accent)" }}>.</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-7">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.label}
                  to={l.path}
                  className={`nav-link-item ${location.pathname === l.path ? "active" : ""}`}
                >
                  {l.label}
                </Link>
              ))}
            </div>

            {/* Search bar */}
            <div
              className="hidden md:flex items-center gap-2 flex-1 max-w-xs px-4 py-2.5 rounded-xl transition-colors"
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border)",
              }}
            >
              <svg width="14" height="14" fill="none" stroke="var(--text-muted)" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none text-sm w-full"
                style={{ color: "var(--text-primary)", fontFamily: "'DM Sans', sans-serif" }}
              />
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">

              {/* Mobile search */}
              <button
                className="md:hidden transition-colors"
                style={{ color: "var(--text-secondary)" }}
                onClick={() => setSearchOpen(!searchOpen)}
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/>
                </svg>
              </button>

              {/* Wishlist */}
              <button className="hidden sm:flex transition-colors" style={{ color: "var(--text-secondary)" }}>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                </svg>
              </button>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border)",
                  color: "var(--text-secondary)",
                }}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="5"/>
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                  </svg>
                ) : (
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
                  </svg>
                )}
              </button>

              {/* Cart */}
              <Link to="/cart" className="cart-btn">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
                <span className="hidden sm:inline">Cart</span>
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </Link>

              {/* Mobile menu toggle */}
              <button
                className="lg:hidden transition-colors ml-1"
                style={{ color: "var(--text-secondary)" }}
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  {menuOpen
                    ? <path d="M6 18L18 6M6 6l12 12"/>
                    : <path d="M4 6h16M4 12h16M4 18h16"/>}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile search */}
          {searchOpen && (
            <div className="md:hidden pb-3">
              <div
                className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl"
                style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
              >
                <svg width="14" height="14" fill="none" stroke="var(--text-muted)" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/>
                </svg>
                <input
                  autoFocus
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent outline-none text-sm w-full"
                  style={{ color: "var(--text-primary)", fontFamily: "'DM Sans', sans-serif" }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            className="lg:hidden px-4 py-4 flex flex-col gap-1"
            style={{ background: "var(--bg-primary)", borderTop: "1px solid var(--border)" }}
          >
            {NAV_LINKS.map((l) => (
              <Link
                key={l.label}
                to={l.path}
                className="px-3 py-3 rounded-lg text-sm transition-colors"
                style={{ color: "var(--text-secondary)" }}
              >
                {l.label}
              </Link>
            ))}
            <div className="flex gap-3 mt-2 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
              <button className="flex-1 text-center text-sm py-2 rounded-lg border transition-colors"
                style={{ color: "var(--text-secondary)", borderColor: "var(--border)" }}>
                Sign In
              </button>
              <button className="flex-1 text-center text-sm text-white py-2 rounded-lg transition-colors"
                style={{ backgroundColor: "var(--accent)" }}>
                Sign Up
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer */}
      <div className="h-[calc(64px+28px)]" />
    </>
  );
}