import { Eye, UserCircle, ChevronLeft, ChevronRight } from "lucide-react";
import StatusBadge from "./StatusBadge"; 
import type { CSSProperties } from "react";
import type { User } from "../types/User";

interface UsersTableProps {
  users: User[];
  onView: (user: User) => void;
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalResults: number;
}

const Skeleton = ({ width, height, borderRadius = "8px" }: { width: string; height: string; borderRadius?: string }) => (
  <div className="skeleton-box" style={{ width, height, borderRadius }} />
);

export default function UsersTable({ 
  users, 
  onView, 
  loading, 
  currentPage, 
  totalPages, 
  onPageChange, 
  totalResults 
}: UsersTableProps) {
  
  // DermaAI Signature Theme
  const dermaPrimary = "#00A3AD"; 

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .skeleton-box {
          background: linear-gradient(90deg, #f8fafc 25%, #eefcfd 50%, #f8fafc 75%);
          background-size: 200% 100%;
          animation: shimmer 2s infinite linear;
        }
        .table-row { transition: all 0.2s ease; border-bottom: 1px solid #f1f5f9; }
        .table-row:hover { background-color: #f0fdfa60; }
        
        /* Matching Landing Page Action Buttons */
        .action-btn { 
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
          border: 1px solid #e2e8f0; 
          background: white; 
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 700;
          color: #475569;
        }
        .action-btn:hover { 
          background: ${dermaPrimary}; 
          color: white; 
          border-color: ${dermaPrimary}; 
          box-shadow: 0 4px 12px rgba(0, 163, 173, 0.2);
          transform: translateY(-1px);
        }

        .page-btn {
          padding: 8px 14px;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          color: #64748b;
          transition: all 0.2s;
        }
        .page-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .page-btn:not(:disabled):hover { 
            border-color: ${dermaPrimary}; 
            color: ${dermaPrimary};
            background: #f0fdfa;
        }
      `}</style>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Patient Identification</th>
            <th style={styles.th}>Biological Gender</th>
            <th style={styles.th}>Date of Birth</th>
            <th style={styles.th}>Account Status</th>
            <th style={{ ...styles.th, textAlign: "right" }}>Clinical Profile</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} style={styles.tr}>
                <td style={styles.td}>
                  <div style={styles.userCell}>
                    <Skeleton width="44px" height="44px" borderRadius="14px" />
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <Skeleton width="160px" height="12px" />
                      <Skeleton width="90px" height="10px" />
                    </div>
                  </div>
                </td>
                <td style={styles.td}><Skeleton width="60px" height="12px" /></td>
                <td style={styles.td}><Skeleton width="100px" height="12px" /></td>
                <td style={styles.td}><Skeleton width="80px" height="26px" borderRadius="20px" /></td>
                <td style={{ ...styles.td, textAlign: "right" }}><Skeleton width="100px" height="40px" borderRadius="12px" /></td>
              </tr>
            ))
          ) : users.length === 0 ? (
            <tr>
              <td colSpan={5} style={styles.empty}>
                <div style={styles.emptyContent}>
                  <UserCircle size={48} color="#e2e8f0" strokeWidth={1.5} />
                  <p style={{ fontWeight: 600, color: "#94a3b8" }}>No clinical records found.</p>
                </div>
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id} className="table-row" style={styles.tr}>
                <td style={styles.td}>
                  <div style={styles.userCell}>
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt="" style={styles.avatar} />
                    ) : (
                      <div style={styles.avatarPlaceholder}>
                        {user.first_name?.[0]}{user.last_name?.[0]}
  
                      </div>
                    )}
                    <div>
                      <div style={styles.name}>{user.first_name} {user.last_name}</div>
                      <div style={styles.subText}>PATIENT-ID: {user.id.toString().padStart(5, '0')}</div>
                    </div>
                  </div>
                </td>
                <td style={styles.td}>
                  <span style={styles.genderLabel}>{user.gender}</span>
                </td>
                <td style={styles.td}>
                  <span style={{ color: "#64748b", fontWeight: 500 }}>{user.date_of_birth}</span>
                </td>
                <td style={styles.td}>
                  <StatusBadge status={user.status} />
                </td>
                <td style={{ ...styles.td, textAlign: "right" }}>
                  <button 
                    className="action-btn" 
                    onClick={() => onView(user)}
                  >
                    <Eye size={15} strokeWidth={2.5} /> View File
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {!loading && totalResults > 0 && (
        <div style={styles.paginationFooter}>
          <div style={styles.paginationInfo}>
            Displaying <span style={{ color: "#1e293b", fontWeight: 700 }}>{users.length}</span> of <span style={{ color: "#1e293b", fontWeight: 700 }}>{totalResults}</span> Records
          </div>
          
          <div style={styles.paginationControls}>
            <button 
              className="page-btn"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={18} />
            </button>
            
            <div style={styles.pageIndicator}>
              Page <span style={{ color: dermaPrimary, fontWeight: 800 }}>{currentPage}</span> <span style={{ opacity: 0.5 }}>/</span> {totalPages}
            </div>

            <button 
              className="page-btn"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  container: { width: "100%", backgroundColor: "#fff", overflow: "hidden", borderRadius: "16px", border: "1px solid #f1f5f9" },
  table: { width: "100%", borderCollapse: "separate", borderSpacing: 0, minWidth: "900px" },
  th: { 
    textAlign: "left", 
    padding: "20px 24px", 
    fontSize: "11px", 
    fontWeight: 800,
    color: "#94a3b8", 
    textTransform: "uppercase", 
    letterSpacing: "0.1em",
    borderBottom: "1px solid #f1f5f9",
    backgroundColor: "#fcfcfd"
  },
  td: { padding: "16px 24px", fontSize: "14px", color: "#334155", borderBottom: "1px solid #f1f5f9" },
  tr: { verticalAlign: "middle" },
  userCell: { display: "flex", alignItems: "center", gap: "16px" },
  avatar: { 
      width: "44px", 
      height: "44px", 
      borderRadius: "14px", 
      objectFit: "cover", 
      backgroundColor: "#f8fafc",
      border: "2px solid #fff",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
  },
  avatarPlaceholder: {
    width: "44px", height: "44px", borderRadius: "14px", 
    backgroundColor: "#f0fdfa", color: "#00A3AD",
    display: "flex", alignItems: "center", justifyContent: "center", 
    fontSize: "13px", fontWeight: 800, border: "1px solid #ccfbf1"
  },
  name: { fontWeight: 700, color: "#1e293b", fontSize: "14.5px", marginBottom: "2px" },
  subText: { fontSize: "10px", color: "#cbd5e1", fontWeight: 800, letterSpacing: "0.02em" },
  genderLabel: { textTransform: "capitalize", fontWeight: 600, color: "#64748b" },
  empty: { padding: "100px 0" },
  emptyContent: { display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" },
  
  paginationFooter: {
    padding: "20px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px solid #f1f5f9"
  },
  paginationInfo: { fontSize: "13px", color: "#94a3b8", fontWeight: 500 },
  paginationControls: { display: "flex", alignItems: "center", gap: "16px" },
  pageIndicator: { fontSize: "13px", color: "#334155", fontWeight: 700, display: 'flex', gap: '4px' },
};