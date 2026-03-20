"use client";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const { user } = useUser();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", description: "", address: "", phone: "" });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!user) return;
    setSaving(true);
    await supabase.from("restaurants").insert({
      user_id: user.id,
      ...form,
    });
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow p-10 w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-2">Bienvenue sur LOYTI 👋</h1>
        <p className="text-gray-500 mb-8">Dites-nous en plus sur votre restaurant.</p>
        <div className="space-y-4">
          <input required placeholder="Nom du restaurant" className="w-full border rounded-lg p-3" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          <input placeholder="Description" className="w-full border rounded-lg p-3" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          <input placeholder="Adresse" className="w-full border rounded-lg p-3" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
          <input placeholder="Téléphone" className="w-full border rounded-lg p-3" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
          <button onClick={handleSubmit} disabled={saving} className="w-full bg-black text-white rounded-lg p-3 font-semibold text-lg">
            {saving ? "Enregistrement..." : "Créer mon restaurant →"}
          </button>
        </div>
      </div>
    </div>
  );
}
