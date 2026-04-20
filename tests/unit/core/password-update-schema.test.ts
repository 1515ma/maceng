import { PasswordUpdateSchema } from "@/core/schemas/password-update-schema";
import { SHORT_PASSWORD, VALID_PASSWORD } from "@tests/factories";

describe("PasswordUpdateSchema (Zod)", () => {
  const validInput = {
    password: VALID_PASSWORD,
    confirmPassword: VALID_PASSWORD,
  };

  // Evita: aceitar senha vazia, permitindo conta sem credencial após reset
  it("rejects empty password", () => {
    const result = PasswordUpdateSchema.safeParse({ ...validInput, password: "", confirmPassword: "" });
    expect(result.success).toBe(false);
  });

  // Evita: aceitar senha curta após reset, fragilizando conta já comprometida
  it("rejects password shorter than 6 characters", () => {
    const result = PasswordUpdateSchema.safeParse({
      password: SHORT_PASSWORD,
      confirmPassword: SHORT_PASSWORD,
    });
    expect(result.success).toBe(false);
  });

  // Evita: senhas divergentes passarem, gerando conta com senha desconhecida pelo usuário
  it("rejects when passwords do not match", () => {
    const result = PasswordUpdateSchema.safeParse({
      ...validInput,
      confirmPassword: "OutraSenha1",
    });
    expect(result.success).toBe(false);
  });

  // Evita: bloquear atualização legítima de senha por validação restritiva demais
  it("accepts valid matching passwords", () => {
    const result = PasswordUpdateSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  // Evita: aceitar campos extras que poderiam forçar role/plan (mass assignment)
  it("strips unknown fields from input", () => {
    const result = PasswordUpdateSchema.safeParse({
      ...validInput,
      plan: "max",
      admin: true,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).not.toHaveProperty("plan");
      expect(result.data).not.toHaveProperty("admin");
    }
  });
});
