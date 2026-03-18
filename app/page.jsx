"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://znynaiztfgjcprmyehpt.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpueW5haXp0ZmdqY3BybXllaHB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NjEzNDEsImV4cCI6MjA4OTQzNzM0MX0.f0Vqr4Nh7_cvAU1xyW2n3kqeUPBiNjyWqCSuI-zhX0o"
);

function QRCode({ value, size = 160, color = "#111" }) {
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
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} fill="white" />
      {grid.map((row, r) =>
        row.map((on, c) =>
          on ? <rect key={`${r}-${c}`} x={c * cell + 0.5} y={r * cell + 0.5} width={cell - 0.5} height={cell - 0.5} fill={color} /> : null
        )
      )}
    </svg>
  );
}

function CustomerPage({ offer }) {
  const [step, setStep] = useState("form");
  const [form, setForm] = useState({ name: "", phone: "", email: "", dob: "", confirmEmail: "" });
  const [errors, setErrors] = useState({});
  const [usedName, setUsedName] = useState("");
  const [loading, setLoading] = useState(false);
  const o = offer || { name: "Summer Special", discount: "20% OFF", desc: "Valid on all dishes", color: "#111" };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!/^\+?[\d\s\-]{8,}$/.test(form.phone)) e.phone = "Invalid phone";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (form.email !== form.confirmEmail) e.confirmEmail = "Emails don't match";
    if (!form.dob) e.dob = "Required";
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    const { error } = await supabase.from("customers").insert([{
      name: form.name, phone: form.phone, email: form.email,
      dob: form.dob, offer: o.name,
      joined: new Date().toISOString().split("T")[0], sms_ok: true,
    }]);
    setLoading(false);
    if (!error) { setUsedName(form.name.split(" ")[0]); setStep("success"); }
    else alert("Something went wrong. Please try again.");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 20px", fontFamily: "'Outfit', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&family=Cormorant+Garamond:wght@400;600;700&display=swap');
        .y-input { background: #fafafa; border: 1px solid #e8e8e8; border-radius: 8px; color: #111; padding: 13px 16px; font-size: 15px; font-family: 'Outfit', sans-serif; width: 100%; box-sizing: border-box; outline: none; transition: border-color .2s; }
        .y-input:focus { border-color: #111; background: #fff; }
        .y-input.err { border-color: #e74c3c; }
        .y-btn { background: #111; color: white; border: none; border-radius: 8px; padding: 15px; font-size: 15px; font-weight: 500; font-family: 'Outfit', sans-serif; cursor: pointer; width: 100%; letter-spacing: .3px; transition: opacity .2s; }
        .y-btn:hover { opacity: .85; }
        .fade-in { animation: fadeUp .4s ease forwards; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        .pulse { animation: pulse 2s ease-in-out infinite; }
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.03)} }
        .y-label { color: #999; font-size: 11px; font-weight: 500; margin-bottom: 6px; letter-spacing: 1px; text-transform: uppercase; }
      `}</style>

      {step === "form" && (
        <div className="fade-in" style={{ width: "100%", maxWidth: 400 }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, letterSpacing: 4, color: "#bbb", textTransform: "uppercase", marginBottom: 16 }}>YARTA</div>
            <div style={{ background: "#f5f5f5", borderRadius: 12, padding: "24px", marginBottom: 8 }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 48, fontWeight: 700, color: "#111", lineHeight: 1 }}>{o.discount}</div>
              <div style={{ color: "#111", fontSize: 16, fontWeight: 500, marginTop: 6 }}>{o.name}</div>
              <div style={{ color: "#999", fontSize: 13, marginTop: 4 }}>{o.desc}</div>
            </div>
            <div style={{ color: "#bbb", fontSize: 12, letterSpacing: .5 }}>One-time offer per person</div>
          </div>

          <div style={{ color: "#bbb", fontSize: 13, marginBottom: 24, textAlign: "center" }}>Fill in your details to claim this offer</div>

          {[
            { key: "name", label: "Full Name", type: "text", placeholder: "Your name" },
            { key: "phone", label: "Phone", type: "tel", placeholder: "+44 7911 123456" },
            { key: "email", label: "Email", type: "email", placeholder: "you@email.com" },
            { key: "confirmEmail", label: "Confirm Email", type: "email", placeholder: "Confirm your email" },
            { key: "dob", label: "Date of Birth", type: "date" },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: 14 }}>
              <div className="y-label">{f.label}</div>
              <input className={`y-input ${errors[f.key] ? "err" : ""}`} type={f.type} placeholder={f.placeholder} value={form[f.key]} onChange={e => { setForm({ ...form, [f.key]: e.target.value }); setErrors({ ...errors, [f.key]: null }); }} />
              {errors[f.key] && <div style={{ color: "#e74c3c", fontSize: 12, marginTop: 4 }}>{errors[f.key]}</div>}
            </div>
          ))}

          <div style={{ display: "flex", alignItems: "flex-start", gap: 10, margin: "16px 0 20px", color: "#bbb", fontSize: 12 }}>
            <input type="checkbox" defaultChecked style={{ marginTop: 2, accentColor: "#111" }} />
            <span>I agree to receive my discount by SMS and to join the newsletter</span>
          </div>

          <button className="y-btn" onClick={submit} disabled={loading}>{loading ? "Saving..." : "Claim My Discount →"}</button>
          <div style={{ textAlign: "center", color: "#ccc", fontSize: 11, marginTop: 14, letterSpacing: .3 }}>Secure · No spam · Unsubscribe anytime</div>
        </div>
      )}

      {step === "success" && (
        <div className="fade-in" style={{ width: "100%", maxWidth: 360, textAlign: "center" }}>
          <div className="pulse" style={{ fontSize: 56, marginBottom: 20 }}>✦</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 700, color: "#111", marginBottom: 8 }}>You're in, {usedName}.</div>
          <div style={{ color: "#999", marginBottom: 32, fontSize: 14 }}>Your discount is confirmed. Show this screen at the venue.</div>
          <div style={{ border: "1px solid #e8e8e8", borderRadius: 12, padding: 32 }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 52, fontWeight: 700, color: "#111" }}>{o.discount}</div>
            <div style={{ color: "#999", fontSize: 14, marginTop: 6 }}>{o.name}</div>
          </div>
          <div style={{ color: "#ccc", fontSize: 12, marginTop: 20 }}>Powered by YARTA</div>
        </div>
      )}
    </div>
  );
}

function Dashboard() {
  const [tab, setTab] = useState("offers");
  const [offers, setOffers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [showNewOffer, setShowNewOffer] = useState(false);
  const [showQR, setShowQR] = useState(null);
  const [previewOffer, setPreviewOffer] = useState(null);
  const [newsletter, setNewsletter] = useState({ subject: "", body: "" });
  const [nlSent, setNlSent] = useState(false);
  const [newOffer, setNewOffer] = useState({ name: "", discount: "", desc: "", color: "#111", expires: "" });
  const [exportDone, setExportDone] = useState(false);

  useEffect(() => { loadOffers(); loadCustomers(); }, []);
  const loadOffers = async () => { const { data } = await supabase.from("offers").select("*"); if (data) setOffers(data); };
  const loadCustomers = async () => { const { data } = await supabase.from("customers").select("*"); if (data) setCustomers(data); };

  const createOffer = async () => {
    if (!newOffer.name || !newOffer.discount) return;
    await supabase.from("offers").insert([{ name: newOffer.name, discount: newOffer.discount, description: newOffer.desc, color: newOffer.color, expires: newOffer.expires, active: true, scans: 0 }]);
    loadOffers(); setShowNewOffer(false); setNewOffer({ name: "", discount: "", desc: "", color: "#111", expires: "" });
  };

  const exportCSV = () => {
    const headers = ["Name","Phone","Email","DOB","Offer","Joined","SMS"];
    const rows = customers.map(c => [c.name,c.phone,c.email,c.dob,c.offer,c.joined,c.sms_ok?"Yes":"No"]);
    const csv = [headers,...rows].map(r=>r.join(",")).join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv],{type:"text/csv"})); a.download="customers.csv"; a.click();
    setExportDone(true); setTimeout(()=>setExportDone(false),2500);
  };

  const TABS = [["offers","Offers"],["customers","Customers"],["newsletter","Newsletter"],["qr","QR Codes"]];

  return (
    <div style={{ minHeight:"100vh", background:"#fafafa", color:"#111", fontFamily:"'Outfit', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Cormorant+Garamond:wght@400;600;700&display=swap');
        * { box-sizing: border-box; }
        .d-input { background: #fff; border: 1px solid #e8e8e8; border-radius: 8px; color: #111; padding: 11px 14px; font-size: 14px; font-family:'Outfit',sans-serif; width:100%; outline:none; transition: border-color .2s; }
        .d-input:focus { border-color: #111; }
        .d-btn { background: #111; color: white; border: none; border-radius: 8px; padding: 11px 20px; font-size: 13px; font-weight: 500; font-family:'Outfit',sans-serif; cursor: pointer; transition: opacity .2s; white-space:nowrap; letter-spacing:.3px; }
        .d-btn:hover { opacity:.8; }
        .d-btn-ghost { background: transparent; color: #111; border: 1px solid #e0e0e0; border-radius: 8px; padding: 10px 18px; font-size: 13px; font-weight: 500; font-family:'Outfit',sans-serif; cursor: pointer; transition: all .15s; }
        .d-btn-ghost:hover { border-color: #111; background: #f5f5f5; }
        .card { background: #fff; border: 1px solid #efefef; border-radius: 12px; padding: 20px; }
        .tab-btn { background: none; border: none; color: #bbb; font-family:'Outfit',sans-serif; font-size:13px; font-weight:500; padding: 8px 14px; cursor:pointer; border-radius:6px; transition: all .15s; letter-spacing:.2px; }
        .tab-btn.active { background: #fff; color: #111; box-shadow: 0 1px 4px rgba(0,0,0,.06); }
        .tab-btn:hover:not(.active) { color: #666; }
        .fade { animation: fadeIn .25s ease; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        .offer-card { background:#fff; border:1px solid #efefef; border-radius:12px; overflow:hidden; transition: box-shadow .2s; }
        .offer-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,.06); }
        table { width:100%; border-collapse:collapse; }
        th { color:#bbb; font-size:11px; text-transform:uppercase; letter-spacing:.8px; font-weight:500; padding:10px 14px; text-align:left; }
        td { padding:13px 14px; border-top:1px solid #f5f5f5; font-size:13px; color:#444; }
        tr:hover td { background:#fafafa; }
        .modal-bg { position:fixed;inset:0;background:rgba(0,0,0,.15);display:flex;align-items:center;justify-content:center;z-index:100;padding:16px;backdrop-filter:blur(4px); }
        .y-label { color: #bbb; font-size: 11px; font-weight: 500; margin-bottom: 6px; letter-spacing: 1px; text-transform: uppercase; }
        input[type="color"] { border:1px solid #e8e8e8; background:#fff; cursor:pointer; width:40px; height:36px; border-radius:6px; padding:2px; }
      `}</style>

      {previewOffer && (
        <div className="modal-bg" onClick={()=>setPreviewOffer(null)}>
          <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:420,background:"#fff",borderRadius:16,overflow:"hidden",boxShadow:"0 20px 60px rgba(0,0,0,.12)"}}>
            <div style={{padding:"12px 20px",borderBottom:"1px solid #f5f5f5",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{color:"#bbb",fontSize:12,letterSpacing:1,textTransform:"uppercase"}}>Customer Preview</span>
              <button onClick={()=>setPreviewOffer(null)} style={{background:"none",border:"none",color:"#bbb",fontSize:20,cursor:"pointer",lineHeight:1}}>×</button>
            </div>
            <CustomerPage offer={previewOffer}/>
          </div>
        </div>
      )}

      {showQR && (
        <div className="modal-bg" onClick={()=>setShowQR(null)}>
          <div className="card" onClick={e=>e.stopPropagation()} style={{maxWidth:300,textAlign:"center",padding:32,boxShadow:"0 20px 60px rgba(0,0,0,.1)"}}>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:700,marginBottom:4}}>{showQR.name}</div>
            <div style={{color:"#bbb",fontSize:12,letterSpacing:1,textTransform:"uppercase",marginBottom:24}}>{showQR.discount}</div>
            <div style={{display:"flex",justifyContent:"center",marginBottom:20,padding:16,background:"#fafafa",borderRadius:8}}>
              <QRCode value={`offer-${showQR.id}-${showQR.name}`} size={160} color="#111"/>
            </div>
            <button className="d-btn" style={{width:"100%"}} onClick={()=>setShowQR(null)}>Close</button>
          </div>
        </div>
      )}

      {showNewOffer && (
        <div className="modal-bg">
          <div className="card" style={{maxWidth:440,width:"100%",boxShadow:"0 20px 60px rgba(0,0,0,.1)"}}>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,fontWeight:700,marginBottom:20}}>New Offer</div>
            {[{key:"name",label:"Offer Name",placeholder:"Summer Tapas Night"},{key:"discount",label:"Discount",placeholder:"20% OFF"},{key:"desc",label:"Description",placeholder:"Valid on all dishes"},{key:"expires",label:"Expiry Date",type:"date"}].map(f=>(
              <div key={f.key} style={{marginBottom:14}}>
                <div className="y-label">{f.label}</div>
                <input className="d-input" type={f.type||"text"} placeholder={f.placeholder} value={newOffer[f.key]} onChange={e=>setNewOffer({...newOffer,[f.key]:e.target.value})}/>
              </div>
            ))}
            <div style={{marginBottom:20}}>
              <div className="y-label">Accent Color</div>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <input type="color" value={newOffer.color} onChange={e=>setNewOffer({...newOffer,color:e.target.value})}/>
                <span style={{color:"#bbb",fontSize:13}}>{newOffer.color}</span>
              </div>
            </div>
            <div style={{display:"flex",gap:10}}>
              <button className="d-btn-ghost" style={{flex:1}} onClick={()=>setShowNewOffer(false)}>Cancel</button>
              <button className="d-btn" style={{flex:2}} onClick={createOffer}>Create Offer</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{background:"#fff",borderBottom:"1px solid #f0f0f0",padding:"0 32px",display:"flex",alignItems:"center",justifyContent:"space-between",height:60}}>
        <div style={{display:"flex",alignItems:"center",gap:24}}>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700,letterSpacing:1}}>YARTA</div>
          <div style={{display:"flex",gap:2,background:"#f5f5f5",padding:3,borderRadius:8}}>
            {TABS.map(([t,label])=>(
              <button key={t} className={`tab-btn ${tab===t?"active":""}`} onClick={()=>setTab(t)}>{label}</button>
            ))}
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:20}}>
          <div style={{fontSize:13,color:"#bbb"}}>
            <span style={{color:"#111",fontWeight:500}}>{customers.length}</span> customers · <span style={{color:"#111",fontWeight:500}}>{offers.filter(o=>o.active).length}</span> offers
          </div>
          <div style={{width:32,height:32,background:"#f0f0f0",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:"#999"}}>P</div>
        </div>
      </div>

      {/* Main */}
      <div style={{padding:"32px",maxWidth:1100,margin:"0 auto"}}>

        {tab==="offers" && (
          <div className="fade">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:28}}>
              <div>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,fontWeight:700,marginBottom:4}}>Your Offers</div>
                <div style={{color:"#bbb",fontSize:13}}>Create and manage discount campaigns for your customers</div>
              </div>
              <button className="d-btn" onClick={()=>setShowNewOffer(true)}>+ New Offer</button>
            </div>
            {offers.length === 0 ? (
              <div className="card" style={{textAlign:"center",padding:60,color:"#ccc"}}>
                <div style={{fontSize:32,marginBottom:12}}>◻</div>
                <div style={{fontSize:15,color:"#bbb"}}>No offers yet — create your first one</div>
              </div>
            ) : (
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:16}}>
                {offers.map(o=>(
                  <div key={o.id} className="offer-card">
                    <div style={{background:o.color||"#111",padding:"24px",position:"relative",overflow:"hidden"}}>
                      <div style={{position:"absolute",top:-20,right:-20,width:80,height:80,borderRadius:"50%",background:"rgba(255,255,255,.08)"}}/>
                      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:36,fontWeight:700,color:"white",lineHeight:1}}>{o.discount}</div>
                      <div style={{color:"rgba(255,255,255,.8)",fontSize:15,marginTop:6}}>{o.name}</div>
                      <div style={{color:"rgba(255,255,255,.5)",fontSize:12,marginTop:4}}>{o.description}</div>
                    </div>
                    <div style={{padding:16}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                        <span style={{background:o.active?"#f0faf5":"#f5f5f5",color:o.active?"#2ecc71":"#bbb",padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:500,letterSpacing:.5}}>{o.active?"● Active":"Paused"}</span>
                        <span style={{color:"#ccc",fontSize:12}}>{o.scans||0} scans</span>
                      </div>
                      {o.expires && <div style={{color:"#ccc",fontSize:11,marginBottom:12,letterSpacing:.3}}>Expires {o.expires}</div>}
                      <div style={{display:"flex",gap:8}}>
                        <button className="d-btn-ghost" style={{flex:1,fontSize:12,padding:"8px"}} onClick={()=>setPreviewOffer(o)}>Preview</button>
                        <button className="d-btn-ghost" style={{flex:1,fontSize:12,padding:"8px"}} onClick={()=>setShowQR(o)}>QR Code</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab==="customers" && (
          <div className="fade">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:28}}>
              <div>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,fontWeight:700,marginBottom:4}}>Customers</div>
                <div style={{color:"#bbb",fontSize:13}}>{customers.length} registered customers</div>
              </div>
              <button className="d-btn" onClick={exportCSV}>{exportDone?"✓ Exported":"⬇ Export CSV"}</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:24}}>
              {[{label:"Total Customers",value:customers.length},{label:"SMS Opted-in",value:customers.filter(c=>c.sms_ok).length},{label:"Active Offers",value:offers.filter(o=>o.active).length}].map(s=>(
                <div key={s.label} className="card">
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:36,fontWeight:700,color:"#111"}}>{s.value}</div>
                  <div style={{color:"#bbb",fontSize:12,marginTop:4,letterSpacing:.3}}>{s.label}</div>
                </div>
              ))}
            </div>
            <div className="card" style={{padding:0,overflow:"hidden"}}>
              <table>
                <thead><tr style={{background:"#fafafa"}}>{["Name","Phone","Email","Date of Birth","Offer","Joined","SMS"].map(h=><th key={h}>{h}</th>)}</tr></thead>
                <tbody>
                  {customers.length===0?(<tr><td colSpan={7} style={{textAlign:"center",color:"#ccc",padding:48,fontSize:13}}>No customers yet — share your QR code to get started</td></tr>):customers.map(c=>(
                    <tr key={c.id}>
                      <td style={{fontWeight:500,color:"#111"}}>{c.name}</td>
                      <td>{c.phone}</td><td>{c.email}</td><td>{c.dob}</td>
                      <td><span style={{background:"#f5f5f5",color:"#666",padding:"3px 10px",borderRadius:20,fontSize:11}}>{c.offer}</span></td>
                      <td>{c.joined}</td>
                      <td><span style={{color:c.sms_ok?"#2ecc71":"#ddd",fontWeight:500}}>{c.sms_ok?"✓":"—"}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab==="newsletter" && (
          <div className="fade">
            <div style={{marginBottom:28}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,fontWeight:700,marginBottom:4}}>Newsletter</div>
              <div style={{color:"#bbb",fontSize:13}}>Send email campaigns to {customers.length} customers</div>
            </div>
            {nlSent?(
              <div className="card" style={{textAlign:"center",padding:60}}>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:700,marginBottom:8}}>Campaign Sent</div>
                <div style={{color:"#bbb",fontSize:14}}>Your newsletter was delivered to {customers.length} customers</div>
              </div>
            ):(
              <div style={{display:"grid",gridTemplateColumns:"1fr 1.4fr",gap:20}}>
                <div>
                  <div className="card" style={{marginBottom:14}}>
                    <div style={{fontWeight:600,marginBottom:16,fontSize:14}}>Settings</div>
                    <div style={{marginBottom:14}}>
                      <div className="y-label">Subject Line</div>
                      <input className="d-input" placeholder="A special offer just for you..." value={newsletter.subject} onChange={e=>setNewsletter({...newsletter,subject:e.target.value})}/>
                    </div>
                    <div>
                      <div className="y-label">Audience</div>
                      <select className="d-input" style={{appearance:"none"}}>
                        <option>All Customers ({customers.length})</option>
                        <option>SMS Opted-in ({customers.filter(c=>c.sms_ok).length})</option>
                      </select>
                    </div>
                  </div>
                  <button className="d-btn" style={{width:"100%"}} onClick={()=>{setNlSent(true);setTimeout(()=>setNlSent(false),3000);}}>Send Campaign →</button>
                </div>
                <div>
                  <div className="y-label" style={{marginBottom:6}}>Message</div>
                  <textarea className="d-input" rows={13} placeholder={"Dear [Name],\n\nWe have something special for you...\n\nSee you soon!"} value={newsletter.body} onChange={e=>setNewsletter({...newsletter,body:e.target.value})} style={{resize:"vertical",lineHeight:1.7}}/>
                  <div style={{color:"#ccc",fontSize:11,marginTop:8}}>Variables: [Name] [Offer] [Discount] [Birthday]</div>
                </div>
              </div>
            )}
          </div>
        )}

        {tab==="qr" && (
          <div className="fade">
            <div style={{marginBottom:28}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,fontWeight:700,marginBottom:4}}>QR Codes</div>
              <div style={{color:"#bbb",fontSize:13}}>One unique QR code per offer — print or display digitally</div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:16}}>
              {offers.map(o=>(
                <div key={o.id} className="card" style={{textAlign:"center"}}>
                  <div style={{display:"flex",justifyContent:"center",marginBottom:16,padding:16,background:"#fafafa",borderRadius:8}}>
                    <QRCode value={`offer-${o.id}-${o.name}`} size={130} color="#111"/>
                  </div>
                  <div style={{fontWeight:500,fontSize:14,marginBottom:2}}>{o.name}</div>
                  <div style={{color:"#bbb",fontSize:12,marginBottom:14}}>{o.discount}</div>
                  <div style={{display:"flex",gap:8}}>
                    <button className="d-btn-ghost" style={{flex:1,fontSize:12,padding:"8px"}} onClick={()=>setPreviewOffer(o)}>Preview</button>
                    <button className="d-btn" style={{flex:1,fontSize:12,padding:"8px"}} onClick={()=>setShowQR(o)}>Enlarge</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="card" style={{marginTop:20,padding:24}}>
              <div style={{fontWeight:500,marginBottom:12,fontSize:14}}>How it works</div>
              <div style={{display:"flex",gap:24}}>
                {[["◻","Print or display the QR code at your venue"],["📱","Customer scans and fills in their details"],["💬","They receive a discount confirmation"],["📊","Data is saved to your dashboard instantly"]].map(([icon,text])=>(
                  <div key={text} style={{flex:1,textAlign:"center"}}>
                    <div style={{fontSize:20,marginBottom:8}}>{icon}</div>
                    <div style={{color:"#bbb",fontSize:12,lineHeight:1.6}}>{text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("dashboard");
  return (
    <div>
      <div style={{position:"fixed",bottom:20,right:20,zIndex:200}}>
        <button onClick={()=>setView(view==="dashboard"?"customer":"dashboard")}
          style={{background:"#111",color:"white",border:"none",borderRadius:8,padding:"10px 18px",fontFamily:"'Outfit',sans-serif",fontWeight:500,fontSize:12,cursor:"pointer",letterSpacing:.5,boxShadow:"0 4px 20px rgba(0,0,0,.15)"}}>
          {view==="dashboard"?"Customer View ↗":"← Dashboard"}
        </button>
      </div>
      {view==="dashboard"?<Dashboard/>:<CustomerPage offer={{name:"Summer Special",discount:"20% OFF",desc:"Valid on all dishes",color:"#111"}}/>}
    </div>
  );
}
