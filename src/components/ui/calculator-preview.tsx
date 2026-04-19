"use client";

import { motion } from "framer-motion";

export function CalculatorPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.8 }}
      className="mt-20 relative mx-auto max-w-4xl"
    >
      <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-brand-600/20 via-brand-400/20 to-brand-600/20 blur-xl animate-pulse-glow" />
      <div className="relative rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-2xl overflow-hidden">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-3 w-3 rounded-full bg-red-400" />
          <div className="h-3 w-3 rounded-full bg-yellow-400" />
          <div className="h-3 w-3 rounded-full bg-green-400" />
          <span className="ml-3 text-xs text-[var(--text-muted)] font-mono">maceng / dimensionamento</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl bg-[var(--bg-secondary)] p-4">
            <div className="text-xs text-[var(--text-muted)] mb-2 font-medium uppercase tracking-wider">Entrada</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Força (F)</span>
                <span className="font-mono text-brand-600 font-semibold">12.5 kN</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Área (A)</span>
                <span className="font-mono text-brand-600 font-semibold">50 mm²</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Material</span>
                <span className="font-mono text-brand-600 font-semibold">AISI 1045</span>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-[var(--bg-secondary)] p-4 flex items-center justify-center">
            <div className="text-center">
              <div className="text-xs text-[var(--text-muted)] mb-2 font-medium uppercase tracking-wider">Fórmula</div>
              <div className="text-xl font-mono font-bold text-[var(--text-primary)]">
                &sigma; = F / A
              </div>
              <div className="text-xs text-[var(--text-muted)] mt-2">Tensão Normal (MPa)</div>
            </div>
          </div>
          <div className="rounded-xl bg-brand-600/10 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-800 p-4">
            <div className="text-xs text-brand-600 dark:text-brand-400 mb-2 font-medium uppercase tracking-wider">Resultado</div>
            <div className="text-3xl font-bold text-brand-600 font-mono">250</div>
            <div className="text-sm text-brand-600/70 dark:text-brand-400/70">MPa</div>
            <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-green-100 dark:bg-green-900/30 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
              ✓ Dentro do limite
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
