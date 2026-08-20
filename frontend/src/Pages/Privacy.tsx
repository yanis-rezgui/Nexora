// Pages/Privacy.tsx
import { memo } from "react";
import { motion } from "framer-motion";

const sections = [
  {
    id: "information-collected",
    icon: "ti-database",
    number: "01",
    title: "Information We Collect",
    content: [
      {
        type: "paragraph",
        text: "At Nexora, we take your privacy seriously. This Privacy Policy explains how we collect, use, store, and protect your information when you use our platform.",
      },
      {
        type: "heading",
        text: "Account Information:",
      },
      {
        type: "list-blue",
        items: [
          "First name and last name",
          "Email address",
          "Password credentials",
        ],
      },
      {
        type: "highlight",
        text: "Passwords are securely hashed and are never stored in plain text.",
      },
      {
        type: "heading",
        text: "Content You Create:",
      },
      {
        type: "list-blue",
        items: [
          "Projects, tasks, and labels",
          "Comments",
          "Files and attachments",
          "Activity data generated as you use the platform",
        ],
      },
    ],
  },
  {
    id: "how-we-use",
    icon: "ti-settings",
    number: "02",
    title: "How We Use Your Information",
    content: [
      {
        type: "paragraph",
        text: "We use your information to provide, maintain, and improve Nexora, including:",
      },
      {
        type: "list-green",
        items: [
          "Creating and managing your account",
          "Providing and operating the Nexora platform",
          "Managing projects, tasks, and responsibilities",
          "Enabling collaboration between team members",
          "Sending notifications relevant to your projects and tasks",
          "Maintaining the security of the platform",
          "Improving and developing the Service over time",
        ],
      },
    ],
  },
  {
    id: "how-shared",
    icon: "ti-share",
    number: "03",
    title: "How Your Information Is Shared",
    content: [
      {
        type: "paragraph",
        text: "Nexora is a collaborative platform, which means some of the information you add to a project is visible to other members of that project.",
      },
      {
        type: "list-blue",
        items: [
          "Information you add to a project — such as tasks, comments, and activity — may be visible to other users who have access to that project",
          "We do not sell your personal information to third parties",
          "We do not share your data with advertisers or marketing companies",
        ],
      },
    ],
  },
  {
    id: "collaboration",
    icon: "ti-users",
    number: "04",
    title: "Project Collaboration and Visibility",
    content: [
      {
        type: "paragraph",
        text: "Because Nexora is built around teams and projects, access to information depends on the roles and permissions assigned within each project.",
      },
      {
        type: "list-blue",
        items: [
          "Your access to projects and content depends on your assigned role and permissions",
          "Other authorized members of a project may be able to view information you create or share within that project",
          "Project owners and Managers are responsible for managing who has access to a project",
        ],
      },
    ],
  },
  {
    id: "cookies",
    icon: "ti-cookie",
    number: "05",
    title: "Cookies and Authentication",
    content: [
      {
        type: "paragraph",
        text: "Nexora uses cookies and similar technologies to maintain authentication sessions, help secure user accounts, and ensure the proper functioning of the platform.",
      },
      {
        type: "highlight",
        text: "These cookies are necessary for the operation and security of the Service. We do not use advertising cookies or cross-site tracking cookies.",
      },
    ],
  },
  {
    id: "storage-security",
    icon: "ti-server",
    number: "06",
    title: "Data Storage and Security",
    content: [
      {
        type: "paragraph",
        text: "We implement reasonable technical and organizational measures designed to protect your information.",
      },
      {
        type: "list-blue",
        items: [
          "Password credentials are hashed before storage",
          "Access to project data is controlled through authentication and authorization mechanisms",
          "Data is transmitted using industry-standard encryption",
        ],
      },
      {
        type: "paragraph",
        text: "While we work hard to protect your information, no method of transmission or storage is completely infallible. We encourage you to use a strong, unique password for your account.",
      },
    ],
  },
  {
    id: "retention",
    icon: "ti-clock",
    number: "07",
    title: "Data Retention",
    content: [
      {
        type: "paragraph",
        text: "We retain personal information and user-generated content for as long as necessary to provide the Service, comply with legal obligations, resolve disputes, and enforce our agreements.",
      },
    ],
  },
  {
    id: "your-rights",
    icon: "ti-user-check",
    number: "08",
    title: "Your Rights",
    content: [
      {
        type: "paragraph",
        text: "Depending on your location and applicable law, you may have the right to:",
      },
      {
        type: "list-green",
        items: [
          "Access your personal information",
          "Request correction of inaccurate information",
          "Request deletion of your account or personal data, where applicable",
        ],
      },
      {
        type: "paragraph",
        text: "To exercise any of these rights, contact us using the details at the bottom of this page.",
      },
    ],
  },
  {
    id: "third-parties",
    icon: "ti-plug",
    number: "09",
    title: "Third-Party Services",
    content: [
      {
        type: "paragraph",
        text: "Nexora may rely on trusted third-party service providers to help operate and host the Service. These providers may process information as necessary to provide their services, under their own privacy policies.",
      },
    ],
  },
  {
    id: "changes",
    icon: "ti-refresh",
    number: "10",
    title: "Changes to This Policy",
    content: [
      {
        type: "paragraph",
        text: "We may update this Privacy Policy from time to time. When we do, we will update the \"Last updated\" date at the top of this page and, where appropriate, notify registered users by email.",
      },
      {
        type: "paragraph",
        text: "Your continued use of Nexora after changes are published constitutes your acceptance of the updated policy.",
      },
    ],
  },
  {
    id: "contact",
    icon: "ti-mail",
    number: "11",
    title: "Contact Us",
    content: [
      {
        type: "paragraph",
        text: "If you have any questions about this Privacy Policy or how we handle your information, please reach out to us. We take all privacy inquiries seriously and respond within 24–48 hours.",
      },
    ],
    contact: true,
  },
];

type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "highlight"; text: string }
  | { type: "list-green" | "list-blue"; items: string[] };

const LIST_COLORS = {
  "list-green": { color: "#5FBF8B", bg: "rgba(95,191,139,0.1)", border: "rgba(95,191,139,0.25)", icon: "ti-check" },
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

const Privacy = () => (
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
        Privacy Policy
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.18 }}
        style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: "#8D897E", margin: "0 0 6px", position: "relative", zIndex: 1 }}
      >
        Your privacy matters to us.
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

export default memo(Privacy);
