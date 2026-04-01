import { createContext, useContext, useReducer, useEffect } from "react";

const OrderContext = createContext(null);

const generateOrderId = () => {
  const date = new Date();
  const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const random = Math.floor(1000 + Math.random() * 9000);
  return `NKS-${dateStr}-${random}`;
};

const orderReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ORDER":
      return [action.payload, ...state];
    case "LOAD_ORDERS":
      return action.payload;
    default:
      return state;
  }
};

export function OrderProvider({ children }) {
  const [orders, dispatch] = useReducer(
    orderReducer,
    [],
    () => {
      try {
        const saved = localStorage.getItem("nikkis_orders");
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
  );

  useEffect(() => {
    localStorage.setItem("nikkis_orders", JSON.stringify(orders));
  }, [orders]);

  const placeOrder = (orderData) => {
    const order = {
      id: generateOrderId(),
      date: new Date().toISOString(),
      status: "pending",
      ...orderData,
    };
    dispatch({ type: "ADD_ORDER", payload: order });
    return order;
  };

  const getOrder = (id) => orders.find((o) => o.id === id);

  return (
    <OrderContext.Provider value={{ orders, placeOrder, getOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrder must be used inside OrderProvider");
  return ctx;
}