// Pages/Dashboard.tsx
import { memo, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useAuthContext } from "../Contexts/AuthContext";
import { useDashboardContext } from "../Contexts/DashboardContext";
import StatsOverview from "../Components/DashboardComponents/StatsOverview";
import MyTasksWidget from "../Components/DashboardComponents/MyTasksWidget";
import RecentActivityWidget from "../Components/DashboardComponents/RecentActivityWidget";
import ProjectsOverviewWidget from "../Components/DashboardComponents/ProjectsOverviewWidget";
import TeamWorkloadWidget from "../Components/DashboardComponents/TeamWorkloadWidget";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const Dashboard = () => {
  const { user } = useAuthContext();
  const { overview, loadingOverview, getDashboardOverview } = useDashboardContext();

  useEffect(() => {
    getDashboardOverview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const greeting = useMemo(() => getGreeting(), []);

  if (loadingOverview || !overview) {
    return <DashboardSkeleton />;
  }

  return (
    <section>
      {/* Header */}
      <div style={{ marginBottom: 22 }}>
        <h1 style={{
          fontFamily: "'Instrument Sans', sans-serif", fontSize: 22, fontWeight: 600,
          color: "#F4F2EC", letterSpacing: "-0.01em", margin: "0 0 4px",
        }}>
          {greeting}, {user?.firstName} 👋
        </h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#8D897E", margin: 0 }}>
          Here's what's happening with your projects today.
        </p>
      </div>

      <StatsOverview stats={overview.stats} />

      {/* My Tasks + Activity — stacks to 1 column under 900px */}
      <div
        className="max-[900px]:!grid-cols-1"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
      >
        <MyTasksWidget tasks={overview.myTasks} />
        <RecentActivityWidget logs={overview.recentActivity} />
      </div>

      <ProjectsOverviewWidget projects={overview.projects} />

      {overview.isManager && (
        <TeamWorkloadWidget workload={overview.teamWorkload} />
      )}
    </section>
  );
};


// ============================================================
// Loading skeleton
// ============================================================

const DashboardSkeleton = () => (
  <section>
    <div style={{ height: 46, width: 260, borderRadius: 8, background: "#15161B", marginBottom: 22 }} />

    <div
      className="max-[560px]:!grid-cols-2"
      style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 22 }}
    >
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonBlock key={i} height={70} />
      ))}
    </div>

    <div
      className="max-[900px]:!grid-cols-1"
      style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}
    >
      <SkeletonBlock height={280} />
      <SkeletonBlock height={280} />
    </div>

    <SkeletonBlock height={200} />
  </section>
);

const SkeletonBlock = ({ height }: { height: number }) => (
  <div style={{
    height, borderRadius: 14, background: "#15161B",
    border: "1px solid rgba(255,255,255,0.06)", position: "relative", overflow: "hidden",
  }}>
    <motion.div
      animate={{ x: ["-100%", "200%"] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
      style={{
        position: "absolute", inset: 0, width: "60%",
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)",
      }}
    />
  </div>
);

export default memo(Dashboard);