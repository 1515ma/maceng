import { render, screen } from "@testing-library/react";
import { PricingSection } from "@/app/(site)/sections/pricing";

describe("PricingSection", () => {
  beforeEach(() => {
    render(<PricingSection />);
  });

  // Evita: alterar o badge da seção sem refletir na página, quebrando a consistência com o menu de ancoragem
  it("renders section heading", () => {
    expect(screen.getByText("Planos Acessíveis")).toBeInTheDocument();
  });

  // Evita: renomear plano (ex: "Free" em vez de "Gratuito") causando inconsistência entre código e marketing
  it("renders all 3 plan names", () => {
    expect(screen.getByText("Gratuito")).toBeInTheDocument();
    expect(screen.getByText("Pro")).toBeInTheDocument();
    expect(screen.getByText("Max")).toBeInTheDocument();
  });

  // Evita: exibir preço errado por erro de digitação, gerando conflito com o valor cobrado pelo Stripe
  it("renders correct prices", () => {
    expect(screen.getByText("R$ 0")).toBeInTheDocument();
    expect(screen.getByText("R$ 7,99")).toBeInTheDocument();
    expect(screen.getByText("R$ 14,99")).toBeInTheDocument();
  });

  // Evita: exibir limite incorreto de cálculos, contradizendo as regras de negócio da assinatura
  it("renders correct calculation limits", () => {
    expect(screen.getByText("5 cálculos / dia")).toBeInTheDocument();
    expect(screen.getByText("800 cálculos / mês")).toBeInTheDocument();
    expect(screen.getByText("1.600 cálculos / mês")).toBeInTheDocument();
  });

  // Evita: perder o destaque visual do plano Pro, que é o principal produto a ser vendido
  it("marks Pro as most popular", () => {
    expect(screen.getByText("Mais popular")).toBeInTheDocument();
  });

  // Evita: botões de CTA sumirem ou ficarem com texto errado, impedindo a conversão
  it("renders CTA buttons for each plan", () => {
    expect(screen.getByText("Começar grátis")).toBeInTheDocument();
    expect(screen.getByText("Assinar Pro")).toBeInTheDocument();
    expect(screen.getByText("Assinar Max")).toBeInTheDocument();
  });

  // Evita: link do plano gratuito apontar para rota errada, quebrando o fluxo de cadastro
  it("free plan links to /cadastro", () => {
    const link = screen.getByText("Começar grátis").closest("a");
    expect(link).toHaveAttribute("href", "/cadastro");
  });

  // Evita: parâmetro de plano Pro ausente na URL, fazendo o backend selecionar plano errado no Stripe
  it("pro plan links to /cadastro?plan=pro", () => {
    const link = screen.getByText("Assinar Pro").closest("a");
    expect(link).toHaveAttribute("href", "/cadastro?plan=pro");
  });

  // Evita: parâmetro de plano Max ausente na URL, fazendo o backend selecionar plano errado no Stripe
  it("max plan links to /cadastro?plan=max", () => {
    const link = screen.getByText("Assinar Max").closest("a");
    expect(link).toHaveAttribute("href", "/cadastro?plan=max");
  });
});
