import { LoginUseCase } from "@/core/use-cases/login";
import { createUser, createMockAuthProvider, createLoginInput, VALID_PASSWORD } from "@tests/factories";

describe("LoginUseCase", () => {
  const user = createUser({ email: "user@example.com", name: "Test User" });
  const input = createLoginInput();

  // Evita: login aceitar email vazio — validação Zod deve rejeitar antes de chegar ao provider
  it("rejects invalid email before calling auth provider", async () => {
    const mock = createMockAuthProvider({}, user);
    const useCase = new LoginUseCase(mock);

    const result = await useCase.execute("", VALID_PASSWORD);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("e-mail");
    }
    expect(mock.signInWithEmail).not.toHaveBeenCalled();
  });

  // Evita: login aceitar senha curta — validação deve rejeitar antes de gastar request no auth provider
  it("rejects password shorter than 6 chars", async () => {
    const mock = createMockAuthProvider({}, user);
    const useCase = new LoginUseCase(mock);

    const result = await useCase.execute(input.email, "123");

    expect(result.success).toBe(false);
    expect(mock.signInWithEmail).not.toHaveBeenCalled();
  });

  // Evita: dados válidos não chegarem ao provider, bloqueando o login real
  it("calls auth provider with valid credentials", async () => {
    const mock = createMockAuthProvider({}, user);
    const useCase = new LoginUseCase(mock);

    const result = await useCase.execute(input.email, input.password);

    expect(result.success).toBe(true);
    expect(mock.signInWithEmail).toHaveBeenCalledWith(input.email, input.password);
  });

  // Evita: use case engolir erro do provider e retornar sucesso falso ao usuário
  it("returns user on successful login", async () => {
    const mock = createMockAuthProvider({}, user);
    const useCase = new LoginUseCase(mock);

    const result = await useCase.execute(input.email, input.password);

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

    const result = await useCase.execute(input.email, "SenhaErrada1");

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

    const result = await useCase.execute(input.email, input.password);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Erro inesperado");
    }
  });
});
