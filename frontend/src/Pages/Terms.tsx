// Pages/Terms.tsx
import { memo } from "react";
import { motion } from "framer-motion";

const sections = [
  {
    id: "acceptance",
    icon: "ti-file-text",
    number: "01",
    title: "Acceptance of Terms",
    content: [
      {
        type: "paragraph",
        text: "Welcome to Nexora. These Terms of Service (\"Terms\") govern your access to and use of the Nexora platform, including our website, dashboard, and all related features (the \"Service\").",
      },
      {
        type: "paragraph",
        text: "By creating an account or using Nexora in any way, you agree to be bound by these Terms. If you do not agree with any part of them, you must not access or use the Service.",
      },
      {
        type: "paragraph",
        text: "Continued use of Nexora after any update to these Terms constitutes your acceptance of the revised version.",
      },
    ],
  },
  {
    id: "account",
    icon: "ti-user-circle",
    number: "02",
    title: "Your Account",
    content: [
      {
        type: "paragraph",
        text: "To access Nexora's features, you need to create an account. You are responsible for maintaining the confidentiality of your credentials and for all activity that occurs under your account.",
      },
      {
        type: "list-blue",
        items: [
          "Provide accurate, current, and complete information when registering",
          "Keep your password secure and never share it with anyone",
          "Notify us immediately if you suspect unauthorized access to your account",
          "You are responsible for all actions taken from your account, including within shared projects",
        ],
      },
      {
        type: "highlight",
        text: "Suspending an account signs the user out everywhere and blocks new logins, without deleting any of their data. Suspended accounts can be reactivated at any time.",
      },
    ],
  },
  {
    id: "using-nexora",
    icon: "ti-settings",
    number: "03",
    title: "Using Nexora",
    content: [
      {
        type: "paragraph",
        text: "Nexora provides tools for managing projects, tasks, team members, comments, files, notifications, and other collaboration-related activities for developers and teams.",
      },
      {
        type: "heading",
        text: "You are permitted to:",
      },
      {
        type: "list-green",
        items: [
          "Create and manage projects within your account",
          "Invite team members and assign roles and responsibilities",
          "Create, assign, and track tasks through their full lifecycle",
          "Collaborate through comments, labels, and file attachments",
          "Use Nexora for personal, academic, or professional projects",
        ],
      },
      {
        type: "heading",
        text: "You must not:",
      },
      {
        type: "list-red",
        items: [
          "Use the Service for any unlawful, harmful, or fraudulent purpose",
          "Attempt to gain unauthorized access to accounts, projects, or infrastructure you don't own",
          "Interfere with or disrupt the security or normal operation of the platform",
          "Upload malicious code, malware, or harmful content",
          "Abuse the API or automate excessive requests against the Service",
          "Harass, impersonate, or harm other users of the platform",
        ],
      },
    ],
  },
  {
    id: "content",
    icon: "ti-folder",
    number: "04",
    title: "Projects and User Content",
    content: [
      {
        type: "paragraph",
        text: "Everything you create in Nexora — projects, tasks, comments, labels, and attached files — is your content.",
      },
      {
        type: "list-blue",
        items: [
          "You retain full ownership of the content you create and upload to Nexora",
          "You are responsible for the projects, tasks, comments, and files you publish",
          "By using the Service, you grant Nexora the limited rights necessary to store, process, and display your content solely to provide and improve the Service",
          "You must not upload content that infringes on the intellectual property rights of others",
        ],
      },
    ],
  },
  {
    id: "collaboration",
    icon: "ti-users",
    number: "05",
    title: "Team Collaboration and Permissions",
    content: [
      {
        type: "paragraph",
        text: "Nexora is built around two layers of permissions. Admins manage the platform globally, while Managers and Developers share the work within each project.",
      },
      {
        type: "list-blue",
        items: [
          "Access to a project and its content depends on your assigned role and permissions within that project",
          "Managers are responsible for managing members, tasks, and responsibilities within their project",
          "Developers execute and collaborate on the tasks assigned to them",
          "Project owners and Admins are responsible for managing membership and access to their projects",
        ],
      },
    ],
  },
  {
    id: "acceptable-use",
    icon: "ti-shield",
    number: "06",
    title: "Acceptable Use",
    content: [
      {
        type: "paragraph",
        text: "To keep Nexora safe and reliable for everyone, you agree not to:",
      },
      {
        type: "list-red",
        items: [
          "Use Nexora for unlawful purposes",
          "Attempt unauthorized access to accounts, projects, or systems",
          "Upload malicious code or harmful content",
          "Interfere with the security or operation of the platform",
          "Abuse, exploit, or attempt to bypass access controls",
          "Use the Service to harm or harass other users",
        ],
      },
      {
        type: "highlight",
        text: "Nexora reserves the right to suspend or terminate accounts that violate these Terms or engage in abusive behavior toward the platform or other users.",
      },
    ],
  },
  {
    id: "availability",
    icon: "ti-cloud",
    number: "07",
    title: "Service Availability",
    content: [
      {
        type: "paragraph",
        text: "We aim to provide a reliable service, but we cannot guarantee that Nexora will always be available or error-free.",
      },
      {
        type: "list-blue",
        items: [
          "Scheduled or unscheduled maintenance may temporarily affect availability",
          "Nexora reserves the right to modify, suspend, or discontinue any feature of the Service with or without notice",
          "We will make reasonable efforts to notify users of significant planned downtime via email or in-app notification",
          "Pricing, plan features, and usage limits may evolve as the product grows",
        ],
      },
    ],
  },
  {
    id: "termination",
    icon: "ti-plug-connected-x",
    number: "08",
    title: "Termination",
    content: [
      {
        type: "paragraph",
        text: "You may stop using Nexora and request deletion of your account and associated data at any time by contacting support.",
      },
      {
        type: "paragraph",
        text: "We may suspend or terminate your access to the Service if you violate these Terms or misuse the platform.",
      },
      {
        type: "highlight",
        text: "Free plan accounts that remain inactive for more than 12 consecutive months may be subject to deletion after prior email notification.",
      },
    ],
  },
  {
    id: "changes",
    icon: "ti-refresh",
    number: "09",
    title: "Changes to These Terms",
    content: [
      {
        type: "paragraph",
        text: "We may update these Terms from time to time. When we make material changes, we will update the \"Last updated\" date at the top of this page and, where appropriate, notify registered users by email.",
      },
      {
        type: "paragraph",
        text: "Continued use of Nexora after changes become effective means you accept the updated Terms. We encourage you to review this page periodically.",
      },
    ],
  },
  {
    id: "contact",
    icon: "ti-mail",
    number: "10",
    title: "Contact Us",
    content: [
      {
        type: "paragraph",
        text: "If you have any questions, concerns, or requests regarding these Terms of Service, please reach out to us. We aim to respond to all inquiries within 24–48 hours.",
      },
    ],
    contact: true,
  },
];

