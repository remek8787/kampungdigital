import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Building2,
  Check,
  ChevronRight,
  ClipboardCheck,
  FileText,
  Github,
  HeartHandshake,
  Landmark,
  Menu,
  QrCode,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Users,
  UserRoundCheck,
} from "lucide-react";
import { appPath } from "@/lib/paths";

const features = [
  {
    icon: Building2,
    title: "Data rumah & keluarga",
    description: "Susun rumah, kepala keluarga, alamat, RT/RW, dan barcode dalam data yang mudah dicari.",
    number: "01",
  },
  {
    icon: Users,
    title: "Administrasi warga",
    description: "Kelola identitas dan status warga secara terstruktur tanpa kembali ke catatan yang terpencar.",
    number: "02",
  },
  {
    icon: Landmark,
    title: "Iuran & dana kampung",
    description: "Pisahkan jenis dana, catat transaksi, dan pantau warga yang sudah atau belum membayar.",
    number: "03",
  },
  {
    icon: QrCode,
    title: "Pencatatan lewat barcode",
    description: "Petugas dapat mengenali rumah lebih cepat saat penarikan dana dan aktivitas lapangan.",
    number: "04",
  },
  {
    icon: ClipboardCheck,
    title: "Ronda & kehadiran",
    description: "Atur kelompok ronda dan dokumentasikan kehadiran agar jadwal keamanan lebih tertib.",
    number: "05",
  },
  {
    icon: BarChart3,
    title: "Laporan yang siap dibaca",
    description: "Ringkas transaksi dan partisipasi menjadi laporan yang lebih mudah dipahami serta dibagikan.",
    number: "06",
  },
];

const roles = [
  {
    icon: Smartphone,
    label: "Untuk warga",
    title: "Informasi keluarga lebih dekat.",
    description: "Warga dapat melihat status dan riwayat pembayaran keluarga melalui ruang aksesnya sendiri.",
    points: ["Status pembayaran", "Riwayat transaksi keluarga", "Akses ramah ponsel"],
  },
  {
    icon: UserRoundCheck,
    label: "Untuk pengurus",
    title: "Pekerjaan harian lebih terkendali.",
    description: "Admin dan petugas mendapat alat operasional untuk data, iuran, ronda, serta pelaporan.",
    points: ["Hak akses berbasis peran", "Pencarian lintas data", "Dashboard operasional"],
  },
];

const steps = [
  ["01", "Susun data dasar", "Masukkan rumah, warga, petugas, kelompok ronda, dan jenis dana yang dikelola."],
  ["02", "Jalankan operasional", "Catat transaksi, pindai barcode, dan dokumentasikan kehadiran petugas."],
  ["03", "Pantau dan bagikan", "Gunakan dashboard serta laporan untuk melihat progres dan transparansi kampung."],
];

