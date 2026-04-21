import type { Metadata } from "next";
import { Suspense } from "react";
import { Logo } from "@/components/ui/logo";
import { LoginForm } from "@/components/auth/login-form";
import { SupabaseAuthFragmentBanner } from "@/components/auth/supabase-auth-fragment-banner";

export const metadata: Metadata = {
  title: "Entrar | Maceng",
  description: "Faça login na sua conta Maceng para acessar calculadoras de engenharia mecânica.",
};

export default function LoginPage() {
  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-8 shadow-lg">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>

        <h1 className="text-2xl font-bold text-center text-[var(--text-primary)] mb-2">
          Entrar na sua conta
        </h1>
        <p className="text-sm text-center text-[var(--text-muted)] mb-8">
          Acesse suas calculadoras de engenharia mecânica
        </p>

        <Suspense fallback={null}>
          <SupabaseAuthFragmentBanner />
        </Suspense>

        <LoginForm />
      </div>
    </div>
  );
}
