"use client";
import Link from "next/link";

export default function Home() {
  return (
    <div style={{ fontFamily: "sans-serif", color: "#111" }}>
      {/* NAV */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 40px", borderBottom: "1px solid #eee" }}>
        <div style={{ fontSize: 20, fontWeight: 700 }}>LOYTI</div>
        <div style={{ display: "flex", gap: 32, fontSize: 14 }}>
          <a href="#how-it-works" style={{ textDecoration: "none", color: "#111" }}>How it works</a>
          <a href="#features" style={{ textDecoration: "none", color: "#111" }}>Features</a>
          <a href="#pricing" style={{ textDecoration: "none", color: "#111" }}>Pricing</a>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/sign-in" style={{ padding: "10px 20px", border: "1px solid #111", borderRadius: 8, textDecoration: "none", color: "#111", fontSize: 14 }}>Sign in</Link>
          <Link href="/sign-up" style={{ padding: "10px 20px", background: "#111", color: "#fff", borderRadius: 8, textDecoration: "none", fontSize: 14 }}>Get started →</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ textAlign: "center", padding: "100px 40px 80px" }}>
        <div style={{ fontSize: 12, letterSpacing: 3, color: "#999", marginBottom: 24 }}>CUSTOMER DATA PLATFORM FOR RESTAURANTS</div>
        <h1 style={{ fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 700, lineHeight: 1.1, marginBottom: 24 }}>
          Turn every scan into<br />
          <span style={{ color: "#ccc", fontStyle: "italic" }}>a loyal customer</span>
        </h1>
        <p style={{ fontSize: 18, color: "#666", maxWidth: 520, margin: "0 auto 40px", lineHeight: 1.7 }}>
          LOYTI lets restaurants collect customer data through QR codes, then use it to run targeted campaigns, SMS offers, and birthday rewards — all from one dashboard.
        </p>
        <Link href="/sign-up" style={{ display: "inline-block", padding: "16px 40px", background: "#111", color: "#fff", borderRadius: 12, textDecoration: "none", fontSize: 16, fontWeight: 600 }}>
          Start for free →
        </Link>
        <p style={{ fontSize: 13, color: "#999", marginTop: 12 }}>No credit card required · Free plan available</p>
      </section>

      {/* STATS */}
      <section style={{ display: "flex", justifyContent: "center", gap: 60, padding: "40px", borderTop: "1px solid #eee", borderBottom: "1px solid #eee" }}>
        {[["2 min", "Setup time"], ["0€", "To get started"], ["100%", "Data ownership"], ["∞", "Customers per offer"]].map(([v, l]) => (
          <div key={l} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{v}</div>
            <div style={{ fontSize: 13, color: "#999", marginTop: 4 }}>{l}</div>
          </div>
        ))}
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ padding: "80px 40px", textAlign: "center" }}>
        <div style={{ fontSize: 12, letterSpacing: 3, color: "#999", marginBottom: 16 }}>HOW IT WORKS</div>
        <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 60 }}>3 steps to loyal customers</h2>
        <div style={{ display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap" }}>
          {[
            ["🖨️", "Print your QR code", "Generate a unique QR code for your restaurant in seconds."],
            ["📱", "Customers scan & register", "They fill in their name, phone, email and birthday."],
            ["💬", "Send offers via SMS", "Target all your customers with one click from your dashboard."],
          ].map(([icon, title, desc]) => (
            <div key={title} style={{ width: 280, padding: 32, border: "1px solid #eee", borderRadius: 16 }}>
              <div style={{ fontSize: 36, marginBottom: 16 }}>{icon}</div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{title}</h3>
              <p style={{ color: "#666", lineHeight: 1.6, fontSize: 14 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: "80px 40px", background: "#f9f9f9", textAlign: "center" }}>
        <div style={{ fontSize: 12, letterSpacing: 3, color: "#999", marginBottom: 16 }}>FEATURES</div>
        <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 60 }}>Everything you need</h2>
        <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
          {[
            ["📊", "Analytics dashboard", "Track your customers, offers and growth in real time."],
            ["🎁", "Offer management", "Create and manage promotions with expiry dates."],
            ["💬", "SMS campaigns", "Send bulk SMS to all your customers in one click."],
            ["🎂", "Birthday rewards", "Automatically reward customers on their birthday."],
            ["📱", "QR code generator", "Unique QR code for each restaurant, ready to print."],
            ["🔒", "Data ownership", "Your customer data belongs to you, always."],
          ].map(([icon, title, desc]) => (
            <div key={title} style={{ width: 260, padding: 28, background: "#fff", borderRadius: 16, textAlign: "left" }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{title}</h3>
              <p style={{ color: "#666", lineHeight: 1.6, fontSize: 13 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: "80px 40px", textAlign: "center" }}>
        <div style={{ fontSize: 12, letterSpacing: 3, color: "#999", marginBottom: 16 }}>PRICING</div>
        <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 60 }}>Simple pricing</h2>
        <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
          {[
            { plan: "Free", price: "0€", per: "forever", features: ["1 location", "Up to 100 customers", "QR code", "Basic analytics"], cta: "Get started", dark: false },
            { plan: "Pro", price: "29€", per: "per month", features: ["Unlimited customers", "SMS campaigns", "Birthday automation", "Priority support"], cta: "Start free trial", dark: true },
            { plan: "Enterprise", price: "99€", per: "per month", features: ["Multiple locations", "White-label option", "Custom domain", "API access"], cta: "Contact us", dark: false },
          ].map(({ plan, price, per, features, cta, dark }) => (
            <div key={plan} style={{ width: 280, padding: 32, border: dark ? "2px solid #111" : "1px solid #eee", borderRadius: 16, background: dark ? "#111" : "#fff", color: dark ? "#fff" : "#111" }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>{plan}</div>
              <div style={{ fontSize: 40, fontWeight: 700 }}>{price}</div>
              <div style={{ fontSize: 13, color: dark ? "#aaa" : "#999", marginBottom: 24 }}>{per}</div>
              <ul style={{ listStyle: "none", padding: 0, marginBottom: 32, textAlign: "left" }}>
                {features.map(f => <li key={f} style={{ fontSize: 14, marginBottom: 8, color: dark ? "#ddd" : "#444" }}>✓ {f}</li>)}
              </ul>
              <Link href="/sign-up" style={{ display: "block", padding: "12px", background: dark ? "#fff" : "#111", color: dark ? "#111" : "#fff", borderRadius: 8, textDecoration: "none", fontSize: 14, fontWeight: 600 }}>{cta}</Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 40px", textAlign: "center", background: "#111", color: "#fff" }}>
        <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 16 }}>Ready to grow your restaurant?</h2>
        <p style={{ color: "#aaa", marginBottom: 32, fontSize: 16 }}>No technical skills needed. No credit card required.</p>
        <Link href="/sign-up" style={{ display: "inline-block", padding: "16px 40px", background: "#fff", color: "#111", borderRadius: 12, textDecoration: "none", fontSize: 16, fontWeight: 600 }}>
          Create your free account →
        </Link>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "32px 40px", borderTop: "1px solid #eee", display: "flex", justifyContent: "space-between", fontSize: 13, color: "#999" }}>
        <div>LOYTI</div>
        <div>© 2026 LOYTI. All rights reserved.</div>
      </footer>
    </div>
  );
}
