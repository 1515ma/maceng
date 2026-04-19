import { LoginSchema } from "@/core/schemas/login-schema";
import { createLoginInput, INVALID_EMAIL, SHORT_PASSWORD } from "@tests/factories";

describe("LoginSchema (Zod)", () => {
  // Evita: aceitar email vazio ou sem formato válido, permitindo requests inválidos ao backend
  it("rejects empty email", () => {
    const result = LoginSchema.safeParse(createLoginInput({ email: "" }));
    expect(result.success).toBe(false);
  });

  // Evita: aceitar string sem formato de email (ex: "abc"), gerando erro obscuro no backend em vez de feedback claro
  it("rejects invalid email format", () => {
    const result = LoginSchema.safeParse(createLoginInput({ email: INVALID_EMAIL }));
    expect(result.success).toBe(false);
  });

  // Evita: aceitar senha vazia, permitindo login sem credencial
  it("rejects empty password", () => {
    const result = LoginSchema.safeParse(createLoginInput({ password: "" }));
    expect(result.success).toBe(false);
  });

  // Evita: aceitar senha com menos de 6 caracteres, abaixo do mínimo aceitável para segurança
  it("rejects password shorter than 6 characters", () => {
    const result = LoginSchema.safeParse(createLoginInput({ password: SHORT_PASSWORD }));
    expect(result.success).toBe(false);
  });

  // Evita: bloquear login com dados válidos por validação excessivamente restritiva
  it("accepts valid email and password", () => {
    const result = LoginSchema.safeParse(createLoginInput());
    expect(result.success).toBe(true);
  });

  // Evita: aceitar campos extras no payload, que poderiam ser usados para injeção de dados (mass assignment)
  it("strips unknown fields from input", () => {
    const result = LoginSchema.safeParse({
      ...createLoginInput(),
      admin: true,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).not.toHaveProperty("admin");
    }
  });
});
