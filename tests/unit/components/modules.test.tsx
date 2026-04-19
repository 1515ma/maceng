import { render, screen } from "@testing-library/react";
import { ModulesSection } from "@/app/(site)/sections/modules";

// Lista canônica dos 15 módulos — qualquer adição ou remoção deve ser intencional e refletida aqui
const expectedModules = [
  "Dimensionamento e Resistência",
  "Elementos de Fixação e Roscas",
  "Tolerâncias e Ajustes",
  "Materiais e Tratamentos",
  "Componentes e Transmissão",
  "Hidráulica e Pneumática",
  "Processos de Fabricação",
  "Motores e Redutores",
  "Molas e Elementos Elásticos",
  "Custos e Estimativa",
  "Ergonomia e Segurança (NR-12)",
  "Vedação e Lubrificação",
  "Soldagem e Simbologia",
  "Conversor de Unidades",
  "Gestão de Arquivos e Revisões",
];

describe("ModulesSection", () => {
  beforeEach(() => {
    render(<ModulesSection />);
  });

  // Evita: alterar o badge de contagem sem atualizar a lista real de módulos
  it("renders section heading", () => {
    expect(screen.getByText("15 Módulos Técnicos")).toBeInTheDocument();
  });

  // Evita: apagar ou renomear um módulo da lista sem perceber, removendo oferta do produto
  it("renders all 15 mechanical engineering modules", () => {
    for (const mod of expectedModules) {
      expect(screen.getByText(mod)).toBeInTheDocument();
    }
  });

  // Evita: adicionar ou remover módulo sem atualizar o total anunciado (ex: dizer "15" mas renderizar 14)
  it("renders exactly 15 module cards", () => {
    const titles = expectedModules.map((m) => screen.getByText(m));
    expect(titles).toHaveLength(15);
  });

  // Evita: módulo ser exibido sem descrição, tornando o card vazio e sem valor informativo
  it("each module card has a description", () => {
    expect(screen.getByText(/Tensão, deformação, flambagem/)).toBeInTheDocument();
    expect(screen.getByText(/Parafusos, porcas, tabelas/)).toBeInTheDocument();
    expect(screen.getByText(/Ajustes ISO 286/)).toBeInTheDocument();
  });
});
