import { useState, useRef, useEffect } from "react";
import { Trash2, Tag, MoreVertical, Edit2, Calendar, ShieldCheck } from "lucide-react";
import type { LifestyleTip } from "../types/Lifestyle";
import type { CSSProperties } from "react";

interface Props {
  tip: LifestyleTip;
  onDelete: (id: string) => void;
  onEdit: (tip: LifestyleTip) => void;
}

export default function LifestyleCard({ tip, onDelete, onEdit }: Props) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const formatCategory = (cat: string) => 
    cat.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  const getCategoryStyles = (category: string) => {
    const cat = category.toLowerCase();
    switch (cat) {
      case "diet": return { bg: "#F0FDF4", text: "#15803D", border: "#DCFCE7" };
      case "hydration": return { bg: "#F0F9FF", text: "#0369A1", border: "#E0F2FE" };
      case "sleep": return { bg: "#F5F3FF", text: "#6D28D9", border: "#EDE9FE" };
      case "sun_protection": return { bg: "#FFFBEB", text: "#B45309", border: "#FEF3C7" };
      case "hygiene": return { bg: "#FDF2F8", text: "#BE185D", border: "#FCE7F3" };
      case "skincare_habits": return { bg: "#ECFEFF", text: "#0E7490", border: "#CFFAFE" };
      case "stress_management": return { bg: "#FFF7ED", text: "#C2410C", border: "#FFEDD5" };
      case "exercise": return { bg: "#F0FDFA", text: "#0F766E", border: "#CCFBF1" };
      default: return { bg: "#F8FAFC", text: "#475569", border: "#E2E8F0" };
    }
  };

  const catStyle = getCategoryStyles(tip.category);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setShowMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formattedDate = new Date(tip.created_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  return (
    <div style={styles.card} className="lifestyle-card">
      <style>{`
        .lifestyle-card { transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1); }
        .lifestyle-card:hover { 
          transform: translateY(-6px); 
          border-color: #00A3AD !important; 
          box-shadow: 0 20px 25px -5px rgba(0, 163, 173, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important; 
        }
        .dropdown-item { transition: all 0.2s; border-radius: 8px; margin: 2px 0; }
        .dropdown-item:hover { background-color: #F8FAFC !important; color: #00A3AD !important; }
        .action-dot:hover { background-color: #F1F5F9 !important; color: #0F172A !important; }
      `}</style>

      <div style={styles.header}>
        <div style={{
          ...styles.categoryBadge,
          backgroundColor: catStyle.bg,
          color: catStyle.text,
          borderColor: catStyle.border
        }}>
          <Tag size={10} strokeWidth={3} /> {formatCategory(tip.category)}
        </div>
        
        <div style={{ position: "relative" }} ref={menuRef}>
          <button 
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }} 
            style={styles.actionBtn}
            className="action-dot"
          >
            <MoreVertical size={18} />
          </button>

          {showMenu && (
            <div style={styles.dropdown}>
              <button 
                className="dropdown-item"
                style={styles.dropdownItem} 
                onClick={(e) => { e.stopPropagation(); onEdit(tip); setShowMenu(false); }}
              >
                <Edit2 size={13} strokeWidth={2.5} /> Update Entry
              </button>
              
              <div style={{ height: '1px', background: '#F1F5F9', margin: '4px 6px' }} />
              
              <button 
                className="dropdown-item"
                style={{ ...styles.dropdownItem, color: "#EF4444" }} 
                onClick={(e) => { e.stopPropagation(); onDelete(tip.id); setShowMenu(false); }}
              >
                <Trash2 size={13} strokeWidth={2.5} /> Remove Protocol
              </button>
            </div>
          )}
        </div>
      </div>

      <div style={styles.body}>
        <h3 style={styles.title}>{tip.title}</h3>
        <p style={styles.desc}>{tip.description}</p>
      </div>
      
      <div style={styles.footer}>
        <div style={styles.footerItem}>
          <div style={styles.dotIndicator} />
          <span style={{ color: "#00A3AD", fontWeight: 700 }}>Clinical Insight</span>
        </div>
        <div style={styles.footerItem}>
          <Calendar size={12} color="#94A3B8" />
          <span>{formattedDate}</span>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  card: { 
    background: "#ffffff", 
    padding: "28px", 
    borderRadius: "20px", 
    border: "1px solid #E2E8F0", 
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)", 
    display: "flex", 
    flexDirection: "column", 
    gap: "22px",
    position: "relative",
    height: "100%",
    minHeight: "260px"
  },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  categoryBadge: { 
    padding: "6px 12px", 
    borderRadius: "10px", 
    fontSize: "10px", 
    fontWeight: 800, 
    display: "flex", 
    alignItems: "center", 
    gap: "6px", 
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    border: "1px solid"
  },
  actionBtn: { 
    background: "none", 
    border: "none", 
    cursor: "pointer", 
    padding: "8px", 
    borderRadius: "10px",
    display: "flex",
    color: "#94A3B8",
    transition: "all 0.2s"
  },
  body: { display: "flex", flexDirection: "column", gap: "10px" },
  dropdown: { 
    position: "absolute", 
    top: "100%", 
    right: 0, 
    background: "#fff", 
    border: "1px solid #E2E8F0", 
    borderRadius: "14px", 
    boxShadow: "0 15px 30px -5px rgba(0,0,0,0.1)", 
    zIndex: 100,
    minWidth: "170px", 
    padding: "8px",
    marginTop: "10px"
  },
  dropdownItem: { 
    width: "100%", 
    padding: "12px", 
    background: "none", 
    border: "none", 
    cursor: "pointer", 
    display: "flex", 
    alignItems: "center", 
    gap: "10px", 
    fontSize: "13px", 
    fontWeight: 600, 
    color: "#475569", 
    textAlign: "left"
  },
  title: { margin: 0, fontSize: "19px", fontWeight: 800, color: "#0F172A", lineHeight: 1.4, letterSpacing: "-0.01em" },
  desc: { 
    fontSize: "14px", 
    color: "#64748B", 
    lineHeight: "1.7", 
    margin: 0,
    overflow: "hidden",
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    fontWeight: 500
  },
  footer: { 
    display: "flex", 
    justifyContent: "space-between",
    alignItems: "center", 
    marginTop: "auto", 
    paddingTop: "20px", 
    borderTop: "1px solid #F8FAFC" 
  },
  footerItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "11px",
    color: "#94A3B8",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.02em"
  },
  dotIndicator: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    backgroundColor: "#00A3AD",
    boxShadow: "0 0 8px rgba(0, 163, 173, 0.4)"
  }
};