import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SignOutButton } from "@/components/auth/sign-out-button";

describe("SignOutButton", () => {
  // Evita: botão não renderizar, impossibilitando o logout do usuário
  it("renders the button with accessible text", () => {
    render(<SignOutButton onSignOut={async () => {}} />);
    expect(screen.getByRole("button", { name: /Sair/i })).toBeInTheDocument();
  });

  // Evita: handler de logout não ser chamado, deixando a sessão ativa em memória/cookies
  it("calls onSignOut when clicked", async () => {
    const user = userEvent.setup();
    const onSignOut = jest.fn(async () => {});
    render(<SignOutButton onSignOut={onSignOut} />);

    await user.click(screen.getByRole("button"));

    expect(onSignOut).toHaveBeenCalledTimes(1);
  });
});
