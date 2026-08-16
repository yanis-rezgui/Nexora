// Components/GeneralUserComponents/UserHeader.tsx
import { memo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../Contexts/AuthContext";

interface UserHeaderProps {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

const UserHeader = ({ onToggleSidebar, sidebarOpen }: UserHeaderProps) => {
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-[60] h-[56px] flex items-center justify-between px-4"
      style={{
        background: scrolled ? "rgba(10,11,15,0.92)" : "#0A0B0F",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        transition: "background 0.3s ease, backdrop-filter 0.3s ease",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle navigation"
          style={{
            width: 34, height: 34,
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8, background: "transparent",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "#8D897E",
            transition: "background 0.15s, color 0.15s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "rgba(255,255,255,0.06)";
            e.currentTarget.style.color = "#F4F2EC";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#8D897E";
          }}
        >
          <i
            className={`ti ${sidebarOpen ? "ti-layout-sidebar" : "ti-layout-sidebar-right"}`}
            style={{ fontSize: 17 }}
            aria-hidden="true"
          />
        </button>

        {/* Logo */}
        <a href="/user/dashboard" className="flex items-center gap-2 no-underline">
          <div style={{
            width: 28, height: 28, borderRadius: 7,
            background: "linear-gradient(135deg, #E8A33D, #F2C368)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontFamily: "'Instrument Sans', sans-serif", fontWeight: 700, fontSize: 13, color: "#151116" }}>
              N
            </span>
          </div>
          <span
            className="max-[420px]:hidden"
            style={{
              fontFamily: "'Instrument Sans', sans-serif",
              color: "#F4F2EC", fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em",
            }}
          >
            Nexora
          </span>
        </a>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div
          onClick={() => navigate("/user/notifications")}
          style={{
            width: 32, height: 32, borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#8D897E", cursor: "pointer", position: "relative",
            transition: "background 0.15s, color 0.15s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "rgba(255,255,255,0.06)";
            e.currentTarget.style.color = "#F4F2EC";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#8D897E";
          }}
        >
          <i className="ti ti-bell" style={{ fontSize: 17 }} aria-hidden="true" />
          <span style={{
            position: "absolute", top: 6, right: 6,
            width: 6, height: 6, borderRadius: "50%",
            background: "#E8A33D",
            border: "1.5px solid #0A0B0F",
          }} />
        </div>

        {/* Avatar */}
        <div
          onClick={() => navigate("/user/settings")}
          style={{
            width: 30, height: 30, borderRadius: "50%",
            background: "linear-gradient(135deg, #E8A33D, #F2C368)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Inter', sans-serif",
            fontSize: 11, fontWeight: 600, color: "#151116",
            cursor: "pointer", letterSpacing: "0.02em",
          }}
        >
          {user?.firstName?.[0]}{user?.lastName?.[0]}
        </div>
      </div>
    </header>
  );
};

export default memo(UserHeader);