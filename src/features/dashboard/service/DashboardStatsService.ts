import { supabase } from "../../../lib/supabase";


export type TotalsResponse = {
  scans: number;
  users: number;
  products: number;
  conditions: number;
};

export type SkinConditionStats = {
  name: string;
  count: number;
};

export type MonthlyStats = {
  name: string;
  count: number;
};

export type RecentScan = {
  full_name: string;
  confidence: number;
  date: string;
};



export const DashboardStatsService = {
  async getTotals(): Promise<TotalsResponse> {
    try {
      const [scans, users, products, conditions] = await Promise.all([
        supabase.from("tbl_users_skin_result").select("*", { count: "exact", head: true }),
        supabase.from("tbl_profiles").select("*", { count: "exact", head: true }),
        supabase.from("tbl_products").select("*", { count: "exact", head: true }),
        supabase.from("tbl_condition").select("*", { count: "exact", head: true }),
      ]);

      return {
        scans: scans.count ?? 0,
        users: users.count ?? 0,
        products: products.count ?? 0,
        conditions: conditions.count ?? 0,
      };
    } catch (error: any) {
      console.error("Fetch totals error:", error.message);
      return { scans: 0, users: 0, products: 0, conditions: 0 };
    }
  },

  async getSkinConditionStats(): Promise<SkinConditionStats[]> {
    try {
      const { data: allConditions, error: condError } = await supabase.from("tbl_condition").select("name");
      const { data: scanResults, error: scanError } = await supabase.from("tbl_users_skin_result_condition").select("label");

      if (condError || scanError) throw condError || scanError;

      const scanCounts: Record<string, number> = {};
      scanResults?.forEach((item) => {
        const label = item.label?.toLowerCase().trim();
        if (label) scanCounts[label] = (scanCounts[label] || 0) + 1;
      });

      return (allConditions || []).map((c) => ({
        name: c.name,
        count: scanCounts[c.name?.toLowerCase().trim()] || 0,
      })).sort((a, b) => b.count - a.count);
    } catch (error: any) {
      console.error("Condition stats error:", error.message);
      return [];
    }
  },

  async getMonthlyStats(): Promise<MonthlyStats[]> {
    try {
      const { data, error } = await supabase.from("tbl_users_skin_result").select("created_at");
      if (error) throw error;

      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthlyMap: Record<string, number> = {};

      data?.forEach((item) => {
        if (!item.created_at) return;
        const monthLabel = monthNames[new Date(item.created_at).getMonth()];
        monthlyMap[monthLabel] = (monthlyMap[monthLabel] || 0) + 1;
      });

      return monthNames.map((month) => ({ name: month, count: monthlyMap[month] || 0 }));
    } catch (error: any) {
      console.error("Monthly stats error:", error.message);
      return [];
    }
  },

async getRecentLogin(): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from("tbl_profiles")
      .select("id, first_name, last_name, avatar_url, last_login, status")
      .order("last_login", { ascending: false })
      .limit(20);

    if (error) {
      console.log("Get recent login error:", error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.log("Unexpected error:", err);
    return [];
  }
},

subscribeRecentLogin(callback: (payload: any) => void) {
  return supabase
    .channel("realtime-profiles")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "tbl_profiles",
      },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();
},

  async getRecentScans(): Promise<RecentScan[]> {
    try {
      const { data, error } = await supabase
        .from("tbl_users_skin_result")
        .select(`
          created_at,
          confidence, 
          tbl_profiles (
            first_name,
            middle_name,
            last_name,
            suffix
          )
        `)
        .order("created_at", { ascending: false })
        .limit(6);

      if (error) throw error;

      return (data || []).map((item: any) => {
        const p = Array.isArray(item.tbl_profiles) ? item.tbl_profiles[0] : item.tbl_profiles;
        
        const fullName = p 
          ? `${p.first_name ?? ""}${p.middle_name ? " " + p.middle_name[0] + "." : ""} ${p.last_name ?? ""}${p.suffix ? " " + p.suffix : ""}`.replace(/\s+/g, ' ').trim()
          : "Unknown User";

        return {
          full_name: fullName,
          confidence: item.confidence ?? 0,
          date: item.created_at ? new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A",
        };
      });
    } catch (error: any) {
      console.error("Recent scans error:", error.message);
      return [];
    }
  },
};