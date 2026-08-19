// Pages/Guide.tsx
import { memo, useMemo, useState } from "react";
import { motion } from "framer-motion";

type GuideTab = "start" | "projects" | "roles" | "tasks" | "collaboration" | "activity" | "tips";

const TABS: { key: GuideTab; label: string; icon: string }[] = [
  { key: "start", label: "Getting started", icon: "ti-rocket" },
  { key: "projects", label: "Projects", icon: "ti-folder" },
  { key: "roles", label: "Team & Roles", icon: "ti-users" },
  { key: "tasks", label: "Tasks", icon: "ti-list-check" },
  { key: "collaboration", label: "Collaboration", icon: "ti-message-circle" },
  { key: "activity", label: "Activity & Notifications", icon: "ti-bell" },
  { key: "tips", label: "Tips & shortcuts", icon: "ti-bulb" },
];

const TIPS_OF_THE_DAY = [
  "Press the status pill on a task row to update it without opening the task.",
  "You can @mention a teammate in a comment to notify them instantly.",
  "Filter your tasks by \"Due date\" to see what needs attention first.",
  "Suspended accounts keep their data — nothing is lost when a user is reactivated.",
  "Attach files directly to a task so context never lives in a side conversation.",
  "Use labels to group related tasks across a project without changing their status.",
  "Managers can reassign tasks from the project's Tasks tab in a couple of clicks.",
  "Your notification bell shows unread count in real time — no refresh needed.",
];

const getTipOfTheDay = () => TIPS_OF_THE_DAY[new Date().getDate() % TIPS_OF_THE_DAY.length];

const Guide = () => {
  const [tab, setTab] = useState<GuideTab>("start");
  const tipOfTheDay = useMemo(() => getTipOfTheDay(), []);

  return (
    <section className="max-[600px]:!px-0" style={{ maxWidth: 860, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 22 }}>
        <h1 style={{
          fontFamily: "'Instrument Sans', sans-serif", fontSize: 22, fontWeight: 600,
          color: "#F4F2EC", letterSpacing: "-0.01em", margin: "0 0 4px",
        }}>
          Guide
        </h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#8D897E", margin: 0 }}>
          How Nexora works, and how to get the most out of it.
        </p>
      </div>

      {/* Tip of the day */}
      <TipOfTheDay tip={tipOfTheDay} />

      {/* Tabs */}
      <div style={{
        display: "flex", alignItems: "center", gap: 6, marginTop: 20, marginBottom: 22,
        overflowX: "auto", paddingBottom: 2,
      }}>
        {TABS.map(t => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap",
                background: active ? "rgba(232,163,61,0.1)" : "transparent",
                border: `1px solid ${active ? "rgba(232,163,61,0.4)" : "rgba(255,255,255,0.08)"}`,
                borderRadius: 8, padding: "8px 13px",
                color: active ? "#E8A33D" : "#8D897E",
                fontFamily: "'Inter', sans-serif", fontSize: 12.5, fontWeight: 500,
                cursor: "pointer", transition: "border-color 0.15s, color 0.15s, background 0.15s",
              }}
            >
              <i className={`ti ${t.icon}`} style={{ fontSize: 14 }} aria-hidden="true" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {tab === "start" && <StartSection />}
        {tab === "projects" && <ProjectsSection />}
        {tab === "roles" && <RolesSection />}
        {tab === "tasks" && <TasksSection />}
        {tab === "collaboration" && <CollaborationSection />}
        {tab === "activity" && <ActivitySection />}
        {tab === "tips" && <TipsSection />}
      </motion.div>
    </section>
  );
};


// ============================================================
// Shared bits
// ============================================================

const SectionIntro = ({ title, body }: { title: string; body: string }) => (
  <>
    <h2 style={{
      fontFamily: "'Instrument Sans', sans-serif", fontSize: 17, fontWeight: 600,
      color: "#F4F2EC", margin: "0 0 8px",
    }}>
      {title}
    </h2>
    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#8D897E", lineHeight: 1.65, maxWidth: 560, margin: "0 0 22px" }}>
      {body}
    </p>
  </>
);

const Card = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{
    background: "#15161B", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14,
    padding: 20, ...style,
  }}>
    {children}
  </div>
);

