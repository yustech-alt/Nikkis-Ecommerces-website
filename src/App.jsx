import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { OrderProvider } from "./context/OrderContext";
import { ToastProvider } from "./context/ToastContext";
import AppLayout from "./components/layout/AppLayout";
import Home from "./pages/Home";
import ProductListing from "./pages/ProductListing";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminOrders from "./admin/pages/AdminOrders";
import AdminProducts from "./admin/pages/AdminProducts";
import AdminCustomers from "./admin/pages/AdminCustomers";
import AdminRoute from "./admin/components/AdminRoute";

function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-6 px-4"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div
        className="w-24 h-24 rounded-3xl flex items-center justify-center"
        style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border)",
        }}
      >
        <span
          className="syne text-4xl font-800"
          style={{ color: "var(--accent)", fontWeight: 800 }}
        >
          404
        </span>
      </div>
      <div className="text-center">
        <h1
          className="syne text-3xl font-700 mb-2"
          style={{ color: "var(--text-primary)", fontWeight: 700 }}
        >
          Page not found
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <a
            href="/"
            className="text-white font-semibold px-6 py-3 rounded-xl text-sm"
            style={{ backgroundColor: "var(--accent)" }}
          >
            Go Home
          </a>
          <a
            href="/products"
            className="font-medium px-6 py-3 rounded-xl text-sm"
            style={{
              backgroundColor: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
            }}
          >
            Browse Products
          </a>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <OrderProvider>
      <CartProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              {/* Customer routes */}
              <Route element={<AppLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<ProductListing />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route
                  path="/order-confirmation/:id"
                  element={<OrderConfirmation />}
                />
                <Route path="*" element={<NotFound />} />
              </Route>

              {/* Admin routes — no AppLayout, no Navbar/Footer */}
              <Route path="/admin" element={<AdminLogin />} />
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <AdminRoute>
                    <AdminOrders />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <AdminRoute>
                    <AdminProducts />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/customers"
                element={
                  <AdminRoute>
                    <AdminCustomers />
                  </AdminRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </CartProvider>
    </OrderProvider>
  );
}
