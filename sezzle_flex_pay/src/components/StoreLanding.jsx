import { useState } from "react";
import sezzleLogo from "@/assets/sezzle-logo-light.png";
import headphonesImg from "@/assets/headphones-product.png";

const C = {
  purple:      "#8333D4",
  purpleHover: "#6B28AD",
  darkPlum:    "#382757",
  white:       "#FFFFFF",
  surface:     "#F9F9F9",
  text:        "#1A1A2E",
  muted:       "#6B7280",
  border:      "#E5E7EB",
  success:     "#00B874",
  successBg:   "#E6FFF5",
};
const FONT = "'Satoshi', system-ui, -apple-system, sans-serif";

const PRODUCT = {
  name: "Noise Cancelling Headphones",
  brand: "Target",
  price: 189.99,
  rating: 4.7,
  reviews: 2341,
  cashback: "6%",
  description: "Premium wireless noise cancelling headphones with 30-hour battery life, adaptive sound control, and crystal-clear calls.",
  features: ["Active Noise Cancellation", "30hr Battery", "Bluetooth 5.2", "Multipoint Connection"],
};

export default function StoreLanding({ onCheckout }) {
  const [liked, setLiked] = useState(false);

  return (
    <div style={{ fontFamily: FONT, background: C.surface, minHeight: "100vh", maxWidth: 430, margin: "0 auto", overflowY: "auto", paddingBottom: 80 }}>
      {/* Status bar / header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 16px 8px", background: C.white,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%", background: C.purple,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: C.white, fontWeight: 700, fontSize: 16,
          }}>M</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>$400.00</div>
            <div style={{ fontSize: 11, color: C.success, fontWeight: 600 }}>Spending Power ⚡</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <span style={{ fontSize: 20, cursor: "pointer" }}>♡</span>
          <span style={{ fontSize: 20, cursor: "pointer" }}>🔔</span>
        </div>
      </div>

      {/* Search bar */}
      <div style={{ padding: "8px 16px 12px", background: C.white }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: C.surface, borderRadius: 10, padding: "10px 14px",
          border: `1px solid ${C.border}`, fontSize: 14, color: C.muted,
        }}>
          🔍 Search products
        </div>
      </div>

      {/* Product Image */}
      <div style={{
        background: C.white, margin: "8px 16px", borderRadius: 16,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px 16px", position: "relative",
      }}>
        <div style={{
          position: "absolute", top: 12, left: 12,
          background: C.successBg, color: C.success,
          fontSize: 11, fontWeight: 700, borderRadius: 20, padding: "4px 10px",
          display: "flex", alignItems: "center", gap: 4,
        }}>
          💰 {PRODUCT.cashback} back
        </div>
        <button
          onClick={() => setLiked(!liked)}
          style={{
            position: "absolute", top: 12, right: 12,
            background: "none", border: "none", fontSize: 22, cursor: "pointer",
            color: liked ? "#E91E63" : C.muted,
          }}
        >
          {liked ? "❤️" : "♡"}
        </button>
        <img src={headphonesImg} alt={PRODUCT.name} style={{ width: "70%", maxHeight: 220, objectFit: "contain" }} />
      </div>

      {/* Product Info */}
      <div style={{ padding: "0 16px" }}>
        <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, marginBottom: 4 }}>{PRODUCT.brand}</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 6 }}>{PRODUCT.name}</div>
        
        {/* Rating */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <span style={{ color: "#F59E0B", fontSize: 14 }}>★★★★★</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{PRODUCT.rating}</span>
          <span style={{ fontSize: 12, color: C.muted }}>({PRODUCT.reviews.toLocaleString()} reviews)</span>
        </div>

        {/* Price */}
        <div style={{ fontSize: 26, fontWeight: 800, color: C.text, marginBottom: 4 }}>
          ${PRODUCT.price.toFixed(2)}
        </div>
        <div style={{ fontSize: 12, color: C.purple, fontWeight: 600, marginBottom: 16 }}>
          or 4 interest-free payments of ${(PRODUCT.price / 4).toFixed(2)} with <img src={sezzleLogo} alt="Sezzle" style={{ height: 14, verticalAlign: "middle", marginLeft: 2 }} />
        </div>

        {/* Description */}
        <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.5, marginBottom: 16 }}>
          {PRODUCT.description}
        </div>

        {/* Feature tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
          {PRODUCT.features.map((f) => (
            <span key={f} style={{
              background: C.white, border: `1px solid ${C.border}`,
              borderRadius: 20, padding: "5px 12px", fontSize: 11, fontWeight: 600, color: C.text,
            }}>{f}</span>
          ))}
        </div>

        {/* Checkout Button */}
        <button
          onClick={onCheckout}
          style={{
            width: "100%", padding: "16px", borderRadius: 12,
            background: C.darkPlum, color: C.white,
            border: "none", fontSize: 16, fontWeight: 700,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            marginBottom: 24, transition: "background 0.2s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = C.purple}
          onMouseLeave={(e) => e.currentTarget.style.background = C.darkPlum}
        >
          Go to Checkout →
        </button>
      </div>

      {/* Bottom nav */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 430, background: C.white,
        borderTop: `1px solid ${C.border}`,
        display: "flex", justifyContent: "space-around", padding: "8px 0 20px",
      }}>
        {[
          { icon: "🛒", label: "Shop", active: true },
          { icon: "📦", label: "Products" },
          { icon: "📋", label: "Orders" },
          { icon: "💳", label: "Virtual Card" },
          { icon: "💰", label: "Earn" },
        ].map((tab) => (
          <div key={tab.label} style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
            fontSize: 10, fontWeight: 600,
            color: tab.active ? C.purple : C.muted, cursor: "pointer",
          }}>
            <span style={{ fontSize: 18 }}>{tab.icon}</span>
            {tab.label}
          </div>
        ))}
      </div>
    </div>
  );
}
