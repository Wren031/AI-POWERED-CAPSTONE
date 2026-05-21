import React from "react";
import { 
  X, Stethoscope, ShieldAlert, Activity, Package, 
  ClipboardList, Sparkles, Clock, ChevronRight, Info
} from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: any | null; 
}

export default function ViewRecommendationDrawer({ isOpen, onClose, data }: Props) {
  if (!data) return null;

  const colors = {
    primary: "#00A3AD", // Matched to ScanDetailsDrawer Cyan
    textDark: "#0f172a",
    textBody: "#475569",
    danger: "#e11d48",
    bgSoft: "#f8fafc"
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const uniqueProducts = data.products || [];
  const uniqueTips = data.lifestyleTips || [];

  const drawerStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    right: isOpen ? 0 : "-650px",
    width: "full",
    maxWidth: "600px",
    height: "100vh",
    background: "#fff",
    borderLeft: "1px solid #e2e8f0",
    transition: "right 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
    zIndex: 1001,
    display: "flex",
    flexDirection: "column",
  };

  const overlayStyle: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.4)",
    backdropFilter: "blur(2px)",
    opacity: isOpen ? 1 : 0,
    pointerEvents: isOpen ? "auto" : "none",
    transition: "opacity 0.4s ease",
    zIndex: 1000,
  };

  return (
    <>
      <div style={overlayStyle} onClick={onClose} />
      
      <div style={drawerStyle}>
        {/* Header */}
        <header style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.badge}>
              <Stethoscope size={22} color="white" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={styles.title}>{data.condition?.name || "Clinical Protocol"}</h2>
                <span style={styles.clinicalTag}>Clinical v2</span>
              </div>
              <div style={styles.metaRow}>
                <p style={styles.idLabel}>
                  PROTOCOL ID: <span style={{ color: colors.primary }}>{data.id.toString().slice(0, 8).toUpperCase()}</span>
                </p>
              </div>
            </div>
          </div>
          <button onClick={onClose} style={styles.closeBtn}><X size={20} /></button>
        </header>

        {/* Content */}
        <div style={styles.content}>
          {/* Top Status */}
          <div style={styles.statsRow}>
            <div style={{...styles.statBox, borderLeft: `4px solid ${data.severity === 'Severe' ? colors.danger : colors.primary}`}}>
              <span style={styles.statLabel}>PROTOCOL STATUS</span>
              <span style={{...styles.statValue, color: data.severity === 'Severe' ? colors.danger : colors.textDark}}>
                {data.severity || 'Standard Care'}
              </span>
            </div>
            <div style={styles.statBox}>
              <span style={styles.statLabel}>ISSUED DATE</span>
              <span style={styles.statValue}>{formatDate(data.createdAt)}</span>
            </div>
          </div>

          {/* Treatment Plan */}
          <section style={styles.section}>
            <div style={styles.secHead}>
              <ClipboardList size={14} /> <span>Primary Protocol Strategy</span>
            </div>
            <div style={styles.protocolCard}>
              <p style={styles.bodyText}>{data.treatment}</p>
            </div>
          </section>

          {/* Safety Precautions */}
          <section style={styles.section}>
            <div style={styles.secHead}>
              <ShieldAlert size={14} color={colors.danger} /> <span style={{color: colors.danger}}>Safety & Contraindications</span>
            </div>
            <div style={styles.precautionCard}>
              <div style={{display: 'flex', gap: '12px'}}>
                <Info size={16} style={{marginTop: 2}} />
                <span style={{flex: 1}}>{data.precautions || "No standard contraindications specified."}</span>
              </div>
            </div>
          </section>

          {/* Lifestyle Tips */}
          <section style={styles.section}>
            <div style={styles.secHead}>
              <Activity size={14} /> <span>Lifestyle Modifications</span>
            </div>
            <div style={styles.tipsGrid}>
              {uniqueTips.length > 0 ? (
                uniqueTips.map((tip: any) => (
                  <div key={tip.id} style={styles.tipItem}>
                    <div style={styles.tipIcon}><Sparkles size={14} color={colors.primary} /></div>
                    <div style={{ flex: 1 }}>
                      <div style={{...styles.tipCategory, color: colors.primary}}>{tip.category}</div>
                      <div style={styles.tipTitle}>{tip.title}</div>
                      <p style={styles.tipDescription}>{tip.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div style={styles.emptyState}>No lifestyle adjustments prescribed.</div>
              )}
            </div>
          </section>

          {/* Product Catalog */}
          <section style={styles.section}>
            <div style={styles.secHead}>
              <Package size={14} /> <span>Recommended Formulations</span>
            </div>
            <div style={styles.productList}>
              {uniqueProducts.length > 0 ? (
                uniqueProducts.map((p: any) => (
                  <div key={p.id} style={styles.productCard}>
                    <div style={styles.productMain}>
                      <img src={p.image_url} alt="" style={styles.productImg} />
                      <div style={{ flex: 1 }}>
                        <div style={styles.pName}>{p.product_name}</div>
                        <div style={styles.pType}>{p.type} • <span style={{color: colors.primary, fontWeight: 'bold'}}>₱{p.price}</span></div>
                      </div>
                      <ChevronRight size={18} color="#cbd5e1" />
                    </div>
                    <div style={styles.productDetails}>
                      <div style={styles.detailTag}>USAGE REGIMEN: {p.usage}</div>
                      <div style={styles.detailText}>{p.instructions}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={styles.emptyState}>No specific products linked.</div>
              )}
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer style={styles.footer}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: colors.primary }} />
            <span style={styles.footerLabel}>Secure Clinical Record</span>
          </div>
          <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>End-to-End Encrypted</p>
        </footer>
      </div>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: { padding: "24px 32px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between", background: 'white' },
  headerLeft: { display: "flex", alignItems: "center", gap: 16 },
  badge: { width: 40, height: 40, borderRadius: "12px", background: "#00A3AD", display: "flex", alignItems: "center", justifyContent: "center" },
  title: { fontSize: "18px", fontWeight: 700, color: "#0f172a", margin: 0, letterSpacing: "-0.01em" },
  clinicalTag: { padding: "2px 8px", background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: "6px", fontSize: "10px", fontWeight: 700, color: "#64748b", textTransform: 'uppercase' },
  metaRow: { marginTop: 4 },
  idLabel: { fontSize: "11px", fontWeight: 700, color: "#94a3b8", margin: 0 },
  closeBtn: { border: "1px solid #f1f5f9", background: "white", padding: "8px", borderRadius: "10px", cursor: "pointer", color: "#64748b" },
  content: { flex: 1, overflowY: "auto", padding: "32px", display: "flex", flexDirection: "column", gap: 32 },
  statsRow: { display: "flex", gap: 12 },
  statBox: { flex: 1, padding: "16px", borderRadius: "16px", background: "#fff", border: "1px solid #f1f5f9" },
  statLabel: { fontSize: "9px", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", marginBottom: 6, display: 'block' },
  statValue: { fontSize: "15px", fontWeight: 700, color: "#0f172a" },
  section: { display: "flex", flexDirection: "column", gap: 12 },
  secHead: { display: "flex", alignItems: "center", gap: 8, fontSize: "10px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: '0.1em' },
  protocolCard: { padding: "20px", borderRadius: "16px", background: "#f8fafc", border: "1px solid #f1f5f9" },
  bodyText: { margin: 0, fontSize: "13px", color: "#475569", lineHeight: "1.6", fontWeight: 500 },
  precautionCard: { padding: "16px", borderRadius: "16px", background: "#fff1f2", fontSize: "13px", lineHeight: "1.6", color: "#9f1239", fontWeight: 600, border: "1px solid #ffe4e6" },
  tipsGrid: { display: "flex", flexDirection: "column", gap: 12 },
  tipItem: { display: "flex", gap: 16, padding: "20px", borderRadius: "16px", border: "1px solid #f1f5f9", background: "#fff" },
  tipIcon: { width: 32, height: 32, borderRadius: "10px", background: "#f0fdfa", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  tipCategory: { fontSize: "9px", fontWeight: 800, textTransform: "uppercase", marginBottom: 4, letterSpacing: '0.05em' },
  tipTitle: { fontSize: "15px", fontWeight: 700, color: "#0f172a", marginBottom: 4 },
  tipDescription: { fontSize: "13px", color: "#64748b", margin: 0, lineHeight: 1.6 },
  productList: { display: "flex", flexDirection: "column", gap: 12 },
  productCard: { display: "flex", flexDirection: "column", borderRadius: "16px", border: "1px solid #f1f5f9", overflow: "hidden", background: '#fff' },
  productMain: { display: "flex", alignItems: "center", gap: 16, padding: "16px" },
  productImg: { width: 56, height: 56, borderRadius: "12px", objectFit: "cover", background: '#f8fafc', border: "1px solid #f1f5f9" },
  pName: { fontSize: "14px", fontWeight: 700, color: "#0f172a" },
  pType: { fontSize: "12px", color: "#94a3b8", marginTop: 2 },
  productDetails: { padding: "16px", background: "#fcfdfe", borderTop: "1px solid #f1f5f9" },
  detailTag: { fontSize: "11px", fontWeight: 700, color: "#475569", marginBottom: 6, textTransform: 'uppercase' },
  detailText: { fontSize: "13px", color: "#64748b", lineHeight: 1.6 },
  emptyState: { padding: "32px", textAlign: "center", color: "#94a3b8", fontSize: "13px", border: "1px dashed #e2e8f0", borderRadius: "16px" },
  footer: { padding: "20px 32px", borderTop: "1px solid #f1f5f9", display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' },
  footerLabel: { fontSize: "10px", fontWeight: 700, color: "#94a3b8", textTransform: 'uppercase', letterSpacing: '0.1em' }
};