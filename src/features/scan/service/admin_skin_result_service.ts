import { supabase } from "../../../lib/supabase";

export const admin_skin_result_service = {
  /**
   * Fetches the total count of scans performed today
   */
  async getTodayScanCount() {
    try {
      const now = new Date();
      // Start of today (midnight)
      const startOfDay = new Date(now.setHours(0, 0, 0, 0)).toISOString();
      // End of today (11:59 PM)
      const endOfDay = new Date(now.setHours(23, 59, 59, 999)).toISOString();

      const { count, error } = await supabase
        .from('tbl_users_skin_result')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfDay)
        .lte('created_at', endOfDay);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error("[Admin Service] Count Error:", error);
      return 0;
    }
  },

  async getAllSkinResultsWithDetails() {
    try {
      const { data, error } = await supabase
        .from('tbl_users_skin_result')
        .select(`
          *,
          profile:profile_id (first_name, last_name, avatar_url),
          conditions:tbl_users_skin_result_condition (*),
          user_recommendations:tbl_users_recommendation (
            recommendation:recommendation_id (
              treatment,
              precautions,
              rec_products:tbl_recommendation_products (product:product_id (*)),
              rec_lifestyle:tbl_recommendation_lifestyle_tips (lifestyle:lifestyle_tip_id (*))
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data ?? []).map((item: any) => {
        const recBase = item.user_recommendations?.[0]?.recommendation;
        return {
          ...item,
          user_name: item.profile ? `${item.profile.first_name} ${item.profile.last_name}` : 'Unknown',
          treatment: recBase?.treatment || "No treatment assigned",
          precautions: recBase?.precautions || "No precautions assigned",
          products: recBase?.rec_products?.map((p: any) => p.product) || [],
          lifestyle: recBase?.rec_lifestyle?.map((l: any) => l.lifestyle) || []
        };
      });
    } catch (error) {
      console.error("[Admin Service] Error:", error);
      return [];
    }
  }
};