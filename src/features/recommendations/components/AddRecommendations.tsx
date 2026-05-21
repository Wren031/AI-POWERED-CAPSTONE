import React, { useEffect, useState, useMemo, useCallback } from "react";
import { X, Save, Package, Loader2, Lightbulb, CheckCircle2, AlertCircle, Stethoscope } from "lucide-react";
import { supabase } from "../../../lib/supabase";

// Types
import type { Recommendation } from "../types/Recommendation";
import type { Severity } from "../types/Severity";
import { SEVERITY } from "../types/Severity";
import type { SkinCondition } from "../../condition/type/SkinCondition";
import type { Products } from "../../products/types/Products";
import type { LifestyleTip } from "../../lifestyle/types/Lifestyle";

interface Props {
  initialData?: Recommendation | null;
  onAdd: (rec: Recommendation) => Promise<void>;
  onCancel: () => void;
  isSaving?: boolean;
}

const theme = {
  accent: "#00A3AD",
  primary: "#0F172A",
  textMuted: "#64748B",
  border: "#E2E8F0",
  bgSubtle: "#F8FAFC",
  white: "#FFFFFF",
  severe: "#EF4444",
  moderate: "#F59E0B",
};

const SEVERITY_CONFIG: Record<Severity, { label: string; activeStyle: React.CSSProperties }> = {
  [SEVERITY.MILD]: {
    label: "Mild",
    activeStyle: { background: "#F0FDFA", borderColor: theme.accent, color: theme.accent },
  },
  [SEVERITY.MODERATE]: {
    label: "Moderate",
    activeStyle: { background: "#FFFBEB", borderColor: theme.moderate, color: "#92400E" },
  },
  [SEVERITY.SEVERE]: {
    label: "Severe",
    activeStyle: { background: "#FEF2F2", borderColor: theme.severe, color: "#991B1B" },
  },
};

