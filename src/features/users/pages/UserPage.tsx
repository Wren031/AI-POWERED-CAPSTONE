import { useState, useMemo, useEffect, useCallback } from "react";
import { 
  Users, UserX, Search, Filter, 
  TrendingUp, Activity, Archive,
  ChevronDown, Microscope, type LucideIcon 
} from "lucide-react";

import useUser from "../hooks/useUser";
import TitleSize from "../../../styles/TitleSize";
import UsersTable from "../components/UsersTable";
import UserDetailDrawer from "../components/UserDetailDrawer";
import type { CSSProperties } from "react";

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
  trend?: string;
  type?: 'active' | 'inactive' | 'default';
}

// --- SUB-COMPONENTS ---
const StatCard = ({ title, value, icon: Icon, color, trend, type = 'default' }: StatCardProps) => (
  <div style={styles.statCard}>
    <div style={styles.statHeader}>
      <div style={{ ...styles.statIconWrapper, backgroundColor: `${color}10`, color: color }}>
        <Icon size={18} strokeWidth={2.5} />
      </div>
      {type === 'active' ? (
        <div style={{ ...styles.analyticsBadge, color: '#0d9488', background: '#f0fdfa' }}>
          <span style={styles.pulseDot} />
          <span>Live Analysis</span>
        </div>
      ) : type === 'inactive' ? (
        <div style={{ ...styles.analyticsBadge, color: '#64748b', background: '#f8fafc' }}>
          <Archive size={12} style={{ marginRight: '4px' }} />
          <span>Historical</span>
        </div>
      ) : (
        <div style={styles.analyticsBadge}>
          <TrendingUp size={12} style={{ marginRight: '4px' }} />
          <span>{trend || '+4.2%'}</span>
        </div>
      )}
    </div>
    <div style={styles.statBody}>
      <h3 style={styles.statValue}>{value.toLocaleString()}</h3>
      <span style={styles.statLabel}>{title}</span>
    </div>
    {/* Clean medical-grid decoration */}
    <div style={styles.gridDecoration} />
  </div>
);

