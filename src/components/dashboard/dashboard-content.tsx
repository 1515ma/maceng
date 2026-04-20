"use client";

import { useRouter } from "next/navigation";
import { Calculator, CreditCard, Gauge } from "lucide-react";
import type { User } from "@/core/entities/user";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { ModuleCard } from "@/components/dashboard/module-card";
import { MECHANICAL_MODULES } from "@/core/data/mechanical-modules";
import { createSupabaseBrowserClient } from "@/infra/database/supabase-client";

interface DashboardContentProps {
  user: User;
}

const PLAN_LABEL: Record<User["plan"], string> = {
  free: "Gratuito",
  pro: "Pro",
  max: "Max",
};

const PLAN_LIMIT: Record<User["plan"], string> = {
  free: "5 cálculos / dia",
  pro: "800 cálculos / mês",
  max: "1.600 cálculos / mês",
};

export function DashboardContent({ user }: DashboardContentProps) {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const displayName = user.name ?? user.email;

  return (
    <div className="w-full max-w-5xl mx-auto p-6 space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm text-[var(--text-muted)]">Bem-vindo de volta</p>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Olá, {displayName}
          </h1>
        </div>
        <SignOutButton onSignOut={handleSignOut} />
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-lg bg-brand-100 dark:bg-brand-900/20 p-2">
              <CreditCard className="h-5 w-5 text-brand-600" />
            </div>
            <p className="text-sm text-[var(--text-muted)]">Plano</p>
          </div>
          <p className="text-lg font-semibold text-[var(--text-primary)]">
            Plano: {PLAN_LABEL[user.plan]}
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1">{PLAN_LIMIT[user.plan]}</p>
        </div>

        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-lg bg-brand-100 dark:bg-brand-900/20 p-2">
              <Calculator className="h-5 w-5 text-brand-600" />
            </div>
            <p className="text-sm text-[var(--text-muted)]">Cálculos usados</p>
          </div>
          <p className="text-3xl font-bold text-[var(--text-primary)]">{user.calculationsUsed}</p>
        </div>

        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-lg bg-brand-100 dark:bg-brand-900/20 p-2">
              <Gauge className="h-5 w-5 text-brand-600" />
            </div>
            <p className="text-sm text-[var(--text-muted)]">Status</p>
          </div>
          <p className="text-lg font-semibold text-[var(--text-primary)]">Ativo</p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">
              Engenharia Mecânica
            </h2>
            <p className="text-sm text-[var(--text-muted)]">
              15 módulos organizados por área. Clique para abrir um módulo.
            </p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MECHANICAL_MODULES.map((m) => (
            <ModuleCard key={m.slug} module={m} />
          ))}
        </div>
      </section>
    </div>
  );
}