export default function AddRecommendations({ initialData, onAdd, onCancel, isSaving }: Props) {
  const [data, setData] = useState({
    products: [] as Products[],
    conditions: [] as SkinCondition[],
    lifestyleTips: [] as LifestyleTip[],
  });

  const [isAnimating, setIsAnimating] = useState(false);
  const isEditMode = !!initialData;

  const [form, setForm] = useState({
    condition: null as SkinCondition | null,
    severity: SEVERITY.MILD as Severity,
    treatment: "",
    precautions: "",
    products: [] as Products[],
    lifestyleTips: [] as LifestyleTip[],
  });

  const getUniqueItems = <T extends { id: number | string }>(arr: T[]): T[] => {
    return arr.filter((item, index, self) => 
      index === self.findIndex((t) => t.id === item.id)
    );
  };

  useEffect(() => {
    if (initialData) {
      setForm({
        condition: initialData.condition,
        severity: initialData.severity,
        treatment: initialData.treatment || "",
        precautions: initialData.precautions || "",
        products: getUniqueItems(initialData.products || []),
        lifestyleTips: getUniqueItems(initialData.lifestyleTips || []),
      });
    }
  }, [initialData]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsAnimating(true));
    const fetchData = async () => {
      const [cond, prod, tips] = await Promise.all([
        supabase.from("tbl_condition").select("*").order('name'),
        supabase.from("tbl_products").select("*").order('product_name'),
        supabase.from("tbl_lifestyle_tips").select("*").order('title'),
      ]);
      setData({
        conditions: (cond.data as SkinCondition[]) || [],
        products: (prod.data as Products[]) || [],
        lifestyleTips: (tips.data as LifestyleTip[]) || [],
      });
    };
    fetchData();
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleClose = useCallback(() => {
    if (isSaving) return;
    setIsAnimating(false);
    setTimeout(onCancel, 300);
  }, [onCancel, isSaving]);

  const updateField = (field: keyof typeof form, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = useMemo(() => (
    !!form.condition && form.treatment.trim().length > 5
  ), [form.condition, form.treatment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isSaving || !form.condition) return;

    const finalPayload: Recommendation = {
      ...initialData, 
      id: initialData?.id ?? Date.now(), 
      condition: form.condition,
      severity: form.severity,
      treatment: form.treatment,
      precautions: form.precautions,
      products: form.products,
      lifestyleTips: form.lifestyleTips,
      createdAt: initialData?.createdAt ?? new Date().toISOString(),
    } as any;

    await onAdd(finalPayload);
    handleClose();
  };

  return (
    <div style={{ ...styles.overlay, opacity: isAnimating ? 1 : 0 }} onClick={handleClose}>
      <div 
        style={{ ...styles.drawer, transform: isAnimating ? "translateX(0)" : "translateX(100%)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <header style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.badge}>
              <Stethoscope size={22} color="white" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={styles.title}>{isEditMode ? "Update Clinical Protocol" : "New Treatment Protocol"}</h2>
                <span style={styles.clinicalTag}>Registry Auth</span>
              </div>
              <p style={styles.idLabel}>Standardized Care Framework v2.4</p>
            </div>
          </div>
          <button onClick={handleClose} disabled={isSaving} style={styles.closeBtn}><X size={18} /></button>
        </header>

        <form id="protocol-form" onSubmit={handleSubmit} className="custom-scrollbar" style={styles.body}>
          <div style={styles.formGrid}>
            <div style={styles.field}>
              <label style={styles.label}>Target Condition</label>
              <select
                disabled={isSaving}
                style={{ ...styles.input, ...styles.select }}
                value={form.condition?.id ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
                  if (!val) return;
                  const found = data.conditions.find(c => c.id === Number(val));
                  updateField("condition", found || null);
                }}
              >
                <option value="">Select condition...</option>
                {data.conditions.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Clinical Severity Level</label>
              <div style={styles.severityRow}>
                {(Object.values(SEVERITY) as Severity[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    disabled={isSaving}
                    onClick={() => updateField("severity", s)}
                    style={{ ...styles.severityBtn, ...(form.severity === s ? SEVERITY_CONFIG[s].activeStyle : {}) }}
                  >
                    {SEVERITY_CONFIG[s].label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Therapeutic Instructions</label>
            <textarea
              disabled={isSaving}
              style={{ ...styles.input, ...styles.textarea }}
              placeholder="Detail the therapeutic management strategy..."
              value={form.treatment}
              onChange={(e) => updateField("treatment", e.target.value)}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Contraindications & Warnings</label>
            <textarea
              disabled={isSaving}
              style={{ ...styles.input, ...styles.textarea, height: 80, borderLeft: `4px solid ${theme.severe}`, background: '#FFF1F2' }}
              placeholder="List precautions or lifestyle restrictions..."
              value={form.precautions}
              onChange={(e) => updateField("precautions", e.target.value)}
            />
          </div>

          <div style={styles.adjunctGrid}>
            <div style={styles.field}>
              <label style={styles.label}>Prescribed Products</label>
              <select
                disabled={isSaving}
                style={{ ...styles.input, ...styles.select }}
                value="" 
                onChange={(e) => {
                  const val = e.target.value;
                  if (!val) return; 
                  const found = data.products.find(p => String(p.id) === val);
                  if (found && !form.products.some(p => p.id === found.id)) {
                    updateField("products", [...form.products, found]);
                  }
                }}
              >
                <option value="">Link product...</option>
                {data.products.map(p => <option key={p.id} value={p.id}>{p.product_name}</option>)}
              </select>
              <div style={styles.scrollList}>
                {form.products.map((p) => (
                  <div key={`prod-${p.id}`} style={styles.productCard}>
                    <div style={styles.imageBox}>
                       {p.image_url ? <img src={p.image_url} alt="" style={styles.thumb} /> : <Package size={14} color={theme.textMuted} />}
                    </div>
                    <div style={styles.itemInfo}>
                      <span style={styles.itemName}>{p.product_name}</span>
                      <span style={{...styles.itemType, color: theme.accent}}>{p.type || 'Treatment'}</span>
                    </div>
                    <button type="button" style={styles.itemRemove} onClick={() => updateField("products", form.products.filter(x => x.id !== p.id))}>
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Lifestyle Advice</label>
              <select
                disabled={isSaving}
                style={{ ...styles.input, ...styles.select }}
                value="" 
                onChange={(e) => {
                  const val = e.target.value;
                  if (!val) return; 
                  const found = data.lifestyleTips.find(t => String(t.id) === val);
                  if (found && !form.lifestyleTips.some(t => t.id === found.id)) {
                    updateField("lifestyleTips", [...form.lifestyleTips, found]);
                  }
                }}
              >
                <option value="">Link advice...</option>
                {data.lifestyleTips.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
              </select>
              <div style={styles.scrollList}>
                {form.lifestyleTips.map((t) => (
                  <div key={`life-${t.id}`} style={styles.lifestyleCard}>
                    <div style={styles.iconBox}><Lightbulb size={14} color={theme.accent} /></div>
                    <div style={styles.itemInfo}>
                      <span style={styles.itemName}>{t.title}</span>
                    </div>
                    <button type="button" style={styles.itemRemove} onClick={() => updateField("lifestyleTips", form.lifestyleTips.filter(x => x.id !== t.id))}>
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </form>

        <footer style={styles.footer}>
          <div style={styles.statusBox}>
            {isFormValid ? (
              <div style={{...styles.validStatus, color: theme.accent}}><CheckCircle2 size={16} /> Protocol Validated</div>
            ) : (
              <div style={styles.pendingStatus}><AlertCircle size={16} /> Required Fields Incomplete</div>
            )}
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={handleClose} disabled={isSaving} style={styles.cancelBtn}>Cancel</button>
            <button
              type="submit"
              form="protocol-form"
              disabled={!isFormValid || isSaving}
              style={{ ...styles.saveBtn, opacity: (isFormValid && !isSaving) ? 1 : 0.6 }}
            >
              {isSaving ? <Loader2 size={16} className="spin" /> : <Save size={16} />}
              {isSaving ? "Authorizing..." : isEditMode ? "Update Protocol" : "Authorize Entry"}
            </button>
          </div>
        </footer>
      </div>

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  overlay: { position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(2px)", zIndex: 9999, display: "flex", justifyContent: "flex-end", transition: "opacity 0.3s ease" },
  drawer: { width: "min(650px, 100vw)", height: "100vh", background: theme.white, display: "flex", flexDirection: "column", borderLeft: `1px solid ${theme.border}`, transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)" },
  header: { padding: "24px 32px", borderBottom: `1px solid #F1F5F9`, display: "flex", alignItems: "center", justifyContent: "space-between" },
  headerLeft: { display: "flex", alignItems: "center", gap: 16 },
  badge: { width: 40, height: 40, borderRadius: 12, background: theme.accent, display: "flex", alignItems: "center", justifyContent: "center" },
  title: { fontSize: "18px", fontWeight: 700, margin: 0, letterSpacing: "-0.01em" },
  clinicalTag: { padding: "2px 8px", background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: "6px", fontSize: "10px", fontWeight: 700, color: "#64748b", textTransform: 'uppercase' },
  idLabel: { fontSize: "11px", fontWeight: 700, color: "#94A3B8", marginTop: 4 },
  closeBtn: { width: 32, height: 32, border: `1px solid #F1F5F9`, background: "#fff", borderRadius: 10, cursor: "pointer", color: theme.textMuted, display: "flex", alignItems: "center", justifyContent: "center" },
  body: { flex: 1, overflowY: "auto", padding: "32px", display: "flex", flexDirection: "column", gap: 32 },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 },
  field: { display: "flex", flexDirection: "column", gap: 8 },
  label: { fontSize: "10px", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: '0.1em' },
  input: { padding: "12px", fontSize: "13px", fontWeight: 600, border: `1px solid ${theme.border}`, borderRadius: 12, outline: "none", background: theme.bgSubtle, color: theme.primary },
  select: { appearance: "none", background: `${theme.bgSubtle} url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='3'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E") no-repeat right 12px center` },
  textarea: { height: 100, resize: "none", lineHeight: 1.6, background: "#fff" },
  severityRow: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 },
  severityBtn: { padding: "10px", fontSize: "11px", fontWeight: 700, border: `1px solid ${theme.border}`, borderRadius: 10, background: "#fff", color: theme.textMuted, cursor: "pointer" },
  adjunctGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, paddingTop: 24, borderTop: `1px solid #F1F5F9` },
  scrollList: { display: "flex", flexDirection: "column", gap: 8, marginTop: 12 },
  productCard: { display: "flex", alignItems: "center", gap: 12, padding: "12px", background: "#fff", border: `1px solid ${theme.border}`, borderRadius: 16, position: "relative" },
  lifestyleCard: { display: "flex", alignItems: "center", gap: 12, padding: "12px", background: theme.bgSubtle, border: `1px solid ${theme.border}`, borderRadius: 16, position: "relative" },
  imageBox: { width: 36, height: 36, borderRadius: 8, background: theme.bgSubtle, border: `1px solid ${theme.border}`, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" },
  iconBox: { width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: '#F0FDFA' },
  thumb: { width: "100%", height: "100%", objectFit: "cover" },
  itemInfo: { flex: 1, minWidth: 0 },
  itemName: { fontSize: "13px", fontWeight: 700, color: theme.primary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block" },
  itemType: { fontSize: "9px", fontWeight: 800, textTransform: 'uppercase', marginTop: 2 },
  itemRemove: { background: "#fff", border: `1px solid ${theme.border}`, borderRadius: "50%", width: 20, height: 20, cursor: "pointer", color: theme.textMuted, display: "flex", alignItems: "center", justifyContent: "center", position: "absolute", right: -6, top: -6 },
  footer: { padding: "20px 32px", borderTop: `1px solid #F1F5F9`, display: "flex", alignItems: "center", justifyContent: "space-between", background: "#F8FAFC" },
  statusBox: { flex: 1 },
  validStatus: { fontSize: "12px", fontWeight: 700, display: "flex", alignItems: "center", gap: 8 },
  pendingStatus: { color: theme.textMuted, fontSize: "12px", fontWeight: 700, display: "flex", alignItems: "center", gap: 8 },
  cancelBtn: { padding: "10px 20px", fontSize: "13px", fontWeight: 700, color: theme.textMuted, background: "none", border: "none", cursor: "pointer" },
  saveBtn: { padding: "12px 24px", fontSize: "13px", fontWeight: 700, color: "#fff", border: "none", borderRadius: 12, display: "flex", alignItems: "center", gap: 10, cursor: "pointer", background: theme.primary },
};