export default function UserPage() {
  const { users = [], selectedUser, loading, getUserById, clearSelection } = useUser();

  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("All");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  const itemsPerPage = 8;
  const genderOptions = ["All", "Male", "Female", "Other"];

  // Derma Vibes Color Constant
  const dermaPrimary = "#14b8a6"; 

  useEffect(() => {
    const closeDropdown = () => setIsDropdownOpen(false);
    if (isDropdownOpen) window.addEventListener('click', closeDropdown);
    return () => window.removeEventListener('click', closeDropdown);
  }, [isDropdownOpen]);

  const stats = useMemo(() => ({
    total: users.length,
    active: users.filter(u => u.status?.toLowerCase() === 'active').length,
    inactive: users.filter(u => u.status?.toLowerCase() === 'inactive').length
  }), [users]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const fullName = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase();
      const matchesSearch = fullName.includes(search.toLowerCase()) || 
                           user.id?.toString().includes(search);
      const matchesGender = genderFilter === "All" || user.gender === genderFilter;
      return matchesSearch && matchesGender;
    });
  }, [users, search, genderFilter]);

  useEffect(() => { setCurrentPage(1); }, [search, genderFilter]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const currentData = useMemo(() => {
    return filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [filteredUsers, currentPage]);

  const handleViewUser = useCallback(async (user: any) => {
    await getUserById(user.id);
    setIsDrawerOpen(true);
  }, [getUserById]);

  const handleCloseDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    clearSelection?.(); 
  }, [clearSelection]);

  if (loading) return (
    <div style={styles.center}><Microscope className="animate-spin" color={dermaPrimary} size={40} /></div>
  );

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.6; }
          70% { transform: scale(1.4); opacity: 0; }
          100% { transform: scale(0.95); opacity: 0; }
        }
        .filter-input:focus { 
          border-color: ${dermaPrimary} !important; 
          background: #fff !important; 
          box-shadow: 0 0 0 4px rgba(20, 184, 166, 0.1); 
        }
        .dropdown-item:hover {
          background-color: #f0fdfa !important;
          color: ${dermaPrimary} !important;
        }
        .animate-spin { animation: spin 2s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <div style={styles.headerSection}>
        <TitleSize 
            title="Patient Registry" 
            subtitle="Clinical management of patient dermatological profiles and activity." 
        />
      </div>

      <div style={styles.statsGrid}>
        <StatCard title="Registered Patients" value={stats.total} icon={Users} color="#0f172a" />
        <StatCard title="Active Consultations" value={stats.active} icon={Activity} color={dermaPrimary} type="active" />
        <StatCard title="Archived Records" value={stats.inactive} icon={UserX} color="#94a3b8" type="inactive" />
      </div>

      <div style={styles.tableContainer}>
        <div style={styles.filterBar}>
          <div style={styles.searchWrapper}>
            <Search size={18} style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search patients by name or clinical ID..."
              className="filter-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          <div 
            style={styles.dropdownContainer} 
            onClick={(e) => {
              e.stopPropagation();
              setIsDropdownOpen(!isDropdownOpen);
            }}
          >
            <div style={{...styles.dropdownTrigger, borderColor: isDropdownOpen ? dermaPrimary : '#e2e8f0'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                <Filter size={14} style={{color: isDropdownOpen ? dermaPrimary : '#94a3b8'}} />
                <span style={{fontSize: '13px', fontWeight: 700, color: '#334155', letterSpacing: '0.02em'}}>
                  {genderFilter === 'All' ? 'All Genders' : genderFilter}
                </span>
              </div>
              <ChevronDown 
                size={14} 
                style={{
                  transition: 'transform 0.3s ease', 
                  transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  color: '#94a3b8'
                }} 
              />
            </div>

            {isDropdownOpen && (
              <div style={styles.dropdownMenu}>
                {genderOptions.map((g) => (
                  <div
                    key={g}
                    className="dropdown-item"
                    onClick={() => setGenderFilter(g)}
                    style={{
                      ...styles.dropdownItem,
                      color: genderFilter === g ? dermaPrimary : '#64748b',
                    }}
                  >
                    {g === "All" ? "All Genders" : g}
                    {genderFilter === g && <div style={styles.activeDot} />}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <UsersTable 
          users={currentData} 
          loading={loading} 
          onView={handleViewUser}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalResults={filteredUsers.length}
        />
      </div>

      <UserDetailDrawer 
        isOpen={isDrawerOpen} 
        onClose={handleCloseDrawer} 
        user={selectedUser} 
      />
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: { padding: '0px' },
  center: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' },
  headerSection: { marginBottom: "32px" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px", marginBottom: "40px" },
  statCard: { 
    background: "#fff", padding: "28px", borderRadius: "24px", border: "1px solid #f1f5f9", 
    position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", 
    justifyContent: "space-between", minHeight: "160px", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" 
  },
  statHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" },
  statIconWrapper: { width: "44px", height: "44px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center" },
  analyticsBadge: { display: "flex", alignItems: "center", fontSize: "10px", fontWeight: 800, background: "#f8fafc", padding: "5px 12px", borderRadius: "20px", textTransform: 'uppercase', letterSpacing: '0.05em' },
  pulseDot: { width: "8px", height: "8px", borderRadius: "50%", background: "#14b8a6", marginRight: "8px", position: 'relative', boxShadow: '0 0 0 2px rgba(20, 184, 166, 0.2)', animation: "pulse 2s infinite ease-in-out" },
  statBody: { zIndex: 2, marginTop: 'auto' },
  statLabel: { fontSize: "12px", color: "#94a3b8", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' },
  statValue: { margin: "0 0 4px 0", fontSize: "32px", fontWeight: 800, color: "#1e293b", letterSpacing: '-0.02em' },
  gridDecoration: { position: "absolute", inset: 0, opacity: 0.03, pointerEvents: 'none', backgroundImage: 'radial-gradient(#14b8a6 0.5px, transparent 0.5px)', backgroundSize: '12px 12px' },
  tableContainer: { background: "#fff", borderRadius: "28px", border: "1px solid #f1f5f9", boxShadow: "0 10px 30px rgba(0,0,0,0.02)" },
  filterBar: { padding: "28px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap" },
  searchWrapper: { position: "relative", width: "420px", maxWidth: "100%" },
  searchIcon: { position: "absolute", left: "18px", top: "50%", transform: "translateY(-50%)", color: "#cbd5e1" },
  searchInput: { width: "100%", padding: "14px 16px 14px 52px", borderRadius: "16px", border: "1px solid #f1f5f9", background: "#f8fafc", outline: "none", transition: "all 0.3s ease", fontSize: '14px', color: '#334155' },
  dropdownContainer: { position: "relative", width: "200px", cursor: "pointer" },
  dropdownTrigger: { 
    display: "flex", alignItems: "center", justifyContent: "space-between", 
    padding: "14px 18px", borderRadius: "16px", border: "1px solid #f1f5f9", 
    backgroundColor: "#fff", transition: "all 0.3s ease" 
  },
  dropdownMenu: { 
    position: "absolute", top: "calc(100% + 10px)", left: 0, right: 0, 
    backgroundColor: "#fff", borderRadius: "18px", border: "1px solid #f1f5f9", 
    boxShadow: "0 20px 40px rgba(0,0,0,0.08)", padding: "8px", zIndex: 100 
  },
  dropdownItem: { 
    padding: "12px 14px", borderRadius: "12px", fontSize: "14px", fontWeight: 600, 
    display: "flex", alignItems: "center", justifyContent: "space-between", transition: "all 0.2s ease" 
  },
  activeDot: { width: "5px", height: "5px", borderRadius: "50%", backgroundColor: "#14b8a6" }
};