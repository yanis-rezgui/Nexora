import { memo } from "react";
import { motion } from "framer-motion";

const FEATURES = [
    {
        title: "Project management",
        description: "Organize your projects and keep your team aligned.",
        visual: "progress",
    },
    {
        title: "Task management",
        description: "Create, assign and track tasks from idea to completion.",
        visual: "checklist",
    },
    {
        title: "Real-time collaboration",
        description: "Changes appear instantly across your team's workspace.",
        visual: "live",
    },
    {
        title: "Team roles",
        description: "Give managers and developers the right permissions.",
        visual: "roles",
    },
    {
        title: "Files & comments",
        description: "Keep discussions and project files attached to the work.",
        visual: "files",
    },
    {
        title: "Activity tracking",
        description: "Know what changed, who changed it and when.",
        visual: "activity",
    },
] as const;

type VisualKind = (typeof FEATURES)[number]["visual"];

const FeatureVisual = ({ kind }: { kind: VisualKind }) => {
    switch (kind) {
        case "progress":
            return (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: "#5B5850" }}>Website Redesign</span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: "#E8A33D" }}>78%</span>
                    </div>
                    <div style={{ height: 5, borderRadius: 3, background: "#1B1C22", overflow: "hidden" }}>
                        <motion.div
                            initial={{ width: "0%" }}
                            whileInView={{ width: "78%" }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            style={{ height: "100%", background: "#E8A33D", borderRadius: 3 }}
                        />
                    </div>
                </div>
            );

        case "checklist":
            return (
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                    {[
                        { label: "Design landing page", done: true },
                        { label: "Build auth flow", done: false },
                        { label: "Write API docs", done: false },
                    ].map(t => (
                        <div key={t.label} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                            <div style={{
                                width: 13, height: 13, borderRadius: 4, flexShrink: 0,
                                border: `1px solid ${t.done ? "#5FBF8B" : "rgba(255,255,255,0.18)"}`,
                                background: t.done ? "#5FBF8B" : "transparent",
                                display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                                {t.done && <i className="ti ti-check" style={{ fontSize: 9, color: "#151116" }} />}
                            </div>
                            <span style={{
                                fontFamily: "'Inter', sans-serif", fontSize: 11.5,
                                color: t.done ? "#5B5850" : "#C9C5B9",
                                textDecoration: t.done ? "line-through" : "none",
                            }}>
                                {t.label}
                            </span>
                        </div>
                    ))}
                </div>
            );

        case "live":
            return (
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <motion.span
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        style={{ width: 7, height: 7, borderRadius: "50%", background: "#5FBF8B", flexShrink: 0 }}
                    />
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11.5, color: "#C9C5B9" }}>
                        Sarah is editing <b style={{ color: "#F4F2EC" }}>Dashboard UI</b>
                    </span>
                </div>
            );

        case "roles":
            return (
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                    {[
                        { name: "Ahmed", role: "Manager", color: "#E8A33D" },
                        { name: "Sarah", role: "Developer", color: "#7B9BE8" },
                    ].map(p => (
                        <div key={p.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11.5, color: "#C9C5B9" }}>{p.name}</span>
                            <span style={{
                                fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                                color: p.color, background: `${p.color}18`,
                                border: `1px solid ${p.color}35`, borderRadius: 4, padding: "2px 7px",
                            }}>
                                {p.role}
                            </span>
                        </div>
                    ))}
                </div>
            );

        case "files":
            return (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{
                        display: "flex", alignItems: "center", gap: 7,
                        background: "#1B1C22", border: "1px solid rgba(255,255,255,0.06)",
                        borderRadius: 6, padding: "6px 9px",
                    }}>
                        <i className="ti ti-paperclip" style={{ fontSize: 12, color: "#8D897E" }} />
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#8D897E" }}>
                            wireframes-v2.fig
                        </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
                        <div style={{
                            width: 16, height: 16, borderRadius: "50%", background: "#7B9BE8", flexShrink: 0,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontFamily: "'Inter', sans-serif", fontSize: 8, fontWeight: 600, color: "#151116",
                        }}>
                            S
                        </div>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#8D897E", lineHeight: 1.4 }}>
                            "Looks good, let's ship it"
                        </span>
                    </div>
                </div>
            );

        case "activity":
            return (
                <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                    {[
                        { text: "Ahmed moved API Auth to Done", time: "2m" },
                        { text: "Sarah added a comment", time: "14m" },
                    ].map(a => (
                        <div key={a.text} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#E8A33D", flexShrink: 0 }} />
                            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#8D897E", flex: 1 }}>
                                {a.text}
                            </span>
                            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: "#5B5850" }}>
                                {a.time}
                            </span>
                        </div>
                    ))}
                </div>
            );
    }
};

const Features = () => (
    <section
        id="features"
        style={{
            background: "#0D0E12",
            padding: "110px 24px 90px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
    >
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
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
                    Features
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
                    Everything a team needs,{" "}
                    <span style={{ color: "#E8A33D" }}>nothing it doesn't</span>
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
                    Six things Nexora does well, instead of fifty it does half-heartedly.
                </motion.p>
            </div>

            {/* Grid */}
            <div
                className="max-[880px]:!grid-cols-2 max-[560px]:!grid-cols-1"
                style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}
            >
                {FEATURES.map((f, i) => (
                    <motion.div
                        key={f.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: (i % 3) * 0.08 }}
                        style={{
                            background: "#15161B",
                            border: "1px solid rgba(255,255,255,0.07)",
                            borderRadius: 13, padding: "22px 20px",
                            display: "flex", flexDirection: "column", gap: 18,
                            transition: "border-color 0.25s",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(232,163,61,0.28)")}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}
                    >
                        <div>
                            <div style={{
                                fontFamily: "'Instrument Sans', sans-serif",
                                fontSize: 15, fontWeight: 600, color: "#F4F2EC",
                                marginBottom: 6,
                            }}>
                                {f.title}
                            </div>
                            <p style={{
                                fontFamily: "'Inter', sans-serif", fontSize: 12.5,
                                color: "#8D897E", lineHeight: 1.6, margin: 0,
                            }}>
                                {f.description}
                            </p>
                        </div>

                        <div style={{
                            background: "#1B1C22",
                            border: "1px solid rgba(255,255,255,0.05)",
                            borderRadius: 9, padding: "13px 14px",
                            marginTop: "auto",
                        }}>
                            <FeatureVisual kind={f.visual} />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

export default memo(Features);