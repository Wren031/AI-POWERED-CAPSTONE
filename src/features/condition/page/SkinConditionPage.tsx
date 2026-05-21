import { useState, useMemo } from "react";
import { Plus, Search, Activity, Inbox } from "lucide-react";
import type { CSSProperties } from "react";

// Components
import TitleSize from "../../../styles/TitleSize";
import ConditionCard from "../components/ConditionCard";
import AddConditionDrawer from "../components/AddConditionDrawer";

// Hooks
import useCondition from "../hooks/useCondition";

const SkeletonCard = () => (
  <div style={pageStyles.skeleton} className="shimmer" />
);

export default function SkinConditionPage() {
  const { 
    conditions = [], 
    showAdd, 
    setShowAdd, 
    addCondition, 
    updateCondition, 
    deleteCondition, 
    loading,
    isSaving 
  } = useCondition();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCondition, setSelectedCondition] = useState<any | null>(null);

  // --- Logic ---

  const filteredConditions = useMemo(() => {
    return (conditions || []).filter((c) => 
      c.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [conditions, searchTerm]);

  const handleAddNew = () => {
    setSelectedCondition(null);
    setShowAdd(true);
  };

  const handleEdit = (condition: any) => {
    setSelectedCondition(condition);
    setShowAdd(true);
  };

  const handleFormSubmit = async (formData: { name: string; description: string }) => {
    try {
      let success = false;
      if (selectedCondition) {
        success = await updateCondition(selectedCondition.id, formData);
      } else {
        success = await addCondition(formData);
      }

      if (success) {
        setShowAdd(false);
        setSelectedCondition(null);
      }
    } catch (error) {
      console.error("Critical submission error:", error);
    }
  };

  if (loading && conditions.length === 0) {
    return (
      <div style={pageStyles.center}>
        <Activity className="animate-spin" color="#00A3AD" size={40} />
        <style>{`
          .animate-spin { animation: spin 1s linear infinite; }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <div style={pageStyles.container}>
      <style>{`
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .shimmer { background: linear-gradient(90deg, #F8FAFC 25%, #E2E8F0 50%, #F8FAFC 75%); background-size: 200% 100%; animation: shimmer 2s infinite linear; }
        
        .grid-layout { 
          display: grid; 
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); 
          gap: 32px; 
        }

        .search-container-focus:focus-within { 
          border-color: #00A3AD !important; 
          box-shadow: 0 0 0 4px rgba(0, 163, 173, 0.1); 
        }

        .add-btn:hover { 
          background-color: #008C95 !important;
          transform: translateY(-2px);
          box-shadow: 0 12px 20px -5px rgba(0, 163, 173, 0.3) !important;
        }

        .add-btn:active { transform: scale(0.98); }
        
        @media (max-width: 768px) {
          .header-flex { flex-direction: column; align-items: flex-start !important; gap: 24px; }
          .add-btn { width: 100%; justify-content: center; }
        }
      `}</style>

      <div className="header-flex" style={pageStyles.header}>
        <TitleSize 
          title="Clinical Engine" 
          subtitle="Define and train skin diagnostic profiles for the DermaAI ecosystem" 
        />
        <button className="add-btn" style={pageStyles.addButton} onClick={handleAddNew}>
          <Plus size={18} strokeWidth={3} /> Add New Profile
        </button>
      </div>

      <div className="search-container-focus" style={pageStyles.searchBox}>
        <Search size={18} color="#94A3B8" />
        <input 
          style={pageStyles.searchInput} 
          placeholder="Search clinical database..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
      </div>

      <div className="grid-layout">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
        ) : filteredConditions.length > 0 ? (
          filteredConditions.map((condition) => (
            <ConditionCard
              key={condition.id}
              condition={condition}
              onEdit={() => handleEdit(condition)}
              onDelete={() => deleteCondition(condition.id)}
            />
          ))
        ) : (
          <div style={pageStyles.emptyState}>
            <div style={pageStyles.emptyIconBox}>
                <Inbox size={40} color="#00A3AD" />
            </div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: '18px', color: '#0F172A' }}>No Profiles Found</p>
            <p style={{ margin: '8px 0 0', fontSize: '14px', color: '#64748B', maxWidth: '300px' }}>
              Your search for "{searchTerm}" did not match any clinical records in our database.
            </p>
          </div>
        )}
      </div>

      <AddConditionDrawer
        isOpen={showAdd}
        initialData={selectedCondition}
        isSaving={isSaving}
        onCancel={() => {
          setShowAdd(false);
          setSelectedCondition(null);
        }}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}

const pageStyles: Record<string, CSSProperties> = {
  container: { 
    padding: '40px 60px', 
    minHeight: '100vh',
    backgroundImage: `radial-gradient(#E2E8F0 1px, transparent 1px)`,
    backgroundSize: '40px 40px'
  },
  center: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' },
  addButton: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '10px', 
    padding: '16px 32px', 
    backgroundColor: '#00A3AD', 
    color: '#fff', 
    border: 'none', 
    borderRadius: '16px', 
    fontWeight: 700, 
    fontSize: '14px',
    cursor: 'pointer', 
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 10px 20px -5px rgba(0, 163, 173, 0.25)' 
  },
  searchBox: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '14px', 
    padding: '0 24px', 
    backgroundColor: '#fff', 
    border: '1px solid #E2E8F0', 
    borderRadius: '18px', 
    width: '100%', 
    maxWidth: '480px', 
    marginBottom: '48px', 
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
  },
  searchInput: { border: 'none', padding: '18px 0', outline: 'none', width: '100%', fontSize: '15px', color: '#0F172A', fontWeight: 600 },
  skeleton: { height: '240px', borderRadius: '24px', backgroundColor: '#fff', border: '1px solid #E2E8F0' },
  emptyState: { 
    gridColumn: '1 / -1', 
    padding: '100px 40px', 
    textAlign: 'center', 
    backgroundColor: '#fff', 
    borderRadius: '32px', 
    border: '1px solid #E2E8F0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
  },
  emptyIconBox: {
    width: '80px',
    height: '80px',
    borderRadius: '24px',
    backgroundColor: '#F0F9FA',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '24px'
  }
};