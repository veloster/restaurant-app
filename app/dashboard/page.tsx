"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function DashboardPage() {
  const { user } = useUser();
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("customers")
      .select("*")
      .eq("user_id", user.id)
      .then(({ data }) => setCustomers(data || []));
  }, [user]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Bienvenue sur YARTA</h1>
      <p className="mt-2 text-gray-500">{user?.emailAddresses[0]?.emailAddress}</p>
      <h2 className="mt-6 text-xl font-semibold">Clients ({customers.length})</h2>
    </div>
  );
}