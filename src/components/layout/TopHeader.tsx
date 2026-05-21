import React, { useMemo, useState, useRef, useEffect } from "react";
import { Menu, Bell, Search, MoreVertical, User, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TopHeaderProps {
  isDesktop: boolean;
  setMobileOpen: (value: boolean) => void;
  userName?: string;
  onToggleSidebar?: () => void;
  onLogout?: () => void;
}

// DermaAI Design Tokens
const theme = {
  accent: "#00A3AD",      // DermaAI Teal
  navy: "#0F172A",        // DermaAI Text/Navy
  slate: "#64748B",       // Muted text
  border: "#E2E8F0",
  bgSoft: "#F8FAFC",
  white: "#FFFFFF"
};

export default function TopHeader({
  isDesktop,
  setMobileOpen,
  userName = "Admin",
  onLogout,
}: TopHeaderProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    setShowMenu(false);
    navigate("/admin/settings");
  };

  const handleLogoutClick = () => {
    setShowMenu(false);
    if (onLogout) {
      onLogout();
    } else {
      navigate("/login"); 
    }
  };

  const dateStr = useMemo(() => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  }, []);

  return (
    <header style={{ 
      ...headerContainerStyle, 
      padding: isDesktop ? "0 50px" : "0 20px" 
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        .nav-icon:hover { background-color: #F1F5F9 !important; color: ${theme.navy} !important; transform: translateY(-1px); }
        .dropdown-item:hover { background-color: #F0FDFA !important; color: ${theme.accent} !important; }
        .search-trigger:focus-within { border-color: ${theme.accent} !important; background-color: #FFFFFF !important; box-shadow: 0 0 0 1px ${theme.accent}; }
        .avatar-hover:hover { transform: scale(1.05); box-shadow: 0 8px 20px -5px rgba(15, 23, 42, 0.25); }
        .hotkey-tag { font-size: 10px; background: #E2E8F0; color: #64748B; padding: 2px 6px; border-radius: 4px; font-weight: 800; margin-left: auto; }
      `}</style>

      {/* Left Section */}
      <div style={flexCenterGap(isDesktop ? 24 : 12)}>
        {!isDesktop && (
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            style={mobileMenuButtonStyle}
          >
            <Menu size={20} />
          </button>
        )}

        {isDesktop && (
          <div style={textGroupStyle}>
            <h2 style={titleStyle}>Hello, {userName}</h2>
            <time style={subtitleStyle}>{dateStr}</time>
          </div>
        )}
      </div>

      {/* Right Section */}
      <div style={flexCenterGap(isDesktop ? 24 : 12)}>
        {isDesktop && (
          <div className="search-trigger" style={searchContainerStyle}>
            <Search size={16} style={{ color: theme.slate }} />
            <input 
              ref={searchInputRef}
              type="text" 
              placeholder="Search clinical protocols..." 
              style={searchInputStyle} 
            />
            <span className="hotkey-tag">⌘K</span>
          </div>
        )}
        
        <button type="button" className="nav-icon" style={iconButtonStyle}>
          <div style={notificationBadgeStyle} />
          <Bell size={20} />
        </button>

        {/* --- Profile Dropdown --- */}
        <div style={{ position: "relative" }} ref={menuRef}>
          {isDesktop ? (
            <div 
              className="avatar-hover"
              style={avatarPlaceholderStyle} 
              onClick={() => setShowMenu(!showMenu)}
            >
              {userName.charAt(0)}
            </div>
          ) : (
            <button 
              type="button" 
              style={moreButtonStyle} 
              onClick={() => setShowMenu(!showMenu)}
            >
              <MoreVertical size={20} />
            </button>
          )}

          {showMenu && (
            <div style={dropdownStyle}>
              <div style={dropdownHeaderStyle}>
                <span style={{ fontWeight: 800, color: theme.navy, fontSize: "14px" }}>{userName}</span>
                <span style={{ fontSize: "11px", color: theme.accent, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Medical Administrator
                </span>
              </div>
              
              <div className="dropdown-item" style={dropdownItemStyle} onClick={handleProfileClick}>
                <User size={16} /> Profile Settings
              </div>

              <div className="dropdown-item" style={dropdownItemStyle}>
                <Settings size={16} /> Preferences
              </div>
              
              <hr style={dividerStyle} />
              <div 
                className="dropdown-item" 
                style={{ ...dropdownItemStyle, color: "#E11D48" }}
                onClick={handleLogoutClick}
              >
                <LogOut size={16} /> Sign Out
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

const headerContainerStyle: React.CSSProperties = {
  height: "90px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: "rgba(255, 255, 255, 0.85)",
  backdropFilter: "blur(16px)",
  borderBottom: `1px solid ${theme.border}`,
  position: "sticky",
  top: 0,
  zIndex: 30,
  fontFamily: "'Plus Jakarta Sans', sans-serif"
};

const titleStyle: React.CSSProperties = { 
  margin: 0, 
  fontSize: "1.5rem", 
  fontWeight: 800, 
  color: theme.navy,
  letterSpacing: "-0.03em" 
};

const subtitleStyle: React.CSSProperties = { 
  fontSize: "0.85rem", 
  color: theme.slate, 
  fontWeight: 600,
  marginTop: "2px"
};

const iconButtonStyle: React.CSSProperties = { 
  position: "relative", 
  background: theme.white, 
  border: `1px solid ${theme.border}`, 
  padding: "11px", 
  cursor: "pointer", 
  color: theme.slate, 
  borderRadius: "16px", // Updated to DermaAI standard
  display: "flex", 
  alignItems: "center",
  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
};

const avatarPlaceholderStyle: React.CSSProperties = { 
  width: "48px", 
  height: "48px", 
  borderRadius: "16px", // Updated
  backgroundColor: theme.navy, 
  color: "white", 
  display: "flex", 
  alignItems: "center", 
  justifyContent: "center", 
  fontWeight: 800, 
  cursor: "pointer",
  boxShadow: "0 10px 20px -5px rgba(15, 23, 42, 0.2)",
  transition: "all 0.2s ease"
};

const searchContainerStyle: React.CSSProperties = { 
  display: "flex", 
  alignItems: "center", 
  gap: "12px", 
  backgroundColor: theme.bgSoft, 
  padding: "0 18px", 
  borderRadius: "16px",
  width: "400px",
  height: "52px",
  border: `1px solid ${theme.border}`,
  transition: "all 0.2s"
};

const searchInputStyle: React.CSSProperties = {
  border: "none",
  background: "transparent",
  outline: "none",
  fontSize: "14px",
  fontWeight: 600,
  color: theme.navy,
  width: "100%",
  fontFamily: "inherit"
};

const dropdownStyle: React.CSSProperties = {
  position: "absolute",
  top: "140%",
  right: 0,
  width: "240px",
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(20px)",
  borderRadius: "20px",
  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
  border: `1px solid ${theme.border}`,
  padding: "12px",
  zIndex: 100,
};

const dropdownHeaderStyle: React.CSSProperties = {
  padding: "12px 12px 16px 12px",
  display: "flex",
  flexDirection: "column",
  gap: "4px",
};

const dropdownItemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "12px",
  fontSize: "14px",
  color: theme.slate,
  borderRadius: "14px",
  cursor: "pointer",
  fontWeight: 700,
  transition: "all 0.2s",
};

const dividerStyle: React.CSSProperties = { 
  border: "0", 
  borderTop: `1px solid ${theme.border}`, 
  margin: "8px 0" 
};

const notificationBadgeStyle: React.CSSProperties = { 
  position: "absolute", 
  top: "12px", 
  right: "12px", 
  width: "10px", 
  height: "10px", 
  backgroundColor: theme.accent, 
  borderRadius: "50%", 
  border: `2px solid ${theme.white}` 
};

const flexCenterGap = (gap: number): React.CSSProperties => ({ 
  display: "flex", 
  alignItems: "center", 
  gap: `${gap}px` 
});

const textGroupStyle: React.CSSProperties = { display: "flex", flexDirection: "column" };
const mobileMenuButtonStyle: React.CSSProperties = { ...iconButtonStyle, backgroundColor: theme.white };
const moreButtonStyle: React.CSSProperties = { ...iconButtonStyle, border: "none", background: "transparent" };