"use client";

import { appPath } from "@/lib/paths";
import { Search, Settings, User, LogOut, Users, UserCheck, Building2, Menu, Landmark, CalendarDays, CircleHelp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api";

interface HeaderProps {
  title: string;
  subtitle?: string;
  onOpenMenu?: () => void;
  userRole?: string;
}

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: "warga" | "petugas" | "rumah" | "transaksi";
  url: string;
}

const roleLabels: Record<string, string> = {
  warga: "Warga",
  petugas: "Petugas",
  admin: "Admin",
  super_admin: "Super Admin",
};

export function Header({ title, subtitle, onOpenMenu, userRole = "warga" }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!searchQuery.trim()) {
        setFilteredResults([]);
        setIsSearching(false);
        return;
      }
      void performSearch(searchQuery.trim());
    }, 280);
    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  const performSearch = async (query: string) => {
    setIsSearching(true);
    const needle = query.toLowerCase();
    try {
      const results: SearchResult[] = [];
      const [wargaRes, petugasRes, rumahRes, transaksiRes] = await Promise.allSettled([
        apiClient.get(`/warga?_t=${Date.now()}`),
        apiClient.get(`/petugas?_t=${Date.now()}`),
        apiClient.get(`/rumah?_t=${Date.now()}`),
        apiClient.get(`/transaksi?_t=${Date.now()}`),
      ]);

      if (wargaRes.status === "fulfilled") {
        const data = wargaRes.value.data as { success?: boolean; data?: Array<Record<string, string>> };
        data.data?.filter((item) => item.namaLengkap?.toLowerCase().includes(needle) || item.nik?.includes(query) || item.nomorHp?.includes(query)).slice(0, 6).forEach((item) => results.push({ id: `w-${item.id}`, title: item.namaLengkap || "Tanpa nama", subtitle: `NIK ${item.nik || "-"} · ${item.nomorHp || "Tanpa nomor HP"}`, type: "warga", url: `/data-warga?highlight=${item.id}` }));
      }
      if (petugasRes.status === "fulfilled") {
        const data = petugasRes.value.data as { data?: Array<Record<string, string>> };
        data.data?.filter((item) => item.namaLengkap?.toLowerCase().includes(needle) || item.username?.toLowerCase().includes(needle)).slice(0, 5).forEach((item) => results.push({ id: `p-${item.id}`, title: item.namaLengkap || item.username || "Tanpa nama", subtitle: `${item.role || "Petugas"} · ${item.username || "-"}`, type: "petugas", url: `/data-petugas?highlight=${item.id}` }));
      }
      if (rumahRes.status === "fulfilled") {
        const data = rumahRes.value.data as { data?: Array<Record<string, string>> };
        data.data?.filter((item) => item.alamat?.toLowerCase().includes(needle) || item.kodeRumah?.toLowerCase().includes(needle)).slice(0, 5).forEach((item) => results.push({ id: `r-${item.id}`, title: item.alamat || "Tanpa alamat", subtitle: `RT ${item.rt || "-"} / RW ${item.rw || "-"} · ${item.kodeRumah || "Tanpa kode"}`, type: "rumah", url: `/data-rumah?highlight=${item.id}` }));
      }
      if (transaksiRes.status === "fulfilled") {
        const data = transaksiRes.value.data as { data?: Array<Record<string, string | number>> };
        data.data?.filter((item) => String(item.namaWarga || "").toLowerCase().includes(needle) || String(item.jenisDana || "").toLowerCase().includes(needle)).slice(0, 5).forEach((item) => results.push({ id: `t-${item.id}`, title: `${item.namaWarga || "Warga"} · ${item.jenisDana || "Dana"}`, subtitle: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(item.nominal || 0)), type: "transaksi", url: `/transaksi-dana?highlight=${item.id}` }));
      }
      setFilteredResults(results);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    window.location.href = appPath("/login");
  };

  const resultIcon = (type: SearchResult["type"]) => {
    if (type === "warga") return Users;
    if (type === "petugas") return UserCheck;
    if (type === "rumah") return Building2;
    return Landmark;
  };

  return (
    <>
      <header className="relative z-20 flex min-h-[76px] shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/85 px-3 backdrop-blur-xl sm:px-5 lg:px-7 xl:px-9">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          <Button variant="ghost" size="icon" className="h-11 w-11 shrink-0 rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm lg:hidden" aria-label="Buka menu" onClick={onOpenMenu}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-lg font-bold tracking-[-0.025em] text-slate-900 sm:text-xl">{title}</h1>
              <span className="hidden rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.12em] text-emerald-700 sm:inline-flex">{roleLabels[userRole] || userRole}</span>
            </div>
            {subtitle && <p className="mt-0.5 line-clamp-2 max-w-[190px] text-[11px] leading-4 text-slate-500 sm:max-w-none sm:text-sm">{subtitle}</p>}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {userRole !== "warga" && (
            <Button variant="outline" onClick={() => setSearchOpen(true)} className="hidden h-10 w-48 justify-start rounded-xl border-slate-200 bg-slate-50/80 px-3 text-sm font-normal text-slate-500 shadow-none hover:bg-white md:flex xl:w-64">
              <Search className="mr-2 h-4 w-4 text-slate-400" />
              Cari data kampung
              <kbd className="ml-auto hidden rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] text-slate-400 xl:inline-flex">⌘K</kbd>
            </Button>
          )}
          {userRole !== "warga" && (
            <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)} className="h-11 w-11 rounded-xl text-slate-600 hover:bg-slate-100 md:hidden" aria-label="Cari data">
              <Search className="h-5 w-5" />
            </Button>
          )}

          <div className="hidden items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50/70 px-3 py-2 text-xs text-emerald-800 sm:flex">
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" /></span>
            Sistem aktif
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-11 w-11 rounded-xl border border-transparent text-slate-600 hover:border-slate-200 hover:bg-white hover:shadow-sm" aria-label="Menu akun">
                <Settings className="h-[18px] w-[18px]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60 rounded-2xl border-slate-200 p-2 shadow-xl shadow-slate-900/10">
              <DropdownMenuLabel className="px-2 py-2">
                <span className="block text-xs font-normal text-slate-400">Ruang kerja</span>
                <span className="mt-0.5 block text-sm font-semibold text-slate-800">{roleLabels[userRole] || userRole}</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="rounded-xl"><Link href="/settings?tab=profile"><User className="mr-2 h-4 w-4" /> Profil saya</Link></DropdownMenuItem>
              <DropdownMenuItem asChild className="rounded-xl"><Link href="/settings"><Settings className="mr-2 h-4 w-4" /> Pengaturan</Link></DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl"><CircleHelp className="mr-2 h-4 w-4" /> Bantuan penggunaan</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="rounded-xl text-rose-600 focus:bg-rose-50 focus:text-rose-700"><LogOut className="mr-2 h-4 w-4" /> Keluar</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="max-h-[82vh] max-w-2xl overflow-hidden rounded-3xl border-0 p-0 shadow-2xl shadow-slate-950/20">
          <DialogHeader className="border-b border-slate-100 px-5 pb-4 pt-5 sm:px-6">
            <DialogTitle className="flex items-center gap-2 text-lg"><Search className="h-5 w-5 text-emerald-600" /> Cari data kampung</DialogTitle>
            <p className="text-sm text-slate-500">Temukan warga, petugas, rumah, atau transaksi tanpa berpindah menu.</p>
          </DialogHeader>
          <div className="px-5 pt-4 sm:px-6">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input placeholder="Ketik nama, NIK, alamat, atau jenis dana..." value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} className="h-12 rounded-xl border-slate-200 bg-slate-50 pl-10 text-sm focus-visible:bg-white" autoFocus />
            </div>
          </div>
          <div className="max-h-[55vh] overflow-y-auto px-5 pb-6 pt-4 sm:px-6">
            {!searchQuery.trim() ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-6 py-10 text-center">
                <CalendarDays className="mx-auto h-8 w-8 text-emerald-600/60" />
                <p className="mt-3 text-sm font-semibold text-slate-700">Pencarian cepat siap digunakan</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">Mulai ketik kata kunci. Hasil dikelompokkan sesuai jenis data.</p>
              </div>
            ) : isSearching ? (
              <div className="flex items-center justify-center gap-3 py-12 text-sm text-slate-500"><span className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" /> Mencari data...</div>
            ) : filteredResults.length === 0 ? (
              <div className="py-12 text-center"><p className="font-semibold text-slate-700">Data tidak ditemukan</p><p className="mt-1 text-sm text-slate-500">Periksa ejaan atau gunakan kata kunci lain.</p></div>
            ) : (
              <div className="space-y-2">
                <p className="mb-3 text-xs font-medium text-slate-400">{filteredResults.length} hasil ditemukan</p>
                {filteredResults.map((result) => {
                  const Icon = resultIcon(result.type);
                  return (
                    <button key={result.id} type="button" onClick={() => { window.location.href = appPath(result.url); setSearchOpen(false); }} className="flex w-full items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3.5 text-left transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md hover:shadow-emerald-950/5">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><Icon className="h-[18px] w-[18px]" /></span>
                      <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-slate-800">{result.title}</span><span className="mt-0.5 block truncate text-xs text-slate-500">{result.subtitle}</span></span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
