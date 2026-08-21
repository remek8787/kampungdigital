"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { appPath } from "@/lib/paths";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Home,
  Building2,
  Users,
  UserCheck,
  Wallet,
  Shield,
  BarChart3,
  QrCode,
  ClipboardCheck,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Settings,
  Banknote,
  Landmark,
  Sparkles,
} from "lucide-react";
import type { User, UserRole } from "@/types/auth";

interface SidebarProps {
  user: User;
  onLogout: () => void;
  onRoleSwitch: () => void;
}

export interface MenuItem {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
  group: "utama" | "data" | "operasional" | "sistem";
}

export const menuItems: MenuItem[] = [
  { title: "Beranda", description: "Ringkasan kampung", href: "/dashboard", icon: Home, roles: ["warga", "petugas", "admin", "super_admin"], group: "utama" },
  { title: "Riwayat Saya", description: "Transaksi pribadi", href: "/data-transaksi", icon: Banknote, roles: ["warga"], group: "utama" },
  { title: "Data Rumah", description: "Bangunan & barcode", href: "/data-rumah", icon: Building2, roles: ["admin", "super_admin"], group: "data" },
  { title: "Data Warga", description: "Penduduk terdaftar", href: "/data-warga", icon: Users, roles: ["admin", "super_admin"], group: "data" },
  { title: "Data Petugas", description: "Pengurus & akses", href: "/data-petugas", icon: UserCheck, roles: ["admin", "super_admin"], group: "data" },
  { title: "Jenis Dana", description: "Kategori iuran", href: "/jenis-dana", icon: Wallet, roles: ["admin", "super_admin"], group: "operasional" },
  { title: "Kelompok Ronda", description: "Regu & jadwal", href: "/kelompok-ronda", icon: Shield, roles: ["admin", "super_admin"], group: "operasional" },
  { title: "Transaksi Dana", description: "Pemasukan kampung", href: "/transaksi-dana", icon: Landmark, roles: ["admin", "super_admin", "petugas"], group: "operasional" },
  { title: "Scan Barcode", description: "Input cepat lapangan", href: "/scan-barcode", icon: QrCode, roles: ["petugas"], group: "operasional" },
  { title: "Absensi", description: "Kehadiran ronda", href: "/absensi", icon: ClipboardCheck, roles: ["petugas", "admin", "super_admin"], group: "operasional" },
  { title: "Laporan", description: "Rekap & evaluasi", href: "/laporan", icon: BarChart3, roles: ["admin", "super_admin"], group: "operasional" },
  { title: "Pengaturan", description: "Profil & tampilan", href: "/settings", icon: Settings, roles: ["warga", "petugas", "admin", "super_admin"], group: "sistem" },
];

const groupLabels: Record<MenuItem["group"], string> = {
  utama: "Ruang kerja",
  data: "Data kampung",
  operasional: "Operasional",
  sistem: "Sistem",
};

const roleLabels: Record<UserRole, string> = {
  warga: "Warga",
  petugas: "Petugas Lapangan",
  admin: "Admin Kampung",
  super_admin: "Super Admin",
};

