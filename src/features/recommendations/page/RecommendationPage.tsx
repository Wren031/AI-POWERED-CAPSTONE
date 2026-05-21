import { useState, useEffect, useMemo } from "react";
import type { CSSProperties } from "react";
import { FaPlus, FaSearch, FaChevronDown, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Activity, Filter } from "lucide-react"; 

import TitleSize from "../../../styles/TitleSize";
import RecommendationTable from "../components/RecommendationCardList";
import ConfirmModal from "../../../components/ConfirmModal";
import type { Recommendation } from "../types/Recommendation";

import AddRecommendations from "../components/AddRecommendations"; 
import useRecommendations from "../hooks/useRecommendations";
import ViewRecommendationDrawer from "../components/ViewRecommendationDrawer";

// DermaAI Core Brand Identity
const theme = {
  accent: "#00A3AD",      // Teal from 'Recommendation' text
  primary: "#0F172A",     // Dark navy from hero text
  textMuted: "#64748B",   // Slate for subtexts
  border: "#E2E8F0",      // Light border
  bgSubtle: "#F8FAFC",    // Lightest blue-grey
  white: "#FFFFFF"
};

export default function RecommendationPage() {
  const { 
    data = [], 
    handleDelete, 
    handleEdit, 
    handleUpdate, 
    selected, 
    setSelected, 
    handleAdd,
    isDeleting,
    isSaving 
  } = useRecommendations();

  const [search, setSearch] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("All Severities");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const [viewData, setViewData] = useState<Recommendation | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((rec) => {
      const matchesSearch = [rec.condition?.name, rec.severity, rec.treatment]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesFilter = filterSeverity === "All Severities" || rec.severity === filterSeverity;
      return matchesSearch && matchesFilter;
    });
  }, [data, search, filterSeverity]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterSeverity]);

  const handleViewAction = (rec: Recommendation) => {
    setViewData(rec);
    setIsViewOpen(true);
  };

  const handleEditAction = (rec: Recommendation) => {
    handleEdit(rec); 
    setShowAdd(true); 
  };

  if (loading) return (
    <div style={styles.center}>
        <Activity className="animate-spin" color={theme.accent} size={40} />
        <style>{`
            .animate-spin { animation: spin 1s linear infinite; }
            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
    </div>
  );

  return (
    <div style={styles.container}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        
        /* Interactive States matching DermaAI */
        .filter-option:hover { background-color: #f0fdfa !important; color: ${theme.accent} !important; }
        
        .page-node { transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .page-node:hover:not(.active) { background-color: ${theme.bgSubtle}; transform: translateY(-1px); }
        .active-page { box-shadow: 0 10px 15px -3px rgba(0, 163, 173, 0.3); }
        
        .search-wrapper:focus-within { border-color: ${theme.accent} !important; box-shadow: 0 0 0 1px ${theme.accent}; }

        @media (max-width: 768px) {
          .responsive-header { flex-direction: column; align-items: flex-start; }
          .add-button { width: 100%; justify-content: center; }
          .responsive-controls { flex-direction: column; align-items: stretch; }
          .search-wrapper { max-width: none !important; }
        }
      `}</style>

      <div className="responsive-header" style={styles.header}>
        <TitleSize
          title="Clinical Protocols"
          subtitle="Management and deployment of AI-driven pharmaceutical recommendations."
        />
        <button className="add-button" style={styles.addButton} onClick={() => { setSelected(null); setShowAdd(true); }}>
          <FaPlus size={12} /> Create New Protocol
        </button>
      </div>

      <div className="responsive-controls" style={styles.controls}>
        <div className="search-wrapper" style={styles.searchWrapper}>
          <FaSearch style={{ color: theme.textMuted, fontSize: "14px" }} />
          <input
            type="text"
            placeholder="Search by condition, treatment, or severity..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div className="filter-container" style={{ position: 'relative' }}>
          <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="dropdown-trigger" style={styles.filterDropdownTrigger}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Filter size={14} color={isFilterOpen ? theme.accent : theme.textMuted} />
                <span style={{ color: filterSeverity === "All Severities" ? theme.textMuted : theme.primary }}>{filterSeverity}</span>
            </div>
            <FaChevronDown size={10} style={{ color: theme.textMuted, transform: isFilterOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
          </button>
          {isFilterOpen && (
            <div style={styles.dropdownMenu}>
              {["All Severities", "Severe", "Moderate", "Mild"].map((option) => (
                <div key={option} className="filter-option" style={styles.dropdownItem} 
                  onClick={() => { setFilterSeverity(option); setIsFilterOpen(false); }}>
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={styles.tableWrapper}>
        <div style={{ overflowX: 'auto' }}>
            <RecommendationTable
              recommendation={paginatedData}
              loading={loading}
              onEdit={handleEditAction}
              onDelete={(id: number) => { setDeleteId(id); setShowDelete(true); }}
              onView={handleViewAction}
            />
        </div>
        
        {totalPages > 1 && (
          <div className="responsive-pagination" style={styles.paginationRow}>
            <span style={styles.pageInfo}>
              Showing <strong>{((currentPage - 1) * itemsPerPage) + 1}</strong>–<strong>{Math.min(currentPage * itemsPerPage, filteredData.length)}</strong> of {filteredData.length} protocols
            </span>
            <div style={styles.paginationControls}>
              <button 
                disabled={currentPage === 1} 
                onClick={() => setCurrentPage(prev => prev - 1)} 
                style={{ ...styles.pageBtn, opacity: currentPage === 1 ? 0.3 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
              >
                <FaChevronLeft size={12} />
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <div key={i + 1} className={`page-node ${currentPage === i + 1 ? 'active active-page' : ''}`}
                  onClick={() => setCurrentPage(i + 1)}
                  style={{ 
                    ...styles.pageNode, 
                    backgroundColor: currentPage === i + 1 ? theme.accent : "transparent", 
                    color: currentPage === i + 1 ? theme.white : theme.textMuted,
                  }}>
                  {i + 1}
                </div>
              ))}

              <button 
                disabled={currentPage === totalPages} 
                onClick={() => setCurrentPage(prev => prev + 1)} 
                style={{ ...styles.pageBtn, opacity: currentPage === totalPages ? 0.3 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
              >
                <FaChevronRight size={12} />
              </button>
            </div>
          </div>
        )}
      </div>

      {showAdd && (
        <AddRecommendations 
          initialData={selected} 
          isSaving={isSaving} 
          onAdd={async (newRec) => { 
            if (selected) {
              await handleUpdate(newRec);
            } else {
              await handleAdd(newRec);
            }
            setShowAdd(false);
          }} 
          onCancel={() => { setShowAdd(false); setSelected(null); }} 
        />
      )}

      <ViewRecommendationDrawer isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} data={viewData} />
      
      {showDelete && (
        <ConfirmModal 
          isOpen={showDelete} 
          title="Archive Clinical Protocol?" 
          message="Are you sure? This action will remove this recommendation logic from the AI diagnostic engine." 
          onConfirm={async () => { 
            if (deleteId) await handleDelete(deleteId); 
            setShowDelete(false); 
          }} 
          onCancel={() => setShowDelete(false)}
          isLoading={isDeleting} 
        />
      )}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  container: { 
    padding: "40px 50px", 
    minHeight: "100vh", 
    backgroundColor: "#transparent",
    // backgroundImage: `radial-gradient(${theme.border} 1px, transparent 1px)`, // Subtle Grid
    backgroundSize: "30px 30px"
  },
  center: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px", gap: "20px" },
  controls: { display: "flex", gap: "16px", marginBottom: "24px", alignItems: "center" },
  addButton: { 
    padding: "14px 28px", 
    backgroundColor: theme.accent, // High visibility teal
    color: "#fff", 
    border: "none", 
    borderRadius: "14px", 
    fontWeight: 750, 
    cursor: "pointer", 
    display: "flex", 
    alignItems: "center", 
    gap: "12px", 
    fontSize: "14px",
    boxShadow: `0 10px 20px -5px rgba(0, 163, 173, 0.4)`
  },
  searchWrapper: { 
    display: "flex", 
    alignItems: "center", 
    gap: "14px", 
    padding: "0 20px", 
    backgroundColor: theme.white, 
    borderRadius: "16px", 
    flex: 1, 
    maxWidth: "480px", 
    height: "52px", 
    border: `1px solid ${theme.border}`,
    transition: "all 0.2s ease"
  },
  searchInput: { border: "none", background: "transparent", outline: "none", width: "100%", fontSize: "14px", color: theme.primary, fontWeight: 600 },
  filterDropdownTrigger: { 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "space-between", 
    gap: "16px", 
    padding: "0 20px", 
    backgroundColor: theme.white, 
    border: `1px solid ${theme.border}`, 
    borderRadius: "16px", 
    height: "52px", 
    minWidth: "200px", 
    cursor: "pointer", 
    fontSize: "14px", 
    fontWeight: 700 
  },
  dropdownMenu: { 
    position: "absolute", 
    top: "60px", 
    right: 0, 
    width: "100%", 
    backgroundColor: theme.white, 
    border: `1px solid ${theme.border}`, 
    borderRadius: "18px", 
    boxShadow: "0 20px 40px -12px rgba(0,0,0,0.1)", 
    zIndex: 100, 
    overflow: "hidden", 
    padding: "8px" 
  },
  dropdownItem: { padding: "12px 16px", fontSize: "14px", fontWeight: 600, color: theme.textMuted, cursor: "pointer", borderRadius: "12px", transition: "0.2s" },
  tableWrapper: { },
  paginationRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 32px", borderTop: `1px solid ${theme.bgSubtle}` },
  pageInfo: { fontSize: "14px", color: theme.textMuted, fontWeight: 600 },
  paginationControls: { display: "flex", alignItems: "center", gap: "8px" },
  pageBtn: { background: theme.white, border: `1px solid ${theme.border}`, borderRadius: "12px", color: theme.textMuted, display: "flex", alignItems: "center", padding: "10px", transition: "0.2s" },
  pageNode: { width: "38px", height: "38px", borderRadius: "12px", fontSize: "14px", fontWeight: 700 }
};