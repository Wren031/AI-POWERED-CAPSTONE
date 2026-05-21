import React, { useState, useEffect, useCallback } from "react";
import { 
  X, Package, CloudUpload, Loader2, 
  Info, Activity, Save, ClipboardList, Banknote, Calendar, Beaker
} from "lucide-react";
import type { CSSProperties, ChangeEvent } from "react";
import toast from "react-hot-toast";
import { productServices } from "../services/productServices";
import type { Products } from "../types/Products";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: any) => Promise<void>;
  initialData?: Products | null;
}

interface FormState extends Omit<Products, "id" | "created_at"> {
  usage_duration: string;
  specific_date: string;
}

export default function AddProductDrawer({ isOpen, onClose, onSave, initialData }: Props) {
  const isEditing = !!initialData;
  const dermaPrimary = "#14b8a6";
  const today = new Date().toISOString().split('T')[0];

  const initialForm: FormState = {
    product_name: "",
    type: "",
    usage: "",
    instructions: "",
    price: 0,
    image_url: "",
    lifestyle_tips: false,
    usage_duration: "",
    specific_date: today 
  };

  const [form, setForm] = useState<FormState>(initialForm);
  const [preview, setPreview] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (initialData) {
        setForm({
          ...initialData,
          usage_duration: (initialData as any).usage_duration || "",
          specific_date: (initialData as any).specific_date || today
        });
        setPreview(initialData.image_url || "");
      } else {
        setForm(initialForm);
        setPreview("");
      }
      const frame = requestAnimationFrame(() => setIsAnimating(true));
      return () => cancelAnimationFrame(frame);
    } else {
      setIsAnimating(false);
      document.body.style.overflow = "unset";
      const timeout = setTimeout(() => {
        setForm(initialForm);
        setPreview("");
        setFile(null);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen, initialData, today]);

  const handleClose = useCallback(() => {
    setIsAnimating(false);
    setTimeout(onClose, 300);
  }, [onClose]);

  const handleChange = useCallback((
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "specific_date" && value < today) {
      toast.error("Past dates are restricted for clinical protocols");
      return;
    }
    setForm((prev) => ({ 
      ...prev, 
      [name]: name === "price" ? (parseFloat(value) || 0) : value 
    }));
  }, [today]);

  const handleImageChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    const objectUrl = URL.createObjectURL(selected);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, []);

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.product_name.trim()) return toast.error("Clinical product name required");
    
    setIsSubmitting(true);
    const loadingToast = toast.loading(isEditing ? "Updating record..." : "Initializing product SKU...");

    try {
      // 1. Handle Image Upload
      let finalImageUrl = form.image_url;
      if (file) {
        const uploaded = await productServices.uploadImage(file);
        if (uploaded) finalImageUrl = uploaded;
      }

      // 2. Convert Duration Selection into Raw Digits
      let finalDuration: string | number = form.usage_duration;

      if (form.usage_duration === "1 Week") {
        finalDuration = "7";
      } 
      else if (form.usage_duration === "2 Weeks") {
        finalDuration = "14";
      } 
      else if (form.usage_duration === "specific") {
        const startDate = new Date(today);
        const endDate = new Date(form.specific_date);
        
        const diffInMs = endDate.getTime() - startDate.getTime();
        const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
        
        // Ensure at least 1, and convert to string digit
        finalDuration = (diffInDays <= 0 ? 1 : diffInDays).toString();
      }

      // 3. Prepare Final Data Payload
      const productData = isEditing 
        ? { 
            ...initialData, 
            ...form, 
            usage_duration: finalDuration, 
            image_url: finalImageUrl 
          }
        : { 
            ...form, 
            usage_duration: finalDuration, 
            image_url: finalImageUrl 
          };

      // 4. Save to Backend
      await onSave(productData);
      
      toast.success(isEditing ? "Registry updated" : "Product cataloged", { id: loadingToast });
      handleClose();
    } catch (err) {
      console.error("Submission error:", err);
      toast.error("System error: Transaction failed", { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen && !isAnimating) return null;

  return (
    <div style={{ ...styles.overlay, opacity: isAnimating ? 1 : 0 }} onClick={handleClose}>
      <style>{`
        #product-form::-webkit-scrollbar { width: 5px; }
        #product-form::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        input[type="date"]::-webkit-calendar-picker-indicator {
          background: transparent; bottom: 0; color: transparent; cursor: pointer;
          height: auto; left: 0; position: absolute; right: 0; top: 0; width: auto;
        }
      `}</style>

      <div 
        style={{ 
          ...styles.drawer, 
          transform: isAnimating ? "translateX(0)" : "translateX(100%)" 
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <header style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={{...styles.badge, borderColor: dermaPrimary + '30'}}>
                {isEditing ? <Save size={20} color={dermaPrimary} /> : <Package size={20} color={dermaPrimary} />}
            </div>
            <div>
              <h2 style={styles.title}>{isEditing ? "Edit Clinical Entry" : "Register New Product"}</h2>
              <p style={styles.subtitle}>PROTOCOL CLINICAL VIEW</p>
            </div>
          </div>
          <button onClick={handleClose} style={styles.closeBtn}><X size={18} /></button>
        </header>

        <form id="product-form" onSubmit={handleSubmit} style={styles.body}>
          
          {/* REPLACED: Professional Product Asset Section */}
          <section style={styles.section}>
            <div style={styles.secHead}>
              <span style={styles.secLabel}>Product Asset</span>
              <div style={styles.secLine} />
            </div>
            
            <div style={styles.assetContainer}>
              <div style={styles.clinicalPreviewBox}>
                {preview ? (
                  <img src={preview} alt="SKU Preview" style={styles.professionalImage} />
                ) : (
                  <div style={styles.placeholderCenter}>
                    <div style={styles.beakerRing}>
                      <Beaker size={32} color={dermaPrimary} />
                    </div>
                    <span style={styles.placeholderMain}>SKIN CARE PRODUCT</span>
                    <span style={styles.placeholderSub}>Professional Image or Clinical Visualization Required</span>
                  </div>
                )}
                {preview && (
                  <button type="button" onClick={() => {setPreview(""); setFile(null); setForm(prev => ({...prev, image_url: ""}))}} style={styles.imageRemoveFloat}>
                    <X size={14} color="#ef4444" />
                  </button>
                )}
              </div>
              
              <div style={styles.uploadControls}>
                <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} id="product-upload" />
                <label htmlFor="product-upload" style={styles.professionalUploadBtn}>
                  <CloudUpload size={18} /> {preview ? "Replace Asset" : "Upload SKU Asset"}
                </label>
                <p style={styles.uploadHint}>Supported formats: JPG, PNG. Max 5MB.</p>
              </div>
            </div>
          </section>

          <div style={styles.gridTwo}>
            <section style={styles.section}>
              <div style={styles.secHead}>
                <span style={styles.secLabel}>Product Identity</span>
                <div style={styles.secLine} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}><Package size={12} color={dermaPrimary} /> Clinical Name</label>
                <input name="product_name" value={form.product_name} onChange={handleChange} style={styles.input} placeholder="e.g. Glycolic Acid" />
              </div>
              <div style={styles.field}>
                <label style={styles.label}><Info size={12} color={dermaPrimary} /> Brand / Type</label>
                <input name="type" value={form.type} onChange={handleChange} style={styles.input} placeholder="e.g. Chemical Exfoliant" />
              </div>
            </section>

            <section style={styles.section}>
              <div style={styles.secHead}>
                <span style={styles.secLabel}>Commercial Info</span>
                <div style={styles.secLine} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}><Banknote size={12} color={dermaPrimary} /> Unit Price (PHP)</label>
                <input type="number" name="price" value={form.price || ""} onChange={handleChange} style={styles.input} placeholder="0.00" />
              </div>
              <div style={styles.field}>
                <label style={styles.label}><Activity size={12} color={dermaPrimary} /> Prescribed Timing</label>
                <select name="usage" value={form.usage} onChange={handleChange} style={{...styles.input, ...styles.select}}>
                  <option value="">Select Routine...</option>
                  <option value="Morning Routine">Morning Protocol (AM)</option>
                  <option value="Evening Routine">Evening Protocol (PM)</option>
                  <option value="Both">Bimodal (AM/PM)</option>
                </select>
              </div>
            </section>
          </div>

          <section style={styles.section}>
            <div style={styles.secHead}>
              <span style={styles.secLabel}>Application Protocol</span>
              <div style={styles.secLine} />
            </div>

            <div style={styles.gridTwo}>
                <div style={styles.field}>
                  <label style={styles.label}><Calendar size={12} color={dermaPrimary} /> Duration Selection</label>
                  <select name="usage_duration" value={form.usage_duration} onChange={handleChange} style={{...styles.input, ...styles.select}}>
                    <option value="">Set Duration...</option>
                    <option value="1 Week">1 Week Course</option>
                    <option value="2 Weeks">2 Weeks Course</option>
                    <option value="specific">Specific Treatment Date</option>
                  </select>
                </div>

                {form.usage_duration === "specific" && (
                  <div style={{...styles.field, animation: 'fadeIn 0.2s ease'}}>
                    <label style={styles.label}>End Date</label>
                    <div style={{ position: 'relative' }}>
                      <input type="date" name="specific_date" min={today} value={form.specific_date} onChange={handleChange} style={styles.input} />
                      <Calendar size={16} color={dermaPrimary} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    </div>
                  </div>
                )}
            </div>

            <div style={styles.field}>
              <label style={styles.label}><ClipboardList size={12} color={dermaPrimary} /> Dosage Instructions</label>
              <textarea name="instructions" value={form.instructions} onChange={handleChange} style={{...styles.input, ...styles.textarea}} placeholder="Detailed application steps..." />
            </div>
          </section>
        </form>

        <footer style={styles.footer}>
          <button type="button" style={styles.cancelBtn} onClick={handleClose}>Discard</button>
          <button type="submit" form="product-form" disabled={isSubmitting} style={{ ...styles.saveBtn, background: dermaPrimary, opacity: isSubmitting ? 0.7 : 1 }}>
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : (isEditing ? "Update SKU" : "Register Product")}
          </button>
        </footer>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  overlay: {
    position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.4)",
    backdropFilter: "blur(10px)", zIndex: 1000, display: "flex", justifyContent: "flex-end",
    transition: "opacity 0.3s ease",
  },
  drawer: {
    width: "700px", height: "100vh", background: "#fff", display: "flex", flexDirection: "column",
    boxShadow: "-20px 0 60px rgba(0,0,0,0.15)", transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
  },
  header: {
    padding: "32px 48px", borderBottom: "1px solid #f1f5f9", display: "flex",
    alignItems: "center", justifyContent: "space-between", background: "#fcfcfd"
  },
  headerLeft: { display: "flex", alignItems: "center", gap: 20 },
  badge: { 
    width: 48, height: 48, borderRadius: 16, background: "#fff", 
    border: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "center",
  },
  title: { fontSize: 20, fontWeight: 800, color: "#1e293b", margin: 0 },
  subtitle: { fontSize: 11, color: "#94a3b8", fontWeight: 800, letterSpacing: "0.1em", marginTop: 4 },
  closeBtn: { border: "none", background: "#f1f5f9", padding: "12px", borderRadius: "14px", cursor: "pointer", color: "#64748b" },
  body: { flex: 1, overflowY: "auto", padding: "40px 48px", display: "flex", flexDirection: "column", gap: 32 },
  
  // NEW STYLES: Clinical Asset Layout
  assetContainer: {
    display: "grid",
    gridTemplateColumns: "320px 1fr",
    gap: "24px",
    alignItems: "center",
    padding: "20px",
    background: "#f8fafc",
    borderRadius: "20px",
    border: "1px solid #f1f5f9"
  },
  clinicalPreviewBox: {
    width: "100%",
    height: "220px",
    background: "#fff",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
  },
  professionalImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover"
  },
  placeholderCenter: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px"
  },
  beakerRing: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    background: "#f0fdfa",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "12px",
    border: "1px solid #ccfbf1"
  },
  placeholderMain: { fontSize: "14px", fontWeight: 800, color: "#64748b", letterSpacing: "0.05em" },
  placeholderSub: { fontSize: "10px", color: "#94a3b8", fontWeight: 600, marginTop: "4px", maxWidth: "160px", lineHeight: "1.4" },
  uploadControls: { display: "flex", flexDirection: "column", gap: "10px" },
  professionalUploadBtn: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    padding: "12px 20px",
    borderRadius: "12px",
    fontSize: "13px",
    fontWeight: 700,
    color: "#14b8a6",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
    transition: "0.2s"
  },
  uploadHint: { fontSize: "11px", color: "#94a3b8", fontWeight: 500 },
  imageRemoveFloat: {
    position: "absolute", top: 12, right: 12, background: "rgba(255,255,255,0.9)",
    border: "none", width: 28, height: 28, borderRadius: "50%", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
  },

  section: { display: "flex", flexDirection: "column", gap: 20 },
  gridTwo: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" },
  secHead: { display: "flex", alignItems: "center", gap: 12, marginBottom: 8 },
  secLabel: { fontSize: 12, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase" },
  secLine: { flex: 1, height: "1px", background: "#f1f5f9" },
  field: { display: "flex", flexDirection: "column", gap: 10 },
  label: { fontSize: 14, fontWeight: 800, color: "#475569", display: "flex", alignItems: "center", gap: 8 },
  input: { 
    width: "100%", padding: "16px", fontSize: 15, border: "1.5px solid #f1f5f9", 
    borderRadius: "16px", outline: "none", background: "#fff", color: '#1e293b', fontWeight: 500
  },
  select: { appearance: "none", cursor: "pointer", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 16px center" },
  textarea: { height: "120px", resize: "none", lineHeight: "1.6" },
  footer: { padding: "32px 48px", borderTop: "1px solid #f1f5f9", display: "flex", gap: "20px", background: "#fcfcfd" },
  cancelBtn: { flex: 1, height: "60px", borderRadius: 18, border: "1.5px solid #f1f5f9", background: "#fff", color: "#64748b", fontWeight: 800, cursor: "pointer" },
  saveBtn: { flex: 1.5, height: "60px", borderRadius: 18, border: "none", color: "#fff", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", cursor: "pointer", boxShadow: '0 12px 24px -8px rgba(20, 184, 166, 0.4)' },
};