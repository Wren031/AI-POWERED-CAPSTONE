import { supabase } from "../../../lib/supabase";
import type { SkinCondition } from "../type/SkinCondition";

export const conditionService = {
  /**
   * Fetches all skin conditions, ordered by most recent first.
   */
  async getAll(): Promise<SkinCondition[]> {
    const { data, error } = await supabase
      .from("tbl_condition")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Error fetching conditions:", error.message);
      return [];
    }
    return data;
  },

  /**
   * Creates a new skin condition record.
   * @param payload - Object containing name and description
   */
  async create(payload: { name: string; description: string }): Promise<SkinCondition> {
    const { data, error } = await supabase
      .from("tbl_condition")
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error("Create Operation Failed:", error.message);
      throw error;
    }
    return data;
  },

  /**
   * Updates an existing skin condition.
   */
  async update(id: number, payload: { name: string; description: string }): Promise<SkinCondition> {
    const { data, error } = await supabase
      .from("tbl_condition")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(`Update Failed for ID ${id}:`, error.message);
      throw error;
    }
    return data;
  },

  /**
   * Soft or hard deletes a condition by ID.
   */
  async remove(id: number): Promise<void> {
    const { error } = await supabase
      .from("tbl_condition")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(`Deletion Failed for ID ${id}:`, error.message);
      throw error;
    }
  },
};