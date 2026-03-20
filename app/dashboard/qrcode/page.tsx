"use client";
import { useUser } from "@clerk/nextjs";
import { QRCodeSVG } from "qrcode.react";
import { useState, useEffect } from "react";

export default function QRCodePage() {
  const { user } = useUser();
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const url = `${origin}/register/${user?.id}`;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2">Votre QR Code</h1>
      <p className="text-gray-500 mb-8">Affichez ce QR code dans votre restaurant pour collecter des clients.</p>
      <div className="bg-white p-8 rounded-xl shadow inline-block">
        {user && origin && <QRCodeSVG value={url} size={256} />}
      </div>
      <p className="mt-4 text-sm text-gray-400 break-all">{user && origin && url}</p>
    </div>
  );
}