import { render, screen } from "@testing-library/react";
import { CalculatorPreview } from "@/components/ui/calculator-preview";

describe("CalculatorPreview", () => {
  beforeEach(() => {
    render(<CalculatorPreview />);
  });

  // Evita: label da janela do preview sumir, perdendo o contexto de qual calculadora está sendo demonstrada
  it("renders the window chrome with maceng path label", () => {
    expect(screen.getByText("maceng / dimensionamento")).toBeInTheDocument();
  });

  // Evita: campos de entrada do preview serem apagados, deixando a seção de "Entrada" vazia
  it("renders the input section with engineering fields", () => {
    expect(screen.getByText("Força (F)")).toBeInTheDocument();
    expect(screen.getByText("12.5 kN")).toBeInTheDocument();
    expect(screen.getByText("Área (A)")).toBeInTheDocument();
    expect(screen.getByText("50 mm²")).toBeInTheDocument();
    expect(screen.getByText("Material")).toBeInTheDocument();
    expect(screen.getByText("AISI 1045")).toBeInTheDocument();
  });

  // Evita: seção da fórmula ser removida, deixando o preview sem a equação que justifica o cálculo
  it("renders the formula section", () => {
    expect(screen.getByText("Tensão Normal (MPa)")).toBeInTheDocument();
  });

  // Evita: resultado do cálculo (250 MPa) sumir, que é a parte mais impactante do preview
  it("renders the result section with value and unit", () => {
    expect(screen.getByText("250")).toBeInTheDocument();
    expect(screen.getByText("MPa")).toBeInTheDocument();
  });

  // Evita: badge de aprovação ser removido, perdendo o feedback visual de que o resultado está dentro da norma
  it("renders the within-limit badge", () => {
    expect(screen.getByText("✓ Dentro do limite")).toBeInTheDocument();
  });
});
