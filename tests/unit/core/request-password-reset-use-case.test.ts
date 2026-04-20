import { RequestPasswordResetUseCase } from "@/core/use-cases/request-password-reset";
import { createMockAuthProvider, createPasswordResetInput, INVALID_EMAIL } from "@tests/factories";

describe("RequestPasswordResetUseCase", () => {
  const input = createPasswordResetInput();

  // Evita: aceitar email vazio e disparar envio sem destinatário
  it("rejects empty email before calling auth provider", async () => {
    const mock = createMockAuthProvider();
    const useCase = new RequestPasswordResetUseCase(mock);

    const result = await useCase.execute("");

    expect(result.success).toBe(false);
    expect(mock.sendPasswordResetEmail).not.toHaveBeenCalled();
  });

  // Evita: aceitar email inválido, gastando request no provedor para falhar lá
  it("rejects invalid email format before calling auth provider", async () => {
    const mock = createMockAuthProvider();
    const useCase = new RequestPasswordResetUseCase(mock);

    const result = await useCase.execute(INVALID_EMAIL);

    expect(result.success).toBe(false);
    expect(mock.sendPasswordResetEmail).not.toHaveBeenCalled();
  });

  // Evita: pedido válido não chegar ao provider, bloqueando recuperação legítima
  it("calls sendPasswordResetEmail with valid email", async () => {
    const mock = createMockAuthProvider();
    const useCase = new RequestPasswordResetUseCase(mock);

    const result = await useCase.execute(input.email);

    expect(result.success).toBe(true);
    expect(mock.sendPasswordResetEmail).toHaveBeenCalledWith(input.email);
  });

  // Evita: vazar informação sobre existência do email (enumeration) — sempre retornar sucesso genérico
  it("returns success even if email does not exist (no user enumeration)", async () => {
    const mock = createMockAuthProvider({
      sendPasswordResetEmail: jest.fn(async () => ({ success: false as const, error: "E-mail não encontrado" })),
    });
    const useCase = new RequestPasswordResetUseCase(mock);

    const result = await useCase.execute("desconhecido@example.com");

    // DevSecOps: para prevenir user enumeration (OWASP A07), a resposta ao usuário deve ser sempre sucesso
    expect(result.success).toBe(true);
  });

  // Evita: exceção não tratada no provider crashar a API route
  it("handles unexpected provider errors gracefully", async () => {
    const mock = createMockAuthProvider({
      sendPasswordResetEmail: jest.fn(async () => { throw new Error("SMTP down"); }),
    });
    const useCase = new RequestPasswordResetUseCase(mock);

    const result = await useCase.execute(input.email);

    // Mesmo em erro interno, mantém contrato de não vazar detalhes ao cliente
    expect(result.success).toBe(true);
  });
});
