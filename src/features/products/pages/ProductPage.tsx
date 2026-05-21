import { useState, useEffect, useMemo, useRef } from "react";
import type { CSSProperties } from "react";
import { Plus, ChevronDown, Check, Filter, Package } from "lucide-react";

import SearchContainer from "../../../components/SearchContainer";
import useProducts from "../hooks/useProducts";
import TitleSize from "../../../styles/TitleSize";

import ProductCardList from "../components/ProductCardList";
import type { Products } from "../types/Products";
import AddProductDrawer from "../components/AddProductModal";
import ConfirmModal from "../../../components/ConfirmModal";

export default function ProductPage() {
  const { products = [], addProduct, deleteProduct, updateProduct } = useProducts();
  
  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Products | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false); 

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const dermaPrimary = "#14b8a6";

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const brands = useMemo(() => {
    const uniqueBrands = Array.from(new Set(products.map((p) => p.type))).filter(Boolean);
    return ["All", ...uniqueBrands.sort()];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const productName = (product.product_name || "").toLowerCase();
      const productType = (product.type || "").toLowerCase();
      const searchTerm = search.toLowerCase();

      const matchesSearch = productName.includes(searchTerm) || productType.includes(searchTerm);
      const matchesBrand = selectedBrand === "All" || product.type === selectedBrand;
      return matchesSearch && matchesBrand;
    });
  }, [products, search, selectedBrand]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (product: Products) => {
    setEditingProduct(product);
    setIsDrawerOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteId) {
      setIsDeleting(true);
      try {
        await deleteProduct(deleteId);
        setDeleteId(null);
      } catch (error) {
        console.error("Clinical System Error: Delete failed", error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (loading) return (
    <div style={styles.center}>
      <style>{`
        .animate-spin { animation: spin 2s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
      <Package className="animate-spin" color={dermaPrimary} size={42} />
    </div>
  );

  return (
    <div style={styles.container}>
      <style>{`
        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; gap: 16px; }
        .toolbar-container { display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-bottom: 32px; }
        
        @media (max-width: 768px) {
          .page-header { flex-direction: column; align-items: flex-start; }
          .add-btn { width: 100%; justify-content: center; }
          .toolbar-container { flex-direction: column; align-items: stretch; }
          .search-wrapper { max-width: none !important; width: 100%; }
        }

        .add-btn { 
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
          background: ${dermaPrimary}; 
          border-radius: 14px; 
          cursor: pointer; 
          color: white; 
          border: none; 
          padding: 12px 24px; 
          font-weight: 700; 
          font-size: 14px; 
          display: flex; 
          align-items: center; 
          gap: 10px;
          box-shadow: 0 4px 14px rgba(20, 184, 166, 0.2);
        }
        .add-btn:hover { background: #0d9488; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(20, 184, 166, 0.3); }
        
        .dropdown-trigger { 
          transition: all 0.2s ease; 
          background: white; 
          border: 1px solid #f1f5f9; 
          border-radius: 14px; 
          cursor: pointer; 
          display: flex; 
          align-items: center; 
          gap: 12px; 
          color: #334155; 
          padding: 12px 20px; 
          min-width: 220px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.02);
        }
        .dropdown-trigger:hover { border-color: ${dermaPrimary}; background: #fcfcfd; }
        
        .dropdown-menu { 
          position: absolute; 
          top: calc(100% + 8px); 
          left: 0; 
          width: 240px; 
          background: white; 
          border: 1px solid #f1f5f9; 
          border-radius: 16px; 
          box-shadow: 0 15px 35px -5px rgba(0,0,0,0.08); 
          z-index: 50; 
          overflow: hidden; 
          animation: slideIn 0.25s ease-out; 
          padding: 8px;
        }
        
        .dropdown-item { 
          width: 100%; 
          padding: 10px 14px; 
          border: none; 
          background: none; 
          text-align: left; 
          cursor: pointer; 
          display: flex; 
          align-items: center; 
          justify-content: space-between; 
          font-size: 13px; 
          font-weight: 600;
          color: #64748b; 
          border-radius: 10px;
          transition: all 0.15s ease; 
        }
        .dropdown-item:hover { background: #f0fdfa; color: ${dermaPrimary}; }
        .dropdown-item.selected { background: ${dermaPrimary}; color: white; }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="page-header">
        <TitleSize 
          title="Skincare Dispensary" 
          subtitle="Manage professional dermatological catalog and clinical supplies." 
        />
        <button className="add-btn" onClick={handleOpenAdd}>
          <Plus size={20} strokeWidth={3} /> Create Product
        </button>
      </div>

      <div className="toolbar-container">
        <div className="search-wrapper" style={styles.searchWrapper}>
          <SearchContainer 
            value={search} 
            onChange={setSearch} 
            placeholder="Search by name, brand, or formula..." 
          />
        </div>

        <div className="filter-actions" style={styles.filterActions}>
          <div style={{ position: "relative" }} ref={dropdownRef}>
            <button 
              className="dropdown-trigger"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <Filter size={16} color={dermaPrimary} />
              <div style={{ flex: 1, textAlign: 'left' }}>
                <span style={styles.label}>Brand:</span>
                <span style={styles.value}> {selectedBrand}</span>
              </div>
              <ChevronDown size={16} style={{ 
                transform: isDropdownOpen ? 'rotate(180deg)' : 'none', 
                transition: '0.3s ease',
                color: '#94a3b8' 
              }} />
            </button>

            {isDropdownOpen && (
              <div className="dropdown-menu">
                <div style={styles.dropdownHeader}>Available Formulas</div>
                {brands.map((brand) => (
                  <button
                    key={brand}
                    className={`dropdown-item ${selectedBrand === brand ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedBrand(brand);
                      setIsDropdownOpen(false);
                    }}
                  >
                    {brand}
                    {selectedBrand === brand && <Check size={14} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={styles.resultBadge}>
            <span style={styles.resultCount}>{filteredProducts.length}</span>
            <span style={styles.resultText}>SKUs</span>
          </div>
        </div>
      </div>

      <div style={styles.contentWrapper}>
        <ProductCardList 
          products={filteredProducts} 
          onDelete={(id) => setDeleteId(id)} 
          onUpdate={handleOpenEdit} 
          loading={loading} 
        />
      </div>

      <AddProductDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        initialData={editingProduct}
        onSave={editingProduct ? updateProduct : addProduct} 
      />

      <ConfirmModal 
        isOpen={!!deleteId}
        isLoading={isDeleting}
        title="Remove SKU from Inventory"
        message="Are you sure you want to archive this product? This will remove the clinical record from your active catalog."
        confirmText="Confirm Removal"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  container: { minHeight: "100vh", padding: "0px", background: "transparent" },
  center: { display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" },
  searchWrapper: { flex: 1, minWidth: "320px", maxWidth: "480px" },
  filterActions: { display: "flex", alignItems: "center", gap: "16px" },
  label: { color: "#94a3b8", fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' },
  value: { color: "#1e293b", fontWeight: 700, fontSize: '13px' },
  dropdownHeader: { padding: "8px 14px", fontSize: "10px", fontWeight: 800, color: "#cbd5e1", textTransform: "uppercase", letterSpacing: "0.1em" },
  resultBadge: { 
    display: "flex", 
    alignItems: "center", 
    gap: "8px", 
    padding: "12px 20px", 
    background: "#fff", 
    borderRadius: "14px", 
    border: "1px solid #f1f5f9",
    boxShadow: "0 1px 2px rgba(0,0,0,0.02)"
  },
  resultCount: { fontWeight: 800, color: "#14b8a6", fontSize: "14px" },
  resultText: { color: "#94a3b8", fontSize: "11px", fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' },
  contentWrapper: { marginTop: "8px" },
};