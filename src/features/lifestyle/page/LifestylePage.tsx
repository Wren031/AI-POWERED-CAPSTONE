import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Plus, Sparkles, Search, Activity } from "lucide-react";
import { useLifestyle } from "../hooks/useLifestyle";
import LifestyleCard from "../components/LifestyleCard";
import AddLifestyleDrawer from "../components/AddLifestyleDrawer";
import type { LifestyleTip } from "../types/Lifestyle";

export default function LifestylePage() {
  // --- 1. Hooks & Data Fetching ---
  const { tips = [], fetchTips, handleDelete, loading: hookLoading } = useLifestyle();
  
  // --- 2. State Hooks ---
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTip, setSelectedTip] = useState<LifestyleTip | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFullyReady, setIsFullyReady] = useState(false);

  // --- 3. Side Effects ---
  useEffect(() => {
    if (!hookLoading) {
      const timer = setTimeout(() => setIsFullyReady(true), 400);
      return () => clearTimeout(timer);
    } else {
      setIsFullyReady(false);
    }
  }, [hookLoading]);

  // --- 4. Memoized Logic ---
  const filteredTips = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return tips.filter((tip) => {
      return !query || 
        tip.title?.toLowerCase().includes(query) || 
        tip.description?.toLowerCase().includes(query);
    });
  }, [tips, searchQuery]);

  // --- 5. Handlers ---
  const handleOpenDrawer = useCallback((tip?: LifestyleTip) => {
    setSelectedTip(tip || null);
    setIsDrawerOpen(true);
  }, []);

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedTip(null);
  };

  const clearFilters = () => {
    setSearchQuery("");
  };

  // --- 6. Content Conditional Rendering ---
  if (!isFullyReady) {
    return (
      <div style={styles.container}>
        <div style={styles.loaderArea}>
          <Activity className="animate-spin" size={32} color="#00A3AD" />
          <p style={styles.loadingText}>Synchronizing Wellness Library...</p>
        </div>
        <style>{`
          .animate-spin { animation: spin 1s linear infinite; }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Decorative background mesh */}
      <div style={styles.meshGradient} aria-hidden="true" />

      {/* Header Section */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Manage Lifestyle Tips  </h1>
          <p style={styles.subtitle}>Curate daily skin health guidance and lifestyle tips for users.</p>
        </div>
        
        <button 
          onClick={() => handleOpenDrawer()} 
          style={styles.addBtn}
          className="brand-interactive-btn"
        >
          <Plus size={18} strokeWidth={3} /> 
          <span>Add LifeStyle Tips</span>
        </button>
      </header>

      {/* Search Bar */}
      <section style={styles.filterBar}>
        <div style={styles.searchWrapper}>
          <Search size={18} color="#94A3B8" style={styles.searchIcon} />
          <input 
            type="text"
            placeholder="Search wellness library..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
            className="search-focus"
          />
        </div>
      </section>

      {/* Grid Content */}
      <main style={styles.main}>
        {filteredTips.length > 0 ? (
          <div style={styles.grid}>
            {filteredTips.map(tip => (
              <LifestyleCard 
                key={tip.id} 
                tip={tip} 
                onDelete={handleDelete} 
                onEdit={() => handleOpenDrawer(tip)} 
              />
            ))}
          </div>
        ) : (
          <EmptyState 
            isFiltered={searchQuery.length > 0} 
            onClear={clearFilters} 
          />
        )}
      </main>

      {/* Drawer */}
      <AddLifestyleDrawer 
        isOpen={isDrawerOpen} 
        onClose={handleCloseDrawer} 
        onSave={fetchTips} 
        editData={selectedTip} 
      />

      <style>{globalStyles}</style>
    </div>
  );
}

// --- Sub-Components ---
const EmptyState = ({ isFiltered, onClear }: { isFiltered: boolean, onClear: () => void }) => (
  <div style={styles.emptyState}>
    <div style={styles.emptyIconWrapper}>
      <Sparkles size={32} color="#00A3AD" strokeWidth={1.5} />
    </div>
    <h3 style={styles.emptyTitle}>
      {isFiltered ? "No matches found" : "Library is Empty"}
    </h3>
    <p style={styles.emptySubtitle}>
      {isFiltered 
        ? "Adjust your search parameters to find the lifestyle entry."
        : "Begin building the DermaAI database by publishing your first clinical wellness tip."}
    </p>
    {isFiltered && (
      <button onClick={onClear} style={styles.emptyBtn}>
        Reset Search
      </button>
    )}
  </div>
);

// --- CSS-in-JS ---
const globalStyles = `
  .brand-interactive-btn:hover { 
    background: #008C95 !important; 
    transform: translateY(-2px); 
    box-shadow: 0 10px 15px -3px rgba(0, 163, 173, 0.3) !important; 
  }
  .brand-interactive-btn:active { transform: translateY(0); }
  
  .search-focus:focus {
    border-color: #00A3AD !important;
    box-shadow: 0 0 0 4px rgba(0, 163, 173, 0.1);
  }
`;

const styles: Record<string, React.CSSProperties> = {
  container: { 
    padding: "60px 60px", 
    margin: "0 auto", 
    minHeight: "100vh", 
    position: "relative", 
    backgroundColor: "#ffffff",
    fontFamily: "'Inter', system-ui, sans-serif" 
  },
  loaderArea: {
    height: "calc(100vh - 120px)",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: { 
    marginTop: "20px", 
    color: "#64748B", 
    fontWeight: 600, 
    fontSize: "15px",
    letterSpacing: "-0.01em"
  },
  meshGradient: { 
    position: "absolute", 
    top: 0, left: 0, right: 0, 
    height: "500px", 
    zIndex: 0 
  },
  header: { 
    position: "relative",
    zIndex: 1,
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "flex-end", 
    marginBottom: "56px" 
  },
  title: { 
    fontSize: "36px", fontWeight: 800, 
    color: "#0F172A", margin: 0, 
    letterSpacing: "-0.03em" 
  },
  subtitle: { color: "#64748B", marginTop: "6px", fontSize: "16px", fontWeight: 500 },
  addBtn: { 
    background: "#00A3AD", color: "#fff", border: "none", 
    padding: "14px 28px", borderRadius: "14px", 
    fontWeight: 700, fontSize: "14px", 
    display: "flex", alignItems: "center", gap: "10px", 
    cursor: "pointer", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 8px 12px -3px rgba(0, 163, 173, 0.2)"
  },
  filterBar: { 
    position: "relative",
    zIndex: 1,
    display: "flex", 
    marginBottom: "40px", 
    alignItems: "center" 
  },
  searchWrapper: { 
    position: "relative", 
    width: "100%",
    maxWidth: "520px" 
  },
  searchIcon: { position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)" },
  searchInput: { 
    width: "100%", padding: "16px 16px 16px 48px", 
    borderRadius: "16px", border: "1px solid #E2E8F0", 
    fontSize: "15px", fontWeight: 500, outline: "none", transition: "all 0.2s",
    background: "#fff"
  },
  main: { position: "relative", zIndex: 1 },
  grid: { 
    display: "grid", 
    gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", 
    gap: "32px" 
  },
  emptyState: { 
    textAlign: "center", padding: "100px 20px", 
    background: "#fff", borderRadius: "32px", 
    border: "1px solid #E2E8F0",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)"
  },
  emptyIconWrapper: { 
    width: "72px", height: "72px", 
    background: "#F0F9FA", borderRadius: "22px", 
    display: "flex", alignItems: "center", justifyContent: "center", 
    margin: "0 auto 24px auto"
  },
  emptyTitle: { fontSize: "20px", fontWeight: 800, color: "#0F172A", letterSpacing: "-0.01em" },
  emptySubtitle: { 
    color: "#64748B", maxWidth: "340px", 
    margin: "10px auto 28px auto", lineHeight: 1.6, fontSize: "14px",
    fontWeight: 500
  },
  emptyBtn: { 
    background: "transparent", color: "#64748B", 
    border: "1px solid #E2E8F0", padding: "10px 20px", 
    borderRadius: "10px", fontWeight: 600, 
    fontSize: "13px", cursor: "pointer", transition: "0.2s"
  }
};