import { memo } from "react";
import { motion } from "framer-motion";

const PLANS = [
    {
        name: "Free",
        price: "$0",
        period: "",
        tagline: "Try Nexora with a small team",
        color: "#8D897E",
        popular: false,
        features: ["3 projects", "5 team members", "Task management", "Comments"],
    },
    {
        name: "Pro",
        price: "$12",
        period: "/month",
        tagline: "For teams shipping regularly",
        color: "#E8A33D",
        popular: true,
        features: [
            "Unlimited projects",
            "Unlimited members",
            "Real-time collaboration",
            "Analytics",
            "File attachments",
        ],
    },
    {
        name: "Team",
        price: "$29",
        period: "/month",
        tagline: "For growing engineering orgs",
        color: "#7B9BE8",
        popular: false,
        features: [
            "Everything in Pro",
            "Advanced permissions",
            "Team analytics",
            "Priority support",
        ],
    },
] as const;

const Pricing = () => (
    <section
        id="pricing"
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
                    Pricing
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
                    Start free,{" "}
                    <span style={{ color: "#E8A33D" }}>scale when you need to</span>
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.13 }}
                    style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 15, color: "#8D897E", lineHeight: 1.7,
                        maxWidth: 420, margin: "0 auto",
                    }}
                >
                    No credit card required to get started.
                </motion.p>
            </div>

            {/* Cards */}
            <div
                className="max-[820px]:!grid-cols-1"
                style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, alignItems: "start" }}
            >
                {PLANS.map((plan, i) => (
                    <motion.div
                        key={plan.name}
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.08 }}
                        style={{
                            position: "relative",
                            background: "#15161B",
                            border: plan.popular ? "1px solid rgba(232,163,61,0.4)" : "1px solid rgba(255,255,255,0.08)",
                            borderRadius: 16, padding: "28px 26px",
                            transform: plan.popular ? "translateY(-8px)" : "none",
                        }}
                        className={plan.popular ? "max-[820px]:!translate-y-0" : ""}
                    >
                        {plan.popular && (
                            <div style={{
                                position: "absolute", top: -12, left: 26,
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: 9.5, fontWeight: 600, color: "#151116",
                                background: "#E8A33D",
                                padding: "3px 10px", borderRadius: 20,
                                letterSpacing: "0.05em", textTransform: "uppercase",
                            }}>
                                Most popular
                            </div>
                        )}

                        <div style={{ marginBottom: 22 }}>
                            <div style={{
                                fontFamily: "'Instrument Sans', sans-serif",
                                fontSize: 14, fontWeight: 600, color: plan.color, marginBottom: 6,
                            }}>
                                {plan.name}
                            </div>
                            <div style={{ display: "flex", alignItems: "baseline", gap: 5, marginBottom: 8 }}>
                                <span style={{
                                    fontFamily: "'Instrument Sans', sans-serif",
                                    fontSize: 36, fontWeight: 700, color: "#F4F2EC", letterSpacing: "-0.03em",
                                }}>
                                    {plan.price}
                                </span>
                                {plan.period && (
                                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#5B5850" }}>
                                        {plan.period}
                                    </span>
                                )}
                            </div>
                            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#8D897E" }}>
                                {plan.tagline}
                            </div>
                        </div>

                        <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 22 }} />

                        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 26 }}>
                            {plan.features.map(f => (
                                <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 9 }}>
                                    <i className="ti ti-check" style={{ fontSize: 13, color: plan.color, marginTop: 2, flexShrink: 0 }} />
                                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#C9C5B9", lineHeight: 1.5 }}>
                                        {f}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <a
                            href="/register"
                            style={{
                                display: "block", textAlign: "center",
                                padding: plan.popular ? "11px" : "10px",
                                background: plan.popular ? plan.color : "transparent",
                                border: plan.popular ? "none" : "1px solid rgba(255,255,255,0.12)",
                                borderRadius: 8,
                                color: plan.popular ? "#151116" : "#C9C5B9",
                                fontFamily: "'Inter', sans-serif", fontSize: 13.5, fontWeight: 600,
                                textDecoration: "none", transition: "opacity 0.2s, border-color 0.2s",
                            }}
                            onMouseEnter={e => {
                                if (plan.popular) e.currentTarget.style.opacity = "0.88";
                                else e.currentTarget.style.borderColor = "rgba(255,255,255,0.24)";
                            }}
                            onMouseLeave={e => {
                                if (plan.popular) e.currentTarget.style.opacity = "1";
                                else e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                            }}
                        >
                            {plan.name === "Free" ? "Get started free" : `Start ${plan.name} plan →`}
                        </a>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

export default memo(Pricing);