import { memo } from "react";
import { motion } from "framer-motion";

const CYCLE = 3.6; // seconds, shared timing for the whole demo loop

const RealtimeCollaboration = () => (
    <section
        style={{
            background: "#0A0B0F",
            padding: "120px 24px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
    >
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: 72 }}>
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 11, fontWeight: 500, letterSpacing: "0.1em",
                        color: "#5FBF8B", textTransform: "uppercase",
                        marginBottom: 18,
                    }}
                >
                    Real-time sync
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.07 }}
                    style={{
                        fontFamily: "'Instrument Sans', sans-serif",
                        fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 600,
                        color: "#F4F2EC", lineHeight: 1.2, letterSpacing: "-0.02em",
                        margin: "0 0 14px",
                    }}
                >
                    Your team sees changes{" "}
                    <span style={{ color: "#5FBF8B" }}>as they happen</span>
                </motion.h2>
            </div>

            {/* Two-panel live demo */}
            <div
                className="max-[760px]:!grid-cols-1"
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 90px 1fr",
                    alignItems: "center",
                    gap: 0,
                }}
            >
                {/* Ahmed's screen */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    style={{
                        background: "#15161B",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 14, padding: "20px 20px 22px",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                        <div style={{
                            width: 22, height: 22, borderRadius: "50%", background: "#E8A33D",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 600, color: "#151116",
                            flexShrink: 0,
                        }}>
                            A
                        </div>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#C9C5B9" }}>
                            Ahmed · Website Redesign
                        </span>
                    </div>

                    <div style={{
                        background: "#1B1C22", border: "1px solid rgba(255,255,255,0.06)",
                        borderRadius: 9, padding: "12px 14px",
                    }}>
                        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#F0EEE7", marginBottom: 10 }}>
                            Authentication
                        </div>
                        <motion.div
                            animate={{
                                color: ["#5B5850", "#5B5850", "#E8A33D", "#E8A33D", "#5B5850"],
                                borderColor: [
                                    "rgba(255,255,255,0.12)", "rgba(255,255,255,0.12)",
                                    "rgba(232,163,61,0.4)", "rgba(232,163,61,0.4)",
                                    "rgba(255,255,255,0.12)",
                                ],
                            }}
                            transition={{ duration: CYCLE, repeat: Infinity, times: [0, 0.08, 0.14, 0.85, 0.95] }}
                            style={{
                                display: "inline-flex", alignItems: "center", gap: 5,
                                fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, fontWeight: 500,
                                border: "1px solid", borderRadius: 5, padding: "3px 8px",
                                letterSpacing: "0.04em",
                            }}
                        >
                            <motion.span
                                animate={{ opacity: [0, 0, 1, 1, 0] }}
                                transition={{ duration: CYCLE, repeat: Infinity, times: [0, 0.08, 0.14, 0.85, 0.95] }}
                            >
                                IN PROGRESS
                            </motion.span>
                            <motion.span
                                animate={{ opacity: [1, 1, 0, 0, 1], position: "absolute" }}
                                transition={{ duration: CYCLE, repeat: Infinity, times: [0, 0.08, 0.14, 0.85, 0.95] }}
                                style={{ marginLeft: -68 }}
                            >
                                TODO
                            </motion.span>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Connector */}
                <div
                    className="max-[760px]:!h-[64px] max-[760px]:!w-[2px] max-[760px]:!mx-auto"
                    style={{
                        position: "relative", height: 2, width: "100%",
                        background: "rgba(255,255,255,0.08)",
                    }}
                >
                    <span style={{
                        position: "absolute", top: -9, left: "50%", transform: "translateX(-50%)",
                        fontFamily: "'JetBrains Mono', monospace", fontSize: 8.5, letterSpacing: "0.08em",
                        color: "#3A3833", background: "#0A0B0F", padding: "0 6px",
                    }}
                        className="max-[760px]:hidden"
                    >
                        WS
                    </span>

                    <motion.span
                        animate={{
                            left: ["0%", "0%", "96%", "96%", "0%"],
                            top: undefined,
                        }}
                        transition={{ duration: CYCLE, repeat: Infinity, times: [0, 0.1, 0.32, 0.9, 1] }}
                        className="max-[760px]:!left-auto max-[760px]:!top-0"
                        style={{
                            position: "absolute", top: -3, width: 8, height: 8, borderRadius: "50%",
                            background: "#5FBF8B", boxShadow: "0 0 10px #5FBF8B",
                        }}
                    />
                </div>

                {/* Yanis's screen */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    style={{
                        background: "#15161B",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 14, padding: "20px 20px 22px",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{
                                width: 22, height: 22, borderRadius: "50%", background: "#7B9BE8",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 600, color: "#151116",
                                flexShrink: 0,
                            }}>
                                Y
                            </div>
                            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#C9C5B9" }}>
                                Yanis
                            </span>
                        </div>
                        <motion.div
                            animate={{ rotate: [0, 0, -12, 12, 0, 0], scale: [1, 1, 1.15, 1.15, 1, 1] }}
                            transition={{ duration: CYCLE, repeat: Infinity, times: [0, 0.3, 0.36, 0.42, 0.48, 1] }}
                        >
                            <i className="ti ti-bell" style={{ fontSize: 15, color: "#8D897E" }} />
                        </motion.div>
                    </div>

                    <motion.div
                        animate={{ opacity: [0, 0, 1, 1, 0], y: [6, 6, 0, 0, 6] }}
                        transition={{ duration: CYCLE, repeat: Infinity, times: [0, 0.32, 0.4, 0.88, 0.98] }}
                        style={{
                            display: "flex", alignItems: "center", gap: 9,
                            background: "#1B1C22", border: "1px solid rgba(95,191,139,0.25)",
                            borderRadius: 9, padding: "10px 12px",
                        }}
                    >
                        <span style={{
                            width: 20, height: 20, borderRadius: "50%", background: "#E8A33D", flexShrink: 0,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontFamily: "'Inter', sans-serif", fontSize: 9.5, fontWeight: 600, color: "#151116",
                        }}>
                            A
                        </span>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11.5, color: "#C9C5B9", lineHeight: 1.4 }}>
                            Ahmed moved <b style={{ color: "#F4F2EC" }}>Authentication</b> to{" "}
                            <span style={{ color: "#E8A33D" }}>In Progress</span>
                        </span>
                    </motion.div>
                </motion.div>
            </div>

            {/* Closing line */}
            <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                style={{
                    fontFamily: "'Inter', sans-serif", fontSize: 14.5, color: "#8D897E",
                    lineHeight: 1.7, textAlign: "center", maxWidth: 480,
                    margin: "56px auto 0",
                }}
            >
                Task updates, comments, assignments and notifications are
                synchronized instantly across your workspace.
            </motion.p>
        </div>
    </section>
);

export default memo(RealtimeCollaboration);