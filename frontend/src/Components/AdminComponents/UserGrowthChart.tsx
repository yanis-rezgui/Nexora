// Components/AdminComponents/UserGrowthChart.tsx
import { memo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface UserGrowthPoint {
  month: string; // "YYYY-MM"
  count: number;
}

const formatMonth = (m: string) => {
  const [y, mo] = m.split("-");
  if (!y || !mo) return m;
  const date = new Date(Number(y), Number(mo) - 1);
  return date.toLocaleDateString("en-US", { month: "short" });
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#0D0E12", border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 8, padding: "8px 12px",
      }}
    >
      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: "#8D897E", margin: "0 0 2px" }}>
        {formatMonth(label)}
      </p>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#F4F2EC", margin: 0 }}>
        {payload[0].value} new user{payload[0].value !== 1 ? "s" : ""}
      </p>
    </div>
  );
};

const UserGrowthChart = ({ data }: { data: UserGrowthPoint[] }) => {
  const hasData = data.length > 0 && data.some(d => d.count > 0);

  return (
    <div
      style={{
        background: "#15161B", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 14, padding: "20px 18px 12px", height: 320,
        display: "flex", flexDirection: "column",
      }}
    >
      <div style={{ marginBottom: 6 }}>
        <h3 style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: 15, fontWeight: 600, color: "#F4F2EC", margin: "0 0 3px", letterSpacing: "-0.01em" }}>
          User growth
        </h3>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#8D897E", margin: 0 }}>
          New sign-ups over the last 6 months
        </p>
      </div>

      {!hasData ? (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#5B5850", margin: 0 }}>No sign-ups yet</p>
        </div>
      ) : (
        <div style={{ flex: 1, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 6, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="userGrowthGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E8A33D" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#E8A33D" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="month"
                tickFormatter={formatMonth}
                tick={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, fill: "#5B5850" }}
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
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(232,163,61,0.3)" }} />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#E8A33D"
                strokeWidth={2}
                fill="url(#userGrowthGradient)"
                dot={{ r: 3, fill: "#E8A33D", strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "#E8A33D" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default memo(UserGrowthChart);
