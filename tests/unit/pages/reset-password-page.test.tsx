import { render, screen } from "@testing-library/react";
import ResetPasswordPage from "@/app/(auth)/redefinir-senha/page";

describe("ResetPasswordPage", () => {
  beforeEach(() => {
    render(<ResetPasswordPage />);
  });

  // Evita: página sem título visível, deixando o usuário sem contexto do fluxo
  it("renders the page heading", () => {
    expect(screen.getByRole("heading", { name: /Definir nova senha/i })).toBeInTheDocument();
  });

  // Evita: Logo da marca ausente, quebrando identidade visual
  it("renders the Maceng logo", () => {
    expect(screen.getByText("Mac")).toBeInTheDocument();
    expect(screen.getByText("eng")).toBeInTheDocument();
  });

  // Evita: formulário não renderizar, impossibilitando o reset
  it("renders the reset form with both password fields", () => {
    expect(screen.getByLabelText("Nova senha")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirmar nova senha")).toBeInTheDocument();
  });
});
