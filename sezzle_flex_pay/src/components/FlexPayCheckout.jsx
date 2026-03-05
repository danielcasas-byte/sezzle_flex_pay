import { useState, useRef, useEffect, useCallback } from "react";
import sezzleLogo from "@/assets/sezzle-logo-light.png";

// ─── Sezzle Brand Theme ────────────────────────────────────────────────────
const C = {
  purple:      "#8333D4",
  purpleHover: "#6B28AD",
  purpleLight: "#CE5DCB",
  purpleFaint: "#F3E8FF",
  purpleBg:    "#FAFAFA",
  darkPlum:    "#382757",
  white:       "#FFFFFF",
  surface:     "#F9F9F9",
  text:        "#1A1A2E",
  textLight:   "#382757",
  muted:       "#6B7280",
  border:      "#E5E7EB",
  borderLight: "#F0F0F0",
  success:     "#00B874",
  successBg:   "#E6FFF5",
  payday:      "#29D3A2",
  paydayBg:    "#E6FFF5",
};

const TOTAL = 189.99;
const MERCHANT = "Target";
const FONT = "'Satoshi', system-ui, -apple-system, sans-serif";

// ─── Sample Data ────────────────────────────────────────────────────────────
const STANDARD_PLANS = [
  {
    id: "pi4",
    label: "4 payments",
    sub: `Make 4 interest-free payments of $47.50 every 2 weeks.`,
    first: 47.50,
    popular: true,
    count: 4,
    frequency: "Bi-weekly",
    installments: [
      { amount: 47.50, date: "Today",  payday: false },
      { amount: 47.50, date: "Mar 19", payday: false },
      { amount: 47.50, date: "Apr 2",  payday: false },
      { amount: 47.49, date: "Apr 16", payday: false },
    ],
  },
  {
    id: "pi5",
    label: "5 payments",
    sub: `Make 5 interest-free payments of $38.00 every 2 weeks.`,
    first: 38.00,
    count: 5,
    frequency: "Bi-weekly",
    installments: [
      { amount: 38.00, date: "Today",  payday: false },
      { amount: 38.00, date: "Mar 19", payday: false },
      { amount: 38.00, date: "Apr 2",  payday: false },
      { amount: 38.00, date: "Apr 16", payday: false },
      { amount: 37.99, date: "Apr 30", payday: false },
    ],
  },
];

const FLEX_PRESETS = [
  {
    id: "flex-recommended",
    name: "✦ What we think will suit you best",
    recommended: true,
    first: 24.99,
    count: 4,
    frequency: "Bi-weekly",
    installments: [
      { amount: 24.99, date: "Today",  payday: false },
      { amount: 62.00, date: "Mar 21", payday: true  },
      { amount: 62.00, date: "Apr 4",  payday: true  },
      { amount: 41.00, date: "Apr 18", payday: true  },
    ],
  },
  {
    id: "flex-option-2",
    name: "Option 2",
    recommended: false,
    first: 15.00,
    count: 4,
    frequency: "Bi-weekly",
    installments: [
      { amount: 15.00, date: "Today",  payday: false },
      { amount: 58.33, date: "Mar 19", payday: false },
      { amount: 58.33, date: "Apr 2",  payday: false },
      { amount: 58.33, date: "Apr 16", payday: false },
    ],
  },
  {
    id: "flex-option-3",
    name: "Option 3",
    recommended: false,
    first: 70.00,
    count: 4,
    frequency: "Bi-weekly",
    installments: [
      { amount: 70.00, date: "Today",  payday: false },
      { amount: 50.00, date: "Mar 19", payday: false },
      { amount: 40.00, date: "Apr 2",  payday: false },
      { amount: 29.99, date: "Apr 16", payday: false },
    ],
  },
  {
    id: "flex-option-4",
    name: "Option 4",
    recommended: false,
    first: 20.00,
    count: 4,
    frequency: "Bi-weekly",
    installments: [
      { amount: 20.00, date: "Today",  payday: false },
      { amount: 40.00, date: "Mar 19", payday: false },
      { amount: 55.00, date: "Apr 2",  payday: false },
      { amount: 74.99, date: "Apr 16", payday: false },
    ],
  },
];

const FLEX_PLAN = {
  id: "flex",
  label: "Flex Pay",
  sub: "AI-powered payment options tailored to you.",
  first: FLEX_PRESETS[0].first,
  count: FLEX_PRESETS[0].count,
  frequency: FLEX_PRESETS[0].frequency,
  installments: FLEX_PRESETS[0].installments,
};

const DATES_4 = ["Today", "Mar 19", "Apr 2", "Apr 16"];
const DATES_5 = ["Today", "Mar 19", "Apr 2", "Apr 16", "Apr 30"];

const BASE_DATE = new Date(2026, 2, 5);
const DATE_MAP = {
  "Today":  new Date(2026, 2, 5),
  "Mar 19": new Date(2026, 2, 19),
  "Mar 21": new Date(2026, 2, 21),
  "Apr 2":  new Date(2026, 3, 2),
  "Apr 4":  new Date(2026, 3, 4),
  "Apr 16": new Date(2026, 3, 16),
  "Apr 18": new Date(2026, 3, 18),
  "Apr 30": new Date(2026, 3, 30),
  "May 2":  new Date(2026, 4, 2),
};

const fmtDate = (d) => {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
};

