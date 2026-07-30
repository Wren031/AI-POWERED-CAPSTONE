import React, { useState, useEffect } from "react";
import type { CSSProperties } from "react";
import { 
  Users, Calendar, ShieldCheck, FileDown, 
  TrendingUp, Activity, ChevronDown, Zap, HeartPulse, ArrowUpRight 
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { DashboardStatsService, type MonthlyStats, type TotalsResponse, type SkinConditionStats } from "../../dashboard/service/DashboardStatsService";

const COLORS = {
  primary: "#00A3AD",
  secondary: "#8B5CF6",
  warning: "#F59E0B",
  pink: "#EC4899",
  textMain: "#1E293B",
  textMuted: "#94A3B8",
  border: "#F1F5F9",
  bg: "#F8FAFC",
  white: "#FFFFFF",
  success: "#10B981"
};

export default function ClinicalDashboard() {
  const [totals, setTotals] = useState<TotalsResponse>({ scans: 0, users: 0, products: 0, conditions: 0 });
  const [yearlyData, setYearlyData] = useState<MonthlyStats[]>([]);
  const [conditionStats, setConditionStats] = useState<SkinConditionStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"scans" | "users">("scans");
  const selectedYear = 2026;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [allTotals, yearly, conditions] = await Promise.all([
        DashboardStatsService.getTotals(),
        DashboardStatsService.getYearlyStats(selectedYear),
        DashboardStatsService.getSkinConditionStats(),
      ]);
      setTotals(allTotals);
      setYearlyData(yearly);
      setConditionStats(conditions);
    } catch (error) {
      console.error("Sync Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalConditionInstances = conditionStats.reduce((sum, item) => sum + item.count, 0);

  if (loading) return (
    <div style={styles.loading}>
      <Activity className="animate-spin" size={32} color={COLORS.primary} />
    </div>
  );

  return (
    <div style={styles.container}>
      <style>{`
        @media print { .no-print { display: none !important; } body { background: white !important; } }
        .animate-spin { animation: spin 1s linear infinite; } 
        @keyframes spin { to { transform: rotate(360deg); } }
        
        /* Responsive Grid Logic */
        .stats-grid { 
          display: grid; 
          grid-template-columns: repeat(4, 1fr); 
          gap: 24px; 
          margin-bottom: 32px; 
        }
        .main-grid { 
          display: grid; 
          grid-template-columns: 2fr 1fr; 
          gap: 24px; 
          margin-bottom: 24px; 
        }

        @media (max-width: 1200px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 992px) {
          .main-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 640px) {
          .stats-grid { grid-template-columns: 1fr; }
          .header-flex { flex-direction: column; align-items: flex-start !important; gap: 20px; }
          .container-padding { padding: 20px !important; }
        }
      `}</style>

      {/* Header */}
      <header style={styles.header} className="header-flex">
        <div>
          <h1 style={styles.title}>Clinical Analytics Report</h1>
          <p style={styles.subtitle}>Comprehensive diagnostic overview for {selectedYear}</p>
        </div>
        <div style={styles.headerActions} className="no-print">
           <button style={styles.pdfBtn} onClick={() => window.print()}>
            <FileDown size={18} /> Export PDF
          </button>
          <div style={styles.yearDropdown}>
            <Calendar size={16} color={COLORS.primary} />
            <span>Fiscal Year {selectedYear}</span>
            <ChevronDown size={16} color={COLORS.textMuted} />
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="stats-grid">
        <StatCard icon={<HeartPulse size={20} />} label="Total AI Scans" value={totals.scans} trend="+12%" color={COLORS.primary} iconBg="#E0F2F1" />
        <StatCard icon={<Users size={20} />} label="Total Patient Reach" value={totals.users} trend="+5%" color={COLORS.pink} iconBg="#FCE7F3" />
        <StatCard icon={<Zap size={20} />} label="Products Cataloged" value={totals.products} trend="+18%" color={COLORS.secondary} iconBg="#EDE9FE" />
        <StatCard icon={<ShieldCheck size={20} />} label="Condition Instances" value={totals.conditions} trend="+8%" color={COLORS.warning} iconBg="#FEF3C7" />
      </div>

      <div className="main-grid">
        {/* Bar Chart */}
        <div style={styles.chartCard}>
          <div style={styles.chartHeader} className="header-flex">
            <div>
              <h3 style={styles.sectionTitle}>
                {activeTab === 'scans' ? 'Scanning Volume' : 'User Onboarding'} Trends
              </h3>
              <p style={{...styles.subtitle, margin: 0}}>Monthly distribution</p>
            </div>
            <div style={styles.toggleGroup} className="no-print">
              <button 
                onClick={() => setActiveTab("scans")}
                style={activeTab === "scans" ? styles.toggleBtnActive : styles.toggleBtnInactive}
              >
                Scans
              </button>
              <button 
                onClick={() => setActiveTab("users")}
                style={activeTab === "users" ? styles.toggleBtnActive : styles.toggleBtnInactive}
              >
                Users
              </button>
            </div>
          </div>
          
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
              <BarChart data={yearlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 12, fill: COLORS.textMuted, fontWeight: 500}} 
                    dy={10}
                />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: COLORS.textMuted}} />
                <Tooltip 
                    cursor={{fill: '#F8FAFC'}}
                    contentStyle={styles.tooltip} 
                    itemStyle={{fontWeight: 600, fontSize: '12px', color: activeTab === 'scans' ? COLORS.primary : COLORS.secondary}}
                />
                <Bar 
                    dataKey={activeTab} 
                    fill={activeTab === 'scans' ? COLORS.primary : COLORS.secondary} 
                    radius={[6, 6, 0, 0]} 
                    barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Prevalence Sidebar */}
        <div style={styles.distributionCard}>
          <h3 style={styles.sectionTitle}>Prevalence Breakdown</h3>
          <div style={styles.distList}>
            {conditionStats.slice(0, 5).map((item, i) => (
              <div key={item.name} style={styles.distItem}>
                <div style={styles.distMeta}>
                  <span style={styles.distLabel}>{item.name}</span>
                  <span style={styles.distValue}>{item.count} detections</span>
                </div>
                <div style={styles.progressBarBg}>
                  <div 
                    style={{
                      ...styles.progressBarFill, 
                      width: `${totalConditionInstances > 0 ? (item.count / totalConditionInstances) * 100 : 0}%`, 
                      backgroundColor: i % 2 === 0 ? COLORS.primary : COLORS.secondary
                    }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table - Added horizontal scroll for mobile only */}
      <div style={styles.breakdownCard}>
        <h3 style={{...styles.sectionTitle, marginBottom: '20px'}}>Monthly Diagnostic Ledger</h3>
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.trHead}>
                <th style={styles.th}>Reporting Month</th>
                <th style={styles.th}>AI Scans</th>
                <th style={styles.th}>New Onboarding</th>
                <th style={styles.th}>Activity Share</th>
              </tr>
            </thead>
            <tbody>
              {yearlyData.map((row, idx) => (
                <tr key={idx} style={styles.trBody}>
                  <td style={styles.tdMonth}>{row.name}</td>
                  <td style={styles.td}>{row.scans.toLocaleString()}</td>
                  <td style={styles.td}>{row.users.toLocaleString()}</td>
                  <td style={styles.td}>
                    <div style={styles.growthBadge}>
                      <ArrowUpRight size={14} /> 
                      {totals.scans > 0 ? ((row.scans / totals.scans) * 100).toFixed(1) : 0}%
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, trend, color, iconBg }: any) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statCardTop}>
        <div style={{ ...styles.iconBox, backgroundColor: iconBg, color: color }}>{icon}</div>
        <div style={{ ...styles.trendText, color: COLORS.success }}>
          <TrendingUp size={14} /> {trend}
        </div>
      </div>
      <div style={styles.statCardBody}>
        <div style={styles.statValue}>{value.toLocaleString()}</div>
        <div style={styles.statLabel}>{label}</div>
      </div>
      <div style={styles.liveIndicator} className="no-print">
        <span style={styles.liveDot}></span> Active
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  container: { padding: "40px", backgroundColor: "white", minHeight: "100vh", fontFamily: "system-ui, -apple-system, sans-serif" },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' },
  title: { fontSize: '28px', fontWeight: 800, color: COLORS.textMain, margin: 0 },
  subtitle: { fontSize: '14px', color: COLORS.textMuted, marginTop: '4px' },
  headerActions: { display: 'flex', gap: '12px' },
  yearDropdown: { display: 'flex', alignItems: 'center', gap: '8px', background: '#FFF', padding: '10px 16px', borderRadius: '12px', border: `1px solid ${COLORS.border}`, fontSize: '14px', fontWeight: 600, color: COLORS.textMain },
  pdfBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '12px', border: 'none', backgroundColor: COLORS.primary, color: '#FFF', cursor: 'pointer', fontWeight: 600 },
  
  statCard: { background: '#FFF', padding: '24px', borderRadius: '24px', border: `1px solid ${COLORS.border}`, position: 'relative' },
  statCardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' },
  iconBox: { padding: '12px', borderRadius: '14px' },
  trendText: { fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' },
  statValue: { fontSize: '32px', fontWeight: 800, color: COLORS.textMain },
  statLabel: { fontSize: '13px', color: COLORS.textMuted, fontWeight: 500, marginTop: '4px' },
  liveIndicator: { position: 'absolute', bottom: '24px', right: '24px', fontSize: '12px', color: COLORS.primary, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' },
  liveDot: { width: '6px', height: '6px', backgroundColor: COLORS.primary, borderRadius: '50%' },

  chartCard: { background: '#FFF', padding: '32px', borderRadius: '32px', border: `1px solid ${COLORS.border}` },
  chartHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  sectionTitle: { fontSize: '18px', fontWeight: 700, color: COLORS.textMain, margin: 0 },
  toggleGroup: { display: 'flex', background: '#F1F5F9', padding: '4px', borderRadius: '10px' },
  toggleBtnActive: { cursor: 'pointer', padding: '6px 16px', border: 'none', borderRadius: '8px', background: '#FFF', color: COLORS.primary, fontSize: '12px', fontWeight: 700, boxShadow: '0 2px 4px rgba(0,0,0,0.05)', transition: '0.2s' },
  toggleBtnInactive: { cursor: 'pointer', padding: '6px 16px', border: 'none', background: 'transparent', color: COLORS.textMuted, fontSize: '12px', fontWeight: 600, transition: '0.2s' },
  
  distributionCard: { background: '#FFF', padding: '32px', borderRadius: '32px', border: `1px solid ${COLORS.border}` },
  distList: { display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '24px' },
  distItem: { display: 'flex', flexDirection: 'column', gap: '8px' },
  distMeta: { display: 'flex', justifyContent: 'space-between', fontSize: '13px' },
  distLabel: { fontWeight: 700, color: COLORS.textMain },
  distValue: { color: COLORS.textMuted, fontWeight: 500 },
  progressBarBg: { height: '8px', width: '100%', background: '#F1F5F9', borderRadius: '10px' },
  progressBarFill: { height: '100%', borderRadius: '10px', transition: 'width 1s ease-in-out' },

  breakdownCard: { background: '#FFF', padding: '32px', borderRadius: '32px', border: `1px solid ${COLORS.border}` },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: '600px' },
  trHead: { borderBottom: `1px solid ${COLORS.border}` },
  th: { textAlign: 'left', padding: '12px 16px', fontSize: '11px', color: COLORS.textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' },
  trBody: { borderBottom: `1px solid ${COLORS.bg}`, transition: '0.2s' },
  tdMonth: { padding: '16px', fontWeight: 700, color: COLORS.textMain, fontSize: '14px' },
  td: { padding: '16px', color: COLORS.textMuted, fontSize: '14px', fontWeight: 500 },
  growthBadge: { display: 'inline-flex', alignItems: 'center', gap: '4px', background: `#F1F5F9`, color: COLORS.primary, padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 },
  
  tooltip: { borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '8px' },
  loading: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: COLORS.bg }
};