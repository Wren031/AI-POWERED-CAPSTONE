import type { CSSProperties } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchContainer({ value, onChange, placeholder }: Props) {
  return (
    <div style={styles.container}>
        <div style={styles.searchContainer}>
            <input
                type="text"
                placeholder={placeholder ?? "Search..."}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                style={styles.input}
            />
        </div>
    </div>
  );
}

const styles: { [key: string]: CSSProperties } = {
  container: {
    marginTop: 20,
    display: "flex",
    justifyContent: "flex-start",
  },

  label: {
    fontWeight: "bold",
    fontSize: "13px"
  },

  searchContainer: { 
    display: "flex",
    flexDirection: "column",
    gap: "6px"
  },

  input: {
    padding: "10px 14px",
    borderRadius: 5,
    border: "1px solid #e5e7eb",
    fontSize: 14,
    width: 450,
    outline: "none",
  },
};