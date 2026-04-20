import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { createPasswordUpdateInput, SHORT_PASSWORD } from "@tests/factories";

jest.mock("@/adapters/http/auth-client", () => ({
  postPasswordUpdate: jest.fn(),
}));

import { postPasswordUpdate } from "@/adapters/http/auth-client";
import { useRouter } from "next/navigation";

const postPasswordUpdateMock = postPasswordUpdate as jest.Mock;
const routerPush = jest.fn();
const routerRefresh = jest.fn();

beforeEach(() => {
  postPasswordUpdateMock.mockReset();
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

describe("ResetPasswordForm", () => {
  beforeEach(() => {
    render(<ResetPasswordForm />);
  });

  // Evita: campo de nova senha não existir, impossibilitando o reset
  it("renders new password input masked", () => {
    const input = screen.getByLabelText("Nova senha");
    expect(input).toHaveAttribute("type", "password");
  });

  // Evita: campo de confirmação ausente, permitindo erro silencioso de digitação na nova senha
  it("renders confirm password input masked", () => {
    const input = screen.getByLabelText("Confirmar nova senha");
    expect(input).toHaveAttribute("type", "password");
  });

  // Evita: inputs sem autocomplete correto — browsers devem saber que é nova senha
  it("inputs have autocomplete=new-password", () => {
    expect(screen.getByLabelText("Nova senha")).toHaveAttribute("autoComplete", "new-password");
    expect(screen.getByLabelText("Confirmar nova senha")).toHaveAttribute("autoComplete", "new-password");
  });

  // Evita: botão de submit ausente, impossibilitando concluir o reset
  it("renders submit button", () => {
    expect(screen.getByRole("button", { name: /Redefinir senha/i })).toBeInTheDocument();
  });

  // Evita: aceitar senha curta no front, desperdiçando request ao backend
  it("shows validation error for short password on submit", async () => {
    const user = userEvent.setup();

    await user.type(screen.getByLabelText("Nova senha"), SHORT_PASSWORD);
    await user.type(screen.getByLabelText("Confirmar nova senha"), SHORT_PASSWORD);
    await user.click(screen.getByRole("button", { name: /Redefinir senha/i }));

    expect(await screen.findByText(/pelo menos 6 caracteres/i)).toBeInTheDocument();
  });

  // Evita: senhas divergentes passarem silenciosamente, gerando conta com senha desconhecida
  it("shows validation error when passwords do not match", async () => {
    const user = userEvent.setup();
    const input = createPasswordUpdateInput();

    await user.type(screen.getByLabelText("Nova senha"), input.password);
    await user.type(screen.getByLabelText("Confirmar nova senha"), "OutraSenha");
    await user.click(screen.getByRole("button", { name: /Redefinir senha/i }));

    expect(await screen.findByText(/senhas não coincidem/i)).toBeInTheDocument();
  });

  // Evita: reset válido não chamar a API, deixando a senha antiga ativa
  it("chama postPasswordUpdate com as duas senhas quando válido", async () => {
    postPasswordUpdateMock.mockResolvedValue({ success: true });
    const user = userEvent.setup();
    const input = createPasswordUpdateInput();

    await user.type(screen.getByLabelText("Nova senha"), input.password);
    await user.type(screen.getByLabelText("Confirmar nova senha"), input.confirmPassword);
    await user.click(screen.getByRole("button", { name: /Redefinir senha/i }));

    await waitFor(() =>
      expect(postPasswordUpdateMock).toHaveBeenCalledWith(input.password, input.confirmPassword),
    );
  });

  // Evita: após redefinir, usuário continuar na tela em vez de ir ao dashboard já logado
  it("redireciona para /dashboard após sucesso", async () => {
    postPasswordUpdateMock.mockResolvedValue({ success: true });
    const user = userEvent.setup();
    const input = createPasswordUpdateInput();

    await user.type(screen.getByLabelText("Nova senha"), input.password);
    await user.type(screen.getByLabelText("Confirmar nova senha"), input.confirmPassword);
    await user.click(screen.getByRole("button", { name: /Redefinir senha/i }));

    await waitFor(() => expect(routerPush).toHaveBeenCalledWith("/dashboard"));
  });

  // Evita: erro (token expirado etc.) não ser mostrado, deixando o usuário sem diagnóstico
  it("exibe mensagem de erro retornada pela API", async () => {
    postPasswordUpdateMock.mockResolvedValue({ success: false, error: "Link expirado" });
    const user = userEvent.setup();
    const input = createPasswordUpdateInput();

    await user.type(screen.getByLabelText("Nova senha"), input.password);
    await user.type(screen.getByLabelText("Confirmar nova senha"), input.confirmPassword);
    await user.click(screen.getByRole("button", { name: /Redefinir senha/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Link expirado");
  });
});
