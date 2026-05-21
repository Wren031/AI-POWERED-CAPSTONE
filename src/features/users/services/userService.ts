import { supabase } from "../../../lib/supabase";
import type { User } from "../types/User";

export const adminService = {

  async getAllUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from("tbl_profiles")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error(error);
      throw error;
    }

    return data ?? [];
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return data;
  },

  async getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();

    if (error) throw error;

    return data.user;
  },

  async getUserById(id: number): Promise<User | null> {
    const { data, error } = await supabase
      .from("tbl_profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
      throw error;
    }
    return data;
  },

};