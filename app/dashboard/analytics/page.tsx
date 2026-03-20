"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function AnalyticsPage() {
  const { user } = useUser();
  const [stats, setStats] = useState({ customers: 0, offers: 0, thisMonth: 0 });

  useEffect(() => {
    if (!user) return;
    const fetchStats = async () => {
      const { count: customers } = await supabase
        .from("customers").select("*", { count: "exact", head: true })
        .eq("user_id", user.id);
      const { count: offers } = await supabase
        .from("offers").select("*", { count: "exact", head: true })
        .eq("user_id", user.id);
      const firstOfMonth = new Date();
      firstOfMonth.setDate(1);
      const { count: thisMonth } = await supabase
        .from("customers").select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("created_at", firstOfMonth.toISOString());
      setStats({ customers: customers || 0, offers: offers || 0, thisMonth: thisMonth || 0 });
    };
    fetchStats();
  }, [user]);

  const cards = [
    { label: "Total clients", value: stats.customers, icon: "👥" },
    { label: "Nouveaux ce mois", value: stats.thisMonth, icon: "📈" },
    { label: "Offres actives", value: stats.offers, icon: "🎁" },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">Analytics</h1>
      <div className="grid grid-cols-3 gap-6">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-xl shadow p-6">
            <div className="text-3xl mb-2">{c.icon}</div>
            <div className="text-4xl font-bold">{c.value}</div>
            <div className="text-gray-500 mt-1">{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
