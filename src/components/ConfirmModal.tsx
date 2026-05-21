import { AlertCircle, Trash2, X, Loader2 } from "lucide-react";
import type { ReactNode, CSSProperties } from "react";

interface Props {
  isOpen: boolean;
  isLoading?: boolean;
  title?: string;
  message?: string;
  icon?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "primary";
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  isLoading = false,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  icon,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  onConfirm,
  onCancel,
}: Props) {
  if (!isOpen) return null;

  const isDanger = variant === "danger";

  return (
    <div style={styles.overlay} onClick={isLoading ? undefined : onCancel}>
      <style>{`
        @keyframes modalScale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .modal-body { animation: modalScale 0.2s ease-out; }
        .btn-hover:not(:disabled):hover { opacity: 0.9; transform: translateY(-1px); }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>

      <div 
        className="modal-body" 
        style={styles.modal} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button - Disabled during loading */}
        <button 
          onClick={onCancel} 
          style={styles.closeIcon} 
          disabled={isLoading}
        >
          <X size={18} />
        </button>

        {/* Icon Header - Shows spinner if loading */}
        <div style={{
          ...styles.iconWrapper,
          backgroundColor: isDanger ? "#fff1f2" : "#eff6ff",
          color: isDanger ? "#e11d48" : "#2563eb"
        }}>
          {isLoading ? (
            <Loader2 size={24} className="animate-spin" />
          ) : (
            icon || (isDanger ? <Trash2 size={24} /> : <AlertCircle size={24} />)
          )}
        </div>

        {/* Text Content */}
        <h3 style={styles.title}>{title}</h3>
        <p style={styles.message}>{message}</p>

        {/* Action Buttons */}
        <div style={styles.buttons}>
          <button 
            style={styles.cancelBtn} 
            onClick={onCancel} 
            disabled={isLoading}
          >
            {cancelText}
          </button>

          <button 
            className="btn-hover"
            disabled={isLoading}
            style={{
              ...styles.confirmBtn,
              backgroundColor: isDanger ? "#0f172a" : "#2563eb",
              opacity: isLoading ? 0.8 : 1,
              cursor: isLoading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px"
            }} 
            onClick={onConfirm}
          >
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            {isLoading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    backdropFilter: "blur(6px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
  },

  modal: {
    position: "relative",
    background: "#ffffff",
    padding: "40px 32px 32px",
    borderRadius: "20px",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    border: "1px solid #f1f5f9",
  },

  closeIcon: {
    position: "absolute",
    top: "16px",
    right: "16px",
    background: "transparent",
    border: "none",
    color: "#94a3b8",
    cursor: "pointer",
    padding: "4px",
  },

  iconWrapper: {
    width: "60px",
    height: "60px",
    margin: "0 auto 20px",
    borderRadius: "16px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    margin: "0 0 12px 0",
    fontSize: "20px",
    fontWeight: 700,
    color: "#0f172a",
    letterSpacing: "-0.02em",
  },

  message: {
    fontSize: "14px",
    color: "#64748b",
    marginBottom: "32px",
    lineHeight: "1.6",
    padding: "0 10px",
  },

  buttons: {
    display: "flex",
    gap: "12px",
  },

  cancelBtn: {
    flex: 1,
    background: "#fff",
    border: "1px solid #e2e8f0",
    padding: "12px",
    borderRadius: "12px",
    fontSize: "14px",
    cursor: "pointer",
    fontWeight: 600,
    color: "#64748b",
    transition: "all 0.2s",
  },

  confirmBtn: {
    flex: 2,
    color: "#fff",
    border: "none",
    padding: "12px",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: 700,
    transition: "all 0.2s",
  },
};