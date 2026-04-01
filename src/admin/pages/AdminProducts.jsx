import { useState } from "react";
import { products as initialProducts } from "../../data/products";
import AdminLayout from "../components/AdminLayout";

export default function AdminProducts() {
  const [products,    setProducts]    = useState(initialProducts);
  const [search,      setSearch]      = useState("");
  const [filter,      setFilter]      = useState("all");
  const [showModal,   setShowModal]   = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form,        setForm]        = useState({
    name: "", category: "headsets", price: "", oldPrice: "",
    badge: "New", inStock: true, description: "", image: "",
  });

  const categories = ["all", "headsets", "creams", "accessories"];

  const filtered = products
    .filter((p) => filter === "all" || p.category === filter)
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => {
    setEditProduct(null);
    setForm({ name: "", category: "headsets", price: "", oldPrice: "", badge: "New", inStock: true, description: "", image: "" });
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditProduct(p);
    setForm({
      name:        p.name,
      category:    p.category,
      price:       p.price,
      oldPrice:    p.oldPrice,
      badge:       p.badge,
      inStock:     p.inStock,
      description: p.description,
      image:       p.images[0],
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name || !form.price) return;
    if (editProduct) {
      setProducts((prev) => prev.map((p) =>
        p.id === editProduct.id
          ? { ...p, ...form, price: +form.price, oldPrice: +form.oldPrice, images: [form.image || p.images[0]] }
          : p
      ));
    } else {
      const newProduct = {
        id:          Date.now(),
        ...form,
        price:       +form.price,
        oldPrice:    +form.oldPrice,
        images:      [form.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"],
        rating:      4.5,
        reviews:     0,
        specs:       {},
      };
      setProducts((prev) => [...prev, newProduct]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this product?")) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const inputStyle = {
    backgroundColor: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: "10px",
    padding: "10px 14px",
    color: "#fff",
    fontSize: "13px",
    width: "100%",
    outline: "none",
    fontFamily: "'DM Sans', sans-serif",
  };

  return (
    <AdminLayout>
      <style>{`.syne { font-family: 'Syne', sans-serif; }`}</style>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="syne text-2xl font-700 text-white mb-1" style={{ fontWeight: 700 }}>Products</h1>
          <p className="text-sm" style={{ color: "#71717a" }}>Manage your store products</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
          style={{ backgroundColor: "#a855f7" }}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Add Product
        </button>
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
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-sm w-full"
            style={{ color: "#fff", fontFamily: "'DM Sans', sans-serif" }}
          />
        </div>
        <div className="flex gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className="px-3 py-2 rounded-xl text-xs font-medium capitalize transition-all"
              style={{
                backgroundColor: filter === c ? "#a855f7" : "#111",
                color: filter === c ? "#fff" : "#71717a",
                border: `1px solid ${filter === c ? "#a855f7" : "#1f1f1f"}`,
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="rounded-2xl overflow-hidden"
            style={{ backgroundColor: "#111", border: "1px solid #1f1f1f" }}
          >
            <div className="relative aspect-video overflow-hidden" style={{ backgroundColor: "#1a1a1a" }}>
              <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3">
                <span className="text-[10px] font-semibold px-2 py-1 rounded-full"
                  style={{ backgroundColor: "#a855f722", color: "#a855f7" }}>
                  {p.badge}
                </span>
              </div>
              <div className="absolute top-3 right-3">
                <span
                  className="text-[10px] font-semibold px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: p.inStock ? "#22c55e22" : "#f43f5e22",
                    color: p.inStock ? "#22c55e" : "#f43f5e",
                  }}
                >
                  {p.inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>
            </div>

            <div className="p-4">
              <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: "#52525b" }}>
                {p.category}
              </p>
              <h3 className="text-sm font-medium text-white mb-2 line-clamp-1">{p.name}</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-white">${p.price.toFixed(2)}</span>
                  <span className="text-xs line-through" style={{ color: "#52525b" }}>
                    ${p.oldPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(p)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                    style={{ backgroundColor: "#a855f722", color: "#a855f7" }}
                  >
                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                    style={{ backgroundColor: "#f43f5e22", color: "#f43f5e" }}
                  >
                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                      <path d="M10 11v6M14 11v6"/>
                      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
            style={{ backgroundColor: "#111", border: "1px solid #1f1f1f" }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="syne font-700 text-white" style={{ fontWeight: 700 }}>
                {editProduct ? "Edit Product" : "Add Product"}
              </h2>
              <button onClick={() => setShowModal(false)} style={{ color: "#52525b" }}>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {[
                { label: "Product Name *", key: "name",        type: "text",   placeholder: "e.g. Nikkis Pro X"  },
                { label: "Price ($) *",    key: "price",       type: "number", placeholder: "e.g. 89.99"         },
                { label: "Old Price ($)",  key: "oldPrice",    type: "number", placeholder: "e.g. 120.00"        },
                { label: "Image URL",      key: "image",       type: "text",   placeholder: "https://..."        },
                { label: "Description",    key: "description", type: "text",   placeholder: "Short description"  },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-xs font-medium uppercase tracking-widest mb-1.5"
                    style={{ color: "#52525b" }}>
                    {f.label}
                  </label>
                  <input
                    type={f.type}
                    style={inputStyle}
                    placeholder={f.placeholder}
                    value={form[f.key]}
                    onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs font-medium uppercase tracking-widest mb-1.5"
                  style={{ color: "#52525b" }}>Category</label>
                <select
                  style={{ ...inputStyle, cursor: "pointer" }}
                  value={form.category}
                  onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                >
                  {["headsets", "creams", "accessories"].map((c) => (
                    <option key={c} value={c} style={{ backgroundColor: "#111" }}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-widest mb-1.5"
                  style={{ color: "#52525b" }}>Badge</label>
                <select
                  style={{ ...inputStyle, cursor: "pointer" }}
                  value={form.badge}
                  onChange={(e) => setForm((prev) => ({ ...prev, badge: e.target.value }))}
                >
                  {["New", "Hot", "Sale", "Best Seller", "Top Rated", "Limited", "Exclusive"].map((b) => (
                    <option key={b} value={b} style={{ backgroundColor: "#111" }}>{b}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-xs font-medium uppercase tracking-widest"
                  style={{ color: "#52525b" }}>In Stock</label>
                <div
                  onClick={() => setForm((prev) => ({ ...prev, inStock: !prev.inStock }))}
                  className="relative w-10 h-5 rounded-full cursor-pointer transition-colors"
                  style={{ backgroundColor: form.inStock ? "#a855f7" : "#2a2a2a" }}
                >
                  <div
                    className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                    style={{ transform: form.inStock ? "translateX(20px)" : "translateX(2px)" }}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 rounded-xl text-sm font-medium transition-all"
                style={{ backgroundColor: "#1a1a1a", color: "#71717a", border: "1px solid #2a2a2a" }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all"
                style={{ backgroundColor: "#a855f7" }}
              >
                {editProduct ? "Save Changes" : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}