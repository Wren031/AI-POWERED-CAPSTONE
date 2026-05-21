import type { CSSProperties } from "react";
import type { UserStatus } from "../types/UserStatus";

const STATUS_CONFIG: Record<
  string,
  { bg: string; color: string; border: string; label: string }
> = {
  active: {
    bg: "#ecfdf5",    // Light Emerald
    color: "#10b981",  // Vibrant Green
    border: "#d1fae5",
    label: "Active",
  },
  inactive: {
    bg: "#fef2f2",    // Light Red
    color: "#ef4444",  // Vibrant Red
    border: "#fee2e2",
    label: "Inactive",
  },
  pending: {
    bg: "#fffbeb",
    color: "#f59e0b",
    border: "#fef3c7",
    label: "Pending",
  },
};

export default function StatusBadge({ status }: { status: string | UserStatus }) {
  // Normalize status to lowercase to match config keys safely
  const normalizedStatus = status?.toLowerCase() || "unknown";
  
  const config = STATUS_CONFIG[normalizedStatus] || {
    bg: "#f8fafc",
    color: "#64748b",
    border: "#e2e8f0",
    label: status,
  };

  return (
    <span
      style={{
        ...styles.badge,
        backgroundColor: config.bg,
        color: config.color,
        border: `1px solid ${config.border}`,
      }}
    >
      {/* Status Dot */}
      <span style={{ ...styles.dot, backgroundColor: config.color }} />
      {config.label}
    </span>
  );
}

const styles: Record<string, CSSProperties> = {
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "5px 12px",
    borderRadius: "20px", // More rounded "pill" look for status
    fontSize: "11px",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    minWidth: "90px",
    justifyContent: "center",
    boxShadow: "0 1px 2px rgba(0,0,0,0.02)", // Subtle depth
  },
  dot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    display: "inline-block",
  },
};