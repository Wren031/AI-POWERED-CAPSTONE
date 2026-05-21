import type { CSSProperties } from "react";

type PageLoaderProps = {
  loading: boolean;
  text?: string;
};

export default function PageLoader({
  loading,
  text = "Loading...",
}: PageLoaderProps) {
  if (!loading) return null;

  return (
    <div style={styles.overlay}>
      <div className="spinner" />
      <p style={styles.loadingText}>{text}</p>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(255,255,255,0.6)",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    zIndex: 9999,
    transition: "opacity 0.3s ease",
  },

  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#333",
    fontWeight: 500,
  },
};