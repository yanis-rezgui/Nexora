import { memo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Scattered tool chips that visually converge into the workspace card.
// Encodes the product's actual pitch ("scattered work -> one workspace")
// instead of a generic badge + glow.
const TOOL_NODES = [
    { label: "Chat",     top: "4%",   left: "2%",  color: "#5FBF8B" },
    { label: "Docs",     top: "2%",   left: "78%", color: "#E8A33D" },
    { label: "Files",    top: "78%",  left: "0%",  color: "#7B9BE8" },
    { label: "Calendar", top: "80%",  left: "80%", color: "#E8654F" },
];

const WorkspacePreview = () => (
    <div style={{ position: "relative", width: "100%", maxWidth: 460, margin: "0 auto" }}>
        <svg
            viewBox="0 0 460 420"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
        >
            {[
                { x1: 46, y1: 40, x2: 168, y2: 148 },
                { x1: 396, y1: 30, x2: 292, y2: 140 },
                { x1: 30, y1: 352, x2: 158, y2: 268 },
                { x1: 402, y1: 366, x2: 300, y2: 270 },
            ].map((l, i) => (
                <motion.line
                    key={i}
                    x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
                    stroke="rgba(232,163,61,0.28)"
                    strokeWidth={1}
                    strokeDasharray="4 4"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.9, delay: 0.5 + i * 0.1, ease: "easeOut" }}
                />
            ))}
        </svg>

        {TOOL_NODES.map((node, i) => (
            <motion.div
                key={node.label}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.25 + i * 0.08 }}
                style={{
                    position: "absolute", top: node.top, left: node.left,
                    display: "flex", alignItems: "center", gap: 6,
                    background: "#15161B",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 20, padding: "5px 11px 5px 7px",
                    zIndex: 2,
                }}
            >
                <span style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: node.color, flexShrink: 0,
                }} />
                <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10.5, color: "#8D897E",
                }}>
                    {node.label}
                </span>
            </motion.div>
        ))}

        {/* Central workspace card */}
        <motion.div
            initial={{ opacity: 0, y: 16, rotate: -1.5 }}
            animate={{ opacity: 1, y: 0, rotate: -1.5 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            style={{
                position: "relative", zIndex: 3,
                margin: "84px auto 0", width: "82%",
                background: "#15161B",
                border: "1px solid rgba(255,255,255,0.09)",
                borderRadius: 14,
                boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
                overflow: "hidden",
            }}
        >
            {/* Card header */}
            <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "12px 16px",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
            }}>
                <span style={{
                    fontFamily: "'Instrument Sans', sans-serif",
                    fontSize: 13, fontWeight: 600, color: "#F4F2EC",
                }}>
                    Product Launch
                </span>
                <div style={{ display: "flex", marginLeft: 8 }}>
                    {["#E8A33D", "#5FBF8B", "#7B9BE8"].map((c, i) => (
                        <div key={i} style={{
                            width: 18, height: 18, borderRadius: "50%",
                            background: c, border: "2px solid #15161B",
                            marginLeft: i === 0 ? 0 : -6,
                        }} />
                    ))}
                </div>
            </div>

            {/* Columns */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1, background: "rgba(255,255,255,0.06)" }}>
                {[
                    { label: "To do", items: ["Landing copy"] },
                    { label: "In progress", items: ["Auth flow", "Kanban API"], live: true },
                    { label: "Done", items: ["DB schema"] },
                ].map(col => (
                    <div key={col.label} style={{ background: "#15161B", padding: "12px 10px" }}>
                        <div style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: 9.5, color: "#8D897E", textTransform: "uppercase",
                            letterSpacing: "0.06em", marginBottom: 10,
                        }}>
                            {col.label}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            {col.items.map((item, i) => (
                                <div key={item} style={{
                                    background: "#1B1C22",
                                    border: "1px solid rgba(255,255,255,0.06)",
                                    borderRadius: 7, padding: "7px 8px",
                                    fontSize: 10.5, color: "#C9C5B9",
                                    display: "flex", alignItems: "center", gap: 5,
                                }}>
                                    {col.live && i === 0 && (
                                        <motion.span
                                            animate={{ opacity: [1, 0.3, 1] }}
                                            transition={{ duration: 1.6, repeat: Infinity }}
                                            style={{
                                                width: 5, height: 5, borderRadius: "50%",
                                                background: "#5FBF8B", flexShrink: 0,
                                            }}
                                        />
                                    )}
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    </div>
);

const Hero = () => {
    const navigate = useNavigate();

    return (
        <section
            id="hero"
            style={{
                background: "#0D0E12",
                minHeight: "92vh",
                display: "flex",
                alignItems: "center",
                padding: "128px 24px 60px",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Faint warm vignette, kept subtle on purpose */}
            <div style={{
                position: "absolute", top: -120, left: "20%",
                width: 560, height: 320,
                background: "radial-gradient(ellipse, rgba(232,163,61,0.08) 0%, transparent 70%)",
                pointerEvents: "none",
            }} />

            <div style={{
                maxWidth: 1120, margin: "0 auto", width: "100%",
                display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48,
                alignItems: "center", position: "relative", zIndex: 1,
            }}
                className="max-[880px]:!grid-cols-1"
            >
                {/* Left — copy */}
                <div className="max-[880px]:text-center max-[880px]:!items-center" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: 11.5, fontWeight: 500, letterSpacing: "0.08em",
                            color: "#E8A33D", textTransform: "uppercase",
                            marginBottom: 22,
                        }}
                    >
                        Built for dev teams
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, delay: 0.08 }}
                        style={{
                            fontFamily: "'Instrument Sans', sans-serif",
                            fontSize: "clamp(34px, 4.6vw, 54px)",
                            fontWeight: 600, lineHeight: 1.1,
                            color: "#F4F2EC", letterSpacing: "-0.02em",
                            margin: "0 0 20px", maxWidth: 480,
                        }}
                    >
                        Your team's work,{" "}
                        <span style={{ color: "#E8A33D" }}>in one place</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, delay: 0.16 }}
                        style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: 15.5, color: "#8D897E", lineHeight: 1.7,
                            maxWidth: 430, margin: "0 0 32px",
                        }}
                    >
                        Plan projects, assign tasks, and watch progress update in real
                        time — without switching between five different tools to find
                        out what your team is doing.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, delay: 0.24 }}
                        style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
                    >
                        <button
                            onClick={() => navigate("/register")}
                            style={{
                                background: "#E8A33D", color: "#151116",
                                fontFamily: "'Inter', sans-serif",
                                fontSize: 14, fontWeight: 600,
                                padding: "12px 24px", borderRadius: 8, border: "none",
                                cursor: "pointer", transition: "opacity 0.2s, transform 0.15s",
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.opacity = "0.88";
                                e.currentTarget.style.transform = "translateY(-1px)";
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.opacity = "1";
                                e.currentTarget.style.transform = "translateY(0)";
                            }}
                        >
                            Start for free →
                        </button>

                        <a
                            href="#how"
                            style={{
                                background: "transparent",
                                border: "1px solid rgba(255,255,255,0.14)",
                                color: "#C9C5B9",
                                fontFamily: "'Inter', sans-serif",
                                fontSize: 14, fontWeight: 500,
                                padding: "11px 24px", borderRadius: 8,
                                textDecoration: "none", display: "inline-block",
                                transition: "border-color 0.2s, color 0.2s",
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.borderColor = "rgba(255,255,255,0.28)";
                                e.currentTarget.style.color = "#F4F2EC";
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)";
                                e.currentTarget.style.color = "#C9C5B9";
                            }}
                        >
                            See how it works
                        </a>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: 11.5, color: "#5B5850", marginTop: 20,
                        }}
                    >
                        No credit card required · Free for small teams
                    </motion.p>
                </div>

                {/* Right — signature visual */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="max-[880px]:mt-6"
                >
                    <WorkspacePreview />
                </motion.div>
            </div>
        </section>
    );
};

export default memo(Hero);
