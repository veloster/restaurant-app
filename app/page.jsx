"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://znynaiztfgjcprmyehpt.supabase.co",
  "YOUR_KEY_HERE"
);

function QRCode({ value, size = 160, color = "#1a1a1a" }) {
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

function CustomerPage({ offer }) {
  const [step, setStep] = useState("form");
  const [form, setForm] = useState({ name: "", phone: "", email: "", dob: "", confirmEmail: "" });
  const [errors, setErrors] = useState({});
  const [usedName, setUsedName] = useState("");
  const [loading, setLoading] = useState(false);
  const o = offer || { name: "Summer Tapas Night", discount: "20% OFF", desc: "On all tapas plates", color: "#FF4D00" };

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
    <div style={{ minHeight: "100vh", background: "#0d0d0d", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 16px", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@700;900&display=swap');
        .c-input { background: #1a1a1a; border: 1.5px solid #2a2a2a; border-radius: 10px; color: #f0f0f0; padding: 14px 16px; font-size: 15px; font-family: 'DM Sans', sans-serif; width: 100%; box-sizing: border-box; outline: none; transition: border-color .2s; }
        .c-input:focus { border-color: var(--accent); }
        .c-input.err { border-color: #ff4444; }
        .c-btn { background: var(--accent); color: white; border: none; border-radius: 12px; padding: 16px; font-size: 16px; font-weight: 600; font-family: 'DM Sans', sans-serif; cursor: pointer; width: 100%; transition: opacity .2s; }
        .c-btn:hover { opacity: .9; }
        .fade-in { animation: fadeUp .5s ease forwards; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .pulse { animation: pulse 2s ease-in-out infinite; }
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }
      `}</style>
      {step === "form" && (
        <div className="fade-in" style={{ width: "100%", maxWidth: 420 }}>
          <div style={{ background: o.color, borderRadius: 20, padding: "28px 24px", marginBottom: 28, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,.12)" }} />
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 42, fontWeight: 900, color: "white", lineHeight: 1 }}>{o.discount}</div>
            <div style={{ color: "rgba(255,255,255,.9)", fontSize: 18, fontWeight: 600, marginTop: 6 }}>{o.name}</div>
            <div style={{ color: "rgba(255,255,255,.7)", fontSize: 14, marginTop: 4 }}>{o.desc}</div>
            <div style={{ marginTop: 16, background: "rgba(255,255,255,.2)", borderRadius: 8, padding: "6px 12px", display: "inline-block", color: "white", fontSize: 12, fontWeight: 500 }}>⚡ One-time use per person</div>
          </div>
          <div style={{ color: "#888", fontSize: 14, marginBottom: 20, textAlign: "center" }}>Fill in your details to unlock this offer</div>
          {[
            { key: "name", label: "Full Name", type: "text", placeholder: "Sophie Martin" },
            { key: "phone", label: "Phone", type: "tel", placeholder: "+44 7911 123456" },
            { key: "email", label: "Email Address", type: "email", placeholder: "you@email.com" },
            { key: "confirmEmail", label: "Confirm Email", type: "email", placeholder: "Confirm your email" },
            { key: "dob", label: "Date of Birth", type: "date" },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: 14 }}>
              <div style={{ color: "#aaa", fontSize: 12, fontWeight: 500, marginBottom: 6, letterSpacing: ".5px", textTransform: "uppercase" }}>{f.label}</div>
              <input className={`c-input ${errors[f.key] ? "err" : ""}`} style={{ "--accent": o.color }} type={f.type} placeholder={f.placeholder} value={form[f.key]} onChange={e => { setForm({ ...form, [f.key]: e.target.value }); setErrors({ ...errors, [f.key]: null }); }} />
              {errors[f.key] && <div style={{ color: "#ff4444", fontSize: 12, marginTop: 4 }}>{errors[f.key]}</div>}
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10, margin: "16px 0 20px", color: "#666", fontSize: 13 }}>
            <input type="checkbox" defaultChecked style={{ marginTop: 2, accentColor: o.color }} />
            <span>I agree to receive my discount code by SMS and to be added to the newsletter</span>
          </div>
          <button className="c-btn" style={{ "--accent": o.color }} onClick={submit} disabled={loading}>
            {loading ? "Saving..." : "Get My Discount →"}
          </button>
          <div style={{ textAlign: "center", color: "#444", fontSize: 12, marginTop: 16 }}>Your data is secure. No spam. Unsubscribe anytime.</div>
        </div>
      )}
      {step === "success" && (
        <div className="fade-in" style={{ width: "100%", maxWidth: 400, textAlign: "center" }}>
          <div className="pulse" style={{ fontSize: 72, marginBottom: 16 }}>🎉</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 900, color: "white", marginBottom: 8 }}>You're in, {usedName}!</div>
          <div style={{ color: "#888", marginBottom: 28 }}>Your discount is ready. Show this screen at the restaurant.</div>
          <div style={{ background: "#1a1a1a", border: `2px solid ${o.color}`, borderRadius: 20, padding: 28 }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 48, fontWeight: 900, color: o.color }}>{o.discount}</div>
            <div style={{ color: "#ccc", fontSize: 16, marginTop: 6 }}>{o.name}</div>
          </div>
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
  const [newOffer, setNewOffer] = useState({ name: "", discount: "", desc: "", color: "#FF4D00", expires: "" });
  const [exportDone, setExportDone] = useState(false);
  const accent = "#FF4D00";

  useEffect(() => { loadOffers(); loadCustomers(); }, []);

  const loadOffers = async () => {
    const { data } = await supabase.from("offers").select("*");
    if (data) setOffers(data);
  };

  const loadCustomers = async () => {
    const { data } = await supabase.from("customers").select("*");
    if (data) setCustomers(data);
  };

  const createOffer = async () => {
    if (!newOffer.name || !newOffer.discount) return;
    await supabase.from("offers").insert([{ name: newOffer.name, discount: newOffer.discount, description: newOffer.desc, color: newOffer.color, expires: newOffer.expires, active: true, scans: 0 }]);
    loadOffers(); setShowNewOffer(false); setNewOffer({ name: "", discount: "", desc: "", color: "#FF4D00", expires: "" });
  };

  const exportCSV = () => {
    const headers = ["Name","Phone","Email","DOB","Offer","Joined","SMS"];
    const rows = customers.map(c => [c.name,c.phone,c.email,c.dob,c.offer,c.joined,c.sms_ok?"Yes":"No"]);
    const csv = [headers,...rows].map(r=>r.join(",")).join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv],{type:"text/csv"})); a.download="customers.csv"; a.click();
    setExportDone(true); setTimeout(()=>setExportDone(false),2500);
  };

  return (
    <div style={{ minHeight:"100vh", background:"#080808", color:"#f0f0f0", fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700;900&display=swap');
        .d-input{background:#111;border:1.5px solid #222;border-radius:8px;color:#f0f0f0;padding:11px 14px;font-size:14px;font-family:'DM Sans',sans-serif;width:100%;box-sizing:border-box;outline:none;}
        .d-btn{background:${accent};color:white;border:none;border-radius:8px;padding:11px 20px;font-size:14px;font-weight:600;font-family:'DM Sans',sans-serif;cursor:pointer;}
        .d-btn:hover{opacity:.85;}
        .d-btn-ghost{background:transparent;color:${accent};border:1.5px solid ${accent};border-radius:8px;padding:10px 18px;font-size:13px;font-weight:600;font-family:'DM Sans',sans-serif;cursor:pointer;}
        .d-btn-ghost:hover{background:${accent};color:white;}
        .card{background:#111;border:1px solid #1e1e1e;border-radius:14px;padding:20px;}
        .tab-btn{background:none;border:none;color:#555;font-family:'DM Sans',sans-serif;font-size:14px;padding:10px 18px;cursor:pointer;border-radius:8px;display:flex;align-items:center;gap:6px;width:100%;justify-content:flex-start;}
        .tab-btn.active{background:#1a1a1a;color:white;}
        .fade{animation:fadeIn .3s ease;}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .offer-card{background:#111;border:1px solid #1e1e1e;border-radius:14px;overflow:hidden;}
        table{width:100%;border-collapse:collapse;}
        th{color:#555;font-size:11px;text-transform:uppercase;letter-spacing:.6px;padding:10px 12px;text-align:left;}
        td{padding:12px;border-top:1px solid #1a1a1a;font-size:14px;color:#ccc;}
        .modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.8);display:flex;align-items:center;justify-content:center;z-index:100;padding:16px;}
      `}</style>

      {previewOffer && (
        <div className="modal-bg" onClick={()=>setPreviewOffer(null)}>
          <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:420,background:"#080808",borderRadius:20,overflow:"hidden"}}>
            <div style={{padding:"12px 16px",background:"#111",display:"flex",justifyContent:"space-between"}}>
              <span style={{color:"#666",fontSize:13}}>Customer Preview</span>
              <button onClick={()=>setPreviewOffer(null)} style={{background:"none",border:"none",color:"#555",fontSize:20,cursor:"pointer"}}>×</button>
            </div>
            <CustomerPage offer={previewOffer}/>
          </div>
        </div>
      )}

      {showQR && (
        <div className="modal-bg" onClick={()=>setShowQR(null)}>
          <div className="card" onClick={e=>e.stopPropagation()} style={{maxWidth:320,textAlign:"center",padding:32}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,marginBottom:6}}>{showQR.name}</div>
            <div style={{color:"#666",fontSize:13,marginBottom:24}}>{showQR.discount}</div>
            <div style={{display:"flex",justifyContent:"center",marginBottom:20}}>
              <QRCode value={`offer-${showQR.id}-${showQR.name}`} size={180} color={showQR.color}/>
            </div>
            <button className="d-btn" style={{width:"100%"}} onClick={()=>setShowQR(null)}>Close</button>
          </div>
        </div>
      )}

      {showNewOffer && (
        <div className="modal-bg">
          <div className="card" style={{maxWidth:460,width:"100%"}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,marginBottom:20}}>New Offer</div>
            {[{key:"name",label:"Offer Name",placeholder:"Happy Hour"},{key:"discount",label:"Discount",placeholder:"20% OFF"},{key:"desc",label:"Description",placeholder:"On all drinks"},{key:"expires",label:"Expiry",type:"date"}].map(f=>(
              <div key={f.key} style={{marginBottom:14}}>
                <div style={{color:"#777",fontSize:12,marginBottom:5,textTransform:"uppercase"}}>{f.label}</div>
                <input className="d-input" type={f.type||"text"} placeholder={f.placeholder} value={newOffer[f.key]} onChange={e=>setNewOffer({...newOffer,[f.key]:e.target.value})}/>
              </div>
            ))}
            <div style={{marginBottom:20}}>
              <div style={{color:"#777",fontSize:12,marginBottom:5,textTransform:"uppercase"}}>Color</div>
              <input type="color" value={newOffer.color} onChange={e=>setNewOffer({...newOffer,color:e.target.value})} style={{border:"none",background:"none",cursor:"pointer",width:36,height:36}}/>
            </div>
            <div style={{display:"flex",gap:10}}>
              <button className="d-btn-ghost" style={{flex:1}} onClick={()=>setShowNewOffer(false)}>Cancel</button>
              <button className="d-btn" style={{flex:2}} onClick={createOffer}>Create Offer</button>
            </div>
          </div>
        </div>
      )}

      <div style={{borderBottom:"1px solid #1a1a1a",padding:"0 32px",display:"flex",alignItems:"center",justifyContent:"space-between",height:64}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:32,height:32,background:accent,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>🍽️</div>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700}}>RestaurantQR</div>
        </div>
        <div style={{fontSize:13,color:"#555"}}>Admin Dashboard</div>
      </div>

      <div style={{display:"flex",height:"calc(100vh - 64px)"}}>
        <div style={{width:220,borderRight:"1px solid #1a1a1a",padding:"24px 12px",flexShrink:0}}>
          {[["offers","🏷️","Offers"],["customers","👥","Customers"],["newsletter","📧","Newsletter"],["qr","◻️","QR Codes"]].map(([t,icon,label])=>(
            <button key={t} className={`tab-btn ${tab===t?"active":""}`} onClick={()=>setTab(t)} style={{marginBottom:2}}>{icon} {label}</button>
          ))}
          <div style={{marginTop:32,padding:"0 6px"}}>
            <div style={{color:"#444",fontSize:11,textTransform:"uppercase",letterSpacing:".8px",marginBottom:12}}>Stats</div>
            {[{label:"Customers",value:customers.length},{label:"Active Offers",value:offers.filter(o=>o.active).length},{label:"Total Scans",value:offers.reduce((a,o)=>a+(o.scans||0),0)}].map(s=>(
              <div key={s.label} style={{marginBottom:14}}>
                <div style={{color:"#555",fontSize:11}}>{s.label}</div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:700}}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{flex:1,overflow:"auto",padding:"28px 32px"}}>
          {tab==="offers" && (
            <div className="fade">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
                <div>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:700}}>Your Offers</div>
                  <div style={{color:"#555",fontSize:14}}>Create and manage discount campaigns</div>
                </div>
                <button className="d-btn" onClick={()=>setShowNewOffer(true)}>+ New Offer</button>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16}}>
                {offers.map(o=>(
                  <div key={o.id} className="offer-card">
                    <div style={{background:o.color,padding:"20px",position:"relative",overflow:"hidden"}}>
                      <div style={{position:"absolute",top:-20,right:-20,width:80,height:80,borderRadius:"50%",background:"rgba(255,255,255,.15)"}}/>
                      <div style={{fontFamily:"'Playfair Display',serif",fontSize:32,fontWeight:900,color:"white"}}>{o.discount}</div>
                      <div style={{color:"rgba(255,255,255,.85)",fontSize:15,marginTop:4}}>{o.name}</div>
                      <div style={{color:"rgba(255,255,255,.65)",fontSize:13,marginTop:2}}>{o.description}</div>
                    </div>
                    <div style={{padding:16}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
                        <span style={{background:o.active?"rgba(0,196,140,.12)":"rgba(255,255,255,.06)",color:o.active?"#00C48C":"#555",padding:"3px 10px",borderRadius:20,fontSize:12}}>{o.active?"● Active":"Paused"}</span>
                        <span style={{color:"#555",fontSize:12}}>{o.scans} scans</span>
                      </div>
                      <div style={{display:"flex",gap:8}}>
                        <button className="d-btn-ghost" style={{flex:1,fontSize:12,padding:"8px"}} onClick={()=>setPreviewOffer(o)}>Preview</button>
                        <button className="d-btn-ghost" style={{flex:1,fontSize:12,padding:"8px"}} onClick={()=>setShowQR(o)}>QR Code</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab==="customers" && (
            <div className="fade">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
                <div>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:700}}>Customer Database</div>
                  <div style={{color:"#555",fontSize:14}}>{customers.length} registered customers</div>
                </div>
                <button className="d-btn" onClick={exportCSV}>{exportDone?"✓ Exported!":"⬇ Export CSV"}</button>
              </div>
              <div className="card" style={{padding:0,overflow:"hidden"}}>
                <table>
                  <thead><tr style={{background:"#0d0d0d"}}>{["Name","Phone","Email","DOB","Offer","Joined","SMS"].map(h=><th key={h}>{h}</th>)}</tr></thead>
                  <tbody>
                    {customers.length===0?(<tr><td colSpan={7} style={{textAlign:"center",color:"#555",padding:40}}>No customers yet — share your QR code!</td></tr>):customers.map(c=>(
                      <tr key={c.id}>
                        <td style={{fontWeight:500,color:"#f0f0f0"}}>{c.name}</td>
                        <td>{c.phone}</td><td>{c.email}</td><td>{c.dob}</td>
                        <td><span style={{background:"rgba(255,77,0,.1)",color:accent,padding:"3px 10px",borderRadius:20,fontSize:12}}>{c.offer}</span></td>
                        <td>{c.joined}</td>
                        <td><span style={{color:c.sms_ok?"#00C48C":"#555"}}>{c.sms_ok?"✓":"—"}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab==="newsletter" && (
            <div className="fade">
              <div style={{marginBottom:24}}>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:700}}>Newsletter</div>
                <div style={{color:"#555",fontSize:14}}>Send campaigns to {customers.length} customers</div>
              </div>
              {nlSent?(
                <div className="card" style={{textAlign:"center",padding:48}}>
                  <div style={{fontSize:48,marginBottom:12}}>📬</div>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:700}}>Campaign Sent!</div>
                </div>
              ):(
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
                  <div>
                    <div className="card" style={{marginBottom:16}}>
                      <div style={{fontWeight:600,marginBottom:16}}>Settings</div>
                      <div style={{marginBottom:14}}>
                        <div style={{color:"#777",fontSize:12,marginBottom:5,textTransform:"uppercase"}}>Subject</div>
                        <input className="d-input" placeholder="A special offer for you..." value={newsletter.subject} onChange={e=>setNewsletter({...newsletter,subject:e.target.value})}/>
                      </div>
                    </div>
                    <button className="d-btn" style={{width:"100%"}} onClick={()=>{setNlSent(true);setTimeout(()=>setNlSent(false),3000);}}>Send Campaign →</button>
                  </div>
                  <div>
                    <div style={{color:"#777",fontSize:12,marginBottom:5,textTransform:"uppercase"}}>Message</div>
                    <textarea className="d-input" rows={12} placeholder={"Dear [Name],\n\nWe have a special treat for you...\n\nSee you soon!"} value={newsletter.body} onChange={e=>setNewsletter({...newsletter,body:e.target.value})} style={{resize:"vertical"}}/>
                  </div>
                </div>
              )}
            </div>
          )}

          {tab==="qr" && (
            <div className="fade">
              <div style={{marginBottom:24}}>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:700}}>QR Codes</div>
                <div style={{color:"#555",fontSize:14}}>One QR code per offer</div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:16}}>
                {offers.map(o=>(
                  <div key={o.id} className="card" style={{textAlign:"center"}}>
                    <div style={{display:"flex",justifyContent:"center",marginBottom:14}}>
                      <QRCode value={`offer-${o.id}-${o.name}`} size={140} color={o.color}/>
                    </div>
                    <div style={{fontWeight:600,fontSize:14,marginBottom:4}}>{o.name}</div>
                    <div style={{color:o.color,fontSize:13,fontWeight:700,marginBottom:12}}>{o.discount}</div>
                    <div style={{display:"flex",gap:8}}>
                      <button className="d-btn-ghost" style={{flex:1,fontSize:12,padding:"8px"}} onClick={()=>setPreviewOffer(o)}>Preview</button>
                      <button className="d-btn" style={{flex:1,fontSize:12,padding:"8px"}} onClick={()=>setShowQR(o)}>Enlarge</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
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
          style={{background:"#FF4D00",color:"white",border:"none",borderRadius:10,padding:"10px 18px",fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:13,cursor:"pointer",boxShadow:"0 4px 20px rgba(255,77,0,.4)"}}>
          {view==="dashboard"?"👁 Customer View":"⚙️ Dashboard"}
        </button>
      </div>
      {view==="dashboard"?<Dashboard/>:<CustomerPage offer={{name:"Summer Tapas Night",discount:"20% OFF",desc:"Valid on all tapas plates",color:"#FF4D00"}}/>}
    </div>
  );
}