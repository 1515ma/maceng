import { LoginUseCase } from "@/core/use-cases/login";
import type { AuthProvider, AuthResult } from "@/core/ports/auth-provider";
import type { User } from "@/core/entities/user";

const mockUser: User = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  email: "user@example.com",
  name: "Test User",
  plan: "free",
  calculationsUsed: 0,
  createdAt: new Date(),
};

function createMockAuthProvider(overrides: Partial<AuthProvider> = {}): AuthProvider {
  return {
    signInWithEmail: jest.fn(async (): Promise<AuthResult> => ({ success: true, user: mockUser })),
    signUp: jest.fn(async (): Promise<AuthResult> => ({ success: true, user: mockUser })),
    signInWithGoogle: jest.fn(async () => ({ success: true as const, redirectUrl: "https://google.com" })),
    signOut: jest.fn(async () => {}),
    getUser: jest.fn(async () => mockUser),
    ...overrides,
  };
}

describe("LoginUseCase", () => {
  // Evita: login aceitar email vazio — validação Zod deve rejeitar antes de chegar ao provider
  it("rejects invalid email before calling auth provider", async () => {
    const mock = createMockAuthProvider();
    const useCase = new LoginUseCase(mock);

    const result = await useCase.execute("", "Senh@123");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("e-mail");
    }
    expect(mock.signInWithEmail).not.toHaveBeenCalled();
  });

  // Evita: login aceitar senha curta — validação deve rejeitar antes de gastar request no auth provider
  it("rejects password shorter than 6 chars", async () => {
    const mock = createMockAuthProvider();
    const useCase = new LoginUseCase(mock);

    const result = await useCase.execute("user@example.com", "123");

    expect(result.success).toBe(false);
    expect(mock.signInWithEmail).not.toHaveBeenCalled();
  });

  // Evita: dados válidos não chegarem ao provider, bloqueando o login real
  it("calls auth provider with valid credentials", async () => {
    const mock = createMockAuthProvider();
    const useCase = new LoginUseCase(mock);

    const result = await useCase.execute("user@example.com", "Senh@123");

    expect(result.success).toBe(true);
    expect(mock.signInWithEmail).toHaveBeenCalledWith("user@example.com", "Senh@123");
  });

  // Evita: use case engolir erro do provider e retornar sucesso falso ao usuário
  it("returns user on successful login", async () => {
    const mock = createMockAuthProvider();
    const useCase = new LoginUseCase(mock);

    const result = await useCase.execute("user@example.com", "Senh@123");

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.user.email).toBe("user@example.com");
    }
  });

  // Evita: credenciais erradas retornarem sucesso, causando acesso indevido
  it("returns error when auth provider rejects credentials", async () => {
    const mock = createMockAuthProvider({
      signInWithEmail: jest.fn(async () => ({ success: false as const, error: "Credenciais inválidas" })),
    });
    const useCase = new LoginUseCase(mock);

    const result = await useCase.execute("user@example.com", "SenhaErrada1");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Credenciais inválidas");
    }
  });

  // Evita: exceção não tratada no provider crashar toda a API route
  it("handles unexpected provider errors gracefully", async () => {
    const mock = createMockAuthProvider({
      signInWithEmail: jest.fn(async () => { throw new Error("Network down"); }),
    });
    const useCase = new LoginUseCase(mock);

    const result = await useCase.execute("user@example.com", "Senh@123");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Erro inesperado");
    }
  });
});
