"use client";
import { useState } from "react";

export default function YartaLanding() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div style={{ background: "#fff", minHeight: "100vh", fontFamily: "'Outfit', sans-serif", color: "#111" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .nav { position: fixed; top: 0; left: 0; right: 0; background: rgba(255,255,255,.92); backdrop-filter: blur(12px); border-bottom: 1px solid #f0f0f0; z-index: 100; }
        .nav-inner { max-width: 1080px; margin: 0 auto; padding: 0 32px; height: 60px; display: flex; align-items: center; justify-content: space-between; }
        .nav-logo { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 700; letter-spacing: 2px; }
        .nav-links { display: flex; align-items: center; gap: 32px; }
        .nav-link { color: #999; font-size: 13px; text-decoration: none; letter-spacing: .3px; transition: color .2s; cursor: pointer; }
        .nav-link:hover { color: #111; }
        .nav-cta { background: #111; color: white; border: none; border-radius: 8px; padding: 9px 20px; font-size: 13px; font-family: 'Outfit', sans-serif; font-weight: 500; cursor: pointer; letter-spacing: .3px; transition: opacity .2s; }
        .nav-cta:hover { opacity: .8; }
        .hero { padding: 160px 32px 100px; text-align: center; max-width: 800px; margin: 0 auto; }
        .hero-eyebrow { font-size: 11px; letter-spacing: 3px; color: #bbb; text-transform: uppercase; margin-bottom: 24px; }
        .hero-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(52px, 8vw, 88px); font-weight: 700; line-height: 1.05; color: #111; margin-bottom: 24px; }
        .hero-title em { font-style: italic; color: #bbb; }
        .hero-sub { font-size: 17px; color: #888; line-height: 1.7; max-width: 520px; margin: 0 auto 48px; font-weight: 300; }
        .hero-form { display: flex; gap: 10px; max-width: 420px; margin: 0 auto; }
        .hero-input { flex: 1; background: #fafafa; border: 1px solid #e8e8e8; border-radius: 8px; padding: 13px 16px; font-size: 14px; font-family: 'Outfit', sans-serif; outline: none; color: #111; transition: border-color .2s; }
        .hero-input:focus { border-color: #111; background: #fff; }
        .hero-btn { background: #111; color: white; border: none; border-radius: 8px; padding: 13px 24px; font-size: 14px; font-family: 'Outfit', sans-serif; font-weight: 500; cursor: pointer; white-space: nowrap; transition: opacity .2s; }
        .hero-btn:hover { opacity: .8; }
        .hero-note { font-size: 12px; color: #ccc; margin-top: 14px; letter-spacing: .3px; }
        .section { max-width: 1080px; margin: 0 auto; padding: 80px 32px; }
        .divider { height: 1px; background: #f0f0f0; max-width: 1080px; margin: 0 auto; }
        .section-eyebrow { font-size: 11px; letter-spacing: 3px; color: #bbb; text-transform: uppercase; margin-bottom: 16px; }
        .section-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(36px, 5vw, 52px); font-weight: 700; line-height: 1.1; color: #111; margin-bottom: 16px; }
        .section-sub { font-size: 15px; color: #999; line-height: 1.7; max-width: 480px; font-weight: 300; }
        .how-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1px; background: #f0f0f0; border: 1px solid #f0f0f0; border-radius: 12px; overflow: hidden; margin-top: 48px; }
        .how-card { background: #fff; padding: 32px; }
        .how-num { font-family: 'Cormorant Garamond', serif; font-size: 48px; font-weight: 700; color: #ebebeb; margin-bottom: 16px; line-height: 1; }
        .how-title { font-size: 15px; font-weight: 500; color: #111; margin-bottom: 8px; }
        .how-text { font-size: 13px; color: #bbb; line-height: 1.7; font-weight: 300; }
        .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; margin-top: 48px; }
        .feature { border: 1px solid #f0f0f0; border-radius: 12px; padding: 28px; transition: border-color .2s; }
        .feature:hover { border-color: #ddd; }
        .feature-icon { width: 36px; height: 36px; background: #f5f5f5; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; font-size: 16px; }
        .feature-title { font-size: 15px; font-weight: 500; color: #111; margin-bottom: 8px; }
        .feature-text { font-size: 13px; color: #bbb; line-height: 1.7; font-weight: 300; }
        .pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 48px; }
        @media (max-width: 700px) { .pricing-grid { grid-template-columns: 1fr; } .hero-form { flex-direction: column; } }
        .price-card { border: 1px solid #f0f0f0; border-radius: 12px; padding: 28px; position: relative; }
        .price-card.featured { border-color: #111; }
        .price-badge { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: #111; color: white; font-size: 11px; font-weight: 500; padding: 4px 14px; border-radius: 20px; letter-spacing: .5px; white-space: nowrap; }
        .price-plan { font-size: 11px; letter-spacing: 2px; color: #bbb; text-transform: uppercase; margin-bottom: 16px; }
        .price-amount { font-family: 'Cormorant Garamond', serif; font-size: 48px; font-weight: 700; color: #111; line-height: 1; margin-bottom: 4px; }
        .price-per { font-size: 13px; color: #bbb; margin-bottom: 24px; }
        .price-list { list-style: none; margin-bottom: 28px; }
        .price-list li { font-size: 13px; color: #888; padding: 6px 0; border-bottom: 1px solid #f8f8f8; display: flex; align-items: center; gap: 8px; font-weight: 300; }
        .price-list li:before { content: "–"; color: #ccc; flex-shrink: 0; }
        .price-btn { width: 100%; background: #f5f5f5; color: #111; border: none; border-radius: 8px; padding: 12px; font-size: 13px; font-family: 'Outfit', sans-serif; font-weight: 500; cursor: pointer; transition: all .15s; letter-spacing: .3px; }
        .price-btn:hover { background: #ebebeb; }
        .price-btn.dark { background: #111; color: white; }
        .price-btn.dark:hover { opacity: .85; }
        .testimonial-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-top: 48px; }
        .testimonial { border: 1px solid #f0f0f0; border-radius: 12px; padding: 24px; }
        .test-text { font-size: 14px; color: #666; line-height: 1.7; margin-bottom: 20px; font-weight: 300; font-style: italic; font-family: 'Cormorant Garamond', serif; font-size: 17px; }
        .test-author { display: flex; align-items: center; gap: 10px; }
        .test-avatar { width: 32px; height: 32px; background: #f0f0f0; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #bbb; font-weight: 500; flex-shrink: 0; }
        .test-name { font-size: 13px; font-weight: 500; color: #111; }
        .test-role { font-size: 11px; color: #bbb; }
        .cta-section { background: #f8f8f8; border-top: 1px solid #f0f0f0; border-bottom: 1px solid #f0f0f0; padding: 80px 32px; text-align: center; }
        .footer { max-width: 1080px; margin: 0 auto; padding: 40px 32px; display: flex; justify-content: space-between; align-items: center; }
        .footer-logo { font-family: 'Cormorant Garamond', serif; font-size: 18px; font-weight: 700; letter-spacing: 2px; color: #bbb; }
        .footer-text { font-size: 12px; color: #ccc; }
        .stat-row { display: flex; gap: 48px; justify-content: center; margin: 60px 0; padding: 40px; border-top: 1px solid #f0f0f0; border-bottom: 1px solid #f0f0f0; }
        .stat { text-align: center; }
        .stat-num { font-family: 'Cormorant Garamond', serif; font-size: 42px; font-weight: 700; color: #111; line-height: 1; }
        .stat-label { font-size: 12px; color: #bbb; margin-top: 4px; letter-spacing: .5px; }
        .fade-in { animation: fadeUp .5s ease forwards; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      {/* Nav */}
      <nav className="nav">
        <div className="nav-inner">
          <div className="nav-logo">LOYTI</div>
          <div className="nav-links">
            <span className="nav-link">How it works</span>
            <span className="nav-link">Features</span>
            <span className="nav-link">Pricing</span>
            <button className="nav-cta">Get started →</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="hero fade-in">
        <div className="hero-eyebrow">Customer data platform for restaurants</div>
        <h1 className="hero-title">
          Turn every scan into<br/><em>a loyal customer</em>
        </h1>
        <p className="hero-sub">
          LOYTI lets restaurants collect customer data through QR codes, then use it to run targeted campaigns, SMS offers, and birthday rewards — all from one dashboard.
        </p>
        {!submitted ? (
          <>
            <div className="hero-form">
              <input className="hero-input" type="email" placeholder="your@restaurant.com" value={email} onChange={e => setEmail(e.target.value)} />
              <button className="hero-btn" onClick={() => email && setSubmitted(true)}>Start for free</button>
            </div>
            <div className="hero-note">No credit card required · Free plan available</div>
          </>
        ) : (
          <div style={{ background: "#f8f8f8", border: "1px solid #f0f0f0", borderRadius: 10, padding: "16px 24px", display: "inline-block" }}>
            <div style={{ fontSize: 14, color: "#111", fontWeight: 500 }}>You're on the list ✓</div>
            <div style={{ fontSize: 12, color: "#bbb", marginTop: 4 }}>We'll be in touch at {email}</div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 32px" }}>
        <div className="stat-row">
          {[["2 min", "Setup time"], ["0€", "To get started"], ["100%", "Data ownership"], ["∞", "Customers per offer"]].map(([n, l]) => (
            <div key={l} className="stat">
              <div className="stat-num">{n}</div>
              <div className="stat-label">{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="divider" />

      {/* How it works */}
      <div className="section">
        <div className="section-eyebrow">How it works</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20 }}>
          <h2 className="section-title">Simple for you.<br/>Seamless for them.</h2>
          <p className="section-sub">Four steps from zero to a running loyalty program that collects real customer data.</p>
        </div>
        <div className="how-grid">
          {[
            ["01", "Create an offer", "Set your discount, expiry date, and brand color. Takes 60 seconds."],
            ["02", "Generate a QR code", "LOYTI creates a unique QR code for each offer automatically."],
            ["03", "Customer scans", "They fill in name, phone, email, and date of birth to claim the offer."],
            ["04", "Data is yours", "Every customer is saved to your dashboard. Export, email, SMS anytime."],
          ].map(([num, title, text]) => (
            <div key={num} className="how-card">
              <div className="how-num">{num}</div>
              <div className="how-title">{title}</div>
              <div className="how-text">{text}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="divider" />

      {/* Features */}
      <div className="section">
        <div className="section-eyebrow">Features</div>
        <h2 className="section-title">Everything you need<br/>to own your audience.</h2>
        <div className="features-grid">
          {[
            ["◻", "QR Codes", "One unique QR per offer. Print it, display it on a screen, or put it on your menu."],
            ["◉", "Customer Database", "Every scan becomes a contact. Name, phone, email, date of birth — all yours."],
            ["◈", "Birthday Automation", "Automatically send a special offer on each customer's birthday."],
            ["◎", "Newsletter Campaigns", "Send targeted emails to all customers or specific segments in one click."],
            ["◑", "SMS Offers", "Text your customers directly with promotions and discount codes."],
            ["◍", "CSV Export", "Download your full customer list as a spreadsheet anytime, no lock-in."],
          ].map(([icon, title, text]) => (
            <div key={title} className="feature">
              <div className="feature-icon">{icon}</div>
              <div className="feature-title">{title}</div>
              <div className="feature-text">{text}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="divider" />

      {/* Pricing */}
      <div className="section">
        <div className="section-eyebrow">Pricing</div>
        <h2 className="section-title">Transparent pricing.<br/>No surprises.</h2>
        <div className="pricing-grid">
          <div className="price-card">
            <div className="price-plan">Free</div>
            <div className="price-amount">€0</div>
            <div className="price-per">forever</div>
            <ul className="price-list">
              {["1 active offer", "Up to 100 customers", "QR code generation", "CSV export", "Basic dashboard"].map(f => <li key={f}>{f}</li>)}
            </ul>
            <button className="price-btn">Get started</button>
          </div>
          <div className="price-card featured">
            <div className="price-badge">Most popular</div>
            <div className="price-plan">Pro</div>
            <div className="price-amount">€29</div>
            <div className="price-per">per month</div>
            <ul className="price-list">
              {["Unlimited offers", "Unlimited customers", "SMS campaigns", "Newsletter campaigns", "Birthday automation", "Priority support"].map(f => <li key={f}>{f}</li>)}
            </ul>
            <button className="price-btn dark">Start free trial</button>
          </div>
          <div className="price-card">
            <div className="price-plan">Enterprise</div>
            <div className="price-amount">€99</div>
            <div className="price-per">per month</div>
            <ul className="price-list">
              {["Everything in Pro", "Multiple locations", "White-label option", "Custom domain", "Dedicated support", "API access"].map(f => <li key={f}>{f}</li>)}
            </ul>
            <button className="price-btn">Contact us</button>
          </div>
        </div>
      </div>

      <div className="divider" />

      {/* Testimonials */}
      <div className="section">
        <div className="section-eyebrow">Early users</div>
        <h2 className="section-title">What restaurants say.</h2>
        <div className="testimonial-grid">
          {[
            ["We collected 200 customer emails in the first week just by putting the QR code on our tables.", "Marc D.", "Le Comptoir, Paris"],
            ["The birthday automation is genius. Customers come back just to use their birthday discount.", "Sarah K.", "Bloom Café, London"],
            ["Finally I own my customer data. No more depending on Deliveroo or Instagram.", "Antoine V.", "Casa Verde, Lyon"],
          ].map(([text, name, role]) => (
            <div key={name} className="testimonial">
              <div className="test-text">"{text}"</div>
              <div className="test-author">
                <div className="test-avatar">{name[0]}</div>
                <div>
                  <div className="test-name">{name}</div>
                  <div className="test-role">{role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="cta-section">
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <div className="section-eyebrow" style={{ textAlign: "center" }}>Get started today</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 5vw, 52px)", fontWeight: 700, lineHeight: 1.1, color: "#111", marginBottom: 16, textAlign: "center" }}>
            Your first QR code<br/>in 2 minutes.
          </h2>
          <p style={{ fontSize: 15, color: "#999", textAlign: "center", marginBottom: 32, lineHeight: 1.7, fontWeight: 300 }}>
            No technical skills needed. No credit card required. Start collecting customer data today.
          </p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button className="nav-cta" style={{ padding: "13px 32px", fontSize: 14 }}>Create your free account →</button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-logo">LOYTI</div>
        <div className="footer-text">© 2026 LOYTI. All rights reserved.</div>
      </footer>
    </div>
  );
}
