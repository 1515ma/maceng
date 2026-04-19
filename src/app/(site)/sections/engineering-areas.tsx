"use client";

import { motion } from "framer-motion";
import { Cog, HardHat, Cable, FlaskConical, ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { CONTAINER_CLASS } from "@/lib/constants";

const areas = [
  {
    icon: Cog,
    title: "Engenharia Mecânica",
    status: "Disponível",
    available: true,
    modules: 15,
  },
  {
    icon: HardHat,
    title: "Engenharia Civil",
    status: "Em breve",
    available: false,
    modules: null,
  },
  {
    icon: Cable,
    title: "Engenharia Elétrica",
    status: "Em breve",
    available: false,
    modules: null,
  },
  {
    icon: FlaskConical,
    title: "Engenharia Química",
    status: "Em breve",
    available: false,
    modules: null,
  },
];

export function EngineeringAreasSection() {
  return (
    <section className="relative py-24 bg-[var(--bg-primary)]">
      <div className={CONTAINER_CLASS}>
        <SectionHeading
          badge="Plataforma Multi-Engenharia"
          title="Uma plataforma,"
          highlight="várias engenharias"
          description="Começamos pela mecânica, mas o Maceng foi projetado para expandir. Novas áreas estão a caminho."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {areas.map((area, index) => (
            <motion.div
              key={area.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
              whileHover={area.available ? { y: -6, transition: { duration: 0.2 } } : {}}
              className={`relative rounded-2xl border p-6 text-center transition-all duration-300 ${
                area.available
                  ? "border-brand-300 dark:border-brand-700 bg-brand-50/50 dark:bg-brand-950/20 shadow-md cursor-pointer hover:shadow-xl"
                  : "border-[var(--border-color)] bg-[var(--card-bg)] opacity-60"
              }`}
            >
              <div
                className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl ${
                  area.available
                    ? "bg-brand-600 text-white shadow-lg shadow-brand-600/25"
                    : "bg-[var(--bg-tertiary)] text-[var(--text-muted)]"
                }`}
              >
                <area.icon className="h-7 w-7" />
              </div>

              <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1">
                {area.title}
              </h3>

              <span
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                  area.available
                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                    : "bg-[var(--bg-tertiary)] text-[var(--text-muted)]"
                }`}
              >
                {area.available && <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />}
                {area.status}
              </span>

              {area.modules && (
                <p className="mt-3 text-sm text-[var(--text-secondary)]">
                  {area.modules} módulos
                  <ArrowRight className="inline ml-1 h-3 w-3" />
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