type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "highlight"; text: string }
  | { type: "list-green" | "list-red" | "list-blue"; items: string[] };

const LIST_COLORS = {
  "list-green": { color: "#5FBF8B", bg: "rgba(95,191,139,0.1)", border: "rgba(95,191,139,0.25)", icon: "ti-check" },
  "list-red":   { color: "#E8654F", bg: "rgba(232,101,79,0.1)", border: "rgba(232,101,79,0.25)", icon: "ti-x"     },
  "list-blue":  { color: "#7B9BE8", bg: "rgba(123,155,232,0.1)", border: "rgba(123,155,232,0.25)", icon: "ti-check" },
};

const renderBlock = (block: ContentBlock, i: number) => {
  if (block.type === "paragraph") {
    return (
      <p key={i} style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: "#8D897E", lineHeight: 1.75, margin: "0 0 14px" }}>
        {block.text}
      </p>
    );
  }
  if (block.type === "heading") {
    return (
      <p key={i} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, fontWeight: 500, color: "#5B5850", textTransform: "uppercase", letterSpacing: "0.06em", margin: "18px 0 10px" }}>
        {block.text}
      </p>
    );
  }
  if (block.type === "highlight") {
    return (
      <div key={i} style={{
        background: "rgba(232,163,61,0.06)",
        border: "1px solid rgba(232,163,61,0.22)",
        borderLeft: "3px solid #E8A33D",
        borderRadius: 8, padding: "14px 16px", margin: "14px 0",
      }}>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#C9C5B9", lineHeight: 1.7, margin: 0 }}>{block.text}</p>
      </div>
    );
  }
  const listStyle = LIST_COLORS[block.type as keyof typeof LIST_COLORS];
  return (
    <div key={i} style={{ display: "flex", flexDirection: "column", gap: 8, margin: "8px 0 14px" }}>
      {block.items.map((item, j) => (
        <div key={j} style={{
          display: "flex", alignItems: "flex-start", gap: 10,
          background: listStyle.bg,
          border: `1px solid ${listStyle.border}`,
          borderRadius: 8, padding: "9px 12px",
        }}>
          <i className={`ti ${listStyle.icon}`} style={{ fontSize: 13, color: listStyle.color, marginTop: 2, flexShrink: 0 }} aria-hidden="true" />
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#8D897E", lineHeight: 1.6 }}>{item}</span>
        </div>
      ))}
    </div>
  );
};