const TipOfTheDay = ({ tip }: { tip: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    style={{
      display: "flex", alignItems: "center", gap: 12,
      background: "rgba(232,163,61,0.08)", border: "1px solid rgba(232,163,61,0.25)",
      borderRadius: 12, padding: "13px 16px",
    }}
  >
    <div style={{
      width: 32, height: 32, borderRadius: 9, flexShrink: 0,
      background: "rgba(232,163,61,0.14)", border: "1px solid rgba(232,163,61,0.3)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <i className="ti ti-bulb" style={{ fontSize: 15, color: "#E8A33D" }} aria-hidden="true" />
    </div>
    <div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#E8A33D", letterSpacing: "0.06em", marginBottom: 2 }}>
        TIP OF THE DAY
      </div>
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#F4F2EC" }}>
        {tip}
      </div>
    </div>
  </motion.div>
);


// ============================================================
// 01 — Getting started
// ============================================================

const FLOW_STEPS = [
  "Create a project",
  "Invite your team",
  "Create tasks",
  "Assign responsibilities",
  "Collaborate",
  "Track progress",
  "Receive notifications",
  "Analyze activity",
];

const StartSection = () => (
  <div>
    <SectionIntro
      title="One flow, start to finish"
      body="Every project in Nexora becomes a structured workspace where people, tasks, files and activity stay connected. Here's the shape of a typical project, from creation to completion."
    />
    <Card>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {FLOW_STEPS.map((step, i) => (
          <div key={step} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
              <div style={{
                width: 30, height: 30, borderRadius: 9,
                background: "#1A1B21", border: "1px solid rgba(255,255,255,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: "#E8A33D",
              }}>
                {i + 1}
              </div>
              {i < FLOW_STEPS.length - 1 && (
                <div style={{ width: 1, height: 26, background: "rgba(255,255,255,0.08)" }} />
              )}
            </div>
            <div style={{
              fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: "#F4F2EC", fontWeight: 500,
              paddingTop: 5, paddingBottom: i < FLOW_STEPS.length - 1 ? 10 : 0,
            }}>
              {step}
            </div>
          </div>
        ))}
      </div>
    </Card>
  </div>
);


// ============================================================
// 02 — Projects
// ============================================================

const ProjectsSection = () => (
  <div>
    <SectionIntro
      title="Projects are the foundation"
      body="Every project has an owner and can contain multiple members. Members collaborate through tasks, comments, files and project activity."
    />
    <div className="max-[720px]:!grid-cols-1" style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 14 }}>
      <Card>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#8D897E", lineHeight: 2.1 }}>
          <div style={{ color: "#F4F2EC", fontWeight: 600, marginBottom: 4 }}>Project</div>
          <div>├── <span style={{ color: "#F4F2EC" }}>Members</span></div>
          <div>├── <span style={{ color: "#F4F2EC" }}>Tasks</span></div>
          <div>├── <span style={{ color: "#F4F2EC" }}>Labels</span></div>
          <div>├── <span style={{ color: "#F4F2EC" }}>Comments</span></div>
          <div>├── <span style={{ color: "#F4F2EC" }}>Attachments</span></div>
          <div>└── <span style={{ color: "#F4F2EC" }}>Activity</span></div>
        </div>
      </Card>

      <Card>
        <div style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: 14.5, fontWeight: 600, color: "#F4F2EC", marginBottom: 14 }}>
          Website Redesign
        </div>
        {[
          ["Owner", "Sarah"],
          ["Members", "6"],
          ["Tasks", "32"],
          ["Completed", "21"],
        ].map(([k, v]) => (
          <div key={k} style={{
            display: "flex", justifyContent: "space-between", padding: "8px 0",
            borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 12.5,
          }}>
            <span style={{ color: "#8D897E" }}>{k}</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", color: "#F4F2EC", fontWeight: 500 }}>{v}</span>
          </div>
        ))}
        <div style={{ height: 6, borderRadius: 99, background: "rgba(255,255,255,0.06)", marginTop: 14, overflow: "hidden" }}>
          <div style={{ height: "100%", width: "66%", borderRadius: 99, background: "linear-gradient(90deg, #E8A33D, #F0BE6E)" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: "#5B5850" }}>PROGRESS</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: "#E8A33D", fontWeight: 600 }}>66%</span>
        </div>
      </Card>
    </div>
  </div>
);


// ============================================================
// 03 — Team & Roles
// ============================================================

