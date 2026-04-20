import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { createPasswordUpdateInput, SHORT_PASSWORD } from "@tests/factories";

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
});
