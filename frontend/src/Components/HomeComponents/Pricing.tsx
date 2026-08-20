import React, { useState, memo } from "react";
import { motion } from "framer-motion";

const CURRENCIES = [
  { code: "USD", symbol: "$",  label: "US Dollar (USD)",       flag: "🇺🇸" },
  { code: "EUR", symbol: "€",   label: "Euro (EUR)",            flag: "🇪🇺" },
  { code: "DZD", symbol: "DA",  label: "Algerian Dinar (DZD)", flag: "🇩🇿" },
  { code: "GBP", symbol: "£",   label: "British Pound (GBP)",   flag: "🇬🇧" },
];

// Taux de conversion de référence basés sur USD
const RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  DZD: 135,
  GBP: 0.79,
};

const PLANS_BASE = [
  {
    name: "Free",
    monthlyUSD: 0,
    tagline: "Try Nexora with a small team",
    color: "#8D897E",
    popular: false,
    features: ["3 projects", "5 team members", "Task management", "Comments"],
  },
  {
    name: "Pro",
    monthlyUSD: 12,
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
    monthlyUSD: 29,
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
];

const formatPrice = (usdAmount: number, currencyCode: string, symbol: string) => {
  if (usdAmount === 0) {
    return currencyCode === "DZD" ? "0 DA" : `${symbol}0`;
  }
  const converted = usdAmount * RATES[currencyCode];
  if (currencyCode === "DZD") {
    return `${Math.round(converted).toLocaleString("fr-DZ")} ${symbol}`;
  }
  return `${symbol}${converted.toFixed(0)}`;
};

const Pricing = () => {
  const [currency, setCurrency] = useState("USD");
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const [currencyOpen, setCurrencyOpen] = useState(false);

  const cur = CURRENCIES.find((c) => c.code === currency)!;

  return (
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
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.1em",
              color: "#E8A33D",
              textTransform: "uppercase",
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
              fontSize: "clamp(24px, 3.6vw, 38px)",
              fontWeight: 600,
              color: "#F4F2EC",
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
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
              fontSize: 15,
              color: "#8D897E",
              lineHeight: 1.7,
              maxWidth: 420,
              margin: "0 auto 28px",
            }}
          >
            No credit card required to get started.
          </motion.p>

          {/* Controls: Billing toggle + Currency selector */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justify: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            {/* Toggle Billing */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "#15161B",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 8,
                padding: 3,
                gap: 2,
              }}
            >
              {(["monthly", "annual"] as const).map((b) => (
                <button
                  key={b}
                  onClick={() => setBilling(b)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 6,
                    border: "none",
                    background:
                      billing === b ? "rgba(232,163,61,0.15)" : "transparent",
                    color: billing === b ? "#E8A33D" : "#8D897E",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 12.5,
                    fontWeight: billing === b ? 600 : 400,
                    cursor: "pointer",
                    transition: "background 0.2s, color 0.2s",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  {b === "annual" ? "Annual" : "Monthly"}
                  {b === "annual" && (
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 9.5,
                        color: "#151116",
                        background: "#E8A33D",
                        padding: "1px 6px",
                        borderRadius: 4,
                        fontWeight: 700,
                      }}
                    >
                      −20%
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Currency Selector */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setCurrencyOpen((p) => !p)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "7px 12px",
                  background: "#15161B",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 8,
                  color: "#F4F2EC",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 12.5,
                  cursor: "pointer",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")
                }
              >
                <span>{cur.flag}</span>
                <span>{cur.code}</span>
                <i
                  className={`ti ti-chevron-${currencyOpen ? "up" : "down"}`}
                  style={{ fontSize: 12, color: "#8D897E" }}
                />
              </button>

              {currencyOpen && (
                <>
                  <div
                    onClick={() => setCurrencyOpen(false)}
                    style={{ position: "fixed", inset: 0, zIndex: 9 }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 6px)",
                      right: 0,
                      background: "#15161B",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 10,
                      padding: "6px",
                      minWidth: 210,
                      zIndex: 10,
                      boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
                    }}
                  >
                    {CURRENCIES.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => {
                          setCurrency(c.code);
                          setCurrencyOpen(false);
                        }}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "8px 10px",
                          borderRadius: 6,
                          border: "none",
                          background:
                            currency === c.code
                              ? "rgba(232,163,61,0.12)"
                              : "transparent",
                          cursor: "pointer",
                          textAlign: "left",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          if (currency !== c.code)
                            e.currentTarget.style.background =
                              "rgba(255,255,255,0.04)";
                        }}
                        onMouseLeave={(e) => {
                          if (currency !== c.code)
                            e.currentTarget.style.background = "transparent";
                        }}
                      >
                        <span style={{ fontSize: 15 }}>{c.flag}</span>
                        <div>
                          <div
                            style={{
                              fontFamily: "'Inter', sans-serif",
                              fontSize: 12.5,
                              color: "#F4F2EC",
                              fontWeight: 500,
                            }}
                          >
                            {c.code}
                          </div>
                          <div
                            style={{
                              fontFamily: "'Inter', sans-serif",
                              fontSize: 11,
                              color: "#8D897E",
                            }}
                          >
                            {c.label}
                          </div>
                        </div>
                        {currency === c.code && (
                          <i
                            className="ti ti-check"
                            style={{
                              fontSize: 13,
                              color: "#E8A33D",
                              marginLeft: "auto",
                            }}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Cards */}
        <div
          className="max-[820px]:!grid-cols-1"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
            alignItems: "start",
          }}
        >
          {PLANS_BASE.map((plan, i) => {
            const monthlyUSD =
              billing === "annual" ? plan.monthlyUSD * 0.8 : plan.monthlyUSD;
            const displayedPrice = formatPrice(monthlyUSD, currency, cur.symbol);

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                style={{
                  position: "relative",
                  background: "#15161B",
                  border: plan.popular
                    ? "1px solid rgba(232,163,61,0.4)"
                    : "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 16,
                  padding: "28px 26px",
                  transform: plan.popular ? "translateY(-8px)" : "none",
                }}
                className={plan.popular ? "max-[820px]:!translate-y-0" : ""}
              >
                {plan.popular && (
                  <div
                    style={{
                      position: "absolute",
                      top: -12,
                      left: 26,
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 9.5,
                      fontWeight: 600,
                      color: "#151116",
                      background: "#E8A33D",
                      padding: "3px 10px",
                      borderRadius: 20,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                    }}
                  >
                    Most popular
                  </div>
                )}

                <div style={{ marginBottom: 22 }}>
                  <div
                    style={{
                      fontFamily: "'Instrument Sans', sans-serif",
                      fontSize: 14,
                      fontWeight: 600,
                      color: plan.color,
                      marginBottom: 6,
                    }}
                  >
                    {plan.name}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: 5,
                      marginBottom: 4,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Instrument Sans', sans-serif",
                        fontSize: 34,
                        fontWeight: 700,
                        color: "#F4F2EC",
                        letterSpacing: "-0.03em",
                      }}
                    >
                      {displayedPrice}
                    </span>
                    {plan.monthlyUSD > 0 && (
                      <span
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: 13,
                          color: "#5B5850",
                        }}
                      >
                        /month
                      </span>
                    )}
                  </div>

                  {plan.monthlyUSD > 0 && billing === "annual" && (
                    <div
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 11.5,
                        color: "#E8A33D",
                        marginBottom: 6,
                      }}
                    >
                      Billed {formatPrice(plan.monthlyUSD * 0.8 * 12, currency, cur.symbol)}/year
                    </div>
                  )}

                  <div
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 12.5,
                      color: "#8D897E",
                    }}
                  >
                    {plan.tagline}
                  </div>
                </div>

                <div
                  style={{
                    height: 1,
                    background: "rgba(255,255,255,0.06)",
                    marginBottom: 22,
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    marginBottom: 26,
                  }}
                >
                  {plan.features.map((f) => (
                    <div
                      key={f}
                      style={{ display: "flex", alignItems: "flex-start", gap: 9 }}
                    >
                      <i
                        className="ti ti-check"
                        style={{
                          fontSize: 13,
                          color: plan.color,
                          marginTop: 2,
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: 13,
                          color: "#C9C5B9",
                          lineHeight: 1.5,
                        }}
                      >
                        {f}
                      </span>
                    </div>
                  ))}
                </div>

                <a
                  href="/register"
                  style={{
                    display: "block",
                    textAlign: "center",
                    padding: plan.popular ? "11px" : "10px",
                    background: plan.popular ? plan.color : "transparent",
                    border: plan.popular
                      ? "none"
                      : "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 8,
                    color: plan.popular ? "#151116" : "#C9C5B9",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 13.5,
                    fontWeight: 600,
                    textDecoration: "none",
                    transition: "opacity 0.2s, border-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (plan.popular) e.currentTarget.style.opacity = "0.88";
                    else
                      e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.24)";
                  }}
                  onMouseLeave={(e) => {
                    if (plan.popular) e.currentTarget.style.opacity = "1";
                    else
                      e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.12)";
                  }}
                >
                  {plan.name === "Free"
                    ? "Get started free"
                    : `Start ${plan.name} plan →`}
                </a>
              </motion.div>
            );
          })}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{
            marginTop: 48,
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 28,
          }}
        >
          {[
            { icon: "ti-lock", label: "Secure payment" },
            { icon: "ti-refresh", label: "Cancel anytime" },
            { icon: "ti-headset", label: "Priority support" },
            { icon: "ti-shield-check", label: "No hidden fees" },
          ].map((item) => (
            <div
              key={item.label}
              style={{ display: "flex", alignItems: "center", gap: 7 }}
            >
              <i
                className={`ti ${item.icon}`}
                style={{ fontSize: 14, color: "#8D897E" }}
              />
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 12.5,
                  color: "#8D897E",
                }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default memo(Pricing);