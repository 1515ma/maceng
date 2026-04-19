import { RegisterSchema } from "@/core/schemas/register-schema";
import { createRegisterInput, INVALID_EMAIL, SHORT_PASSWORD } from "@tests/factories";

describe("RegisterSchema (Zod)", () => {
  // Evita: aceitar cadastro sem nome, criando perfil sem identificação no sistema
  it("rejects empty name", () => {
    const result = RegisterSchema.safeParse(createRegisterInput({ name: "" }));
    expect(result.success).toBe(false);
  });

  // Evita: aceitar nome com mais de 200 caracteres, possibilitando payload inflado (DoS via input)
  it("rejects name longer than 200 characters", () => {
    const result = RegisterSchema.safeParse(createRegisterInput({ name: "a".repeat(201) }));
    expect(result.success).toBe(false);
  });

  // Evita: aceitar email vazio, permitindo cadastro sem credencial de acesso
  it("rejects empty email", () => {
    const result = RegisterSchema.safeParse(createRegisterInput({ email: "" }));
    expect(result.success).toBe(false);
  });

  // Evita: aceitar string sem formato de email, gerando erro no Supabase Auth ao invés de feedback claro
  it("rejects invalid email format", () => {
    const result = RegisterSchema.safeParse(createRegisterInput({ email: INVALID_EMAIL }));
    expect(result.success).toBe(false);
  });

  // Evita: aceitar senha com menos de 6 caracteres, abaixo do mínimo para segurança
  it("rejects password shorter than 6 characters", () => {
    const result = RegisterSchema.safeParse(
      createRegisterInput({ password: SHORT_PASSWORD, confirmPassword: SHORT_PASSWORD })
    );
    expect(result.success).toBe(false);
  });

  // Evita: aceitar senhas que não coincidem, gerando frustração e erro silencioso no cadastro
  it("rejects when passwords do not match", () => {
    const result = RegisterSchema.safeParse(createRegisterInput({ confirmPassword: "OutraSenha1" }));
    expect(result.success).toBe(false);
  });

  // Evita: bloquear cadastro com dados válidos por validação excessivamente restritiva
  it("accepts valid registration data", () => {
    const result = RegisterSchema.safeParse(createRegisterInput());
    expect(result.success).toBe(true);
  });

  // Evita: aceitar campos extras no payload, que poderiam forçar plano ou role (mass assignment)
  it("strips unknown fields from input", () => {
    const result = RegisterSchema.safeParse({ ...createRegisterInput(), plan: "max", admin: true });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).not.toHaveProperty("plan");
      expect(result.data).not.toHaveProperty("admin");
    }
  });
});