const ROLES = [
  { tag: "ADMIN", color: "#E8654F", bg: "rgba(232,101,79,0.12)", desc: "Manages the platform globally: users, sessions, and platform-wide analytics." },
  { tag: "MANAGER", color: "#7B9BE8", bg: "rgba(123,155,232,0.12)", desc: "Manages a project: members, tasks, and responsibilities within it." },
  { tag: "DEVELOPER", color: "#5FBF8B", bg: "rgba(95,191,139,0.12)", desc: "Executes and collaborates on the tasks assigned to them." },
];

const RolesSection = () => (
  <div>
    <SectionIntro
      title="Two layers of permissions"
      body="Admin manages the platform globally. Within each project, Managers and Developers share the work."
    />
    <div className="max-[640px]:!grid-cols-1" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 22 }}>
      {ROLES.map(r => (
        <Card key={r.tag} style={{ padding: "16px 18px" }}>
          <span style={{
            display: "inline-block", fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5,
            fontWeight: 600, letterSpacing: "0.05em", padding: "3px 8px", borderRadius: 5,
            color: r.color, background: r.bg, marginBottom: 10,
          }}>
            {r.tag}
          </span>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#8D897E", lineHeight: 1.6, margin: 0 }}>
            {r.desc}
          </p>
        </Card>
      ))}
    </div>
    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#5B5850", lineHeight: 1.6 }}>
      Your role badge is visible next to your name in the sidebar, and controls which actions you can take on a project.
    </p>
  </div>
);


// ============================================================
// 04 — Tasks
// ============================================================

const STATUS_STEPS = [
  { label: "TODO", color: "#B8B4A8", bg: "rgba(141,137,126,0.14)" },
  { label: "IN PROGRESS", color: "#7B9BE8", bg: "rgba(123,155,232,0.14)" },
  { label: "IN REVIEW", color: "#B98CE8", bg: "rgba(185,140,232,0.14)" },
  { label: "DONE", color: "#5FBF8B", bg: "rgba(95,191,139,0.14)" },
];

const PRIORITIES = [
  { label: "LOW", color: "#5FBF8B" },
  { label: "MEDIUM", color: "#E8A33D" },
  { label: "HIGH", color: "#E89B4F" },
  { label: "URGENT", color: "#E8654F" },
];

const TasksSection = () => (
  <div>
    <SectionIntro
      title="Turn projects into actionable work"
      body="Every task carries what's needed to get it done: a status, a priority, an owner, and a due date."
    />

    <Card style={{ marginBottom: 14 }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: "#5B5850", letterSpacing: "0.08em", marginBottom: 14 }}>
        STATUS WORKFLOW
      </div>
      <div className="max-[480px]:!flex-col max-[480px]:!items-start" style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        {STATUS_STEPS.map((s, i) => (
          <span key={s.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600,
              padding: "7px 13px", borderRadius: 8, color: s.color, background: s.bg,
            }}>
              {s.label}
            </span>
            {i < STATUS_STEPS.length - 1 && <span style={{ color: "#5B5850", fontSize: 12 }} className="max-[480px]:!hidden">→</span>}
          </span>
        ))}
      </div>
    </Card>

    <Card>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: "#5B5850", letterSpacing: "0.08em", marginBottom: 14 }}>
        PRIORITY
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {PRIORITIES.map(p => (
          <span key={p.label} style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600,
            padding: "6px 13px", borderRadius: 99, border: `1px solid ${p.color}59`, color: p.color,
          }}>
            {p.label}
          </span>
        ))}
      </div>
    </Card>
  </div>
);


// ============================================================
// 05 — Collaboration
// ============================================================

const CollaborationSection = () => (
  <div>
    <SectionIntro
      title="Work together, without leaving the task"
      body="Comments, files and context all live on the task itself — nothing gets buried in a side conversation."
    />
    <Card style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ padding: "18px 20px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: 15, fontWeight: 600, color: "#F4F2EC", marginBottom: 12 }}>
          Fix authentication middleware
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, fontWeight: 600, padding: "5px 10px", borderRadius: 6, color: "#7B9BE8", background: "rgba(123,155,232,0.14)" }}>
            ● IN PROGRESS
          </span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, fontWeight: 600, padding: "5px 10px", borderRadius: 6, color: "#E89B4F", background: "rgba(232,155,79,0.14)" }}>
            🔥 HIGH
          </span>
        </div>
        <div style={{ display: "flex", gap: 20, fontSize: 12, color: "#8D897E", flexWrap: "wrap" }}>
          <span>Assigned to <b style={{ color: "#F4F2EC", fontWeight: 500 }}>Yanis</b></span>
          <span>Due <b style={{ color: "#F4F2EC", fontWeight: 500 }}>Aug 24</b></span>
        </div>
      </div>
      <div style={{ padding: "16px 20px" }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          <div style={{
            width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
            background: "linear-gradient(140deg, #B98CE8, #7B6BE8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600, color: "#fff",
          }}>
            S
          </div>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: "#F4F2EC", marginBottom: 2 }}>Sarah</div>
            <div style={{ fontSize: 12.5, color: "#8D897E", lineHeight: 1.5 }}>The refresh token logic needs testing.</div>
          </div>
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 8, width: "fit-content",
          background: "#1A1B21", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8,
          padding: "8px 12px", fontSize: 12, color: "#8D897E",
        }}>
          📎 auth-flow.png
        </div>
      </div>
    </Card>
  </div>
);


