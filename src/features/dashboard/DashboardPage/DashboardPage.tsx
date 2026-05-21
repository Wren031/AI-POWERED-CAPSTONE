import React, { useState, useEffect, useCallback, useMemo } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  Activity,
  Zap,
  Users,
  ShieldCheck,
  ArrowUpRight,
  Circle,
  FileText,
  Loader2,
} from "lucide-react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useDashboardStats } from "../hooks/useDashboardStats";
import { DashboardStatsService } from "../service/DashboardStatsService";
import TitleSize from "../../../styles/TitleSize";
import { supabase } from "../../../lib/supabase";

// DermaAI Theme Palette
const dermaTeal = "#00A3AD";
const dermaSlate = "#0F172A";

/* -------------------------------------------------------------------------- */
/* TOOLTIP UI                                                                 */
/* -------------------------------------------------------------------------- */

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={styles.tooltipContainer}>
        <div style={styles.tooltipHeader}>{label}</div>
        {payload.map((entry: any, index: number) => (
          <div key={index} style={styles.tooltipRow}>
            <div style={{ ...styles.tooltipDot, background: entry.color }} />
            <span style={styles.tooltipText}>{entry.name}</span>
            <span style={styles.tooltipValue}>{entry.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

/* -------------------------------------------------------------------------- */
/* STAT CARD                                                                  */
/* -------------------------------------------------------------------------- */

interface StatCardProps {
  label: string;
  value: string | number;
  growth: string;
  icon: ReactNode;
  color: string;
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, growth, icon, color, loading }) => {
  return (
    <div className={`glass-card hover-card ${loading ? "shimmer" : ""}`} style={styles.statCard}>
      {loading ? (
        <div style={{ height: "60px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ width: "40%", height: "10px", background: "#f1f5f9", borderRadius: "4px", marginBottom: "12px" }} />
          <div style={{ width: "80%", height: "24px", background: "#f1f5f9", borderRadius: "4px" }} />
        </div>
      ) : (
        <>
          <div style={styles.statCardTop}>
            <div style={{ ...styles.iconWrapper, background: `${color}15`, color }}>
              {icon}
            </div>
            <div style={styles.growthPill}>
              <ArrowUpRight size={12} />
              {growth}
            </div>
          </div>
          <div style={styles.statValue}>{value}</div>
          <div style={styles.statFooter}>
            <span style={styles.statLabel}>{label}</span>
            <div style={styles.liveBadge}>
              <div style={styles.liveDot} />
              Live
            </div>
          </div>
        </>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* MAIN PAGE                                                                  */
/* -------------------------------------------------------------------------- */

export default function DashboardPage() {
  const {
    totalScans = 0,
    totalUsers = 0,
    totalProducts = 0,
    totalConditions = 0,
  } = useDashboardStats();

  const [view, setView] = useState<"total" | "monthly">("monthly");
  const [chartData, setChartData] = useState<any[]>([]);
  const [recentScans, setRecentScans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullyReady, setIsFullyReady] = useState(false);
  const [recentLogins, setRecentLogins] = useState<any[]>([]);

  useEffect(() => {
    let channel: any;

    const init = async () => {
      const data = await DashboardStatsService.getRecentLogin();
      setRecentLogins(data);

      channel = DashboardStatsService.subscribeRecentLogin((payload) => {
        const newUser = payload.new;

        setRecentLogins((prev) => {
          const updated = [...prev];

          const index = updated.findIndex(
            (u) => u.id === newUser.id
          );

          if (index !== -1) {
            updated[index] = newUser;
          } else {
            updated.unshift(newUser);
          }

          return updated;
        });
      });
    };

    init();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  

  const getUserStatus = (user: any) => {
    if (user.status) return user.status.toLowerCase();

    if (!user.last_login) return "offline";

    const last = new Date(user.last_login);
    if (isNaN(last.getTime())) return "offline";

    const now = new Date();
    const diffMins = (now.getTime() - last.getTime()) / (1000 * 60);
    const diffHours = diffMins / 60;

    if (diffMins <= 5) return "online";
    if (diffHours < 1) return "recent";
    return "offline";
  };


const sortedUsers = useMemo(() => {
  return [...recentLogins].sort((a, b) => {
    const getPriority = (user: any) => {
      const status = getUserStatus(user);

      if (status === "online") return 3;
      if (status === "recent") return 2;
      return 1;
    };

    return getPriority(b) - getPriority(a);
  });
}, [recentLogins]);



const getStatusColor = (status: string) => {
  switch (status) {
    case "online":
      return "#10b981"; // green
    case "recent":
      return "#f59e0b"; // orange
    default:
      return "#ef4444"; // red
  }
};





  const fetchData = useCallback(async (showLoadingState: boolean) => {
  if (showLoadingState) setIsLoading(true);

  try {
    const [analyticsData, scansData, loginData] = await Promise.all([
      view === "monthly"
        ? DashboardStatsService.getMonthlyStats()
        : DashboardStatsService.getSkinConditionStats(),
      DashboardStatsService.getRecentScans(),
      DashboardStatsService.getRecentLogin(), // ✅ ADD THIS
    ]);

    const mappedData = analyticsData.map((item: any) => ({
      ...item,
      secondaryCount: Math.max(0, item.count * (0.6 + Math.random() * 0.4)),
    }));

    setChartData(mappedData);
    setRecentScans(scansData);

    // ✅ set recent logins
    setRecentLogins(loginData || []);
  } catch (error) {
    console.error("Dashboard refresh failed:", error);
  } finally {
    setIsLoading(false);
    if (!isFullyReady) {
      setTimeout(() => setIsFullyReady(true), 600);
    }
  }
}, [view, isFullyReady]);

  // const fetchData = useCallback(async (showLoadingState: boolean) => {
  //   if (showLoadingState) setIsLoading(true);
    
  //   try {
  //     const [analyticsData, scansData] = await Promise.all([
  //       view === "monthly" 
  //         ? DashboardStatsService.getMonthlyStats() 
  //         : DashboardStatsService.getSkinConditionStats(),
  //       DashboardStatsService.getRecentScans()
  //     ]);
      
  //     const mappedData = analyticsData.map((item: any) => ({
  //       ...item,
  //       secondaryCount: Math.max(0, item.count * (0.6 + Math.random() * 0.4)) 
  //     }));

  //     setChartData(mappedData);
  //     setRecentScans(scansData);
  //   } catch (error) {
  //     console.error("Dashboard refresh failed:", error);
  //   } finally {
  //     setIsLoading(false);
  //     if (!isFullyReady) {
  //       setTimeout(() => setIsFullyReady(true), 600);
  //     }
  //   }
  // }, [view, isFullyReady]);

  const getTimeAgo = (dateString: string) => {
  const now = new Date();
  const past = new Date(dateString);

  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
};

  useEffect(() => {
    fetchData(true);
  }, [view, fetchData]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchData(false);
    }, 10000);
    return () => clearInterval(intervalId);
  }, [fetchData]);

  if (!isFullyReady) {
    return (
      <div style={styles.page}>
        <div style={styles.fullLoaderArea}>
          <Loader2 className="animate-spin" size={42} color={dermaTeal} />
          <p style={{ marginTop: 16, color: "#94a3b8", fontWeight: 600, fontSize: "14px" }}>
            Synchronizing Clinical Data...
          </p>
        </div>
        <style>{`
          .animate-spin { animation: spin 1s linear infinite; }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        .dashboard-container { max-width: 1400px; margin: 0 auto; }
        .stats-grid { display: grid; gap: 20px; grid-template-columns: repeat(4, 1fr); margin-bottom: 24px; }
        .visual-grid { display: grid; gap: 24px; grid-template-columns: 2.3fr 1fr; }
        .dashboard-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; gap: 20px; }

        @keyframes shimmer { 0% { background-position: -468px 0; } 100% { background-position: 468px 0; } }
        .shimmer { background: #f6f7f8; background-image: linear-gradient(to right, #f6f7f8 0%, #eefcfd 20%, #f6f7f8 40%, #f6f7f8 100%); background-repeat: no-repeat; background-size: 800px 100%; animation: shimmer 1.2s linear infinite forwards; }
        .glass-card { background: rgba(255,255,255,0.92); backdrop-filter: blur(18px); border: 1px solid #f1f5f9; box-shadow: 0 10px 40px rgba(15,23,42,0.03); border-radius: 24px; }
        .hover-card { transition: all .28s ease; }
        .hover-card:hover { transform: translateY(-4px); box-shadow: 0 20px 50px rgba(0, 163, 173, 0.08); }
        .user-item:not(:last-child) { border-bottom: 1px solid #f1f5f9; }
        table { width: 100%; border-collapse: collapse; }
        th { text-align: left; padding: 12px; color: #94a3b8; font-size: 11px; font-weight: 700; text-transform: uppercase; border-bottom: 1px solid #f1f5f9; }
        td { padding: 14px 12px; color: #0f172a; font-size: 13px; border-bottom: 1px solid #f1f5f9; }
        
        .segment-btn:hover { color: ${dermaTeal}; }
      `}</style>

      <div className="dashboard-container">
        <header className="dashboard-header">
          <TitleSize
            title="Dashboard Overview"
            subtitle="System performance and diagnostic throughput."
          />
          <div style={styles.systemCard}>
            <div style={styles.systemPulse} />
            <div>
              <div style={styles.systemTitle}>AI Engine Status</div>
              <div style={styles.systemSub}>Operational • 99.9% uptime</div>
            </div>
          </div>
        </header>

        <section className="stats-grid">
          <StatCard loading={isLoading} label="Total Scans" value={totalScans.toLocaleString()} growth="+12%" color={dermaTeal} icon={<Activity size={20} />} />
          <StatCard loading={isLoading} label="Total Users" value={totalUsers.toLocaleString()} growth="+5%" color="#ec4899" icon={<Users size={20} />} />
          <StatCard loading={isLoading} label="Active Products" value={totalProducts.toLocaleString()} growth="+18%" color="#8b5cf6" icon={<Zap size={20} />} />
          <StatCard loading={isLoading} label="Conditions" value={totalConditions.toLocaleString()} growth="+8%" color="#f59e0b" icon={<ShieldCheck size={20} />} />
        </section>

        <div className="visual-grid">
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            <div className="glass-card hover-card" style={styles.chartCard}>
              <div className="chart-header" style={styles.chartHeader}>
                <h3 style={styles.cardTitle}>{view === "monthly" ? "Scan Volume" : "Condition Data"}</h3>
                <div style={styles.segmented}>
                  <button onClick={() => setView("monthly")} style={{...styles.segmentBtn, ...(view === "monthly" ? styles.segmentBtnActive : {})}}>Monthly</button>
                  <button onClick={() => setView("total")} style={{...styles.segmentBtn, ...(view === "total" ? styles.segmentBtnActive : {})}}>Total</button>
                </div>
              </div>
              
              <div style={{ width: "100%", height: "250px" }}>
                {isLoading ? (
                  <div style={styles.loadingContainer}>
                     <Loader2 className="animate-spin" color={dermaTeal} />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={dermaTeal} stopOpacity={0.4}/><stop offset="95%" stopColor={dermaTeal} stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="pinkGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f472b6" stopOpacity={0.2}/><stop offset="95%" stopColor="#f472b6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="secondaryCount" stroke="#f472b6" strokeWidth={3} fill="url(#pinkGradient)" />
                      <Area type="monotone" dataKey="count" stroke={dermaTeal} strokeWidth={3} fill="url(#cyanGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="glass-card hover-card" style={styles.tableCard}>
              <div style={{...styles.userCardHeader, marginBottom: "12px"}}>
                <h3 style={styles.cardTitle}>Recent Scan History</h3>
                <div style={styles.countBadge}><FileText size={12} style={{marginRight: 4}}/> Latest Logs</div>
              </div>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr><th>Full Name</th><th>AI Confidence</th><th>Scan Date</th></tr>
                  </thead>
                  <tbody>
                    {isLoading ? [...Array(4)].map((_, i) => (
                      <tr key={i}>
                        <td><div className="shimmer" style={{ width: "100px", height: "14px", borderRadius: "4px" }} /></td>
                        <td><div className="shimmer" style={{ width: "40px", height: "14px", borderRadius: "4px" }} /></td>
                        <td><div className="shimmer" style={{ width: "80px", height: "14px", borderRadius: "4px" }} /></td>
                      </tr>
                    ) ) : recentScans.map((scan, index) => (
                      <tr key={index}>
                        <td style={{fontWeight: 600}}>{scan.full_name}</td>
                        <td>
                          <span style={{ padding: '3px 8px', borderRadius: '10px', background: scan.confidence > 80 ? '#f0fdfd' : '#fff7ed', color: scan.confidence > 80 ? dermaTeal : '#d97706', fontSize: '11px', fontWeight: 700 }}>
                            {scan.confidence}%
                          </span>
                        </td>
                        <td style={{color: '#94a3b8'}}>{scan.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="glass-card hover-card" style={styles.userCard}>
            <div style={styles.userCardHeader}>
              <h3 style={styles.cardTitle}>Recent Logins</h3>
              <div style={styles.countBadge}>{setRecentLogins.length} Active</div>
            </div>
<div style={styles.userList}>
{sortedUsers.map((user: any) => {
  const status = getUserStatus(user);
  const color = getStatusColor(status);



    return (
      <div key={user.id} style={styles.userItem}>
        
        {/* Avatar */}
        <div style={styles.userAvatar}>
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
            />
          ) : (
            <span style={{ color: dermaTeal }}>
              {user.first_name?.charAt(0) || "U"}
            </span>
          )}
        </div>

        {/* Info */}
        <div style={styles.userInfo}>
          <div style={styles.userName}>
            {user.first_name} {user.last_name}
          </div>

          <div style={styles.userTime}>
            {user.last_login
              ? getTimeAgo(user.last_login)
              : "No login yet"}
          </div>
        </div>

        {/* Status dot */}
        <Circle size={8} fill={color} color={color} />
      </div>
    );
  })}
</div>

          </div>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: { padding: '0px' },
  fullLoaderArea: { height: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" },
  systemCard: { display: "flex", alignItems: "center", gap: "12px", padding: "10px 16px", borderRadius: "12px", background: "#fff", border: "1px solid #f1f5f9" },
  systemPulse: { width: "8px", height: "8px", borderRadius: "50%", background: dermaTeal, boxShadow: `0 0 0 4px rgba(0, 163, 173, 0.1)` },
  systemTitle: { fontSize: "12px", fontWeight: 700, color: dermaSlate },
  systemSub: { fontSize: "11px", color: "#94a3b8" },
  statCard: { padding: "20px" },
  statCardTop: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  iconWrapper: { width: "38px", height: "38px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" },
  growthPill: { display: "flex", alignItems: "center", gap: "4px", color: "#10b981", fontSize: "11px", fontWeight: 700 },
  statValue: { fontSize: "24px", fontWeight: 800, color: dermaSlate, margin: "12px 0" },
  statFooter: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  statLabel: { color: "#94a3b8", fontSize: "12px", fontWeight: 600 },
  liveBadge: { display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", color: dermaTeal, fontWeight: 700 },
  liveDot: { width: "5px", height: "5px", borderRadius: "50%", background: dermaTeal },
  chartCard: { padding: "24px" },
  tableCard: { padding: "24px" },
  chartHeader: { display: "flex", justifyContent: "space-between", marginBottom: "20px" },
  cardTitle: { margin: 0, fontSize: "15px", fontWeight: 700, color: dermaSlate },
  segmented: { display: "flex", gap: "4px", background: "#f1f5f9", padding: "3px", borderRadius: "8px" },
  segmentBtn: { border: "none", background: "transparent", padding: "5px 12px", borderRadius: "6px", cursor: "pointer", color: "#94a3b8", fontWeight: 700, fontSize: "11px", transition: "all 0.2s" },
  segmentBtnActive: { background: "#fff", color: dermaTeal, boxShadow: "0 2px 4px rgba(0,0,0,0.05)" },
  loadingContainer: { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" },
  userCard: { padding: "24px" },
  userCardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  countBadge: { background: "#f8fafc", border: "1px solid #f1f5f9", color: "#94a3b8", padding: "4px 10px", borderRadius: "8px", fontSize: "11px", fontWeight: 700, display: "flex", alignItems: "center" },
  userList: { display: "flex", flexDirection: "column" },
  userItem: { display: "flex", alignItems: "center", gap: "12px", padding: "14px 0" },
  userAvatar: { width: "34px", height: "34px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "13px" },
  userInfo: { flex: 1 },
  userName: { fontSize: "13px", fontWeight: 700, color: dermaSlate },
  userTime: { fontSize: "11px", color: "#94a3b8" },
  tooltipContainer: { background: "rgba(15, 23, 42, 0.95)", backdropFilter: "blur(4px)", borderRadius: "10px", padding: "12px", minWidth: "140px", border: "1px solid rgba(255,255,255,0.1)" },
  tooltipHeader: { color: "#94a3b8", fontSize: "10px", fontWeight: 700, marginBottom: "8px", textTransform: "uppercase" },
  tooltipRow: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" },
  tooltipDot: { width: "6px", height: "6px", borderRadius: "50%" },
  tooltipText: { color: "#fff", fontSize: "11px", flex: 1 },
  tooltipValue: { color: "#fff", fontWeight: 800, fontSize: "11px" },
};