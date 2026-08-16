// Pages/UserLayout.tsx
import { memo, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import UserHeader from "../Components/GeneralUserComponents/UserHeader";
import Sidebar from "../Components/GeneralUserComponents/Sidebar";


const MOBILE_BREAKPOINT = 880;

const UserLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(
    () => typeof window !== "undefined" ? window.innerWidth > MOBILE_BREAKPOINT : true
  );
  const [isMobile, setIsMobile] = useState<boolean>(
    () => typeof window !== "undefined" ? window.innerWidth <= MOBILE_BREAKPOINT : false
  );

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= MOBILE_BREAKPOINT;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <UserHeader
        onToggleSidebar={() => setSidebarOpen(p => !p)}
        sidebarOpen={sidebarOpen}
      />

      <Sidebar
        open={sidebarOpen}
        onNavigate={() => { if (isMobile) setSidebarOpen(false); }}
      />

      {/* Mobile backdrop */}
      {sidebarOpen && isMobile && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed", inset: 0, top: 56,
            background: "rgba(0,0,0,0.55)",
            zIndex: 45,
          }}
        />
      )}

      <main
        style={{
          marginLeft: !isMobile && sidebarOpen ? 220 : 0,
          marginTop: 56,
          padding: isMobile ? 18 : 28,
          transition: "margin-left 0.25s cubic-bezier(.4,0,.2,1)",
          minHeight: "calc(100vh - 56px)",
          background: "#0D0E12",
        }}
      >
        <Outlet />
      </main>
    </>
  );
};

export default memo(UserLayout);