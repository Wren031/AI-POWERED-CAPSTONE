import { useState, useEffect } from "react";
import { DashboardStatsService } from "../service/DashboardStatsService";

export const useDashboardStats = () => {
  const [stats, setStats] = useState({
    totalScans: 0,
    totalUsers: 0,
    totalProducts: 0,
    totalConditions: 0,
  });
  const [chartData, setChartData] = useState<{ name: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [totals, chart] = await Promise.all([
        DashboardStatsService.getTotals(),
        DashboardStatsService.getSkinConditionStats()
      ]);

      setStats({
        totalScans: totals.scans,
        totalUsers: totals.users,
        totalProducts: totals.products,
        totalConditions: totals.conditions,
      });
      setChartData(chart);
    } catch (err) {
      console.error("Hook Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { ...stats, chartData, loading, refresh: fetchStats };
};