import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { X, Save, Package, Loader2, Lightbulb, CheckCircle2, AlertCircle, Stethoscope, ChevronDown, Search } from "lucide-react";
import { supabase } from "../../../lib/supabase";

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
  accent: "#0D9488",
  primary: "#1E293B",
  secondary: "#6366F1",
  textMuted: "#64748B",
  border: "#E2E8F0",
  bgSubtle: "#F8FAFC",
  white: "#FFFFFF",
  severe: "#E11D48",
  moderate: "#D97706",
  success: "#10B981",
};

const SEVERITY_CONFIG: Record<Severity, { label: string; activeStyle: React.CSSProperties }> = {
  [SEVERITY.MILD]: {
    label: "Mild",
    activeStyle: { background: "#F0FDFA", borderColor: "#5EEAD4", color: "#0F766E", boxShadow: "0 0 0 2px #CCFBF1" },
  },
  [SEVERITY.MODERATE]: {
    label: "Moderate",
    activeStyle: { background: "#FFFBEB", borderColor: "#FCD34D", color: "#92400E", boxShadow: "0 0 0 2px #FEF3C7" },
  },
  [SEVERITY.SEVERE]: {
    label: "Severe",
    activeStyle: { background: "#FFF1F2", borderColor: "#FDA4AF", color: "#9F1239", boxShadow: "0 0 0 2px #FFE4E6" },
  },
};

