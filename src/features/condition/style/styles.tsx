import type { CSSProperties } from "react";

const styles: Record<string, CSSProperties> = {
  // ✅ MAIN CONTAINER
  main_content: {
    padding: "clamp(12px, 2vw, 24px)",
    background: "#ffffff",
    fontFamily: "'Segoe UI', sans-serif",
  },

  // ✅ HEADER
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap", // 🔥 important
    gap: "12px",
  },

  addButton: {
    padding: "10px 16px",
    backgroundColor: "#000",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: "clamp(12px, 1.5vw, 14px)",
    fontWeight: 500,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 8,
    whiteSpace: "nowrap",
  },

  // ✅ SEARCH BAR
  searchContainer: {
    marginTop: 16,
    marginBottom: 20,
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 12px",
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    width: "100%",
    maxWidth: "400px",
  },

  searchInput: {
    border: "none",
    outline: "none",
    flex: 1,
    fontSize: "clamp(12px, 1.5vw, 14px)",
  },

  // ✅ CARD GRID (MOST IMPORTANT)
  card_container: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", // 🔥 responsive grid
    gap: "16px",
    marginTop: 10,
  },
};

export default styles;