export default function ShowcasePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f5f8f6] text-[#14251f]">
      <header className="absolute inset-x-0 top-0 z-30">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <Link href="/" className="flex items-center gap-3" aria-label="KampungDigital">
            <Image src={appPath("/kampungdigital-mark.svg")} alt="" width={44} height={44} priority className="h-11 w-11 rounded-xl bg-white p-1 shadow-sm" />
            <span className="text-[17px] font-bold tracking-[-0.03em] text-white">KampungDigital</span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-medium text-emerald-50/80 md:flex" aria-label="Navigasi utama">
            <a href="#fitur" className="transition-colors hover:text-white">Fitur</a>
            <a href="#tampilan" className="transition-colors hover:text-white">Tampilan</a>
            <a href="#cara-kerja" className="transition-colors hover:text-white">Cara kerja</a>
            <a href="#tentang" className="transition-colors hover:text-white">Tentang</a>
          </nav>
          <Link href="/login" className="hidden h-11 items-center rounded-xl border border-white/20 bg-white/10 px-4 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20 sm:inline-flex">
            Masuk aplikasi <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <a href="#fitur" className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white sm:hidden" aria-label="Lihat fitur"><Menu className="h-5 w-5" /></a>
        </div>
      </header>

      <section className="showcase-grid relative bg-[#0f3329] pb-20 pt-32 text-white sm:pb-24 sm:pt-36 lg:min-h-[790px] lg:pb-28 lg:pt-40">
        <div className="pointer-events-none absolute -left-32 top-24 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-amber-300/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[.92fr_1.08fr] lg:px-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/20 bg-white/[0.07] px-3.5 py-2 text-xs font-medium text-emerald-50">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" /> Sistem tata kelola warga yang terbuka untuk kebaikan bersama
            </div>
            <h1 className="mt-7 max-w-2xl text-[42px] font-bold leading-[1.04] tracking-[-0.055em] sm:text-6xl lg:text-[68px]">
              Kampung tertata, <span className="text-emerald-300">gotong royong</span> tetap terasa.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-emerald-50/78 sm:text-lg sm:leading-8">
              KampungDigital membantu RT/RW dan komunitas mengelola warga, rumah, iuran, ronda, barcode, serta laporan dalam satu ruang kerja yang sederhana dan transparan.
            </p>
            <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
              <Link href="/login" className="inline-flex h-12 items-center justify-center rounded-xl bg-emerald-300 px-5 text-sm font-bold text-emerald-950 shadow-[0_12px_32px_rgba(52,211,153,.18)] transition hover:-translate-y-0.5 hover:bg-emerald-200">
                Masuk aplikasi <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <a href="#tampilan" className="inline-flex h-12 items-center justify-center rounded-xl border border-white/25 bg-white/[0.08] px-5 text-sm font-semibold text-white transition hover:bg-white/[0.14]">
                Lihat cara kerjanya
              </a>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-xs text-emerald-50/70">
              <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-300" /> Akses berbasis peran</span>
              <span className="flex items-center gap-2"><Smartphone className="h-4 w-4 text-emerald-300" /> Nyaman di ponsel</span>
              <span className="flex items-center gap-2"><HeartHandshake className="h-4 w-4 text-emerald-300" /> Dibuat untuk komunitas</span>
            </div>
          </div>

          <div className="relative lg:translate-x-8">
            <div className="absolute -inset-8 rounded-[40px] bg-emerald-300/10 blur-3xl" />
            <div className="relative overflow-hidden rounded-[24px] border border-white/15 bg-white p-2 shadow-[0_34px_90px_rgba(0,0,0,.34)] sm:rounded-[30px] sm:p-3">
              <div className="flex h-9 items-center gap-1.5 border-b border-slate-100 px-3 sm:h-11">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-300" /><span className="h-2.5 w-2.5 rounded-full bg-amber-300" /><span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
                <span className="ml-3 truncate rounded-md bg-slate-100 px-3 py-1 text-[9px] text-slate-400 sm:text-[10px]">kampungdigital · ruang kerja warga</span>
              </div>
              <Image src={appPath("/showcase-dashboard.png")} alt="Dashboard KampungDigital yang menampilkan ringkasan warga, dana, pembayaran, dan kondisi sistem" width={1440} height={1000} priority className="h-auto w-full rounded-b-[16px]" />
            </div>
            <div className="absolute -bottom-5 -left-3 hidden items-center gap-3 rounded-2xl border border-white/70 bg-white px-4 py-3 text-slate-800 shadow-xl shadow-slate-950/10 sm:flex">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><BarChart3 className="h-5 w-5" /></span>
              <span><span className="block text-xs text-slate-400">Satu pandangan</span><span className="block text-sm font-bold">Data yang mudah dipahami</span></span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200/70 bg-white py-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-5 gap-y-3 px-5 text-center text-xs font-medium text-slate-600 sm:gap-x-8 sm:px-8 lg:justify-between lg:px-10">
          <span>Warga & keluarga</span><span className="hidden h-1 w-1 rounded-full bg-emerald-400 lg:block" /><span>Iuran & kas</span><span className="hidden h-1 w-1 rounded-full bg-emerald-400 lg:block" /><span>Ronda & absensi</span><span className="hidden h-1 w-1 rounded-full bg-emerald-400 lg:block" /><span>Barcode rumah</span><span className="hidden h-1 w-1 rounded-full bg-emerald-400 lg:block" /><span>Laporan transparan</span>
        </div>
      </section>

      <section id="fitur" className="py-16 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="grid gap-6 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
            <div>
              <p className="showcase-kicker">Satu sistem, banyak pekerjaan</p>
              <h2 className="mt-4 max-w-xl text-3xl font-bold tracking-[-0.045em] text-slate-900 sm:text-5xl">Dari pendataan sampai pertanggungjawaban.</h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-slate-600 lg:justify-self-end">Setiap modul dirancang saling terhubung agar pengurus tidak perlu mengulang pencatatan dan warga memperoleh informasi yang lebih jelas.</p>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden rounded-[28px] border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <article key={feature.title} className="group relative min-h-[250px] bg-white p-6 transition-colors hover:bg-emerald-50/45 sm:p-7">
                <div className="flex items-start justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 transition group-hover:bg-emerald-100"><feature.icon className="h-5 w-5" /></span>
                  <span className="font-mono text-xs text-slate-300">{feature.number}</span>
                </div>
                <h3 className="mt-8 text-lg font-bold tracking-tight text-slate-900">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">{feature.description}</p>
                <ChevronRight className="absolute bottom-6 right-6 h-4 w-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-emerald-600" />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="tampilan" className="bg-[#e8f1ec] py-16 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[1.15fr_.85fr] lg:items-center lg:px-10">
          <div className="relative">
            <div className="overflow-hidden rounded-[28px] border border-white bg-white p-2 shadow-[0_24px_70px_rgba(15,51,41,.13)] sm:p-3">
              <Image src={appPath("/showcase-dashboard-detail.png")} alt="Detail antarmuka pusat kendali KampungDigital" width={1130} height={735} className="h-auto w-full rounded-[20px]" />
            </div>
            <div className="absolute -bottom-5 right-4 rounded-2xl border border-white bg-[#143a2f] px-4 py-3 text-white shadow-xl sm:right-8"><p className="text-[10px] uppercase tracking-[.15em] text-emerald-300">Fokus operasional</p><p className="mt-1 text-sm font-bold">Ringkas, jelas, siap ditindaklanjuti</p></div>
          </div>
          <div>
            <p className="showcase-kicker">Ruang kerja yang manusiawi</p>
            <h2 className="mt-4 text-3xl font-bold tracking-[-0.045em] text-slate-900 sm:text-5xl">Informasi penting tidak lagi tenggelam.</h2>
            <p className="mt-5 text-base leading-7 text-slate-700">Dashboard merangkum kondisi warga, pembayaran, transaksi, dan layanan sistem. Navigasi dikelompokkan sesuai pekerjaan, bukan sekadar daftar menu panjang.</p>
            <div className="mt-7 space-y-4">
              {["Ringkasan operasional dalam satu layar", "Pencarian cepat untuk warga, rumah, dan transaksi", "Tampilan responsif untuk pengurus di lapangan"].map((item) => <div key={item} className="flex items-start gap-3 text-sm font-medium text-slate-700"><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white"><Check className="h-3 w-3" /></span>{item}</div>)}
            </div>
            <Link href="/login" className="mt-8 inline-flex min-h-11 items-center rounded-xl px-1 text-sm font-bold text-emerald-800 hover:text-emerald-600">Masuk ke ruang kerja <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <p className="showcase-kicker">Dua sisi, satu tujuan</p>
            <h2 className="mt-4 text-3xl font-bold tracking-[-0.045em] text-slate-900 sm:text-5xl">Warga memahami, pengurus mengendalikan.</h2>
          </div>
          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {roles.map((role, index) => (
              <article key={role.label} className={`relative overflow-hidden rounded-[28px] p-7 sm:p-9 ${index === 0 ? "bg-white shadow-[0_12px_40px_rgba(15,42,34,.06)]" : "bg-[#143a2f] text-white"}`}>
                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${index === 0 ? "bg-emerald-50 text-emerald-700" : "bg-white/10 text-emerald-300"}`}><role.icon className="h-5 w-5" /></span>
                <p className={`mt-7 text-xs font-bold uppercase tracking-[.17em] ${index === 0 ? "text-emerald-700" : "text-emerald-300"}`}>{role.label}</p>
                <h3 className="mt-3 text-2xl font-bold tracking-[-0.035em] sm:text-3xl">{role.title}</h3>
                <p className={`mt-4 max-w-xl text-sm leading-7 ${index === 0 ? "text-slate-500" : "text-emerald-50/70"}`}>{role.description}</p>
                <ul className="mt-7 grid gap-3 sm:grid-cols-3">
                  {role.points.map((point) => <li key={point} className={`rounded-xl px-3 py-3 text-xs font-medium ${index === 0 ? "bg-slate-50 text-slate-600" : "border border-white/10 bg-white/[0.1] text-white"}`}>{point}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="cara-kerja" className="border-y border-slate-200/70 bg-white py-16 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[.7fr_1.3fr]">
            <div>
              <p className="showcase-kicker">Cara kerja</p>
              <h2 className="mt-4 text-3xl font-bold tracking-[-0.045em] text-slate-900 sm:text-5xl">Mulai sederhana, tumbuh bersama.</h2>
              <p className="mt-5 text-sm leading-7 text-slate-500">KampungDigital tidak memaksa proses yang rumit. Data dasar disiapkan sekali, lalu dipakai untuk operasional sehari-hari.</p>
            </div>
            <div className="divide-y divide-slate-200 border-y border-slate-200">
              {steps.map(([number, title, description]) => (
                <div key={number} className="grid gap-3 py-7 sm:grid-cols-[70px_200px_1fr] sm:items-start">
                  <span className="font-mono text-xs font-bold text-emerald-700">{number}</span>
                  <h3 className="font-bold text-slate-900">{title}</h3>
                  <p className="text-sm leading-6 text-slate-500">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="tentang" className="relative overflow-hidden bg-[#102b23] py-16 text-white sm:py-28">
        <div className="pointer-events-none absolute inset-0 showcase-grid opacity-60" />
        <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-300 text-emerald-950"><HeartHandshake className="h-6 w-6" /></span>
          <p className="mt-7 text-xs font-bold uppercase tracking-[.2em] text-emerald-300">Teknologi yang berpihak pada komunitas</p>
          <h2 className="mt-5 text-3xl font-bold tracking-[-0.045em] sm:text-5xl">Dibuka untuk dipakai, dipelajari, dan dikembangkan bersama.</h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-emerald-50/72">KampungDigital dikembangkan sebagai proyek independen berbasis perangkat lunak sumber terbuka. Tujuannya sederhana: membantu administrasi lingkungan menjadi lebih tertib tanpa menghilangkan semangat gotong royong.</p>

          <div className="mx-auto mt-9 grid max-w-3xl gap-3 text-left sm:grid-cols-[1fr_auto_1fr] sm:items-stretch">
            <a href="https://github.com/heri99123/nalarin-dapung" target="_blank" rel="noreferrer" className="group rounded-2xl border border-white/15 bg-white/[0.07] p-4 transition hover:bg-white/[0.12]">
              <span className="flex items-center justify-between gap-3"><span className="text-[10px] font-bold uppercase tracking-[.16em] text-emerald-300">Fondasi proyek asal</span><Github className="h-4 w-4 text-emerald-200/70" /></span>
              <strong className="mt-2 block text-sm text-white">heri99123/nalarin-dapung</strong>
              <span className="mt-1 block text-xs leading-5 text-emerald-50/60">Sumber open-source yang menjadi awal perjalanan pengembangan.</span>
            </a>
            <span className="hidden items-center justify-center text-emerald-300/60 sm:flex"><ArrowRight className="h-5 w-5" /></span>
            <a href="https://github.com/remek8787/kampungdigital" target="_blank" rel="noreferrer" className="group rounded-2xl border border-emerald-300/25 bg-emerald-300/[0.09] p-4 transition hover:bg-emerald-300/[0.14]">
              <span className="flex items-center justify-between gap-3"><span className="text-[10px] font-bold uppercase tracking-[.16em] text-emerald-300">Adaptasi independen</span><Github className="h-4 w-4 text-emerald-200/70" /></span>
              <strong className="mt-2 block text-sm text-white">remek8787/kampungdigital</strong>
              <span className="mt-1 block text-xs leading-5 text-emerald-50/60">Rebranding, hardening, UI/UX, dokumentasi, dan deployment tersendiri.</span>
            </a>
          </div>

          <p className="mx-auto mt-4 max-w-2xl text-xs leading-5 text-emerald-50/55">Terima kasih kepada Heri Tico dan proyek Nalarin DaPUNG yang telah membuka fondasinya melalui lisensi MIT.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/login" className="inline-flex h-12 items-center rounded-xl bg-emerald-300 px-5 text-sm font-bold text-emerald-950 hover:bg-emerald-200">Masuk aplikasi <ArrowRight className="ml-2 h-4 w-4" /></Link>
            <a href="https://github.com/remek8787/kampungdigital" target="_blank" rel="noreferrer" className="inline-flex h-12 items-center rounded-xl border border-white/20 bg-white/[0.07] px-5 text-sm font-semibold text-white hover:bg-white/[0.12]"><Github className="mr-2 h-4 w-4" /> Source KampungDigital</a>
          </div>
        </div>
      </section>

      <footer className="bg-[#0b211b] py-8 text-emerald-50/60">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 text-xs sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
          <div className="flex items-center gap-3"><Image src={appPath("/kampungdigital-mark.svg")} alt="" width={36} height={36} className="h-9 w-9 rounded-lg bg-white p-1" /><span><strong className="block text-sm text-white">KampungDigital</strong><span>Administrasi kampung yang lebih tertata.</span></span></div>
          <div className="flex flex-wrap gap-x-5 gap-y-2"><a href="#fitur" className="hover:text-white">Fitur</a><a href="#cara-kerja" className="hover:text-white">Cara kerja</a><Link href="/login" className="hover:text-white">Masuk</Link><a href="https://github.com/heri99123/nalarin-dapung" target="_blank" rel="noreferrer" className="hover:text-white">Proyek asal</a><span>Lisensi MIT</span></div>
          <p className="flex items-center gap-2"><FileText className="h-3.5 w-3.5" /> © 2026 Heri Tico · Adaptasi independen KampungDigital</p>
        </div>
      </footer>
    </main>
  );
}
