"use client";

import { useRouter } from "next/navigation";
import { Calculator, Cog, CreditCard, Gauge } from "lucide-react";
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
    <div className="mx-auto w-full max-w-7xl p-6 space-y-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
            Bem-vindo de volta
          </p>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Olá, {displayName}
          </h1>
        </div>
        <SignOutButton onSignOut={handleSignOut} />
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 shadow-sm">
              <CreditCard className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Plano</p>
              <p className="text-base font-semibold text-[var(--text-primary)]">
                Plano: {PLAN_LABEL[user.plan]}
              </p>
            </div>
          </div>
          <p className="mt-2 text-xs text-[var(--text-muted)]">{PLAN_LIMIT[user.plan]}</p>
        </div>

        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-sm">
              <Calculator className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Cálculos usados</p>
              <p className="text-2xl font-bold text-[var(--text-primary)] leading-tight">
                {user.calculationsUsed}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 to-purple-600 shadow-sm">
              <Gauge className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Status</p>
              <p className="text-base font-semibold text-[var(--text-primary)]">Ativo</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="space-y-3">
          <h2 className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-color)] bg-[var(--bg-tertiary)] px-3 py-1 text-xs font-medium text-[var(--text-secondary)]">
            <Cog className="h-3.5 w-3.5 text-brand-500" aria-hidden="true" />
            Engenharia Mecânica
          </h2>
          <div>
            <p className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
              Calculadora Técnica
            </p>
            <p className="mt-2 max-w-2xl text-sm text-[var(--text-muted)]">
              15 categorias com fórmulas reais, tabelas normativas e referências
              ABNT · ISO · DIN · NBR.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {MECHANICAL_MODULES.map((m) => (
            <ModuleCard key={m.slug} module={m} />
          ))}
        </div>
      </section>
    </div>
  );
}
