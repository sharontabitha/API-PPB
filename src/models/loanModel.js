import { supabase } from "../config/supabaseclient.js";

export const LoanModel = {
  async getAll({ status } = {}) {
    let query = supabase.from("loans").select("*").order("id", { ascending: false });
    if (status) query = query.eq("status", status);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from("loans")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async create(loan) {
    const { data, error } = await supabase
      .from("loans")
      .insert(loan)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, loan) {
    const { data, error } = await supabase
      .from("loans")
      .update(loan)
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async remove(id) {
    const { data, error } = await supabase
      .from("loans")
      .delete()
      .eq("id", id)
      .select("id")
      .maybeSingle();
    if (error) throw error;
    return Boolean(data);
  },
};