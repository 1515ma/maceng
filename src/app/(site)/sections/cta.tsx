"use client";

import { motion } from "framer-motion";
import { ArrowRight, Cog } from "lucide-react";
import Link from "next/link";
import { CONTAINER_CLASS } from "@/lib/constants";

export function CtaSection() {
  return (
    <section className="relative py-24 bg-[var(--bg-secondary)] overflow-hidden">
      <motion.div
        className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-brand-500/10 blur-3xl"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-brand-400/10 blur-3xl"
        animate={{ scale: [1.2, 1, 1.2] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className={`relative z-10 ${CONTAINER_CLASS} max-w-4xl text-center`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", duration: 0.8 }}
          className="mb-8 flex justify-center"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-brand-500/20 blur-xl animate-pulse-glow" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg">
              <Cog className="h-10 w-10" />
            </div>
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] leading-tight"
        >
          Pronto para calcular com{" "}
          <span className="text-brand-600">precisão</span>?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-4 text-lg text-[var(--text-secondary)] max-w-xl mx-auto"
        >
          Junte-se a engenheiros que confiam no Maceng para seus cálculos técnicos diários.
          Comece grátis, sem cartão de crédito.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/cadastro"
            className="group inline-flex items-center gap-2 rounded-xl bg-brand-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-brand-600/25 hover:bg-brand-700 hover:shadow-brand-600/40 transition-all duration-300"
          >
            Criar conta gratuita
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-xs text-[var(--text-muted)]"
        >
          5 cálculos grátis por dia &middot; Sem cartão de crédito &middot; Cancele quando quiser
        </motion.p>
      </div>
    </section>
  );
}
