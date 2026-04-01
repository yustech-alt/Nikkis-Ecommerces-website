import { useState, useEffect } from "react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 left-6 z-50 w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
      style={{
        backgroundColor: "var(--accent)",
        boxShadow: "0 4px 20px rgba(168,85,247,0.4)",
      }}
      aria-label="Back to top"
    >
      <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
        <path d="M18 15l-6-6-6 6"/>
      </svg>
    </button>
  );
}