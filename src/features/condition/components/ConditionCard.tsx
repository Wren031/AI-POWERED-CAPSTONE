import { useState, useRef, useEffect } from "react";
import { MoreHorizontal, Edit3, Trash2, Calendar } from "lucide-react";
import ConfirmModal from "../../../components/ConfirmModal";

interface ConditionCardProps {
  condition: any;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ConditionCard({ condition, onEdit, onDelete }: ConditionCardProps) {
  const [open, setOpen] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return "No date available";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <>
      <style>{`
        .condition-card {
          position: relative;
          background: #ffffff;
          border: 1px solid #f1f5f9;
          border-radius: 16px;
          padding: 24px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          gap: 16px;
          height: 100%;
        }

        .condition-card:hover {
          border-color: #00a699;
          box-shadow: 0 12px 24px -10px rgba(0, 166, 153, 0.12);
          transform: translateY(-4px);
        }

        .menu-button {
          padding: 8px;
          border-radius: 10px;
          color: #94a3b8;
          transition: all 0.2s;
          background: transparent;
          border: none;
          cursor: pointer;
        }

        .menu-button:hover {
          background: #f1f5f9;
          color: #001529;
        }

        .dropdown-menu {
          position: absolute;
          top: 50px;
          right: 0;
          width: 160px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.1);
          z-index: 50;
          padding: 6px;
          animation: slideIn 0.2s ease-out;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          width: 100%;
          border-radius: 8px;
          font-size: 14px;
          color: #475569;
          transition: 0.2s;
          border: none;
          background: transparent;
          cursor: pointer;
          font-weight: 600;
        }

        .dropdown-item:hover {
          background: #f8fafc;
          color: #00a699;
        }

        .dropdown-item.danger:hover {
          background: #fff1f2;
          color: #e11d48;
        }

        .description-text {
          font-size: 14px;
          color: #64748b;
          line-height: 1.6;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 4.8em; /* Ensures consistent height for grid alignment */
        }
      `}</style>

      <div className="condition-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <span style={{ 
                fontSize: '11px', 
                fontWeight: 800, 
                color: '#00a699', 
                background: '#f0fdfa', 
                padding: '4px 10px', 
                borderRadius: '6px',
                textTransform: 'uppercase'
              }}>
                ID-{String(condition.id).padStart(3, '0')}
              </span>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#001529', margin: 0 }}>
              {condition.name}
            </h3>
          </div>

          <div ref={menuRef} style={{ position: 'relative' }}>
            <button className="menu-button" onClick={() => setOpen(!open)}>
              <MoreHorizontal size={20} />
            </button>

            {open && (
              <div className="dropdown-menu">
                <button className="dropdown-item" onClick={() => { setOpen(false); onEdit(); }}>
                  <Edit3 size={16} /> Edit Details
                </button>
                <div style={{ height: '1px', background: '#f1f5f9', margin: '4px 0' }} />
                <button className="dropdown-item danger" onClick={() => { setOpen(false); setShowDelete(true); }}>
                  <Trash2 size={16} /> Delete Entry
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="description-text">
          {condition.description || "No specific clinical description provided for this protocol entry."}
        </p>

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginTop: 'auto',
          paddingTop: '16px',
          borderTop: '1px solid #f8fafc',
          color: '#94a3b8',
          fontSize: '12px',
          fontWeight: 600
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={14} color="#cbd5e1" />
            <span>Updated {formatDate(condition.updated_at || condition.created_at)}</span>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDelete}
        title="Delete Medical Condition"
        message={`Are you sure you want to delete "${condition.name}"? This will also affect any recommendation protocols linked to this condition.`}
        onCancel={() => setShowDelete(false)}
        onConfirm={() => {
          onDelete();
          setShowDelete(false);
        }}
      />
    </>
  );
}