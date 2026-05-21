import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { CSSProperties } from "react";
import { Lock, Mail, ChevronRight, ShieldCheck } from "lucide-react";
import useAuth from "../hooks/useAuth";

// DermaAI Design Tokens
const theme = {
  accent: "#00A3AD",      // DermaAI Teal
  navy: "#0F172A",        // DermaAI Deep Navy
  slate: "#64748B",       // Slate for body text
  bgSoft: "#F8FAFC",      // Light background
  border: "#E2E8F0",
  white: "#FFFFFF"
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuth();

  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) navigate("/admin/dashboard");
  };

  return (
    <div style={styles.container}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        .login-btn:hover { background-color: ${theme.accent} !important; transform: translateY(-1px); }
        .login-btn:active { transform: translateY(0); }
        .input-focus:focus-within { border-color: ${theme.accent} !important; box-shadow: 0 0 0 1px ${theme.accent}; background: white !important; }
        .checkbox-custom:checked { accent-color: ${theme.accent}; }
      `}</style>

      <section style={styles.authCard}>
        <div style={styles.header}>
          <div style={styles.badge}>
            <div style={styles.badgeDot}></div> 
            <span style={{ letterSpacing: '0.05em' }}>SECURE ADMIN ACCESS</span>
          </div>
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.subtitle}>DermaAI Clinical Management Portal</p>
        </div>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Corporate Email</label>
            <div className="input-focus" style={styles.inputWrapper}>
              <Mail size={18} style={styles.icon} />
              <input
                type="email"
                placeholder="physician@derma.ai"
                style={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div className="input-focus" style={styles.inputWrapper}>
              <Lock size={18} style={styles.icon} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                style={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                style={styles.showPassBtn}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div style={styles.optionsRow}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                className="checkbox-custom"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={styles.checkbox}
              />
              Remember session
            </label>
            <a href="/forgot-password" style={styles.forgotPass}>
              Recovery Access
            </a>
          </div>

          {error && (
            <div style={styles.errorBox}>
               {error}
            </div>
          )}

          <button 
            type="submit" 
            className="login-btn" 
            style={{...styles.loginButton, opacity: isLoading ? 0.7 : 1}} 
            disabled={isLoading}
          >
            {isLoading ? "Authenticating..." : "Authorize Login"}
            <ChevronRight size={18} />
          </button>
        </form>

        <footer style={styles.footer}>
          <div style={styles.encryptionInfo}>
            <ShieldCheck size={14} color={theme.accent} />
            <span>End-to-End Clinical Encryption Active</span>
          </div>
        </footer>
      </section>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: theme.bgSoft,
    backgroundImage: `radial-gradient(${theme.border} 1px, transparent 1px)`,
    backgroundSize: "30px 30px",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    padding: "20px",
  },
  authCard: {
    width: "100%",
    maxWidth: "420px",
    backgroundColor: theme.white,
    padding: "48px 40px",
    borderRadius: "24px",
    boxShadow: "0 20px 50px -12px rgba(15, 23, 42, 0.12)",
    border: `1px solid ${theme.border}`,
  },
  header: { textAlign: "center", marginBottom: "32px" },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#F0FDFA",
    padding: "6px 12px",
    borderRadius: "10px",
    fontSize: "10px",
    fontWeight: 800,
    marginBottom: "16px",
    color: theme.accent,
    border: `1px solid #CCFBF1`,
  },
  badgeDot: { width: "6px", height: "6px", borderRadius: "50%", backgroundColor: theme.accent },
  title: { fontSize: "28px", fontWeight: 800, marginBottom: "8px", color: theme.navy, letterSpacing: "-0.03em" },
  subtitle: { color: theme.slate, fontSize: "14px", fontWeight: 500 },
  form: { display: "flex", flexDirection: "column", gap: "20px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "12px", fontWeight: 800, color: theme.navy, textTransform: "uppercase", letterSpacing: "0.02em" },
  inputWrapper: { 
    position: "relative", 
    display: "flex", 
    alignItems: "center",
    background: theme.bgSoft,
    borderRadius: "16px",
    border: `1px solid ${theme.border}`,
    transition: "all 0.2s ease"
  },
  icon: { position: "absolute", left: "16px", color: theme.slate },
  input: {
    width: "100%",
    padding: "16px 16px 16px 48px",
    borderRadius: "16px",
    border: "none",
    background: "transparent",
    fontSize: "14px",
    fontWeight: 600,
    color: theme.navy,
    outline: "none"
  },
  showPassBtn: {
    position: "absolute",
    right: "16px",
    background: "white",
    border: `1px solid ${theme.border}`,
    padding: "4px 10px",
    borderRadius: "8px",
    fontSize: "11px",
    fontWeight: 700,
    cursor: "pointer",
    color: theme.slate,
  },
  optionsRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" },
  checkboxLabel: { display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: theme.slate, fontWeight: 500 },
  checkbox: { width: "16px", height: "16px", cursor: "pointer" },
  forgotPass: { fontSize: "13px", color: theme.navy, fontWeight: 700, textDecoration: "none" },
  loginButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    padding: "16px",
    backgroundColor: theme.navy,
    color: "#fff",
    border: "none",
    borderRadius: "16px",
    fontWeight: 800,
    fontSize: "15px",
    cursor: "pointer",
    marginTop: "12px",
    transition: "all 0.3s ease",
    boxShadow: "0 10px 20px -5px rgba(15, 23, 42, 0.3)",
  },
  errorBox: { 
    padding: "12px", 
    borderRadius: "12px", 
    backgroundColor: "#FEF2F2", 
    border: "1px solid #FECACA", 
    color: "#EF4444", 
    fontSize: "13px", 
    fontWeight: 600,
    textAlign: "center" 
  },
  footer: { marginTop: "32px", textAlign: "center" },
  encryptionInfo: { 
    display: "inline-flex", 
    alignItems: "center", 
    gap: "8px", 
    fontSize: "11px", 
    color: theme.slate, 
    fontWeight: 600,
    opacity: 0.8
  },
};