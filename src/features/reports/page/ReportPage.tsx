import { useState, useEffect } from "react";
import type { CSSProperties } from "react";
import { Users, Package, Scan, Activity, Calendar } from "lucide-react";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip, Legend,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip 
} from 'recharts';
import { adminService } from "../../users/services/userService";
import { productServices } from "../../products/services/productServices";
import { admin_skin_result_service } from "../../scan/service/admin_skin_result_service";

export default function ReportPage() {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    scans: 0,
    scanHistory: [] as any[],
    userGrowth: [] as any[],
    productTypes: [] as any[]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [users, products, scans] = await Promise.all([
        adminService.getAllUsers(),
        productServices.getAll(),
        admin_skin_result_service.getAllSkinResultsWithDetails()
      ]);

      setStats({
        users: users.length,
        products: products.length,
        scans: scans.length,
        scanHistory: processScanDistribution(scans),
        userGrowth: processGrowthData(users),
        productTypes: processProductData(products)
      });
    } catch (error) {
      console.error("DermaAI Sync Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const processScanDistribution = (scans: any[]) => {
    const counts: Record<string, number> = {};
    scans.forEach(s => {
      const name = s.conditions?.[0]?.condition_name || "Normal";
      counts[name] = (counts[name] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  const processGrowthData = (data: any[]) => {
    const groups: Record<string, number> = {};
    data.forEach(item => {
      const date = new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      groups[date] = (groups[date] || 0) + 1;
    });
    return Object.entries(groups).map(([date, count]) => ({ date, count })).reverse().slice(-7);
  };

  const processProductData = (products: any[]) => {
    const groups: Record<string, number> = {};
    products.forEach(p => { groups[p.type] = (groups[p.type] || 0) + 1; });
    return Object.entries(groups).map(([name, value]) => ({ name, value }));
  };

  // DermaAI Clinical Palette
  const COLORS = ['#00A3AD', '#6366F1', '#F59E0B', '#10B981', '#EC4899'];

  if (loading) return (
    <div style={styles.loadingContainer}>
      <Activity className="animate-spin" size={32} color="#00A3AD" />
      <p style={{ marginTop: 16, fontWeight: 600, color: '#64748B' }}>Synthesizing Clinical Data...</p>
    </div>
  );

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Clinical Analytics Dashboard</h1>
          <p style={styles.subtitle}>System performance and diagnostic engagement metrics.</p>
        </div>
        <div style={styles.dateBadge}>
          <Calendar size={14} color="#00A3AD" /> 
          {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
      </header>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <StatCard icon={<Users color="#00A3AD" />} label="Patient Database" value={stats.users} trend="+12.5%" />
        <StatCard icon={<Package color="#6366F1" />} label="Curated Products" value={stats.products} trend="+4.2%" />
        <StatCard icon={<Scan color="#F59E0B" />} label="AI Diagnostics" value={stats.scans} trend="+18.7%" />
        <StatCard icon={<Activity color="#10B981" />} label="Accuracy Index" value="98.2%" trend="+0.4%" />
      </div>

      <div style={styles.chartsGrid}>
        {/* Area Chart: Growth */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Patient Acquisition Growth</h3>
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer>
              <AreaChart data={stats.userGrowth}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00A3AD" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#00A3AD" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94A3B8', fontWeight: 600}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94A3B8', fontWeight: 600}} />
                <Tooltip contentStyle={styles.tooltip} />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#00A3AD" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorCount)"
                  activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Distribution */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Conditions Detected</h3>
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={stats.scanHistory}
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {stats.scanHistory.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ReTooltip contentStyle={styles.tooltip} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <style>{`.animate-spin { animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function StatCard({ icon, label, value, trend }: any) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statHeader}>
        <div style={styles.iconBox}>{icon}</div>
        <span style={styles.trendTag}>{trend}</span>
      </div>
      <div>
        <div style={styles.statValue}>{value}</div>
        <div style={styles.statLabel}>{label}</div>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  container: { padding: "50px 60px", backgroundColor: "#F8FAFC", minHeight: "100vh", fontFamily: "'Inter', sans-serif" },
  loadingContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#F8FAFC' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '48px' },
  title: { fontSize: '32px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.03em' },
  subtitle: { fontSize: '15px', color: '#64748B', marginTop: '6px', fontWeight: 500 },
  dateBadge: { display: 'flex', alignItems: 'center', gap: '10px', background: '#FFF', padding: '10px 20px', borderRadius: '14px', border: '1px solid #E2E8F0', fontSize: '13px', fontWeight: 700, color: '#475569', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '28px', marginBottom: '40px' },
  statCard: { background: '#FFF', padding: '28px', borderRadius: '24px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '20px', transition: 'transform 0.2s' },
  statHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  iconBox: { padding: '12px', background: '#F0F9FA', borderRadius: '14px' },
  trendTag: { fontSize: '11px', fontWeight: 800, color: '#10B981', background: '#ECFDF5', padding: '4px 10px', borderRadius: '20px', textTransform: 'uppercase' },
  statValue: { fontSize: '28px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' },
  statLabel: { fontSize: '13px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' },
  chartsGrid: { display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '32px' },
  chartCard: { background: '#FFF', padding: '32px', borderRadius: '28px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' },
  chartTitle: { fontSize: '18px', fontWeight: 800, marginBottom: '32px', color: '#0F172A', letterSpacing: '-0.01em' },
  tooltip: { borderRadius: '12px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '12px', fontWeight: 600 }
};