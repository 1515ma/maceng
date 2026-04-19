import { render, screen } from "@testing-library/react";
import { HowItWorksSection } from "@/app/(site)/sections/how-it-works";

describe("HowItWorksSection", () => {
  beforeEach(() => {
    render(<HowItWorksSection />);
  });

  // Evita: renomear o badge da seção e quebrar a referência visual no menu de navegação
  it("renders section heading", () => {
    expect(screen.getByText("Simples e Direto")).toBeInTheDocument();
  });

  // Evita: remover ou reordenar um passo do fluxo, confundindo o usuário sobre como usar a plataforma
  it("renders all 4 steps", () => {
    expect(screen.getByText("Crie sua conta")).toBeInTheDocument();
    expect(screen.getByText("Escolha o módulo")).toBeInTheDocument();
    expect(screen.getByText("Insira os dados")).toBeInTheDocument();
    expect(screen.getByText("Resultado instantâneo")).toBeInTheDocument();
  });

  // Evita: os números de passo (01, 02...) sumindo durante uma refatoração de layout
  it("renders step numbers", () => {
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("02")).toBeInTheDocument();
    expect(screen.getByText("03")).toBeInTheDocument();
    expect(screen.getByText("04")).toBeInTheDocument();
  });

  // Evita: cards de passo ficarem sem descrição por erro de prop, exibindo apenas o título
  it("each step has a description", () => {
    expect(screen.getByText(/Cadastro rápido e gratuito/)).toBeInTheDocument();
    expect(screen.getByText(/15 categorias/)).toBeInTheDocument();
    expect(screen.getByText(/validação em tempo real/)).toBeInTheDocument();
    expect(screen.getByText(/fórmula aplicada/)).toBeInTheDocument();
  });
});
