import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RegisterForm } from "@/components/auth/register-form";
import { createRegisterInput, INVALID_EMAIL } from "@tests/factories";

describe("RegisterForm", () => {
  beforeEach(() => {
    render(<RegisterForm />);
  });

  // Evita: campo de nome não existir, impedindo o cadastro com identificação
  it("renders name input", () => {
    expect(screen.getByLabelText("Nome completo")).toBeInTheDocument();
  });

  // Evita: campo de email não existir, impedindo o cadastro
  it("renders email input with correct type", () => {
    const input = screen.getByLabelText("E-mail");
    expect(input).toHaveAttribute("type", "email");
  });

  // Evita: campo de senha não existir ou não mascarar o input
  it("renders password input with correct type", () => {
    const input = screen.getByLabelText("Senha");
    expect(input).toHaveAttribute("type", "password");
  });

  // Evita: campo de confirmação de senha não existir, permitindo erro de digitação silencioso
  it("renders confirm password input", () => {
    expect(screen.getByLabelText("Confirmar senha")).toBeInTheDocument();
  });

  // Evita: formulário sem botão de submit, impossibilitando o cadastro
  it("renders submit button with text Criar conta", () => {
    expect(screen.getByRole("button", { name: "Criar conta" })).toBeInTheDocument();
  });

  // Evita: não oferecer cadastro via Google, perdendo conversão de usuários que preferem OAuth
  it("renders Google sign-up button", () => {
    expect(screen.getByRole("button", { name: /Google/i })).toBeInTheDocument();
  });

  // Evita: usuário com conta não encontrar link de login, ficando perdido
  it("renders link to login page", () => {
    const link = screen.getByText(/Entrar/i).closest("a");
    expect(link).toHaveAttribute("href", "/login");
  });

  // Evita: submeter formulário com email inválido, gastando request no backend
  it("shows validation error for invalid email on submit", async () => {
    const user = userEvent.setup();
    const input = createRegisterInput();

    await user.type(screen.getByLabelText("Nome completo"), input.name);
    await user.type(screen.getByLabelText("E-mail"), INVALID_EMAIL);
    await user.type(screen.getByLabelText("Senha"), input.password);
    await user.type(screen.getByLabelText("Confirmar senha"), input.confirmPassword);
    await user.click(screen.getByRole("button", { name: "Criar conta" }));

    expect(await screen.findByText(/e-mail válido/i)).toBeInTheDocument();
  });

  // Evita: aceitar senhas que não coincidem, gerando cadastro com senha desconhecida
  it("shows validation error when passwords do not match", async () => {
    const user = userEvent.setup();
    const input = createRegisterInput();

    await user.type(screen.getByLabelText("Nome completo"), input.name);
    await user.type(screen.getByLabelText("E-mail"), input.email);
    await user.type(screen.getByLabelText("Senha"), input.password);
    await user.type(screen.getByLabelText("Confirmar senha"), "OutraSenha");
    await user.click(screen.getByRole("button", { name: "Criar conta" }));

    expect(await screen.findByText(/senhas não coincidem/i)).toBeInTheDocument();
  });

  // Evita: inputs sem autocomplete, forçando digitação manual (UX ruim)
  it("has autocomplete attributes for all fields", () => {
    expect(screen.getByLabelText("Nome completo")).toHaveAttribute("autoComplete", "name");
    expect(screen.getByLabelText("E-mail")).toHaveAttribute("autoComplete", "email");
    expect(screen.getByLabelText("Senha")).toHaveAttribute("autoComplete", "new-password");
    expect(screen.getByLabelText("Confirmar senha")).toHaveAttribute("autoComplete", "new-password");
  });
});
