import { supabase } from "../config/supabaseClient.js";

export const CustomerModel = {
  // Mendukung Searching & Pagination
  async getAll({ name, page, limit }) {
    let query = supabase.from("customers").select("*", { count: "exact" });

    // Fitur Searching berdasarkan Nama
    if (name) {
      query = query.ilike("name", `%${name}%`);
    }

    // Fitur Pagination (page & limit)
    if (page && limit) {
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const start = (pageNum - 1) * limitNum;
      const end = start + limitNum - 1;

      query = query.range(start, end);
    }

    const { data, count, error } = await query;
    if (error) throw error;

    return {
      data,
      totalData: count,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : data.length
    };
  },

  async getById(id) {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(customerData) {
    const { data, error } = await supabase
      .from("customers")
      .insert([customerData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id, customerData) {
    const { data, error } = await supabase
      .from("customers")
      .update(customerData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async remove(id) {
    const { error } = await supabase
      .from("customers")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return true;
  },

  // Fitur Total Jumlah Pelanggan
  async getTotalCount() {
    const { count, error } = await supabase
      .from("customers")
      .select("*", { count: "exact", head: true });

    if (error) throw error;
    return count;
  }
};