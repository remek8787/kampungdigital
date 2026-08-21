import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Suspense } from "react";
import { IdleLogout } from "../components/auth/idle-logout";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://lab.anantasatriya.my.id/kampungdigital"),
  title: {
    default: "KampungDigital — Tata Kelola Warga & Kampung",
    template: "%s · KampungDigital",
  },
  description: "Sistem sumber terbuka untuk mengelola data warga, rumah, iuran, ronda, barcode, dan laporan kampung dalam satu ruang kerja yang tertata.",
  applicationName: "KampungDigital",
  keywords: ["aplikasi RT RW", "administrasi kampung", "data warga", "iuran warga", "kas ronda", "open source Indonesia"],
  authors: [{ name: "KampungDigital" }],
  openGraph: {
    title: "KampungDigital — Kampung tertata, gotong royong tetap terasa",
    description: "Kelola warga, rumah, iuran, ronda, barcode, dan laporan dalam satu ruang kerja yang sederhana dan transparan.",
    url: "https://lab.anantasatriya.my.id/kampungdigital",
    siteName: "KampungDigital",
    locale: "id_ID",
    type: "website",
    images: [{ url: "/showcase-dashboard.png", width: 1440, height: 1000, alt: "Dashboard KampungDigital" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "KampungDigital — Tata Kelola Warga & Kampung",
    description: "Sistem terbuka untuk administrasi warga, iuran, ronda, barcode, dan laporan kampung.",
    images: ["/showcase-dashboard.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          forcedTheme="light"
        >
          <IdleLogout />
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
