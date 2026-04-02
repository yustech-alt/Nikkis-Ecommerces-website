import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ADMIN_PASSWORD = "nikkis2025";

export default function AdminLogin() {
  const navigate  = useNavigate();
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [show,     setShow]     = useState(false);

 const isAuth = localStorage.getItem("nikkis_admin") === "true";

useEffect(() => {
  if (isAuth) {
    navigate("/admin/dashboard");
  }
}, [isAuth]);

if (isAuth) return null;

  const handleLogin = async () => {
    if (!password.trim()) { setError("Please enter the admin password"); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    if (password === ADMIN_PASSWORD) {
      localStorage.setItem("nikkis_admin", "true");
      navigate("/admin/dashboard");
    } else {
      setError("Incorrect password. Try again.");
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "#0a0a0a", fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        .syne { font-family: 'Syne', sans-serif; }
      `}</style>

      <div
        className="w-full max-w-sm rounded-2xl p-8"
        style={{ backgroundColor: "#111111", border: "1px solid #1f1f1f" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "#a855f7" }}>
            <span className="syne text-white font-bold">N</span>
          </div>
          <div>
            <p className="syne font-700 text-white text-lg leading-none" style={{ fontWeight: 700 }}>
              nikkis<span style={{ color: "#a855f7" }}>.</span>
            </p>
            <p className="text-xs mt-0.5" style={{ color: "#52525b" }}>Admin Access</p>
          </div>
        </div>

        <h1 className="syne text-2xl font-700 text-white mb-2" style={{ fontWeight: 700 }}>
          Welcome back
        </h1>
        <p className="text-sm mb-8" style={{ color: "#71717a" }}>
          Enter your admin password to continue.
        </p>

        {/* Password input */}
        <div className="mb-4">
          <label className="block text-xs font-medium uppercase tracking-widest mb-2"
            style={{ color: "#52525b" }}>
            Password
          </label>
          <div
            className="flex items-center gap-2 rounded-xl px-4"
            style={{
              backgroundColor: "#1a1a1a",
              border: `1px solid ${error ? "#f43f5e" : "#2a2a2a"}`,
            }}
          >
            <input
              type={show ? "text" : "password"}
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="flex-1 bg-transparent outline-none py-3 text-sm"
              style={{ color: "#ffffff", fontFamily: "'DM Sans', sans-serif" }}
            />
            <button
              onClick={() => setShow(!show)}
              style={{ color: "#52525b" }}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                {show
                  ? <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
                  : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                }
              </svg>
            </button>
          </div>
          {error && (
            <p className="text-xs mt-2" style={{ color: "#f43f5e" }}>{error}</p>
          )}
        </div>

        {/* Login button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all"
          style={{ backgroundColor: loading ? "#7c3aed" : "#a855f7" }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin" width="16" height="16" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/>
                <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Logging in...
            </span>
          ) : "Login to Admin"}
        </button>

        <p className="text-center text-xs mt-6" style={{ color: "#3f3f46" }}>
          Nikkis Admin Panel · Restricted Access
        </p>
      </div>
    </div>
  );
}