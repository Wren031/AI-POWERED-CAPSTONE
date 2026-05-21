import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, Package, Sparkles, FileText,
  Settings, User, Microscope, Fingerprint, HeartPulse, Stethoscope
} from "lucide-react";
import { admin_skin_result_service } from "../../features/scan/service/admin_skin_result_service";

interface MenuItem {
  to: string;
  label: string;
  icon: React.ElementType;
  section?: string;
  count?: number;
}

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
  user: { name: string; phone?: string };
  onLogout: () => void;
}

export default function Sidebar({ collapsed, setCollapsed, user, onLogout }: SidebarProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [todayScanCount, setTodayScanCount] = useState<number>(0);
  const location = useLocation();
  
  const isExpanded = !collapsed || isHovered;
  const DIAGNOSTIC_ROUTE = "/admin/users-scan";

  // Derma Vibes Palette
  const colors = {
    primary: "#14b8a6", // Fresh Teal/Mint
    softPrimary: "#f0fdfa", 
    textMain: "#334155", // Slate 700
    textMuted: "#94a3b8", // Slate 400
    activeBg: "rgba(20, 184, 166, 0.08)", // Transparent Teal
  };

  useEffect(() => {
    const fetchCount = async () => {
      if (location.pathname !== DIAGNOSTIC_ROUTE) {
        try {
          const count = await admin_skin_result_service.getTodayScanCount();
          setTodayScanCount(count);
        } catch (error) {
          console.error("Failed to fetch scan count", error);
        }
      }
    };
    fetchCount();
  }, [location.pathname]);

  const handleItemClick = () => {
    if (window.innerWidth < 1024) { 
      setCollapsed(true);
      setIsHovered(false);
    }
  };

  const MENU: MenuItem[] = [
    { to: "/admin/dashboard", label: "Clinic Overview", icon: LayoutDashboard },
    { to: "/admin/users", label: "Patient Files", icon: Users, section: "Patient Care" },
    { to: "/admin/products", label: "Skincare Dispensary", icon: Package },
    { to: "/admin/recommendation", label: "Treatment Plans", icon: Sparkles, section: "Diagnostics" },
    { to: "/admin/condition", label: "Derm Analysis", icon: Microscope },
    { 
        to: DIAGNOSTIC_ROUTE, 
        label: "Skin Scan History", 
        icon: Fingerprint, 
        count: todayScanCount
    },
    { to: "/admin/lifestyle", label: "Lifestyle Tips", icon: HeartPulse, section: "Resources" },
    { to: "/admin/report", label: "Reports", icon: FileText },
    { to: "/admin/settings", label: "Clinic Settings", icon: Settings, section: "Admin" },
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ width: isExpanded ? 280 : 88 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="h-screen sticky top-0 bg-white border-r border-slate-100 flex flex-col z-[1000] transition-all duration-500 ease-in-out shadow-[20px_0_40px_rgba(0,0,0,0.01)]"
    >
      {/* Brand Section: High-End Clinic Logo */}
      <div className="px-6 py-10 mb-2">
        <div className="flex items-center gap-4">
          <div 
            style={{ background: `linear-gradient(135deg, ${colors.primary} 0%, #0d9488 100%)` }}
            className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-teal-100 rotate-3 hover:rotate-0 transition-transform duration-300"
          >
            <Stethoscope size={22} color="white" strokeWidth={2.5} />
          </div>
          <AnimatePresence>
            {isExpanded && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="whitespace-nowrap">
                <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-none">
                  Skin<span style={{ color: colors.primary }}>Logic</span>
                </h1>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1.5">Professional Portal</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation: Clean & Spacious */}
      <nav className="flex-1 px-4 overflow-y-auto space-y-1 custom-scrollbar pb-10">
        {MENU.map((item) => {
          const isActive = location.pathname === item.to;
          const Icon = item.icon;

          return (
            <React.Fragment key={item.to}>
              {item.section && isExpanded && (
                <div className="px-4 pt-8 pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] opacity-70">
                  {item.section}
                </div>
              )}

              <NavLink 
                to={item.to} 
                className="block group no-underline"
                onClick={handleItemClick}
              >
                <div className={`flex items-center gap-3.5 p-3.5 rounded-2xl transition-all duration-300 relative ${
                  isActive 
                    ? "bg-[#f0fdfa] text-[#0d9488]" 
                    : "text-slate-500 hover:bg-slate-50"
                } ${!isExpanded && "justify-center mx-1"}`}>
                  
                  {/* Active Indicator Pillar */}
                  {isActive && (
                    <motion.div 
                      layoutId="active-pill"
                      className="absolute left-0 w-1 h-6 bg-teal-500 rounded-r-full"
                    />
                  )}

                  <Icon 
                    size={20} 
                    strokeWidth={isActive ? 2.5 : 2} 
                    className={`shrink-0 transition-all duration-300 ${isActive ? "scale-110" : "group-hover:text-teal-600"}`} 
                  />
                  
                  {isExpanded && (
                    <span className={`text-[14px] whitespace-nowrap flex-1 ${isActive ? "font-bold" : "font-medium"}`}>
                        {item.label}
                    </span>
                  )}

                  {/* Badge: Soft & Subtle */}
                  {item.count !== undefined && item.count > 0 && (
                    <div 
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive ? "bg-teal-600 text-white" : "bg-teal-100 text-teal-700"
                      }`}
                    >
                      {item.count}
                    </div>
                  )}
                </div>
              </NavLink>
            </React.Fragment>
          );
        })}
      </nav>

      {/* User Footer: "The Skin Consultant" vibe */}
      <div className="p-4 bg-slate-50/40 border-t border-slate-100">
        <div className={`flex items-center gap-3 p-2 ${isExpanded ? '' : 'justify-center'}`}>
          <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden bg-teal-50 flex items-center justify-center shrink-0">
             <User size={20} className="text-teal-600" />
          </div>
          {isExpanded && (
            <div className="overflow-hidden whitespace-nowrap flex-1">
              <p className="text-[13px] font-bold text-slate-800 truncate leading-tight">{user.name}</p>
              <button 
                onClick={onLogout}
                className="text-[10px] font-bold text-slate-400 hover:text-teal-600 transition-colors uppercase tracking-wider"
              >
                End Session
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');
        
        * { font-family: 'Plus Jakarta Sans', sans-serif; }

        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: transparent; border-radius: 10px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #cbd5e1; }
      `}</style>
    </motion.aside>
  );
}