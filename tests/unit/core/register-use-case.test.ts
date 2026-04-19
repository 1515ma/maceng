import { RegisterUseCase } from "@/core/use-cases/register";
import { createUser, createMockAuthProvider, createRegisterInput } from "@tests/factories";

describe("RegisterUseCase", () => {
  const user = createUser({ email: "novo@example.com", name: "Novo User" });
  const input = createRegisterInput({ email: "novo@example.com", name: "João" });

  // Evita: cadastro aceitar nome vazio, criando conta sem identificação
  it("rejects empty name before calling auth provider", async () => {
    const mock = createMockAuthProvider({}, user);
    const useCase = new RegisterUseCase(mock);

    const result = await useCase.execute("", input.email, input.password, input.confirmPassword);

    expect(result.success).toBe(false);
    expect(mock.signUp).not.toHaveBeenCalled();
  });

  // Evita: cadastro aceitar email inválido, gastando request no Supabase para falhar lá
  it("rejects invalid email before calling auth provider", async () => {
    const mock = createMockAuthProvider({}, user);
    const useCase = new RegisterUseCase(mock);

    const result = await useCase.execute("João", "invalido", input.password, input.confirmPassword);

    expect(result.success).toBe(false);
    expect(mock.signUp).not.toHaveBeenCalled();
  });

  // Evita: cadastro com senhas diferentes passar validação, gerando conta com senha desconhecida
  it("rejects when passwords do not match", async () => {
    const mock = createMockAuthProvider({}, user);
    const useCase = new RegisterUseCase(mock);

    const result = await useCase.execute("João", input.email, input.password, "OutraSenha");

    expect(result.success).toBe(false);
    expect(mock.signUp).not.toHaveBeenCalled();
  });

  // Evita: dados válidos não chegarem ao provider, bloqueando cadastros legítimos
  it("calls signUp with valid data", async () => {
    const mock = createMockAuthProvider({}, user);
    const useCase = new RegisterUseCase(mock);

    const result = await useCase.execute(input.name, input.email, input.password, input.confirmPassword);

    expect(result.success).toBe(true);
    expect(mock.signUp).toHaveBeenCalledWith(input.email, input.password, input.name);
  });

  // Evita: retornar sucesso quando o Supabase recusa (ex: email já existe)
  it("returns error when auth provider rejects registration", async () => {
    const mock = createMockAuthProvider({
      signUp: jest.fn(async () => ({ success: false as const, error: "E-mail já cadastrado" })),
    });
    const useCase = new RegisterUseCase(mock);

    const result = await useCase.execute("João", "existe@example.com", input.password, input.confirmPassword);

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

    const result = await useCase.execute(input.name, input.email, input.password, input.confirmPassword);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Erro inesperado");
    }
  });
});
