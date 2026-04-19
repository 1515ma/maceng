import { render, screen } from "@testing-library/react";
import LoginPage from "@/app/(auth)/login/page";

describe("LoginPage", () => {
  beforeEach(() => {
    render(<LoginPage />);
  });

  // Evita: página de login sem título visível, deixando o usuário perdido sobre onde está
  it("renders the page heading", () => {
    expect(screen.getByRole("heading", { name: /Entrar na sua conta/i })).toBeInTheDocument();
  });

  // Evita: Logo da marca ausente na tela de login, quebrando a identidade visual
  it("renders the Maceng logo", () => {
    expect(screen.getByText("Mac")).toBeInTheDocument();
    expect(screen.getByText("eng")).toBeInTheDocument();
  });

  // Evita: formulário de login não renderizando na página, impossibilitando a autenticação
  it("renders the login form with email and password fields", () => {
    expect(screen.getByLabelText("E-mail")).toBeInTheDocument();
    expect(screen.getByLabelText("Senha")).toBeInTheDocument();
  });

  // Evita: botão de Google OAuth não aparecendo, removendo opção de login social
  it("renders Google OAuth button", () => {
    expect(screen.getByRole("button", { name: /Google/i })).toBeInTheDocument();
  });

  // Evita: separador visual entre login social e formulário sumir, confundindo a interface
  it("renders the divider between OAuth and form", () => {
    expect(screen.getByText(/ou continue com/i)).toBeInTheDocument();
  });
});
