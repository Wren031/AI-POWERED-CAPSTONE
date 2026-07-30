import React, { useRef, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Lock,
  Smartphone,
  Mail,
  Phone,
  Database,
  Search,
  FileText,
  Monitor,
  ScanFace,
  Activity,
  CheckCircle2,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

import captureMockup from "../../../assets/images/settings.jpg";
import analysisMockup from "../../../assets/images/home.jpg";
import reportMockup from "../../../assets/images/login.jpg";

const NAV_ITEMS = ["Home", "Workflow", "About", "Features", "Contact"] as const;

const WORKFLOW = [
  {
    icon: <ScanFace size={22} />,
    step: "01",
    t: "Biometric Capture",
    d: "High-fidelity facial scanning using standard mobile or webcam hardware with sub-millimeter precision.",
  },
  {
    icon: <Activity size={22} />,
    step: "02",
    t: "Health Analysis",
    d: "AI-driven assessment of hydration, elasticity, and dermal biomarkers.",
  },
  {
    icon: <Search size={22} />,
    step: "03",
    t: "Clinical Matching",
    d: "Cross-reference results with dermatology datasets and clinical models.",
  },
  {
    icon: <FileText size={22} />,
    step: "04",
    t: "Expert Guidance",
    d: "Instant dermatological reports with evidence-backed recommendations.",
  },
];

const FEATURES = [
  {
    icon: <Monitor size={20} />,
    title: "Real-time Monitoring",
    desc: "Track skin health progress longitudinally with precision biomarker trending.",
  },
  {
    icon: <Lock size={20} />,
    title: "Data Privacy",
    desc: "AES-256 encryption across all endpoints with zero-knowledge architecture.",
  },
  {
    icon: <Database size={20} />,
    title: "EHR Integration",
    desc: "FHIR-compliant sync with major healthcare platforms and clinical systems.",
  },
  {
    icon: <Smartphone size={20} />,
    title: "Cross Platform",
    desc: "Optimized natively for iOS, Android, desktop, and progressive web.",
  },
];

const STATS = [
  { value: "99.2%", label: "Diagnostic accuracy" },
  { value: "3.2M", label: "Clinical cases indexed" },
  { value: "<2s", label: "Analysis turnaround" },
  { value: "HIPAA", label: "Certified compliant" },
];

const C = {
  sky: "#0ea5e9",
  teal: "#0d9488",
  navy: "#0a1628",
  navyMid: "#112240",
  slate: "#64748b",
  slateLight: "#94a3b8",
  border: "#e2e8f0",
  borderDark: "#1e3a5f",
bgAlt: "#f8fafc",
  bgDark: "#060d1a",
  white: "#ffffff",
  accent: "#38bdf8",
};

export default function LandingPage() {
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [activeNav, setActiveNav] = useState("Home");
  const [mobileMenu, setMobileMenu] = useState(false);

  const [screen, setScreen] = useState({
    mobile: window.innerWidth < 768,
    tablet: window.innerWidth >= 768 && window.innerWidth < 1024,
  });

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const handleResize = () => {
      setScreen({
        mobile: window.innerWidth < 768,
        tablet: window.innerWidth >= 768 && window.innerWidth < 1024,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = useCallback((label: string) => {
    setActiveNav(label);
    setMobileMenu(false);
    const target = sectionRefs.current[label];
    if (target) {
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - 88,
        behavior: "smooth",
      });
    }
  }, []);

  const containerPadding = screen.mobile ? "0 20px" : screen.tablet ? "0 30px" : "0 48px";

  return (
    <div style={s.root}>

      {/* NAVBAR */}
      <nav
        style={{
          ...s.nav,
          background: isScrolled ? "rgba(255,255,255,0.97)" : "transparent",
          borderBottom: isScrolled ? `1px solid ${C.border}` : "1px solid transparent",
          backdropFilter: isScrolled ? "blur(24px)" : "none",
        }}
      >
        <div style={{ ...s.navInner, padding: containerPadding }}>
          <div style={s.navLogo}>
            <div style={s.logoMark}>
              <ShieldCheck size={16} color="#fff" />
            </div>
            <span style={s.logoText}>
              Derma<span style={{ color: C.sky }}>AI</span>
            </span>
          </div>

          {!screen.mobile && (
            <div style={s.navLinks}>
              {NAV_ITEMS.map((label) => (
                <button
                  key={label}
                  onClick={() => scrollTo(label)}
                  style={{
                    ...s.navLink,
                    color: activeNav === label ? C.navy : C.slate,
                    borderBottom: activeNav === label ? `2px solid ${C.sky}` : "2px solid transparent",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {!screen.mobile ? (
            <div style={s.navActions}>
              <button style={s.navCta} onClick={() => navigate("/login")}>
                Sign in
              </button>
            </div>
          ) : (
            <button style={s.menuBtn} onClick={() => setMobileMenu(!mobileMenu)}>
              {mobileMenu ? <X color={C.navy} /> : <Menu color={C.navy} />}
            </button>
          )}
        </div>

        {screen.mobile && mobileMenu && (
          <div style={s.mobileMenu}>
            {NAV_ITEMS.map((item) => (
              <button key={item} onClick={() => scrollTo(item)} style={s.mobileMenuItem}>
                {item}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* HERO — dark luxury */}
      <header
        ref={(el: HTMLElement | null) => { sectionRefs.current["Home"] = el; }}
        style={s.hero}
      >
        <div style={s.heroNoise} />
        <div style={s.heroGlow1} />
        <div style={s.heroGlow2} />
        <div style={s.heroGrid} />

        <div
          style={{
            ...s.heroInner,
            flexDirection: screen.mobile ? "column" : "row",
            padding: screen.mobile ? "80px 20px 60px" : "120px 48px 80px",
            gap: screen.mobile ? "40px" : "80px",
          }}
        >
          <div style={{ ...s.heroLeft, textAlign: screen.mobile ? "center" : "left" }}>
            <div style={s.heroBadge}>
              <Sparkles size={11} color={C.sky} />
              <span>Clinical-grade AI · Public Beta</span>
            </div>

            <h1 style={s.heroH1}>
              AI Facial health
              <br />
                Assesment and,
              <br />
              <span style={s.heroAccent}>Recommendation System</span>
            </h1>

            <p style={s.heroBody}>
              DermaAI bridges advanced computer vision and dermatological science to deliver instant skin health insights from any device.
            </p>

            <div style={{ ...s.heroCtas, justifyContent: screen.mobile ? "center" : "flex-start" }}>
              <button style={s.heroPrimary} onClick={() => scrollTo("Workflow")}>
                See how it works
                <ChevronRight size={16} />
              </button>
            </div>

            <div style={{ ...s.heroTrust, justifyContent: screen.mobile ? "center" : "flex-start" }}>
              {["SOC 2 Certified", "HIPAA Compliant", "FDA Registered"].map((item) => (
                <div key={item} style={s.trustPill}>
                  <CheckCircle2 size={12} color="#22c55e" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={s.heroRight}>
            <div
              style={{
                ...s.mockupFrame,
                width: screen.mobile ? "220px" : "300px",
                height: screen.mobile ? "420px" : "580px",
              }}
            >
              <div style={{ ...s.mockupCard, ...s.mockupBack }}>
                <img src={reportMockup} alt="" style={s.mockupImg} />
              </div>
              <div style={{ ...s.mockupCard, ...s.mockupMid }}>
                <img src={captureMockup} alt="" style={s.mockupImg} />
              </div>
              <div style={{ ...s.mockupCard, ...s.mockupFront }}>
                <img src={analysisMockup} alt="" style={s.mockupImg} />
                <div style={s.mockupBadge}>
                  <div style={s.mockupBadgeDot} />
                  Live Analysis
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div style={{ ...s.statsBar, padding: containerPadding }}>
          {STATS.map((stat, i) => (
            <React.Fragment key={stat.label}>
              <div style={{ ...s.statCell, width: screen.mobile ? "50%" : "auto" }}>
                <span style={s.statValue}>{stat.value}</span>
                <span style={s.statLabel}>{stat.label}</span>
              </div>
              {i < STATS.length - 1 && !screen.mobile && <div style={s.statDivider} />}
            </React.Fragment>
          ))}
        </div>
      </header>

      {/* WORKFLOW */}
      <section
        ref={(el: HTMLElement | null) => { sectionRefs.current["Workflow"] = el; }}
        style={s.section}
      >
        <div style={{ ...s.container, padding: containerPadding }}>
          <div style={s.sectionHeader}>
            <p style={s.eyebrow}>How it works</p>
            <h2 style={s.sectionTitle}>Four steps to clinical clarity</h2>
            <p style={s.sectionSub}>
              From a simple scan to a comprehensive dermatological report — all in under two seconds.
            </p>
          </div>

          <div
            style={{
              ...s.workflowGrid,
              gridTemplateColumns: screen.mobile ? "1fr" : screen.tablet ? "repeat(2,1fr)" : "repeat(4,1fr)",
            }}
          >
            {WORKFLOW.map((item, i) => (
              <div key={i} style={s.workflowCard}>
                <div style={s.workflowTop}>
                  <div style={s.workflowIconWrap}>{item.icon}</div>
                  <span style={s.workflowStep}>{item.step}</span>
                </div>
                <div style={s.workflowConnector} />
                <h3 style={s.workflowTitle}>{item.t}</h3>
                <p style={s.workflowDesc}>{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section
        ref={(el: HTMLElement | null) => { sectionRefs.current["About"] = el; }}
        style={s.sectionDark}
      >
        <div style={s.sectionDarkGlow} />
        <div style={{ ...s.container, padding: containerPadding, position: "relative" }}>
          <div style={{ ...s.aboutLayout, flexDirection: screen.mobile ? "column" : "row" }}>
            <div style={s.aboutLeft}>
              <p style={s.eyebrowLight}>About us</p>
              <h2 style={{ ...s.sectionTitle, color: C.navy }}>
                Making specialist-grade care accessible through AI
              </h2>
              <p style={{ ...s.aboutText, color: C.slate }}>
                DermaAI combines artificial intelligence, clinical dermatology, and computer vision to deliver fast and accessible skin assessments — available to anyone with a smartphone.
              </p>
              <p style={{ ...s.aboutText, color: C.slate }}>
                We aim to bridge the gap between healthcare access and modern technology, empowering patients and practitioners alike.
              </p>
              <div style={s.aboutChecklist}>
                {[
                  "Clinical-grade AI assessment engine",
                  "Secure HIPAA-compliant infrastructure",
                  "Real-time analysis under 2 seconds",
                  "Trusted by 3.2M+ clinical cases",
                ].map((item) => (
                  <div key={item} style={s.aboutCheckItem}>
                    <CheckCircle2 size={15} color={C.sky} />
                    <span style={{ color: C.navy, fontWeight: 500 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={s.aboutRight}>
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80"
                alt="Medical professional"
                style={s.aboutImage}
              />
              <div style={s.aboutCard}>
                <div style={s.aboutCardTop}>
                  <div style={s.aboutCardDot} />
                  <span style={{ color: "#16a34a", fontWeight: 600, fontSize: "13px" }}>System Active</span>
                </div>
                <h3 style={s.aboutCardTitle}>99.2% Accuracy</h3>
                <p style={{ ...s.aboutCardText, color: C.slate }}>AI-powered dermatological intelligence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        ref={(el: HTMLElement | null) => { sectionRefs.current["Features"] = el; }}
        style={s.section}
      >
        <div style={{ ...s.container, padding: containerPadding }}>
          <div style={s.sectionHeader}>
            <p style={s.eyebrow}>Features</p>
            <h2 style={s.sectionTitle}>Built for modern healthcare</h2>
            <p style={s.sectionSub}>
              Enterprise-grade infrastructure meeting the highest clinical and regulatory standards.
            </p>
          </div>

          <div
            style={{
              ...s.featuresGrid,
              gridTemplateColumns: screen.mobile ? "1fr" : screen.tablet ? "repeat(2,1fr)" : "repeat(4,1fr)",
            }}
          >
            {FEATURES.map((feature, i) => (
              <div key={i} style={s.featureCard}>
                <div style={s.featureIconWrap}>{feature.icon}</div>
                <h3 style={s.featureTitle}>{feature.title}</h3>
                <p style={s.featureDesc}>{feature.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CONTACT */}
      <section
        ref={(el: HTMLElement | null) => { sectionRefs.current["Contact"] = el; }}
        style={{ ...s.section, background: C.bgAlt }}
      >
        <div style={{ ...s.container, padding: containerPadding }}>
          <div style={s.sectionHeader}>
            <p style={s.eyebrow}>Contact</p>
            <h2 style={s.sectionTitle}>Get in touch</h2>
            <p style={s.sectionSub}>
              Questions about clinical integration or enterprise licensing? Our team responds within one business day.
            </p>
          </div>

          <div
            style={{
              ...s.contactLayout,
              gridTemplateColumns: screen.mobile ? "1fr" : "1fr 1.5fr",
            }}
          >
            <div style={s.contactInfo}>
              {[
                { icon: <Mail size={18} color={C.sky} />, label: "Email", value: "support@derma-ai.com" },
                { icon: <Phone size={18} color={C.sky} />, label: "Phone", value: "+1 (800) 555-DERMA" },
              ].map(({ icon, label, value }) => (
                <div key={label} style={s.contactCard}>
                  <div style={s.contactIcon}>{icon}</div>
                  <div>
                    <p style={s.contactLabel}>{label}</p>
                    <p style={s.contactValue}>{value}</p>
                  </div>
                </div>
              ))}
              <div style={s.contactBadgeGroup}>
                {["HIPAA", "SOC 2", "FDA", "FHIR"].map((b) => (
                  <span key={b} style={s.complianceBadge}>{b}</span>
                ))}
              </div>
            </div>

            <form style={s.contactForm}>
              <div style={{ ...s.formRow, gridTemplateColumns: screen.mobile ? "1fr" : "1fr 1fr" }}>
                <input type="text" placeholder="Full Name" style={s.input} />
                <input type="text" placeholder="Organization" style={s.input} />
              </div>
              <input type="email" placeholder="Email Address" style={s.inputFull} />
              <textarea rows={5} placeholder="Your message…" style={s.textarea} />
              <button type="submit" style={s.submitBtn}>
                Send Message
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={s.footer}>
        <div style={{ ...s.footerInner, padding: containerPadding }}>
          <div style={s.footerLeft}>
            <div style={s.navLogo}>
              <div style={s.logoMark}><ShieldCheck size={14} color="#fff" /></div>
              <span style={{ ...s.logoText, color: C.navy }}>
                Derma<span style={{ color: C.sky }}>AI</span>
              </span>
            </div>
            <p style={s.footerText}>
              Clinical-grade dermatological AI. HIPAA compliant, FDA registered, SOC 2 certified.
            </p>
          </div>
          <p style={s.footerCopy}>© {new Date().getFullYear()} DermaAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  root: {
    fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
    overflowX: "hidden",
    background: "#fff",
    color: C.navy,
  },

  // ── NAVBAR ──────────────────────────────────
  nav: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    transition: "all .3s ease",
  },
  navInner: {
    maxWidth: "1280px",
    height: "72px",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navLogo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  logoMark: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    background: "linear-gradient(135deg,#0ea5e9,#0d9488)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  logoText: {
    fontSize: "18px",
    fontWeight: 800,
    color: C.navy,
    letterSpacing: "-0.02em",
  },
  navLinks: {
    display: "flex",
    gap: "4px",
  },
  navLink: {
    border: "none",
    background: "none",
    cursor: "pointer",
    padding: "8px 14px",
    fontWeight: 500,
    fontSize: "14px",
    transition: "color .2s",
    paddingBottom: "6px",
  },
  navActions: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  navSignIn: {
    border: "none",
    background: "none",
    cursor: "pointer",
    fontWeight: 500,
    color: C.slate,
    fontSize: "14px",
  },
  navCta: {
    border: "none",
    background: "linear-gradient(135deg,#0ea5e9,#0d9488)",
    color: "#fff",
    padding: "10px 18px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    gap: "7px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "14px",
  },
  menuBtn: {
    border: "none",
    background: "none",
    cursor: "pointer",
  },
  mobileMenu: {
    background: "#fff",
    padding: "16px 20px 20px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    borderTop: `1px solid ${C.border}`,
  },
  mobileMenuItem: {
    border: "none",
    background: C.bgAlt,
    padding: "14px",
    borderRadius: "10px",
    textAlign: "left",
    cursor: "pointer",
    fontWeight: 600,
    color: C.navy,
  },

  // ── HERO ──────────────────────────────────
  hero: {
    paddingTop: "72px",
    position: "relative",
    background: "#fff",
    overflow: "hidden",
  },
  heroGrid: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "linear-gradient(rgba(14,165,233,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(14,165,233,0.06) 1px,transparent 1px)",
    backgroundSize: "56px 56px",
    maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
  },
  heroNoise: {
    position: "absolute",
    inset: 0,
    opacity: 0,
  },
  heroGlow1: {
    position: "absolute",
    top: "-200px",
    left: "-200px",
    width: "600px",
    height: "600px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  heroGlow2: {
    position: "absolute",
    bottom: "-100px",
    right: "-100px",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(13,148,136,0.07) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  heroInner: {
    maxWidth: "1280px",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    position: "relative",
    zIndex: 1,
  },
  heroLeft: {
    flex: 1,
  },
  heroBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "7px 14px",
    background: "#f0f9ff",
    border: "1px solid #bae6fd",
    borderRadius: "999px",
    color: C.sky,
    fontSize: "12px",
    fontWeight: 700,
    marginBottom: "28px",
    letterSpacing: "0.02em",
  },
  heroH1: {
    fontSize: "clamp(38px,5vw,68px)",
    lineHeight: 1.0,
    fontWeight: 800,
    letterSpacing: "-0.04em",
    color: C.navy,
    margin: 0,
  },
  heroAccent: {
    background: "linear-gradient(135deg,#0ea5e9,#0d9488)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  heroBody: {
    fontSize: "17px",
    lineHeight: 1.75,
    color: C.slate,
    marginTop: "24px",
    maxWidth: "480px",
  },
  heroCtas: {
    display: "flex",
    gap: "14px",
    flexWrap: "wrap" as const,
    marginTop: "36px",
  },
  heroPrimary: {
    border: "none",
    background: "linear-gradient(135deg,#0ea5e9,#0d9488)",
    color: "#fff",
    padding: "15px 24px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "15px",
    boxShadow: "0 8px 24px rgba(14,165,233,0.35)",
  },
  heroSecondary: {
    border: `1px solid ${C.border}`,
    background: "#fff",
    color: C.slate,
    padding: "15px 24px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "15px",
  },
  heroTrust: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap" as const,
    marginTop: "28px",
  },
  trustPill: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "12px",
    color: C.slate,
    fontWeight: 500,
  },
  heroRight: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
  },

  // mockups
  mockupFrame: { position: "relative" },
  mockupCard: {
    position: "absolute",
    overflow: "hidden",
    borderRadius: "24px",
    background: "#f1f5f9",
    border: "2px solid #e2e8f0",
    boxShadow: "0 30px 80px rgba(0,0,0,.12)",
  },
  mockupBack: {
    width: "200px",
    top: "50px",
    left: "-20px",
    opacity: 0.4,
    transform: "rotate(-6deg)",
  },
  mockupMid: {
    width: "220px",
    top: "20px",
    right: "-20px",
    opacity: 0.65,
    transform: "rotate(5deg)",
  },
  mockupFront: {
    width: "240px",
    bottom: 0,
    left: "50%",
    transform: "translateX(-50%)",
  },
  mockupImg: { width: "100%", display: "block" },
  mockupBadge: {
    position: "absolute",
    bottom: "16px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "rgba(255,255,255,.97)",
    borderRadius: "999px",
    padding: "8px 16px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "12px",
    fontWeight: 700,
    whiteSpace: "nowrap" as const,
    boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
  },
  mockupBadgeDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#22c55e",
  },

  // stats
  statsBar: {
    maxWidth: "1280px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "center",
    borderTop: `1px solid ${C.border}`,
    position: "relative",
    zIndex: 1,
  },
  statCell: {
    padding: "32px 48px",
    textAlign: "center",
  },
  statDivider: {
    width: "1px",
    background: C.border,
    alignSelf: "stretch",
    margin: "20px 0",
  },
  statValue: {
    display: "block",
    fontSize: "30px",
    fontWeight: 800,
    color: C.navy,
    letterSpacing: "-0.03em",
  },
  statLabel: {
    display: "block",
    fontSize: "11px",
    color: C.slate,
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    marginTop: "4px",
    fontWeight: 600,
  },

  // ── SECTIONS ──────────────────────────────────
  section: {
    padding: "100px 0",
    background: "#fff",
  },
  sectionDark: {
    padding: "100px 0",
    background: C.bgAlt,
    position: "relative",
    overflow: "hidden",
  },
  sectionDarkGlow: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    width: "800px",
    height: "400px",
    background: "radial-gradient(ellipse, rgba(14,165,233,0.05) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  container: {
    maxWidth: "1280px",
    margin: "0 auto",
  },
  sectionHeader: {
    textAlign: "center",
    marginBottom: "64px",
  },
  eyebrow: {
    color: C.sky,
    fontWeight: 700,
    fontSize: "12px",
    textTransform: "uppercase" as const,
    letterSpacing: "0.12em",
    marginBottom: "12px",
  },
  eyebrowLight: {
    color: C.sky,
    fontWeight: 700,
    fontSize: "12px",
    textTransform: "uppercase" as const,
    letterSpacing: "0.12em",
    marginBottom: "12px",
  },
  sectionTitle: {
    fontSize: "clamp(28px,3.5vw,42px)",
    fontWeight: 800,
    color: C.navy,
    lineHeight: 1.1,
    letterSpacing: "-0.03em",
    margin: "0 0 16px",
  },
  sectionSub: {
    color: C.slate,
    fontSize: "16px",
    lineHeight: 1.7,
    maxWidth: "520px",
    margin: "0 auto",
  },

  // workflow
  workflowGrid: {
    display: "grid",
    gap: "20px",
  },
  workflowCard: {
    background: "#fff",
    border: `1px solid ${C.border}`,
    borderRadius: "20px",
    padding: "32px",
    transition: "box-shadow .2s",
    position: "relative",
  },
  workflowTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "16px",
  },
  workflowIconWrap: {
    width: "52px",
    height: "52px",
    borderRadius: "14px",
    background: "#f0f9ff",
    border: "1px solid #bae6fd",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: C.sky,
  },
  workflowStep: {
    color: "#e2e8f0",
    fontWeight: 800,
    fontSize: "20px",
    letterSpacing: "-0.04em",
  },
  workflowConnector: {
    width: "28px",
    height: "2px",
    background: "linear-gradient(90deg,#0ea5e9,#0d9488)",
    borderRadius: "2px",
    marginBottom: "20px",
  },
  workflowTitle: {
    fontSize: "17px",
    fontWeight: 700,
    marginBottom: "10px",
    color: C.navy,
  },
  workflowDesc: {
    color: C.slate,
    lineHeight: 1.7,
    fontSize: "14px",
  },

  // about
  aboutLayout: {
    display: "flex",
    alignItems: "center",
    gap: "80px",
  },
  aboutLeft: { flex: 1 },
  aboutRight: { flex: 1, position: "relative" },
  aboutText: {
    lineHeight: 1.8,
    marginBottom: "16px",
    fontSize: "15px",
  },
  aboutChecklist: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
    marginTop: "24px",
  },
  aboutCheckItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  aboutImage: {
    width: "100%",
    borderRadius: "20px",
    display: "block",
    filter: "brightness(0.85)",
  },
  aboutCard: {
    position: "absolute",
    bottom: "-24px",
    left: "-24px",
    background: "#fff",
    padding: "20px 24px",
    borderRadius: "18px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
    minWidth: "200px",
  },
  aboutCardTop: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "8px",
  },
  aboutCardDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#22c55e",
    flexShrink: 0,
  },
  aboutCardTitle: {
    margin: 0,
    fontSize: "26px",
    fontWeight: 800,
    color: C.navy,
    letterSpacing: "-0.04em",
  },
  aboutCardText: {
    fontSize: "13px",
    marginTop: "4px",
  },

  // features
  featuresGrid: {
    display: "grid",
    gap: "20px",
    marginBottom: "60px",
  },
  featureCard: {
    border: `1px solid ${C.border}`,
    borderRadius: "20px",
    padding: "30px",
    transition: "border-color .2s",
  },
  featureIconWrap: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    background: "#f0f9ff",
    border: "1px solid #bae6fd",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: C.sky,
    marginBottom: "20px",
  },
  featureTitle: {
    fontSize: "16px",
    fontWeight: 700,
    marginBottom: "8px",
    color: C.navy,
  },
  featureDesc: {
    color: C.slate,
    lineHeight: 1.7,
    fontSize: "14px",
  },

  // contact
  contactLayout: {
    display: "grid",
    gap: "60px",
  },
  contactInfo: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "20px",
    justifyContent: "flex-start",
  },
  contactCard: {
    display: "flex",
    gap: "16px",
    alignItems: "flex-start",
  },
  contactIcon: {
    width: "46px",
    height: "46px",
    borderRadius: "12px",
    background: "#f0f9ff",
    border: "1px solid #bae6fd",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  contactLabel: {
    fontSize: "11px",
    fontWeight: 700,
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    color: C.slateLight,
    marginBottom: "4px",
  },
  contactValue: {
    fontWeight: 600,
    color: C.navy,
    fontSize: "15px",
  },
  contactBadgeGroup: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap" as const,
    marginTop: "8px",
  },
  complianceBadge: {
    padding: "6px 14px",
    borderRadius: "8px",
    background: "#f0f9ff",
    border: "1px solid #bae6fd",
    color: C.sky,
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.05em",
  },
  contactForm: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
  },
  formRow: {
    display: "grid",
    gap: "12px",
  },
  input: {
    padding: "14px 16px",
    borderRadius: "12px",
    border: `1px solid ${C.border}`,
    outline: "none",
    fontSize: "14px",
    fontFamily: "inherit",
    background: "#fff",
    color: C.navy,
  },
  inputFull: {
    padding: "14px 16px",
    borderRadius: "12px",
    border: `1px solid ${C.border}`,
    outline: "none",
    fontSize: "14px",
    fontFamily: "inherit",
    background: "#fff",
    color: C.navy,
  },
  textarea: {
    padding: "14px 16px",
    borderRadius: "12px",
    border: `1px solid ${C.border}`,
    outline: "none",
    resize: "vertical" as const,
    fontSize: "14px",
    fontFamily: "inherit",
    background: "#fff",
    color: C.navy,
  },
  submitBtn: {
    border: "none",
    background: C.navy,
    color: "#fff",
    padding: "14px 24px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "15px",
    width: "fit-content",
  },

  // footer
  footer: {
    background: C.bgAlt,
    borderTop: `1px solid ${C.border}`,
    padding: "32px 0",
  },
  footerInner: {
    maxWidth: "1280px",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap" as const,
    gap: "16px",
  },
  footerLeft: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
  },
  footerText: {
    color: C.slate,
    fontSize: "13px",
    maxWidth: "340px",
    lineHeight: 1.6,
  },
  footerCopy: {
    color: C.slateLight,
    fontSize: "13px",
  },

  sectionAlt: {
    padding: "100px 0",
    background: C.bgAlt,
  },
};