// ============================================================
// 06 — Activity & Notifications
// ============================================================

const ACTIVITY_ITEMS = [
  { text: "Yanis assigned \"Fix authentication\"", time: "2 minutes ago", color: "#7B9BE8" },
  { text: "Sarah changed \"Landing page\"", time: "5 minutes ago", color: "#B98CE8" },
  { text: "Karim uploaded design.pdf", time: "12 minutes ago", color: "#E8A33D" },
];

const NOTIF_TYPES = ["Task assigned", "Status changed", "Due soon", "Overdue", "Member added", "Comment", "Mention"];

const ActivitySection = () => (
  <div>
    <SectionIntro
      title="Know what's happening, as it happens"
      body="Every action is recorded and pushed live to connected users — no refresh required."
    />

    <div className="max-[720px]:!grid-cols-1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
      <Card>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: "#5B5850", letterSpacing: "0.08em", marginBottom: 12 }}>
          RECENT ACTIVITY
        </div>
        {ACTIVITY_ITEMS.map((a, i) => (
          <div key={a.text} style={{
            display: "flex", gap: 10, padding: "10px 0",
            borderBottom: i < ACTIVITY_ITEMS.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: a.color, marginTop: 5, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 12, color: "#F4F2EC", lineHeight: 1.5 }}>{a.text}</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#5B5850", marginTop: 2 }}>{a.time}</div>
            </div>
          </div>
        ))}
      </Card>

      <Card>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: "#5B5850", letterSpacing: "0.08em", marginBottom: 12 }}>
          NOTIFICATION TYPES
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {NOTIF_TYPES.map(n => (
            <div key={n} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 12.5, color: "#8D897E", padding: "7px 0" }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#E8A33D", flexShrink: 0 }} />
              {n}
            </div>
          ))}
        </div>
      </Card>
    </div>

    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#5B5850", lineHeight: 1.6 }}>
      Nothing here needs a manual refresh — activity and notifications update live while you work.
    </p>
  </div>
);


// ============================================================
// 07 — Tips & shortcuts
// ============================================================

const QUICK_TIPS = [
  { icon: "ti-search", text: "Use the search bar on any list page to filter instantly — results update as you type." },
  { icon: "ti-adjustments", text: "Combine filters (status, priority, role) to narrow down exactly what you're looking for." },
  { icon: "ti-tag", text: "Labels are shared across a project, so keep them short and reusable." },
  { icon: "ti-clock", text: "Sort your tasks by due date to always see what's next." },
  { icon: "ti-shield-lock", text: "Suspending an account signs the user out everywhere and blocks new logins, without deleting their data." },
  { icon: "ti-bell-ringing", text: "Mark all notifications as read in one click from the Notifications page." },
];

const TipsSection = () => (
  <div>
    <SectionIntro
      title="Small things that save time"
      body="A few habits that make working in Nexora faster."
    />
    <div className="max-[640px]:!grid-cols-1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
      {QUICK_TIPS.map(t => (
        <Card key={t.text} style={{ display: "flex", gap: 12, padding: "16px 18px", alignItems: "flex-start" }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8, flexShrink: 0,
            background: "rgba(232,163,61,0.1)", border: "1px solid rgba(232,163,61,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <i className={`ti ${t.icon}`} style={{ fontSize: 14, color: "#E8A33D" }} aria-hidden="true" />
          </div>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#8D897E", lineHeight: 1.6, margin: 0 }}>
            {t.text}
          </p>
        </Card>
      ))}
    </div>
  </div>
);

export default memo(Guide);
