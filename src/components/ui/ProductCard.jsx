import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import StarRating from "./StarRating";
import Badge from "./Badge";
import { formatPrice } from "../../lib/format";

export default function ProductCard({ product }) {
  const { addItem }  = useCart();
  const { addToast } = useToast();
  const [added, setAdded] = useState(false);
  const navigate = useNavigate();

  const discount = Math.round(
    ((product.oldPrice - product.price) / product.oldPrice) * 100
  );

  const handleAdd = (e) => {
    e.stopPropagation();
    if (!product.inStock) return;
    addItem(product);
    setAdded(true);
    addToast({ message: `${product.name} added to cart!`, type: "success" });
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div
      onClick={() => navigate(`/products/${product.id}`)}
      className="group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border)",
      }}
    >
      <div className="relative overflow-hidden aspect-square"
        style={{ backgroundColor: "var(--bg-elevated)" }}>
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

        <div className="absolute top-3 left-3">
          <Badge label={product.badge} variant="purple" />
        </div>
        <div className="absolute top-3 right-3">
          <Badge label={`-${discount}%`} variant="red" />
        </div>

        {!product.inStock && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <Badge label="Out of Stock" variant="gray" />
          </div>
        )}

        <button
          onClick={handleAdd}
          disabled={!product.inStock}
          className={`
            absolute bottom-3 left-1/2 -translate-x-1/2 w-[85%] py-2.5 rounded-xl
            text-xs font-semibold tracking-wide text-white
            transition-all duration-300
            opacity-0 group-hover:opacity-100
            translate-y-2 group-hover:translate-y-0
          `}
          style={{ backgroundColor: added ? "#22c55e" : "var(--accent)" }}
        >
          {added ? "✓ Added!" : "Add to Cart"}
        </button>
      </div>

      <div className="p-4">
        <p className="text-[11px] uppercase tracking-widest mb-1 font-medium"
          style={{ color: "var(--text-muted)" }}>
          {product.category}
        </p>
        <h3 className="text-sm font-medium leading-snug mb-2 line-clamp-2 transition-colors"
          style={{ color: "var(--text-primary)" }}>
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mb-3">
          <StarRating rating={product.rating} />
          <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
            ({product.reviews})
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-base" style={{ color: "var(--text-primary)" }}>
              {formatPrice(product.price)}
            </span>
            <span className="text-xs line-through" style={{ color: "var(--text-muted)" }}>
              ${product.oldPrice.toFixed(2)}
            </span>
          </div>
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
            style={{ backgroundColor: "var(--bg-elevated)" }}
          >
            <svg width="14" height="14" fill="none" stroke="var(--accent)" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}