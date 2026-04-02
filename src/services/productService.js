import { supabase } from "../lib/supabase";

// Format DB product to match our app shape
const format = (p) => ({
  id:          p.id,
  name:        p.name,
  category:    p.category,
  price:       p.price,
  oldPrice:    p.old_price,
  rating:      p.rating,
  reviews:     p.reviews,
  badge:       p.badge,
  inStock:     p.in_stock,
  images:      p.images,
  description: p.description,
  specs:       p.specs || {},
});

export const getProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data.map(format);
};

export const getProductById = async (id) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return format(data);
};

export const getProductsByCategory = async (category) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", category)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data.map(format);
};

export const addProduct = async (product) => {
  const { data, error } = await supabase
    .from("products")
    .insert([{
      name:        product.name,
      category:    product.category,
      price:       product.price,
      old_price:   product.oldPrice,
      badge:       product.badge,
      in_stock:    product.inStock,
      images:      product.images,
      description: product.description,
      specs:       product.specs || {},
    }])
    .select()
    .single();

  if (error) throw error;
  return format(data);
};

export const updateProduct = async (id, updates) => {
  const { data, error } = await supabase
    .from("products")
    .update({
      name:        updates.name,
      category:    updates.category,
      price:       updates.price,
      old_price:   updates.oldPrice,
      badge:       updates.badge,
      in_stock:    updates.inStock,
      images:      updates.images,
      description: updates.description,
      specs:       updates.specs || {},
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return format(data);
};

export const deleteProduct = async (id) => {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
};