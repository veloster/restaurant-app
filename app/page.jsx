"use client";
import { useState, useEffect, useRef } from "react";

// ─── Fake DB ────────────────────────────────────────────────────────────────
const initialOffers = [
  { id: 1, name: "Summer Tapas Night", discount: "20% OFF", desc: "Valid on all tapas plates", color: "#FF4D00", expires: "2026-08-31", active: true, scans: 142, qrGenerated: true },
  { id: 2, name: "Happy Hour Special", discount: "2 FOR 1", desc: "On all cocktails 5–7pm", color: "#00C48C", expires: "2026-12-31", active: true, scans: 87, qrGenerated: true },
];
const initialCustomers = [
  { id: 1, name: "Sophie Martin", phone: "+33 6 12 34 56 78", email: "sophie@gmail.com", dob: "1990-03-15", offer: "Summer Tapas Night", joined: "2026-03-01", smsOk: true },
  { id: 2, name: "Lucas Bernard", phone: "+33 6 98 76 54 32", email: "lucas@gmail.com", dob: "1985-07-22", offer: "Happy Hour Special", joined: "2026-03-10", smsOk: true },
  { id: 3, name: "Emma Dupont", phone: "+33 7 11 22 33 44", email: "emma@gmail.com", dob: "1998-11-05", offer: "Summer Tapas Night", joined: "2026-03-14", smsOk: false },
];

// ─── QR SVG Generator (simple matrix pattern) ────────────────────────────────
function QRCode({ value, size = 160, color = "#1a1a1a" }) {
  // Deterministic pseudo-QR from string hash
  const hash = [...value].reduce((a, c) => ((a << 5) - a + c.charCodeAt(0)) | 0, 0);
  const cells = 21;
  const grid = Array.from({ length: cells }, (_, r) =>
    Array.from({ length: cells }, (_, c) => {
      if (r < 7 && c < 7) return r === 0 || r === 6 || c === 0 || c === 6 || (r > 1 && r < 5 && c > 1 && c < 5);
      if (r < 7 && c > cells - 8) return r === 0 || r === 6 || c === cells - 1 || c === cells - 7 || (r > 1 && r < 5 && c > cells - 6 && c < cells - 2);
      if (r > cells - 8 && c < 7) return r === cells - 1 || r === cells - 7 || c === 0 || c === 6 || (r > cells - 6 && r < cells - 2 && c > 1 && c < 5);
      const bit = ((hash >> ((r * cells + c) % 32)) & 1) ^ ((r + c) % 3 === 0 ? 1 : 0);
      return bit === 1;
    })
  );
  const cell = size / cells;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ borderRadius: 8 }}>
      <rect width={size} height={size} fill="white" rx="8" />
      {grid.map((row, r) =>
        row.map((on, c) =>
          on ? <rect key={`${r}-${c}`} x={c * cell + 1} y={r * cell + 1} width={cell - 1} height={cell - 1} fill={color} rx="1" /> : null
        )
      )}
    </svg>
  );
}

