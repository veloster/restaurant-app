"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function OffersPage() {
  const { user } = useUser();
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", description: "", discount: "", expires: "" });
  const [saving, setSaving] = useState(false);

  const fetchOffers = async () => {
    if (!user) return;
    const { data } = await supabase.from("offers").select("*").eq("user_id", user.id);
    setOffers(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchOffers(); }, [user]);

  const handleCreate = async () => {
    if (!user) return;
    setSaving(true);
    await supabase.from("offers").insert({ ...form, user_id: user.id, active: true });
    setForm({ name: "", description: "", discount: "", expires: "" });
    await fetchOffers();
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    await supabase.from("offers").delete().eq("id", id);
    await fetchOffers();
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Offres</h1>

      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Nouvelle offre</h2>
        <div className="grid grid-cols-2 gap-4">
          <input placeholder="Nom de l'offre" className="border rounded p-2" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          <input placeholder="Réduction (ex: 10%)" className="border rounded p-2" value={form.discount} onChange={e => setForm({...form, discount: e.target.value})} />
          <input placeholder="Description" className="border rounded p-2 col-span-2" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          <input type="date" className="border rounded p-2" value={form.expires} onChange={e => setForm({...form, expires: e.target.value})} />
          <button onClick={handleCreate} disabled={saving} className="bg-black text-white rounded p-2 font-semibold">
            {saving ? "Création..." : "Créer l'offre"}
          </button>
        </div>
      </div>

      {loading ? <p>Chargement...</p> : offers.length === 0 ? (
        <p className="text-gray-500">Aucune offre pour l'instant.</p>
      ) : (
        <div className="grid gap-4">
          {offers.map((o) => (
            <div key={o.id} className="bg-white rounded-xl shadow p-4 flex justify-between items-center">
              <div>
                <h2 className="font-semibold">{o.name}</h2>
                <p className="text-gray-500 text-sm">{o.description}</p>
                <p className="text-sm mt-1">Réduction : <span className="font-medium">{o.discount}</span></p>
              </div>
              <button onClick={() => handleDelete(o.id)} className="text-red-500 text-sm hover:underline">Supprimer</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
