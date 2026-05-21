import React from 'react';
import { 
  X, 
  Printer, 
  Phone, 
  MapPin, 
  Calendar, 
  User as UserIcon,
  Clock,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import type { User } from '../types/User';
import type { CSSProperties } from 'react';

// --- Helper Functions ---
const getFullName = (user: User): string => {
  const { first_name, middle_name, last_name, suffix } = user;
  return [first_name, middle_name, last_name, suffix]
    .filter((name): name is string => Boolean(name && name.trim()))
    .join(' ');
};

const formatDate = (dateValue?: number | string | Date): string => {
  if (!dateValue) return '—';
  return new Date(dateValue).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });
};

// --- Sub-Component: DataField ---
const DataField = ({ label, value, icon: Icon }: { label: string; value?: string | number; icon?: any }) => (
  <div style={styles.fieldContainer}>
    <label style={styles.fieldLabel}>{label}</label>
    <div style={styles.fieldValueBox}>
      {Icon && <Icon size={14} style={{ color: '#14b8a6', marginRight: '10px' }} />}
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{value || 'Not Provided'}</span>
    </div>
  </div>
);

interface UserDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const UserDetailDrawer: React.FC<UserDetailDrawerProps> = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null;

  const fullName = getFullName(user);
  const dermaPrimary = "#14b8a6";

  return (
    <div style={styles.overlay} onClick={onClose}>
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0.5; }
          to { transform: translateX(0); opacity: 1; }
        }
        .drawer-panel { 
            animation: slideInRight 0.5s cubic-bezier(0.4, 0, 0.2, 1); 
            will-change: transform;
        }
        .print-btn:hover { background-color: #f0fdfa !important; color: ${dermaPrimary} !important; border-color: ${dermaPrimary} !important; }
        .report-btn:hover { background-color: #0d9488 !important; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(20, 184, 166, 0.3); }
      `}</style>

      <div 
        className="drawer-panel" 
        style={styles.drawer} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div style={styles.header}>
          <div style={styles.headerInfo}>
            <div style={styles.iconBox}><ShieldCheck size={20} color={dermaPrimary} /></div>
            <div>
              <h2 style={styles.title}>Clinical Dossier</h2>
              <p style={styles.subtitle}>PATIENT ID: {user.id?.toString().padStart(6, '0')}</p>
            </div>
          </div>
          <button onClick={onClose} style={styles.closeBtn} title="Close dossier">
            <X size={20} />
          </button>
        </div>

        {/* CONTENT */}
        <div style={styles.scrollArea}>
          {/* HERO PROFILE */}
          <div style={styles.profileHero}>
            <div style={styles.avatarWrapper}>
              {user.avatar_url ? (
                <img src={user.avatar_url} style={styles.avatar} alt={fullName} />
              ) : (
                <div style={styles.avatarPlaceholder}>
                   <span style={{ fontSize: '20px' }}>{user.first_name?.[0]}{user.last_name?.[0]}</span>
                </div>
              )}
              <div style={{
                ...styles.statusDot, 
                backgroundColor: user.status?.toLowerCase() === 'active' ? '#10b981' : '#94a3b8'
              }} />
            </div>
            <div>
              <h3 style={styles.displayName}>{fullName}</h3>
              <div style={{ ...styles.heroBadge, color: user.status?.toLowerCase() === 'active' ? '#0d9488' : '#64748b' }}>
                {user.status || 'Active'} Registry
              </div>
            </div>
          </div>

          <section style={styles.section}>
            <h4 style={styles.sectionLabel}>Demographic Profile</h4>
            <div style={styles.grid}>
              <DataField label="Date of Birth" value={formatDate(user.date_of_birth)} icon={Calendar} />
              <DataField label="Biological Gender" value={user.gender} />
            </div>
          </section>

          <section style={styles.section}>
            <h4 style={styles.sectionLabel}>Contact Access</h4>
            <DataField label="Primary Contact" value={user.phone_number} icon={Phone} />
            <DataField label="Residential Address" value={user.address} icon={MapPin} />
          </section>

          <section style={styles.section}>
            <h4 style={styles.sectionLabel}>File Metadata</h4>
            <div style={styles.auditBox}>
               <div style={styles.auditRow}>
                 <Clock size={16} color={dermaPrimary} />
                 <div>
                   <div style={styles.auditTime}>
                     Last updated at {new Date(user.updated_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                   </div>
                   <div style={styles.auditDate}>{formatDate(user.updated_at || Date.now())}</div>
                 </div>
               </div>
               <div style={styles.regDate}>
                 Original Entry: {formatDate(user.created_at || Date.now())}
               </div>
            </div>
          </section>
        </div>

        {/* FOOTER */}
        <div style={styles.footer}>
          <button className="print-btn" style={styles.secondaryBtn} onClick={() => window.print()}>
            <Printer size={16} /> Print File
          </button>
          <button className="report-btn" style={styles.primaryBtn}>
            <ExternalLink size={16} /> Full Analytics
          </button>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, CSSProperties> = {
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    backdropFilter: "blur(8px)",
    zIndex: 2000,
    display: "flex",
    justifyContent: "flex-end"
  },
  drawer: {
    width: "100%",
    maxWidth: "500px",
    backgroundColor: "#ffffff",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    boxShadow: "-20px 0 60px rgba(0,0,0,0.15)",
  },
  header: {
    padding: "32px",
    borderBottom: "1px solid #f1f5f9",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerInfo: { display: "flex", alignItems: "center", gap: "16px" },
  iconBox: {
    width: "44px", height: "44px", borderRadius: "14px",
    backgroundColor: "#f0fdfa", display: "flex", alignItems: "center", justifyContent: "center"
  },
  title: { margin: 0, fontSize: "18px", fontWeight: 800, color: "#1e293b", letterSpacing: '-0.01em' },
  subtitle: { margin: 0, fontSize: "10px", color: "#94a3b8", fontWeight: 800, letterSpacing: "0.08em" },
  closeBtn: { border: "none", background: "#f8fafc", padding: "10px", borderRadius: "12px", cursor: "pointer", color: "#94a3b8", transition: 'all 0.2s' },
  scrollArea: { flex: 1, overflowY: "auto", padding: "32px" },
  profileHero: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
    marginBottom: "40px",
    padding: "24px",
    backgroundColor: "#fcfcfd",
    borderRadius: "24px",
    border: "1px solid #f1f5f9",
  },
  avatarWrapper: { position: "relative" },
  avatar: { width: "72px", height: "72px", borderRadius: "20px", objectFit: "cover", border: '2px solid #fff', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
  avatarPlaceholder: { 
    width: "72px", height: "72px", borderRadius: "20px", 
    backgroundColor: "#f0fdfa", color: "#14b8a6", 
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 800, border: '1px solid #ccfbf1'
  },
  statusDot: { 
    position: "absolute", bottom: "0px", right: "0px", 
    width: "16px", height: "16px", borderRadius: "50%", border: "3px solid #fcfcfd" 
  },
  displayName: { margin: 0, fontSize: "20px", fontWeight: 800, color: "#1e293b" },
  heroBadge: { fontSize: "10px", fontWeight: 800, marginTop: "6px", textTransform: 'uppercase', letterSpacing: '0.05em' },
  section: { marginBottom: "36px" },
  sectionLabel: { fontSize: "10px", fontWeight: 800, color: "#cbd5e1", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "16px" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
  fieldContainer: { marginBottom: "14px" },
  fieldLabel: { fontSize: "11px", fontWeight: 700, color: "#94a3b8", marginBottom: "6px", display: "block" },
  fieldValueBox: {
    display: "flex", alignItems: "center", padding: "12px 16px",
    fontSize: "14px", fontWeight: 600, backgroundColor: "#f8fafc",
    borderRadius: "12px", border: "1px solid #f1f5f9", color: "#334155",
  },
  auditBox: { padding: "20px", backgroundColor: "#fff", border: "1px solid #f1f5f9", borderRadius: "16px" },
  auditRow: { display: "flex", gap: "14px", alignItems: "center" },
  auditTime: { fontWeight: 700, fontSize: "14px", color: "#1e293b" },
  auditDate: { fontSize: "11px", color: "#94a3b8", fontWeight: 600 },
  regDate: { marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #f8fafc", fontSize: "11px", color: "#cbd5e1", fontWeight: 600 },
  footer: { padding: "24px 32px", borderTop: "1px solid #f1f5f9", display: "flex", gap: "16px", backgroundColor: '#fff' },
  primaryBtn: { 
    flex: 2, background: "#14b8a6", color: "#fff", border: "none", 
    height: "48px", borderRadius: "14px", fontWeight: 700, fontSize: "14px",
    display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", cursor: "pointer", transition: 'all 0.3s'
  },
  secondaryBtn: { 
    flex: 1, background: "#fff", color: "#64748b", border: "1px solid #e2e8f0", 
    height: "48px", borderRadius: "14px", fontWeight: 700, fontSize: "14px",
    display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", cursor: "pointer", transition: 'all 0.3s'
  }
};

export default UserDetailDrawer;