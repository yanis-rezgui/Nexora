import { memo } from "react";
import { motion } from "framer-motion";

const SCATTERED_TOOLS = [
    { label: "Slack",         top: "0%",   left: "6%",  rotate: -6 },
    { label: "Notion",        top: "4%",   left: "68%", rotate: 4 },
    { label: "Trello",        top: "38%",  left: "0%",  rotate: 5 },
    { label: "Google Drive",  top: "40%",  left: "74%", rotate: -4 },
    { label: "GitHub",        top: "70%",  left: "10%", rotate: -3 },
    { label: "Emails",        top: "72%",  left: "62%", rotate: 6 },
];

const WORKSPACE_ITEMS = ["Projects", "Tasks", "Discussions", "Files", "Team activity"];

const FlowArrow = ({ delay = 0 }: { delay?: number }) => (
    <motion.div
        initial={{ opacity: 0, scaleY: 0.6 }}
        whileInView={{ opacity: 1, scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay }}
        style={{
            width: 1, height: 40, margin: "6px auto",
            background: "linear-gradient(to bottom, rgba(255,255,255,0.18), rgba(255,255,255,0.04))",
        }}
    />
);

const ProblemSolution = () => (
    <section
        style={{
            background: "#0D0E12",
            padding: "110px 24px 100px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
    >
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>

            {/* Problem headline */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11, fontWeight: 500, letterSpacing: "0.1em",
                    color: "#E8654F", textTransform: "uppercase",
                    marginBottom: 16,
                }}
            >
                Sound familiar?
            </motion.div>

            <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.06 }}
                style={{
                    fontFamily: "'Instrument Sans', sans-serif",
                    fontSize: "clamp(24px, 3.6vw, 36px)", fontWeight: 600,
                    color: "#F4F2EC", lineHeight: 1.25, letterSpacing: "-0.02em",
                    margin: "0 0 60px",
                }}
            >
                Too many tools.<br />Too much context switching.
            </motion.h2>

            {/* Scattered tools cloud */}
            <div style={{ position: "relative", height: 190, marginBottom: 8 }}>
                {SCATTERED_TOOLS.map((tool, i) => (
                    <motion.div
                        key={tool.label}
                        initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
                        whileInView={{ opacity: 1, scale: 1, rotate: tool.rotate }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.1 + i * 0.06 }}
                        style={{
                            position: "absolute", top: tool.top, left: tool.left,
                            background: "#15161B",
                            border: "1px solid rgba(232,101,79,0.18)",
                            borderRadius: 8, padding: "6px 12px",
                            fontFamily: "'Inter', sans-serif", fontSize: 12,
                            color: "#8D897E", fontWeight: 500,
                        }}
                    >
                        {tool.label}
                    </motion.div>
                ))}
            </div>

            <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11.5, color: "#5B5850", marginBottom: 4,
                }}
            >
                information scattered everywhere
            </motion.p>

            <FlowArrow delay={0.55} />

            {/* Nexora node */}
            <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.65 }}
                style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    background: "#15161B",
                    border: "1px solid rgba(232,163,61,0.35)",
                    borderRadius: 10, padding: "9px 18px",
                    boxShadow: "0 0 0 4px rgba(232,163,61,0.06)",
                }}
            >
                <div style={{
                    width: 20, height: 20, borderRadius: 6,
                    background: "linear-gradient(135deg, #E8A33D, #F2C368)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                    <span style={{ fontFamily: "'Instrument Sans', sans-serif", fontWeight: 700, fontSize: 11, color: "#151116" }}>
                        N
                    </span>
                </div>
                <span style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: 14, fontWeight: 600, color: "#F4F2EC" }}>
                    Nexora
                </span>
            </motion.div>

            <FlowArrow delay={0.8} />

            {/* Solution card */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.9 }}
                style={{
                    background: "#15161B",
                    border: "1px solid rgba(95,191,139,0.25)",
                    borderRadius: 12, padding: "22px 24px",
                    textAlign: "left",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                    <i className="ti ti-circle-check" style={{ fontSize: 15, color: "#5FBF8B" }} />
                    <span style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 11, fontWeight: 500, letterSpacing: "0.06em",
                        color: "#5FBF8B", textTransform: "uppercase",
                    }}>
                        One shared workspace
                    </span>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {WORKSPACE_ITEMS.map(item => (
                        <span key={item} style={{
                            fontFamily: "'Inter', sans-serif", fontSize: 12.5,
                            color: "#C9C5B9",
                            background: "#1B1C22",
                            border: "1px solid rgba(255,255,255,0.07)",
                            borderRadius: 6, padding: "5px 11px",
                        }}>
                            {item}
                        </span>
                    ))}
                </div>
            </motion.div>

            <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1.05 }}
                style={{
                    fontFamily: "'Inter', sans-serif", fontSize: 14.5, color: "#8D897E",
                    lineHeight: 1.7, marginTop: 24,
                }}
            >
                Nexora brings your team's work together — projects, tasks,
                discussions and files, all in one place.
            </motion.p>
        </div>
    </section>
);

export default memo(ProblemSolution);