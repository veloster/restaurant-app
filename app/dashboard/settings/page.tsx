"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function SettingsPage() {
  const { user } = useUser();
  const [form, setForm] = useState({ name: "", description: "", address: "", phone: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("restaurants").select("*").eq("user_id", user.id).single()
      .then(({ data }) => { if (data) setForm(data); });
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    await supabase.from("restaurants").update(form).eq("user_id", user.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2">Paramètres</h1>
      <p className="text-gray-500 mb-8">Informations de votre restaurant</p>
      <div className="bg-white rounded-xl shadow p-6 max-w-xl space-y-4">
        <input placeholder="Nom du restaurant" className="w-full border rounded-lg p-3" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
        <input placeholder="Description" className="w-full border rounded-lg p-3" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
        <input placeholder="Adresse" className="w-full border rounded-lg p-3" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
        <input placeholder="Téléphone" className="w-full border rounded-lg p-3" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
        <button onClick={handleSave} disabled={saving} className="w-full bg-black text-white rounded-lg p-3 font-semibold">
          {saving ? "Enregistrement..." : saved ? "✅ Sauvegardé !" : "Sauvegarder"}
        </button>
      </div>
    </div>
  );
}
