import { useState, useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import { 
  FaExclamationTriangle, 
  FaStethoscope, 
  FaEllipsisV, 
  FaEye, 
  FaRegEdit, 
  FaRegTrashAlt
} from "react-icons/fa";

/* ── HELPER: SKELETON LOADING ── */
const Skeleton = ({ width, height, borderRadius = "14px" }: any) => (
  <div className="dash-shimmer" style={{ width, height, borderRadius }} />
);

export default function RecommendationCards({ recommendation, onDelete, onView, onEdit, loading }: any) {
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Derma-Professional Palette
  const colors = {
    primary: "#00a699", 
    secondary: "#14b8a6",
    textDark: "#1e293b",
    textBody: "#475569",
    border: "#f1f5f9",
    bgSoft: "#f8fafc",
    pillActive: "#f0fdfa",
    warning: "#f59e0b"
  };

  const formatDuration = (dateString: string) => {
    if (!dateString) return null;
    const target = new Date(dateString);
    if (isNaN(target.getTime())) return { text: dateString, status: 'active' };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: "Protocol Expired", status: "past" };
    const weeks = Math.floor(diffDays / 7);
    const days = diffDays % 7;
    const text = weeks > 0 ? `${weeks}w ${days > 0 ? days + 'd' : ''} left` : `${diffDays}d left`;
    return { text, status: "active" };
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setActiveMenu(null);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (loading) {
    return (
      <div style={uiStyles.grid}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{...uiStyles.card, background: 'white', border: '1px solid #f1f5f9'}}>
            <Skeleton width="40px" height="40px" borderRadius="10px" />
            <div style={{ marginTop: '15px' }}>
               <Skeleton width="60%" height="18px" />
               <div style={{ height: '8px' }} />
               <Skeleton width="30%" height="12px" />
            </div>
            <Skeleton width="100%" height="80px" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        .dash-card-wrapper { 
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
          background-color: white;
          border-radius: 20px;
          border: 1px solid #f1f5f9;
          position: relative;
          overflow: hidden;
        }
        
        .dash-card-wrapper::before {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0; height: 4px;
          background: linear-gradient(90deg, #00a699, #14b8a6);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .dash-card-wrapper:hover { 
          transform: translateY(-6px);
          box-shadow: 0 20px 30px -10px rgba(0, 166, 153, 0.12);
          border-color: #00a69933;
        }

        .dash-card-wrapper:hover::before { opacity: 1; }

        .status-pill {
          font-size: 10px;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 5px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .menu-dot-btn { 
          transition: all 0.2s; 
          background: #f8fafc; border: 1px solid #f1f5f9; 
          color: #94a3b8; cursor: pointer; display: flex; align-items: center; justify-content: center;
          width: 34px; height: 34px; border-radius: 10px;
        }
        .menu-dot-btn:hover { background: #fff; color: #00a699; border-color: #00a699; box-shadow: 0 4px 10px rgba(0,166,153,0.1); }
        
        .dash-drop-item { 
          transition: all 0.2s; 
          cursor: pointer; 
          color: #64748b; 
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 13px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .dash-drop-item:hover { background: #f0fdfa; color: #00a699; }
        
        .dash-shimmer { 
          animation: dashShimmer 1.8s infinite linear; 
          background: #f8fafc;
          background-image: linear-gradient(90deg, #f8fafc 0%, #ffffff 50%, #f8fafc 100%); 
          background-size: 200% 100%; 
        }
        @keyframes dashShimmer { from { background-position: -200% 0; } to { background-position: 200% 0; } }
      `}</style>

      <div style={uiStyles.grid}>
        {(recommendation || []).map((rec: any) => {
          const duration = formatDuration(rec.usage_duration);

          return (
            <div key={rec.id} className="dash-card-wrapper" style={uiStyles.card}>
              <div style={uiStyles.header}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{...uiStyles.iconContainer, background: `linear-gradient(135deg, ${colors.secondary}, ${colors.primary})`}}>
                    <FaStethoscope size={20} color="white" />
                  </div>
                  <div>
                    <h3 style={{...uiStyles.cardHeading, color: colors.textDark}}>{rec.condition?.name || "Standard Care"}</h3>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '6px', alignItems: 'center' }}>
                       <span style={uiStyles.subtext}>ID: #{rec.id.toString().padStart(4, '0')}</span>
                       {duration && (
                         <div className="status-pill" style={{ 
                            background: duration.status === 'past' ? '#fff1f2' : colors.pillActive, 
                            color: duration.status === 'past' ? '#e11d48' : colors.primary,
                            border: `1px solid ${duration.status === 'past' ? '#fee2e2' : '#ccfbf1'}`
                         }}>
                            <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor' }} />
                            {duration.text}
                         </div>
                       )}
                    </div>
                  </div>
                </div>
                
                <div style={{ position: 'relative' }}>
                  <button className="menu-dot-btn" onClick={() => setActiveMenu(activeMenu === rec.id ? null : rec.id)}>
                    <FaEllipsisV size={14} />
                  </button>
                  {activeMenu === rec.id && (
                    <div ref={menuRef} style={uiStyles.dropdown}>
                      <div className="dash-drop-item" onClick={() => onView(rec)}><FaEye size={15} /> Open Record</div>
                      <div className="dash-drop-item" onClick={() => onEdit(rec)}><FaRegEdit size={15} /> Modify Protocol</div>
                      <div style={{ height: '1px', background: '#f1f5f9', margin: '6px 8px' }} />
                      <div className="dash-drop-item" style={{ color: '#ef4444' }} onClick={() => onDelete(rec.id)}><FaRegTrashAlt size={15} /> Archive</div>
                    </div>
                  )}
                </div>
              </div>

              <div style={uiStyles.body}>
                <div style={uiStyles.labelRow}>TREATMENT PLAN</div>
                <p style={{...uiStyles.treatmentContent, color: colors.textBody}}>{rec.treatment}</p>
                
                {rec.precautions && (
                  <div style={{...uiStyles.alertBox, border: `1px solid ${colors.warning}40`}}>
                    <FaExclamationTriangle size={14} style={{ flexShrink: 0, color: colors.warning, marginTop: '2px' }} />
                    <span style={{ fontSize: '12.5px', color: '#854d0e', lineHeight: '1.6', fontWeight: 600 }}>
                        {rec.precautions}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

const uiStyles: Record<string, CSSProperties> = {
  grid: { 
    display: "grid", 
    gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", 
    gap: "28px", 
    padding: "10px 0" 
  },
  card: { 
    padding: "32px", 
    display: "flex", 
    flexDirection: "column", 
    gap: "24px",
  },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  iconContainer: { 
    width: "48px", 
    height: "48px", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    borderRadius: "14px",
    boxShadow: "0 8px 16px -4px rgba(0, 166, 153, 0.3)"
  },
  cardHeading: { 
    margin: 0, 
    fontSize: "17px", 
    fontWeight: 800, 
    letterSpacing: "-0.01em",
  },
  subtext: { fontSize: "11px", color: "#94a3b8", fontWeight: 700, letterSpacing: '0.05em' },
  dropdown: { 
    position: 'absolute', 
    right: 0, 
    top: '44px', 
    zIndex: 100, 
    background: '#fff', 
    border: '1px solid #f1f5f9', 
    borderRadius: '16px', 
    padding: '8px', 
    minWidth: '200px', 
    boxShadow: '0 20px 40px -8px rgba(0, 0, 0, 0.12)' 
  },
  body: { display: "flex", flexDirection: "column", gap: "12px" },
  labelRow: { fontSize: '10px', fontWeight: 800, color: '#cbd5e1', letterSpacing: '0.1em' },
  treatmentContent: { 
    margin: 0, 
    fontSize: "14.5px", 
    lineHeight: "1.75",
    fontWeight: 500
  },
  alertBox: { 
    display: "flex", 
    gap: "12px", 
    padding: "16px", 
    background: "#fffbeb", 
    borderRadius: "14px",
    alignItems: 'flex-start'
  }
};