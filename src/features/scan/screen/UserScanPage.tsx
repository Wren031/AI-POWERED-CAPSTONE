import React, { useState, useMemo } from "react";
import { Search, Activity, Printer, Database, AlertCircle, CheckCircle, ChevronDown } from "lucide-react";
import { useAdminSkinHistory } from "../hooks/useScanData";
import ScanDetailsDrawer from "../components/drawerScanDetails";
import { SkinLogsTable } from "../components/SkinLogsTable";

export default function UserScanPage() {
  const { results, loading } = useAdminSkinHistory();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedScan, setSelectedScan] = useState<any>(null);

  const filtered = useMemo(() => {
    return results.filter(s => {
      const matchesSearch = (s.user_name || "").toLowerCase().includes(searchTerm.toLowerCase());
      const score = s.score || 0;
      if (filterType === "high") return matchesSearch && score >= 80;
      if (filterType === "low") return matchesSearch && score < 50;
      return matchesSearch;
    });
  }, [results, searchTerm, filterType]);

  const stats = useMemo(() => {
    if (!results.length) return { total: "0", lowCount: "0", highCount: "0" };
    return {
      total: results.length.toLocaleString(),
      lowCount: results.filter(r => (r.score || 0) < 50).length.toLocaleString(),
      highCount: results.filter(r => (r.score || 0) >= 80).length.toLocaleString()
    };
  }, [results]);

  if (loading) return (
    <div style={styles.center}><Activity className="animate-spin" color="#00A3AD" /></div>
  );

  return (
    <div style={styles.page}>
      <header style={styles.header} className="no-print">
        <div>
          <h1 style={styles.title}>Clinical History</h1>
          <p style={styles.subtitle}>Comprehensive patient diagnostic records managed by DermaAI</p>
        </div>
      </header>

      {/* Stats Cards Section */}
      <div style={styles.statsGrid} className="no-print">
        
        {/* Total Logs Card */}
        <div style={styles.statCard} className="stat-card-animate">
          <div style={styles.cardTop}>
            <div style={{...styles.iconBox, backgroundColor: "#E6F6F7"}}>
              <Database size={20} color="#00A3AD" />
            </div>
            <div style={styles.trendGreen}>+12.5% ↗</div>
          </div>
          <div style={styles.cardContent}>
            <h2 style={styles.cardValue}>{stats.total}</h2>
            <p style={styles.cardLabel}>Total Assessments</p>
          </div>
        </div>

        {/* High Proficiency Card */}
        <div style={styles.statCard} className="stat-card-animate">
          <div style={styles.cardTop}>
            <div style={{...styles.iconBox, backgroundColor: "#F0FDF4"}}>
              <CheckCircle size={20} color="#10B981" />
            </div>
            <div style={styles.trendGreen}>Optimal</div>
          </div>
          <div style={styles.cardContent}>
            <h2 style={styles.cardValue}>{stats.highCount}</h2>
            <p style={styles.cardLabel}>High Health Scores</p>
          </div>
        </div>

        {/* Critical Review Card */}
        <div style={styles.statCard} className="stat-card-animate">
          <div style={styles.cardTop}>
            <div style={{...styles.iconBox, backgroundColor: "#FFF1F2"}}>
              <AlertCircle size={20} color="#E11D48" />
            </div>
            <div style={styles.trendRed}>Attention Required</div>
          </div>
          <div style={styles.cardContent}>
            <h2 style={styles.cardValue}>{stats.lowCount}</h2>
            <p style={styles.cardLabel}>Critical Reports</p>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div style={styles.tableActions} className="no-print">
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <div style={styles.searchBox} className="search-focus">
            <Search size={16} color="#94A3B8" />
            <input
              style={styles.input}
              placeholder="Search patient records..."
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={styles.selectContainer}>
            <select 
              style={styles.customSelect} 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">Global Filters</option>
              <option value="high">High Proficiency</option>
              <option value="low">Clinical Alert</option>
            </select>
            <div style={styles.selectIcon}>
              <ChevronDown size={14} color="#64748B" />
            </div>
          </div>
        </div>

        <button onClick={() => window.print()} style={styles.brandBtn}>
          <Printer size={16} />
          Export Clinical Data
        </button>
      </div>

      <div className="print-area">
        <SkinLogsTable data={filtered} onRowClick={setSelectedScan} rowsPerPage={10} />
      </div>

      <ScanDetailsDrawer
        isOpen={!!selectedScan}
        onClose={() => setSelectedScan(null)}
        scan={selectedScan}
      />

      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-area { width: 100%; }
        }
        
        .stat-card-animate {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        .stat-card-animate:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px -12px rgba(0, 163, 173, 0.12);
          border-color: #00A3AD !important;
        }

        .search-focus:focus-within {
          border-color: #00A3AD !important;
          box-shadow: 0 0 0 3px rgba(0, 163, 173, 0.1);
        }

        select:hover { border-color: #00A3AD !important; }
      `}</style>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { 
    padding: "40px", 
    backgroundColor: "transparent", 
    minHeight: "100vh", 
    fontFamily: "'Inter', sans-serif",
    backgroundImage: `radial-gradient(#E2E8F0 1px, transparent 1px)`,
    backgroundSize: '40px 40px'
  },
  center: { height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px" },
  title: { fontSize: "32px", fontWeight: 800, color: "#0F172A", margin: 0, letterSpacing: "-0.02em" },
  subtitle: { color: "#64748B", fontSize: "14px", margin: "4px 0 0 0", fontWeight: 500 },
  
  statsGrid: { 
    display: "grid", 
    gridTemplateColumns: "repeat(3, 1fr)", 
    gap: "24px", 
    marginBottom: "40px" 
  },
  statCard: {
    backgroundColor: "#fff",
    padding: "20px 24px", // Reduced padding from 28px to tighten things up
    borderRadius: "24px",
    border: "1px solid #E2E8F0",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: "145px", // Adjusted from 180px for a sleeker profile
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)"
  },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  iconBox: {
    width: "42px", // Slightly smaller icon box
    height: "42px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  cardContent: { marginTop: "12px" }, // Fixed margin instead of 'auto' for better control in short cards
  trendGreen: { color: "#10B981", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" },
  trendRed: { color: "#EF4444", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" },
  cardValue: { fontSize: "30px", fontWeight: 800, color: "#0F172A", margin: "0 0 2px 0" }, // Reduced size from 36px
  cardLabel: { fontSize: "12px", color: "#64748B", margin: 0, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.025em" },

  tableActions: { display: "flex", justifyContent: "space-between", marginBottom: "24px", alignItems: "center" },
  searchBox: { 
    display: "flex", alignItems: "center", gap: "12px", backgroundColor: "#fff", 
    padding: "0 16px", borderRadius: "12px", border: "1px solid #E2E8F0", height: "48px",
    transition: "all 0.2s"
  },
  input: { border: "none", outline: "none", width: "260px", fontSize: "14px", color: "#1E293B", fontWeight: 500 },
  selectContainer: { position: "relative", display: "flex", alignItems: "center" },
  customSelect: {
    appearance: "none", backgroundColor: "#fff", border: "1px solid #E2E8F0",
    borderRadius: "12px", padding: "0 40px 0 16px", height: "48px", fontSize: "14px",
    fontWeight: 600, color: "#475569", cursor: "pointer", outline: "none", transition: "all 0.2s"
  },
  selectIcon: { position: "absolute", right: "14px", pointerEvents: "none" },
  brandBtn: { 
    display: "flex", alignItems: "center", gap: "10px", backgroundColor: "#00A3AD", 
    color: "#fff", border: "none", padding: "0 24px", borderRadius: "12px", 
    cursor: "pointer", fontSize: "14px", fontWeight: 700, height: "48px", 
    transition: "all 0.3s", boxShadow: "0 10px 15px -3px rgba(0,163,173,0.2)"
  }
};