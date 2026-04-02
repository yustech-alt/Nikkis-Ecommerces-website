import { createContext, useContext, useState, useEffect } from "react";
import { saveOrder, getOrders, getOrderById } from "../services/orderService";

const OrderContext = createContext(null);

const generateOrderId = () => {
  const date   = new Date();
  const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const random  = Math.floor(1000 + Math.random() * 9000);
  return `NKS-${dateStr}-${random}`;
};

export function OrderProvider({ children }) {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const placeOrder = async (orderData) => {
    const order = {
      id:     generateOrderId(),
      date:   new Date().toISOString(),
      status: "pending",
      ...orderData,
    };

    try {
      await saveOrder(order);
      setOrders((prev) => [order, ...prev]);
    } catch (err) {
      console.error("Failed to save order:", err);
      // Fallback to localStorage if Supabase fails
      const saved = JSON.parse(localStorage.getItem("nikkis_orders") || "[]");
      localStorage.setItem("nikkis_orders", JSON.stringify([order, ...saved]));
    }

    return order;
  };

  const getOrder = (id) => orders.find((o) => o.id === id);

  return (
    <OrderContext.Provider value={{ orders, loading, placeOrder, getOrder, fetchOrders }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrder must be used inside OrderProvider");
  return ctx;
}