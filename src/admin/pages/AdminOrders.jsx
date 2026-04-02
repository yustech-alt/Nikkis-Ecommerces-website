import { useState, useEffect } from "react";
import { getOrders, updateOrderStatus } from "../../services/orderService";
import AdminLayout from "../components/AdminLayout";

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

const statusColor = {
  pending:   { bg: "#f59e0b22", text: "#f59e0b" },
  confirmed: { bg: "#a855f722", text: "#a855f7" },
  shipped:   { bg: "#3b82f622", text: "#3b82f6" },
  delivered: { bg: "#22c55e22", text: "#22c55e" },
  cancelled: { bg: "#f43f5e22", text: "#f43f5e" },
};

export default function AdminOrders() {
  const [search,       setSearch]       = useState("");
const [filterStatus, setFilterStatus] = useState("all");
const [expanded,     setExpanded]     = useState(null);
const [localOrders,  setLocalOrders]  = useState([]);
const [loading,      setLoading]      = useState(true);

useEffect(() => {
  const fetch = async () => {
    try {
      const data = await getOrders();
      setLocalOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  fetch();
}, []);

const updateStatus = async (orderId, newStatus) => {
  setLocalOrders((prev) =>
    prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o)
  );
  try {
    await updateOrderStatus(orderId, newStatus);
  } catch (err) {
    console.error("Failed to update status:", err);
  }
};

  const filtered = localOrders
    .filter((o) => filterStatus === "all" || o.status === filterStatus)
    .filter((o) =>
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.fullName.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.email.toLowerCase().includes(search.toLowerCase())
    );
    if (loading) {
  return (
    <AdminLayout>
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 rounded-full animate-spin"
          style={{ borderColor: "#a855f7", borderTopColor: "transparent" }} />
      </div>
    </AdminLayout>
  );
}

  return (
    <AdminLayout>
      <style>{`.syne { font-family: 'Syne', sans-serif; }`}</style>

      <div className="mb-8">
        <h1 className="syne text-2xl font-700 text-white mb-1" style={{ fontWeight: 700 }}>Orders</h1>
        <p className="text-sm" style={{ color: "#71717a" }}>
          Manage and update all customer orders
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl flex-1 max-w-xs"
          style={{ backgroundColor: "#111", border: "1px solid #1f1f1f" }}
        >
          <svg width="14" height="14" fill="none" stroke="#52525b" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-sm w-full"
            style={{ color: "#fff", fontFamily: "'DM Sans', sans-serif" }}
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {["all", ...STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className="px-3 py-2 rounded-xl text-xs font-medium capitalize transition-all"
              style={{
                backgroundColor: filterStatus === s ? "#a855f7" : "#111",
                color: filterStatus === s ? "#fff" : "#71717a",
                border: `1px solid ${filterStatus === s ? "#a855f7" : "#1f1f1f"}`,
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs mb-4" style={{ color: "#52525b" }}>
        <span style={{ color: "#fff" }}>{filtered.length}</span> orders found
      </p>

      {/* Orders list */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div
            className="rounded-2xl p-12 text-center"
            style={{ backgroundColor: "#111", border: "1px solid #1f1f1f" }}
          >
            <p className="text-sm" style={{ color: "#52525b" }}>No orders found</p>
          </div>
        ) : (
          filtered.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl overflow-hidden"
              style={{ backgroundColor: "#111", border: "1px solid #1f1f1f" }}
            >
              {/* Order header */}
              <div
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 cursor-pointer"
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
              >
                <div className="flex items-center gap-4">
                  <div>
                    <p className="syne text-sm font-700" style={{ color: "#a855f7", fontWeight: 700 }}>
                      {order.id}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "#52525b" }}>
                      {new Date(order.date).toLocaleDateString("en-NG", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-semibold text-white">{order.customer.fullName}</p>
                    <p className="text-xs" style={{ color: "#52525b" }}>{order.customer.email}</p>
                  </div>

                  <span className="text-sm font-bold text-white">${order.total.toFixed(2)}</span>

                  {/* Status selector */}
                  <select
                    value={order.status}
                    onChange={(e) => { e.stopPropagation(); updateStatus(order.id, e.target.value); }}
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs font-semibold px-3 py-1.5 rounded-full outline-none cursor-pointer capitalize"
                    style={{
                      backgroundColor: statusColor[order.status]?.bg || "#1a1a1a",
                      color: statusColor[order.status]?.text || "#fff",
                      border: "none",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s} style={{ backgroundColor: "#111", color: "#fff" }}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>

                  <svg
                    width="16" height="16" fill="none" stroke="#52525b" strokeWidth="2" viewBox="0 0 24 24"
                    style={{ transform: expanded === order.id ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}
                  >
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </div>
              </div>

              {/* Expanded details */}
              {expanded === order.id && (
                <div style={{ borderTop: "1px solid #1a1a1a" }}>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6">

                    {/* Items */}
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest mb-3"
                        style={{ color: "#52525b" }}>Items</p>
                      <div className="flex flex-col gap-2">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0"
                              style={{ backgroundColor: "#1a1a1a" }}>
                              <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-white line-clamp-1">{item.name}</p>
                              <p className="text-[10px]" style={{ color: "#52525b" }}>
                                ×{item.quantity} · ${item.price.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Customer */}
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest mb-3"
                        style={{ color: "#52525b" }}>Customer</p>
                      <div className="flex flex-col gap-1.5">
                        {[
                          { label: "Name",  value: order.customer.fullName },
                          { label: "Email", value: order.customer.email    },
                          { label: "Phone", value: order.customer.phone    },
                        ].map((f) => (
                          <div key={f.label}>
                            <p className="text-[10px]" style={{ color: "#52525b" }}>{f.label}</p>
                            <p className="text-xs text-white">{f.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery */}
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest mb-3"
                        style={{ color: "#52525b" }}>Delivery</p>
                      <div className="flex flex-col gap-1.5">
                        {[
                          { label: "Address", value: order.delivery.address                                                    },
                          { label: "City",    value: order.delivery.city                                                       },
                          { label: "State",   value: order.delivery.state                                                      },
                          { label: "Payment", value: order.paymentMethod                                                       },
                        ].map((f) => (
                          <div key={f.label}>
                            <p className="text-[10px]" style={{ color: "#52525b" }}>{f.label}</p>
                            <p className="text-xs text-white">{f.value}</p>
                          </div>
                        ))}
                        {order.notes && (
                          <div>
                            <p className="text-[10px]" style={{ color: "#52525b" }}>Notes</p>
                            <p className="text-xs text-white">{order.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
}