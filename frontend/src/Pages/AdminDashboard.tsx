// Pages/AdminDashboard.tsx
import { memo, useEffect } from "react";
import { motion } from "framer-motion";
import { useAdminContext } from "../Contexts/AdminContext";
import AdminStatsGrid from "../Components/AdminComponents/AdminStatsGrid";
import UserGrowthChart from "../Components/AdminComponents/UserGrowthChart";
import TaskStatusChart from "../Components/AdminComponents/TaskStatusChart";
import TaskCompletionWidget from "../Components/AdminComponents/TaskCompletionWidget";
import TopAssigneesWidget from "../Components/AdminComponents/TopAssigneesWidget";
import AdminActivityFeed from "../Components/AdminComponents/AdminActivityFeed";

const AdminDashboard = () => {
  const {
    overview, loadingOverview, getAdminDashboard,
    analytics, loadingAnalytics, getAdminAnalytics,
  } = useAdminContext();

  useEffect(() => {
    getAdminDashboard();
    getAdminAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loading = loadingOverview || loadingAnalytics || !overview || !analytics;

  if (loading) {
    return <AdminDashboardSkeleton />;
  }

  return (
    <section>
      {/* Header */}
      <div style={{ marginBottom: 22 }}>
        <h1 style={{
          fontFamily: "'Instrument Sans', sans-serif", fontSize: 22, fontWeight: 600,
          color: "#F4F2EC", letterSpacing: "-0.01em", margin: "0 0 4px",
        }}>
          Admin overview
        </h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#8D897E", margin: 0 }}>
          Platform-wide stats across all users, projects, and tasks.
        </p>
      </div>

      <AdminStatsGrid stats={overview.stats} />

      {/* Charts row — growth (2/3) + status donut (1/3) */}
      <div
        className="max-[900px]:!grid-cols-1"
        style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }}
      >
        <UserGrowthChart data={analytics.userGrowth} />
        <TaskStatusChart
          totalTasks={overview.stats.totalTasks}
          completedTasks={overview.stats.completedTasks}
          overdueTasks={overview.stats.overdueTasks}
        />
      </div>

      {/* Completion vs top assignees */}
      <div
        className="max-[900px]:!grid-cols-1"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}
      >
        <TaskCompletionWidget
          thisWeek={analytics.taskCompletion.thisWeek}
          lastWeek={analytics.taskCompletion.lastWeek}
          percentChange={analytics.taskCompletion.percentChange}
        />
        <TopAssigneesWidget data={analytics.mostActiveUsers} />
      </div>

      <AdminActivityFeed logs={overview.recentActivity} />
    </section>
  );
};


// ============================================================
// Loading skeleton
// ============================================================

const AdminDashboardSkeleton = () => (
  <section>
    <div style={{ height: 46, width: 260, borderRadius: 8, background: "#15161B", marginBottom: 22 }} />

    <div
      className="max-[900px]:!grid-cols-3 max-[560px]:!grid-cols-2"
      style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12, marginBottom: 22 }}
    >
      {Array.from({ length: 6 }).map((_, i) => <SkeletonBlock key={i} height={92} />)}
    </div>

    <div
      className="max-[900px]:!grid-cols-1"
      style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }}
    >
      <SkeletonBlock height={320} />
      <SkeletonBlock height={320} />
    </div>

    <div
      className="max-[900px]:!grid-cols-1"
      style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}
    >
      <SkeletonBlock height={320} />
      <SkeletonBlock height={320} />
    </div>

    <SkeletonBlock height={280} />
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

export default memo(AdminDashboard);
