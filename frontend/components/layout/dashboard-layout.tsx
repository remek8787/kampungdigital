"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { LogOut, X } from "lucide-react";
import { Sidebar, menuItems } from "./sidebar";
import { Header } from "./header";
import type { User } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { appPath } from "@/lib/paths";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const roleLabels = {
  warga: "Warga",
  petugas: "Petugas Lapangan",
  admin: "Admin Kampung",
  super_admin: "Super Admin",
};

export function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  const [user, setUser] = useState<User | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (!savedUser) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(savedUser));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    router.push("/login");
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f7f5]">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-lg shadow-emerald-950/10">
            <Image src={appPath("/kampungdigital-mark.svg")} alt="Logo KampungDigital" width={50} height={50} className="h-12 w-12 object-contain" />
            <span className="absolute -bottom-1 -right-1 h-5 w-5 animate-pulse rounded-full border-4 border-white bg-emerald-500" />
          </div>
          <div>
            <p className="font-semibold text-slate-800">Menyiapkan ruang kerja</p>
            <p className="mt-1 text-sm text-slate-500">Sebentar, data kampung sedang dimuat.</p>
          </div>
        </div>
      </div>
    );
  }

  const mobileItems = menuItems.filter((item) => item.roles.includes(user.role));

  return (
    <div className="flex h-screen overflow-hidden bg-[#f4f7f5] text-slate-900">
      <Sidebar user={user} onLogout={handleLogout} onRoleSwitch={handleLogout} />
      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_80%_0%,rgba(16,185,129,.09),transparent_42%)]" />
        <Header title={title} subtitle={subtitle} onOpenMenu={() => setMobileOpen(true)} userRole={user.role} />
        <main className="relative flex-1 overflow-y-auto overflow-x-hidden">
          <div className="mx-auto w-full max-w-[1600px] px-3 py-4 sm:px-5 sm:py-6 lg:px-7 xl:px-9 xl:py-8">{children}</div>
        </main>
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[88vw] max-w-[360px] border-0 bg-[#102a22] p-0 text-white [&>button]:hidden">
          <SheetHeader className="border-b border-white/10 p-5 text-left">
            <div className="flex items-center justify-between">
              <SheetTitle className="flex items-center gap-3 text-white">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white p-1.5">
                  <Image src={appPath("/kampungdigital-mark.svg")} alt="Logo KampungDigital" width={44} height={44} className="h-full w-full object-contain" />
                </span>
                <span>
                  <span className="block text-base font-bold">KampungDigital</span>
                  <span className="mt-0.5 block text-[10px] font-medium uppercase tracking-[.16em] text-emerald-200/60">Ruang kerja warga</span>
                </span>
              </SheetTitle>
              <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)} className="text-emerald-100 hover:bg-white/10 hover:text-white">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="mt-5 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-300 font-bold text-emerald-950">{user.nama?.charAt(0).toUpperCase()}</div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{user.nama}</p>
                <p className="text-xs text-emerald-100/55">{roleLabels[user.role]}</p>
              </div>
            </div>
          </SheetHeader>
          <nav className="h-[calc(100vh-216px)] overflow-y-auto p-4">
            <div className="space-y-1">
              {mobileItems.map((item) => {
                const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));
                return (
                  <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className={cn("flex items-center gap-3 rounded-xl px-3 py-3 transition-colors", active ? "bg-emerald-300 text-emerald-950" : "text-emerald-50/75 hover:bg-white/[0.07] hover:text-white")}>
                    <item.icon className="h-[18px] w-[18px] shrink-0" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold">{item.title}</span>
                      <span className={cn("block truncate text-[11px]", active ? "text-emerald-950/60" : "text-emerald-100/40")}>{item.description}</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </nav>
          <div className="absolute inset-x-0 bottom-0 border-t border-white/10 p-4">
            <Button variant="ghost" onClick={handleLogout} className="w-full justify-start gap-3 text-rose-200 hover:bg-rose-400/10 hover:text-rose-100">
              <LogOut className="h-4 w-4" /> Keluar dari akun
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
