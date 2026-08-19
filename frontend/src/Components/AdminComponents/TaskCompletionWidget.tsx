// Components/AdminComponents/TaskCompletionWidget.tsx
import { memo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface TaskCompletionWidgetProps {
  thisWeek: number;
  lastWeek: number;
  percentChange: number | null;
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
        {p.payload.label}: <strong>{p.value}</strong> completed
      </p>
    </div>
  );
};

const TaskCompletionWidget = ({ thisWeek, lastWeek, percentChange }: TaskCompletionWidgetProps) => {
  const data = [
    { label: "Last week", value: lastWeek },
    { label: "This week", value: thisWeek },
  ];
  const positive = (percentChange ?? 0) >= 0;

  return (
    <div
      style={{
        background: "#15161B", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 14, padding: "20px 18px", height: 320,
        display: "flex", flexDirection: "column",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8, gap: 10 }}>
        <div>
          <h3 style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: 15, fontWeight: 600, color: "#F4F2EC", margin: "0 0 3px", letterSpacing: "-0.01em" }}>
            Task completion
          </h3>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#8D897E", margin: 0 }}>
            Week over week
          </p>
        </div>

        {percentChange !== null && (
          <span
            style={{
              display: "flex", alignItems: "center", gap: 4, flexShrink: 0,
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, fontWeight: 600,
              color: positive ? "#5FBF8B" : "#E8654F",
              background: positive ? "rgba(95,191,139,0.1)" : "rgba(232,101,79,0.1)",
              border: `1px solid ${positive ? "rgba(95,191,139,0.3)" : "rgba(232,101,79,0.3)"}`,
              borderRadius: 6, padding: "4px 8px",
            }}
          >
            <i className={`ti ${positive ? "ti-trending-up" : "ti-trending-down"}`} style={{ fontSize: 13 }} aria-hidden="true" />
            {Math.abs(percentChange)}%
          </span>
        )}
      </div>

      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 6, left: -18, bottom: 0 }}>
            <XAxis
              dataKey="label"
              tick={{ fontFamily: "'Inter', sans-serif", fontSize: 11.5, fill: "#8D897E" }}
              axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, fill: "#5B5850" }}
              axisLine={false}
              tickLine={false}
              width={28}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={64}>
              {data.map((d, i) => (
                <Cell key={d.label} fill={i === 1 ? "#E8A33D" : "rgba(232,163,61,0.28)"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default memo(TaskCompletionWidget);
