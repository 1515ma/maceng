"use client";

import { motion } from "framer-motion";
import { Check, Sparkles, Zap, Crown } from "lucide-react";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/section-heading";
import { CONTAINER_CLASS } from "@/lib/constants";

const plans = [
  {
    name: "Gratuito",
    icon: Zap,
    price: "R$ 0",
    period: "para sempre",
    description: "Para conhecer a plataforma e fazer cálculos pontuais.",
    limit: "5 cálculos / dia",
    features: [
      "Acesso a todos os 15 módulos",
      "5 cálculos por dia",
      "Fórmulas e normas reais",
      "Interface completa",
    ],
    cta: "Começar grátis",
    href: "/cadastro",
    popular: false,
  },
  {
    name: "Pro",
    icon: Sparkles,
    price: "R$ 7,99",
    period: "/mês",
    description: "Para estudantes e profissionais que calculam com frequência.",
    limit: "800 cálculos / mês",
    features: [
      "Tudo do plano Gratuito",
      "800 cálculos por mês",
      "Histórico de cálculos",
      "Exportação de resultados",
      "Suporte prioritário",
    ],
    cta: "Assinar Pro",
    href: "/cadastro?plan=pro",
    popular: true,
  },
  {
    name: "Max",
    icon: Crown,
    price: "R$ 14,99",
    period: "/mês",
    description: "Para empresas e engenheiros com demanda intensa.",
    limit: "1.600 cálculos / mês",
    features: [
      "Tudo do plano Pro",
      "1.600 cálculos por mês",
      "Gestão de arquivos e revisões",
      "Suporte dedicado via e-mail",
      "Acesso antecipado a novos módulos",
      "Futuras engenharias incluídas",
    ],
    cta: "Assinar Max",
    href: "/cadastro?plan=max",
    popular: false,
  },
];

export function PricingSection() {
  return (
    <section id="planos" className="relative py-24 bg-[var(--bg-secondary)]">
      <div className={CONTAINER_CLASS}>
        <SectionHeading
          badge="Planos Acessíveis"
          title="Escolha o plano ideal para"
          highlight="seu perfil"
          description="Comece grátis, evolua conforme sua demanda. Sem surpresas, cancele quando quiser."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.15, duration: 0.5, type: "spring" }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className={`relative rounded-2xl border p-8 flex flex-col transition-all duration-300 ${
                plan.popular
                  ? "border-brand-500 bg-[var(--card-bg)] shadow-xl shadow-brand-600/10 scale-[1.02]"
                  : "border-[var(--border-color)] bg-[var(--card-bg)] shadow-sm hover:shadow-lg"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-600 px-4 py-1 text-xs font-semibold text-white shadow-md">
                    <Sparkles className="h-3 w-3" />
                    Mais popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg mb-4 ${
                  plan.popular
                    ? "bg-brand-600 text-white"
                    : "bg-brand-100 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400"
                }`}>
                  <plan.icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-[var(--text-primary)]">{plan.name}</h3>
                <p className="text-sm text-[var(--text-muted)] mt-1">{plan.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-[var(--text-primary)]">{plan.price}</span>
                  <span className="text-sm text-[var(--text-muted)]">{plan.period}</span>
                </div>
                <div className="mt-2 inline-flex items-center rounded-full bg-brand-50 dark:bg-brand-950/30 px-3 py-1 text-xs font-semibold text-brand-700 dark:text-brand-300">
                  {plan.limit}
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-[var(--text-secondary)]">
                    <Check className="h-4 w-4 text-brand-500 mt-0.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`w-full text-center rounded-xl py-3 text-sm font-semibold transition-all duration-300 ${
                  plan.popular
                    ? "bg-brand-600 text-white shadow-md shadow-brand-600/25 hover:bg-brand-700 hover:shadow-brand-600/40"
                    : "border border-[var(--border-color)] text-[var(--text-primary)] hover:border-brand-400 hover:text-brand-600"
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
