import type { EngineeringModule } from "@/core/entities/module";

export const MECHANICAL_MODULES: readonly EngineeringModule[] = [
  {
    slug: "dimensionamento-resistencia",
    name: "Dimensionamento e Resistência",
    description:
      "Espessura de chapa, deflexão de vigas, torque de eixos e fatores de segurança.",
    area: "mechanical",
    icon: "Gauge",
    calculators: [
      "Espessura de chapa",
      "Deflexão de vigas",
      "Torque de eixos",
      "Fatores de segurança",
    ],
    status: "coming-soon",
  },
  {
    slug: "elementos-fixacao-roscas",
    name: "Elementos de Fixação e Roscas",
    description:
      "Broca pré-rosca (métrica, UNC, NPT) e torque de aperto por classe e material.",
    area: "mechanical",
    icon: "Wrench",
    calculators: [
      "Broca pré-rosca métrica",
      "Broca pré-rosca UNC",
      "Broca pré-rosca NPT",
      "Torque de aperto por classe",
    ],
    status: "coming-soon",
  },
  {
    slug: "tolerancias-ajustes",
    name: "Tolerâncias e Ajustes",
    description: "Calculadora de ajustes ISO 286 e tolerâncias geométricas (GD&T).",
    area: "mechanical",
    icon: "Ruler",
    calculators: ["Ajustes ISO 286", "Tolerâncias geométricas (GD&T)"],
    status: "coming-soon",
  },
  {
    slug: "materiais-tratamentos",
    name: "Materiais e Tratamentos",
    description:
      "Equivalência SAE/ABNT/DIN/BS/JIS/EN, tratamentos térmicos e compatibilidade galvânica.",
    area: "mechanical",
    icon: "FlaskConical",
    calculators: [
      "Equivalência de aços (SAE/ABNT/DIN/BS/JIS/EN)",
      "Tratamentos térmicos",
      "Compatibilidade galvânica",
    ],
    status: "coming-soon",
  },
  {
    slug: "componentes-transmissao",
    name: "Componentes e Transmissão",
    description:
      "Identificação de rolamentos por diâmetro + espessura, correias em V e sincronizadas.",
    area: "mechanical",
    icon: "Cog",
    calculators: [
      "Identificação de rolamentos",
      "Correias em V",
      "Correias sincronizadas",
    ],
    status: "coming-soon",
  },
  {
    slug: "hidraulica-pneumatica",
    name: "Hidráulica e Pneumática",
    description:
      "Força de cilindros com curso, dimensionamento de tubulações e perda de carga.",
    area: "mechanical",
    icon: "Waves",
    calculators: [
      "Força de cilindros",
      "Dimensionamento de tubulações",
      "Perda de carga",
    ],
    status: "coming-soon",
  },
  {
    slug: "processos-fabricacao",
    name: "Processos de Fabricação",
    description:
      "Raio mínimo de dobra, comprimento da aba e calculadora de peso completa.",
    area: "mechanical",
    icon: "Hammer",
    calculators: [
      "Raio mínimo de dobra",
      "Comprimento da aba",
      "Cálculo de peso",
    ],
    status: "coming-soon",
  },
  {
    slug: "motores-redutores",
    name: "Motores e Redutores",
    description:
      "Potência de eixo, seleção de motor IEC e relação de transmissão com regra de 3.",
    area: "mechanical",
    icon: "Zap",
    calculators: [
      "Potência de eixo",
      "Seleção de motor IEC",
      "Relação de transmissão",
    ],
    status: "coming-soon",
  },
  {
    slug: "molas-elementos-elasticos",
    name: "Molas e Elementos Elásticos",
    description:
      "Constante elástica de molas helicoidais e estimativa de vida à fadiga.",
    area: "mechanical",
    icon: "Spline",
    calculators: [
      "Constante elástica",
      "Estimativa de vida à fadiga",
    ],
    status: "coming-soon",
  },
  {
    slug: "custos-fabricacao",
    name: "Custos e Estimativa de Fabricação",
    description:
      "Estimativas de corte laser/plasma e tempo de usinagem em torno/fresa manual ou CNC.",
    area: "mechanical",
    icon: "DollarSign",
    calculators: [
      "Corte a laser",
      "Corte plasma",
      "Tempo de usinagem torno",
      "Tempo de usinagem fresa",
    ],
    status: "coming-soon",
  },
  {
    slug: "ergonomia-seguranca",
    name: "Ergonomia e Segurança (NR-12)",
    description:
      "Distâncias de segurança NR-12/ISO 13857 e dimensões ergonômicas de bancadas.",
    area: "mechanical",
    icon: "ShieldCheck",
    calculators: [
      "Distâncias de segurança NR-12",
      "Distâncias ISO 13857",
      "Dimensões ergonômicas",
    ],
    status: "coming-soon",
  },
  {
    slug: "vedacao-lubrificacao",
    name: "Vedação e Lubrificação",
    description:
      "Seleção de O-rings com código de compra por fluido/temperatura e relubrificação.",
    area: "mechanical",
    icon: "Droplet",
    calculators: ["Seleção de O-rings", "Relubrificação"],
    status: "coming-soon",
  },
  {
    slug: "soldagem-simbologia",
    name: "Soldagem e Simbologia",
    description:
      "Seleção de eletrodos/arames por combinação de materiais e dicionário de símbolos.",
    area: "mechanical",
    icon: "Flame",
    calculators: [
      "Seleção de eletrodos",
      "Seleção de arames",
      "Dicionário de símbolos",
    ],
    status: "coming-soon",
  },
  {
    slug: "conversor-unidades",
    name: "Conversor de Unidades Técnicas",
    description:
      "Pressão, torque, potência, comprimento, força, polegadas fracionárias e temperatura.",
    area: "mechanical",
    icon: "ArrowRightLeft",
    calculators: [
      "Pressão",
      "Torque",
      "Potência",
      "Comprimento",
      "Força",
      "Polegadas fracionárias",
      "Temperatura",
    ],
    status: "coming-soon",
  },
  {
    slug: "gestao-arquivos",
    name: "Gestão de Arquivos e Revisões",
    description:
      "Checklist de verificação pré-produção e controle de revisões de desenhos.",
    area: "mechanical",
    icon: "FolderKanban",
    calculators: [
      "Checklist pré-produção",
      "Controle de revisões",
    ],
    status: "coming-soon",
  },
] as const;

export function findMechanicalModuleBySlug(
  slug: string,
): EngineeringModule | undefined {
  return MECHANICAL_MODULES.find((m) => m.slug === slug);
}
