// Components/DashboardComponents/StatsOverview.tsx
import { memo } from "react";
import StatCard from "./StatCard";
import type { DashboardStats } from "../../Types/Types";

interface StatsOverviewProps {
  stats: DashboardStats;
}

const StatsOverview = ({ stats }: StatsOverviewProps) => (
  <div
    className="max-[560px]:!grid-cols-2 max-[560px]:!gap-2.5"
    style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 22 }}
  >
    <StatCard label="Total tasks" value={stats.total} icon="ti-checklist" color="#7B9BE8" index={0} />
    <StatCard label="In progress" value={stats.inProgress} icon="ti-progress" color="#B98CE8" index={1} />
    <StatCard label="Completed" value={stats.completed} icon="ti-circle-check" color="#5FBF8B" index={2} />
    <StatCard label="Overdue" value={stats.overdue} icon="ti-alert-triangle" color="#E8654F" index={3} />
  </div>
);

export default memo(StatsOverview);