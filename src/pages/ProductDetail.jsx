import { useState, useEffect } from "react";
import { useToast } from "../context/ToastContext";
import { useParams, useNavigate } from "react-router-dom";
import { products } from "../data/products";
import { useCart } from "../context/CartContext";
import StarRating from "../components/ui/StarRating";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import ProductCard from "../components/ui/ProductCard";
import { formatPrice } from "../lib/format";

import { getProductById } from "../services/productService";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, cart } = useCart();
  const { addToast } = useToast();

  const [activeImg, setActiveImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch {
        // fallback to local data
        const found = products.find((p) => p.id === Number(id));
        setProduct(found || null);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--bg-primary)" }}
      >
        <div
          className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
          style={{
            borderColor: "var(--accent)",
            borderTopColor: "transparent",
          }}
        />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center gap-4">
        <p className="text-white text-xl font-semibold">Product not found</p>
        <Button onClick={() => navigate("/products")}>Back to Products</Button>
      </div>
    );
  }

  const discount = Math.round(
    ((product.oldPrice - product.price) / product.oldPrice) * 100,
  );

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const inCart = cart.find((i) => i.id === product.id);

  const handleAdd = () => {
    if (!product.inStock) return;
    for (let i = 0; i < quantity; i++) addItem(product);
    setAdded(true);
    addToast({
      message: `${quantity}× ${product.name} added to cart!`,
      type: "success",
    });
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="bg-[var(--bg-primary)] min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-[var(--bg-elevated)] bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <button
              onClick={() => navigate("/")}
              className="hover:text-[var(--accent)] transition-colors"
            >
              Home
            </button>
            <span>/</span>
            <button
              onClick={() => navigate("/products")}
              className="hover:text-[var(--accent)] transition-colors"
            >
              Products
            </button>
            <span>/</span>
            <button
              onClick={() => navigate(`/products?category=${product.category}`)}
              className="hover:text-[var(--accent)] transition-colors capitalize"
            >
              {product.category}
            </button>
            <span>/</span>
            <span className="text-[#71717a] truncate max-w-[200px]">
              {product.name}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* ── Main product section ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Images */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square bg-[#111] rounded-2xl overflow-hidden border border-[var(--border)]">
              <img
                src={product.images[activeImg]}
                alt={product.name}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <Badge label={product.badge} variant="purple" />
                <Badge label={`-${discount}%`} variant="red" />
              </div>
              {!product.inStock && (
                <div className="absolute inset-0 bg-[var(--bg-primary)]/70 flex items-center justify-center">
                  <Badge label="Out of Stock" variant="gray" />
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      activeImg === i
                        ? "border-[var(--accent)]"
                        : "border-[var(--border)] hover:border-[var(--accent)]/40"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <p className="text-[var(--accent)] text-xs font-semibold uppercase tracking-widest mb-3">
              {product.category}
            </p>
            <h1 className="syne text-3xl sm:text-4xl font-700 text-white mb-4 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <StarRating rating={product.rating} size={16} />
              <span className="text-white font-semibold text-sm">
                {product.rating}
              </span>
              <span className="text-[var(--text-muted)] text-sm">
                ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="syne text-4xl font-700 text-white">
                {formatPrice(product.price)}
              </span>
              <span className="text-[var(--text-muted)] text-lg line-through">
                ${product.oldPrice.toFixed(2)}
              </span>
              <span className="bg-[#f43f5e]/15 text-[#f43f5e] text-sm font-semibold px-2.5 py-1 rounded-full">
                Save {discount}%
              </span>
            </div>

            {/* Stock status */}
            <div className="flex items-center gap-2 mb-8">
              <div
                className={`w-2 h-2 rounded-full ${product.inStock ? "bg-[#22c55e]" : "bg-[#f43f5e]"}`}
              />
              <span
                className={`text-sm font-medium ${product.inStock ? "text-[#22c55e]" : "text-[#f43f5e]"}`}
              >
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>
              {inCart && (
                <span className="text-[var(--text-muted)] text-xs ml-2">
                  · {inCart.quantity} already in cart
                </span>
              )}
            </div>

            {/* Quantity + Add to cart */}
            <div className="flex items-center gap-4 mb-6">
              {/* Quantity selector */}
              <div className="flex items-center bg-[#111] border border-[var(--border)] rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-11 h-11 flex items-center justify-center text-[#71717a] hover:text-white hover:bg-[var(--bg-elevated)] transition-colors"
                >
                  <svg
                    width="14"
                    height="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 12h14" />
                  </svg>
                </button>
                <span className="w-10 text-center text-white font-semibold text-sm">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-11 h-11 flex items-center justify-center text-[#71717a] hover:text-white hover:bg-[var(--bg-elevated)] transition-colors"
                >
                  <svg
                    width="14"
                    height="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </button>
              </div>

              {/* Add to cart */}
              <Button
                onClick={handleAdd}
                disabled={!product.inStock}
                size="lg"
                fullWidth
                variant={added ? "ghost" : "primary"}
              >
                {added ? (
                  <>
                    <svg
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    Added to Cart
                  </>
                ) : (
                  <>
                    <svg
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <path d="M16 10a4 4 0 01-8 0" />
                    </svg>
                    Add to Cart
                  </>
                )}
              </Button>
            </div>

            {/* Go to cart */}
            {inCart && (
              <Button
                onClick={() => navigate("/cart")}
                variant="secondary"
                size="lg"
                fullWidth
              >
                View Cart ({inCart.quantity} items)
              </Button>
            )}

            {/* Divider */}
            <div className="border-t border-[var(--bg-elevated)] my-8" />

            {/* Trust row */}
            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  icon: (
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  ),
                  label: "Authentic",
                },
                {
                  icon: <path d="M5 12h14M12 5l7 7-7 7" />,
                  label: "Fast Delivery",
                },
                {
                  icon: (
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  ),
                  label: "Easy Returns",
                },
              ].map((t) => (
                <div
                  key={t.label}
                  className="flex flex-col items-center gap-2 bg-[#111] rounded-xl p-3 border border-[var(--border)]"
                >
                  <svg
                    width="18"
                    height="18"
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    {t.icon}
                  </svg>
                  <span className="text-[#71717a] text-xs font-medium">
                    {t.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="mb-20">
          <div className="flex gap-1 border-b border-[var(--bg-elevated)] mb-8">
            {["description", "specs"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-sm font-medium capitalize transition-all duration-200 border-b-2 -mb-px ${
                  activeTab === tab
                    ? "border-[var(--accent)] text-[var(--accent)]"
                    : "border-transparent text-[var(--text-muted)] hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "description" && (
            <p className="text-[var(--text-secondary)] leading-relaxed max-w-2xl">
              {product.description}
            </p>
          )}

          {activeTab === "specs" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
              {Object.entries(product.specs).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between bg-[#111] rounded-xl px-4 py-3 border border-[var(--border)]"
                >
                  <span className="text-[var(--text-muted)] text-sm">
                    {key}
                  </span>
                  <span className="text-white text-sm font-medium">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Related products ── */}
        {related.length > 0 && (
          <div>
            <div className="mb-8">
              <p className="text-[var(--accent)] text-xs font-semibold uppercase tracking-widest mb-2">
                More Like This
              </p>
              <h2 className="syne text-2xl sm:text-3xl font-700 text-white">
                Related Products
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
