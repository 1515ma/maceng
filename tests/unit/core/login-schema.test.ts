import { LoginSchema } from "@/core/schemas/login-schema";

describe("LoginSchema (Zod)", () => {
  // Evita: aceitar email vazio ou sem formato válido, permitindo requests inválidos ao backend
  it("rejects empty email", () => {
    const result = LoginSchema.safeParse({ email: "", password: "Senh@123" });
    expect(result.success).toBe(false);
  });

  // Evita: aceitar string sem formato de email (ex: "abc"), gerando erro obscuro no backend em vez de feedback claro
  it("rejects invalid email format", () => {
    const result = LoginSchema.safeParse({ email: "nao-e-email", password: "Senh@123" });
    expect(result.success).toBe(false);
  });

  // Evita: aceitar senha vazia, permitindo login sem credencial
  it("rejects empty password", () => {
    const result = LoginSchema.safeParse({ email: "user@example.com", password: "" });
    expect(result.success).toBe(false);
  });

  // Evita: aceitar senha com menos de 6 caracteres, abaixo do mínimo aceitável para segurança
  it("rejects password shorter than 6 characters", () => {
    const result = LoginSchema.safeParse({ email: "user@example.com", password: "12345" });
    expect(result.success).toBe(false);
  });

  // Evita: bloquear login com dados válidos por validação excessivamente restritiva
  it("accepts valid email and password", () => {
    const result = LoginSchema.safeParse({ email: "user@example.com", password: "Senh@123" });
    expect(result.success).toBe(true);
  });

  // Evita: aceitar campos extras no payload, que poderiam ser usados para injeção de dados (mass assignment)
  it("strips unknown fields from input", () => {
    const result = LoginSchema.safeParse({
      email: "user@example.com",
      password: "Senh@123",
      admin: true,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).not.toHaveProperty("admin");
    }
  });
});
