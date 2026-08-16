// Components/GeneralUserComponents/SideBar.tsx
import { memo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuthContext } from "../../Contexts/AuthContext";

interface SidebarProps {
  open: boolean;
  onNavigate?: () => void;
}

interface NavItem {
  label: string;
  icon: string;
  path: string;
  badge?: number;
}

const navMain: NavItem[] = [
  { label: "Overview", icon: "ti-layout-dashboard", path: "/user/dashboard" },
  { label: "Projects", icon: "ti-folder", path: "/user/projects" },
  { label: "My Tasks", icon: "ti-checklist", path: "/user/tasks" },
  { label: "Notifications", icon: "ti-bell", path: "/user/notifications" },
];

const navAccount: NavItem[] = [
  { label: "Settings", icon: "ti-settings", path: "/user/settings" },
];

const Sidebar = ({ open, onNavigate }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuthContext();

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "?";

  const handleNav = (path: string) => {
    navigate(path);
    onNavigate?.();
  };

  const NavRow = ({ label, icon, path, badge }: NavItem) => {
    const active = location.pathname === path;
    return (
      <div
        onClick={() => handleNav(path)}
        style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "9px 16px", margin: "1px 8px", borderRadius: 8,
          cursor: "pointer", position: "relative",
          background: active ? "rgba(232,163,61,0.1)" : "transparent",
          color: active ? "#E8A33D" : "#8D897E",
          fontFamily: "'Inter', sans-serif",
          fontSize: 13.5,
          transition: "background 0.15s, color 0.15s",
        }}
        onMouseEnter={e => {
          if (!active) {
            e.currentTarget.style.background = "rgba(255,255,255,0.05)";
            e.currentTarget.style.color = "#C9C5B9";
          }
        }}
        onMouseLeave={e => {
          if (!active) {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#8D897E";
          }
        }}
      >
        {active && (
          <span style={{
            position: "absolute", left: -8, top: "50%", transform: "translateY(-50%)",
            width: 3, height: 18, background: "#E8A33D", borderRadius: "0 3px 3px 0",
          }} />
        )}
        <i className={`ti ${icon}`} style={{ fontSize: 17, color: active ? "#E8A33D" : "inherit" }} aria-hidden="true" />
        <span style={{ flex: 1 }}>{label}</span>
        {!!badge && (
          <span style={{
            background: "rgba(232,163,61,0.16)", color: "#E8A33D",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 10,
          }}>
            {badge}
          </span>
        )}
      </div>
    );
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          key="sidebar"
          initial={{ x: -220, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -220, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          style={{
            background: "#0A0B0F",
            borderRight: "1px solid rgba(255,255,255,0.06)",
            height: "calc(100vh - 56px)",
            position: "fixed", top: 56, left: 0,
            zIndex: 50, overflow: "hidden", flexShrink: 0,
          }}
          aria-label="Main navigation"
        >
          <div style={{ width: 220, height: "100%", display: "flex", flexDirection: "column", padding: "18px 0" }}>

            <p style={sectionLabel}>Main</p>
            {navMain.map(item => <NavRow key={item.path} {...item} />)}

            <p style={{ ...sectionLabel, marginTop: 20 }}>Workspaces</p>
            <div
              onClick={() => handleNav("/user/projects/new")}
              style={{
                display: "flex", alignItems: "center", gap: 9,
                margin: "1px 8px", padding: "9px 16px", borderRadius: 8,
                cursor: "pointer",
                border: "1px dashed rgba(232,163,61,0.35)",
                color: "#E8A33D",
                fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500,
                transition: "background 0.15s, border-color 0.15s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(232,163,61,0.06)";
                e.currentTarget.style.borderColor = "rgba(232,163,61,0.55)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "rgba(232,163,61,0.35)";
              }}
            >
              <i className="ti ti-plus" style={{ fontSize: 15 }} aria-hidden="true" />
              New project
            </div>

            <p style={{ ...sectionLabel, marginTop: 20 }}>Account</p>
            {navAccount.map(item => <NavRow key={item.path} {...item} />)}

            {/* Footer */}
            <div style={{ marginTop: "auto", padding: "12px 8px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <div
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: 8, borderRadius: 8, cursor: "pointer",
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: "linear-gradient(135deg, #E8A33D, #F2C368)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 600,
                  color: "#151116", flexShrink: 0,
                }}>
                  {initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: "'Inter', sans-serif", fontSize: 12.5, fontWeight: 500,
                    color: "#C9C5B9", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}>
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: "#5B5850" }}>
                    Free plan
                  </div>
                </div>
                <i
                  className="ti ti-logout"
                  style={{ fontSize: 16, color: "#5B5850", transition: "color 0.15s", flexShrink: 0 }}
                  aria-hidden="true"
                  title="Sign out"
                  onClick={e => { e.stopPropagation(); signOut(); }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#E8654F")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#5B5850")}
                />
              </div>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

const sectionLabel: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 10, fontWeight: 500, letterSpacing: "0.08em",
  textTransform: "uppercase", color: "#3A3833",
  padding: "0 16px", marginBottom: 6,
};

export default memo(Sidebar);