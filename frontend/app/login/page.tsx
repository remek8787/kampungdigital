"use client";

import { LoginForm } from "@/components/auth/login-form";
import type { User } from "@/types/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (loggedInUser: User) => {
    localStorage.setItem("currentUser", JSON.stringify(loggedInUser));
    router.push("/dashboard");
  };

  return <LoginForm onLogin={handleLogin} />;
}
