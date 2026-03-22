"use client";
import { useUser, SignInButton, SignUpButton } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user) {
      router.push("/dashboard");
    }
  }, [isLoaded, user]);

  if (!isLoaded) return null;

  if (user) return null; // redirect en cours

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5 border-b">
        <h1 className="text-2xl font-bold">LOYTI</h1>
        <div className="flex gap-3">
          <SignInButton mode="modal">
            <button className="px-5 py-2 rounded-xl border border-gray-300 text-sm font-medium hover:bg-gray-50">
              Se connecter
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="px-5 py-2 rounded-xl bg-black text-white text-sm font-medium hover:bg-gray-800">
              Commencer gratuitement
            </button>
          </SignUpButton>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <span className="bg-gray-100 text-gray-600 text-sm px-4 py-1.5 rounded-full mb-6">
          Fidélisation simple pour restaurateurs
        </span>
        <h2 className="text-5xl font-bold text-gray-900 max-w-2xl leading-tight mb-6">
          Fidélisez vos clients avec un simple QR code
        </h2>
        <p className="text-gray-500 text-lg max-w-xl mb-10">
          Créez des offres, générez un QR code, et suivez vos clients en temps réel. Sans app à télécharger.
        </p>
        <SignUpButton mode="modal">
          <button className="px-8 py-4 bg-black text-white rounded-xl font-semibold text-lg hover:bg-gray-800">
            Créer mon restaurant gratuitement →
          </button>
        </SignUpButton>

        {/* Features */}
        <div className="grid grid-cols-3 gap-6 mt-20 max-w-3xl w-full">
          <div className="bg-gray-50 rounded-2xl p-6 text-left">
            <p className="text-2xl mb-3">🎁</p>
            <h3 className="font-semibold mb-1">Offres personnalisées</h3>
            <p className="text-gray-500 text-sm">Créez des promotions avec date d'expiration et limite d'utilisations.</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-6 text-left">
            <p className="text-2xl mb-3">📱</p>
            <h3 className="font-semibold mb-1">QR Code instantané</h3>
            <p className="text-gray-500 text-sm">Chaque offre génère un QR code unique. Vos clients scannent et s'inscrivent en 10 secondes.</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-6 text-left">
            <p className="text-2xl mb-3">📊</p>
            <h3 className="font-semibold mb-1">Analytics en temps réel</h3>
            <p className="text-gray-500 text-sm">Suivez vos participations par jour, semaine ou mois.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-400 text-sm border-t">
        © 2026 LOYTI — Tous droits réservés
      </footer>
    </div>
  );
}
