import { supabase } from "../lib/supabase";

export const saveOrder = async (order) => {
  const { data, error } = await supabase
    .from("orders")
    .insert([{
      id:             order.id,
      status:         order.status,
      customer:       order.customer,
      delivery:       order.delivery,
      items:          order.items,
      payment_method: order.paymentMethod,
      subtotal:       order.subtotal,
      shipping:       order.shipping,
      tax:            order.tax,
      total:          order.total,
      notes:          order.notes || "",
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getOrders = async () => {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data.map((o) => ({
    ...o,
    date:          o.created_at,
    paymentMethod: o.payment_method,
  }));
};

export const getOrderById = async (id) => {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return {
    ...data,
    date:          data.created_at,
    paymentMethod: data.payment_method,
  };
};

export const updateOrderStatus = async (id, status) => {
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id);

  if (error) throw error;
  return true;
};