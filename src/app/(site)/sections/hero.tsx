"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react";
import Link from "next/link";
import { CONTAINER_CLASS } from "@/lib/constants";
import { CalculatorPreview } from "@/components/ui/calculator-preview";

const stats = [
  { value: "15", label: "Módulos" },
  { value: "200+", label: "Fórmulas" },
  { value: "ABNT/ISO", label: "Normas" },
];

const badges = [
  { icon: Zap, text: "Cálculos instantâneos" },
  { icon: Shield, text: "Normas reais" },
  { icon: Sparkles, text: "Interface moderna" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--hero-gradient-from)] to-[var(--hero-gradient-to)]" />

      <div className="absolute inset-0 grid-bg opacity-30 dark:opacity-10" />

      <motion.div
        className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-brand-400/20 dark:bg-brand-600/10 blur-3xl"
        animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-brand-300/20 dark:bg-brand-500/10 blur-3xl"
        animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className={`relative z-10 ${CONTAINER_CLASS} py-20`}>
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-8"
          >
            {badges.map((badge, i) => (
              <motion.span
                key={badge.text}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-color)] bg-[var(--card-bg)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] shadow-sm"
              >
                <badge.icon className="h-3.5 w-3.5 text-brand-500" />
                {badge.text}
              </motion.span>
            ))}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight"
          >
            <span className="text-[var(--text-primary)]">Cálculos de</span>
            <br />
            <span className="text-brand-600">Engenharia Mecânica</span>
            <br />
            <span className="text-[var(--text-primary)]">com precisão real</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-6 text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed"
          >
            Dimensionamento, tolerâncias ISO, hidráulica, soldagem e mais.
            Baseado em normas <strong className="text-[var(--text-primary)]">ABNT, ISO e DIN</strong>.
            Profissional, rápido e acessível.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/cadastro"
              className="group inline-flex items-center gap-2 rounded-xl bg-brand-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-brand-600/25 hover:bg-brand-700 hover:shadow-brand-600/40 transition-all duration-300"
            >
              Começar grátis
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#modulos"
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] px-8 py-4 text-base font-semibold text-[var(--text-primary)] hover:border-brand-300 hover:text-brand-600 transition-all duration-300"
            >
              Ver módulos
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7 }}
            className="mt-16 flex items-center justify-center gap-8 sm:gap-12"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + i * 0.15, type: "spring" }}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl font-bold text-brand-600">{stat.value}</div>
                <div className="text-sm text-[var(--text-muted)] mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <CalculatorPreview />
      </div>
    </section>
  );
}