const fmtDateShort = (d) => {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[d.getMonth()]} ${d.getDate()}`;
};

const addDays = (d, n) => {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
};

const fmt = (n) => "$" + n.toFixed(2);

// ─── Merchant Header Bar ─────────────────────────────────────────────────────
function MerchantBar() {
  return (
    <div style={{
      background: C.darkPlum,
      padding: "10px 20px",
      display: "flex", justifyContent: "space-between", alignItems: "center",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>←</span>
        <span style={{ color: C.purple, fontSize: 13, fontWeight: 600 }}>{MERCHANT}</span>
      </div>
      <span style={{ color: C.white, fontSize: 13, fontWeight: 600 }}>{fmt(TOTAL)}</span>
    </div>
  );
}

// ─── Sezzle Header ───────────────────────────────────────────────────────────
function SezzleHeader() {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "16px 0",
    }}>
      <img src={sezzleLogo} alt="Sezzle" style={{ height: 50 }} />
      <div style={{
        border: `1px solid ${C.border}`,
        borderRadius: 6, padding: "3px 8px",
        fontSize: 12, fontWeight: 600, color: C.muted,
      }}>EN</div>
    </div>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────
function CheckoutFooter({ onBack }) {
  return (
    <div style={{ textAlign: "center", paddingTop: 24, paddingBottom: 32 }}>
      <button
        onClick={onBack}
        style={{
          background: "none", border: "none", cursor: "pointer",
          color: C.purple, fontSize: 13, fontWeight: 600,
          display: "flex", alignItems: "center", gap: 4,
          margin: "0 auto", padding: 0, marginBottom: 16,
        }}
      >
        ← Return to {MERCHANT}
      </button>
      <div style={{ fontSize: 11, color: C.muted }}>
        ©2026 Sezzle Inc. | Contact Us
      </div>
    </div>
  );
}

// ─── Radio ───────────────────────────────────────────────────────────────────
function Radio({ checked }) {
  return (
    <div style={{
      width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
      border: `2px solid ${checked ? C.darkPlum : C.border}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: C.white,
      transition: "border-color 0.15s",
    }}>
      {checked && (
        <div style={{
          width: 12, height: 12, borderRadius: "50%",
          background: C.darkPlum,
        }} />
      )}
    </div>
  );
}

// ─── Chevron Icon ────────────────────────────────────────────────────────────
function ChevronIcon({ direction = "down", size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: direction === "up" ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

// ─── Calendar Icon ───────────────────────────────────────────────────────────
function CalendarIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: C.muted }}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

