"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const links = [
    { href: "/dashboard", label: "🏠 Accueil" },
    { href: "/dashboard/customers", label: "👥 Clients" },
    { href: "/dashboard/offers", label: "🎁 Offres" },
    { href: "/dashboard/qrcode", label: "📱 QR Code" },
    { href: "/dashboard/analytics", label: "📊 Analytics" },
    { href: "/dashboard/settings", label: "⚙️ Paramètres" }
  ];

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 bg-black text-white flex flex-col p-6 gap-2">
        <h1 className="text-xl font-bold mb-6">LOYTI</h1>
        {links.map(l => (
          <Link key={l.href} href={l.href} className={`px-3 py-2 rounded-lg text-sm font-medium transition ${pathname === l.href ? "bg-white text-black" : "hover:bg-white/10"}`}>
            {l.label}
          </Link>
        ))}
        <div className="mt-auto">
          <UserButton />
        </div>
      </aside>
      <main className="flex-1 bg-gray-50">{children}</main>
    </div>
  );
}
