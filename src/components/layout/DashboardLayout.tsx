import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState, type CSSProperties } from "react";
import Sidebar from "./Sidebar";
import TopHeader from "./TopHeader";

const DESKTOP_BREAKPOINT = 1024;

export default function DashboardLayout() {
  const navigate = useNavigate();
  
  const [collapsed, setCollapsed] = useState(true); 
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= DESKTOP_BREAKPOINT);

  const handleLogout = () => {
    // Implement actual logout logic here (clear tokens, etc.)
    navigate("/", { replace: true });
    setMobileOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= DESKTOP_BREAKPOINT;
      setIsDesktop(desktop);
      if (desktop) {
        setMobileOpen(false);
        setCollapsed(true); 
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const userData = { name: "Admin", phone: "+998 (99) 436-46-15" };

  // Sync state between desktop and mobile triggers
  const handleAutoClose = (val: boolean) => {
    if (isDesktop) {
      setCollapsed(val);
    } else {
      setMobileOpen(!val);
    }
  };

  return (
    <div style={layoutStyles.container}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        * { 
          box-sizing: border-box; 
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #00a699; }
        
        .main-content {
          transition: all 0.3s ease;
        }

        /* Subtle entrance animation for page content */
        .page-transition-enter {
          opacity: 0;
          transform: translateY(10px);
        }
        .page-transition-enter-active {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 300ms, transform 300ms;
        }
      `}</style>
      
      {isDesktop ? (
        <div style={{ 
          width: collapsed ? "88px" : "280px", 
          transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          backgroundColor: "#ffffff",
          zIndex: 100
        }}>
          <Sidebar
            collapsed={collapsed}
            setCollapsed={handleAutoClose}
            user={userData}
            onLogout={handleLogout} 
          />
        </div>
      ) : (
        <>
          <div
            onClick={() => setMobileOpen(false)}
            style={{
              ...layoutStyles.overlay,
              opacity: mobileOpen ? 1 : 0,
              visibility: mobileOpen ? "visible" : "hidden",
            }}
          />
          <div
            style={{
              ...layoutStyles.mobileSidebarWrapper,
              transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
            }}
          >
            <Sidebar
              collapsed={false} 
              setCollapsed={(val) => setMobileOpen(!val)}
              user={userData}
              onLogout={handleLogout}
            />
          </div>
        </>
      )}

      <div style={layoutStyles.mainArea}>
        <TopHeader
          isDesktop={isDesktop}
          setMobileOpen={setMobileOpen}
          userName={userData.name}
          onToggleSidebar={() => setCollapsed(!collapsed)} 
          onLogout={handleLogout}
        />

        <main className="main-content" style={layoutStyles.scrollArea}>
          <div style={layoutStyles.contentContainer}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

const layoutStyles: Record<string, CSSProperties> = {
  container: { 
    display: "flex", 
    height: "100vh", 
    overflow: "hidden", 
    backgroundColor: "#ffffff", 
  },
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0, 21, 41, 0.2)",
    backdropFilter: "blur(4px)", 
    zIndex: 999,
    transition: "all 0.3s ease-in-out",
  },
  mobileSidebarWrapper: {
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    zIndex: 1000,
    boxShadow: "20px 0 60px rgba(0,0,0,0.1)",
    transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  mainArea: { 
    flex: 1, 
    display: "flex", 
    flexDirection: "column", 
    minWidth: 0,
    position: "relative",
    backgroundColor: "#fcfcfd"
  },
  scrollArea: { 
    flex: 1, 
    overflowY: "auto", 
    overflowX: "hidden",
  },
  contentContainer: { 
    margin: "0 auto", 
    padding: "clamp(20px, 4vw, 50px)", 
    maxWidth: "1600px",
    minHeight: "100%"
  }
};