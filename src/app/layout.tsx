import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { MessProvider } from "../context/MessContext";

export const metadata: Metadata = {
  title: "Smart MMS - ডিজিটাল মেস ম্যানেজার",
  description: "ব্যাচেলর মেস ও হোস্টেল মিল ও খরচের আধুনিক মোবাইল-ফার্স্ট হিসাব",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/logo.svg",
    apple: "/icons/logo.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#090d16",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen selection:bg-amber-500/30 selection:text-amber-200">
        <AuthProvider>
          <MessProvider>
            {children}
          </MessProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

