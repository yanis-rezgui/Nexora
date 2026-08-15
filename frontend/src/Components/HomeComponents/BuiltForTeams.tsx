import { memo } from "react";
import { motion } from "framer-motion";

const AUDIENCES = [
    {
        title: "Small development teams",
        description: "Keep projects organized without unnecessary complexity.",
        tag: "2–10 people",
        color: "#E8A33D",
        span: "wide",
        detail: "board",
    },
    {
        title: "Freelancers",
        description: "Manage multiple clients and projects from one workspace.",
        tag: "1 person, many clients",
        color: "#7B9BE8",
        span: "narrow",
        detail: "clients",
    },
    {
        title: "Students & university teams",
        description: "Organize group projects and keep everyone on track.",
        tag: "Free for classes",
        color: "#5FBF8B",
        span: "narrow",
        detail: "group",
    },
    {
        title: "Growing teams",
        description: "Give everyone clear responsibilities and visibility.",
        tag: "Unlimited members",
        color: "#E8654F",
        span: "wide",
        detail: "roles",
    },
] as const;

const CardDetail = ({ kind, color }: { kind: string; color: string }) => {
    if (kind === "board") {
        return (
            <div style={{ display: "flex", gap: 8 }}>
                {["To do", "Doing", "Done"].map((label, i) => (
                    <div key={label} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8.5, color: "#5B5850", textTransform: "uppercase" }}>
                            {label}
                        </span>
                        <div style={{
                            height: 20 + (i === 1 ? 10 : 0), borderRadius: 5,
                            background: "#1B1C22", border: `1px solid ${i === 1 ? color + "40" : "rgba(255,255,255,0.06)"}`,
                        }} />
                    </div>
                ))}
            </div>
        );
    }
    if (kind === "clients") {
        return (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {["Acme Studio", "North & Co."].map(c => (
                    <div key={c} style={{
                        display: "flex", alignItems: "center", gap: 7,
                        fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#8D897E",
                    }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, flexShrink: 0 }} />
                        {c}
                    </div>
                ))}
            </div>
        );
    }
    if (kind === "group") {
        return (
            <div style={{ display: "flex", marginTop: 2 }}>
                {[color, "#E8A33D", "#7B9BE8", "#8D897E"].map((c, i) => (
                    <div key={i} style={{
                        width: 20, height: 20, borderRadius: "50%",
                        background: c, border: "2px solid #15161B",
                        marginLeft: i === 0 ? 0 : -7,
                    }} />
                ))}
            </div>
        );
    }
    // roles
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
                { role: "Admin", n: 1 },
                { role: "Manager", n: 3 },
                { role: "Developer", n: 12 },
            ].map(r => (
                <div key={r.role} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#8D897E" }}>{r.role}</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color }}>{r.n}</span>
                </div>
            ))}
        </div>
    );
};

const BuiltForTeams = () => (
    <section
        style={{
            background: "#0D0E12",
            padding: "110px 24px 90px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
    >
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
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
                    Built for teams
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
                    Whoever you build with,{" "}
                    <span style={{ color: "#E8A33D" }}>Nexora fits</span>
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.13 }}
                    style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 15, color: "#8D897E", lineHeight: 1.7,
                        maxWidth: 440, margin: "0 auto",
                    }}
                >
                    From a two-person side project to a growing engineering org.
                </motion.p>
            </div>

            {/* Bento grid */}
            <div
                className="max-[720px]:!grid-cols-1"
                style={{
                    display: "grid",
                    gridTemplateColumns: "1.6fr 1fr",
                    gap: 14,
                }}
            >
                {AUDIENCES.map((a, i) => (
                    <motion.div
                        key={a.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.08 }}
                        className={a.span === "wide" ? "" : "max-[720px]:!order-none"}
                        style={{
                            gridColumn: a.span === "wide" ? "auto" : "auto",
                            background: "#15161B",
                            border: "1px solid rgba(255,255,255,0.07)",
                            borderRadius: 14, padding: "24px 24px",
                            display: "flex", flexDirection: "column", gap: 20,
                            transition: "border-color 0.25s",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = `${a.color}45`)}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}
                    >
                        <div>
                            <div style={{
                                display: "inline-block",
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: 9.5, fontWeight: 500, letterSpacing: "0.05em",
                                color: a.color, background: `${a.color}16`,
                                border: `1px solid ${a.color}35`,
                                borderRadius: 5, padding: "3px 8px",
                                marginBottom: 14,
                            }}>
                                {a.tag}
                            </div>
                            <div style={{
                                fontFamily: "'Instrument Sans', sans-serif",
                                fontSize: a.span === "wide" ? 19 : 16,
                                fontWeight: 600, color: "#F4F2EC",
                                marginBottom: 7, letterSpacing: "-0.01em",
                            }}>
                                {a.title}
                            </div>
                            <p style={{
                                fontFamily: "'Inter', sans-serif", fontSize: 13,
                                color: "#8D897E", lineHeight: 1.6, margin: 0,
                                maxWidth: a.span === "wide" ? 340 : "none",
                            }}>
                                {a.description}
                            </p>
                        </div>

                        <div style={{
                            background: "#1B1C22",
                            border: "1px solid rgba(255,255,255,0.05)",
                            borderRadius: 9, padding: "14px 16px",
                            marginTop: "auto",
                        }}>
                            <CardDetail kind={a.detail} color={a.color} />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

export default memo(BuiltForTeams);