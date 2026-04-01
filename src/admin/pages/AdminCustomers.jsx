import { useMemo, useState } from "react";
import { useOrder } from "../../context/OrderContext";
import AdminLayout from "../components/AdminLayout";

export default function AdminCustomers() {
  const { orders } = useOrder();
  const [search, setSearch] = useState("");

  const customers = useMemo(() => {
    const map = {};
    orders.forEach((o) => {
      const email = o.customer.email;
      if (!map[email]) {
        map[email] = {
          fullName:   o.customer.fullName,
          email:      o.customer.email,
          phone:      o.customer.phone,
          orders:     [],
          totalSpent: 0,
          lastOrder:  o.date,
        };
      }
      map[email].orders.push(o);
      map[email].totalSpent += o.total;
      if (new Date(o.date) > new Date(map[email].lastOrder)) {
        map[email].lastOrder = o.date;
      }
    });
    return Object.values(map);
  }, [orders]);

  const filtered = customers.filter(
    (c) =>
      c.fullName.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <style>{`.syne { font-family: 'Syne', sans-serif; }`}</style>

      <div className="mb-8">
        <h1 className="syne text-2xl font-700 text-white mb-1" style={{ fontWeight: 700 }}>Customers</h1>
        <p className="text-sm" style={{ color: "#71717a" }}>
          All guest buyers from order history
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Customers", value: customers.length,                                                            color: "#a855f7" },
          { label: "Total Revenue",   value: `$${customers.reduce((s, c) => s + c.totalSpent, 0).toFixed(2)}`,           color: "#22c55e" },
          { label: "Avg Order Value", value: `$${customers.length ? (customers.reduce((s, c) => s + c.totalSpent, 0) / orders.length).toFixed(2) : "0.00"}`, color: "#3b82f6" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl p-5"
            style={{ backgroundColor: "#111", border: "1px solid #1f1f1f" }}
          >
            <p className="text-2xl font-700 syne text-white mb-1" style={{ fontWeight: 700 }}>{s.value}</p>
            <p className="text-sm" style={{ color: "#71717a" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl mb-6 max-w-xs"
        style={{ backgroundColor: "#111", border: "1px solid #1f1f1f" }}
      >
        <svg width="14" height="14" fill="none" stroke="#52525b" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        <input
          type="text"
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent outline-none text-sm w-full"
          style={{ color: "#fff", fontFamily: "'DM Sans', sans-serif" }}
        />
      </div>

      {/* Customers table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ backgroundColor: "#111", border: "1px solid #1f1f1f" }}
      >
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-sm mb-2" style={{ color: "#52525b" }}>
              {customers.length === 0 ? "No customers yet" : "No customers found"}
            </p>
            {customers.length === 0 && (
              <p className="text-xs" style={{ color: "#3f3f46" }}>
                Customers will appear here once orders are placed
              </p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid #1f1f1f" }}>
                  {["Customer", "Email", "Phone", "Orders", "Total Spent", "Last Order"].map((h) => (
                    <th key={h}
                      className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-widest"
                      style={{ color: "#52525b" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => (
                  <tr
                    key={c.email}
                    style={{ borderBottom: i < filtered.length - 1 ? "1px solid #1a1a1a" : "none" }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                          style={{ backgroundColor: "#a855f722", color: "#a855f7" }}
                        >
                          {c.fullName[0]}
                        </div>
                        <p className="text-sm font-medium text-white">{c.fullName}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm" style={{ color: "#71717a" }}>{c.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm" style={{ color: "#71717a" }}>{c.phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: "#a855f722", color: "#a855f7" }}
                      >
                        {c.orders.length} order{c.orders.length > 1 ? "s" : ""}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-white">${c.totalSpent.toFixed(2)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm" style={{ color: "#71717a" }}>
                        {new Date(c.lastOrder).toLocaleDateString("en-NG", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}