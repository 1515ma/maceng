import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "@/components/auth/login-form";
import { createLoginInput, INVALID_EMAIL } from "@tests/factories";

jest.mock("@/adapters/http/auth-client", () => ({
  postLogin: jest.fn(),
}));

import { postLogin } from "@/adapters/http/auth-client";
import { useRouter } from "next/navigation";

const postLoginMock = postLogin as jest.Mock;
const routerPush = jest.fn();
const routerRefresh = jest.fn();

beforeEach(() => {
  postLoginMock.mockReset();
  routerPush.mockReset();
  routerRefresh.mockReset();
  (useRouter as jest.Mock).mockReturnValue({
    push: routerPush,
    refresh: routerRefresh,
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
  });
});

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
    const { password } = createLoginInput();

    await user.type(screen.getByLabelText("E-mail"), INVALID_EMAIL);
    await user.type(screen.getByLabelText("Senha"), password);
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    expect(await screen.findByText(/e-mail válido/i)).toBeInTheDocument();
  });

  // Evita: aceitar senha curta no front, desperdiçando request e dando UX ruim ao invés de feedback imediato
  it("shows validation error for short password on submit", async () => {
    const user = userEvent.setup();
    const { email } = createLoginInput();

    await user.type(screen.getByLabelText("E-mail"), email);
    await user.type(screen.getByLabelText("Senha"), "123");
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    expect(await screen.findByText(/pelo menos 6 caracteres/i)).toBeInTheDocument();
  });

  // Evita: input de email sem autocomplete, forçando digitação manual toda vez (UX + acessibilidade)
  it("has autocomplete attributes for email and password", () => {
    expect(screen.getByLabelText("E-mail")).toHaveAttribute("autoComplete", "email");
    expect(screen.getByLabelText("Senha")).toHaveAttribute("autoComplete", "current-password");
  });

  // Evita: submit válido não chamar a API, quebrando o login end-to-end
  it("chama postLogin com email e senha quando submit é válido", async () => {
    postLoginMock.mockResolvedValue({ success: true });
    const user = userEvent.setup();
    const { email, password } = createLoginInput();

    await user.type(screen.getByLabelText("E-mail"), email);
    await user.type(screen.getByLabelText("Senha"), password);
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    await waitFor(() => expect(postLoginMock).toHaveBeenCalledWith(email, password));
  });

  // Evita: após login bem-sucedido, usuário ficar na tela de login por falta de redirect
  it("redireciona para /dashboard após login bem-sucedido", async () => {
    postLoginMock.mockResolvedValue({ success: true });
    const user = userEvent.setup();
    const { email, password } = createLoginInput();

    await user.type(screen.getByLabelText("E-mail"), email);
    await user.type(screen.getByLabelText("Senha"), password);
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    await waitFor(() => expect(routerPush).toHaveBeenCalledWith("/dashboard"));
    expect(routerRefresh).toHaveBeenCalled();
  });

  // Evita: erro do servidor não aparecer na tela, deixando o usuário sem saber o motivo da falha
  it("exibe mensagem de erro retornada pela API", async () => {
    postLoginMock.mockResolvedValue({ success: false, error: "Credenciais inválidas" });
    const user = userEvent.setup();
    const { email, password } = createLoginInput();

    await user.type(screen.getByLabelText("E-mail"), email);
    await user.type(screen.getByLabelText("Senha"), password);
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Credenciais inválidas");
    expect(routerPush).not.toHaveBeenCalled();
  });

  // Evita: double-submit, gerando múltiplas tentativas de login enquanto a primeira está pendente
  it("desabilita o botão durante o envio", async () => {
    let resolveFn: (v: { success: boolean }) => void = () => {};
    postLoginMock.mockReturnValue(
      new Promise<{ success: boolean }>((resolve) => {
        resolveFn = resolve;
      }),
    );
    const user = userEvent.setup();
    const { email, password } = createLoginInput();

    await user.type(screen.getByLabelText("E-mail"), email);
    await user.type(screen.getByLabelText("Senha"), password);
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    const button = screen.getByRole("button", { name: /Entrando/i });
    expect(button).toBeDisabled();

    resolveFn({ success: true });
    await waitFor(() => expect(routerPush).toHaveBeenCalled());
  });
});
