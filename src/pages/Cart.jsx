import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Button from "../components/ui/Button";
import { useToast } from "../context/ToastContext";
import { formatPrice } from "../lib/format";

export default function Cart() {
  const navigate = useNavigate();
  const { cart, removeItem, increaseQty, decreaseQty, clearCart, cartTotal } = useCart();

  const { addToast } = useToast();

  const shipping = cartTotal >= 50 ? 0 : 9.99;
  const tax      = cartTotal * 0.075;
  const total    = cartTotal + shipping + tax;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4"
        style={{ backgroundColor: "var(--bg-primary)" }}>
        <div
          className="w-24 h-24 rounded-3xl flex items-center justify-center"
          style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}
        >
          <svg width="40" height="40" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
        </div>
        <div className="text-center">
          <h2 className="syne text-2xl mb-2" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
            Your cart is empty
          </h2>
          <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
            Looks like you haven't added anything yet
          </p>
          <Button onClick={() => navigate("/products")} size="lg">Start Shopping</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>

      {/* Header */}
      <div style={{ borderBottom: "1px solid var(--border)", backgroundColor: "var(--bg-secondary)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--accent)" }}>
            Your
          </p>
          <h1 className="syne text-3xl sm:text-4xl" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
            Shopping Cart{" "}
            <span className="text-xl font-400" style={{ color: "var(--text-muted)" }}>
              ({cart.length} {cart.length === 1 ? "item" : "items"})
            </span>
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Items */}
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex justify-end">
              <button
                onClick={clearCart}
                className="text-xs transition-colors"
                style={{ color: "var(--text-muted)" }}
              >
                Clear all ×
              </button>
            </div>

            {cart.map((item) => {
              const discount = Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100);
              return (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 rounded-2xl transition-colors"
                  style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}
                >
                  <div
                    className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer"
                    style={{ backgroundColor: "var(--bg-elevated)" }}
                    onClick={() => navigate(`/products/${item.id}`)}
                  >
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[11px] uppercase tracking-widest mb-1" style={{ color: "var(--text-muted)" }}>
                          {item.category}
                        </p>
                        <h3
                          className="font-medium text-sm leading-snug cursor-pointer hover:underline line-clamp-2 transition-colors"
                          style={{ color: "var(--text-primary)" }}
                          onClick={() => navigate(`/products/${item.id}`)}
                        >
                          {item.name}
                        </h3>
                      </div>
                      <button
                        onClick={() => {
  removeItem(item.id);
  addToast({ message: `${item.name} removed from cart`, type: "info" });
}}
                        className="transition-colors flex-shrink-0"
                        style={{ color: "var(--text-faint)" }}
                      >
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div
                        className="flex items-center rounded-lg overflow-hidden"
                        style={{ backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border)" }}
                      >
                        <button
                          onClick={() => decreaseQty(item.id)}
                          className="w-8 h-8 flex items-center justify-center transition-colors"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M5 12h14"/>
                          </svg>
                        </button>
                        <span className="w-8 text-center text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => increaseQty(item.id)}
                          className="w-8 h-8 flex items-center justify-center transition-colors"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M12 5v14M5 12h14"/>
                          </svg>
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-xs line-through" style={{ color: "var(--text-muted)" }}>
                          ${(item.oldPrice * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <button
              onClick={() => navigate("/products")}
              className="flex items-center gap-2 text-sm transition-colors mt-2"
              style={{ color: "var(--text-secondary)" }}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
              </svg>
              Continue Shopping
            </button>
          </div>

          {/* Order summary */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div
              className="rounded-2xl p-6 sticky top-24"
              style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}
            >
              <h2 className="syne text-lg mb-6" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
                Order Summary
              </h2>

              <div className="flex flex-col gap-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span style={{ color: "var(--text-secondary)" }}>
                    Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)
                  </span>
                  <span className="font-medium" style={{ color: "var(--text-primary)" }}>
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "var(--text-secondary)" }}>Shipping</span>
                  {shipping === 0 ? (
                    <span className="font-medium" style={{ color: "var(--success)" }}>Free</span>
                  ) : (
                    <span className="font-medium" style={{ color: "var(--text-primary)" }}>${shipping.toFixed(2)}</span>
                  )}
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "var(--text-secondary)" }}>Tax (7.5%)</span>
                  <span className="font-medium" style={{ color: "var(--text-primary)" }}>${tax.toFixed(2)}</span>
                </div>

                {shipping > 0 && (
                  <div
                    className="rounded-xl px-3 py-2.5 text-xs"
                    style={{
                      backgroundColor: "var(--accent-faint)",
                      border: "1px solid var(--accent-border)",
                      color: "var(--accent)",
                    }}
                  >
                    Add ${(50 - cartTotal).toFixed(2)} more for free shipping
                  </div>
                )}
              </div>

              <div className="pt-4 mb-6" style={{ borderTop: "1px solid var(--border)" }}>
                <div className="flex justify-between">
                  <span className="font-semibold" style={{ color: "var(--text-primary)" }}>Total</span>
                  <span className="syne text-xl" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              <Button fullWidth size="lg" onClick={() => navigate("/checkout")}>
  Proceed to Checkout
</Button>

              <div className="flex items-center justify-center gap-2 mt-4">
                <svg width="14" height="14" fill="none" stroke="var(--text-muted)" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>Secure checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}