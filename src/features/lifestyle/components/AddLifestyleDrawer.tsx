import React, { useState, useEffect, useCallback, useMemo } from "react";
import { X, Type, AlignLeft, Tag, Save, Loader2, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { lifestyleServices } from "../services/lifestyleServices";
import type { LifestyleTip } from "../types/Lifestyle";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => Promise<void>;
  editData?: LifestyleTip | null;
}

export default function AddLifestyleDrawer({ isOpen, onClose, onSave, editData }: Props) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({ 
    category: "", 
    title: "", 
    description: "" 
  });

  useEffect(() => {
    if (isOpen) {
      if (editData) {
        setForm({
          category: editData.category,
          title: editData.title,
          description: editData.description
        });
      } else {
        setForm({ category: "", title: "", description: "" });
      }
      const frame = requestAnimationFrame(() => setIsAnimating(true));
      return () => cancelAnimationFrame(frame);
    } else {
      setIsAnimating(false);
    }
  }, [editData, isOpen]);

  const handleClose = useCallback(() => {
    setIsAnimating(false);
    setTimeout(onClose, 300);
  }, [onClose]);

  const isFormValid = useMemo(() => (
    form.title.trim() && form.category && form.description.trim()
  ), [form]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      return toast.error("Required clinical details missing.");
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading(editData ? "Updating database..." : "Publishing protocol...");

    try {
      if (editData) {
        await lifestyleServices.updateTip(editData.id, form);
        toast.success("Protocol updated", { id: loadingToast });
      } else {
        await lifestyleServices.addTip(form);
        toast.success("Wellness protocol published", { id: loadingToast });
      }
      
      await onSave();
      handleClose();
    } catch (err) {
      toast.error("Database synchronization failed", { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen && !isAnimating) return null;

  return (
    <div 
      style={{ ...styles.overlay, opacity: isAnimating ? 1 : 0 }} 
      onClick={handleClose}
    >
      <div 
        style={{ 
          ...styles.drawer, 
          transform: isAnimating ? "translateX(0)" : "translateX(100%)" 
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <header style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.badge}>
              <Sparkles size={18} color="#00A3AD" />
            </div>
            <div>
              <h2 style={styles.title}>{editData ? "Edit Protocol" : "New Wellness Protocol"}</h2>
              <p style={styles.subtitle}>
                {editData ? `REF_ID: ${editData.id}` : "AI-DRIVEN LIFESTYLE MANAGEMENT"}
              </p>
            </div>
          </div>
          <button onClick={handleClose} style={styles.closeBtn} className="close-hover">
            <X size={16} />
          </button>
        </header>

        <form id="lifestyle-form" onSubmit={handleSubmit} style={styles.body}>
          <section style={styles.section}>
            <div style={styles.secHead}>
              <span style={styles.secLabel}>Clinical Classification</span>
              <div style={styles.secLine} />
            </div>

            <div style={styles.field}>
              <label style={styles.label}><Tag size={12} color="#00A3AD" /> Logic Category</label>
              <select 
                value={form.category} 
                onChange={e => setForm({...form, category: e.target.value})}
                style={styles.input}
                className="input-focus"
              >
                <option value="">Choose category...</option>
                <optgroup label="Physical Wellness">
                  <option value="diet">Diet & Nutrition</option>
                  <option value="hydration">Hydration</option>
                  <option value="exercise">Exercise</option>
                </optgroup>
                <optgroup label="Skin & Protection">
                  <option value="skincare_habits">Skincare Habits</option>
                  <option value="sun_protection">Sun Protection</option>
                  <option value="hygiene">Hygiene</option>
                </optgroup>
                <optgroup label="Lifestyle & Mind">
                  <option value="sleep">Sleep Hygiene</option>
                  <option value="lifestyle_habits">Lifestyle Habits</option>
                  <option value="stress_management">Stress Management</option>
                </optgroup>
              </select>
            </div>
          </section>

          <section style={styles.section}>
            <div style={styles.secHead}>
              <span style={styles.secLabel}>Guidance Content</span>
              <div style={styles.secLine} />
            </div>

            <div style={styles.field}>
              <label style={styles.label}><Type size={12} color="#00A3AD" /> Protocol Title</label>
              <input 
                placeholder="e.g., UV Radiation and Dermal Aging"
                value={form.title}
                onChange={e => setForm({...form, title: e.target.value})}
                style={styles.input}
                className="input-focus"
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}><AlignLeft size={12} color="#00A3AD" /> Clinical Advice</label>
              <textarea 
                placeholder="Detail the actionable wellness guidance for patients..."
                value={form.description}
                onChange={e => setForm({...form, description: e.target.value})}
                style={{ ...styles.input, ...styles.textarea }}
                className="input-focus"
              />
            </div>
          </section>
        </form>

        <footer style={styles.footer}>
          <button onClick={handleClose} style={styles.cancelBtn}>Discard</button>
          <button 
            type="submit"
            form="lifestyle-form"
            disabled={!isFormValid || isSubmitting}
            className="brand-save-btn"
            style={{ 
              ...styles.saveBtn,
              backgroundColor: isFormValid ? "#00A3AD" : "#F1F5F9",
              color: isFormValid ? "#fff" : "#94A3B8"
            }}
          >
            {isSubmitting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {isSubmitting ? "Syncing..." : (editData ? "Update Record" : "Deploy Protocol")}
          </button>
        </footer>
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

        .brand-save-btn:hover:not(:disabled) {
          background-color: #008C95 !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 15px rgba(0, 163, 173, 0.25);
        }
      `}</style>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.4)",
    backdropFilter: "blur(8px)",
    zIndex: 1000,
    display: "flex",
    justifyContent: "flex-end",
    transition: "opacity 0.4s ease-out",
  },
  drawer: {
    width: "min(500px, 100vw)" as any,
    height: "100vh",
    background: "#fff",
    display: "flex",
    flexDirection: "column",
    boxShadow: "-20px 0 60px rgba(0,0,0,0.12)",
    transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
  },
  header: {
    padding: "32px",
    borderBottom: "1px solid #F1F5F9",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: { display: "flex", alignItems: "center", gap: 18 },
  badge: { 
    width: 48, height: 48, borderRadius: 14, background: "#F0F9FA", 
    border: "1px solid #E0F2F1", display: "flex", alignItems: "center", justifyContent: "center" 
  },
  title: { fontSize: 18, fontWeight: 800, color: "#0F172A", margin: 0, letterSpacing: "-0.02em" },
  subtitle: { fontSize: 10, color: "#64748B", fontWeight: 800, letterSpacing: "1px", marginTop: 4 },
  closeBtn: { border: "none", background: "transparent", padding: "8px", borderRadius: "10px", cursor: "pointer", color: "#94A3B8", display: "flex", transition: "0.2s" },
  body: { flex: 1, overflowY: "auto", padding: "40px 32px", display: "flex", flexDirection: "column", gap: 32 },
  section: { display: "flex", flexDirection: "column", gap: 24 },
  secHead: { display: "flex", alignItems: "center", gap: 12 },
  secLabel: { fontSize: 11, fontWeight: 800, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em" },
  secLine: { flex: 1, height: "1px", background: "#F1F5F9" },
  field: { display: "flex", flexDirection: "column", gap: 8 },
  label: { fontSize: 12, fontWeight: 700, color: "#475569", display: "flex", alignItems: "center", gap: 8 },
  input: { 
    width: "100%", padding: "14px", fontSize: 14, border: "1px solid #E2E8F0", fontWeight: 500,
    borderRadius: 12, outline: "none", transition: "all 0.3s", background: "#F8FAFC" 
  },
  textarea: { height: "240px", resize: "none", lineHeight: "1.7" },
  footer: { 
    padding: "24px 32px", borderTop: "1px solid #F1F5F9", 
    display: "flex", gap: "12px", background: "#fff" 
  },
  cancelBtn: { 
    flex: 1, height: "52px", borderRadius: 14, border: "1px solid #E2E8F0", 
    background: "#fff", color: "#64748B", fontWeight: 700, cursor: "pointer", transition: "0.2s"
  },
  saveBtn: { 
    flex: 2, height: "52px", borderRadius: 14, border: "none", fontWeight: 700, 
    display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", 
    cursor: "pointer", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" 
  },
};