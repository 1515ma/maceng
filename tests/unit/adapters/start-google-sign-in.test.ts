import { performGoogleSignIn } from "@/adapters/http/google-sign-in";
import { createMockAuthProvider } from "@tests/factories";

describe("performGoogleSignIn (adapter)", () => {
  // Evita: adapter silenciar erro do provider e deixar o usuário travado na tela de login
  it("throws when provider returns failure", async () => {
    const authProvider = createMockAuthProvider({
      signInWithGoogle: jest.fn(async () => ({ success: false as const, error: "oauth_config" })),
    });
    const redirect = jest.fn();

    await expect(performGoogleSignIn(authProvider, redirect)).rejects.toThrow("oauth_config");
    // Evita: redirect ser disparado mesmo em falha, levando o usuário a uma URL inválida
    expect(redirect).not.toHaveBeenCalled();
  });

  // Evita: adapter não redirecionar após obter a URL do Supabase, quebrando o fluxo OAuth
  it("redirects to the URL returned by the provider on success", async () => {
    const authProvider = createMockAuthProvider({
      signInWithGoogle: jest.fn(async () => ({
        success: true as const,
        redirectUrl: "https://accounts.google.com/oauth?session=abc",
      })),
    });
    const redirect = jest.fn();

    await performGoogleSignIn(authProvider, redirect);

    expect(redirect).toHaveBeenCalledWith("https://accounts.google.com/oauth?session=abc");
  });

  // Evita: exceção de rede não tratada crashar a UI sem mensagem de erro ao usuário
  it("propagates provider exceptions to the caller", async () => {
    const authProvider = createMockAuthProvider({
      signInWithGoogle: jest.fn(async () => { throw new Error("network_down"); }),
    });
    const redirect = jest.fn();

    await expect(performGoogleSignIn(authProvider, redirect)).rejects.toThrow("network_down");
  });
});