// ─── CUSTOMER PAGE ───────────────────────────────────────────────────────────
function CustomerPage({ offer, onBack }) {
  const [step, setStep] = useState("form"); // form | confirm | success
  const [form, setForm] = useState({ name: "", phone: "", email: "", dob: "", confirmEmail: "" });
  const [errors, setErrors] = useState({});
  const [usedName, setUsedName] = useState("");

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!/^\+?[\d\s\-]{8,}$/.test(form.phone)) e.phone = "Invalid phone";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (form.email !== form.confirmEmail) e.confirmEmail = "Emails don't match";
    if (!form.dob) e.dob = "Required";
    return e;
  };

  const submit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setUsedName(form.name.split(" ")[0]);
    setStep("success");
  };

  const o = offer || { name: "Summer Tapas Night", discount: "20% OFF", desc: "On all tapas plates", color: "#FF4D00" };

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d0d", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 16px", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@700;900&display=swap');
        .c-input { background: #1a1a1a; border: 1.5px solid #2a2a2a; border-radius: 10px; color: #f0f0f0; padding: 14px 16px; font-size: 15px; font-family: 'DM Sans', sans-serif; width: 100%; box-sizing: border-box; outline: none; transition: border-color .2s; }
        .c-input:focus { border-color: var(--accent); }
        .c-input.err { border-color: #ff4444; }
        .c-btn { background: var(--accent); color: white; border: none; border-radius: 12px; padding: 16px; font-size: 16px; font-weight: 600; font-family: 'DM Sans', sans-serif; cursor: pointer; width: 100%; letter-spacing: .3px; transition: opacity .2s, transform .1s; }
        .c-btn:hover { opacity: .9; transform: translateY(-1px); }
        .c-btn:active { transform: scale(.98); }
        .fade-in { animation: fadeUp .5s ease forwards; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .pulse { animation: pulse 2s ease-in-out infinite; }
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }
      `}</style>

      {step === "form" && (
        <div className="fade-in" style={{ width: "100%", maxWidth: 420 }}>
          {/* Offer Card */}
          <div style={{ background: o.color, borderRadius: 20, padding: "28px 24px", marginBottom: 28, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,.12)" }} />
            <div style={{ position: "absolute", bottom: -20, left: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,.08)" }} />
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 42, fontWeight: 900, color: "white", lineHeight: 1 }}>{o.discount}</div>
            <div style={{ color: "rgba(255,255,255,.9)", fontSize: 18, fontWeight: 600, marginTop: 6 }}>{o.name}</div>
            <div style={{ color: "rgba(255,255,255,.7)", fontSize: 14, marginTop: 4 }}>{o.desc}</div>
            <div style={{ marginTop: 16, background: "rgba(255,255,255,.2)", borderRadius: 8, padding: "6px 12px", display: "inline-block", color: "white", fontSize: 12, fontWeight: 500 }}>⚡ One-time use per person</div>
          </div>

          {/* Form */}
          <div style={{ color: "#888", fontSize: 14, marginBottom: 20, textAlign: "center" }}>Fill in your details to unlock this offer</div>

          {[
            { key: "name", label: "Full Name", type: "text", placeholder: "Sophie Martin" },
            { key: "phone", label: "Phone", type: "tel", placeholder: "+33 6 12 34 56 78" },
            { key: "email", label: "Email Address", type: "email", placeholder: "you@email.com" },
            { key: "confirmEmail", label: "Confirm Email", type: "email", placeholder: "Confirm your email" },
            { key: "dob", label: "Date of Birth", type: "date", placeholder: "" },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: 14 }}>
              <div style={{ color: "#aaa", fontSize: 12, fontWeight: 500, marginBottom: 6, letterSpacing: ".5px", textTransform: "uppercase" }}>{f.label}</div>
              <input
                className={`c-input ${errors[f.key] ? "err" : ""}`}
                style={{ "--accent": o.color }}
                type={f.type}
                placeholder={f.placeholder}
                value={form[f.key]}
                onChange={e => { setForm({ ...form, [f.key]: e.target.value }); setErrors({ ...errors, [f.key]: null }); }}
              />
              {errors[f.key] && <div style={{ color: "#ff4444", fontSize: 12, marginTop: 4 }}>{errors[f.key]}</div>}
            </div>
          ))}

          <div style={{ display: "flex", alignItems: "flex-start", gap: 10, margin: "16px 0 20px", color: "#666", fontSize: 13 }}>
            <input type="checkbox" defaultChecked style={{ marginTop: 2, accentColor: o.color }} />
            <span>I agree to receive my discount code by SMS and to be added to the newsletter</span>
          </div>

          <button className="c-btn" style={{ "--accent": o.color }} onClick={submit}>Get My Discount →</button>
          <div style={{ textAlign: "center", color: "#444", fontSize: 12, marginTop: 16 }}>Your data is secure. No spam. Unsubscribe anytime.</div>
        </div>
      )}

      {step === "success" && (
        <div className="fade-in" style={{ width: "100%", maxWidth: 400, textAlign: "center" }}>
          <div className="pulse" style={{ fontSize: 72, marginBottom: 16 }}>🎉</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 900, color: "white", marginBottom: 8 }}>You're in, {usedName}!</div>
          <div style={{ color: "#888", marginBottom: 28 }}>Your discount code is on its way via SMS. Show it at the restaurant.</div>
          <div style={{ background: "#1a1a1a", border: `2px solid ${o.color}`, borderRadius: 20, padding: 28, marginBottom: 24 }}>
            <div style={{ color: "#666", fontSize: 12, textTransform: "uppercase", letterSpacing: ".8px", marginBottom: 8 }}>Your offer</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 48, fontWeight: 900, color: o.color }}>{o.discount}</div>
            <div style={{ color: "#ccc", fontSize: 16, marginTop: 6 }}>{o.name}</div>
          </div>
          <div style={{ color: "#555", fontSize: 13 }}>📱 SMS sent to your number • 🎂 Birthday surprise incoming</div>
        </div>
      )}
    </div>
  );
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
function Dashboard() {
  const [tab, setTab] = useState("offers");
  const [offers, setOffers] = useState(initialOffers);
  const [customers, setCustomers] = useState(initialCustomers);
  const [showNewOffer, setShowNewOffer] = useState(false);
  const [showQR, setShowQR] = useState(null);
  const [newsletter, setNewsletter] = useState({ subject: "", body: "", segment: "all" });
  const [nlSent, setNlSent] = useState(false);
  const [newOffer, setNewOffer] = useState({ name: "", discount: "", desc: "", color: "#FF4D00", expires: "" });
  const [exportDone, setExportDone] = useState(false);
  const [previewOffer, setPreviewOffer] = useState(null);

  const TABS = ["offers", "customers", "newsletter", "qr"];
  const TAB_LABELS = { offers: "Offers", customers: "Customers", newsletter: "Newsletter", qr: "QR Codes" };
  const TAB_ICONS = { offers: "🏷️", customers: "👥", newsletter: "📧", qr: "◻️" };

  const createOffer = () => {
    if (!newOffer.name || !newOffer.discount) return;
    setOffers([...offers, { ...newOffer, id: Date.now(), active: true, scans: 0, qrGenerated: false }]);
    setNewOffer({ name: "", discount: "", desc: "", color: "#FF4D00", expires: "" });
    setShowNewOffer(false);
  };

  const exportCSV = () => {
    const headers = ["Name", "Phone", "Email", "Date of Birth", "Offer", "Joined", "SMS Opted In"];
    const rows = customers.map(c => [c.name, c.phone, c.email, c.dob, c.offer, c.joined, c.smsOk ? "Yes" : "No"]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "customers.csv"; a.click();
    setExportDone(true); setTimeout(() => setExportDone(false), 2500);
  };

  const sendNewsletter = () => { setNlSent(true); setTimeout(() => setNlSent(false), 3000); setNewsletter({ subject: "", body: "", segment: "all" }); };

  const accent = "#FF4D00";

  return (
    <div style={{ minHeight: "100vh", background: "#080808", color: "#f0f0f0", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700;900&display=swap');
        .d-input { background: #111; border: 1.5px solid #222; border-radius: 8px; color: #f0f0f0; padding: 11px 14px; font-size: 14px; font-family:'DM Sans',sans-serif; width:100%; box-sizing:border-box; outline:none; transition:border-color .2s; }
        .d-input:focus { border-color: ${accent}; }
        .d-btn { background: ${accent}; color: white; border: none; border-radius: 8px; padding: 11px 20px; font-size: 14px; font-weight: 600; font-family:'DM Sans',sans-serif; cursor: pointer; transition: opacity .2s; white-space:nowrap; }
        .d-btn:hover { opacity:.85; }
        .d-btn-ghost { background: transparent; color: ${accent}; border: 1.5px solid ${accent}; border-radius: 8px; padding: 10px 18px; font-size: 13px; font-weight: 600; font-family:'DM Sans',sans-serif; cursor: pointer; transition: all .2s; }
        .d-btn-ghost:hover { background: ${accent}; color: white; }
        .card { background: #111; border: 1px solid #1e1e1e; border-radius: 14px; padding: 20px; }
        .tab-btn { background: none; border: none; color: #555; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:500; padding: 10px 18px; cursor:pointer; border-radius:8px; transition: all .2s; display:flex;align-items:center;gap:6px; }
        .tab-btn.active { background: #1a1a1a; color: white; }
        .tab-btn:hover:not(.active) { color: #aaa; }
        .tag { display:inline-block; padding:3px 10px; border-radius:20px; font-size:12px; font-weight:500; }
        .fade { animation: fadeIn .3s ease; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .offer-card { background:#111; border:1px solid #1e1e1e; border-radius:14px; overflow:hidden; transition: transform .2s, box-shadow .2s; }
        .offer-card:hover { transform:translateY(-2px); box-shadow:0 8px 30px rgba(0,0,0,.4); }
        table { width:100%; border-collapse:collapse; }
        th { color:#555; font-size:11px; text-transform:uppercase; letter-spacing:.6px; font-weight:500; padding:10px 12px; text-align:left; }
        td { padding:12px; border-top:1px solid #1a1a1a; font-size:14px; color:#ccc; }
        tr:hover td { background:#0f0f0f; }
        .modal-bg { position:fixed;inset:0;background:rgba(0,0,0,.8);display:flex;align-items:center;justify-content:center;z-index:100;padding:16px; }
        input[type="color"] { border:none;background:none;cursor:pointer;width:36px;height:36px;padding:0;border-radius:6px; }
      `}</style>

      {/* Preview overlay */}
      {previewOffer && (
        <div className="modal-bg" onClick={() => setPreviewOffer(null)}>
          <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 420, background: "#080808", borderRadius: 20, overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", background: "#111", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#666", fontSize: 13 }}>Customer Preview</span>
              <button onClick={() => setPreviewOffer(null)} style={{ background: "none", border: "none", color: "#555", fontSize: 20, cursor: "pointer" }}>×</button>
            </div>
            <CustomerPage offer={previewOffer} />
          </div>
        </div>
      )}

      {/* QR Modal */}
      {showQR && (
        <div className="modal-bg" onClick={() => setShowQR(null)}>
          <div className="card" onClick={e => e.stopPropagation()} style={{ maxWidth: 320, textAlign: "center", padding: 32 }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, marginBottom: 6 }}>{showQR.name}</div>
            <div style={{ color: "#666", fontSize: 13, marginBottom: 24 }}>{showQR.discount}</div>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
              <QRCode value={`offer-${showQR.id}-${showQR.name}`} size={180} color={showQR.color} />
            </div>
            <div style={{ color: "#555", fontSize: 12, marginBottom: 20 }}>Scan to access this offer on any device</div>
            <button className="d-btn" style={{ width: "100%" }} onClick={() => setShowQR(null)}>Close</button>
          </div>
        </div>
      )}

      {/* New Offer Modal */}
      {showNewOffer && (
        <div className="modal-bg">
          <div className="card" style={{ maxWidth: 460, width: "100%" }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, marginBottom: 20 }}>New Offer</div>
            {[
              { key: "name", label: "Offer Name", placeholder: "Happy Hour Special" },
              { key: "discount", label: "Discount Label", placeholder: "20% OFF · 2 FOR 1 · FREE DESSERT" },
              { key: "desc", label: "Description", placeholder: "Valid on all drinks 5–7pm" },
              { key: "expires", label: "Expiry Date", type: "date" },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 14 }}>
                <div style={{ color: "#777", fontSize: 12, marginBottom: 5, textTransform: "uppercase", letterSpacing: ".5px" }}>{f.label}</div>
                <input className="d-input" type={f.type || "text"} placeholder={f.placeholder} value={newOffer[f.key]} onChange={e => setNewOffer({ ...newOffer, [f.key]: e.target.value })} />
              </div>
            ))}
            <div style={{ marginBottom: 20 }}>
              <div style={{ color: "#777", fontSize: 12, marginBottom: 5, textTransform: "uppercase", letterSpacing: ".5px" }}>Brand Color</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <input type="color" value={newOffer.color} onChange={e => setNewOffer({ ...newOffer, color: e.target.value })} />
                <span style={{ color: "#555", fontSize: 13 }}>{newOffer.color}</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="d-btn-ghost" style={{ flex: 1 }} onClick={() => setShowNewOffer(false)}>Cancel</button>
              <button className="d-btn" style={{ flex: 2 }} onClick={createOffer}>Create Offer</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ borderBottom: "1px solid #1a1a1a", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, background: accent, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🍽️</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700 }}>RestaurantQR</div>
          <div style={{ background: "#1a1a1a", color: "#555", fontSize: 11, padding: "3px 8px", borderRadius: 4, fontWeight: 500 }}>Dashboard</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 13, color: "#ccc" }}>Le Bistrot Parisien</div>
            <div style={{ fontSize: 11, color: "#555" }}>Admin</div>
          </div>
          <div style={{ width: 36, height: 36, background: "#1a1a1a", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>👤</div>
        </div>
      </div>

      <div style={{ display: "flex", height: "calc(100vh - 64px)" }}>
        {/* Sidebar */}
        <div style={{ width: 220, borderRight: "1px solid #1a1a1a", padding: "24px 12px", flexShrink: 0 }}>
          <div style={{ color: "#444", fontSize: 11, textTransform: "uppercase", letterSpacing: ".8px", padding: "0 6px", marginBottom: 8 }}>Menu</div>
          {TABS.map(t => (
            <button key={t} className={`tab-btn ${tab === t ? "active" : ""}`} onClick={() => setTab(t)} style={{ width: "100%", justifyContent: "flex-start", marginBottom: 2 }}>
              <span>{TAB_ICONS[t]}</span> {TAB_LABELS[t]}
            </button>
          ))}

          {/* Stats */}
          <div style={{ marginTop: 32, padding: "0 6px" }}>
            <div style={{ color: "#444", fontSize: 11, textTransform: "uppercase", letterSpacing: ".8px", marginBottom: 12 }}>Stats</div>
            {[
              { label: "Total Customers", value: customers.length },
              { label: "Active Offers", value: offers.filter(o => o.active).length },
              { label: "Total Scans", value: offers.reduce((a, o) => a + o.scans, 0) },
            ].map(s => (
              <div key={s.label} style={{ marginBottom: 14 }}>
                <div style={{ color: "#555", fontSize: 11 }}>{s.label}</div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 700, color: "white" }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Main */}
        <div style={{ flex: 1, overflow: "auto", padding: "28px 32px" }}>

          {/* OFFERS TAB */}
          {tab === "offers" && (
            <div className="fade">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 700 }}>Your Offers</div>
                  <div style={{ color: "#555", fontSize: 14 }}>Create and manage discount campaigns</div>
                </div>
                <button className="d-btn" onClick={() => setShowNewOffer(true)}>+ New Offer</button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
                {offers.map(o => (
                  <div key={o.id} className="offer-card">
                    <div style={{ background: o.color, padding: "20px", position: "relative", overflow: "hidden" }}>
                      <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,.15)" }} />
                      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 900, color: "white" }}>{o.discount}</div>
                      <div style={{ color: "rgba(255,255,255,.85)", fontSize: 15, fontWeight: 500, marginTop: 4 }}>{o.name}</div>
                      <div style={{ color: "rgba(255,255,255,.65)", fontSize: 13, marginTop: 2 }}>{o.desc}</div>
                    </div>
                    <div style={{ padding: 16 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                        <span className="tag" style={{ background: o.active ? "rgba(0,196,140,.12)" : "rgba(255,255,255,.06)", color: o.active ? "#00C48C" : "#555" }}>{o.active ? "● Active" : "Paused"}</span>
                        <span style={{ color: "#555", fontSize: 12 }}>{o.scans} scans</span>
                      </div>
                      {o.expires && <div style={{ color: "#555", fontSize: 12, marginBottom: 12 }}>Expires {o.expires}</div>}
                      <div style={{ display: "flex", gap: 8 }}>
                        <button className="d-btn-ghost" style={{ flex: 1, fontSize: 12, padding: "8px 10px" }} onClick={() => setPreviewOffer(o)}>Preview</button>
                        <button className="d-btn-ghost" style={{ flex: 1, fontSize: 12, padding: "8px 10px" }} onClick={() => { setShowQR(o); setOffers(offers.map(x => x.id === o.id ? { ...x, qrGenerated: true } : x)); }}>QR Code</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CUSTOMERS TAB */}
          {tab === "customers" && (
            <div className="fade">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 700 }}>Customer Database</div>
                  <div style={{ color: "#555", fontSize: 14 }}>{customers.length} registered customers</div>
                </div>
                <button className="d-btn" onClick={exportCSV}>{exportDone ? "✓ Exported!" : "⬇ Export CSV"}</button>
              </div>

              <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                <table>
                  <thead>
                    <tr style={{ background: "#0d0d0d" }}>
                      {["Name", "Phone", "Email", "Date of Birth", "Offer", "Joined", "SMS"].map(h => <th key={h}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map(c => (
                      <tr key={c.id}>
                        <td style={{ fontWeight: 500, color: "#f0f0f0" }}>{c.name}</td>
                        <td>{c.phone}</td>
                        <td>{c.email}</td>
                        <td>{c.dob}</td>
                        <td><span className="tag" style={{ background: "rgba(255,77,0,.1)", color: accent, fontSize: 11 }}>{c.offer}</span></td>
                        <td>{c.joined}</td>
                        <td><span style={{ color: c.smsOk ? "#00C48C" : "#555" }}>{c.smsOk ? "✓" : "—"}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                {[
                  { label: "SMS opted-in", value: customers.filter(c => c.smsOk).length, color: "#00C48C" },
                  { label: "Upcoming birthdays", value: 1, color: "#FFB800" },
                  { label: "Newsletter subscribers", value: customers.length, color: accent },
                ].map(s => (
                  <div key={s.label} className="card" style={{ flex: 1, textAlign: "center" }}>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 700, color: s.color }}>{s.value}</div>
                    <div style={{ color: "#555", fontSize: 12 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NEWSLETTER TAB */}
          {tab === "newsletter" && (
            <div className="fade">
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 700 }}>Newsletter Campaign</div>
                <div style={{ color: "#555", fontSize: 14 }}>Create and send email campaigns to your customers</div>
              </div>

              {nlSent ? (
                <div className="card" style={{ textAlign: "center", padding: 48 }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>📬</div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Campaign Sent!</div>
                  <div style={{ color: "#555" }}>Your newsletter was sent to {newsletter.segment === "all" ? customers.length : customers.filter(c => c.smsOk).length} customers</div>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  <div>
                    <div className="card" style={{ marginBottom: 16 }}>
                      <div style={{ fontWeight: 600, marginBottom: 16 }}>Campaign Settings</div>

                      <div style={{ marginBottom: 14 }}>
                        <div style={{ color: "#777", fontSize: 12, marginBottom: 5, textTransform: "uppercase", letterSpacing: ".5px" }}>Audience</div>
                        <select className="d-input" value={newsletter.segment} onChange={e => setNewsletter({ ...newsletter, segment: e.target.value })} style={{ appearance: "none" }}>
                          <option value="all">All Customers ({customers.length})</option>
                          <option value="sms">SMS Opted-in ({customers.filter(c => c.smsOk).length})</option>
                        </select>
                      </div>

                      <div style={{ marginBottom: 14 }}>
                        <div style={{ color: "#777", fontSize: 12, marginBottom: 5, textTransform: "uppercase", letterSpacing: ".5px" }}>Subject</div>
                        <input className="d-input" placeholder="🍽️ A special offer just for you..." value={newsletter.subject} onChange={e => setNewsletter({ ...newsletter, subject: e.target.value })} />
                      </div>

                      <div style={{ marginBottom: 14 }}>
                        <div style={{ color: "#777", fontSize: 12, marginBottom: 5, textTransform: "uppercase", letterSpacing: ".5px" }}>Attach Offer</div>
                        <select className="d-input" style={{ appearance: "none" }}>
                          <option>No offer attached</option>
                          {offers.map(o => <option key={o.id}>{o.name} — {o.discount}</option>)}
                        </select>
                      </div>
                    </div>

                    <button className="d-btn" style={{ width: "100%" }} onClick={sendNewsletter}>Send Campaign →</button>
                  </div>

                  <div>
                    <div style={{ color: "#777", fontSize: 12, marginBottom: 5, textTransform: "uppercase", letterSpacing: ".5px" }}>Message Body</div>
                    <textarea className="d-input" rows={14} placeholder={"Dear [Name],\n\nWe have a special treat waiting for you at Le Bistrot Parisien...\n\n[OFFER_BLOCK]\n\nSee you soon,\nThe Team"} value={newsletter.body} onChange={e => setNewsletter({ ...newsletter, body: e.target.value })} style={{ resize: "vertical", lineHeight: 1.6 }} />
                    <div style={{ color: "#444", fontSize: 12, marginTop: 8 }}>Variables: [Name], [Offer], [Discount], [Birthday_Greeting]</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* QR CODES TAB */}
          {tab === "qr" && (
            <div className="fade">
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 700 }}>QR Codes</div>
                <div style={{ color: "#555", fontSize: 14 }}>One unique QR code per offer — print or display digitally</div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 16 }}>
                {offers.map(o => (
                  <div key={o.id} className="card" style={{ textAlign: "center" }}>
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
                      <QRCode value={`offer-${o.id}-${o.name}`} size={140} color={o.color} />
                    </div>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{o.name}</div>
                    <div style={{ color: o.color, fontSize: 13, fontWeight: 700, marginBottom: 12 }}>{o.discount}</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="d-btn-ghost" style={{ flex: 1, fontSize: 12, padding: "8px 8px" }} onClick={() => setPreviewOffer(o)}>Preview</button>
                      <button className="d-btn" style={{ flex: 1, fontSize: 12, padding: "8px 8px" }} onClick={() => setShowQR(o)}>Enlarge</button>
                    </div>
                    <div style={{ color: "#444", fontSize: 11, marginTop: 8 }}>{o.scans} scans · {o.active ? "Active" : "Paused"}</div>
                  </div>
                ))}
              </div>

              <div className="card" style={{ marginTop: 24, padding: 20 }}>
                <div style={{ fontWeight: 600, marginBottom: 12 }}>How it works</div>
                <div style={{ display: "flex", gap: 20 }}>
                  {[
                    { icon: "◻️", step: "1. Print or display the QR code at your restaurant" },
                    { icon: "📱", step: "2. Customer scans and fills in their info" },
                    { icon: "💬", step: "3. They receive a discount code by SMS instantly" },
                    { icon: "📊", step: "4. Data is saved to your customer database" },
                  ].map(s => (
                    <div key={s.step} style={{ flex: 1, textAlign: "center" }}>
                      <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
                      <div style={{ color: "#666", fontSize: 12, lineHeight: 1.5 }}>{s.step}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ─── APP ROOT ────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("dashboard"); // dashboard | customer

  return (
    <div>
      {/* Toggle for demo */}
      <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 200, display: "flex", gap: 8 }}>
        <button
          onClick={() => setView(view === "dashboard" ? "customer" : "dashboard")}
          style={{ background: "#FF4D00", color: "white", border: "none", borderRadius: 10, padding: "10px 18px", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 13, cursor: "pointer", boxShadow: "0 4px 20px rgba(255,77,0,.4)" }}
        >
          {view === "dashboard" ? "👁 Customer View" : "⚙️ Dashboard"}
        </button>
      </div>

      {view === "dashboard"
        ? <Dashboard />
        : <CustomerPage offer={{ name: "Summer Tapas Night", discount: "20% OFF", desc: "Valid on all tapas plates", color: "#FF4D00" }} />
      }
    </div>
  );
}
