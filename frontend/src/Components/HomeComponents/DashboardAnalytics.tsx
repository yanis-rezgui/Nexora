import { memo } from "react";
import { motion } from "framer-motion";

const STATS = [
    { label: "Tasks", value: 24, color: "#8D897E" },
    { label: "Completed", value: 18, color: "#5FBF8B" },
    { label: "In progress", value: 4, color: "#E8A33D" },
    { label: "Review", value: 2, color: "#7B9BE8" },
];

const WEEK_ACTIVITY = [
    { day: "Mon", value: 3 },
    { day: "Tue", value: 5 },
    { day: "Wed", value: 2 },
    { day: "Thu", value: 6 },
    { day: "Fri", value: 4 },
    { day: "Sat", value: 1 },
    { day: "Sun", value: 0 },
];

const MAX_ACTIVITY = Math.max(...WEEK_ACTIVITY.map(d => d.value));

const ProgressRing = ({ percent, size = 132 }: { percent: number; size?: number }) => {
    const stroke = 10;
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;

    return (
        <div style={{ position: "relative", width: size, height: size }}>
            <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
                <circle
                    cx={size / 2} cy={size / 2} r={radius}
                    stroke="#1B1C22" strokeWidth={stroke} fill="none"
                />
                <motion.circle
                    cx={size / 2} cy={size / 2} r={radius}
                    stroke="#E8A33D" strokeWidth={stroke} fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    whileInView={{ strokeDashoffset: circumference * (1 - percent / 100) }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                />
            </svg>
            <div style={{
                position: "absolute", inset: 0,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            }}>
                <span style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: 26, fontWeight: 600, color: "#F4F2EC" }}>
                    {percent}%
                </span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "#5B5850" }}>
                    complete
                </span>
            </div>
        </div>
    );
};

const ActivityChart = () => (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 100 }}>
        {WEEK_ACTIVITY.map((d, i) => (
            <div key={d.day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, height: "100%", justifyContent: "flex-end" }}>
                <motion.div
                    initial={{ height: 0 }}
                    whileInView={{ height: `${(d.value / MAX_ACTIVITY) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.06, ease: "easeOut" }}
                    style={{
                        width: "100%", minHeight: d.value === 0 ? 2 : 0,
                        borderRadius: 4,
                        background: i === 3 ? "#E8A33D" : "#2A2B32",
                    }}
                />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "#5B5850" }}>
                    {d.day}
                </span>
            </div>
        ))}
    </div>
);

const DashboardAnalytics = () => (
    <section
        style={{
            background: "#0D0E12",
            padding: "110px 24px 90px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
    >
        <div style={{ maxWidth: 940, margin: "0 auto" }}>
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: 56 }}>
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 11, fontWeight: 500, letterSpacing: "0.1em",
                        color: "#E8A33D", textTransform: "uppercase",
                        marginBottom: 18,
                    }}
                >
                    Analytics
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.07 }}
                    style={{
                        fontFamily: "'Instrument Sans', sans-serif",
                        fontSize: "clamp(24px, 3.6vw, 38px)", fontWeight: 600,
                        color: "#F4F2EC", lineHeight: 1.2, letterSpacing: "-0.02em",
                        margin: "0 0 14px",
                    }}
                >
                    Know where your{" "}
                    <span style={{ color: "#E8A33D" }}>projects stand</span>
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.13 }}
                    style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 15, color: "#8D897E", lineHeight: 1.7,
                        maxWidth: 460, margin: "0 auto",
                    }}
                >
                    Nexora isn't just a kanban board — it shows you the shape
                    of your team's progress at a glance.
                </motion.p>
            </div>

            {/* Panel */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                style={{
                    background: "#111218",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 16, padding: "28px",
                    boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
                }}
            >
                {/* Stats row */}
                <div
                    className="max-[600px]:!grid-cols-2"
                    style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, marginBottom: 28 }}
                >
                    {STATS.map((s, i) => (
                        <div
                            key={s.label}
                            style={{
                                textAlign: "center", padding: "6px 8px",
                                borderRight: i < STATS.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                            }}
                            className={i % 2 === 1 ? "max-[600px]:!border-r-0" : ""}
                        >
                            <div style={{
                                fontFamily: "'Instrument Sans', sans-serif",
                                fontSize: 28, fontWeight: 600, color: s.color,
                                marginBottom: 4,
                            }}>
                                {s.value}
                            </div>
                            <div style={{
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: 10, color: "#8D897E", textTransform: "uppercase",
                                letterSpacing: "0.05em",
                            }}>
                                {s.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Ring + chart */}
                <div
                    className="max-[640px]:!grid-cols-1"
                    style={{
                        display: "grid", gridTemplateColumns: "auto 1fr", gap: 32,
                        alignItems: "center",
                        borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 28,
                    }}
                >
                    <div className="max-[640px]:!mx-auto" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                        <ProgressRing percent={78} />
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: "#5B5850" }}>
                            Website Redesign
                        </span>
                    </div>

                    <div>
                        <div style={{
                            fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#8D897E",
                            textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 14,
                        }}>
                            Activity this week
                        </div>
                        <ActivityChart />
                    </div>
                </div>
            </motion.div>
        </div>
    </section>
);

export default memo(DashboardAnalytics);