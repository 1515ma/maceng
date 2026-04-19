"use client";

import { motion } from "framer-motion";
import {
  Ruler,
  Wrench,
  SlidersHorizontal,
  Layers,
  Settings,
  Droplets,
  Factory,
  Gauge,
  ArrowDownUp,
  DollarSign,
  ShieldCheck,
  CircleDot,
  Flame,
  RefreshCw,
  FolderArchive,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { CONTAINER_CLASS } from "@/lib/constants";

const modules = [
  { icon: Ruler, title: "Dimensionamento e Resistência", desc: "Tensão, deformação, flambagem e fadiga de materiais" },
  { icon: Wrench, title: "Elementos de Fixação e Roscas", desc: "Parafusos, porcas, tabelas ISO/DIN e torque de aperto" },
  { icon: SlidersHorizontal, title: "Tolerâncias e Ajustes", desc: "Ajustes ISO 286, graus IT e campos de tolerância" },
  { icon: Layers, title: "Materiais e Tratamentos", desc: "Propriedades mecânicas, tratamentos térmicos e seleção" },
  { icon: Settings, title: "Componentes e Transmissão", desc: "Engrenagens, correias, correntes, eixos e acoplamentos" },
  { icon: Droplets, title: "Hidráulica e Pneumática", desc: "Vazão, pressão, perda de carga e dimensionamento" },
  { icon: Factory, title: "Processos de Fabricação", desc: "Usinagem, conformação, fundição e parâmetros de corte" },
  { icon: Gauge, title: "Motores e Redutores", desc: "Torque, potência, RPM, rendimento e seleção" },
  { icon: ArrowDownUp, title: "Molas e Elementos Elásticos", desc: "Molas helicoidais, prato, tração e constantes elásticas" },
  { icon: DollarSign, title: "Custos e Estimativa", desc: "Hora-máquina, custo material, setup e tempo de ciclo" },
  { icon: ShieldCheck, title: "Ergonomia e Segurança (NR-12)", desc: "Distância de segurança, tempo de parada e categorias" },
  { icon: CircleDot, title: "Vedação e Lubrificação", desc: "Retentores, O-rings, viscosidade e seleção de lubrificante" },
  { icon: Flame, title: "Soldagem e Simbologia", desc: "Juntas soldadas, simbologia AWS/ASME e cálculo de cordão" },
  { icon: RefreshCw, title: "Conversor de Unidades", desc: "SI ↔ Imperial, conversões técnicas e grandezas derivadas" },
  { icon: FolderArchive, title: "Gestão de Arquivos e Revisões", desc: "Histórico, versionamento e exportação de cálculos" },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
} as const;

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 100, damping: 15 },
  },
};

export function ModulesSection() {
  return (
    <section id="modulos" className="relative py-24 bg-[var(--bg-secondary)]">
      <div className={CONTAINER_CLASS}>
        <SectionHeading
          badge="15 Módulos Técnicos"
          title="Tudo que um engenheiro mecânico"
          highlight="precisa"
          description="Cada módulo possui fórmulas reais, constantes técnicas normalizadas e validação de entrada. Resultados confiáveis, como na referência bibliográfica."
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {modules.map((mod) => (
            <motion.div
              key={mod.title}
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="group relative rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-sm hover:shadow-lg hover:border-brand-300 dark:hover:border-brand-700 transition-all duration-300 cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 mb-4 group-hover:bg-brand-600 group-hover:text-white transition-colors duration-300">
                  <mod.icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-[var(--text-primary)] mb-2 group-hover:text-brand-600 transition-colors">
                  {mod.title}
                </h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  {mod.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