// ─── Checkbox Icon ───────────────────────────────────────────────────────────
function CheckIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: C.white }}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// ─── Plan Selection Screen (matches Sezzle "Choose a payment schedule") ──────
function PlanSelectionScreen({ onContinue, onMakeFlex, onBackToStore }) {
  const [selected, setSelected] = useState("flex");
  const [activePreset, setActivePreset] = useState(0);
  const [presetDropdownOpen, setPresetDropdownOpen] = useState(false);
  const currentPreset = FLEX_PRESETS[activePreset];

  return (
    <div style={{ fontFamily: FONT, background: C.white, minHeight: "100vh" }}>
      <MerchantBar />
      <div style={{ maxWidth: 440, margin: "0 auto", padding: "0 20px" }}>
        <SezzleHeader />

        <h1 style={{
          fontSize: 22, fontWeight: 800, color: C.text,
          margin: "8px 0 6px", letterSpacing: "-0.02em",
        }}>
          Choose a payment schedule
        </h1>
        <p style={{ fontSize: 14, color: C.muted, margin: "0 0 24px", lineHeight: 1.5 }}>
          Your order total is {fmt(TOTAL)}.
        </p>

        {/* ── Flex Pay Section (on top) ── */}
        <div
          onClick={() => setSelected("flex")}
          style={{
            border: selected === "flex" ? `2px solid ${C.darkPlum}` : `1px solid ${C.border}`,
            borderRadius: 12,
            padding: "16px 18px",
            cursor: "pointer",
            marginBottom: 20,
            background: selected === "flex" ? C.purpleFaint : C.white,
            transition: "all 0.15s",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <div style={{ marginTop: 1 }}><Radio checked={selected === "flex"} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontWeight: 700, fontSize: 15, color: C.text }}>
                  Flex Pay
                </span>
                <span style={{ fontWeight: 700, fontSize: 15, color: C.text }}>
                  {fmt(currentPreset.first)}<span style={{ fontSize: 12, fontWeight: 400, color: C.muted }}>/today</span>
                </span>
              </div>
              <p style={{ fontSize: 13, color: C.muted, margin: "4px 0 0", lineHeight: 1.45 }}>
                AI-powered payment options tailored to you.
              </p>

              {/* Preset Dropdown */}
              <div style={{ position: "relative", marginTop: 12 }}>
                <button
                  onClick={(e) => { e.stopPropagation(); setPresetDropdownOpen(!presetDropdownOpen); }}
                  style={{
                    width: "100%",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "10px 14px",
                    background: C.white,
                    border: `1.5px solid ${C.darkPlum}`,
                    borderRadius: 8,
                    cursor: "pointer",
                    fontSize: 13, fontWeight: 600, color: C.darkPlum,
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    {currentPreset.recommended && <span style={{ color: C.success }}>✦</span>}
                    {currentPreset.name}
                  </span>
                  <ChevronIcon direction={presetDropdownOpen ? "up" : "down"} size={14} />
                </button>

                {presetDropdownOpen && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
                    background: C.white, border: `1px solid ${C.border}`,
                    borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                    zIndex: 10, overflow: "hidden",
                  }}>
                    {FLEX_PRESETS.map((preset, idx) => (
                      <button
                        key={preset.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActivePreset(idx);
                          setPresetDropdownOpen(false);
                        }}
                        style={{
                          width: "100%", textAlign: "left",
                          padding: "10px 14px",
                          background: idx === activePreset ? C.purpleFaint : C.white,
                          border: "none", borderTop: idx > 0 ? `1px solid ${C.borderLight}` : "none",
                          cursor: "pointer",
                          fontSize: 13, color: C.text,
                          display: "flex", flexDirection: "column", gap: 2,
                        }}
                      >
                        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          {preset.recommended && <span style={{ color: C.success, fontWeight: 700 }}>✦</span>}
                          <span style={{ fontWeight: idx === activePreset ? 700 : 500 }}>{preset.name}</span>
                        </span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: C.muted, paddingLeft: preset.recommended ? 18 : 0 }}>
                          {fmt(preset.first)}/today
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Installment details for active preset */}
              <div style={{ marginTop: 14 }}>
                {currentPreset.installments.map((inst, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center",
                    padding: "8px 0",
                    borderTop: i > 0 ? `1px solid ${C.borderLight}` : "none",
                  }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: "50%",
                      border: `2px solid ${C.darkPlum}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 700, color: i === 0 ? C.white : C.darkPlum,
                      marginRight: 12, flexShrink: 0,
                      background: i === 0 ? C.darkPlum : C.white,
                    }}>
                      {i === 0 ? <CheckIcon size={12} /> : <span>{i + 1}</span>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 13, color: C.text }}>
                        {inst.date === "Today" ? "Today" : (() => {
                          const d = DATE_MAP[inst.date];
                          return d ? fmtDate(d) : inst.date;
                        })()}
                      </span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>
                      {fmt(inst.amount)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Customize button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const flexPlan = {
                    ...FLEX_PLAN,
                    first: currentPreset.first,
                    count: currentPreset.count,
                    frequency: currentPreset.frequency,
                    installments: currentPreset.installments,
                  };
                  onMakeFlex(flexPlan);
                }}
                style={{
                  marginTop: 12,
                  background: C.darkPlum, color: C.white,
                  border: "none", borderRadius: 8,
                  padding: "8px 16px", fontSize: 12, fontWeight: 700,
                  cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4,
                  width: "100%", justifyContent: "center",
                }}
              >
                ✦ Customize
              </button>
            </div>
          </div>
        </div>

        {/* ── Standard Plans Section ── */}
        <div style={{
          fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase",
          letterSpacing: "0.06em", marginBottom: 8,
        }}>
          Standard Plans
        </div>

        <div style={{
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          overflow: "hidden",
        }}>
          {STANDARD_PLANS.map((plan, i) => {
            const isSelected = selected === plan.id;
            return (
              <div
                key={plan.id}
                onClick={() => setSelected(plan.id)}
                style={{
                  padding: "16px 18px",
                  borderTop: i > 0 ? `1px solid ${C.borderLight}` : "none",
                  cursor: "pointer",
                  background: isSelected ? C.purpleFaint : C.white,
                  transition: "background 0.1s",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ marginTop: 1 }}><Radio checked={isSelected} /></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ fontWeight: 700, fontSize: 15, color: C.text }}>
                        {plan.label}
                        {plan.popular && (
                          <span style={{
                            fontSize: 10, fontWeight: 600, color: C.purple,
                            background: C.purpleFaint, padding: "2px 8px", borderRadius: 99,
                            marginLeft: 8, verticalAlign: "middle",
                          }}>Popular</span>
                        )}
                      </span>
                      <span style={{ fontWeight: 700, fontSize: 15, color: C.text }}>
                        {fmt(plan.first)}<span style={{ fontSize: 12, fontWeight: 400, color: C.muted }}>/today</span>
                      </span>
                    </div>
                    <p style={{ fontSize: 13, color: C.muted, margin: "4px 0 0", lineHeight: 1.45 }}>
                      {plan.sub}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Continue Button */}
        <button
          onClick={() => {
            if (selected === "flex") {
              onContinue({
                ...FLEX_PLAN,
                first: currentPreset.first,
                count: currentPreset.count,
                frequency: currentPreset.frequency,
                installments: currentPreset.installments,
              });
            } else {
              const plan = STANDARD_PLANS.find(p => p.id === selected);
              onContinue(plan);
            }
          }}
          style={{
            width: "100%", padding: "16px",
            background: C.darkPlum,
            color: C.white, border: "none",
            borderRadius: 999, fontSize: 15, fontWeight: 700,
            cursor: "pointer", marginTop: 24,
            transition: "background 0.15s",
          }}
        >
          Continue
        </button>

        <CheckoutFooter onBack={onBackToStore} />
      </div>
    </div>
  );
}

// ─── Complete Order Screen (matches Sezzle "Complete your order") ─────────────
function CompleteOrderScreen({ plan, onBack, onComplete, onChangePlan, onBackToStore }) {
  const [scheduleOpen, setScheduleOpen] = useState(false);

  return (
    <div style={{ fontFamily: FONT, background: C.white, minHeight: "100vh" }}>
      <MerchantBar />
      <div style={{ maxWidth: 440, margin: "0 auto", padding: "0 20px" }}>
        <SezzleHeader />

        <h1 style={{
          fontSize: 22, fontWeight: 800, color: C.text,
          margin: "8px 0 6px", letterSpacing: "-0.02em",
        }}>
          Complete your order
        </h1>
        <p style={{ fontSize: 14, color: C.muted, margin: "0 0 24px", lineHeight: 1.5 }}>
          Review your order and financing details for your purchase at {MERCHANT}.
        </p>

        {/* Down Payment Due Today */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "16px 0", borderBottom: `1px solid ${C.borderLight}`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <CalendarIcon />
            <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Down Payment Due Today</span>
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{fmt(plan.first)}</span>
        </div>

        {/* Payment Schedule Accordion */}
        <div style={{ borderBottom: `1px solid ${C.borderLight}` }}>
          <button
            onClick={() => setScheduleOpen(!scheduleOpen)}
            style={{
              width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "16px 0", background: "none", border: "none", cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <CalendarIcon />
              <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>
                {plan.frequency || "Bi-weekly"} Payment Schedule
              </span>
            </div>
            <ChevronIcon direction={scheduleOpen ? "up" : "down"} />
          </button>

          {scheduleOpen && (
            <div style={{
              paddingBottom: 16,
              animation: "fadeIn 0.15s ease",
            }}>
              {plan.installments.map((inst, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center",
                  padding: "12px 0 12px 8px",
                  borderTop: i > 0 ? `1px solid ${C.borderLight}` : "none",
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    border: `2px solid ${C.darkPlum}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 700, color: C.darkPlum,
                    marginRight: 14, flexShrink: 0,
                    background: i === 0 ? C.darkPlum : C.white,
                  }}>
                    {i === 0 ? <CheckIcon size={14} /> : <span>{i + 1}</span>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 14, color: C.text }}>
                      {inst.date === "Today" ? "Today" : (() => {
                        const d = DATE_MAP[inst.date];
                        return d ? fmtDate(d) : inst.date;
                      })()}
                    </span>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>
                    {fmt(inst.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Total */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "16px 0", borderBottom: `1px solid ${C.borderLight}`,
        }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>Order Total</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{fmt(TOTAL)}</span>
        </div>

        {/* Down Payment Card */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "16px 0", borderBottom: `1px solid ${C.borderLight}`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Down Payment</span>
            <span style={{
              fontSize: 11, color: C.muted, fontWeight: 500,
              background: C.surface, padding: "2px 6px", borderRadius: 4,
            }}>(Card Only)</span>
            <span style={{ fontSize: 13, color: C.muted }}>💳 ••• 4242</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ color: C.purple, fontSize: 14, cursor: "pointer" }}>✏️</span>
            <span style={{ color: C.purple, fontSize: 16 }}>✓</span>
          </div>
        </div>

        {/* Legal */}
        <p style={{
          fontSize: 12, color: C.muted, lineHeight: 1.6,
          margin: "16px 0 20px",
        }}>
          By selecting "Complete Order" below, I agree to the{" "}
          <span style={{ color: C.purple, textDecoration: "underline", cursor: "pointer" }}>
            Sezzle User Agreement
          </span>{" "}
          and authorize Sezzle to charge my payment methods on file in the repayment amounts and on the
          dates listed above. Failed Payment and Late Payment fees may apply.
        </p>

        {/* Complete Order */}
        <button
          onClick={onComplete}
          style={{
            width: "100%", padding: "16px",
            background: C.darkPlum, color: C.white,
            border: "none", borderRadius: 999,
            fontSize: 15, fontWeight: 700, cursor: "pointer",
          }}
        >
          Complete Order
        </button>

        {/* Change plan */}
        <button
          onClick={onChangePlan}
          style={{
            width: "100%", padding: "12px",
            background: "none", color: C.text,
            border: "none", fontSize: 13, fontWeight: 600,
            cursor: "pointer", marginTop: 8,
          }}
        >
          change payment plan
        </button>

        <CheckoutFooter onBack={onBackToStore} />
      </div>
    </div>
  );
}

