import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "@/components/auth/login-form";

describe("LoginForm", () => {
  beforeEach(() => {
    render(<LoginForm />);
  });

  // Evita: campo de email não existir, impedindo o usuário de inserir sua credencial
  it("renders email input with correct type", () => {
    const input = screen.getByLabelText("E-mail");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "email");
  });

  // Evita: campo de senha não existir ou não mascarar o input, expondo a senha visualmente
  it("renders password input with correct type", () => {
    const input = screen.getByLabelText("Senha");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "password");
  });

  // Evita: formulário sem botão de submit, impossibilitando o login
  it("renders submit button with text Entrar", () => {
    expect(screen.getByRole("button", { name: "Entrar" })).toBeInTheDocument();
  });

  // Evita: não oferecer login social com Google, que é requisito explícito do produto
  it("renders Google sign-in button", () => {
    expect(screen.getByRole("button", { name: /Google/i })).toBeInTheDocument();
  });

  // Evita: usuário sem conta não encontrar link de cadastro, abandonando o fluxo
  it("renders link to register page", () => {
    const link = screen.getByText(/Criar conta/i).closest("a");
    expect(link).toHaveAttribute("href", "/cadastro");
  });

  // Evita: usuário que esqueceu a senha não ter como recuperá-la, ficando bloqueado
  it("renders link to password recovery", () => {
    const link = screen.getByText(/Esqueceu a senha/i).closest("a");
    expect(link).toHaveAttribute("href", "/recuperar-senha");
  });

  // Evita: formulário submeter dados sem validação, enviando requests inválidos ao backend
  it("shows validation error for invalid email on submit", async () => {
    const user = userEvent.setup();

    await user.type(screen.getByLabelText("E-mail"), "invalido");
    await user.type(screen.getByLabelText("Senha"), "Senh@123");
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    expect(await screen.findByText(/e-mail válido/i)).toBeInTheDocument();
  });

  // Evita: aceitar senha curta no front, desperdiçando request e dando UX ruim ao invés de feedback imediato
  it("shows validation error for short password on submit", async () => {
    const user = userEvent.setup();

    await user.type(screen.getByLabelText("E-mail"), "user@example.com");
    await user.type(screen.getByLabelText("Senha"), "123");
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    expect(await screen.findByText(/pelo menos 6 caracteres/i)).toBeInTheDocument();
  });

  // Evita: input de email sem autocomplete, forçando digitação manual toda vez (UX + acessibilidade)
  it("has autocomplete attributes for email and password", () => {
    expect(screen.getByLabelText("E-mail")).toHaveAttribute("autoComplete", "email");
    expect(screen.getByLabelText("Senha")).toHaveAttribute("autoComplete", "current-password");
  });
});
