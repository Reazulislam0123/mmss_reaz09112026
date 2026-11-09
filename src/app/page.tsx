"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import BrandLogo from "../components/ui/BrandLogo";

export default function Home() {
  const router = useRouter();
  const { mongoUser, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (mongoUser) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    }
  }, [mongoUser, loading, router]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <BrandLogo size="lg" className="animate-pulse" />
      <p className="mt-4 text-xs text-slate-400 font-bengali">স্মার্ট মেস ম্যানেজার লোড হচ্ছে...</p>
    </div>
  );
}