// ─── Amount Wheel Picker ─────────────────────────────────────────────────────
function AmountWheel({ value, onChange, min, max, date, index }) {
  const step = 5;
  const snapMin = Math.ceil(min / step) * step;
  const snapMax = Math.floor(max / step) * step;

  const baseOptions = [];
  for (let v = snapMin; v <= snapMax; v += step) baseOptions.push(v);

  const isCustomValue = value % step !== 0;
  const options = isCustomValue
    ? [...baseOptions, value].sort((a, b) => a - b)
    : baseOptions;

  const containerRef = useRef(null);
  const ITEM_H = 44;
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const ignoreScroll = useRef(false);

  const closestIdx = options.reduce((best, opt, i) =>
    Math.abs(opt - value) < Math.abs(options[best] - value) ? i : best, 0);

  const scrollToIdx = useCallback((idx, smooth = false) => {
    if (containerRef.current && idx >= 0) {
      containerRef.current.scrollTo({
        top: idx * ITEM_H,
        behavior: smooth ? "smooth" : "auto",
      });
    }
  }, []);

  const prevValue = useRef(value);
  useEffect(() => { scrollToIdx(closestIdx, false); }, []);

  useEffect(() => {
    if (prevValue.current !== value) {
      prevValue.current = value;
      if (!ignoreScroll.current) {
        scrollToIdx(closestIdx, true);
      }
    }
  }, [value, closestIdx, scrollToIdx]);

  const snapTimeout = useRef(null);
  const onScroll = () => {
    if (!containerRef.current || ignoreScroll.current) return;
    const idx = Math.round(containerRef.current.scrollTop / ITEM_H);
    const clampedIdx = Math.max(0, Math.min(options.length - 1, idx));
    if (options[clampedIdx] !== value) onChange(options[clampedIdx]);
    clearTimeout(snapTimeout.current);
    snapTimeout.current = setTimeout(() => {
      if (!containerRef.current) return;
      const i = Math.round(containerRef.current.scrollTop / ITEM_H);
      const ci = Math.max(0, Math.min(options.length - 1, i));
      containerRef.current.scrollTo({ top: ci * ITEM_H, behavior: "smooth" });
    }, 120);
  };

  const handleInputSubmit = () => {
    const parsed = parseFloat(inputVal);
    if (!isNaN(parsed)) {
      const clamped = Math.max(min, Math.min(max, parsed));
      const rounded = Math.round(clamped * 100) / 100;
      ignoreScroll.current = true;
      onChange(rounded);
      setTimeout(() => {
        const newIsCustom = rounded % step !== 0;
        const newOptions = newIsCustom
          ? [...baseOptions, rounded].sort((a, b) => a - b)
          : baseOptions;
        const ci = newOptions.reduce((best, opt, i) =>
          Math.abs(opt - rounded) < Math.abs(newOptions[best] - rounded) ? i : best, 0);
        if (containerRef.current) {
          containerRef.current.scrollTo({ top: ci * ITEM_H, behavior: "auto" });
        }
        setTimeout(() => { ignoreScroll.current = false; }, 50);
      }, 50);
    }
    setEditing(false);
  };

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      flex: 1, minWidth: 70,
    }}>
      <div style={{
        fontSize: 10, fontWeight: 600, color: C.muted,
        marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em",
      }}>
        {date}
      </div>

      <div style={{
        background: C.white, borderRadius: 12,
        border: `2px solid ${C.borderLight}`,
        overflow: "hidden", width: "100%",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        position: "relative",
      }}>
        <div
          ref={containerRef}
          onScroll={onScroll}
          style={{
            height: ITEM_H * 3,
            overflowY: "auto",
            scrollSnapType: "y mandatory",
            WebkitOverflowScrolling: "touch",
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          <div style={{ height: ITEM_H }} />
          {options.map((opt) => {
            const isSelected = opt === options[closestIdx];
            return (
              <div
                key={opt}
                style={{
                  height: ITEM_H,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  scrollSnapAlign: "center",
                  fontWeight: isSelected ? 800 : 500,
                  fontSize: isSelected ? 18 : 14,
                  color: isSelected ? C.darkPlum : "#B0A4C8",
                  transition: "all 0.15s",
                  cursor: "pointer",
                }}
                onClick={() => {
                  onChange(opt);
                  const i = options.indexOf(opt);
                  scrollToIdx(i, true);
                }}
              >
                {fmt(opt)}
              </div>
            );
          })}
          <div style={{ height: ITEM_H }} />
        </div>

        <div style={{
          position: "absolute", top: ITEM_H, left: 0, right: 0,
          height: ITEM_H, pointerEvents: "none",
          borderTop: `2px solid ${C.darkPlum}33`,
          borderBottom: `2px solid ${C.darkPlum}33`,
          background: `${C.purpleFaint}66`,
        }} />
      </div>

      {editing ? (
        <input
          autoFocus
          type="number"
          step="0.01"
          min={min}
          max={max}
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onBlur={handleInputSubmit}
          onKeyDown={(e) => { if (e.key === "Enter") handleInputSubmit(); }}
          style={{
            marginTop: 6, width: "100%", textAlign: "center",
            fontSize: 13, fontWeight: 700, color: C.darkPlum,
            border: `2px solid ${C.darkPlum}`, borderRadius: 8,
            padding: "5px 4px", outline: "none",
            background: C.white, fontFamily: FONT,
          }}
        />
      ) : (
        <button
          onClick={() => { setInputVal(value.toString()); setEditing(true); }}
          style={{
            marginTop: 6, width: "100%", textAlign: "center",
            fontSize: 12, fontWeight: 700, color: C.darkPlum,
            background: C.purpleFaint, border: "none", borderRadius: 8,
            padding: "5px 4px", cursor: "pointer", fontFamily: FONT,
          }}
        >
          {fmt(value)} ✎
        </button>
      )}
    </div>
  );
}

