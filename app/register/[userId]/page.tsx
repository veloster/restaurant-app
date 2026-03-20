"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export default function RegisterPage() {
  const { userId } = useParams();
  const [form, setForm] = useState({ name: "", email: "", phone: "", dob: "" });
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.phone) return;
    setSaving(true);
    await supabase.from("customers").insert({
      ...form,
      user_id: userId,
      joined: new Date().toISOString(),
      sms_ok: "true",
    });
    setSubmitted(true);
  };

  if (submitted) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center text-white p-8">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold mb-2">Vous êtes inscrit !</h1>
        <p className="text-gray-400">Vous recevrez nos offres exclusives par SMS.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🎁</div>
          <h1 className="text-3xl font-bold text-white">Rejoignez le club</h1>
          <p className="text-gray-400 mt-2">Offres exclusives et surprises pour nos fidèles clients</p>
        </div>
        <div className="bg-white rounded-2xl p-6 space-y-4">
          <input
            required
            placeholder="Votre nom complet"
            className="w-full border-b border-gray-200 p-3 outline-none focus:border-black transition"
            value={form.name}
            onChange={e => setForm({...form, name: e.target.value})}
          />
          <input
            type="tel"
            required
            placeholder="Numéro de téléphone"
            className="w-full border-b border-gray-200 p-3 outline-none focus:border-black transition"
            value={form.phone}
            onChange={e => setForm({...form, phone: e.target.value})}
          />
          <input
            type="email"
            placeholder="Email (optionnel)"
            className="w-full border-b border-gray-200 p-3 outline-none focus:border-black transition"
            value={form.email}
            onChange={e => setForm({...form, email: e.target.value})}
          />
          <input
            type="date"
            placeholder="Date de naissance (optionnel)"
            className="w-full border-b border-gray-200 p-3 outline-none focus:border-black transition"
            value={form.dob}
            onChange={e => setForm({...form, dob: e.target.value})}
          />
          <button
            onClick={handleSubmit}
            disabled={saving || !form.name || !form.phone}
            className="w-full bg-black text-white rounded-xl p-4 font-semibold text-lg mt-2"
          >
            {saving ? "Inscription..." : "S'inscrire gratuitement →"}
          </button>
          <p className="text-xs text-gray-400 text-center">En vous inscrivant vous acceptez de recevoir des SMS promotionnels.</p>
        </div>
      </div>
    </div>
  );
}
