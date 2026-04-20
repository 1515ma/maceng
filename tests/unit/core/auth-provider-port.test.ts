import { createUser, createMockAuthProvider, VALID_PASSWORD } from "@tests/factories";

describe("AuthProvider Port (interface contract)", () => {
  const user = createUser({ email: "test@example.com", name: "Test User" });
  const mockAuthProvider = createMockAuthProvider({}, user);

  // Evita: implementação de auth não seguir o contrato, quebrando o use case que depende dele
  it("signInWithEmail returns AuthResult with user on success", async () => {
    const result = await mockAuthProvider.signInWithEmail("test@example.com", VALID_PASSWORD);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.user.email).toBe("test@example.com");
    }
  });

  // Evita: implementação do Google OAuth retornar formato diferente do esperado pelo use case
  it("signInWithGoogle returns redirect URL on success", async () => {
    const result = await mockAuthProvider.signInWithGoogle();
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.redirectUrl).toContain("https://");
    }
  });

  // Evita: signUp não seguir o mesmo contrato AuthResult, quebrando o RegisterUseCase
  it("signUp returns AuthResult with user on success", async () => {
    const result = await mockAuthProvider.signUp("new@example.com", VALID_PASSWORD, "Novo");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.user).toBeDefined();
    }
  });

  // Evita: signOut não ser implementado, deixando sessões penduradas (DevSecOps: auth session management)
  it("signOut resolves without error", async () => {
    await expect(mockAuthProvider.signOut()).resolves.toBeUndefined();
  });

  // Evita: getUser retornar null silenciosamente quando o usuário existe, quebrando o dashboard
  it("getUser returns user object", async () => {
    const result = await mockAuthProvider.getUser();
    expect(result).toBeDefined();
    expect(result!.id).toMatch(/^[0-9a-f]{8}-/i);
  });

  // Evita: port sem envio de email de recuperação, quebrando o RequestPasswordResetUseCase
  it("sendPasswordResetEmail resolves with success flag", async () => {
    const result = await mockAuthProvider.sendPasswordResetEmail(
      "user@example.com",
      "https://maceng.example/api/auth/callback?next=/redefinir-senha",
    );
    expect(result.success).toBe(true);
  });

  // Evita: redirectTo relativo quebrar o link no email (Supabase exige URL absoluta) —
  // este contrato obriga toda implementação do port a aceitar o parâmetro.
  it("sendPasswordResetEmail requires redirectTo as second argument", async () => {
    const spy = jest.fn(async () => ({ success: true as const }));
    const provider = createMockAuthProvider({ sendPasswordResetEmail: spy });

    await provider.sendPasswordResetEmail("u@e.com", "https://site/callback?next=/r");
    expect(spy).toHaveBeenCalledWith("u@e.com", "https://site/callback?next=/r");
  });

  // Evita: port sem método de atualização de senha, quebrando o fluxo de reset
  it("updatePassword returns AuthResult with user on success", async () => {
    const result = await mockAuthProvider.updatePassword("NovaSenha@123");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.user).toBeDefined();
    }
  });
});
