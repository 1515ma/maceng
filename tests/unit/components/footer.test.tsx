import { render, screen } from "@testing-library/react";
import { Footer } from "@/components/layout/footer";

describe("Footer", () => {
  beforeEach(() => {
    render(<Footer />);
  });

  // Evita: refatoração que remova o componente Logo do rodapé, quebrando a consistência visual da marca
  it("renders the Maceng brand", () => {
    expect(screen.getByText("Mac")).toBeInTheDocument();
    expect(screen.getByText("eng")).toBeInTheDocument();
  });

  // Evita: remoção de links de produto no rodapé, prejudicando a navegação de usuários que chegam ao fim da página
  it("renders Produto section with links", () => {
    expect(screen.getByText("Produto")).toBeInTheDocument();
    expect(screen.getByText("Módulos")).toBeInTheDocument();
    expect(screen.getByText("Planos")).toBeInTheDocument();
  });

  // Evita: sumir com os placeholders das engenharias futuras, removendo prova de roadmap do produto
  it("renders Engenharias section with future placeholders", () => {
    expect(screen.getByText("Engenharias")).toBeInTheDocument();
    expect(screen.getByText("Mecânica")).toBeInTheDocument();
    expect(screen.getByText("Civil (em breve)")).toBeInTheDocument();
    expect(screen.getByText("Elétrica (em breve)")).toBeInTheDocument();
    expect(screen.getByText("Química (em breve)")).toBeInTheDocument();
  });

  // Evita: remoção dos links legais (Termos, Privacidade), que são obrigatórios por lei (LGPD)
  it("renders Legal section with links", () => {
    expect(screen.getByText("Legal")).toBeInTheDocument();
    expect(screen.getByText("Termos de Uso")).toBeInTheDocument();
    expect(screen.getByText("Privacidade")).toBeInTheDocument();
    expect(screen.getByText("Contato")).toBeInTheDocument();
  });

  // Evita: exibir ano hardcoded (ex: 2024), que envelhece o copyright sem atualização manual
  it("renders copyright with current year", () => {
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
  });

  // Evita: apagar o slogan institucional do rodapé durante uma limpeza de código
  it("renders tagline", () => {
    expect(screen.getByText("Feito com precisão para engenheiros.")).toBeInTheDocument();
  });
});
