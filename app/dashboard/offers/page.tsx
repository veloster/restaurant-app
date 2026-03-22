"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { QRCodeSVG } from "qrcode.react";

export default function OffersPage() {
  const { user } = useUser();
  const [offers, setOffers] = useState<any[]>([]);
  const [restaurantId, setRestaurantId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", description: "", discount: "", expires_at: "", max_uses: "" });
  const [saving, setSaving] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => { setOrigin(window.location.origin); }, []);

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from("restaurants")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Erreur restaurant:", error?.message);
        setLoading(false);
        return;
      }
      if (data) setRestaurantId(data.id);
      else setLoading(false);
    };
    fetchRestaurant();
  }, [user]);

  const fetchOffers = async () => {
    if (!restaurantId) return;
    const { data, error } = await supabase
      .from("offers")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("id", { ascending: false });

    if (error) console.error("Erreur offres:", error?.message);
    setOffers(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchOffers(); }, [restaurantId]);

  const handleCreate = async () => {
    if (!user || !form.name || !restaurantId) return;
    setSaving(true);

    const { error } = await supabase.from("offers").insert({
      name: form.name,
      description: form.description || null,
      discount: form.discount || null,
      expires_at: form.expires_at || null,
      max_uses: parseInt(form.max_uses) || 0,
      use_count: 0,
      restaurant_id: restaurantId,
    });

    if (error) console.error("Erreur création:", error?.message);

    setForm({ name: "", description: "", discount: "", expires_at: "", max_uses: "" });
    await fetchOffers();
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    await supabase.from("offers").delete().eq("id", id);
    await fetchOffers();
  };

  const isExpired = (expires_at: string) => {
    if (!expires_at) return false;
    return new Date(expires_at) < new Date();
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Offres</h1>

      {!restaurantId && !loading && (
        <div className="bg-red-50 text-red-600 rounded-xl p-4 mb-6">
          ⚠️ Aucun restaurant trouvé pour votre compte. Complétez d'abord l'onboarding.
        </div>
      )}

      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Nouvelle offre</h2>
        <div className="grid grid-cols-2 gap-4">
          <input placeholder="Nom de l'offre *" className="border rounded-lg p-3" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          <input placeholder="Réduction (ex: 10%)" className="border rounded-lg p-3" value={form.discount} onChange={e => setForm({...form, discount: e.target.value})} />
          <input placeholder="Description" className="border rounded-lg p-3 col-span-2" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          <div>
            <label className="text-sm text-gray-500 mb-1 block">Date d'expiration</label>
            <input type="datetime-local" className="border rounded-lg p-3 w-full" value={form.expires_at} onChange={e => setForm({...form, expires_at: e.target.value})} />
          </div>
          <div>
            <label className="text-sm text-gray-500 mb-1 block">Nombre max d'utilisations (0 = illimité)</label>
            <input type="number" placeholder="0" className="border rounded-lg p-3 w-full" value={form.max_uses} onChange={e => setForm({...form, max_uses: e.target.value})} />
          </div>
          <button onClick={handleCreate} disabled={saving || !form.name || !restaurantId} className="col-span-2 bg-black text-white rounded-lg p-3 font-semibold disabled:opacity-50">
            {saving ? "Création..." : "Créer l'offre + QR Code"}
          </button>
        </div>
      </div>

      {loading ? <p>Chargement...</p> : offers.length === 0 ? (
        <p className="text-gray-500">Aucune offre pour l'instant.</p>
      ) : (
        <div className="grid gap-6">
          {offers.map((o) => {
            const expired = isExpired(o.expires_at);
            const full = o.max_uses > 0 && o.use_count >= o.max_uses;
            const url = `${origin}/register/${o.restaurant_id}/${o.id}`;
            return (
              <div key={o.id} className={`bg-white rounded-xl shadow p-6 flex gap-6 ${expired || full ? "opacity-60" : ""}`}>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="font-semibold text-lg">{o.name}</h2>
                    {expired && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Expirée</span>}
                    {full && <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">Complète</span>}
                    {!expired && !full && <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">Active</span>}
                  </div>
                  <p className="text-gray-500 text-sm">{o.description}</p>
                  <p className="text-sm mt-1">Réduction : <span className="font-medium">{o.discount}</span></p>
                  {o.expires_at && <p className="text-sm text-gray-400 mt-1">Expire le : {new Date(o.expires_at).toLocaleDateString()}</p>}
                  <p className="text-sm text-gray-400 mt-1">Utilisations : {o.use_count}{o.max_uses > 0 ? ` / ${o.max_uses}` : " / ∞"}</p>
                  <p className="text-xs text-gray-300 mt-2 break-all">{url}</p>
                  <button onClick={() => handleDelete(o.id)} className="text-red-500 text-sm hover:underline mt-3">Supprimer</button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <QRCodeSVG value={url} size={120} />
                  <p className="text-xs text-gray-400">Scanner pour tester</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}