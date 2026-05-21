import { useState, useEffect, useRef, type CSSProperties } from "react";
import { Activity, X } from "lucide-react";

type Props = {
  isOpen: boolean;
  onCancel: () => void;
  onSubmit: (data: { id?: number; name: string; description: string }) => void;
  isSaving: boolean;
  initialData?: { id: number; name: string; description: string } | null;
};

export default function AddConditionDrawer({
  isOpen,
  onCancel,
  onSubmit,
  isSaving,
  initialData,
}: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const wasSaving = useRef(isSaving);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (wasSaving.current === true && isSaving === false && isOpen) {
      onCancel();
    }
    wasSaving.current = isSaving;
  }, [isSaving, isOpen, onCancel]);

  useEffect(() => {
    if (isOpen) {
      setName(initialData?.name || "");
      setDescription(initialData?.description || "");
      const timer = setTimeout(() => inputRef.current?.focus(), 400);
      return () => clearTimeout(timer);
    }
  }, [initialData, isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onCancel]);

  const handleSubmit = () => {
    if (!name.trim() || isSaving) return;
    onSubmit({ 
      ...(initialData?.id && { id: initialData.id }),
      name: name.trim(), 
      description: description.trim() 
    });
  };

  const isFormValid = name.trim().length > 0;

  return (
    <>
      {/* Backdrop */}
      <div
        style={{ ...styles.overlay, opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? "auto" : "none" }}
        onClick={onCancel}
      />
      
      {/* Drawer Panel */}
      <div style={{ ...styles.drawer, right: isOpen ? 0 : "-520px" }} onClick={(e) => e.stopPropagation()}>
        <div style={styles.container}>
          <header style={styles.header}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={styles.title}>{initialData ? "Edit Condition" : "New Condition"}</h3>
                <button style={styles.closeBtn} onClick={onCancel} className="close-hover">
                  <X size={20} />
                </button>
            </div>
            <p style={styles.subtitle}>
              {initialData ? "Update the clinical parameters for this diagnosis." : "Add a new dermatological condition to the DermaAI knowledge base."}
            </p>
          </header>

          <div style={styles.content}>
            <div style={styles.inputGroup}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <label style={styles.label}>Clinical Label</label>
                <span style={styles.helperText}>{name.length}/50</span>
              </div>
              <input
                ref={inputRef}
                style={styles.input}
                className="input-focus"
                placeholder="e.g. Psoriasis Vulgaris"
                value={name}
                maxLength={50}
                disabled={isSaving}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div style={styles.inputGroup}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <label style={styles.label}>Medical Description</label>
                <span style={styles.helperText}>{description.length}/500</span>
              </div>
              <textarea
                style={styles.textarea}
                className="input-focus"
                placeholder="Detail key visual indicators, scaling, and common locations..."
                value={description}
                rows={12}
                maxLength={500}
                disabled={isSaving}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <footer style={styles.footer}>
            <button style={styles.secondary} onClick={onCancel} disabled={isSaving}>
              Discard
            </button>
            <button
              style={{
                ...styles.primary,
                opacity: isFormValid && !isSaving ? 1 : 0.6,
                cursor: isFormValid && !isSaving ? "pointer" : "not-allowed",
              }}
              disabled={!isFormValid || isSaving}
              onClick={handleSubmit}
            >
              {isSaving ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Activity size={16} className="animate-spin" /> 
                  <span>Syncing...</span>
                </div>
              ) : (
                initialData ? "Update Record" : "Add to Database"
              )}
            </button>
          </footer>
        </div>
      </div>
      
      <style>{`
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        .input-focus:focus { 
          border-color: #00A3AD !important; 
          background: #fff !important; 
          box-shadow: 0 0 0 4px rgba(0, 163, 173, 0.1); 
          outline: none;
        }

        .close-hover:hover {
          background-color: #F1F5F9;
          color: #0F172A !important;
        }
      `}</style>
    </>
  );
}

const styles: Record<string, CSSProperties> = {
  overlay: { position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(8px)", zIndex: 1000, transition: "opacity 0.4s ease" },
  drawer: { position: "fixed", top: 0, width: "100%", maxWidth: "500px", height: "100vh", background: "#ffffff", zIndex: 1001, boxShadow: "-20px 0 60px rgba(0,0,0,0.1)", transition: "right 0.6s cubic-bezier(0.16, 1, 0.3, 1)", display: "flex", flexDirection: "column" },
  container: { display: "flex", flexDirection: "column", height: "100%" },
  header: { padding: "40px 32px 32px 32px", borderBottom: "1px solid #F1F5F9", display: "flex", flexDirection: "column", gap: "8px" },
  title: { fontSize: "24px", fontWeight: 800, color: "#0F172A", margin: 0, letterSpacing: "-0.02em" },
  subtitle: { fontSize: "14px", color: "#64748B", margin: 0, lineHeight: 1.6, fontWeight: 500 },
  closeBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: '8px', borderRadius: '12px', display: 'flex', alignItems: 'center', transition: 'all 0.2s' },
  content: { flex: 1, padding: "32px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "32px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "11px", fontWeight: 800, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" },
  input: { padding: "16px", borderRadius: "14px", border: "1px solid #E2E8F0", fontSize: "15px", fontWeight: 500, background: "#F8FAFC", transition: "all 0.3s ease" },
  textarea: { padding: "16px", borderRadius: "14px", border: "1px solid #E2E8F0", fontSize: "15px", fontWeight: 500, background: "#F8FAFC", resize: "none", fontFamily: "inherit", lineHeight: 1.6, transition: "all 0.3s ease" },
  helperText: { fontSize: "11px", color: "#94A3B8", fontWeight: 600 },
  footer: { padding: "24px 32px", borderTop: "1px solid #F1F5F9", display: "flex", justifyContent: "flex-end", gap: "12px", background: "#fff" },
  primary: { background: "#00A3AD", color: "#fff", border: "none", padding: "14px 28px", borderRadius: "14px", fontSize: "14px", fontWeight: 700, transition: 'all 0.3s', boxShadow: "0 4px 12px rgba(0, 163, 173, 0.2)" },
  secondary: { background: "#fff", border: "1px solid #E2E8F0", padding: "14px 28px", borderRadius: "14px", fontSize: "14px", fontWeight: 700, color: "#64748B", cursor: "pointer", transition: "all 0.2s" },
};