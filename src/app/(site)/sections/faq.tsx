"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { CONTAINER_CLASS } from "@/lib/constants";

const faqs = [
  {
    question: "As fórmulas são baseadas em quais normas?",
    answer:
      "Utilizamos referências da ABNT, ISO e DIN conforme cada módulo. Por exemplo, tolerâncias seguem a ISO 286, roscas seguem a DIN/ISO, e critérios de resistência seguem as normas ABNT aplicáveis. Todas as fontes são citadas no resultado.",
  },
  {
    question: "Posso usar gratuitamente para sempre?",
    answer:
      "Sim. O plano gratuito inclui 5 cálculos por dia com acesso a todos os 15 módulos, sem limite de tempo. Para demandas maiores, os planos Pro e Max oferecem limites mensais maiores.",
  },
  {
    question: "Como funciona o limite de cálculos?",
    answer:
      "Cada vez que você submete um formulário de cálculo e recebe um resultado, conta como 1 cálculo. No plano gratuito o contador reseta diariamente. Nos planos pagos, o contador reseta no ciclo mensal da assinatura.",
  },
  {
    question: "Posso cancelar minha assinatura a qualquer momento?",
    answer:
      "Sim, sem multas ou burocracia. O cancelamento é feito direto no portal da sua conta, e você continua com acesso até o fim do período pago. Usamos Stripe como processador de pagamento.",
  },
  {
    question: "Haverá outras engenharias além da mecânica?",
    answer:
      "Sim! Estamos preparando módulos de Engenharia Civil, Elétrica e Química. Assinantes do plano Max terão acesso antecipado quando forem lançados.",
  },
  {
    question: "Os cálculos podem substituir o projeto feito por engenheiro?",
    answer:
      "Não. O Maceng é uma ferramenta auxiliar de cálculo. Os resultados devem ser validados por um profissional habilitado conforme exigências do CREA/CONFEA. A responsabilidade técnica é sempre do engenheiro responsável.",
  },
];

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      className="border border-[var(--border-color)] rounded-xl overflow-hidden bg-[var(--card-bg)] hover:border-brand-300 dark:hover:border-brand-700 transition-colors"
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 p-5 text-left"
      >
        <span className="text-sm font-semibold text-[var(--text-primary)]">{question}</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
        >
          <ChevronDown className="h-4 w-4 text-[var(--text-muted)]" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-sm text-[var(--text-secondary)] leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FaqSection() {
  return (
    <section id="faq" className="relative py-24 bg-[var(--bg-primary)]">
      <div className={`${CONTAINER_CLASS} max-w-3xl`}>
        <SectionHeading
          badge="Dúvidas Frequentes"
          title="Perguntas"
          highlight="e respostas"
          description="Tudo que você precisa saber antes de começar a usar o Maceng."
        />

        <div className="space-y-3">
          {faqs.map((faq) => (
            <FaqItem key={faq.question} {...faq} />
          ))}
        </div>
      </div>
    </section>
  );
}
