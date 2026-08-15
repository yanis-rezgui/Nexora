import { memo } from "react";
import { motion } from "framer-motion";

type Priority = "URGENT" | "HIGH" | "MEDIUM";

const PRIORITY_COLOR: Record<Priority, string> = {
    URGENT: "#E8654F",
    HIGH: "#E8A33D",
    MEDIUM: "#7B9BE8",
};

const COLUMNS: {
    label: string;
    tasks: { title: string; priority?: Priority; assignee: string; due: string; done?: boolean }[];
}[] = [
    {
        label: "To do",
        tasks: [
            { title: "Landing page", priority: "HIGH", assignee: "Y", due: "Aug 18" },
            { title: "Mobile UI", priority: "MEDIUM", assignee: "S", due: "Aug 20" },
        ],
    },
    {
        label: "In progress",
        tasks: [
            { title: "API Authentication", priority: "URGENT", assignee: "A", due: "Tomorrow" },
            { title: "PostgreSQL schema", priority: "HIGH", assignee: "A", due: "Aug 18" },
        ],
    },
    {
        label: "Done",
        tasks: [
            { title: "Database schema", assignee: "S", due: "Done", done: true },
            { title: "Testing setup", assignee: "Y", due: "Done", done: true },
        ],
    },
];

const AVATAR_COLORS: Record<string, string> = { A: "#E8A33D", S: "#5FBF8B", Y: "#7B9BE8" };

const Avatar = ({ letter, size = 20 }: { letter: string; size?: number }) => (
    <div style={{
        width: size, height: size, borderRadius: "50%",
        background: AVATAR_COLORS[letter] ?? "#8D897E",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Inter', sans-serif", fontSize: size * 0.45, fontWeight: 600,
        color: "#151116", flexShrink: 0,
    }}>
        {letter}
    </div>
);

const TaskCard = ({ task }: { task: (typeof COLUMNS)[number]["tasks"][number] }) => (
    <div style={{
        background: "#1B1C22",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 9, padding: "11px 12px",
        display: "flex", flexDirection: "column", gap: 9,
    }}>
        <div style={{
            fontFamily: "'Inter', sans-serif", fontSize: 12.5, fontWeight: 500,
            color: task.done ? "#8D897E" : "#F0EEE7",
            textDecoration: task.done ? "line-through" : "none",
        }}>
            {task.title}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {task.priority ? (
                <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 9, fontWeight: 500, letterSpacing: "0.04em",
                    color: PRIORITY_COLOR[task.priority],
                    background: `${PRIORITY_COLOR[task.priority]}18`,
                    border: `1px solid ${PRIORITY_COLOR[task.priority]}35`,
                    borderRadius: 4, padding: "2px 6px",
                }}>
                    {task.priority}
                </span>
            ) : (
                <span style={{
                    display: "flex", alignItems: "center", gap: 4,
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                    color: "#5FBF8B",
                }}>
                    <i className="ti ti-check" style={{ fontSize: 11 }} />
                    DONE
                </span>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: "#5B5850" }}>
                    {task.due}
                </span>
                <Avatar letter={task.assignee} />
            </div>
        </div>
    </div>
);

const SIDEBAR_ITEMS = [
    { label: "Dashboard", icon: "ti-layout-grid" },
    { label: "Projects", icon: "ti-folder", active: true },
    { label: "My tasks", icon: "ti-checklist" },
    { label: "Notifications", icon: "ti-bell" },
    { label: "Settings", icon: "ti-settings" },
];

