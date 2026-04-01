import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useOrder } from "../context/OrderContext";
import Button from "../components/ui/Button";

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
  "FCT - Abuja", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina",
  "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo",
  "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
];

const inputStyle = {
  backgroundColor: "var(--bg-elevated)",
  border: "1px solid var(--border)",
  color: "var(--text-primary)",
  fontFamily: "'DM Sans', sans-serif",
  borderRadius: "12px",
  padding: "12px 16px",
  fontSize: "14px",
  width: "100%",
  outline: "none",
  transition: "border-color 0.2s",
};

const labelStyle = {
  fontSize: "12px",
  fontWeight: 500,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  marginBottom: "6px",
  display: "block",
  color: "var(--text-muted)",
};

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useCart();
  const { placeOrder } = useOrder();

  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("delivery");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    fullName:    "",
    email:       "",
    phone:       "",
    address:     "",
    city:        "",
    state:       "",
    postalCode:  "",
    notes:       "",
    cardNumber:  "",
    cardExpiry:  "",
    cardCvv:     "",
    cardName:    "",
  });

  const shipping = cartTotal >= 50 ? 0 : 9.99;
  const tax      = cartTotal * 0.075;
  const total    = cartTotal + shipping + tax;

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const formatCardNumber = (val) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (val) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  };

  const validateStep1 = () => {
    const e = {};
    if (!form.fullName.trim())  e.fullName = "Full name is required";
    if (!form.email.trim())     e.email    = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.phone.trim())     e.phone    = "Phone number is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e = {};
    if (!form.address.trim())   e.address   = "Address is required";
    if (!form.city.trim())      e.city      = "City is required";
    if (!form.state)            e.state     = "Please select a state";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep3 = () => {
    if (paymentMethod === "delivery") return true;
    const e = {};
    if (!form.cardNumber.trim() || form.cardNumber.replace(/\s/g, "").length < 16)
      e.cardNumber = "Enter a valid 16-digit card number";
    if (!form.cardExpiry.trim() || form.cardExpiry.length < 5)
      e.cardExpiry = "Enter a valid expiry date";
    if (!form.cardCvv.trim() || form.cardCvv.length < 3)
      e.cardCvv = "Enter a valid CVV";
    if (!form.cardName.trim())
      e.cardName = "Cardholder name is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    if (step === 2 && validateStep2()) setStep(3);
  };

  const handleSubmit = async () => {
    if (!validateStep3()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));

    const order = placeOrder({
      customer: {
        fullName:  form.fullName,
        email:     form.email,
        phone:     form.phone,
      },
      delivery: {
        address:    form.address,
        city:       form.city,
        state:      form.state,
        postalCode: form.postalCode,
      },
      notes:         form.notes,
      paymentMethod: paymentMethod === "delivery" ? "Pay on Delivery" : "Card Payment",
      items:         cart,
      subtotal:      cartTotal,
      shipping,
      tax,
      total,
    });

    clearCart();
    setLoading(false);
    navigate(`/order-confirmation/${order.id}`);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ backgroundColor: "var(--bg-primary)" }}>
        <p className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
          Your cart is empty
        </p>
        <Button onClick={() => navigate("/products")}>Shop Now</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>

      {/* Header */}
      <div style={{ borderBottom: "1px solid var(--border)", backgroundColor: "var(--bg-secondary)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <p className="text-xs font-semibold uppercase tracking-widest mb-1"
            style={{ color: "var(--accent)" }}>Checkout</p>
          <h1 className="syne text-3xl font-700" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
            Complete Your Order
          </h1>
        </div>
      </div>

      {/* Step indicator */}
      <div style={{ borderBottom: "1px solid var(--border)", backgroundColor: "var(--bg-secondary)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            {[
              { n: 1, label: "Contact"  },
              { n: 2, label: "Delivery" },
              { n: 3, label: "Payment"  },
            ].map((s, i) => (
              <div key={s.n} className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                    style={{
                      backgroundColor: step >= s.n ? "var(--accent)" : "var(--bg-elevated)",
                      color: step >= s.n ? "#fff" : "var(--text-muted)",
                      border: step >= s.n ? "none" : "1px solid var(--border)",
                    }}
                  >
                    {step > s.n ? (
                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                    ) : s.n}
                  </div>
                  <span
                    className="text-sm font-medium hidden sm:block"
                    style={{ color: step >= s.n ? "var(--text-primary)" : "var(--text-muted)" }}
                  >
                    {s.label}
                  </span>
                </div>
                {i < 2 && (
                  <div className="w-12 h-px" style={{ backgroundColor: step > s.n ? "var(--accent)" : "var(--border)" }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* ── Left — form ── */}
          <div className="flex-1">

            {/* Step 1 — Contact */}
            {step === 1 && (
              <div
                className="rounded-2xl p-6 sm:p-8"
                style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}
              >
                <h2 className="syne text-xl mb-6" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
                  Contact Information
                </h2>

                <div className="flex flex-col gap-5">
                  <div>
                    <label style={labelStyle}>Full Name *</label>
                    <input
                      style={{ ...inputStyle, borderColor: errors.fullName ? "var(--danger)" : "var(--border)" }}
                      placeholder="Yusuf Balogun"
                      value={form.fullName}
                      onChange={(e) => update("fullName", e.target.value)}
                    />
                    {errors.fullName && (
                      <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label style={labelStyle}>Email Address *</label>
                    <input
                      type="email"
                      style={{ ...inputStyle, borderColor: errors.email ? "var(--danger)" : "var(--border)" }}
                      placeholder="yusuf@example.com"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                    />
                    {errors.email && (
                      <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label style={labelStyle}>Phone Number *</label>
                    <input
                      type="tel"
                      style={{ ...inputStyle, borderColor: errors.phone ? "var(--danger)" : "var(--border)" }}
                      placeholder="+234 800 000 0000"
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                    />
                    {errors.phone && (
                      <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>{errors.phone}</p>
                    )}
                  </div>
                </div>

                <div className="mt-8">
                  <Button size="lg" fullWidth onClick={handleNext}>
                    Continue to Delivery →
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2 — Delivery */}
            {step === 2 && (
              <div
                className="rounded-2xl p-6 sm:p-8"
                style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}
              >
                <h2 className="syne text-xl mb-6" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
                  Delivery Address
                </h2>

                <div className="flex flex-col gap-5">
                  <div>
                    <label style={labelStyle}>Street Address *</label>
                    <input
                      style={{ ...inputStyle, borderColor: errors.address ? "var(--danger)" : "var(--border)" }}
                      placeholder="12 Adeniyi Jones Avenue"
                      value={form.address}
                      onChange={(e) => update("address", e.target.value)}
                    />
                    {errors.address && (
                      <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>{errors.address}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label style={labelStyle}>City *</label>
                      <input
                        style={{ ...inputStyle, borderColor: errors.city ? "var(--danger)" : "var(--border)" }}
                        placeholder="Ilorin"
                        value={form.city}
                        onChange={(e) => update("city", e.target.value)}
                      />
                      {errors.city && (
                        <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>{errors.city}</p>
                      )}
                    </div>

                    <div>
                      <label style={labelStyle}>Postal Code</label>
                      <input
                        style={inputStyle}
                        placeholder="240001"
                        value={form.postalCode}
                        onChange={(e) => update("postalCode", e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>State *</label>
                    <select
                      style={{ ...inputStyle, borderColor: errors.state ? "var(--danger)" : "var(--border)", cursor: "pointer" }}
                      value={form.state}
                      onChange={(e) => update("state", e.target.value)}
                    >
                      <option value="">Select a state</option>
                      {NIGERIAN_STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    {errors.state && (
                      <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>{errors.state}</p>
                    )}
                  </div>

                  <div>
                    <label style={labelStyle}>Order Notes (optional)</label>
                    <textarea
                      style={{ ...inputStyle, resize: "none", minHeight: "100px" }}
                      placeholder="Any special instructions for delivery..."
                      value={form.notes}
                      onChange={(e) => update("notes", e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <Button variant="secondary" size="lg" onClick={() => setStep(1)}>
                    ← Back
                  </Button>
                  <Button size="lg" fullWidth onClick={handleNext}>
                    Continue to Payment →
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3 — Payment */}
            {step === 3 && (
              <div
                className="rounded-2xl p-6 sm:p-8"
                style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}
              >
                <h2 className="syne text-xl mb-6" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
                  Payment Method
                </h2>

                {/* Payment options */}
                <div className="flex flex-col gap-3 mb-8">

                  {/* Pay on Delivery */}
                  <div
                    onClick={() => setPaymentMethod("delivery")}
                    className="flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all"
                    style={{
                      border: `2px solid ${paymentMethod === "delivery" ? "var(--accent)" : "var(--border)"}`,
                      backgroundColor: paymentMethod === "delivery" ? "var(--accent-faint)" : "var(--bg-elevated)",
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{
                        border: `2px solid ${paymentMethod === "delivery" ? "var(--accent)" : "var(--border)"}`,
                        backgroundColor: paymentMethod === "delivery" ? "var(--accent)" : "transparent",
                      }}
                    >
                      {paymentMethod === "delivery" && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <svg width="18" height="18" fill="none" stroke="var(--accent)" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                        <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                          Pay on Delivery
                        </p>
                      </div>
                      <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                        Pay with cash when your order arrives. Available across Nigeria.
                      </p>
                    </div>
                  </div>

                  {/* Card Payment */}
                  <div
                    onClick={() => setPaymentMethod("card")}
                    className="flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all"
                    style={{
                      border: `2px solid ${paymentMethod === "card" ? "var(--accent)" : "var(--border)"}`,
                      backgroundColor: paymentMethod === "card" ? "var(--accent-faint)" : "var(--bg-elevated)",
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{
                        border: `2px solid ${paymentMethod === "card" ? "var(--accent)" : "var(--border)"}`,
                        backgroundColor: paymentMethod === "card" ? "var(--accent)" : "transparent",
                      }}
                    >
                      {paymentMethod === "card" && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <svg width="18" height="18" fill="none" stroke="var(--accent)" strokeWidth="2" viewBox="0 0 24 24">
                          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                          <line x1="1" y1="10" x2="23" y2="10"/>
                        </svg>
                        <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                          Card Payment
                        </p>
                        <span
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: "var(--accent-faint)", color: "var(--accent)" }}
                        >
                          Coming Soon
                        </span>
                      </div>
                      <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                        Pay securely with your debit or credit card via Paystack.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card form */}
                {paymentMethod === "card" && (
                  <div
                    className="rounded-xl p-5 mb-6"
                    style={{ backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border)" }}
                  >
                    {/* Demo notice */}
                    <div
                      className="flex items-center gap-2 p-3 rounded-lg mb-5 text-xs"
                      style={{
                        backgroundColor: "var(--accent-faint)",
                        border: "1px solid var(--accent-border)",
                        color: "var(--accent)",
                      }}
                    >
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                      </svg>
                      This is a UI demo — no real payment will be processed. Paystack integration coming soon.
                    </div>

                    <div className="flex flex-col gap-4">
                      <div>
                        <label style={labelStyle}>Card Number</label>
                        <input
                          style={{ ...inputStyle, borderColor: errors.cardNumber ? "var(--danger)" : "var(--border)", letterSpacing: "0.1em" }}
                          placeholder="1234 5678 9012 3456"
                          value={form.cardNumber}
                          maxLength={19}
                          onChange={(e) => update("cardNumber", formatCardNumber(e.target.value))}
                        />
                        {errors.cardNumber && (
                          <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>{errors.cardNumber}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label style={labelStyle}>Expiry Date</label>
                          <input
                            style={{ ...inputStyle, borderColor: errors.cardExpiry ? "var(--danger)" : "var(--border)" }}
                            placeholder="MM/YY"
                            value={form.cardExpiry}
                            maxLength={5}
                            onChange={(e) => update("cardExpiry", formatExpiry(e.target.value))}
                          />
                          {errors.cardExpiry && (
                            <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>{errors.cardExpiry}</p>
                          )}
                        </div>

                        <div>
                          <label style={labelStyle}>CVV</label>
                          <input
                            style={{ ...inputStyle, borderColor: errors.cardCvv ? "var(--danger)" : "var(--border)" }}
                            placeholder="123"
                            value={form.cardCvv}
                            maxLength={4}
                            onChange={(e) => update("cardCvv", e.target.value.replace(/\D/g, "").slice(0, 4))}
                          />
                          {errors.cardCvv && (
                            <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>{errors.cardCvv}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label style={labelStyle}>Cardholder Name</label>
                        <input
                          style={{ ...inputStyle, borderColor: errors.cardName ? "var(--danger)" : "var(--border)" }}
                          placeholder="Yusuf Balogun"
                          value={form.cardName}
                          onChange={(e) => update("cardName", e.target.value)}
                        />
                        {errors.cardName && (
                          <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>{errors.cardName}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button variant="secondary" size="lg" onClick={() => setStep(2)}>
                    ← Back
                  </Button>
                  <Button
                    size="lg"
                    fullWidth
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin" width="16" height="16" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                        Placing Order...
                      </span>
                    ) : (
                      `Place Order · $${total.toFixed(2)}`
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* ── Right — order summary ── */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div
              className="rounded-2xl p-6 sticky top-24"
              style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}
            >
              <h2 className="syne text-lg mb-5" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
                Order Summary
              </h2>

              {/* Items */}
              <div className="flex flex-col gap-3 mb-5">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0"
                      style={{ backgroundColor: "var(--bg-elevated)" }}>
                      <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium line-clamp-1" style={{ color: "var(--text-primary)" }}>
                        {item.name}
                      </p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-xs font-semibold flex-shrink-0" style={{ color: "var(--text-primary)" }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="h-px mb-5" style={{ backgroundColor: "var(--border)" }} />

              {/* Totals */}
              <div className="flex flex-col gap-2.5 mb-5">
                <div className="flex justify-between text-sm">
                  <span style={{ color: "var(--text-secondary)" }}>Subtotal</span>
                  <span style={{ color: "var(--text-primary)" }}>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "var(--text-secondary)" }}>Shipping</span>
                  {shipping === 0 ? (
                    <span className="font-medium" style={{ color: "var(--success)" }}>Free</span>
                  ) : (
                    <span style={{ color: "var(--text-primary)" }}>${shipping.toFixed(2)}</span>
                  )}
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "var(--text-secondary)" }}>Tax (7.5%)</span>
                  <span style={{ color: "var(--text-primary)" }}>${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="h-px mb-4" style={{ backgroundColor: "var(--border)" }} />

              <div className="flex justify-between">
                <span className="font-semibold" style={{ color: "var(--text-primary)" }}>Total</span>
                <span className="syne text-xl font-700" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
                  ${total.toFixed(2)}
                </span>
              </div>

              {/* Security note */}
              <div className="flex items-center gap-2 mt-5">
                <svg width="13" height="13" fill="none" stroke="var(--text-muted)" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Your info is safe with us
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}