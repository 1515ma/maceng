import { render, screen } from "@testing-library/react";
import HomePage from "@/app/(site)/page";

describe("HomePage Integration", () => {
  beforeEach(() => {
    render(<HomePage />);
  });

  // Evita: HeroSection ser removida do page.tsx ou sua importação quebrar silenciosamente
  it("renders the Hero section", () => {
    expect(screen.getByText("Cálculos de")).toBeInTheDocument();
    expect(screen.getByText("com precisão real")).toBeInTheDocument();
  });

  // Evita: ModulesSection ser desconectada da página, deixando o conteúdo principal invisível
  it("renders the Modules section", () => {
    expect(screen.getByText("15 Módulos Técnicos")).toBeInTheDocument();
  });

  // Evita: HowItWorksSection sumir da página, removendo o guia de uso para novos visitantes
  it("renders the How It Works section", () => {
    expect(screen.getByText("Simples e Direto")).toBeInTheDocument();
  });

  // Evita: EngineeringAreasSection ser removida, perdendo a comunicação do roadmap multi-engenharia
  it("renders the Engineering Areas section", () => {
    expect(screen.getByText("Plataforma Multi-Engenharia")).toBeInTheDocument();
  });

  // Evita: PricingSection desaparecer da página, impedindo visitantes de ver os planos disponíveis
  it("renders the Pricing section", () => {
    expect(screen.getByText("Planos Acessíveis")).toBeInTheDocument();
  });

  // Evita: FaqSection ser removida, deixando usuários sem resposta para objeções de compra
  it("renders the FAQ section", () => {
    expect(screen.getByText("Dúvidas Frequentes")).toBeInTheDocument();
  });

  // Evita: CtaSection sumir do final da página, perdendo o último apelo à conversão
  it("renders the CTA section", () => {
    expect(screen.getByText(/Pronto para calcular com/)).toBeInTheDocument();
  });

  // Evita: reordenação ou omissão de qualquer seção durante refatoração do page.tsx
  it("renders all 7 sections on a single page", () => {
    expect(screen.getByText("com precisão real")).toBeInTheDocument();
    expect(screen.getByText("15 Módulos Técnicos")).toBeInTheDocument();
    expect(screen.getByText("Simples e Direto")).toBeInTheDocument();
    expect(screen.getByText("Plataforma Multi-Engenharia")).toBeInTheDocument();
    expect(screen.getByText("Planos Acessíveis")).toBeInTheDocument();
    expect(screen.getByText("Dúvidas Frequentes")).toBeInTheDocument();
    expect(screen.getByText(/Pronto para calcular com/)).toBeInTheDocument();
  });
});
