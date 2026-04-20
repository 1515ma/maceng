import { PasswordResetSchema } from "@/core/schemas/password-reset-schema";
import { INVALID_EMAIL } from "@tests/factories";

describe("PasswordResetSchema (Zod)", () => {
  // Evita: aceitar email vazio, disparando envio de email sem destinatário
  it("rejects empty email", () => {
    const result = PasswordResetSchema.safeParse({ email: "" });
    expect(result.success).toBe(false);
  });

  // Evita: aceitar string sem formato de email, causando erro obscuro no provedor de email
  it("rejects invalid email format", () => {
    const result = PasswordResetSchema.safeParse({ email: INVALID_EMAIL });
    expect(result.success).toBe(false);
  });

  // Evita: bloquear pedido de recuperação legítimo por validação restritiva demais
  it("accepts valid email", () => {
    const result = PasswordResetSchema.safeParse({ email: "user@example.com" });
    expect(result.success).toBe(true);
  });

  // Evita: aceitar campos extras que poderiam ser usados para mass assignment (ex: newPassword direto)
  it("strips unknown fields from input", () => {
    const result = PasswordResetSchema.safeParse({
      email: "user@example.com",
      newPassword: "hackeada",
      admin: true,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).not.toHaveProperty("newPassword");
      expect(result.data).not.toHaveProperty("admin");
    }
  });
});
