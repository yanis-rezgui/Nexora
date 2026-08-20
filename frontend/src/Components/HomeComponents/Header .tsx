import { memo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";

const NAV_LINKS = [
    { label: "Product",      href: "#preview" },
    { label: "Features",     href: "#features" },
    { label: "How it works", href: "#how" },
    { label: "Pricing",      href: "#pricing" },
    { label: "Resources",    href: "#faq" },
];

const Header = () => {
    const navigate = useNavigate();
    const [showNav, setShowNav] = useState<boolean>(false);
    const [scrolled, setScrolled] = useState<boolean>(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className="fixed top-0 left-0 right-0 z-50 h-[64px] flex items-center justify-between px-6"
            style={{
                background: scrolled ? "rgba(13,14,18,0.9)" : "#0D0E12",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                backdropFilter: scrolled ? "blur(10px)" : "none",
                transition: "background 0.3s ease, backdrop-filter 0.3s ease",
                fontFamily: "'Inter', sans-serif",
            }}
        >
            {/* Logo */}
            <a href="#hero" style={{ textDecoration: "none" }} className="flex items-center gap-2.5">
                <div
                    style={{
                        width: 30, height: 30, borderRadius: 8,
                        background: "linear-gradient(135deg, #E8A33D, #F2C368)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                    }}
                >
                    <span style={{
                        fontFamily: "'Instrument Sans', sans-serif",
                        fontWeight: 700, fontSize: 15, color: "#151116",
                    }}>
                        N
                    </span>
                </div>
                <span style={{
                    fontFamily: "'Instrument Sans', sans-serif",
                    color: "#F4F2EC", fontSize: 17, fontWeight: 600, letterSpacing: "-0.01em",
                }}>
                    Nexora
                </span>
            </a>

            {/* Nav desktop */}
            <nav className="max-[900px]:hidden flex items-center gap-7">
                {NAV_LINKS.map(link => (
                    <a
                        key={link.href}
                        href={link.href}
                        style={{
                            color: "#8D897E", fontSize: 13.5, fontWeight: 500,
                            textDecoration: "none", transition: "color 0.2s",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.color = "#F4F2EC")}
                        onMouseLeave={e => (e.currentTarget.style.color = "#8D897E")}
                    >
                        {link.label}
                    </a>
                ))}
            </nav>

            {/* CTA desktop */}
            <div className="max-[900px]:hidden flex items-center gap-5">
                <Link
                    to="/login"
                    style={{
                        color: "#8D897E", fontSize: 13.5, fontWeight: 500,
                        textDecoration: "none", transition: "color 0.2s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#F4F2EC")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#8D897E")}
                >
                    Log in
                </Link>
                <Link
                    to="/register"
                    style={{
                        background: "#E8A33D", color: "#151116", fontSize: 13, fontWeight: 600,
                        padding: "8px 17px", borderRadius: 7, textDecoration: "none",
                        transition: "opacity 0.2s, transform 0.15s", display: "inline-block",
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
                    Get started
                </Link>
            </div>

            {/* Burger mobile */}
            <div
                className="hidden max-[900px]:flex items-center justify-center cursor-pointer"
                onClick={() => setShowNav(prev => !prev)}
                style={{ color: "#F4F2EC", fontSize: 20, width: 36, height: 36 }}
            >
                {showNav ? "✕" : "☰"}
            </div>

            {/* Nav mobile */}
            <AnimatePresence>
                {showNav && (
                    <motion.nav
                        initial={{ x: 220, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 220, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 280, damping: 28 }}
                        style={{
                            position: "fixed", top: 64, right: 0,
                            width: 210, height: "calc(100vh - 64px)",
                            background: "#0D0E12",
                            borderLeft: "1px solid rgba(255,255,255,0.07)",
                            paddingTop: 26, paddingLeft: 22,
                            display: "flex", flexDirection: "column", gap: 22,
                            zIndex: 50,
                        }}
                    >
                        {NAV_LINKS.map(link => (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={() => setShowNav(false)}
                                style={{
                                    color: "#8D897E", fontSize: 15, fontWeight: 500,
                                    textDecoration: "none", transition: "color 0.2s",
                                }}
                                onMouseEnter={e => (e.currentTarget.style.color = "#F4F2EC")}
                                onMouseLeave={e => (e.currentTarget.style.color = "#8D897E")}
                            >
                                {link.label}
                            </a>
                        ))}
                        <div style={{
                            marginTop: "auto", paddingBottom: 26,
                            display: "flex", flexDirection: "column", gap: 12,
                        }}>
                            <a
                                href="/login"
                                style={{ color: "#8D897E", fontSize: 14, textDecoration: "none", fontWeight: 500 }}
                            >
                                Log in
                            </a>
                            <button
                                onClick={() => navigate("/register")}
                                style={{
                                    background: "#E8A33D", color: "#151116", fontSize: 13, fontWeight: 600,
                                    padding: "9px 18px", borderRadius: 7, border: "none",
                                    cursor: "pointer", width: "fit-content",
                                }}
                            >
                                Get started
                            </button>
                        </div>
                    </motion.nav>
                )}
            </AnimatePresence>
        </header>
    );
};

export default memo(Header);