const ProductPreview = () => (
    <section
        id="preview"
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
                    The workspace
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
                    Everything your team needs,{" "}
                    <span style={{ color: "#E8A33D" }}>right where the work happens</span>
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
                    Manage projects, organize tasks, and keep your team aligned
                    from a single workspace.
                </motion.p>
            </div>

            {/* Browser frame */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                style={{
                    position: "relative",
                    background: "#111218",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 14,
                    boxShadow: "0 40px 100px rgba(0,0,0,0.5)",
                    overflow: "hidden",
                }}
            >
                {/* Browser chrome */}
                <div style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "11px 16px",
                    borderBottom: "1px solid rgba(255,255,255,0.07)",
                }}>
                    <div style={{ display: "flex", gap: 6 }}>
                        {["#E8654F", "#E8A33D", "#5FBF8B"].map(c => (
                            <span key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c, opacity: 0.55 }} />
                        ))}
                    </div>
                    <div style={{
                        flex: 1, maxWidth: 280, margin: "0 auto",
                        background: "#0D0E12", borderRadius: 6,
                        padding: "4px 10px", textAlign: "center",
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 10.5, color: "#5B5850",
                    }}>
                        nexora.app/projects/website-redesign
                    </div>
                </div>

                {/* App topbar */}
                <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "12px 20px",
                    borderBottom: "1px solid rgba(255,255,255,0.07)",
                }}>
                    <span style={{
                        fontFamily: "'Instrument Sans', sans-serif",
                        fontSize: 13, fontWeight: 600, color: "#F4F2EC",
                    }}>
                        Nexora
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <motion.span
                                animate={{ opacity: [1, 0.35, 1] }}
                                transition={{ duration: 1.8, repeat: Infinity }}
                                style={{ width: 6, height: 6, borderRadius: "50%", background: "#5FBF8B" }}
                            />
                            <span style={{
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: 10.5, color: "#8D897E",
                            }}>
                                3 members online
                            </span>
                        </div>
                        <i className="ti ti-bell" style={{ fontSize: 15, color: "#8D897E" }} />
                        <Avatar letter="Y" size={22} />
                    </div>
                </div>

                {/* Body */}
                <div className="max-[720px]:!grid-cols-1" style={{ display: "grid", gridTemplateColumns: "170px 1fr" }}>
                    {/* Sidebar */}
                    <div className="max-[720px]:hidden" style={{
                        borderRight: "1px solid rgba(255,255,255,0.07)",
                        padding: "16px 10px",
                        display: "flex", flexDirection: "column", gap: 3,
                    }}>
                        {SIDEBAR_ITEMS.map(item => (
                            <div key={item.label} style={{
                                display: "flex", alignItems: "center", gap: 9,
                                padding: "7px 10px", borderRadius: 7,
                                background: item.active ? "rgba(232,163,61,0.1)" : "transparent",
                                fontFamily: "'Inter', sans-serif", fontSize: 12.5,
                                color: item.active ? "#E8A33D" : "#8D897E",
                            }}>
                                <i className={`ti ${item.icon}`} style={{ fontSize: 14 }} />
                                {item.label}
                            </div>
                        ))}
                    </div>

                    {/* Board */}
                    <div style={{ padding: "20px 22px 26px" }}>
                        <div style={{ marginBottom: 4, fontFamily: "'Instrument Sans', sans-serif", fontSize: 15, fontWeight: 600, color: "#F4F2EC" }}>
                            Website Redesign
                        </div>
                        <div style={{ display: "flex", gap: 18, marginBottom: 18 }}>
                            {["Overview", "Board", "Tasks", "Members"].map(tab => (
                                <span key={tab} style={{
                                    fontFamily: "'Inter', sans-serif", fontSize: 12,
                                    color: tab === "Board" ? "#F4F2EC" : "#5B5850",
                                    fontWeight: tab === "Board" ? 600 : 400,
                                    paddingBottom: 6,
                                    borderBottom: tab === "Board" ? "2px solid #E8A33D" : "2px solid transparent",
                                }}>
                                    {tab}
                                </span>
                            ))}
                        </div>

                        <div className="max-[560px]:!grid-cols-1" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
                            {COLUMNS.map(col => (
                                <div key={col.label} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    <div style={{
                                        fontFamily: "'JetBrains Mono', monospace",
                                        fontSize: 9.5, color: "#5B5850", textTransform: "uppercase",
                                        letterSpacing: "0.06em", marginBottom: 2,
                                    }}>
                                        {col.label} · {col.tasks.length}
                                    </div>
                                    {col.tasks.map(task => <TaskCard key={task.title} task={task} />)}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Floating activity toast */}
                <motion.div
                    initial={{ opacity: 0, x: -16, y: 10 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.9, duration: 0.45 }}
                    className="max-[560px]:hidden"
                    style={{
                        position: "absolute", left: 20, bottom: 20,
                        display: "flex", alignItems: "center", gap: 9,
                        background: "#1B1C22",
                        border: "1px solid rgba(255,255,255,0.09)",
                        borderRadius: 10, padding: "9px 13px",
                        boxShadow: "0 12px 30px rgba(0,0,0,0.4)",
                    }}
                >
                    <Avatar letter="A" size={20} />
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11.5, color: "#C9C5B9" }}>
                        Ahmed moved <b style={{ color: "#F4F2EC" }}>API Authentication</b> to{" "}
                        <span style={{ color: "#E8A33D" }}>In Progress</span>
                    </span>
                </motion.div>
            </motion.div>
        </div>
    </section>
);

export default memo(ProductPreview);