import { supabase } from "../../../lib/supabase";
import type { Products } from "../types/Products";

export const productServices = {
  async getAll(): Promise<Products[]> {
    const { data, error } = await supabase
      .from("tbl_products")
      .select("*");

    if (error) {
      console.error("Error fetching products:", error.message);
      return [];
    }

    return data ?? [];
  },

  async uploadImage(file: File): Promise<string | null> {
    const fileName = `${Date.now()}-${Math.random()}-${file.name}`;

    const { error } = await supabase.storage
      .from("products")
      .upload(fileName, file);

    if (error) {
      console.error("Upload error:", error.message);
      return null;
    }

    const { data } = supabase.storage
      .from("products")
      .getPublicUrl(fileName);

    return data.publicUrl;
  },


  async create(product: Omit<Products, "id" | "created_at">): Promise<Products | null> {
      const { data, error } = await supabase
        .from("tbl_products")
        .insert([{
          product_name: product.product_name,
          type: product.type,
          price: product.price,
          image_url: product.image_url,
          usage: product.usage,
          instructions: product.instructions,
          usage_duration: product.usage_duration
        }])
        .select()
        .single();

      if (error) {
        console.error("Error creating product:", error.message);
        return null;
      }
      return data;
    },

async update(id: string, updates: Partial<Products>): Promise<Products | null> {
    const { data, error } = await supabase
      .from("tbl_products")
      .update({
          product_name: updates.product_name,
          type: updates.type,
          price: updates.price,
          image_url: updates.image_url,
          usage: updates.usage,
          instructions: updates.instructions,
          usage_duration: updates.usage_duration
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating product:", error.message);
      return null;
    }
    return data;
  },

async delete(id: string): Promise<boolean> { // Ensure id is string if using UUID
    const { error } = await supabase
      .from("tbl_products")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting product:", error.message);
      return false;
    }
    return true;
  },
};