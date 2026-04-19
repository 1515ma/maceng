import { render, screen } from "@testing-library/react";
import { EngineeringAreasSection } from "@/app/(site)/sections/engineering-areas";

describe("EngineeringAreasSection", () => {
  beforeEach(() => {
    render(<EngineeringAreasSection />);
  });

  // Evita: alterar o badge da seção sem refletir no conteúdo, quebrando a proposta de plataforma multi-disciplinar
  it("renders section heading", () => {
    expect(screen.getByText("Plataforma Multi-Engenharia")).toBeInTheDocument();
  });

  // Evita: remover uma área de engenharia planejada, comprometendo o roadmap público do produto
  it("renders all 4 engineering areas", () => {
    expect(screen.getByText("Engenharia Mecânica")).toBeInTheDocument();
    expect(screen.getByText("Engenharia Civil")).toBeInTheDocument();
    expect(screen.getByText("Engenharia Elétrica")).toBeInTheDocument();
    expect(screen.getByText("Engenharia Química")).toBeInTheDocument();
  });

  // Evita: Mecânica perder o badge "Disponível" e parecer indisponível para o usuário
  it("marks Mecânica as available", () => {
    expect(screen.getByText("Disponível")).toBeInTheDocument();
  });

  // Evita: uma das áreas futuras ter seu status trocado para "Disponível" antes de estar pronta
  it("marks Civil, Elétrica and Química as coming soon", () => {
    const badges = screen.getAllByText("Em breve");
    expect(badges).toHaveLength(3);
  });

  // Evita: contagem de módulos da Mecânica ser alterada sem atualizar o dado real na plataforma
  it("shows 15 modules count for Mecânica", () => {
    expect(screen.getByText(/15 módulos/)).toBeInTheDocument();
  });
});
