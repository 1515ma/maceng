"use client";

import { motion } from "framer-motion";
import { UserPlus, MousePointerClick, Calculator, FileDown } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { CONTAINER_CLASS } from "@/lib/constants";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Crie sua conta",
    description: "Cadastro rápido e gratuito. 5 cálculos diários sem custo para você testar a plataforma.",
  },
  {
    icon: MousePointerClick,
    step: "02",
    title: "Escolha o módulo",
    description: "Selecione entre 15 categorias de cálculos de engenharia mecânica organizadas por tema.",
  },
  {
    icon: Calculator,
    step: "03",
    title: "Insira os dados",
    description: "Preencha os campos de entrada com validação em tempo real. Interface limpa e guiada.",
  },
  {
    icon: FileDown,
    step: "04",
    title: "Resultado instantâneo",
    description: "Receba o resultado com fórmula aplicada, unidades e indicação de aprovação conforme norma.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="como-funciona" className="relative py-24 bg-[var(--bg-primary)]">
      <div className={CONTAINER_CLASS}>
        <SectionHeading
          badge="Simples e Direto"
          title="Como"
          highlight="funciona"
          description="Em 4 passos você sai do problema ao resultado. Sem complexidade, sem instalação."
        />

        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="hidden md:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-brand-200 via-brand-400 to-brand-200 dark:from-brand-900 dark:via-brand-600 dark:to-brand-900" />

          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.15, duration: 0.5, type: "spring" }}
              className="relative text-center"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-600/25"
              >
                <step.icon className="h-7 w-7" />
                <div className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--bg-primary)] border-2 border-brand-600 text-xs font-bold text-brand-600">
                  {step.step}
                </div>
              </motion.div>

              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
