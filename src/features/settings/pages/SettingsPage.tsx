import { type ChangeEvent, type CSSProperties, useRef, useState, useEffect } from "react";
import { 
  Camera, Shield, User, Building2, Save, X, Mail, 
  Phone, MapPin, Globe, Activity, CheckCircle, ChevronRight 
} from "lucide-react";
import TitleSize from "../../../styles/TitleSize";

/**
 * DermaAI Brand Theme
 * Derived from landing page assets
 */
const theme = {
  primary: "#0F172A",
  accent: "#00A3AD", // Signature Teal
  border: "#E2E8F0",
  textMain: "#0F172A",
  textMuted: "#64748B",
  success: "#10B981",
  bgSubtle: "#F8FAFC"
};

interface FormData {
  fullName: string;
  residence: string;
  email: string;
  contact: string;
  company: string;
  address: string;
  profileImg: string;
}

export default function SettingsPage() {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState<FormData>({
    fullName: "Wren Montero Javier",
    residence: "789 Orchard St, San Francisco, CA 94107",
    email: "javierrenren1@gmail.com",
    contact: "09158952698",
    company: "DermaAI Health Systems",
    address: "500 Innovation Way, Silicon Valley, CA 95054",
    profileImg: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, profileImg: imageUrl }));
    }
  };

  if (loading) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.loaderArea}>
          <Activity className="animate-spin" size={32} color={theme.accent} />
          <p style={{ marginTop: 16, color: theme.textMuted, fontWeight: 600 }}>
            Synchronizing Clinical Data...
          </p>
        </div>
        <style>{`
          .animate-spin { animation: spin 1s linear infinite; }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <style>
        {`
          .settings-grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 40px; }
          .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
          .responsive-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 40px; gap: 16px; }
          
          /* Themed Buttons */
          .btn-primary-theme:hover { background: #008c95 !important; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0, 163, 173, 0.25); }
          .btn-ghost-theme:hover { border-color: ${theme.accent} !important; color: ${theme.accent} !important; }

          @media (max-width: 1024px) { .settings-grid { grid-template-columns: 1fr; } }
          @media (max-width: 640px) {
            .form-grid { grid-template-columns: 1fr; }
            .responsive-header { flex-direction: column; align-items: flex-start; }
            .profile-hero { flex-direction: column; text-align: center; }
          }

          .input-field {
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            border: 1px solid ${theme.border};
            width: 100%;
            height: 48px;
            border-radius: 12px;
            font-size: 14px;
            padding: 0 14px;
            background: #FFF;
          }

          .input-field:focus {
            border-color: ${theme.accent} !important;
            box-shadow: 0 0 0 4px rgba(0, 163, 173, 0.1);
            outline: none;
          }
          
          .input-field:disabled {
            border-color: transparent;
            background: transparent;
            padding-left: 0 !important;
            color: ${theme.textMain};
            font-weight: 600;
            font-size: 15px;
          }
        `}
      </style>

      <div style={styles.container}>
        <header className="responsive-header">
          <TitleSize
            title="Clinical Profile"
            subtitle="Manage your administrative credentials and secure access."
          />
          {!isEditing && (
            <button className="btn-primary-theme" style={styles.btnPrimary} onClick={() => setIsEditing(true)}>
              Modify Profile <ChevronRight size={16} />
            </button>
          )}
        </header>

        {/* PROFILE HERO */}
        <section className="profile-hero" style={styles.profileHero}>
          <div 
            style={{...styles.avatarWrapper, border: `3px solid ${isEditing ? theme.accent : theme.border}`}} 
            onClick={() => isEditing && fileInputRef.current?.click()}
          >
            <img src={formData.profileImg} alt="Profile" style={styles.avatarImg} />
            {isEditing && (
              <div style={styles.avatarOverlay}>
                <Camera size={22} color="white" />
              </div>
            )}
            <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageChange} />
          </div>
          
          <div style={styles.heroText}>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                <h2 style={styles.userName}>{formData.fullName}</h2>
                <CheckCircle size={18} color={theme.accent} fill="rgba(0, 163, 173, 0.1)" />
            </div>
            <div style={styles.badgeRow}>
              <span style={styles.infoBadge}><Mail size={13} color={theme.accent} /> {formData.email}</span>
              <span style={styles.infoBadge}><Building2 size={13} color={theme.accent} /> {formData.company}</span>
            </div>
          </div>
        </section>

        <div className="settings-grid">
          <div style={styles.column}>
            {/* IDENTITY SECTION */}
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <div style={styles.iconCircle}><User size={16} /></div>
                <span style={styles.sectionLabel}>Administrative Identity</span>
              </div>
              <div className="form-grid">
                <InputGroup label="Full Name" name="fullName" value={formData.fullName} onChange={handleInputChange} disabled={!isEditing} />
                <InputGroup label="Contact Number" name="contact" value={formData.contact} onChange={handleInputChange} disabled={!isEditing} icon={<Phone size={14} />} />
                <div style={{ gridColumn: "span 2" }}>
                   <InputGroup label="Primary Residence" name="residence" value={formData.residence} onChange={handleInputChange} disabled={!isEditing} icon={<MapPin size={14} />} />
                </div>
              </div>
            </div>

            {/* SECURITY SECTION */}
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <div style={styles.iconCircle}><Shield size={16} /></div>
                <span style={styles.sectionLabel}>System Security</span>
              </div>
              <div className="form-grid">
                <InputGroup label="New Security Key" type="password" placeholder="••••••••" disabled={!isEditing} />
                <InputGroup label="Verify Key" type="password" placeholder="••••••••" disabled={!isEditing} />
              </div>
            </div>
          </div>

          <div style={styles.column}>
            {/* ORGANIZATION SECTION */}
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <div style={styles.iconCircle}><Building2 size={16} /></div>
                <span style={styles.sectionLabel}>Institutional Context</span>
              </div>
              <div style={styles.stack}>
                <InputGroup label="Department / Company" name="company" value={formData.company} onChange={handleInputChange} disabled={!isEditing} icon={<Globe size={14} />} />
                <div style={styles.fieldWrapper}>
                  <label style={styles.fieldLabel}>HQ Address</label>
                  <textarea
                    className="input-field"
                    style={{ 
                        ...styles.textArea, 
                        border: isEditing ? `1px solid ${theme.border}` : "1px solid transparent", 
                        paddingLeft: isEditing ? "14px" : "0",
                        paddingTop: isEditing ? "12px" : "0"
                    }}
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>

            {/* EDITING ACTIONS */}
            {isEditing && (
              <div style={styles.actionRow}>
                <button className="btn-ghost-theme" style={styles.btnGhost} onClick={() => setIsEditing(false)}>
                  <X size={16} /> Discard Changes
                </button>
                <button
                  className="btn-primary-theme"
                  style={{ ...styles.btnPrimary }}
                  onClick={() => setIsEditing(false)}
                >
                  <Save size={16} /> Commit Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const InputGroup = ({ label, icon, disabled, ...props }: any) => (
  <div style={styles.fieldWrapper}>
    <label style={styles.fieldLabel}>{label}</label>
    <div style={{ position: "relative" }}>
      {icon && !disabled && <div style={styles.inputIcon}>{icon}</div>}
      <input 
        className="input-field" 
        disabled={disabled}
        style={{ paddingLeft: icon && !disabled ? "42px" : disabled ? "0" : "14px" }} 
        {...props} 
      />
    </div>
  </div>
);

const styles: Record<string, CSSProperties> = {
  wrapper: { minHeight: "100vh",  padding: "60px 40px" },
  container: { maxWidth: "1100px", margin: "0 auto" },
  loaderArea: { height: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" },
  profileHero: {
    display: "flex",
    alignItems: "center",
    gap: "32px",
    marginBottom: "56px",
    padding: "32px",
    background: "#FFF",
    borderRadius: "24px",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)",
    border: "1px solid #E2E8F0"
  },
  avatarWrapper: {
    position: "relative",
    width: "100px",
    height: "100px",
    borderRadius: "28px",
    overflow: "hidden",
    cursor: "pointer",
    backgroundColor: theme.bgSubtle,
    transition: "all 0.3s ease",
  },
  avatarImg: { width: "100%", height: "100%", objectFit: "cover" },
  avatarOverlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,163,173,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(2px)"
  },
  heroText: { display: "flex", flexDirection: "column", gap: "8px" },
  userName: { margin: 0, fontSize: "26px", fontWeight: 800, color: theme.textMain, letterSpacing: "-0.02em" },
  badgeRow: { display: "flex", flexWrap: "wrap", gap: "16px" },
  infoBadge: { display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: theme.textMuted, fontWeight: 500 },
  column: { display: "flex", flexDirection: "column", gap: "48px" },
  section: { display: "flex", flexDirection: "column" },
  sectionHeader: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" },
  iconCircle: {
      width: "32px", height: "32px", borderRadius: "10px", 
      backgroundColor: "rgba(0, 163, 173, 0.1)", color: theme.accent,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  sectionLabel: { fontSize: "12px", fontWeight: 800, color: theme.textMain, textTransform: "uppercase", letterSpacing: "0.1em" },
  stack: { display: "flex", flexDirection: "column", gap: "24px" },
  fieldWrapper: { display: "flex", flexDirection: "column", gap: "8px" },
  fieldLabel: { fontSize: "11px", fontWeight: 700, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' },
  textArea: {
    width: "100%",
    height: "100px",
    fontSize: "14px",
    color: theme.textMain,
    resize: "none",
    boxSizing: "border-box",
    background: "transparent",
    outline: "none",
    lineHeight: 1.6
  },
  inputIcon: { position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: theme.accent },
  btnPrimary: {
    padding: "14px 28px",
    backgroundColor: theme.accent, // Teal
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontWeight: 700,
    fontSize: "15px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 8px rgba(0, 163, 173, 0.15)"
  },
  btnGhost: {
    padding: "14px 28px",
    background: "#ffffff",
    border: `1px solid ${theme.border}`,
    color: "#475569",
    borderRadius: "12px",
    fontWeight: 600,
    fontSize: "15px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    transition: "all 0.3s ease",
  },
  actionRow: { display: "flex", justifyContent: "flex-end", gap: "16px", marginTop: "16px" },
};