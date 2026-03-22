"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

type Period = "week" | "month" | "6months";

export default function AnalyticsPage() {
  const { user } = useUser();
  const [restaurantId, setRestaurantId] = useState<number | null>(null);
  const [period, setPeriod] = useState<Period>("week");
  const [data, setData] = useState<any[]>([]);
  const [totalScans, setTotalScans] = useState(0);
  const [totalClients, setTotalClients] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("restaurants")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();
      if (data) setRestaurantId(data.id);
    };
    fetchRestaurant();
  }, [user]);

  useEffect(() => {
    if (!restaurantId) return;
    fetchStats();
  }, [restaurantId, period]);

  const fetchStats = async () => {
    setLoading(true);
    const { data: redemptions } = await supabase
      .from("offer_redemptions")
      .select("*")
      .eq("restaurant_id", restaurantId);

    if (!redemptions) { setLoading(false); return; }

    setTotalScans(redemptions.length);
    const uniqueClients = new Set(redemptions.map((r: any) => r.customer_id));
    setTotalClients(uniqueClients.size);

    const now = new Date();
    let grouped: Record<string, number> = {};

    if (period === "week") {
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const key = d.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric" });
        grouped[key] = 0;
      }
      redemptions.forEach((r: any) => {
        const d = new Date(r.created_at);
        const diff = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
        if (diff <= 6) {
          const key = d.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric" });
          grouped[key] = (grouped[key] || 0) + 1;
        }
      });
    } else if (period === "month") {
      const labels = ["Sem 4", "Sem 3", "Sem 2", "Sem 1", "Cette sem"];
      labels.forEach(l => grouped[l] = 0);
      redemptions.forEach((r: any) => {
        const d = new Date(r.created_at);
        const diff = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
        if (diff <= 6) grouped["Cette sem"] = (grouped["Cette sem"] || 0) + 1;
        else if (diff <= 13) grouped["Sem 1"] = (grouped["Sem 1"] || 0) + 1;
        else if (diff <= 20) grouped["Sem 2"] = (grouped["Sem 2"] || 0) + 1;
        else if (diff <= 27) grouped["Sem 3"] = (grouped["Sem 3"] || 0) + 1;
        else if (diff <= 30) grouped["Sem 4"] = (grouped["Sem 4"] || 0) + 1;
      });
    } else {
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = d.toLocaleDateString("fr-FR", { month: "short" });
        grouped[key] = 0;
      }
      redemptions.forEach((r: any) => {
        const d = new Date(r.created_at);
        const diff = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
        if (diff <= 5) {
          const key = d.toLocaleDateString("fr-FR", { month: "short" });
          grouped[key] = (grouped[key] || 0) + 1;
        }
      });
    }

    setData(Object.entries(grouped).map(([name, value]) => ({ name, value })));
    setLoading(false);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-400 text-sm mb-1">Total participations</p>
          <p className="text-4xl font-bold">{totalScans}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-400 text-sm mb-1">Clients uniques</p>
          <p className="text-4xl font-bold">{totalClients}</p>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-lg">Participations</h2>
          <div className="flex gap-2">
            {(["week", "month", "6months"] as Period[]).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  period === p ? "bg-black text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {p === "week" ? "7 jours" : p === "month" ? "30 jours" : "6 mois"}
              </button>
            ))}
          </div>
        </div>
        {loading ? (
          <div className="h-64 flex items-center justify-center text-gray-400">Chargement...</div>
        ) : data.every(d => d.value === 0) ? (
          <div className="h-64 flex items-center justify-center text-gray-400">
            Aucune participation sur cette période
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: any) => [`${value} participation${value > 1 ? "s" : ""}`, ""]}
                labelStyle={{ fontWeight: "bold" }}
              />
              <Bar dataKey="value" fill="#000000" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
