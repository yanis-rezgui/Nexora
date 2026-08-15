import { memo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const FinalCTA = () => {
    const navigate = useNavigate();

    return (
        <section
            style={{
                background: "#0D0E12",
                padding: "130px 24px",
                borderTop: "1px solid rgba(255,255,255,0.06)",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Subtle centered glow, echoes the hero */}
            <div style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                width: 520, height: 280,
                background: "radial-gradient(ellipse, rgba(232,163,61,0.1) 0%, transparent 70%)",
                pointerEvents: "none",
            }} />

            <div style={{
                maxWidth: 560, margin: "0 auto", textAlign: "center",
                position: "relative", zIndex: 1,
            }}>
                <motion.h2
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{
                        fontFamily: "'Instrument Sans', sans-serif",
                        fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 600,
                        color: "#F4F2EC", lineHeight: 1.2, letterSpacing: "-0.02em",
                        margin: "0 0 14px",
                    }}
                >
                    Ready to get your team organized?
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.08 }}
                    style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 15, color: "#8D897E", lineHeight: 1.7,
                        margin: "0 0 36px",
                    }}
                >
                    Create your workspace and start building together.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.16 }}
                >
                    <button
                        onClick={() => navigate("/register")}
                        style={{
                            background: "#E8A33D", color: "#151116",
                            fontFamily: "'Inter', sans-serif",
                            fontSize: 14.5, fontWeight: 600,
                            padding: "13px 30px", borderRadius: 9, border: "none",
                            cursor: "pointer", transition: "opacity 0.2s, transform 0.15s",
                            boxShadow: "0 8px 30px rgba(232,163,61,0.22)",
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
                        Get started for free
                    </button>

                    <div style={{ marginTop: 18 }}>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#5B5850" }}>
                            Already have an account?{" "}
                        </span>
                        
                        <a
                            href="/login"
                            style={{
                                fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600,
                                color: "#C9C5B9", textDecoration: "none",
                                borderBottom: "1px solid rgba(255,255,255,0.2)",
                                transition: "color 0.2s, border-color 0.2s",
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.color = "#F4F2EC";
                                e.currentTarget.style.borderColor = "#F4F2EC";
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.color = "#C9C5B9";
                                e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                            }}
                        >
                            Log in
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default memo(FinalCTA);