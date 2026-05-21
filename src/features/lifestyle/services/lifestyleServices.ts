
import { supabase } from "../../../lib/supabase";
import type { LifestyleTip } from "../types/Lifestyle";

export const lifestyleServices = {
  async getTips() {
    const { data, error } = await supabase
      .from("tbl_lifestyle_tips")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as LifestyleTip[];
  },

    async addTip(tip: { category: string; title: string; description: string }) {
        // .insert() triggers a POST request
        const { data, error } = await supabase
        .from("tbl_lifestyle_tips")
        .insert([tip]) // Supabase expects an array for inserts
        .select();

        if (error) {
        console.error("Supabase Error:", error);
        throw error;
        }
        return data;
    },
  async updateTip(id: string, tip: Partial<LifestyleTip>) {
    const { error } = await supabase
      .from("tbl_lifestyle_tips")
      .update(tip)
      .eq("id", id);
    if (error) throw error;
  },

  async deleteTip(id: string) {
    const { error } = await supabase
      .from("tbl_lifestyle_tips")
      .delete()
      .eq("id", id);
    if (error) throw error;
  }
};