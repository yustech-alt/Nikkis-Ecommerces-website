import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const NAV = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>,
  },
  {
    label: "Orders",
    path: "/admin/orders",
    icon: <><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></>,
  },
  {
    label: "Products",
    path: "/admin/products",
    icon: <><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></>,
  },
  {
    label: "Customers",
    path: "/admin/customers",
    icon: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></>,
  },
];

export default function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("nikkis_admin");
    navigate("/admin");
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}
      className="min-h-screen flex" style={{ backgroundColor: "#0a0a0a" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        .admin-nav-link { transition: all 0.2s; }
        .admin-nav-link:hover { background: rgba(168,85,247,0.1); color: #a855f7; }
        .admin-nav-link.active { background: rgba(168,85,247,0.15); color: #a855f7; border-left: 2px solid #a855f7; }
      `}</style>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-40 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        style={{ width: "240px", backgroundColor: "#111111", borderRight: "1px solid #1f1f1f" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5"
          style={{ borderBottom: "1px solid #1f1f1f" }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "#a855f7" }}>
            <span className="text-white font-bold text-sm syne">N</span>
          </div>
          <div>
            <p className="syne font-700 text-white text-sm leading-none" style={{ fontWeight: 700 }}>
              nikkis<span style={{ color: "#a855f7" }}>.</span>
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: "#52525b" }}>Admin Panel</p>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {NAV.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`admin-nav-link flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                location.pathname === item.path ? "active" : ""
              }`}
              style={{
                color: location.pathname === item.path ? "#a855f7" : "#71717a",
                borderLeft: location.pathname === item.path ? "2px solid #a855f7" : "2px solid transparent",
              }}
            >
              <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                {item.icon}
              </svg>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4" style={{ borderTop: "1px solid #1f1f1f" }}>
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all mb-1"
            style={{ color: "#71717a" }}
          >
            <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            View Store
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all"
            style={{ color: "#f43f5e" }}
          >
            <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-[240px]">
        {/* Topbar */}
        <header
          className="sticky top-0 z-20 flex items-center justify-between px-6 py-4"
          style={{ backgroundColor: "#111111", borderBottom: "1px solid #1f1f1f" }}
        >
          <button
            className="lg:hidden"
            style={{ color: "#71717a" }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>

          <div className="hidden lg:block">
            <p className="text-sm font-medium" style={{ color: "#71717a" }}>
              Welcome back, <span style={{ color: "#ffffff" }}>Admin</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ backgroundColor: "#a855f7", color: "#fff" }}
            >
              A
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6" style={{ backgroundColor: "#0a0a0a" }}>
          {children}
        </main>
      </div>
    </div>
  );
}