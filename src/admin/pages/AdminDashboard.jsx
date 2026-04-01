import { useMemo } from "react";
import { useOrder } from "../../context/OrderContext";
import { products } from "../../data/products";
import AdminLayout from "../components/AdminLayout";

function StatCard({ label, value, sub, icon, color }) {
  return (
    <div
      className="rounded-2xl p-6"
      style={{ backgroundColor: "#111111", border: "1px solid #1f1f1f" }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: color + "22" }}
        >
          <svg width="20" height="20" fill="none" stroke={color} strokeWidth="1.8" viewBox="0 0 24 24">
            {icon}
          </svg>
        </div>
      </div>
      <p className="text-2xl font-700 text-white mb-1 syne" style={{ fontWeight: 700 }}>{value}</p>
      <p className="text-sm font-medium text-white mb-0.5">{label}</p>
      <p className="text-xs" style={{ color: "#52525b" }}>{sub}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const { orders } = useOrder();

  const stats = useMemo(() => {
    const revenue     = orders.reduce((sum, o) => sum + o.total, 0);
    const pending     = orders.filter((o) => o.status === "pending").length;
    const customers   = [...new Set(orders.map((o) => o.customer.email))].length;
    return { revenue, pending, customers };
  }, [orders]);

  const recent = orders.slice(0, 5);

  const statusColor = {
    pending:   "#f59e0b",
    confirmed: "#a855f7",
    shipped:   "#3b82f6",
    delivered: "#22c55e",
    cancelled: "#f43f5e",
  };

  return (
    <AdminLayout>
      <style>{`
        .syne { font-family: 'Syne', sans-serif; }
      `}</style>

      <div className="mb-8">
        <h1 className="syne text-2xl font-700 text-white mb-1" style={{ fontWeight: 700 }}>
          Dashboard
        </h1>
        <p className="text-sm" style={{ color: "#71717a" }}>
          Welcome to your Nikkis admin panel
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
        <StatCard
          label="Total Orders"
          value={orders.length}
          sub="All time orders"
          color="#a855f7"
          icon={<><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></>}
        />
        <StatCard
          label="Total Revenue"
          value={`$${stats.revenue.toFixed(2)}`}
          sub="From all orders"
          color="#22c55e"
          icon={<><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></>}
        />
        <StatCard
          label="Pending Orders"
          value={stats.pending}
          sub="Awaiting processing"
          color="#f59e0b"
          icon={<><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>}
        />
        <StatCard
          label="Customers"
          value={stats.customers}
          sub="Unique guest buyers"
          color="#3b82f6"
          icon={<><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></>}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Recent orders */}
        <div
          className="xl:col-span-2 rounded-2xl overflow-hidden"
          style={{ backgroundColor: "#111111", border: "1px solid #1f1f1f" }}
        >
          <div className="flex items-center justify-between px-6 py-4"
            style={{ borderBottom: "1px solid #1f1f1f" }}>
            <h2 className="syne font-700 text-white text-sm" style={{ fontWeight: 700 }}>
              Recent Orders
            </h2>
          </div>

          {recent.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <p className="text-sm" style={{ color: "#52525b" }}>No orders yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: "1px solid #1f1f1f" }}>
                    {["Order ID", "Customer", "Items", "Total", "Status"].map((h) => (
                      <th key={h} className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-widest"
                        style={{ color: "#52525b" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recent.map((order, i) => (
                    <tr
                      key={order.id}
                      style={{ borderBottom: i < recent.length - 1 ? "1px solid #1a1a1a" : "none" }}
                    >
                      <td className="px-6 py-4">
                        <span className="syne text-xs font-700" style={{ color: "#a855f7", fontWeight: 700 }}>
                          {order.id}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-white">{order.customer.fullName}</p>
                        <p className="text-xs" style={{ color: "#52525b" }}>{order.customer.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-white">{order.items.length} item{order.items.length > 1 ? "s" : ""}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-white">${order.total.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="text-[10px] font-semibold px-2.5 py-1 rounded-full capitalize"
                          style={{
                            backgroundColor: (statusColor[order.status] || "#52525b") + "22",
                            color: statusColor[order.status] || "#52525b",
                          }}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Top products */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ backgroundColor: "#111111", border: "1px solid #1f1f1f" }}
        >
          <div className="px-6 py-4" style={{ borderBottom: "1px solid #1f1f1f" }}>
            <h2 className="syne font-700 text-white text-sm" style={{ fontWeight: 700 }}>
              Products Overview
            </h2>
          </div>
          <div className="p-4 flex flex-col gap-3">
            {products.slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0"
                  style={{ backgroundColor: "#1a1a1a" }}>
                  <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white line-clamp-1">{p.name}</p>
                  <p className="text-[10px]" style={{ color: "#52525b" }}>${p.price.toFixed(2)}</p>
                </div>
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: p.inStock ? "#22c55e22" : "#f43f5e22",
                    color: p.inStock ? "#22c55e" : "#f43f5e",
                  }}
                >
                  {p.inStock ? "In Stock" : "Out"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}