// Components/AdminComponents/TaskStatusChart.tsx
import { memo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface TaskStatusChartProps {
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div
      style={{
        background: "#0D0E12", border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 8, padding: "8px 12px",
      }}
    >
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#F4F2EC", margin: 0 }}>
        {p.name}: <strong>{p.value}</strong>
      </p>
    </div>
  );
};

const TaskStatusChart = ({ totalTasks, completedTasks, overdueTasks }: TaskStatusChartProps) => {
  const other = Math.max(totalTasks - completedTasks - overdueTasks, 0);
  const data = [
    { name: "Completed", value: completedTasks, color: "#5FBF8B" },
    { name: "In progress", value: other, color: "#7B9BE8" },
    { name: "Overdue", value: overdueTasks, color: "#E8654F" },
  ].filter(d => d.value > 0);

  return (
    <div
      style={{
        background: "#15161B", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 14, padding: "20px 18px", height: 320,
        display: "flex", flexDirection: "column",
      }}
    >
      <h3 style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: 15, fontWeight: 600, color: "#F4F2EC", margin: "0 0 3px", letterSpacing: "-0.01em" }}>
        Task status
      </h3>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#8D897E", margin: "0 0 8px" }}>
        {totalTasks} task{totalTasks !== 1 ? "s" : ""} total
      </p>

      {totalTasks === 0 ? (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#5B5850", margin: 0 }}>No tasks yet</p>
        </div>
      ) : (
        <>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="62%"
                  outerRadius="88%"
                  paddingAngle={3}
                  strokeWidth={0}
                >
                  {data.map(d => (
                    <Cell key={d.name} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 14px", justifyContent: "center", marginTop: 4 }}>
            {data.map(d => (
              <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: d.color, flexShrink: 0 }} />
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11.5, color: "#8D897E" }}>
                  {d.name} <span style={{ color: "#C9C5B9", fontWeight: 500 }}>{d.value}</span>
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default memo(TaskStatusChart);
