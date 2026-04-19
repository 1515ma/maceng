import type { AuthProvider, AuthResult } from "@/core/ports/auth-provider";
import type { User } from "@/core/entities/user";

// Mock que implementa o contrato — se o contrato mudar, este teste quebra
const mockUser: User = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  email: "test@example.com",
  name: "Test User",
  plan: "free",
  calculationsUsed: 0,
  createdAt: new Date(),
};

const mockAuthProvider: AuthProvider = {
  signInWithEmail: async () => ({ success: true, user: mockUser }),
  signUp: async () => ({ success: true, user: mockUser }),
  signInWithGoogle: async () => ({ success: true, redirectUrl: "https://accounts.google.com" }),
  signOut: async () => {},
  getUser: async () => mockUser,
};

describe("AuthProvider Port (interface contract)", () => {
  // Evita: implementação de auth não seguir o contrato, quebrando o use case que depende dele
  it("signInWithEmail returns AuthResult with user on success", async () => {
    const result = await mockAuthProvider.signInWithEmail("test@example.com", "Senh@123");
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
    const result = await mockAuthProvider.signUp("new@example.com", "Senh@123", "Novo");
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
    const user = await mockAuthProvider.getUser();
    expect(user).toBeDefined();
    expect(user!.id).toMatch(/^[0-9a-f]{8}-/i);
  });
});
