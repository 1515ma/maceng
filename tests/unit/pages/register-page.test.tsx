import { render, screen } from "@testing-library/react";
import RegisterPage from "@/app/(auth)/cadastro/page";

describe("RegisterPage", () => {
  beforeEach(() => {
    render(<RegisterPage />);
  });

  // Evita: página de cadastro sem título, deixando o usuário sem contexto
  it("renders the page heading", () => {
    expect(screen.getByRole("heading", { name: /Criar sua conta/i })).toBeInTheDocument();
  });

  // Evita: Logo da marca ausente na tela de cadastro, quebrando identidade visual
  it("renders the Maceng logo", () => {
    expect(screen.getByText("Mac")).toBeInTheDocument();
    expect(screen.getByText("eng")).toBeInTheDocument();
  });

  // Evita: formulário não renderizando, impossibilitando o cadastro
  it("renders the register form with all fields", () => {
    expect(screen.getByLabelText("Nome completo")).toBeInTheDocument();
    expect(screen.getByLabelText("E-mail")).toBeInTheDocument();
    expect(screen.getByLabelText("Senha")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirmar senha")).toBeInTheDocument();
  });

  // Evita: botão de Google OAuth não aparecendo no cadastro
  it("renders Google OAuth button", () => {
    expect(screen.getByRole("button", { name: /Google/i })).toBeInTheDocument();
  });

  // Evita: separador visual sumir, confundindo a interface entre OAuth e formulário
  it("renders the divider between OAuth and form", () => {
    expect(screen.getByText(/ou continue com/i)).toBeInTheDocument();
  });
});
