import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  ArrowRightLeft,
  Calculator,
  Cog,
  DollarSign,
  Droplet,
  Flame,
  FlaskConical,
  FolderKanban,
  Gauge,
  Hammer,
  Ruler,
  ShieldCheck,
  Spline,
  Waves,
  Wrench,
  Zap,
} from "lucide-react";
import type { EngineeringModule } from "@/core/entities/module";

// Mapeamento explícito para evitar dynamic import de ícones no cliente
// (melhora bundle size e evita eval — DevSecOps/CSP friendly).
const ICONS: Record<string, LucideIcon> = {
  ArrowRightLeft,
  Cog,
  DollarSign,
  Droplet,
  Flame,
  FlaskConical,
  FolderKanban,
  Gauge,
  Hammer,
  Ruler,
  ShieldCheck,
  Spline,
  Waves,
  Wrench,
  Zap,
};

// Tema visual por slug — mantém o data file puro (sem concerns de UI)
// e concentra a identidade cromática em um único ponto (DRY + Clean Architecture).
interface CardTheme {
  iconBg: string;
  accent: string;
}

const THEMES: Record<string, CardTheme> = {
  "dimensionamento-resistencia": {
    iconBg: "bg-gradient-to-br from-sky-400 to-blue-600",
    accent: "text-blue-500",
  },
  "elementos-fixacao-roscas": {
    iconBg: "bg-gradient-to-br from-orange-400 to-orange-600",
    accent: "text-orange-500",
  },
  "tolerancias-ajustes": {
    iconBg: "bg-gradient-to-br from-emerald-400 to-emerald-600",
    accent: "text-emerald-500",
  },
  "materiais-tratamentos": {
    iconBg: "bg-gradient-to-br from-amber-400 to-yellow-500",
    accent: "text-amber-500",
  },
  "componentes-transmissao": {
    iconBg: "bg-gradient-to-br from-slate-500 to-slate-700",
    accent: "text-slate-500",
  },
  "hidraulica-pneumatica": {
    iconBg: "bg-gradient-to-br from-teal-400 to-cyan-600",
    accent: "text-teal-500",
  },
  "processos-fabricacao": {
    iconBg: "bg-gradient-to-br from-red-400 to-rose-600",
    accent: "text-red-500",
  },
  "motores-redutores": {
    iconBg: "bg-gradient-to-br from-violet-400 to-purple-600",
    accent: "text-violet-500",
  },
  "molas-elementos-elasticos": {
    iconBg: "bg-gradient-to-br from-cyan-400 to-teal-500",
    accent: "text-cyan-500",
  },
  "custos-fabricacao": {
    iconBg: "bg-gradient-to-br from-orange-300 to-orange-500",
    accent: "text-orange-400",
  },
  "ergonomia-seguranca": {
    iconBg: "bg-gradient-to-br from-yellow-400 to-amber-500",
    accent: "text-yellow-500",
  },
  "vedacao-lubrificacao": {
    iconBg: "bg-gradient-to-br from-slate-400 to-slate-600",
    accent: "text-slate-400",
  },
  "soldagem-simbologia": {
    iconBg: "bg-gradient-to-br from-rose-400 to-red-600",
    accent: "text-rose-500",
  },
  "conversor-unidades": {
    iconBg: "bg-gradient-to-br from-indigo-400 to-violet-600",
    accent: "text-indigo-500",
  },
  "gestao-arquivos": {
    iconBg: "bg-gradient-to-br from-zinc-500 to-zinc-700",
    accent: "text-zinc-500",
  },
};

const DEFAULT_THEME: CardTheme = {
  iconBg: "bg-gradient-to-br from-brand-400 to-brand-600",
  accent: "text-brand-500",
};

interface ModuleCardProps {
  module: EngineeringModule;
}

export function ModuleCard({ module }: ModuleCardProps) {
  const Icon = ICONS[module.icon] ?? Calculator;
  const theme = THEMES[module.slug] ?? DEFAULT_THEME;
  const isComingSoon = module.status === "coming-soon";
  const count = module.calculators.length;

  return (
    <Link
      href={`/dashboard/${module.slug}`}
      aria-label={module.name}
      className="group relative flex h-full flex-col gap-4 rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-500/40 hover:shadow-lg hover:shadow-brand-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${theme.iconBg} shadow-md shadow-black/5`}
        >
          <Icon className="h-5 w-5 text-white" aria-hidden="true" />
        </div>
        {isComingSoon && (
          <span className="rounded-full bg-[var(--bg-tertiary)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
            Em breve
          </span>
        )}
      </div>

      <div className="flex-1 space-y-1.5">
        <h3 className="text-base font-bold text-[var(--text-primary)] leading-snug">
          {module.name}
        </h3>
        <p className="text-sm leading-relaxed text-[var(--text-muted)] line-clamp-2">
          {module.description}
        </p>
      </div>

      <div className="flex items-center justify-between border-t border-[var(--border-color)]/70 pt-3">
        <span className="text-xs font-medium text-[var(--text-muted)]">
          {count} {count === 1 ? "cálculo" : "cálculos"}
        </span>
        <ArrowRight
          className={`h-4 w-4 ${theme.accent} transition-transform duration-200 group-hover:translate-x-1`}
          aria-hidden="true"
        />
      </div>
    </Link>
  );
}
