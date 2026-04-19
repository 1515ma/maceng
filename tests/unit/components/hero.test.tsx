import { render, screen } from "@testing-library/react";
import { HeroSection } from "@/app/(site)/sections/hero";

describe("HeroSection", () => {
  beforeEach(() => {
    render(<HeroSection />);
  });

  // Evita: alteração do headline principal sem querer, que é o primeiro texto que o visitante lê
  it("renders the main headline", () => {
    expect(screen.getByText("Cálculos de")).toBeInTheDocument();
    expect(screen.getByText("Engenharia Mecânica")).toBeInTheDocument();
    expect(screen.getByText("com precisão real")).toBeInTheDocument();
  });

  // Evita: remover os badges de proposta de valor, que comunicam diferenciais logo no topo
  it("renders the badges", () => {
    expect(screen.getByText("Cálculos instantâneos")).toBeInTheDocument();
    expect(screen.getByText("Normas reais")).toBeInTheDocument();
    expect(screen.getByText("Interface moderna")).toBeInTheDocument();
  });

  // Evita: sumir com os botões de CTA, bloqueando a ação principal do usuário na página
  it("renders the CTA buttons", () => {
    expect(screen.getByText("Começar grátis")).toBeInTheDocument();
    expect(screen.getByText("Ver módulos")).toBeInTheDocument();
  });

  // Evita: link do CTA apontando para rota errada, mandando o usuário para uma página inexistente
  it("links CTA to /cadastro", () => {
    const cta = screen.getByText("Começar grátis").closest("a");
    expect(cta).toHaveAttribute("href", "/cadastro");
  });

  // Evita: alterar os números de prova social (15 módulos, 200+ fórmulas) para valores incorretos
  it("renders stats: 15 modules, 200+ formulas, ABNT/ISO", () => {
    expect(screen.getByText("15")).toBeInTheDocument();
    expect(screen.getByText("Módulos")).toBeInTheDocument();
    expect(screen.getByText("200+")).toBeInTheDocument();
    expect(screen.getByText("Fórmulas")).toBeInTheDocument();
    expect(screen.getByText("ABNT/ISO")).toBeInTheDocument();
    expect(screen.getByText("Normas")).toBeInTheDocument();
  });

  // Evita: CalculatorPreview ser desconectado do Hero, deixando o preview visual em branco
  it("renders the calculator preview with formula sigma = F/A", () => {
    expect(screen.getByText("Força (F)")).toBeInTheDocument();
    expect(screen.getByText("12.5 kN")).toBeInTheDocument();
    expect(screen.getByText("Área (A)")).toBeInTheDocument();
    expect(screen.getByText("50 mm²")).toBeInTheDocument();
    expect(screen.getByText("250")).toBeInTheDocument();
    expect(screen.getByText("MPa")).toBeInTheDocument();
  });
});
