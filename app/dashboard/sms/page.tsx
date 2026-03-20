"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function SMSPage() {
  const { user } = useUser();
  const [customers, setCustomers] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(0);

  useEffect(() => {
    if (!user) return;
    supabase.from("customers").select("*").eq("user_id", user.id)
      .then(({ data }) => setCustomers(data || []));
  }, [user]);

  const handleSend = async () => {
    if (!message || customers.length === 0) return;
    setSending(true);
    setSent(0);
    for (const c of customers) {
      if (!c.phone) continue;
      await fetch("/api/send-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: c.phone, message }),
      });
      setSent(s => s + 1);
    }
    setSending(false);
    setMessage("");
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2">Envoyer un SMS</h1>
      <p className="text-gray-500 mb-8">{customers.length} clients dans votre base</p>
      <div className="bg-white rounded-xl shadow p-6 max-w-xl">
        <textarea
          placeholder="Votre message SMS..."
          className="w-full border rounded-lg p-3 h-32 resize-none"
          value={message}
          onChange={e => setMessage(e.target.value)}
          maxLength={160}
        />
        <p className="text-sm text-gray-400 mt-1">{message.length}/160 caractères</p>
        <button
          onClick={handleSend}
          disabled={sending || !message}
          className="mt-4 w-full bg-black text-white rounded-lg p-3 font-semibold"
        >
          {sending ? `Envoi en cours... ${sent}/${customers.length}` : `Envoyer à ${customers.length} clients`}
        </button>
        {!sending && sent > 0 && (
          <p className="text-green-500 mt-3 text-center">✅ {sent} SMS envoyés !</p>
        )}
      </div>
    </div>
  );
}