export default function AddRecommendations({ initialData, onAdd, onCancel, isSaving }: Props) {
  const [data, setData] = useState({
    products: [] as Products[],
    conditions: [] as SkinCondition[],
    lifestyleTips: [] as LifestyleTip[],
  });

  const [form, setForm] = useState({
    condition: null as SkinCondition | null,
    severity: SEVERITY.MILD as Severity,
    treatment: "",
    precautions: "",
    products: [] as Products[],
    lifestyleTips: [] as LifestyleTip[],
  });

  const [isAnimating, setIsAnimating] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [isProductListOpen, setIsProductListOpen] = useState(false);
  const [tipSearch, setTipSearch] = useState("");
  const [isTipListOpen, setIsTipListOpen] = useState(false);
  const productDropdownRef = useRef<HTMLDivElement>(null);
  const tipDropdownRef = useRef<HTMLDivElement>(null);
  const isEditMode = !!initialData?.id;

  const getUniqueItems = <T extends { id: number | string }>(arr: T[]): T[] =>
    arr.filter((item, index, self) => index === self.findIndex((t) => t.id === item.id));

  const filteredProducts = useMemo(() =>
    data.products
      .filter(p =>
        p.product_name.toLowerCase().includes(productSearch.toLowerCase()) &&
        !form.products.some(s => s.id === p.id)
      )
      .slice(0, 10),
    [data.products, productSearch, form.products]
  );

  const filteredTips = useMemo(() =>
    data.lifestyleTips
      .filter(t =>
        t.title.toLowerCase().includes(tipSearch.toLowerCase()) &&
        !form.lifestyleTips.some(s => s.id === t.id)
      )
      .slice(0, 10),
    [data.lifestyleTips, tipSearch, form.lifestyleTips]
  );

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
        supabase.from("tbl_condition").select("*").order("name"),
        supabase.from("tbl_products").select("*").order("product_name"),
        supabase.from("tbl_lifestyle_tips").select("*").order("title"),
      ]);
      setData({
        conditions: (cond.data as SkinCondition[]) || [],
        products: (prod.data as Products[]) || [],
        lifestyleTips: (tips.data as LifestyleTip[]) || [],
      });
    };

    fetchData();

    const handleClickOutside = (e: MouseEvent) => {
      if (productDropdownRef.current && !productDropdownRef.current.contains(e.target as Node))
        setIsProductListOpen(false);
      if (tipDropdownRef.current && !tipDropdownRef.current.contains(e.target as Node))
        setIsTipListOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClose = useCallback(() => {
    if (isSaving) return;
    setIsAnimating(false);
    setTimeout(onCancel, 300);
  }, [onCancel, isSaving]);

  const updateField = (field: keyof typeof form, value: any) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const addProduct = (product: Products) => {
    if (!form.products.some(p => p.id === product.id))
      updateField("products", [...form.products, product]);
    setProductSearch("");
    setIsProductListOpen(false);
  };

  const addTip = (tip: LifestyleTip) => {
    if (!form.lifestyleTips.some(t => t.id === tip.id))
      updateField("lifestyleTips", [...form.lifestyleTips, tip]);
    setTipSearch("");
    setIsTipListOpen(false);
  };

  const isFormValid = useMemo(() =>
    !!form.condition && form.treatment.trim().length > 5,
    [form.condition, form.treatment]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isSaving || !form.condition) return;

    // Explicitly carry id and createdAt from initialData
    const finalPayload: Recommendation = {
      id: initialData?.id,           // undefined for new, number for edit
      createdAt: initialData?.createdAt,
      condition: form.condition,
      severity: form.severity,
      treatment: form.treatment,
      precautions: form.precautions,
      products: form.products,
      lifestyleTips: form.lifestyleTips,
    };

    console.log("📦 Final payload:", finalPayload);

    try {
      await onAdd(finalPayload);
      handleClose();
    } catch (error) {
      alert("Failed to save protocol. Check console for details.");
      console.error("Submit error:", error);
    }
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
              <Stethoscope size={20} color="white" strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <h2 style={styles.title}>{isEditMode ? "Update Clinical Protocol" : "New Treatment Protocol"}</h2>
                <span style={styles.clinicalTag}>Verified Admin</span>
              </div>
              <p style={styles.idLabel}>Clinical Decision Support System • v2.4.0</p>
            </div>
          </div>
          <button onClick={handleClose} disabled={isSaving} style={styles.closeBtn}>
            <X size={18} />
          </button>
        </header>

        <form id="protocol-form" onSubmit={handleSubmit} className="custom-scrollbar" style={styles.body}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionTitle}>Primary Assessment</span>
          </div>

          <div style={styles.formGrid}>
            <div style={styles.field}>
              <label style={styles.label}>Medical Condition</label>
              <div style={{ position: "relative" }}>
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
                  <option value="">Select Target Condition...</option>
                  {data.conditions.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <ChevronDown size={16} style={styles.selectIcon} />
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Classification Level</label>
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
            <label style={styles.label}>Therapeutic Management Strategy</label>
            <textarea
              disabled={isSaving}
              style={{ ...styles.input, ...styles.textarea }}
              placeholder="Detail the clinical steps and diagnostic considerations..."
              value={form.treatment}
              onChange={(e) => updateField("treatment", e.target.value)}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Precautions & Risk Mitigation</label>
            <textarea
              disabled={isSaving}
              style={{ ...styles.input, ...styles.textarea, height: 80, background: "#FFFBFB", borderColor: "#FECACA" }}
              placeholder="Contraindications, side effects, or warning signs..."
              value={form.precautions}
              onChange={(e) => updateField("precautions", e.target.value)}
            />
          </div>

          <div style={styles.sectionHeader}>
            <span style={styles.sectionTitle}>Ancillary Care & Supplements</span>
          </div>

          <div style={styles.adjunctGrid}>
            {/* PRODUCTS */}
            <div style={styles.field} ref={productDropdownRef}>
              <label style={styles.label}>Prescribed Formulations</label>
              <div style={{ position: "relative" }}>
                <div style={styles.searchBox}>
                  <Search size={16} style={styles.searchIcon} />
                  <input
                    type="text"
                    disabled={isSaving}
                    placeholder="Search inventory..."
                    style={{ ...styles.input, paddingLeft: "40px" }}
                    value={productSearch}
                    onFocus={() => setIsProductListOpen(true)}
                    onChange={(e) => setProductSearch(e.target.value)}
                  />
                </div>
                {isProductListOpen && (
                  <div style={styles.dropdownResults}>
                    {filteredProducts.map(p => (
                      <div key={p.id} style={styles.resultItem} onClick={() => addProduct(p)}>
                        <span style={styles.resultText}>{p.product_name}</span>
                        <span style={styles.resultTag}>Product</span>
                      </div>
                    ))}
                    {filteredProducts.length === 0 && <div style={styles.noResults}>No products found</div>}
                  </div>
                )}
              </div>
              <div style={styles.scrollList}>
                {form.products.map((p) => (
                  <div key={`prod-${p.id}`} style={styles.productCard}>
                    <div style={styles.imageBox}>
                      {p.image_url
                        ? <img src={p.image_url} alt="" style={styles.thumb} />
                        : <Package size={14} color={theme.textMuted} />}
                    </div>
                    <div style={styles.itemInfo}>
                      <span style={styles.itemName}>{p.product_name}</span>
                      <span style={{ ...styles.itemType, color: theme.accent }}>{p.type || "Treatment"}</span>
                    </div>
                    <button
                      type="button"
                      style={styles.itemRemove}
                      onClick={() => updateField("products", form.products.filter(x => x.id !== p.id))}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* LIFESTYLE TIPS */}
            <div style={styles.field} ref={tipDropdownRef}>
              <label style={styles.label}>Standardized Patient Advice</label>
              <div style={{ position: "relative" }}>
                <div style={styles.searchBox}>
                  <Search size={16} style={styles.searchIcon} />
                  <input
                    type="text"
                    disabled={isSaving}
                    placeholder="Search advice..."
                    style={{ ...styles.input, paddingLeft: "40px" }}
                    value={tipSearch}
                    onFocus={() => setIsTipListOpen(true)}
                    onChange={(e) => setTipSearch(e.target.value)}
                  />
                </div>
                {isTipListOpen && (
                  <div style={styles.dropdownResults}>
                    {filteredTips.map(t => (
                      <div key={t.id} style={styles.resultItem} onClick={() => addTip(t)}>
                        <span style={styles.resultText}>{t.title}</span>
                        <span style={{ ...styles.resultTag, color: theme.secondary }}>Advice</span>
                      </div>
                    ))}
                    {filteredTips.length === 0 && <div style={styles.noResults}>No advice found</div>}
                  </div>
                )}
              </div>
              <div style={styles.scrollList}>
                {form.lifestyleTips.map((t) => (
                  <div key={`life-${t.id}`} style={styles.lifestyleCard}>
                    <div style={styles.iconBox}><Lightbulb size={14} color={theme.accent} /></div>
                    <div style={styles.itemInfo}>
                      <span style={styles.itemName}>{t.title}</span>
                    </div>
                    <button
                      type="button"
                      style={styles.itemRemove}
                      onClick={() => updateField("lifestyleTips", form.lifestyleTips.filter(x => x.id !== t.id))}
                    >
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
            {isFormValid
              ? <div style={{ ...styles.validStatus, color: theme.success }}><CheckCircle2 size={16} /> Protocol Validated</div>
              : <div style={styles.pendingStatus}><AlertCircle size={16} /> Complete Required Clinical Fields</div>}
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={handleClose} disabled={isSaving} style={styles.cancelBtn}>Discard</button>
            <button
              type="submit"
              form="protocol-form"
              disabled={!isFormValid || isSaving}
              style={{ ...styles.saveBtn, opacity: (isFormValid && !isSaving) ? 1 : 0.6 }}
            >
              {isSaving ? <Loader2 size={16} className="spin" /> : <Save size={16} />}
              {isSaving ? "Authorizing..." : isEditMode ? "Save Changes" : "Publish Protocol"}
            </button>
          </div>
        </footer>
        
      </div>

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  overlay: { position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)", zIndex: 9999, display: "flex", justifyContent: "flex-end", transition: "opacity 0.3s ease" },
  drawer: { width: "min(900px, 100vw)", height: "100vh", background: theme.white, display: "flex", flexDirection: "column", boxShadow: "-20px 0 25px -5px rgba(0,0,0,0.1), -10px 0 10px -5px rgba(0,0,0,0.04)", transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)" },
  header: { padding: "24px 40px", borderBottom: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff" },
  headerLeft: { display: "flex", alignItems: "center", gap: 20 },
  badge: { width: 44, height: 44, borderRadius: 12, background: theme.primary, display: "flex", alignItems: "center", justifyContent: "center" },
  title: { fontSize: "20px", fontWeight: 700, margin: 0, letterSpacing: "-0.02em", color: theme.primary },
  clinicalTag: { padding: "4px 10px", background: "#F1F5F9", borderRadius: "20px", fontSize: "11px", fontWeight: 600, color: "#475569" },
  idLabel: { fontSize: "12px", fontWeight: 500, color: "#94A3B8", marginTop: 2 },
  closeBtn: { width: 36, height: 36, border: "none", background: "transparent", borderRadius: "50%", cursor: "pointer", color: theme.textMuted, display: "flex", alignItems: "center", justifyContent: "center" },
  body: { flex: 1, overflowY: "auto", padding: "40px", display: "flex", flexDirection: "column", gap: 28 },
  sectionHeader: { borderBottom: `1px solid ${theme.border}`, paddingBottom: "8px", marginBottom: "4px" },
  sectionTitle: { fontSize: "11px", fontWeight: 800, color: theme.accent, textTransform: "uppercase", letterSpacing: "0.05em" },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 },
  field: { display: "flex", flexDirection: "column", gap: 10 },
  label: { fontSize: "11px", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.025em" },
  input: { padding: "12px 16px", fontSize: "14px", fontWeight: 500, border: `1.5px solid ${theme.border}`, borderRadius: "10px", outline: "none", background: "#fff", color: theme.primary, transition: "all 0.2s", width: "100%" },
  select: { appearance: "none", cursor: "pointer", paddingRight: "40px" },
  selectIcon: { position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: theme.textMuted },
  textarea: { minHeight: 120, resize: "vertical", lineHeight: 1.6 },
  severityRow: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 },
  severityBtn: { padding: "12px", fontSize: "12px", fontWeight: 600, border: `1.5px solid ${theme.border}`, borderRadius: "10px", background: "#fff", color: theme.textMuted, cursor: "pointer", transition: "all 0.2s" },
  adjunctGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 },
  searchBox: { position: "relative", display: "flex", alignItems: "center" },
  searchIcon: { position: "absolute", left: 14, color: theme.textMuted },
  dropdownResults: { position: "absolute", top: "100%", left: 0, right: 0, background: "#fff", border: `1px solid ${theme.border}`, borderRadius: "10px", marginTop: "4px", zIndex: 100, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", maxHeight: "200px", overflowY: "auto" },
  resultItem: { padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", borderBottom: "1px solid #f1f5f9" },
  resultText: { fontSize: "13px", fontWeight: 600, color: theme.primary },
  resultTag: { fontSize: "10px", fontWeight: 700, color: theme.accent, textTransform: "uppercase" },
  noResults: { padding: "12px", textAlign: "center", fontSize: "12px", color: theme.textMuted },
  scrollList: { display: "flex", flexDirection: "column", gap: 10, marginTop: 8 },
  productCard: { display: "flex", alignItems: "center", gap: 14, padding: "12px", background: "#fff", border: `1.5px solid ${theme.border}`, borderRadius: "12px", position: "relative" },
  lifestyleCard: { display: "flex", alignItems: "center", gap: 14, padding: "12px", background: "#F8FAFC", border: `1.5px solid ${theme.border}`, borderRadius: "12px", position: "relative" },
  imageBox: { width: 40, height: 40, borderRadius: "8px", background: "#F1F5F9", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" },
  iconBox: { width: 36, height: 36, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", background: "#E0F2F1" },
  thumb: { width: "100%", height: "100%", objectFit: "cover" },
  itemInfo: { flex: 1, minWidth: 0 },
  itemName: { fontSize: "13px", fontWeight: 600, color: theme.primary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block" },
  itemType: { fontSize: "10px", fontWeight: 700, textTransform: "uppercase", marginTop: 1 },
  itemRemove: { background: "#fff", border: `1px solid ${theme.border}`, borderRadius: "50%", width: 22, height: 22, cursor: "pointer", color: "#94A3B8", display: "flex", alignItems: "center", justifyContent: "center", position: "absolute", right: -8, top: -8, boxShadow: "0 2px 4px rgba(0,0,0,0.05)" },
  footer: { padding: "24px 40px", borderTop: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff" },
  statusBox: { flex: 1 },
  validStatus: { fontSize: "13px", fontWeight: 600, display: "flex", alignItems: "center", gap: 8 },
  pendingStatus: { color: theme.textMuted, fontSize: "13px", fontWeight: 600, display: "flex", alignItems: "center", gap: 8 },
  cancelBtn: { padding: "10px 20px", fontSize: "14px", fontWeight: 600, color: theme.textMuted, background: "none", border: "none", cursor: "pointer" },
  saveBtn: { padding: "12px 28px", fontSize: "14px", fontWeight: 600, color: "#fff", border: "none", borderRadius: "10px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", background: theme.primary, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" },
};