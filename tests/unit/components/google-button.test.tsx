import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GoogleButton } from "@/components/auth/google-button";

describe("GoogleButton", () => {
  // Evita: botão renderizar sem o rótulo, deixando o usuário sem contexto do que a ação faz
  it("renders the provided label", () => {
    render(<GoogleButton label="Entrar com Google" onClick={() => {}} />);
    expect(screen.getByRole("button", { name: /Entrar com Google/i })).toBeInTheDocument();
  });

  // Evita: botão sem type=button submeter o formulário ao redor (bug crítico em forms de auth)
  it("has type=button to avoid submitting surrounding forms", () => {
    render(<GoogleButton label="Google" onClick={() => {}} />);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  // Evita: clique não disparar ação, deixando o login social inoperante (regressão principal)
  it("calls onClick when the user clicks the button", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(<GoogleButton label="Entrar com Google" onClick={onClick} />);

    await user.click(screen.getByRole("button"));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  // Evita: múltiplos cliques durante OAuth em curso criarem N redirects/conexões duplicadas
  it("is disabled while loading=true", () => {
    render(<GoogleButton label="Google" onClick={() => {}} loading />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  // Evita: ausência de feedback visual durante loading, dando impressão de travamento
  it("shows loading text when loading=true", () => {
    render(<GoogleButton label="Entrar com Google" onClick={() => {}} loading />);
    expect(screen.getByRole("button")).toHaveTextContent(/Conectando/i);
  });

  // Evita: ícone do Google sumir em refactors, quebrando reconhecimento visual da marca
  it("renders Google SVG icon", () => {
    const { container } = render(<GoogleButton label="Google" onClick={() => {}} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});
