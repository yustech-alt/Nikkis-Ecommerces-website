import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOrder } from "../context/OrderContext";
import Button from "../components/ui/Button";
import { formatPrice } from "../lib/format";

export default function OrderConfirmation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getOrder } = useOrder();
  const order = getOrder(id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ backgroundColor: "var(--bg-primary)" }}>
        <p className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
          Order not found
        </p>
        <Button onClick={() => navigate("/")}>Go Home</Button>
      </div>
    );
  }

  const date = new Date(order.date);
  const formattedDate = date.toLocaleDateString("en-NG", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const estimatedDelivery = new Date(date);
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);
  const formattedDelivery = estimatedDelivery.toLocaleDateString("en-NG", {
    weekday: "long", month: "long", day: "numeric",
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">

        {/* Success header */}
        <div className="text-center mb-12">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: "rgba(34,197,94,0.15)", border: "2px solid var(--success)" }}
          >
            <svg width="36" height="36" fill="none" stroke="var(--success)" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </div>

          <h1 className="syne text-3xl sm:text-4xl mb-3" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
            Order Placed!
          </h1>
          <p className="text-base" style={{ color: "var(--text-secondary)" }}>
            Thank you, <strong style={{ color: "var(--text-primary)" }}>{order.customer.fullName}</strong>. Your order has been received.
          </p>

          {/* Order ID */}
          <div
            className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-full"
            style={{ backgroundColor: "var(--accent-faint)", border: "1px solid var(--accent-border)" }}
          >
            <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Order ID:</span>
            <span className="syne font-700 text-sm" style={{ color: "var(--accent)", fontWeight: 700 }}>
              {order.id}
            </span>
          </div>
        </div>

        {/* Info cards row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            {
              icon: <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>,
              label: "Order Date",
              value: formattedDate,
            },
            {
              icon: <path d="M5 12h14M12 5l7 7-7 7"/>,
              label: "Est. Delivery",
              value: formattedDelivery,
            },
            {
              icon: order.paymentMethod === "Pay on Delivery"
                ? <path d="M5 12h14M12 5l7 7-7 7"/>
                : <><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></>,
              label: "Payment",
              value: order.paymentMethod,
            },
          ].map((info) => (
            <div
              key={info.label}
              className="rounded-2xl p-5 text-center"
              style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: "var(--accent-faint)" }}
              >
                <svg width="18" height="18" fill="none" stroke="var(--accent)" strokeWidth="2" viewBox="0 0 24 24">
                  {info.icon}
                </svg>
              </div>
              <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>{info.label}</p>
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{info.value}</p>
            </div>
          ))}
        </div>

        {/* Order details */}
        <div
          className="rounded-2xl overflow-hidden mb-6"
          style={{ border: "1px solid var(--border)" }}
        >
          {/* Items */}
          <div style={{ borderBottom: "1px solid var(--border)" }}>
            <div className="px-6 py-4" style={{ backgroundColor: "var(--bg-secondary)" }}>
              <h2 className="syne font-700 text-sm" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
                Items Ordered ({order.items.length})
              </h2>
            </div>
            <div style={{ backgroundColor: "var(--bg-card)" }}>
              {order.items.map((item, i) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 px-6 py-4"
                  style={{ borderTop: i > 0 ? "1px solid var(--border)" : "none" }}
                >
                  <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0"
                    style={{ backgroundColor: "var(--bg-elevated)" }}>
                    <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                      {item.name}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                      Qty: {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="font-semibold text-sm flex-shrink-0" style={{ color: "var(--text-primary)" }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="px-6 py-5" style={{ backgroundColor: "var(--bg-card)" }}>
            <div className="flex flex-col gap-2 max-w-xs ml-auto">
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--text-secondary)" }}>Subtotal</span>
                <span style={{ color: "var(--text-primary)" }}>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--text-secondary)" }}>Shipping</span>
                {order.shipping === 0 ? (
                  <span style={{ color: "var(--success)" }}>Free</span>
                ) : (
                  <span style={{ color: "var(--text-primary)" }}>${order.shipping.toFixed(2)}</span>
                )}
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--text-secondary)" }}>Tax</span>
                <span style={{ color: "var(--text-primary)" }}>${order.tax.toFixed(2)}</span>
              </div>
              <div className="h-px my-1" style={{ backgroundColor: "var(--border)" }} />
              <div className="flex justify-between font-semibold">
                <span style={{ color: "var(--text-primary)" }}>Total</span>
                <span className="syne" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
                  ${order.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery info */}
        <div
          className="rounded-2xl p-6 mb-8"
          style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}
        >
          <h2 className="syne font-700 text-sm mb-4" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
            Delivery Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p style={{ color: "var(--text-muted)" }} className="text-xs mb-1">Name</p>
              <p style={{ color: "var(--text-primary)" }}>{order.customer.fullName}</p>
            </div>
            <div>
              <p style={{ color: "var(--text-muted)" }} className="text-xs mb-1">Phone</p>
              <p style={{ color: "var(--text-primary)" }}>{order.customer.phone}</p>
            </div>
            <div>
              <p style={{ color: "var(--text-muted)" }} className="text-xs mb-1">Email</p>
              <p style={{ color: "var(--text-primary)" }}>{order.customer.email}</p>
            </div>
            <div>
              <p style={{ color: "var(--text-muted)" }} className="text-xs mb-1">Address</p>
              <p style={{ color: "var(--text-primary)" }}>
                {order.delivery.address}, {order.delivery.city}, {order.delivery.state}
                {order.delivery.postalCode && `, ${order.delivery.postalCode}`}
              </p>
            </div>
            {order.notes && (
              <div className="sm:col-span-2">
                <p style={{ color: "var(--text-muted)" }} className="text-xs mb-1">Order Notes</p>
                <p style={{ color: "var(--text-primary)" }}>{order.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button size="lg" fullWidth onClick={() => navigate("/products")}>
            Continue Shopping
          </Button>
          <Button variant="secondary" size="lg" fullWidth onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}