// ─── Make it Flex Screen ─────────────────────────────────────────────────────
function MakeItFlexScreen({ plan, onBack, onConfirm, onBackToStore }) {
  const [selectedCount, setSelectedCount] = useState(plan.count || 4);
  const count = selectedCount;
  const dateStrings = count === 4 ? DATES_4 : DATES_5;

  const initialDates = dateStrings.map((ds, i) => {
    if (i === 0) return BASE_DATE;
    return DATE_MAP[ds] || addDays(BASE_DATE, 14 * i);
  });

  const [paymentDates, setPaymentDates] = useState(initialDates);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const firstMin = count === 4
    ? Math.ceil(TOTAL * 0.25 / 5) * 5
    : Math.ceil(TOTAL * 0.20 / 5) * 5;
  const step = 5;
  const evenSnapped = Math.floor((TOTAL / count) / step) * step;
  const firstInit = Math.max(firstMin, evenSnapped);
  const initAmounts = dateStrings.map((_, i) => {
    if (i === 0) return firstInit;
    if (i < count - 1) return evenSnapped;
    const rest = Math.round((TOTAL - firstInit - evenSnapped * (count - 2)) * 100) / 100;
    return rest > 0 ? rest : step;
  });

  const [amounts, setAmounts] = useState(initAmounts);
  const [confirmed, setConfirmed] = useState(() => new Array(count).fill(false));
  const [editedWheels, setEditedWheels] = useState(() => new Set());
  const isRedistributing = useRef(false);

  // Reset state when count changes
  useEffect(() => {
    const ds = selectedCount === 4 ? DATES_4 : DATES_5;
    const newDates = ds.map((d, i) => {
      if (i === 0) return BASE_DATE;
      return DATE_MAP[d] || addDays(BASE_DATE, 14 * i);
    });
    setPaymentDates(newDates);
    setSelectedPayment(null);

    const c = selectedCount;
    const fMin = c === 4 ? Math.ceil(TOTAL * 0.25 / 5) * 5 : Math.ceil(TOTAL * 0.20 / 5) * 5;
    const eSnapped = Math.floor((TOTAL / c) / step) * step;
    const fInit = Math.max(fMin, eSnapped);
    const newAmounts = ds.map((_, i) => {
      if (i === 0) return fInit;
      if (i < c - 1) return eSnapped;
      const rest = Math.round((TOTAL - fInit - eSnapped * (c - 2)) * 100) / 100;
      return rest > 0 ? rest : step;
    });
    setAmounts(newAmounts);
    setConfirmed(new Array(c).fill(false));
    setEditedWheels(new Set());
  }, [selectedCount]);

  const currentTotal = amounts.reduce((s, a) => s + a, 0);
  const remaining = Math.round((TOTAL - currentTotal) * 100) / 100;

  const updateAmount = (index, newVal) => {
    if (isRedistributing.current) return;

    const next = [...amounts];
    next[index] = newVal;

    const newEdited = new Set(editedWheels);
    newEdited.add(index);

    const uneditedIndices = [];
    for (let i = 0; i < count; i++) {
      if (i !== index && !newEdited.has(i)) uneditedIndices.push(i);
    }

    if (uneditedIndices.length > 0) {
      let editedSum = newVal;
      newEdited.forEach(ei => { if (ei !== index) editedSum += next[ei]; });
      const pool = Math.round((TOTAL - editedSum) * 100) / 100;
      const evenShare = Math.floor((pool / uneditedIndices.length) * 100) / 100;
      let distributed = 0;
      uneditedIndices.forEach((i, idx) => {
        if (idx < uneditedIndices.length - 1) {
          const share = Math.max(5, evenShare);
          next[i] = share;
          distributed += share;
        } else {
          const last = Math.round((pool - distributed) * 100) / 100;
          next[i] = Math.max(5, last);
        }
      });
    }

    isRedistributing.current = true;
    setEditedWheels(newEdited);
    setAmounts(next);
    const nextConf = new Array(count).fill(false);
    setConfirmed(nextConf);
    setTimeout(() => { isRedistributing.current = false; }, 300);
  };

  const autoBalance = () => {
    const next = [...amounts];
    const sumOthers = next.slice(0, -1).reduce((s, a) => s + a, 0);
    const last = Math.round((TOTAL - sumOthers) * 100) / 100;
    if (last >= 1 && last <= TOTAL) {
      next[next.length - 1] = last;
      setAmounts(next);
    }
  };

  const isBalanced = Math.abs(remaining) < 0.02;

  const getWindowForPayment = (index) => {
    if (index === null || index === 0 || index >= initialDates.length) return null;
    const original = initialDates[index];
    if (!original) return null;
    return { minDate: addDays(original, -5), maxDate: addDays(original, 5) };
  };

  const isInWindow = (date, window) => {
    if (!window) return false;
    return date >= window.minDate && date <= window.maxDate;
  };

  const isSameDay = (a, b) => {
    if (!a || !b) return false;
    return a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
  };

  const handleCalendarDayClick = (date) => {
    if (selectedPayment === null || selectedPayment === 0) return;
    const window = getWindowForPayment(selectedPayment);
    if (!window || !isInWindow(date, window)) return;
    const prevDate = selectedPayment > 0 ? paymentDates[selectedPayment - 1] : null;
    const nextDate = selectedPayment < count - 1 ? paymentDates[selectedPayment + 1] : null;
    if (prevDate && date <= prevDate) return;
    if (nextDate && date >= nextDate) return;
    const collision = paymentDates.some((pd, i) => i !== selectedPayment && isSameDay(pd, date));
    if (collision) return;
    const newDates = [...paymentDates];
    newDates[selectedPayment] = date;
    setPaymentDates(newDates);
    const nextConf = [...confirmed];
    nextConf[selectedPayment] = false;
    setConfirmed(nextConf);
  };

  const allMonths = [];
  const monthSet = new Set();
  const datesToConsider = [...paymentDates];
  if (selectedPayment !== null && selectedPayment > 0) {
    const w = getWindowForPayment(selectedPayment);
    if (w) { datesToConsider.push(w.minDate, w.maxDate); }
  }
  datesToConsider.forEach(d => {
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (!monthSet.has(key)) { monthSet.add(key); allMonths.push({ year: d.getFullYear(), month: d.getMonth() }); }
  });
  allMonths.sort((a, b) => a.year - b.year || a.month - b.month);

  const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  const getMonthDays = (year, month) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const activeWindow = getWindowForPayment(selectedPayment);
  const displayDates = paymentDates.map((d, i) => i === 0 ? "Today" : fmtDateShort(d));

  return (
    <div style={{ fontFamily: FONT, background: C.white, minHeight: "100vh" }}>
      <MerchantBar />
      <div style={{ maxWidth: 440, margin: "0 auto", padding: "0 20px" }}>
        <SezzleHeader />

        {/* Back */}
        <button
          onClick={onBack}
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: C.purple, fontSize: 13, fontWeight: 600,
            marginBottom: 12, padding: 0,
            display: "flex", alignItems: "center", gap: 4,
          }}
        >
          ← Back
        </button>

        <h1 style={{
          fontSize: 20, fontWeight: 800, color: C.text,
          margin: "0 0 4px", letterSpacing: "-0.02em",
        }}>
          ✦ Customize Flex Pay
        </h1>
        <p style={{ fontSize: 13, color: C.muted, margin: "0 0 16px", lineHeight: 1.5 }}>
          Choose your number of payments, then adjust amounts and dates to fit your budget.
        </p>

        {/* Payment count selector */}
        <div style={{
          display: "flex", gap: 10, marginBottom: 20,
        }}>
          {[4, 5].map(n => (
            <button
              key={n}
              onClick={() => setSelectedCount(n)}
              style={{
                flex: 1, padding: "12px 16px",
                border: selectedCount === n ? `2px solid ${C.darkPlum}` : `1px solid ${C.border}`,
                borderRadius: 10,
                background: selectedCount === n ? C.purpleFaint : C.white,
                cursor: "pointer", fontFamily: FONT,
                transition: "all 0.15s",
              }}
            >
              <div style={{
                fontSize: 15, fontWeight: 700,
                color: selectedCount === n ? C.darkPlum : C.text,
              }}>
                {n} Payments
              </div>
            </button>
          ))}
        </div>

        {/* Total indicator */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "14px 16px", marginBottom: 20,
          background: C.surface, borderRadius: 12,
        }}>
          <div>
            <div style={{ fontSize: 12, color: C.muted }}>Order Total</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: C.darkPlum }}>{fmt(TOTAL)}</div>
          </div>
          {isBalanced ? (
            <div style={{ fontSize: 12, color: C.success, fontWeight: 600 }}>✓ Balanced</div>
          ) : (
            <div style={{
              fontSize: 12, fontWeight: 600,
              color: remaining > 0 ? "#D97706" : "#DC2626",
            }}>
              {remaining > 0 ? `${fmt(remaining)} left` : `${fmt(Math.abs(remaining))} over`}
            </div>
          )}
        </div>

        {/* Wheels */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {amounts.map((amt, i) => (
            <AmountWheel
              key={i}
              value={amt}
              onChange={(v) => updateAmount(i, v)}
              min={i === 0 ? firstMin : 5}
              max={Math.floor(TOTAL) - (count - 1) * 5}
              date={displayDates[i]}
              index={i}
            />
          ))}
        </div>

        {/* Auto-balance */}
        <button
          onClick={autoBalance}
          style={{
            width: "100%", padding: "10px",
            background: C.surface, color: C.darkPlum,
            border: `1px solid ${C.borderLight}`, borderRadius: 10,
            fontSize: 13, fontWeight: 600, cursor: "pointer",
            marginBottom: 16, fontFamily: FONT,
          }}
        >
          ⚖️ Auto-balance last payment
        </button>

        {/* Calendar */}
        <div style={{
          border: `1px solid ${C.borderLight}`, borderRadius: 12, padding: "16px",
          marginBottom: 16,
        }}>
          <div style={{
            fontSize: 12, fontWeight: 700, color: C.muted,
            textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8,
          }}>
            📅 Payment Schedule
          </div>
          <div style={{ fontSize: 11, color: C.muted, marginBottom: 14, lineHeight: 1.5 }}>
            {selectedPayment !== null && selectedPayment > 0
              ? `Tap a highlighted day to move Payment #${selectedPayment + 1}`
              : "Tap a payment date to reschedule it (±5 days)"}
          </div>

          {/* Payment pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
            {paymentDates.map((d, i) => {
              const isFirst = i === 0;
              const isSelected = selectedPayment === i;
              const dateChanged = !isFirst && !isSameDay(d, initialDates[i]);
              return (
                <button
                  key={i}
                  onClick={() => { if (!isFirst) setSelectedPayment(isSelected ? null : i); }}
                  style={{
                    padding: "5px 10px", borderRadius: 20,
                    border: isSelected ? `2px solid ${C.darkPlum}` : `1px solid ${C.border}`,
                    background: isSelected ? C.purpleFaint : (dateChanged ? "#FEF3C7" : C.white),
                    color: isFirst ? C.muted : (isSelected ? C.darkPlum : C.text),
                    fontSize: 11, fontWeight: isSelected ? 700 : 600,
                    cursor: isFirst ? "default" : "pointer",
                    opacity: isFirst ? 0.6 : 1,
                    display: "flex", alignItems: "center", gap: 4,
                    fontFamily: FONT,
                  }}
                >
                  <span style={{ fontWeight: 700 }}>#{i + 1}</span>
                  {isFirst ? "Today" : fmtDateShort(d)}
                  <span style={{ color: C.muted, fontSize: 10 }}>{fmt(amounts[i])}</span>
                </button>
              );
            })}
          </div>

          {/* Calendar grid */}
          {allMonths.map(({ year, month }) => {
            const { firstDay, daysInMonth } = getMonthDays(year, month);
            const cells = [];
            for (let i = 0; i < firstDay; i++) cells.push(null);
            for (let d = 1; d <= daysInMonth; d++) cells.push(d);

            return (
              <div key={`${year}-${month}`} style={{ marginBottom: 12 }}>
                <div style={{
                  fontSize: 13, fontWeight: 700, color: C.text,
                  marginBottom: 8, textAlign: "center",
                }}>
                  {MONTH_NAMES[month]} {year}
                </div>
                <div style={{
                  display: "grid", gridTemplateColumns: "repeat(7, 1fr)",
                  gap: 2, textAlign: "center",
                }}>
                  {DAY_NAMES.map(d => (
                    <div key={d} style={{
                      fontSize: 9, fontWeight: 600, color: C.muted,
                      padding: "3px 0", textTransform: "uppercase",
                    }}>{d}</div>
                  ))}
                  {cells.map((day, ci) => {
                    if (day === null) return <div key={`e-${ci}`} />;
                    const cellDate = new Date(year, month, day);
                    const payIdx = paymentDates.findIndex(pd => isSameDay(pd, cellDate));
                    const isPayment = payIdx >= 0;
                    const isToday = isSameDay(cellDate, BASE_DATE);
                    const inWindow = activeWindow && isInWindow(cellDate, activeWindow);
                    const isSelectedPayment = isPayment && payIdx === selectedPayment;
                    const isClickable = inWindow && selectedPayment !== null && selectedPayment > 0;

                    let isValidTarget = false;
                    if (isClickable && !isPayment) {
                      const prevDate = selectedPayment > 0 ? paymentDates[selectedPayment - 1] : null;
                      const nextDate = selectedPayment < count - 1 ? paymentDates[selectedPayment + 1] : null;
                      isValidTarget = true;
                      if (prevDate && cellDate <= prevDate) isValidTarget = false;
                      if (nextDate && cellDate >= nextDate) isValidTarget = false;
                    }
                    if (isSelectedPayment) isValidTarget = true;

                    return (
                      <div
                        key={ci}
                        onClick={() => {
                          if (isPayment && payIdx > 0) {
                            setSelectedPayment(selectedPayment === payIdx ? null : payIdx);
                          } else if (isValidTarget) {
                            handleCalendarDayClick(cellDate);
                          }
                        }}
                        style={{
                          padding: "5px 0", borderRadius: 8, fontSize: 11,
                          fontWeight: isPayment ? 800 : (inWindow ? 600 : 400),
                          color: isSelectedPayment ? C.white
                            : isPayment ? C.white
                            : isValidTarget ? C.darkPlum
                            : inWindow ? C.purpleLight
                            : (isToday ? C.darkPlum : C.text),
                          background: isSelectedPayment ? C.darkPlum
                            : isPayment ? C.purple
                            : isValidTarget ? C.purpleFaint
                            : inWindow ? `${C.purpleFaint}88`
                            : (isToday ? C.purpleFaint : "transparent"),
                          cursor: (isPayment && payIdx > 0) || isValidTarget ? "pointer" : "default",
                          border: isSelectedPayment ? `2px solid ${C.darkPlum}` : "2px solid transparent",
                          minHeight: 36,
                          display: "flex", flexDirection: "column",
                          alignItems: "center", justifyContent: "center",
                          transition: "all 0.15s",
                        }}
                      >
                        {day}
                        {isPayment && (
                          <div style={{
                            fontSize: 7,
                            color: isSelectedPayment ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.9)",
                            marginTop: 1, lineHeight: 1, fontWeight: 600,
                          }}>
                            {fmt(amounts[payIdx])}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Confirm checkboxes */}
        <div style={{
          border: `1px solid ${C.borderLight}`, borderRadius: 12, padding: "12px 16px",
          marginBottom: 16,
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            marginBottom: 10,
          }}>
            <div
              onClick={() => {
                const allChecked = confirmed.every(Boolean);
                setConfirmed(new Array(count).fill(!allChecked));
              }}
              style={{
                width: 20, height: 20, borderRadius: 5, flexShrink: 0,
                border: `2px solid ${confirmed.every(Boolean) ? C.darkPlum : C.border}`,
                background: confirmed.every(Boolean) ? C.darkPlum : C.white,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", transition: "all 0.15s",
              }}
            >
              {confirmed.every(Boolean) && <span style={{ color: C.white, fontSize: 12, fontWeight: 700, lineHeight: 1 }}>✓</span>}
            </div>
            <span style={{
              fontSize: 12, fontWeight: 700, color: C.text,
              textTransform: "uppercase", letterSpacing: "0.07em",
            }}>
              Confirm All Payments
            </span>
          </div>
          {amounts.map((amt, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "7px 0",
              borderBottom: i < count - 1 ? `1px solid ${C.borderLight}` : "none",
            }}>
              <div
                onClick={() => {
                  const next = [...confirmed];
                  next[i] = !next[i];
                  setConfirmed(next);
                }}
                style={{
                  width: 20, height: 20, borderRadius: 5, flexShrink: 0,
                  border: `2px solid ${confirmed[i] ? C.darkPlum : C.border}`,
                  background: confirmed[i] ? C.darkPlum : C.white,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", transition: "all 0.15s",
                }}
              >
                {confirmed[i] && <span style={{ color: C.white, fontSize: 12, fontWeight: 700, lineHeight: 1 }}>✓</span>}
              </div>
              <span style={{ fontSize: 12, color: C.muted, flex: 1 }}>
                {i === 0 ? "Today" : fmtDateShort(paymentDates[i])}
              </span>
              <span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{fmt(amt)}</span>
            </div>
          ))}
        </div>

        {/* Confirm button */}
        <button
          onClick={() => {
            if (isBalanced) {
              onConfirm({
                id: `custom-${count}`,
                label: `Custom Flex ${count}`,
                sub: `${fmt(amounts[0])} today`,
                first: amounts[0],
                frequency: "Custom",
                installments: amounts.map((a, i) => ({
                  amount: a,
                  date: i === 0 ? "Today" : fmtDateShort(paymentDates[i]),
                  payday: false,
                })),
              });
            }
          }}
          disabled={!isBalanced || !confirmed.every(Boolean)}
          style={{
            width: "100%", padding: "16px",
            background: (isBalanced && confirmed.every(Boolean)) ? C.darkPlum : C.border,
            color: (isBalanced && confirmed.every(Boolean)) ? C.white : C.muted,
            border: "none", borderRadius: 999,
            fontSize: 15, fontWeight: 700,
            cursor: (isBalanced && confirmed.every(Boolean)) ? "pointer" : "not-allowed",
            marginBottom: 12, fontFamily: FONT,
          }}
        >
          Confirm Payment Plan →
        </button>

        <button
          onClick={onBack}
          style={{
            width: "100%", padding: "12px",
            background: "transparent", color: C.muted,
            border: `1px solid ${C.border}`, borderRadius: 999,
            fontSize: 13, fontWeight: 600, cursor: "pointer",
            fontFamily: FONT,
          }}
        >
          Back to Plans
        </button>

        <CheckoutFooter onBack={onBackToStore} />
      </div>
    </div>
  );
}

// ─── Confirmation Screen ─────────────────────────────────────────────────────
function ConfirmationScreen({ plan, onBack, onBackToStore }) {
  return (
    <div style={{
      fontFamily: FONT, background: C.white, minHeight: "100vh",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px 20px",
    }}>
      <div style={{ textAlign: "center", maxWidth: 360, width: "100%" }}>
        <div style={{ fontSize: 60, marginBottom: 12 }}>🎉</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 8 }}>
          Order confirmed!
        </h1>
        <p style={{ fontSize: 14, color: C.muted, marginBottom: 28, lineHeight: 1.65 }}>
          Sony WH-1000XM5 is on its way. Your first payment of{" "}
          <strong style={{ color: C.darkPlum }}>{fmt(plan.first)}</strong> is due today.
        </p>

        <div style={{
          border: `1px solid ${C.borderLight}`, borderRadius: 12, padding: "18px 20px",
          marginBottom: 24, textAlign: "left",
        }}>
          <div style={{
            fontSize: 11, fontWeight: 700, color: C.muted,
            textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 12,
          }}>
            {plan.label} Schedule
          </div>
          {plan.installments.map((inst, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between",
              padding: "7px 0",
              borderBottom: i < plan.installments.length - 1 ? `1px solid ${C.borderLight}` : "none",
            }}>
              <span style={{ fontSize: 13, color: C.muted }}>{inst.date}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>
                {fmt(inst.amount)}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={onBackToStore}
          style={{
            background: C.darkPlum, color: C.white, border: "none",
            borderRadius: 999, padding: "14px 36px",
            fontSize: 15, fontWeight: 700, cursor: "pointer",
            fontFamily: FONT,
          }}
        >
          ← Back to {MERCHANT}
        </button>
      </div>
    </div>
  );
}

// ─── Main Checkout ────────────────────────────────────────────────────────────
export default function FlexPayCheckout({ onBack }) {
  const [screen, setScreen] = useState("select"); // select | complete | flex | confirmed
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [customPlan, setCustomPlan] = useState(null);
  const [flexSource, setFlexSource] = useState(null);

  if (screen === "confirmed" && selectedPlan) {
    return (
      <ConfirmationScreen
        plan={selectedPlan}
        onBack={() => { setScreen("select"); setSelectedPlan(null); }}
        onBackToStore={onBack}
      />
    );
  }

  if (screen === "flex" && flexSource) {
    return (
      <MakeItFlexScreen
        plan={flexSource}
        onBack={() => setScreen("select")}
        onBackToStore={onBack}
        onConfirm={(plan) => {
          setCustomPlan(plan);
          setSelectedPlan(plan);
          setScreen("complete");
        }}
      />
    );
  }

  if (screen === "complete" && selectedPlan) {
    return (
      <CompleteOrderScreen
        plan={selectedPlan}
        onBack={() => setScreen("select")}
        onComplete={() => setScreen("confirmed")}
        onChangePlan={() => setScreen("select")}
        onBackToStore={onBack}
      />
    );
  }

  // Default: Plan Selection
  return (
    <PlanSelectionScreen
      onContinue={(plan) => {
        setSelectedPlan(plan);
        setScreen("complete");
      }}
      onMakeFlex={(plan) => {
        setFlexSource(plan);
        setScreen("flex");
      }}
      onBackToStore={onBack}
    />
  );
}
