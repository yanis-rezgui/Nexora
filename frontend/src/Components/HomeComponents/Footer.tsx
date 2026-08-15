import { memo } from "react";

const COLUMNS = [
    {
        title: "Product",
        links: [
            { label: "Features", href: "#features" },
            { label: "Pricing", href: "#pricing" },
            { label: "FAQ", href: "#faq" },
        ],
    },
    {
        title: "Company",
        links: [
            { label: "About", href: "/about" },
            { label: "Contact", href: "/contact" },
        ],
    },
    {
        title: "Legal",
        links: [
            { label: "Privacy", href: "/privacy" },
            { label: "Terms", href: "/terms" },
        ],
    },
];

const SOCIALS = [
    { label: "GitHub", href: "https://github.com", icon: "ti-brand-github" },
    { label: "LinkedIn", href: "https://linkedin.com", icon: "ti-brand-linkedin" },
];

const Footer = () => (
    <footer
        style={{
            background: "#0A0B0F",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            padding: "56px 24px 28px",
        }}
    >
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
            <div
                className="max-[640px]:!grid-cols-2 max-[420px]:!grid-cols-1"
                style={{
                    display: "grid",
                    gridTemplateColumns: "1.6fr repeat(3, 1fr)",
                    gap: 32,
                    marginBottom: 44,
                }}
            >
                {/* Brand */}
                <div className="max-[640px]:!col-span-2 max-[420px]:!col-span-1">
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                        <div style={{
                            width: 24, height: 24, borderRadius: 6,
                            background: "linear-gradient(135deg, #E8A33D, #F2C368)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            flexShrink: 0,
                        }}>
                            <span style={{ fontFamily: "'Instrument Sans', sans-serif", fontWeight: 700, fontSize: 12, color: "#151116" }}>
                                N
                            </span>
                        </div>
                        <span style={{
                            fontFamily: "'Instrument Sans', sans-serif",
                            fontSize: 15, fontWeight: 600, color: "#F4F2EC", letterSpacing: "-0.01em",
                        }}>
                            Nexora
                        </span>
                    </div>
                    <p style={{
                        fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#5B5850",
                        lineHeight: 1.6, maxWidth: 220, margin: 0,
                    }}>
                        Project management for modern teams.
                    </p>
                </div>

                {/* Link columns */}
                {COLUMNS.map(col => (
                    <div key={col.title}>
                        <div style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: 10, fontWeight: 500, letterSpacing: "0.06em",
                            color: "#5B5850", textTransform: "uppercase",
                            marginBottom: 14,
                        }}>
                            {col.title}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {col.links.map(link => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    style={{
                                        fontFamily: "'Inter', sans-serif", fontSize: 13,
                                        color: "#8D897E", textDecoration: "none",
                                        transition: "color 0.2s", width: "fit-content",
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.color = "#F4F2EC")}
                                    onMouseLeave={e => (e.currentTarget.style.color = "#8D897E")}
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom bar */}
            <div
                className="max-[480px]:!flex-col max-[480px]:!items-start max-[480px]:!gap-4"
                style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.06)",
                }}
            >
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: "#3A3833" }}>
                    © 2026 Nexora
                </span>

                <div style={{ display: "flex", gap: 16 }}>
                    {SOCIALS.map(s => (
                        <a
                            key={s.label}
                            href={s.href}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={s.label}
                            style={{
                                color: "#5B5850", transition: "color 0.2s",
                                display: "flex", alignItems: "center",
                            }}
                            onMouseEnter={e => (e.currentTarget.style.color = "#C9C5B9")}
                            onMouseLeave={e => (e.currentTarget.style.color = "#5B5850")}
                        >
                            <i className={`ti ${s.icon}`} style={{ fontSize: 16 }} />
                        </a>
                    ))}
                </div>
            </div>
        </div>
    </footer>
);

export default memo(Footer);