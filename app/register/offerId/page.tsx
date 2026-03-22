"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../../lib/supabase";

export default function RegisterPage() {
  const params = useParams();
  const restaurantId = params.userId;
  const offerId = params.offerId;

  const [step, setStep] = useState<"form" | "loading" | "success" | "already" | "expired" | "error">("form");
  const [offer, setOffer] = useState<any>(null);
  const [restaurant, setRestaurant] = useState<any>(null);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const { data: offerData } = await supabase
        .from("offers")
        .select("*")
        .eq("id", offerId)
        .maybeSingle();

      const { data: restData } = await supabase
        .from("restaurants")
        .select("*")
        .eq("id", restaurantId)
        .maybeSingle();

      if (!offerData) { setStep("error"); return; }

      if (offerData.expires_at && new Date(offerData.expires_at) < new Date()) {
        setStep("expired"); return;
      }

      if (offerData.max_uses > 0 && offerData.use_count >= offerData.max_uses) {
        setStep("expired"); return;
      }

      setOffer(offerData);
      setRestaurant(restData);
    };
    fetchData();
  }, [offerId, restaurantId]);

  const handleSubmit = async () => {
    if (!name || !phone) return;
    setStep("loading");

    let { data: customer } = await supabase
      .from("customers")
      .select("id")
      .eq("phone", phone)
      .maybeSingle();

    if (!customer) {
      const { data: newCustomer } = await supabase
        .from("customers")
        .insert({ name, phone })
        .select("id")
        .single();
      customer = newCustomer;
    }

    if (!customer) { setStep("error"); return; }

    const { data: existing } = await supabase
      .from("offer_redemptions")
      .select("id")
      .eq("customer_id", customer.id)
      .eq("offer_id", offerId)
      .maybeSingle();

    if (existing) { setStep("already"); return; }

    await supabase.from("offer_redemptions").insert({
      customer_id: customer.id,
      offer_id: offerId,
      restaurant_id: restaurantId,
    });

    await supabase
      .from("offers")
      .update({ use_count: (offer.use_count || 0) + 1 })
      .eq("id", offerId);

    setStep("success");
  };

  if (step === "error") return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="text-center">
        <p className="text-4xl mb-4">❌</p>
        <h1 className="text-xl font-bold text-gray-800">Offre introuvable</h1>
        <p className="text-gray-500 mt-2">Ce lien n'est pas valide.</p>
      </div>
    </div>
  );

  if (step === "expired") return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="text-center">
        <p className="text-4xl mb-4">⏰</p>
        <h1 className="text-xl font-bold text-gray-800">Offre expirée</h1>
        <p className="text-gray-500 mt-2">Cette offre n'est plus disponible.</p>
      </div>
    </div>
  );

  if (step === "already") return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="text-center">
        <p className="text-4xl mb-4">⚠️</p>
        <h1 className="text-xl font-bold text-gray-800">Déjà utilisée</h1>
        <p className="text-gray-500 mt-2">Vous avez déjà participé à cette offre.</p>
      </div>
    </div>
  );

  if (step === "success") return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="text-center">
        <p className="text-5xl mb-4">🎉</p>
        <h1 className="text-2xl font-bold text-gray-800">Inscription confirmée !</h1>
        {offer && <p className="text-gray-600 mt-2 text-lg">Offre : <span className="font-semibold">{offer.name}</span></p>}
        {offer?.discount && <p className="text-green-600 font-bold text-xl mt-1">{offer.discount}</p>}
        <p className="text-gray-400 mt-4 text-sm">Montrez cet écran au restaurateur.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        {restaurant && (
          <p className="text-gray-400 text-sm text-center mb-1">{restaurant.name}</p>
        )}
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-1">
          {offer?.name || "Chargement..."}
        </h1>
        {offer?.discount && (
          <p className="text-center text-green-600 font-semibold text-lg mb-2">{offer.discount}</p>
        )}
        {offer?.description && (
          <p className="text-center text-gray-500 text-sm mb-6">{offer.description}</p>
        )}
        <div className="space-y-4 mt-6">
          <div>
            <label className="text-sm text-gray-600 font-medium block mb-1">Votre prénom *</label>
            <input
              type="text"
              placeholder="Ex: Marie"
              className="w-full border rounded-xl p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 font-medium block mb-1">Votre numéro de téléphone *</label>
            <input
              type="tel"
              placeholder="Ex: 06 12 34 56 78"
              className="w-full border rounded-xl p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={!name || !phone || step === "loading"}
            className="w-full bg-black text-white rounded-xl p-4 font-semibold text-lg disabled:opacity-50 mt-2"
          >
            {step === "loading" ? "Inscription..." : "Je participe 🎁"}
          </button>
        </div>
        <p className="text-xs text-gray-300 text-center mt-4">
          Vos données sont utilisées uniquement par ce restaurant.
        </p>
      </div>
    </div>
  );
}