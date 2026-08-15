import { memo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const FAQS = [
    {
        question: "What is Nexora?",
        answer: "Nexora is a workspace where dev teams plan projects, manage tasks on a kanban board, and collaborate in real time — instead of juggling separate tools for each part of the work.",
    },
    {
        question: "Can I use Nexora with my team?",
        answer: "Yes. Create a project, invite your teammates by email, and everyone works from the same board — with changes syncing instantly across every member's screen.",
    },
    {
        question: "What roles are available?",
        answer: "Nexora supports three roles: Admin, Manager, and Developer. Admins manage the workspace and billing, Managers organize projects and assign work, and Developers focus on their tasks.",
    },
    {
        question: "Is Nexora free?",
        answer: "Yes. The Free plan covers 3 projects and 5 team members with full task management. Pro and Team unlock unlimited projects, analytics, and advanced permissions when you outgrow it.",
    },
    {
        question: "Does Nexora support real-time collaboration?",
        answer: "Yes — task updates, status changes, comments, and notifications are pushed live to everyone in the workspace over a WebSocket connection, no page refresh needed.",
    },
    {
        question: "How are my files and data handled?",
        answer: "Files you attach to tasks are stored securely and scoped to your project — only members of that project can access them. You can remove a file or a project at any time.",
    },
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section
            id="faq"
            style={{
                background: "#0D0E12",
                padding: "110px 24px 100px",
                borderTop: "1px solid rgba(255,255,255,0.06)",
            }}
        >
            <div style={{ maxWidth: 720, margin: "0 auto" }}>
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: 52 }}>
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
                        FAQ
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.07 }}
                        style={{
                            fontFamily: "'Instrument Sans', sans-serif",
                            fontSize: "clamp(24px, 3.6vw, 36px)", fontWeight: 600,
                            color: "#F4F2EC", lineHeight: 1.2, letterSpacing: "-0.02em",
                            margin: 0,
                        }}
                    >
                        Questions, answered
                    </motion.h2>
                </div>

                {/* Accordion */}
                <div style={{
                    background: "#15161B",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 14, overflow: "hidden",
                }}>
                    {FAQS.map((item, i) => {
                        const isOpen = openIndex === i;
                        return (
                            <div
                                key={item.question}
                                style={{
                                    borderBottom: i < FAQS.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none",
                                }}
                            >
                                <button
                                    onClick={() => setOpenIndex(isOpen ? null : i)}
                                    style={{
                                        width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                                        gap: 16, background: "transparent", border: "none", cursor: "pointer",
                                        padding: "18px 22px", textAlign: "left",
                                    }}
                                >
                                    <span style={{
                                        fontFamily: "'Instrument Sans', sans-serif",
                                        fontSize: 14.5, fontWeight: 600,
                                        color: isOpen ? "#F4F2EC" : "#C9C5B9",
                                        transition: "color 0.2s",
                                    }}>
                                        {item.question}
                                    </span>
                                    <motion.span
                                        animate={{ rotate: isOpen ? 45 : 0 }}
                                        transition={{ duration: 0.2 }}
                                        style={{
                                            width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                                            background: isOpen ? "rgba(232,163,61,0.14)" : "transparent",
                                            border: `1px solid ${isOpen ? "rgba(232,163,61,0.4)" : "rgba(255,255,255,0.14)"}`,
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                        }}
                                    >
                                        <i
                                            className="ti ti-plus"
                                            style={{ fontSize: 12, color: isOpen ? "#E8A33D" : "#8D897E" }}
                                        />
                                    </motion.span>
                                </button>

                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25, ease: "easeInOut" }}
                                            style={{ overflow: "hidden" }}
                                        >
                                            <p style={{
                                                fontFamily: "'Inter', sans-serif", fontSize: 13.5,
                                                color: "#8D897E", lineHeight: 1.7,
                                                margin: 0, padding: "0 22px 20px",
                                                maxWidth: 560,
                                            }}>
                                                {item.answer}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default memo(FAQ);