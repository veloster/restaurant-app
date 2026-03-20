"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function CustomersPage() {
  const { user } = useUser();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("customers")
      .select("*")
      .eq("user_id", user.id)
      .then(({ data }) => {
        setCustomers(data || []);
        setLoading(false);
      });
  }, [user]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Clients</h1>
      {loading ? (
        <p>Chargement...</p>
      ) : customers.length === 0 ? (
        <p className="text-gray-500">Aucun client pour l'instant.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border">Nom</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Téléphone</th>
              <th className="p-3 border">Inscrit le</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="p-3 border">{c.name}</td>
                <td className="p-3 border">{c.email}</td>
                <td className="p-3 border">{c.phone}</td>
                <td className="p-3 border">{new Date(c.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
