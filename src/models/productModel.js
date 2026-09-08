import { supabase } from "../config/supabaseClient.js";

export const ProductModel = {
  async getAll(filters = {}) {
    let query = supabase.from("products").select("*");

    // Tingkat Mudah: Filter pencarian nama (case-insensitive)
    if (filters.name) {
      query = query.ilike("name", `%${filters.name}%`);
    }

    // Tingkat Sedang: Filter berdasarkan category_id
    if (filters.category_id) {
      query = query.eq("category_id", filters.category_id);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // ... simpan method getById, create, update, remove milikmu yang lama di bawah ini
};