import React, { useState } from "react";
import { User, Fingerprint, Activity, ShieldCheck, ChevronLeft, ChevronRight, Eye } from "lucide-react";

interface SkinLogsTableProps {
  data: any[];
  onRowClick: (scan: any) => void;
  rowsPerPage?: number;
}

export const SkinLogsTable = ({ data, onRowClick, rowsPerPage = 7 }: SkinLogsTableProps) => {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(data.length / rowsPerPage));
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);

  const paginate = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div style={styles.container}>
      <div style={{ overflowX: "auto" }}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Reference</th>
              <th style={styles.th}>Patient</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Primary Finding</th>
              <th style={styles.th}>Health Score</th>
              <th style={styles.th}>AI Confidence</th>
              <th style={{ ...styles.th, textAlign: "right" }}>Review</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.length > 0 ? (
              currentRows.map((scan) => {
                const userAvatar = scan.tbl_profiles?.avatar_url;
                const shortId = scan.id ? `${scan.id.toString().slice(0, 8)}` : "N/A";
                const score = scan.score || 0;
                const rawConf = scan.confidence > 1 ? scan.confidence : scan.confidence * 100;
                const displayConf = Math.round(rawConf || 0);

                const primaryFinding = scan.conditions?.[0]?.label || "Normal";
                const isNormal = primaryFinding.toLowerCase().includes("normal");

                return (
                  <tr 
                    key={scan.id} 
                    style={{
                      ...styles.tr,
                      backgroundColor: hoveredRow === scan.id ? "#F0F9FA" : "transparent"
                    }}
                    onMouseEnter={() => setHoveredRow(scan.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    onClick={() => onRowClick(scan)}
                  >
                    <td style={styles.td}>
                      <div style={styles.flexCell}>
                        <Fingerprint size={14} style={{ color: "#00A3AD", opacity: 0.6 }} />
                        <span style={styles.idText}>{shortId}</span>
                      </div>
                    </td>

                    <td style={styles.td}>
                      <div style={styles.flexCell}>
                        <div style={styles.avatar}>
                          {userAvatar ? (
                            <img src={userAvatar} style={styles.avatarImg} alt="" />
                          ) : (
                            <User size={16} color="#00A3AD" />
                          )}
                        </div>
                        <span style={styles.patientName}>{scan.user_name || "Anonymous Patient"}</span>
                      </div>
                    </td>

                    <td style={styles.td}>
                      <span style={styles.dateText}>
                        {new Date(scan.created_at).toLocaleDateString(undefined, { 
                          month: 'short', day: 'numeric', year: 'numeric' 
                        })}
                      </span>
                    </td>

                    <td style={styles.td}>
                      <span style={{
                        ...styles.findingBadge,
                        backgroundColor: isNormal ? "#E6F6F7" : "#FFF7ED",
                        color: isNormal ? "#008C95" : "#C2410C",
                        border: `1px solid ${isNormal ? "#B2E4E7" : "#FFEDD5"}`
                      }}>
                        {primaryFinding}
                      </span>
                    </td>

                    <td style={styles.td}>
                      <div style={styles.flexCell}>
                        <Activity size={14} color={score > 75 ? "#00A3AD" : score > 40 ? "#F59E0B" : "#EF4444"} />
                        <span style={styles.scoreText}>{score}</span>
                        <span style={styles.scoreScale}>/100</span>
                      </div>
                    </td>

                    <td style={styles.td}>
                      <div style={styles.flexCell}>
                        <ShieldCheck size={14} color="#00A3AD" />
                        <span style={styles.confText}>{displayConf}%</span>
                      </div>
                    </td>

                    <td style={{ ...styles.td, textAlign: "right" }}>
                      <div style={styles.actionContainer}>
                        <div style={{
                          ...styles.iconCircle,
                          backgroundColor: hoveredRow === scan.id ? "#00A3AD" : "#F1F5F9",
                          color: hoveredRow === scan.id ? "#fff" : "#64748B",
                          boxShadow: hoveredRow === scan.id ? "0 4px 12px rgba(0,163,173,0.2)" : "none"
                        }}>
                          <Eye size={16} />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} style={{ ...styles.td, textAlign: "center", padding: "80px", color: "#94A3B8" }}>
                  No diagnostic logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={styles.paginationFooter}>
        <p style={styles.paginationInfo}>
          Showing <b>{data.length > 0 ? indexOfFirstRow + 1 : 0}</b>–<b>{Math.min(indexOfLastRow, data.length)}</b> of <b>{data.length}</b> reports
        </p>
        <div style={styles.paginationControls}>
          <button 
            disabled={currentPage === 1}
            onClick={(e) => { e.stopPropagation(); paginate(currentPage - 1); }}
            style={{ ...styles.pageBtn, opacity: currentPage === 1 ? 0.4 : 1, cursor: currentPage === 1 ? "not-allowed" : "pointer" }}
          >
            <ChevronLeft size={18} />
          </button>
          
          <div style={styles.pageIndicator}>
             Page <b>{currentPage}</b> of {totalPages}
          </div>

          <button 
            disabled={currentPage === totalPages}
            onClick={(e) => { e.stopPropagation(); paginate(currentPage + 1); }}
            style={{ ...styles.pageBtn, opacity: currentPage === totalPages ? 0.4 : 1, cursor: currentPage === totalPages ? "not-allowed" : "pointer" }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: { 
    backgroundColor: "#fff", 
    borderRadius: "24px", 
    border: "1px solid #E2E8F0", 
    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.03)", 
    overflow: "hidden" 
  },
  table: { width: "100%", borderCollapse: "separate", borderSpacing: 0 },
  th: { 
    padding: "20px 24px", 
    textAlign: "left", 
    fontSize: "11px", 
    fontWeight: 800, 
    color: "#64748B", 
    backgroundColor: "#F8FAFC", 
    borderBottom: "1px solid #E2E8F0", 
    textTransform: "uppercase", 
    letterSpacing: "0.1em" 
  },
  td: { padding: "18px 24px", borderBottom: "1px solid #F1F5F9", verticalAlign: "middle", fontSize: "14px", color: "#334155" },
  tr: { cursor: "pointer", transition: "background-color 0.2s ease" },
  flexCell: { display: "flex", alignItems: "center", gap: "12px" },
  idText: { fontFamily: "monospace", fontSize: "12px", color: "#64748B", fontWeight: 600 },
  patientName: { fontWeight: 700, color: "#0F172A" },
  dateText: { color: "#64748B", fontWeight: 500 },
  findingBadge: { fontSize: "11px", fontWeight: 800, padding: "4px 12px", borderRadius: "20px", display: "inline-block" },
  scoreText: { fontSize: "15px", fontWeight: 800, color: "#0F172A" },
  scoreScale: { fontSize: "11px", color: "#94A3B8", marginLeft: "2px" },
  confText: { fontSize: "14px", fontWeight: 700, color: "#334155" },
  avatar: { width: "36px", height: "36px", borderRadius: "12px", backgroundColor: "#F0F9FA", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #B2E4E7" },
  avatarImg: { width: "100%", height: "100%", objectFit: "cover" },
  actionContainer: { display: "flex", justifyContent: "flex-end" },
  iconCircle: { width: "40px", height: "40px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" },
  paginationFooter: { padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fff" },
  paginationInfo: { fontSize: "13px", color: "#64748B", margin: 0 },
  paginationControls: { display: "flex", alignItems: "center", gap: "16px" },
  pageIndicator: { fontSize: "13px", color: "#334155", minWidth: "90px", textAlign: "center" },
  pageBtn: { border: "1px solid #E2E8F0", backgroundColor: "#fff", borderRadius: "12px", width: "38px", height: "38px", display: "flex", alignItems: "center", justifyContent: "center", color: "#00A3AD", transition: "0.2s" }
};