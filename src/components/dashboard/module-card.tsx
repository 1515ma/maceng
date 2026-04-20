import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
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

interface ModuleCardProps {
  module: EngineeringModule;
}

export function ModuleCard({ module }: ModuleCardProps) {
  const Icon = ICONS[module.icon] ?? Calculator;
  const isComingSoon = module.status === "coming-soon";

  return (
    <Link
      href={`/dashboard/${module.slug}`}
      className="group relative flex flex-col gap-3 rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 transition-colors hover:border-brand-500/60 hover:bg-[var(--bg-tertiary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      aria-label={module.name}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="rounded-lg bg-brand-100 dark:bg-brand-900/20 p-2">
          <Icon className="h-5 w-5 text-brand-600" aria-hidden="true" />
        </div>
        {isComingSoon && (
          <span className="rounded-full bg-[var(--bg-tertiary)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
            Em breve
          </span>
        )}
      </div>
      <div>
        <h3 className="text-base font-semibold text-[var(--text-primary)] group-hover:text-brand-600">
          {module.name}
        </h3>
        <p className="mt-1 text-sm text-[var(--text-muted)] line-clamp-2">
          {module.description}
        </p>
      </div>
    </Link>
  );
}
