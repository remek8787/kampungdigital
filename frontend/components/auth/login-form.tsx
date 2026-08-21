"use client";

import type React from "react";
import Image from "next/image";
import { appPath } from "@/lib/paths";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authenticateUser } from "@/lib/auth";
import type { User } from "@/types/auth";
import { Eye, EyeOff, Loader2, Phone, UserIcon } from "lucide-react";

interface LoginFormProps {
  onLogin: (user: User) => void;
}

const themeColors: Record<string, string> = {
  green: "#4caf50",
  blue: "#2196f3",
  purple: "#9c27b0",
};

export function LoginForm({ onLogin }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPhonePassword, setShowPhonePassword] = useState(false);
  const [showUsernamePassword, setShowUsernamePassword] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<string>("green");

  const [phoneLogin, setPhoneLogin] = useState({
    nomorHp: "",
    password: "",
  });

  const [usernameLogin, setUsernameLogin] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    // Load tema global dari localStorage berdasarkan user terakhir (jika ada)
    // Ini opsional untuk login form, hanya untuk konsistensi visual
    const savedUser = localStorage.getItem("currentUser");
    let savedTheme = "green";

    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        const globalUserId = parsedUser.id_warga || parsedUser.id;
        const userThemeKey = `appTheme_global_${globalUserId}`;
        savedTheme = localStorage.getItem(userThemeKey) || "green";
      } catch (e) {
        console.error("Error loading user theme:", e);
      }
    }

    const validTheme =
      savedTheme && themeColors[savedTheme] ? savedTheme : "green";
    setCurrentTheme(validTheme);
  }, []);

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const user = await authenticateUser(
        phoneLogin.nomorHp,
        phoneLogin.password,
        "phone",
      );
      if (user) {
        onLogin(user);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Terjadi kesalahan saat login");
      }
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUsernameLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const user = await authenticateUser(
        usernameLogin.username,
        usernameLogin.password,
        "username",
      );
      if (user) {
        onLogin(user);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Terjadi kesalahan saat login");
      }
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const themeColor = themeColors[currentTheme] || themeColors.green;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f4fbf7] p-4 sm:p-6 lg:p-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(16,185,129,.18),transparent_30%),radial-gradient(circle_at_88%_88%,rgba(245,158,11,.16),transparent_28%)]" />
      <div className="relative mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.12fr_.88fr]">
        <section className="hidden lg:block">
          <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-sm font-medium text-emerald-900 shadow-sm backdrop-blur">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Ruang kerja digital untuk kampung yang rapi
          </div>
          <h1 className="max-w-xl text-5xl font-bold leading-[1.06] tracking-tight text-slate-900">Gotong royong lebih mudah ketika data kampung tertata.</h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600">Kelola warga, rumah, iuran, ronda, barcode, dan laporan dalam satu aplikasi yang dekat dengan cara kerja pengurus sehari-hari.</p>
          <div className="mt-8 grid max-w-lg grid-cols-3 gap-3 text-sm text-slate-700">
            {['Transparan', 'Mobile-first', 'Berbasis peran'].map((item) => <div key={item} className="rounded-2xl border border-white bg-white/75 px-4 py-3 shadow-sm">{item}</div>)}
          </div>
        </section>
        <Card className="w-full max-w-md justify-self-center border-white/80 bg-white/90 shadow-[0_24px_80px_rgba(15,118,110,.16)] backdrop-blur-xl">
        <CardHeader className="pb-3 text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-emerald-50 p-2 shadow-inner">
            <Image
              src={appPath("/kampungdigital-mark.svg")}
              alt="Logo KampungDigital"
              width={100}
              height={100}
              priority
              className="h-full w-full object-contain"
            />
          </div>
          <CardTitle className="mt-4 text-2xl font-bold tracking-tight text-slate-900">Selamat datang di KampungDigital</CardTitle>
          <CardDescription className="text-sm leading-6">Masuk sesuai peran untuk melanjutkan pekerjaan kampung.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="warga" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="warga" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Warga
              </TabsTrigger>
              <TabsTrigger value="petugas" className="flex items-center gap-2">
                <UserIcon className="h-4 w-4" />
                Petugas/Admin
              </TabsTrigger>
            </TabsList>

            <TabsContent value="warga">
              <form onSubmit={handlePhoneLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Nomor HP</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Contoh: 081234567890"
                    value={phoneLogin.nomorHp}
                    onChange={(e) =>
                      setPhoneLogin((prev) => ({
                        ...prev,
                        nomorHp: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="phone-password"
                      type={showPhonePassword ? "text" : "password"}
                      placeholder="Masukkan password"
                      value={phoneLogin.password}
                      onChange={(e) =>
                        setPhoneLogin((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPhonePassword(!showPhonePassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPhonePassword ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                  style={{ backgroundColor: themeColor }}
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Masuk sebagai Warga
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="petugas">
              <form onSubmit={handleUsernameLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Masukkan username"
                    value={usernameLogin.username}
                    onChange={(e) =>
                      setUsernameLogin((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="username-password"
                      type={showUsernamePassword ? "text" : "password"}
                      placeholder="Masukkan password"
                      value={usernameLogin.password}
                      onChange={(e) =>
                        setUsernameLogin((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowUsernamePassword(!showUsernamePassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showUsernamePassword ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                  style={{ backgroundColor: themeColor }}
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Masuk sebagai Petugas/Admin
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
