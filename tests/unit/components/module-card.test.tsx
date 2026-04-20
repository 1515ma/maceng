import { render, screen } from "@testing-library/react";
import { ModuleCard } from "@/components/dashboard/module-card";
import type { EngineeringModule } from "@/core/entities/module";

const sample: EngineeringModule = {
  slug: "dimensionamento-resistencia",
  name: "Dimensionamento e Resistência",
  description: "Espessura de chapa, deflexão de vigas, torque de eixos.",
  area: "mechanical",
  icon: "Gauge",
  calculators: ["Espessura de chapa", "Deflexão de vigas"],
  status: "coming-soon",
};

describe("ModuleCard", () => {
  // Evita: card sem o nome do módulo, impossibilitando identificação na grade
  it("renders the module name", () => {
    render(<ModuleCard module={sample} />);
    expect(screen.getByText(sample.name)).toBeInTheDocument();
  });

  // Evita: perda da descrição curta, prejudicando o entendimento do escopo do módulo
  it("renders the module description", () => {
    render(<ModuleCard module={sample} />);
    expect(screen.getByText(sample.description)).toBeInTheDocument();
  });

  // Evita: card não navegar para a página do módulo (roteamento quebrado)
  it("links to the module page using its slug", () => {
    render(<ModuleCard module={sample} />);
    const link = screen.getByRole("link", { name: new RegExp(sample.name, "i") });
    expect(link).toHaveAttribute("href", `/dashboard/${sample.slug}`);
  });

  // Evita: módulos em desenvolvimento virarem oferta indevidamente (expectativa do usuário)
  it("shows 'Em breve' badge when status is coming-soon", () => {
    render(<ModuleCard module={sample} />);
    expect(screen.getByText(/Em breve/i)).toBeInTheDocument();
  });

  // Evita: módulos liberados serem ocultados como em-breve por engano
  it("does not show 'Em breve' badge when status is available", () => {
    render(<ModuleCard module={{ ...sample, status: "available" }} />);
    expect(screen.queryByText(/Em breve/i)).not.toBeInTheDocument();
  });
});
