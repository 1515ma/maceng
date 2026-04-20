import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GoogleSignInField } from "@/components/auth/google-sign-in-field";

// Mock do adapter para evitar dependência do browser supabase client.
jest.mock("@/adapters/http/google-sign-in", () => ({
  startGoogleSignIn: jest.fn(),
}));

import { startGoogleSignIn } from "@/adapters/http/google-sign-in";

describe("GoogleSignInField", () => {
  beforeEach(() => {
    (startGoogleSignIn as jest.Mock).mockReset();
  });

  // Evita: campo não renderizar o botão, sumindo o login social da tela
  it("renders the Google button with the given label", () => {
    render(<GoogleSignInField label="Entrar com Google" />);
    expect(screen.getByRole("button", { name: /Entrar com Google/i })).toBeInTheDocument();
  });

  // Evita: clique não disparar o início do OAuth, quebrando o fluxo inteiro
  it("calls startGoogleSignIn when the button is clicked", async () => {
    const user = userEvent.setup();
    (startGoogleSignIn as jest.Mock).mockResolvedValue(undefined);

    render(<GoogleSignInField label="Google" />);
    await user.click(screen.getByRole("button"));

    expect(startGoogleSignIn).toHaveBeenCalledTimes(1);
  });

  // Evita: falha do OAuth não ser exibida ao usuário, deixando a UI em silêncio
  it("shows error message when startGoogleSignIn throws", async () => {
    const user = userEvent.setup();
    (startGoogleSignIn as jest.Mock).mockRejectedValue(new Error("oauth_config_missing"));

    render(<GoogleSignInField label="Google" />);
    await user.click(screen.getByRole("button"));

    expect(await screen.findByRole("alert")).toHaveTextContent("oauth_config_missing");
  });
});
