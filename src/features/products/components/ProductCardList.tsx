import { useState } from "react";
import { 
  MoreVertical, 
  Edit3, 
  Trash2, 
  TrendingUp, 
  Tag,
  Clock,
  ClipboardList
} from "lucide-react";
import type { CSSProperties } from "react";
import type { Products } from "../types/Products";

type Props = {
  products: Products[];
  onDelete?: (id: string) => void;
  onUpdate?: (product: Products) => void;
  loading?: boolean;
};

export default function ProductCardList({ products, onDelete, onUpdate, loading }: Props) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const dermaPrimary = "#14b8a6";

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(value);

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-PH", { 
      month: "short", 
      day: "numeric",
      year: "numeric"
    });
  };

  const toggleMenu = (id: string) => {
    setActiveMenu((prev) => (prev === id ? null : id));
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <style>{globalStyles(dermaPrimary)}</style>
        <div style={styles.grid}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={styles.card}>
              <div className="shimmer" style={{ ...styles.imageWrapper, height: 180 }} />
              <div style={styles.cardBody}>
                <div className="shimmer" style={{ height: 12, width: "30%", marginBottom: 10, borderRadius: 4 }} />
                <div className="shimmer" style={{ height: 20, width: "70%", marginBottom: 12, borderRadius: 4 }} />
                <div className="shimmer" style={{ height: 40, width: "100%", borderRadius: 8 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{globalStyles(dermaPrimary)}</style>
      <div style={styles.grid}>
        {products.map((product) => (
          <div key={product.id} className="product-card" style={styles.card}>
            {/* IMAGE SECTION */}
            <div style={styles.imageWrapper}>
              <img 
                src={product.image_url || "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=400&auto=format&fit=crop"} 
                alt={product.product_name} 
                style={styles.image} 
                className="image"
              />
              <div className="glass-badge" style={styles.dateBadge}>
                <Clock size={12} color={dermaPrimary} />
                {formatDate(product.created_at)}
              </div>
              <div style={{ ...styles.usageBadge, backgroundColor: dermaPrimary }}>
                {product.usage}
              </div>
            </div>

            {/* BODY SECTION */}
            <div style={styles.cardBody}>
              <div style={styles.headerRow}>
                <div style={styles.info}>
                  <div style={{ ...styles.typeLabel, color: dermaPrimary }}>
                    <Tag size={10} strokeWidth={3} /> {product.type}
                  </div>
                  <h4 style={styles.name}>{product.product_name}</h4>
                </div>

                <div style={{ position: "relative" }}>
                  <button 
                    className="action-trigger"
                    style={styles.threeDots} 
                    onClick={() => toggleMenu(product.id.toString())}
                  >
                    <MoreVertical size={18} />
                  </button>

                  {activeMenu === product.id.toString() && (
                    <>
                      <div style={styles.menuOverlay} onClick={() => setActiveMenu(null)} />
                      <div className="dropdown-anim" style={styles.dropdown}>
                        <button 
                          className="menu-item" 
                          onClick={() => { onUpdate?.(product); setActiveMenu(null); }}
                        >
                          <Edit3 size={14} /> <span>Modify SKU</span>
                        </button>
                        <div style={styles.divider} />
                        <button 
                          className="menu-item danger" 
                          onClick={() => { onDelete?.(product.id.toString()); setActiveMenu(null); }}
                        >
                          <Trash2 size={14} /> <span>Delete Entry</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div style={styles.instructionContainer}>
                <ClipboardList size={13} style={{ marginTop: '2px', flexShrink: 0 }} />
                <p style={styles.instructionsText}>
                  {product.instructions || "Standard clinical application protocols apply for this product."}
                </p>
              </div>

              <div style={styles.footer}>
                <div style={styles.priceGroup}>
                  <span style={styles.priceLabel}>Professional Unit Cost</span>
                  <span style={{ ...styles.price, color: '#1e293b' }}>{formatCurrency(product.price)}</span>
                </div>
                <div style={styles.iconContainer}>
                  <TrendingUp size={16} color={dermaPrimary} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  container: { padding: "8px 0" },
  grid: { 
    display: "grid", 
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "28px" 
  },
  card: { 
    background: "#ffffff", 
    borderRadius: "24px", 
    overflow: "hidden", 
    border: "1px solid #f1f5f9",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.02)"
  },
  imageWrapper: { 
    position: "relative", 
    height: 180, 
    background: "#f8fafc",
    overflow: "hidden" 
  },
  image: { width: "100%", height: "100%", objectFit: "cover" },
  dateBadge: { 
    position: "absolute", 
    top: "14px", 
    left: "14px", 
    padding: "6px 12px", 
    borderRadius: "10px", 
    fontSize: "11px", 
    fontWeight: 700,
    display: "flex", 
    alignItems: "center", 
    gap: "6px" 
  },
  usageBadge: { 
    position: "absolute", 
    bottom: "14px", 
    right: "14px", 
    color: "#ffffff", 
    padding: "6px 12px", 
    borderRadius: "10px", 
    fontSize: "10px", 
    fontWeight: 800,
    letterSpacing: "0.04em",
    textTransform: 'uppercase'
  },
  cardBody: { padding: "24px" },
  headerRow: { display: "flex", justifyContent: "space-between", marginBottom: "16px", alignItems: "flex-start" },
  info: { flex: 1 },
  typeLabel: { 
    fontSize: "10px", 
    fontWeight: 800, 
    textTransform: "uppercase", 
    display: "flex", 
    alignItems: "center", 
    gap: "6px",
    marginBottom: "6px",
    letterSpacing: "0.08em"
  },
  name: { fontSize: "18px", fontWeight: 800, color: "#1e293b", margin: 0, letterSpacing: "-0.02em" },
  instructionContainer: {
    display: 'flex',
    gap: '8px',
    color: '#94a3b8',
    marginBottom: '24px',
    alignItems: 'flex-start'
  },
  instructionsText: { 
    fontSize: "13px", 
    color: "#64748b", 
    lineHeight: "1.6", 
    margin: 0, 
    height: "42px", 
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    fontWeight: 500
  },
  footer: { 
    paddingTop: "20px", 
    borderTop: "1px solid #f1f5f9", 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "flex-end" 
  },
  priceGroup: { display: "flex", flexDirection: "column", gap: "4px" },
  priceLabel: { fontSize: "10px", color: "#cbd5e1", fontWeight: 800, textTransform: "uppercase", letterSpacing: '0.05em' },
  price: { fontSize: "22px", fontWeight: 800 },
  iconContainer: { 
    padding: "10px", 
    borderRadius: "14px", 
    background: "#f0fdfa",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  threeDots: { 
    background: "#f8fafc", 
    border: "1px solid #f1f5f9", 
    cursor: "pointer", 
    padding: "8px", 
    borderRadius: "12px",
    color: "#94a3b8",
    display: "flex",
    transition: "all 0.2s ease"
  },
  dropdown: { 
    position: "absolute", 
    top: "calc(100% + 10px)", 
    right: 0, 
    background: "#ffffff", 
    borderRadius: "16px", 
    boxShadow: "0 12px 35px rgba(0,0,0,0.1)", 
    width: "180px", 
    padding: "8px", 
    zIndex: 100, 
    border: "1px solid #f1f5f9" 
  },
  menuOverlay: { position: "fixed", inset: 0, zIndex: 99 },
  divider: { height: "1px", background: "#f8fafc", margin: "6px 8px" }
};

const globalStyles = (primary: string) => `
  @keyframes shimmer {
    0% { background-position: -468px 0; }
    100% { background-position: 468px 0; }
  }
  @keyframes dropdown {
    from { opacity: 0; transform: translateY(-10px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  .shimmer {
    background: #f6f7f8;
    background-image: linear-gradient(to right, #f8fafc 0%, #f0fdfa 20%, #f8fafc 40%, #f8fafc 100%);
    background-repeat: no-repeat;
    background-size: 800px 100%;
    animation: shimmer 1.5s linear infinite forwards;
  }
  .product-card { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer; }
  .product-card:hover { 
    transform: translateY(-8px); 
    box-shadow: 0 20px 40px -10px rgba(20, 184, 166, 0.1); 
    border-color: ${primary}40; 
  }
  .product-card:hover .image { transform: scale(1.08); }
  .image { transition: transform 0.8s cubic-bezier(0.165, 0.84, 0.44, 1); }
  .glass-badge { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.5); color: #1e293b; }
  .action-trigger:hover { border-color: ${primary} !important; color: ${primary} !important; background: #fff !important; }
  .dropdown-anim { animation: dropdown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  .menu-item { 
    display: flex; 
    align-items: center; 
    gap: 12px; 
    width: 100%; 
    padding: 12px; 
    border: none; 
    background: none; 
    cursor: pointer; 
    font-size: 13px; 
    font-weight: 700;
    color: #64748b; 
    border-radius: 10px; 
    transition: all 0.2s ease;
  }
  .menu-item:hover { background: #f0fdfa; color: ${primary}; }
  .menu-item.danger:hover { background: #fff1f2; color: #e11d48; }
`;