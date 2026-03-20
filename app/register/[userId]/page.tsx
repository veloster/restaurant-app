"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export default function RegisterPage() {
  const { userId } = useParams();
  const [form, setForm] = useState({ name: "", email: "", phone: "", dob: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await supabase.from("customers").insert({
      ...form,
      user_id: userId,
      joined: new Date().toISOString(),
      sms_ok: "true",
    });
    setSubmitted(true);
  };

  if (submitted) return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Merci ! 🎉</h1>
        <p className="text-gray-500 mt-2">Vous êtes inscrit aux offres du restaurant.</p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Rejoindre le club 🎁</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required placeholder="Nom complet" className="w-full border rounded p-3" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          <input required type="email" placeholder="Email" className="w-full border rounded p-3" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          <input required placeholder="Téléphone" className="w-full border rounded p-3" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
          <input required type="date" placeholder="Date de naissance" className="w-full border rounded p-3" value={form.dob} onChange={e => setForm({...form, dob: e.target.value})} />
          <button type="submit" className="w-full bg-black text-white rounded p-3 font-semibold">S'inscrire</button>
        </form>
      </div>
    </div>
  );
}
