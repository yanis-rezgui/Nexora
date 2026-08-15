import { memo } from "react";
import { motion } from "framer-motion";

const STEPS = [
    {
        num: "01",
        title: "Create your workspace",
        description: "Create a project and invite your team.",
        color: "#E8A33D",
        visual: "create",
    },
    {
        num: "02",
        title: "Plan the work",
        description: "Create tasks, assign members, set priorities and deadlines.",
        color: "#7B9BE8",
        visual: "plan",
    },
    {
        num: "03",
        title: "Build together",
        description: "Track progress, discuss tasks and collaborate in real time.",
        color: "#5FBF8B",
        visual: "build",
    },
] as const;

type VisualKind = (typeof STEPS)[number]["visual"];

const StepVisual = ({ kind, color }: { kind: VisualKind; color: string }) => {
    switch (kind) {
        case "create":
            return (
                <div style={{
                    display: "flex", alignItems: "center", gap: 8,
                    border: `1px dashed ${color}55`, borderRadius: 8,
                    padding: "9px 12px",
                }}>
                    <div style={{
                        width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                        background: `${color}18`, border: `1px solid ${color}55`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                        <i className="ti ti-plus" style={{ fontSize: 11, color }} />
                    </div>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: "#8D897E" }}>
                        New project · Website Redesign
                    </span>
                </div>
            );

        case "plan":
            return (
                <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    background: "#1B1C22", border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 8, padding: "9px 12px",
                }}>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11.5, color: "#C9C5B9" }}>
                        API Authentication
                    </span>
                    <span style={{
                        fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 500,
                        color, background: `${color}18`, border: `1px solid ${color}35`,
                        borderRadius: 4, padding: "2px 7px",
                    }}>
                        HIGH
                    </span>
                </div>
            );

        case "build":
            return (
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <div style={{ display: "flex" }}>
                        {["#E8A33D", "#7B9BE8", "#5FBF8B"].map((c, i) => (
                            <div key={c} style={{
                                width: 18, height: 18, borderRadius: "50%",
                                background: c, border: "2px solid #1B1C22",
                                marginLeft: i === 0 ? 0 : -6,
                            }} />
                        ))}
                    </div>
                    <motion.span
                        animate={{ opacity: [1, 0.35, 1] }}
                        transition={{ duration: 1.6, repeat: Infinity }}
                        style={{ width: 6, height: 6, borderRadius: "50%", background: color, flexShrink: 0 }}
                    />
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#8D897E" }}>
                        syncing live
                    </span>
                </div>
            );
    }
};

const StepArrow = ({ delay = 0 }: { delay?: number }) => (
    <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay }}
        className="max-[880px]:!rotate-90 max-[880px]:!my-1"
        style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#3A3833", flexShrink: 0,
        }}
    >
        <i className="ti ti-arrow-right" style={{ fontSize: 18 }} />
    </motion.div>
);

const HowItWorks = () => (
    <section
        id="how"
        style={{
            background: "#0D0E12",
            padding: "110px 24px 90px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
    >
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: 64 }}>
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
                    How it works
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
                    From idea to shipped,{" "}
                    <span style={{ color: "#E8A33D" }}>in three steps</span>
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
                    No setup calls, no onboarding docs to read first.
                </motion.p>
            </div>

            {/* Steps row */}
            <div
                className="max-[880px]:!flex-col"
                style={{ display: "flex", alignItems: "stretch", gap: 4 }}
            >
                {STEPS.map((step, i) => (
                    <>
                        <motion.div
                            key={step.num}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.45, delay: i * 0.1 }}
                            style={{
                                flex: 1,
                                background: "#15161B",
                                border: "1px solid rgba(255,255,255,0.07)",
                                borderRadius: 14, padding: "26px 22px",
                                display: "flex", flexDirection: "column", gap: 18,
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <span style={{
                                    fontFamily: "'JetBrains Mono', monospace",
                                    fontSize: 12, fontWeight: 700, color: step.color,
                                }}>
                                    {step.num}
                                </span>
                                <div style={{ height: 1, flex: 1, background: "rgba(255,255,255,0.07)" }} />
                            </div>

                            <div>
                                <div style={{
                                    fontFamily: "'Instrument Sans', sans-serif",
                                    fontSize: 16, fontWeight: 600, color: "#F4F2EC",
                                    marginBottom: 6,
                                }}>
                                    {step.title}
                                </div>
                                <p style={{
                                    fontFamily: "'Inter', sans-serif", fontSize: 13,
                                    color: "#8D897E", lineHeight: 1.6, margin: 0,
                                }}>
                                    {step.description}
                                </p>
                            </div>

                            <div style={{ marginTop: "auto" }}>
                                <StepVisual kind={step.visual} color={step.color} />
                            </div>
                        </motion.div>

                        {i < STEPS.length - 1 && <StepArrow delay={0.15 + i * 0.1} />}
                    </>
                ))}
            </div>
        </div>
    </section>
);

export default memo(HowItWorks);