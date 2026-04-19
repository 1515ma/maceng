import { render, screen } from "@testing-library/react";
import { CtaSection } from "@/app/(site)/sections/cta";

describe("CtaSection", () => {
  beforeEach(() => {
    render(<CtaSection />);
  });

  // Evita: headline do CTA final sumir ou ser truncado, perdendo o apelo emocional da última chamada à ação
  it("renders the headline", () => {
    expect(screen.getByText(/Pronto para calcular com/)).toBeInTheDocument();
    expect(screen.getByText("precisão")).toBeInTheDocument();
  });

  // Evita: botão de cadastro do CTA apontar para rota errada, quebrando o funil no ponto de maior intenção
  it("renders the CTA button linking to /cadastro", () => {
    const link = screen.getByText("Criar conta gratuita").closest("a");
    expect(link).toHaveAttribute("href", "/cadastro");
  });

  // Evita: remover os textos de confiança que reduzem fricção (sem cartão, sem contrato), afetando conversão
  it("renders the trust sub-text", () => {
    expect(screen.getByText(/5 cálculos grátis por dia/)).toBeInTheDocument();
    expect(screen.getByText(/Sem cartão de crédito/)).toBeInTheDocument();
  });
});
