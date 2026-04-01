import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ message, type = "success", duration = 3000 }) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      {/* Toast container */}
      <div
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          maxWidth: "340px",
          width: "100%",
        }}
      >
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function Toast({ toast, onRemove }) {
  const icons = {
    success: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path d="M20 6L9 17l-5-5"/>
      </svg>
    ),
    error: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path d="M18 6L6 18M6 6l12 12"/>
      </svg>
    ),
    info: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
    warning: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
  };

  const colors = {
    success: { bg: "#0f2a1a", border: "#22c55e40", icon: "#22c55e", text: "#86efac" },
    error:   { bg: "#2a0f0f", border: "#f43f5e40", icon: "#f43f5e", text: "#fda4af" },
    info:    { bg: "#0f1a2a", border: "#a855f740", icon: "#a855f7", text: "#d8b4fe" },
    warning: { bg: "#2a1f0f", border: "#f59e0b40", icon: "#f59e0b", text: "#fcd34d" },
  };

  const c = colors[toast.type] || colors.success;

  return (
    <div
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: "14px",
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        animation: "toastIn 0.35s cubic-bezier(0.16,1,0.3,1)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      }}
    >
      <style>{`
        @keyframes toastIn {
          from { opacity:0; transform:translateX(20px) scale(0.95); }
          to   { opacity:1; transform:translateX(0) scale(1); }
        }
      `}</style>

      <div style={{ color: c.icon, flexShrink: 0 }}>{icons[toast.type]}</div>

      <p style={{
        color: c.text,
        fontSize: "13px",
        fontWeight: 500,
        flex: 1,
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {toast.message}
      </p>

      <button
        onClick={() => onRemove(toast.id)}
        style={{ color: c.icon, opacity: 0.6, flexShrink: 0, lineHeight: 1 }}
      >
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}