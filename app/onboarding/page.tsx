"use client";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect, useRef } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

declare global {
  interface Window { google: any; initAutocomplete: () => void; }
}

export default function OnboardingPage() {
  const { user } = useUser();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", description: "", address: "" });
  const [phone, setPhone] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const addressRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}&libraries=places&callback=initAutocomplete`;
    script.async = true;
    script.defer = true;

    window.initAutocomplete = () => {
      if (!addressRef.current) return;
      autocompleteRef.current = new window.google.maps.places.Autocomplete(addressRef.current, {
        types: ["establishment", "geocode"],
      });
      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current.getPlace();
        setForm(f => ({ ...f, address: place.formatted_address || addressRef.current?.value || "" }));
      });
    };

    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, []);

  const checkNameUnique = async (name: string) => {
    if (!name) return;
    const { data } = await supabase
      .from("restaurants")
      .select("id")
      .ilike("name", name)
      .maybeSingle();
    if (data) setNameError("Ce nom est déjà pris. Choisissez-en un autre.");
    else setNameError("");
  };

  const handleSubmit = async () => {
    if (!user) return;
    setNameError("");
    setPhoneError("");

    if (!form.name || !form.address || !phone) {
      if (!form.name) setNameError("Le nom est obligatoire.");
      if (!phone) setPhoneError("Le téléphone est obligatoire.");
      return;
    }

    if (!isValidPhoneNumber(phone)) {
      setPhoneError("Numéro de téléphone invalide.");
      return;
    }

    const { data: existing } = await supabase
      .from("restaurants")
      .select("id")
      .ilike("name", form.name)
      .maybeSingle();

    if (existing) {
      setNameError("Ce nom est déjà pris. Choisissez-en un autre.");
      return;
    }

    setSaving(true);
    await supabase.from("restaurants").insert({
      user_id: user.id,
      name: form.name,
      description: form.description,
      address: form.address,
      phone,
    });
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow p-10 w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-2">Bienvenue sur LOYTI 🎉</h1>
        <p className="text-gray-500 mb-8">Dites-nous en plus sur votre restaurant.</p>

        <div className="space-y-5">

          {/* Nom du restaurant */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Nom du restaurant *</label>
            <input
              placeholder="Ex: Le Petit Bistro"
              className={`w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-black ${nameError ? "border-red-400" : ""}`}
              value={form.name}
              onChange={e => { setForm({ ...form, name: e.target.value }); setNameError(""); }}
              onBlur={e => checkNameUnique(e.target.value)}
            />
            {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Description</label>
            <input
              placeholder="Ex: Restaurant italien au cœur de Paris"
              className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-black"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
          </div>

          {/* Adresse Google Places */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Adresse *</label>
            <input
              ref={addressRef}
              placeholder="Tapez votre adresse..."
              className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-black"
              value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
            />
          </div>

          {/* Téléphone avec préfixe pays */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Téléphone *</label>
            <PhoneInput
              international
              defaultCountry="FR"
              value={phone}
              onChange={(val) => { setPhone(val || ""); setPhoneError(""); }}
              className={`w-full border rounded-xl p-3 focus:outline-none ${phoneError ? "border-red-400" : ""}`}
            />
            {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
          </div>

          <button
            onClick={handleSubmit}
            disabled={saving || !!nameError}
            className="w-full bg-black text-white rounded-xl p-4 font-semibold text-lg disabled:opacity-50 mt-2"
          >
            {saving ? "Enregistrement..." : "Créer mon restaurant →"}
          </button>

        </div>
      </div>
    </div>
  );
}
