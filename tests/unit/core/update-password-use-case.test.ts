import { UpdatePasswordUseCase } from "@/core/use-cases/update-password";
import { createMockAuthProvider, createPasswordUpdateInput, SHORT_PASSWORD } from "@tests/factories";

describe("UpdatePasswordUseCase", () => {
  const input = createPasswordUpdateInput();

  // Evita: atualização aceitar senha curta após clique no link do email
  it("rejects password shorter than 6 chars before calling provider", async () => {
    const mock = createMockAuthProvider();
    const useCase = new UpdatePasswordUseCase(mock);

    const result = await useCase.execute(SHORT_PASSWORD, SHORT_PASSWORD);

    expect(result.success).toBe(false);
    expect(mock.updatePassword).not.toHaveBeenCalled();
  });

  // Evita: senhas divergentes passarem, resultando em conta com senha desconhecida
  it("rejects when passwords do not match", async () => {
    const mock = createMockAuthProvider();
    const useCase = new UpdatePasswordUseCase(mock);

    const result = await useCase.execute(input.password, "OutraSenha");

    expect(result.success).toBe(false);
    expect(mock.updatePassword).not.toHaveBeenCalled();
  });

  // Evita: senha válida não chegar ao provider, bloqueando o reset legítimo
  it("calls updatePassword with valid data", async () => {
    const mock = createMockAuthProvider();
    const useCase = new UpdatePasswordUseCase(mock);

    const result = await useCase.execute(input.password, input.confirmPassword);

    expect(result.success).toBe(true);
    expect(mock.updatePassword).toHaveBeenCalledWith(input.password);
  });

  // Evita: retornar sucesso quando o Supabase recusa (ex: token de reset expirado)
  it("returns error when auth provider rejects update", async () => {
    const mock = createMockAuthProvider({
      updatePassword: jest.fn(async () => ({ success: false as const, error: "Token expirado" })),
    });
    const useCase = new UpdatePasswordUseCase(mock);

    const result = await useCase.execute(input.password, input.confirmPassword);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Token expirado");
    }
  });

  // Evita: exceção não tratada no provider crashar a API route
  it("handles unexpected provider errors gracefully", async () => {
    const mock = createMockAuthProvider({
      updatePassword: jest.fn(async () => { throw new Error("Network down"); }),
    });
    const useCase = new UpdatePasswordUseCase(mock);

    const result = await useCase.execute(input.password, input.confirmPassword);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Erro inesperado");
    }
  });
});
