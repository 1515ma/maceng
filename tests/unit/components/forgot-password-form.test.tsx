import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { createPasswordResetInput, INVALID_EMAIL } from "@tests/factories";

jest.mock("@/adapters/http/auth-client", () => ({
  postPasswordReset: jest.fn(),
}));

import { postPasswordReset } from "@/adapters/http/auth-client";

const postPasswordResetMock = postPasswordReset as jest.Mock;

beforeEach(() => {
  postPasswordResetMock.mockReset();
  postPasswordResetMock.mockResolvedValue({ success: true });
});

describe("ForgotPasswordForm", () => {
  beforeEach(() => {
    render(<ForgotPasswordForm />);
  });

  // Evita: campo de email não existir, impossibilitando o pedido de recuperação
  it("renders email input with correct type", () => {
    const input = screen.getByLabelText("E-mail");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "email");
  });

  // Evita: input sem autocomplete, forçando digitação manual (UX ruim)
  it("email input has autocomplete attribute", () => {
    expect(screen.getByLabelText("E-mail")).toHaveAttribute("autoComplete", "email");
  });

  // Evita: botão de submit ausente, impossibilitando o envio do formulário
  it("renders submit button", () => {
    expect(screen.getByRole("button", { name: /Enviar link/i })).toBeInTheDocument();
  });

  // Evita: usuário sem opção de voltar ao login, forçando navegação manual na URL
  it("renders link back to login page", () => {
    const link = screen.getByText(/Voltar ao login/i).closest("a");
    expect(link).toHaveAttribute("href", "/login");
  });

  // Evita: submeter email inválido ao backend, gastando request para falhar lá
  it("shows validation error for invalid email on submit", async () => {
    const user = userEvent.setup();

    await user.type(screen.getByLabelText("E-mail"), INVALID_EMAIL);
    await user.click(screen.getByRole("button", { name: /Enviar link/i }));

    expect(await screen.findByText(/e-mail válido/i)).toBeInTheDocument();
  });

  // Evita: não dar feedback visual após o envio, deixando o usuário sem saber se foi enviado
  it("shows success message after valid email submission", async () => {
    const user = userEvent.setup();
    const input = createPasswordResetInput();

    await user.type(screen.getByLabelText("E-mail"), input.email);
    await user.click(screen.getByRole("button", { name: /Enviar link/i }));

    // DevSecOps: mensagem genérica (sem confirmar se o email existe) — previne user enumeration
    expect(await screen.findByText(/Se o e-mail estiver cadastrado/i)).toBeInTheDocument();
  });

  // Evita: submit não chamar a API de reset, impedindo envio real do link
  it("chama postPasswordReset com o email informado", async () => {
    const user = userEvent.setup();
    const input = createPasswordResetInput();

    await user.type(screen.getByLabelText("E-mail"), input.email);
    await user.click(screen.getByRole("button", { name: /Enviar link/i }));

    await waitFor(() => expect(postPasswordResetMock).toHaveBeenCalledWith(input.email));
  });

  // Evita: 429/limite (app ou rede) exibir a mesma mensagem de sucesso, enganando o usuário
  it("mostra erro do servidor em falha (ex. limite de pedidos) em vez de sucesso genérico", async () => {
    postPasswordResetMock.mockResolvedValueOnce({ success: false, error: "Limite hoje" });
    const user = userEvent.setup();
    const input = createPasswordResetInput();

    await user.type(screen.getByLabelText("E-mail"), input.email);
    await user.click(screen.getByRole("button", { name: /Enviar link/i }));

    expect(await screen.findByText(/limite hoje/i)).toBeInTheDocument();
    expect(screen.queryByText(/Se o e-mail estiver cadastrado/i)).not.toBeInTheDocument();
  });
});
