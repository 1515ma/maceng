import { RegisterUseCase } from "@/core/use-cases/register";
import type { AuthProvider, AuthResult } from "@/core/ports/auth-provider";
import type { User } from "@/core/entities/user";

const mockUser: User = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  email: "novo@example.com",
  name: "Novo User",
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

describe("RegisterUseCase", () => {
  // Evita: cadastro aceitar nome vazio, criando conta sem identificação
  it("rejects empty name before calling auth provider", async () => {
    const mock = createMockAuthProvider();
    const useCase = new RegisterUseCase(mock);

    const result = await useCase.execute("", "novo@example.com", "Senh@123", "Senh@123");

    expect(result.success).toBe(false);
    expect(mock.signUp).not.toHaveBeenCalled();
  });

  // Evita: cadastro aceitar email inválido, gastando request no Supabase para falhar lá
  it("rejects invalid email before calling auth provider", async () => {
    const mock = createMockAuthProvider();
    const useCase = new RegisterUseCase(mock);

    const result = await useCase.execute("João", "invalido", "Senh@123", "Senh@123");

    expect(result.success).toBe(false);
    expect(mock.signUp).not.toHaveBeenCalled();
  });

  // Evita: cadastro com senhas diferentes passar validação, gerando conta com senha desconhecida
  it("rejects when passwords do not match", async () => {
    const mock = createMockAuthProvider();
    const useCase = new RegisterUseCase(mock);

    const result = await useCase.execute("João", "novo@example.com", "Senh@123", "OutraSenha");

    expect(result.success).toBe(false);
    expect(mock.signUp).not.toHaveBeenCalled();
  });

  // Evita: dados válidos não chegarem ao provider, bloqueando cadastros legítimos
  it("calls signUp with valid data", async () => {
    const mock = createMockAuthProvider();
    const useCase = new RegisterUseCase(mock);

    const result = await useCase.execute("João", "novo@example.com", "Senh@123", "Senh@123");

    expect(result.success).toBe(true);
    expect(mock.signUp).toHaveBeenCalledWith("novo@example.com", "Senh@123", "João");
  });

  // Evita: retornar sucesso quando o Supabase recusa (ex: email já existe)
  it("returns error when auth provider rejects registration", async () => {
    const mock = createMockAuthProvider({
      signUp: jest.fn(async () => ({ success: false as const, error: "E-mail já cadastrado" })),
    });
    const useCase = new RegisterUseCase(mock);

    const result = await useCase.execute("João", "existe@example.com", "Senh@123", "Senh@123");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("E-mail já cadastrado");
    }
  });

  // Evita: exceção não tratada no provider crashar toda a API route
  it("handles unexpected provider errors gracefully", async () => {
    const mock = createMockAuthProvider({
      signUp: jest.fn(async () => { throw new Error("Timeout"); }),
    });
    const useCase = new RegisterUseCase(mock);

    const result = await useCase.execute("João", "novo@example.com", "Senh@123", "Senh@123");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Erro inesperado");
    }
  });
});
