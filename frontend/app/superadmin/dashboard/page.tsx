"use client";

import { appPath } from "@/lib/paths";
import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Building2, TrendingUp, UserCog, ShieldCheck, ArrowUpRight, ClipboardCheck, Landmark, BarChart3, Activity, CalendarDays, CircleCheckBig, CircleAlert, Sparkles } from "lucide-react";
import type { User } from "@/types/database";
import { apiClient } from "@/lib/api";

interface SuperAdminStats {
  totalWarga: number;
  totalRumah: number;
  totalPetugas: number;
  totalAdmin: number;
  totalDanaHariIni: number;
  totalDanaBulanIni: number;
  totalDanaTahunIni: number;
  transaksiHariIni: number;
}

interface PaymentStats {
  sudahBayar: number;
  belumBayar: number;
  persenSudahBayar: number;
  persenBelumBayar: number;
}

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 11) return "Selamat pagi";
  if (hour < 15) return "Selamat siang";
  if (hour < 18) return "Selamat sore";
  return "Selamat malam";
};

export default function SuperAdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [stats, setStats] = useState<SuperAdminStats>({ totalWarga: 0, totalRumah: 0, totalPetugas: 0, totalAdmin: 0, totalDanaHariIni: 0, totalDanaBulanIni: 0, totalDanaTahunIni: 0, transaksiHariIni: 0 });
  const [paymentStats, setPaymentStats] = useState<PaymentStats>({ sudahBayar: 0, belumBayar: 0, persenSudahBayar: 0, persenBelumBayar: 0 });

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (!savedUser) return;
    const parsedUser = JSON.parse(savedUser);
    setUser(parsedUser);
    if (parsedUser.role !== "super_admin") window.location.href = appPath("/dashboard");
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || user.role !== "super_admin") return;
      setLoading(true);
      try {
        const [dashboardRes, petugasRes] = await Promise.all([
          apiClient.get(`/dashboard/stats?_t=${Date.now()}`),
          apiClient.get(`/petugas?_t=${Date.now()}`),
        ]);
        const dashboard = (dashboardRes.data || {}) as Record<string, any>;
        const petugas = Array.isArray(petugasRes.data) ? petugasRes.data as Array<Record<string, string>> : [];
        const totalAdmin = petugas.filter((item) => ["admin", "superadmin", "super admin", "super_admin"].includes((item.role || "").toLowerCase())).length;
        setStats({
          totalWarga: dashboard.totalWarga || 0,
          totalRumah: dashboard.totalRumah || 0,
          totalPetugas: Math.max(0, petugas.length - totalAdmin),
          totalAdmin,
          totalDanaHariIni: dashboard.totalDanaHariIni || 0,
          totalDanaBulanIni: dashboard.totalDanaBulanIni || 0,
          totalDanaTahunIni: dashboard.totalDanaTahunIni || dashboard.totalDanaBulanIni || 0,
          transaksiHariIni: dashboard.transaksiHariIni || 0,
        });
        if (dashboard.statistikPembayaran) setPaymentStats(dashboard.statistikPembayaran);
        setLastSync(new Date());
      } finally {
        setLoading(false);
      }
    };
    void fetchData();
    const interval = window.setInterval(() => document.visibilityState === "visible" && void fetchData(), 30000);
    return () => window.clearInterval(interval);
  }, [user]);

  const money = (value: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
  const fullName = (user as any)?.nama || user?.namaLengkap || user?.username || "Super Admin";
  const name = fullName.length > 22 ? "Admin Kampung" : fullName;
  const dateLabel = new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const metrics = [
    { label: "Warga aktif", value: stats.totalWarga.toLocaleString("id-ID"), note: stats.totalWarga ? "Terdaftar dalam sistem" : "Tambahkan data warga pertama", icon: Users, tint: "bg-emerald-50 text-emerald-700", href: "/data-warga" },
    { label: "Rumah terdata", value: stats.totalRumah.toLocaleString("id-ID"), note: stats.totalRumah ? "Bangunan dan keluarga" : "Mulai pendataan rumah", icon: Building2, tint: "bg-teal-50 text-teal-700", href: "/data-rumah" },
    { label: "Tim pengelola", value: (stats.totalPetugas + stats.totalAdmin).toLocaleString("id-ID"), note: `${stats.totalAdmin} admin · ${stats.totalPetugas} petugas`, icon: UserCog, tint: "bg-lime-50 text-lime-700", href: "/data-petugas" },
    { label: "Transaksi hari ini", value: stats.transaksiHariIni.toLocaleString("id-ID"), note: money(stats.totalDanaHariIni), icon: TrendingUp, tint: "bg-emerald-50 text-emerald-700", href: "/transaksi-dana" },
  ];

  return (
    <DashboardLayout title="Pusat Kendali Kampung" subtitle={`${getGreeting()}, ${name}. ${dateLabel}`}>
      <div className="space-y-5 sm:space-y-6">
        <section className="soft-grid relative overflow-hidden rounded-[26px] bg-[#143a2f] p-5 text-white shadow-[0_18px_50px_rgba(15,42,34,.16)] sm:p-6">
          <div className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full bg-emerald-300/12 blur-3xl" />
          <div className="relative grid gap-5 lg:grid-cols-[1.35fr_.65fr] lg:items-end">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200/20 bg-white/[0.08] px-3 py-1.5 text-xs text-emerald-50"><Sparkles className="h-3.5 w-3.5 text-amber-300" /> Semua operasional dalam satu pandangan</div>
              <h2 className="max-w-2xl text-2xl font-bold tracking-[-0.035em] sm:text-[28px] lg:text-[31px] lg:leading-[1.16]">Pantau warga, pelayanan, dan dana kampung dengan lebih tenang.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50/90 sm:text-[15px]">Data utama diringkas untuk membantu pengurus melihat kondisi hari ini dan menentukan pekerjaan berikutnya.</p>
              <div className="mt-5 grid gap-2.5 sm:flex sm:flex-wrap">
                <Button asChild className="h-11 w-full rounded-xl bg-emerald-300 px-4 font-semibold text-emerald-950 hover:bg-emerald-200 sm:h-10 sm:w-auto"><Link href="/transaksi-dana"><Landmark className="mr-2 h-4 w-4" /> Catat transaksi</Link></Button>
                <Button asChild variant="outline" className="h-11 w-full rounded-xl border-white/30 bg-white/[0.12] px-4 text-white hover:bg-white/20 hover:text-white sm:h-10 sm:w-auto"><Link href="/laporan"><BarChart3 className="mr-2 h-4 w-4" /> Buka laporan</Link></Button>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
              <div className="min-w-0 rounded-2xl border border-white/15 bg-white/[0.08] p-4 backdrop-blur"><p className="text-xs font-medium text-emerald-50/85">Dana bulan ini</p><p className="mt-2 break-words text-xl font-bold tracking-[-0.04em] sm:text-2xl lg:text-xl xl:text-2xl">{money(stats.totalDanaBulanIni)}</p><p className="mt-2 text-xs text-emerald-50/80">Terkumpul dari transaksi warga</p></div>
              <div className="min-w-0 rounded-2xl border border-white/15 bg-white/[0.08] p-4 backdrop-blur"><p className="text-xs font-medium text-emerald-50/85">Partisipasi bayar</p><p className="mt-2 text-2xl font-bold tracking-tight">{paymentStats.persenSudahBayar}%</p><p className="mt-2 text-xs text-emerald-50/80">{paymentStats.sudahBayar} warga sudah bayar</p></div>
            </div>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
          {metrics.map((metric) => (
            <Link key={metric.label} href={metric.href} className="workspace-card workspace-card-hover group p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3"><span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${metric.tint}`}><metric.icon className="h-5 w-5" /></span><ArrowUpRight className="h-4 w-4 text-slate-300 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-emerald-600" /></div>
              <p className="mt-5 text-xs font-medium text-slate-500">{metric.label}</p>
              <p className="mt-1 text-2xl font-bold tracking-[-0.04em] text-slate-900 sm:text-3xl">{loading ? "—" : metric.value}</p>
              <p className="mt-2 text-[13px] text-slate-500">{metric.note}</p>
            </Link>
          ))}
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.18fr_.82fr]">
          <div className="workspace-card p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="section-kicker">Pembayaran warga</p><h3 className="mt-1.5 text-lg font-bold tracking-tight text-slate-900">Progres bulan {new Date().toLocaleDateString("id-ID", { month: "long" })}</h3><p className="mt-1 text-sm text-slate-500">Pantau partisipasi dan warga yang masih perlu ditindaklanjuti.</p></div><Badge className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 hover:bg-emerald-50">{paymentStats.persenSudahBayar}% selesai</Badge></div>
            <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-700" style={{ width: `${Math.min(100, paymentStats.persenSudahBayar)}%` }} /></div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-2xl bg-emerald-50/70 p-4"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm"><CircleCheckBig className="h-5 w-5" /></span><div><p className="text-xs text-slate-500">Sudah bayar</p><p className="mt-0.5 text-lg font-bold text-slate-900">{paymentStats.sudahBayar} warga</p></div></div>
              <div className="flex items-center gap-3 rounded-2xl bg-amber-50/70 p-4"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-amber-700 shadow-sm"><CircleAlert className="h-5 w-5" /></span><div><p className="text-xs text-slate-500">Perlu ditindaklanjuti</p><p className="mt-0.5 text-lg font-bold text-slate-900">{paymentStats.belumBayar} warga</p></div></div>
            </div>
          </div>

          <div className="workspace-card p-5 sm:p-6">
            <div className="flex items-center justify-between"><div><p className="section-kicker">Kondisi sistem</p><h3 className="mt-1.5 text-lg font-bold tracking-tight text-slate-900">Layanan siap digunakan</h3></div><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700"><ShieldCheck className="h-5 w-5" /></span></div>
            <div className="mt-5 space-y-3">
              {[{ label: "Database kampung", note: "Terhubung dan merespons", icon: CircleCheckBig, ready: true }, { label: "Layanan API", note: "Online dan terlindungi", icon: Activity, ready: true }, { label: "Sinkronisasi terakhir", note: lastSync ? lastSync.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "Sedang memuat", icon: CalendarDays, ready: Boolean(lastSync) }].map((item) => <div key={item.label} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3"><item.icon className={`h-[18px] w-[18px] ${item.ready ? "text-emerald-600" : "text-amber-500"}`} /><div className="min-w-0 flex-1"><p className="text-sm font-semibold text-slate-700">{item.label}</p><p className="text-xs text-slate-400">{item.note}</p></div><span className={`h-2 w-2 rounded-full ${item.ready ? "bg-emerald-500" : "animate-pulse bg-amber-400"}`} /></div>)}
            </div>
          </div>
        </section>

        <section className="workspace-card overflow-hidden">
          <div className="border-b border-slate-100 px-5 py-4 sm:px-6"><p className="section-kicker">Akses cepat</p><h3 className="mt-1 text-lg font-bold tracking-tight text-slate-900">Pekerjaan yang paling sering dilakukan</h3></div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4">
            {[{ title: "Tambah & kelola warga", desc: "Perbarui data kependudukan", href: "/data-warga", icon: Users }, { title: "Kelola petugas", desc: "Atur pengurus dan hak akses", href: "/data-petugas", icon: UserCog }, { title: "Cek kehadiran ronda", desc: "Pantau absensi petugas", href: "/absensi", icon: ClipboardCheck }, { title: "Susun laporan", desc: "Rekap dana dan aktivitas", href: "/laporan", icon: BarChart3 }].map((action, index) => <Link key={action.href} href={action.href} className={`group flex gap-3 p-5 transition-colors hover:bg-emerald-50/45 sm:p-6 ${index > 0 ? "border-t sm:border-t-0 sm:border-l" : ""} ${index === 2 ? "sm:border-l-0 lg:border-l" : ""}`}><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-colors group-hover:bg-emerald-100 group-hover:text-emerald-700"><action.icon className="h-[18px] w-[18px]" /></span><span><span className="block text-sm font-semibold text-slate-800">{action.title}</span><span className="mt-1 block text-xs leading-5 text-slate-400">{action.desc}</span></span></Link>)}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