export function Sidebar({ user, onLogout, onRoleSwitch }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const filteredMenuItems = menuItems.filter((item) => item.roles.includes(user.role));
  const groups = (["utama", "data", "operasional", "sistem"] as const).filter((group) =>
    filteredMenuItems.some((item) => item.group === group),
  );

  return (
    <aside
      className={cn(
        "relative hidden h-screen shrink-0 flex-col overflow-hidden border-r border-emerald-950/10 bg-[#102a22] text-white shadow-[12px_0_40px_rgba(15,42,34,.08)] transition-[width] duration-300 lg:flex",
        collapsed ? "w-[84px]" : "w-[284px]",
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_25%_0%,rgba(52,211,153,.18),transparent_58%)]" />

      <div className={cn("relative flex h-[82px] items-center border-b border-white/10", collapsed ? "justify-center px-3" : "px-5")}>
        <Link href="/dashboard" className="flex min-w-0 items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white p-1.5 shadow-lg shadow-black/15">
            <Image src={appPath("/kampungdigital-mark.svg")} alt="Logo KampungDigital" width={44} height={44} priority className="h-full w-full object-contain" />
          </span>
          {!collapsed && (
            <span className="min-w-0">
              <span className="block text-[17px] font-bold tracking-[-0.02em]">KampungDigital</span>
              <span className="mt-0.5 block text-[11px] font-medium uppercase tracking-[0.16em] text-emerald-200/70">Ruang kerja warga</span>
            </span>
          )}
        </Link>
      </div>

      <div className={cn("relative border-b border-white/10", collapsed ? "px-3 py-4" : "p-4")}>
        <div className={cn("rounded-2xl border border-white/10 bg-white/[0.065]", collapsed ? "flex justify-center p-2" : "p-3.5")}>
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-300 font-bold text-emerald-950 shadow-inner">
              {user.nama?.charAt(0).toUpperCase() || "A"}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-sm font-semibold leading-4">{user.nama}</p>
                <p className="mt-0.5 truncate text-xs text-emerald-100/60">{roleLabels[user.role]}</p>
              </div>
            )}
          </div>
          {!collapsed && (
            <div className="mt-3 flex gap-2 border-t border-white/10 pt-3">
              <Button type="button" variant="ghost" size="sm" onClick={onRoleSwitch} className="h-8 flex-1 bg-white/[0.06] text-xs text-emerald-50 hover:bg-white/10 hover:text-white">
                Ganti akun
              </Button>
              <Button type="button" variant="ghost" size="icon" onClick={onLogout} aria-label="Keluar" className="h-8 w-8 bg-white/[0.06] text-emerald-100 hover:bg-rose-400/15 hover:text-rose-200">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <ScrollArea className="relative flex-1">
        <nav className={cn("space-y-5 py-5", collapsed ? "px-3" : "px-4")}>
          {groups.map((group) => (
            <div key={group}>
              {!collapsed && <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-100/40">{groupLabels[group]}</p>}
              <div className="space-y-1">
                {filteredMenuItems.filter((item) => item.group === group).map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));
                  return (
                    <Link key={item.href} href={item.href} title={collapsed ? item.title : undefined} className={cn("group flex items-center rounded-xl transition-all", collapsed ? "justify-center px-2 py-3" : "gap-3 px-3 py-2.5", isActive ? "bg-emerald-300 text-emerald-950 shadow-[0_8px_24px_rgba(52,211,153,.18)]" : "text-emerald-50/72 hover:bg-white/[0.07] hover:text-white")}>
                      <Icon className={cn("h-[18px] w-[18px] shrink-0", isActive ? "text-emerald-950" : "text-emerald-200/65 group-hover:text-emerald-200")} />
                      {!collapsed && (
                        <span className="min-w-0 flex-1">
                          <span className="block text-[13px] font-semibold leading-4">{item.title}</span>
                          <span className={cn("mt-0.5 block truncate text-[10px]", isActive ? "text-emerald-950/65" : "text-emerald-100/40")}>{item.description}</span>
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>

      <div className={cn("relative border-t border-white/10", collapsed ? "p-3" : "p-4")}>
        {!collapsed && (
          <div className="mb-3 flex items-center gap-2 rounded-xl bg-amber-300/10 px-3 py-2.5 text-[11px] leading-4 text-amber-100/75">
            <Sparkles className="h-4 w-4 shrink-0 text-amber-300" />
            Data rapi, pelayanan warga lebih cepat.
          </div>
        )}
        <Button type="button" variant="ghost" onClick={() => setCollapsed((value) => !value)} className={cn("h-9 text-emerald-100/60 hover:bg-white/[0.07] hover:text-white", collapsed ? "w-full px-0" : "w-full justify-between px-3")}>
          {!collapsed && <span className="text-xs">Ringkas menu</span>}
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
    </aside>
  );
}
