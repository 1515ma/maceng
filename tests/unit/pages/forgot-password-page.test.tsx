import { render, screen } from "@testing-library/react";
import ForgotPasswordPage from "@/app/(auth)/recuperar-senha/page";

describe("ForgotPasswordPage", () => {
  beforeEach(() => {
    render(<ForgotPasswordPage />);
  });

  // Evita: página sem título visível, deixando o usuário sem contexto
  it("renders the page heading", () => {
    expect(screen.getByRole("heading", { name: /Recuperar senha/i })).toBeInTheDocument();
  });

  // Evita: Logo da marca ausente, quebrando identidade visual
  it("renders the Maceng logo", () => {
    expect(screen.getByText("Mac")).toBeInTheDocument();
    expect(screen.getByText("eng")).toBeInTheDocument();
  });

  // Evita: formulário não renderizar, impossibilitando pedido de recuperação
  it("renders the forgot-password form with email field", () => {
    expect(screen.getByLabelText("E-mail")).toBeInTheDocument();
  });

  // Evita: página sem instrução clara, deixando o usuário confuso sobre o que fazer
  it("renders helper text explaining the flow", () => {
    expect(screen.getByText(/instruções/i)).toBeInTheDocument();
  });
});
