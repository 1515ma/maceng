import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Calculator } from "lucide-react";
import { createSupabaseServerClient } from "@/infra/database/supabase-server";
import { SupabaseAuthProvider } from "@/infra/services/supabase-auth-provider";
import {
  MECHANICAL_MODULES,
  findMechanicalModuleBySlug,
} from "@/core/data/mechanical-modules";

export const metadata: Metadata = {
  title: "Módulo | Maceng",
  description: "Módulo de engenharia mecânica.",
};

// Pré-renderiza os 15 slugs conhecidos (performance: reduz cold start).
export function generateStaticParams() {
  return MECHANICAL_MODULES.map((m) => ({ slug: m.slug }));
}

interface ModulePageProps {
  params: Promise<{ slug: string }>;
}

export default async function ModuleDetailPage({ params }: ModulePageProps) {
  const { slug } = await params;
  const module = findMechanicalModuleBySlug(slug);
  if (!module) {
    notFound();
  }

  // Zero trust: valida sessão antes de expor conteúdo mesmo em placeholder.
  const supabase = await createSupabaseServerClient();
  const authProvider = new SupabaseAuthProvider(supabase);
  const user = await authProvider.getUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-6 space-y-6">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-brand-600"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Voltar ao dashboard
      </Link>

      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
          Engenharia Mecânica
        </p>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">{module.name}</h1>
        <p className="text-[var(--text-muted)]">{module.description}</p>
      </header>

      <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-brand-100 dark:bg-brand-900/20 p-2">
            <Calculator className="h-5 w-5 text-brand-600" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            Calculadoras deste módulo
          </h2>
        </div>
        <ul className="grid gap-2 sm:grid-cols-2">
          {module.calculators.map((c) => (
            <li
              key={c}
              className="flex items-center justify-between rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3"
            >
              <span className="text-sm text-[var(--text-primary)]">{c}</span>
              <span className="rounded-full bg-[var(--bg-tertiary)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                Em breve
              </span>
            </li>
          ))}
        </ul>
        <p className="text-xs text-[var(--text-muted)]">
          Este módulo está em desenvolvimento. Em breve cada calculadora estará disponível
          para uso conforme o seu plano.
        </p>
      </section>
    </div>
  );
}