const Terms = () => (
  <div style={{ background: "#0D0E12", minHeight: "100dvh" }}>

    {/* Hero */}
    <div style={{
      position: "relative",
      background: "#0A0B0F",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      padding: "64px 24px 52px",
      textAlign: "center",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: -100, left: "50%", transform: "translateX(-50%)",
        width: 460, height: 260,
        background: "radial-gradient(ellipse, rgba(232,163,61,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Logo */}
      <motion.a
        href="/"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ textDecoration: "none", position: "relative", zIndex: 1, display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 28 }}
      >
        <div style={{
          width: 30, height: 30, borderRadius: 8,
          background: "linear-gradient(135deg, #E8A33D, #F2C368)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontFamily: "'Instrument Sans', sans-serif", fontWeight: 700, fontSize: 15, color: "#151116" }}>N</span>
        </div>
        <span style={{ fontFamily: "'Instrument Sans', sans-serif", color: "#F4F2EC", fontSize: 17, fontWeight: 600, letterSpacing: "-0.01em" }}>
          Nexora
        </span>
      </motion.a>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        style={{
          display: "inline-block", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 500,
          letterSpacing: "0.1em", color: "#E8A33D", textTransform: "uppercase",
          background: "rgba(232,163,61,0.08)", border: "1px solid rgba(232,163,61,0.25)",
          borderRadius: 20, padding: "4px 14px", marginBottom: 20, position: "relative", zIndex: 1,
        }}
      >
        Legal
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        style={{
          fontFamily: "'Instrument Sans', sans-serif",
          fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 600,
          color: "#F4F2EC", lineHeight: 1.2, letterSpacing: "-0.02em",
          margin: "0 0 14px", position: "relative", zIndex: 1,
        }}
      >
        Terms of Service
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.18 }}
        style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: "#8D897E", margin: "0 0 6px", position: "relative", zIndex: 1 }}
      >
        Simple rules for using Nexora.
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.22 }}
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: "#5B5850", margin: 0, position: "relative", zIndex: 1 }}
      >
        Last updated · August 20, 2026
      </motion.p>
    </div>

    {/* Body */}
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "56px 24px 90px" }}>

      {/* Table of contents */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        style={{
          background: "#15161B",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 14, padding: "20px 22px", marginBottom: 40,
        }}
      >
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, fontWeight: 500, color: "#5B5850", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>
          Table of Contents
        </div>
        <div className="max-[560px]:!grid-cols-1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 18px" }}>
          {sections.map(s => (
            <a
              key={s.id}
              href={`#${s.id}`}
              style={{
                fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#8D897E", textDecoration: "none",
                display: "flex", alignItems: "center", gap: 9, padding: "6px 0",
                transition: "color 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "#E8A33D")}
              onMouseLeave={e => (e.currentTarget.style.color = "#8D897E")}
            >
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: "#5B5850", flexShrink: 0 }}>{s.number}</span>
              {s.title}
            </a>
          ))}
        </div>
      </motion.div>

      {/* Sections */}
      {sections.map((section, i) => (
        <motion.div
          key={section.id}
          id={section.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: Math.min(i * 0.03, 0.3) }}
          style={{
            background: "#15161B",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 14, padding: "26px 24px",
            marginBottom: 14, scrollMarginTop: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18, paddingBottom: 14, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600,
              color: "#E8A33D", background: "rgba(232,163,61,0.1)", border: "1px solid rgba(232,163,61,0.25)",
              borderRadius: 7, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              {section.number}
            </span>
            <i className={`ti ${section.icon}`} style={{ fontSize: 15, color: "#5B5850", flexShrink: 0 }} aria-hidden="true" />
            <h2 style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: 16, fontWeight: 600, color: "#F4F2EC", margin: 0, letterSpacing: "-0.01em" }}>
              {section.title}
            </h2>
          </div>

          {section.content.map((block, j) => renderBlock(block as ContentBlock, j))}

          {section.contact && (
            <div style={{
              display: "flex", alignItems: "center", gap: 14,
              background: "rgba(232,163,61,0.06)",
              border: "1px solid rgba(232,163,61,0.2)",
              borderRadius: 10, padding: "16px 18px", marginTop: 8,
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: 9, flexShrink: 0,
                background: "rgba(232,163,61,0.12)", border: "1px solid rgba(232,163,61,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <i className="ti ti-mail" style={{ fontSize: 18, color: "#E8A33D" }} aria-hidden="true" />
              </div>
              <div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: "#5B5850", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>
                  Email
                </div>
                <a href="mailto:support@nexora.dev" style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#E8A33D", textDecoration: "none", fontWeight: 600 }}>
                  support@nexora.dev
                </a>
              </div>
            </div>
          )}
        </motion.div>
      ))}

      <p style={{
        textAlign: "center", fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
        color: "#3A3833", marginTop: 30,
      }}>
        © 2026 Nexora
      </p>
    </div>
  </div>
);

export default memo(Terms);
