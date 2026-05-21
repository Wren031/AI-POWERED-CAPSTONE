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
  scans: number;
  users: number;
  products: number;
  conditions: number;
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

async getYearlyStats(year: number = new Date().getFullYear()): Promise<MonthlyStats[]> {
    try {
      // Define the date range for the selected year
      const startDate = `${year}-01-01T00:00:00Z`;
      const endDate = `${year}-12-31T23:59:59Z`;

      // 1. Fetch created_at with range filtering for performance
      const [scans, users, products, conditions] = await Promise.all([
        supabase.from("tbl_users_skin_result").select("created_at").gte("created_at", startDate).lte("created_at", endDate),
        supabase.from("tbl_profiles").select("created_at").gte("created_at", startDate).lte("created_at", endDate),
        supabase.from("tbl_products").select("created_at").gte("created_at", startDate).lte("created_at", endDate),
        supabase.from("tbl_condition").select("created_at").gte("created_at", startDate).lte("created_at", endDate),
      ]);

      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      
      // 2. Initialize map
      const monthlyMap: Record<string, MonthlyStats> = {};
      monthNames.forEach(month => {
        monthlyMap[month] = { name: month, scans: 0, users: 0, products: 0, conditions: 0 };
      });

      // 3. Aggregate helper
      const aggregate = (data: any[] | null, key: keyof MonthlyStats) => {
        data?.forEach((item) => {
          if (!item.created_at) return;
          const date = new Date(item.created_at);
          // Safety check: ensure the item belongs to the year we are looking for
          if (date.getFullYear() === year) {
            const monthLabel = monthNames[date.getMonth()];
            (monthlyMap[monthLabel][key] as number)++;
          }
        });
      };

      aggregate(scans.data, "scans");
      aggregate(users.data, "users");
      aggregate(products.data, "products");
      aggregate(conditions.data, "conditions");

      return monthNames.map((month) => monthlyMap[month]);
    } catch (error: any) {
      console.error("Yearly stats error:", error.message);
      return [];
    }
  },

  // Helper to get the grand total for the specific year displayed
  getTotalYearlyStats(data: MonthlyStats[]): TotalsResponse {
    return data.reduce((acc, curr) => ({
      scans: acc.scans + curr.scans,
      users: acc.users + curr.users,
      products: acc.products + curr.products,
      conditions: acc.conditions + curr.conditions,
    }), { scans: 0, users: 0, products: 0, conditions: 0 });
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