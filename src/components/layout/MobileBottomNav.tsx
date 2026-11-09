"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  Wallet,
  FileSpreadsheet,
} from "lucide-react";

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { label: "ড্যাশবোর্ড", href: "/dashboard", icon: LayoutDashboard },
    { label: "মিল", href: "/meals", icon: UtensilsCrossed },
    { label: "বাজার", href: "/bazaar", icon: ShoppingBag },
    { label: "জমা", href: "/deposits", icon: Wallet },
    { label: "লেজার", href: "/ledger", icon: FileSpreadsheet },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800/80 pb-safe md:hidden">
      <div className="max-w-md mx-auto flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-2 rounded-2xl transition-all duration-200 select-none ${
                isActive
                  ? "text-amber-400 font-semibold scale-105"
                  : "text-slate-400 hover:text-slate-200 active:scale-95"
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-colors ${
                  isActive ? "bg-amber-500/15 text-amber-400" : "text-slate-400"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bengali tracking-tight mt-0.5">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;

