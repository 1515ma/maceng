import {
  formatSupabaseAuthHashMessage,
  parseSupabaseAuthHash,
} from "@/lib/parse-supabase-auth-hash";

describe("parseSupabaseAuthHash", () => {
  // Evita: fragmento vazio crashar o parser ou retornar mensagem enganosa
  it("retorna vazio quando não há hash", () => {
    expect(parseSupabaseAuthHash("")).toEqual({
      error: null,
      errorCode: null,
      errorDescription: null,
    });
  });

  // Evita: URL real do Supabase (otp expirado) não ser interpretada
  it("extrai error, error_code e error_description do hash Supabase", () => {
    const hash =
      "#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired&sb=";
    const parsed = parseSupabaseAuthHash(hash);
    expect(parsed.error).toBe("access_denied");
    expect(parsed.errorCode).toBe("otp_expired");
    expect(parsed.errorDescription).toContain("invalid");
    expect(parsed.errorDescription).toContain("expired");
  });
});

describe("formatSupabaseAuthHashMessage", () => {
  // Evita: usuário ver ingles tecnico do Supabase em vez de orientacao clara
  it("traduz otp_expired para instrucao em portugues", () => {
    const msg = formatSupabaseAuthHashMessage({ errorCode: "otp_expired", error: "access_denied" });
    expect(msg).toMatch(/expir/i);
    expect(msg).toMatch(/novo/i);
  });

  // Evita: codigo desconhecido deixar tela sem feedback
  it("retorna mensagem generica para codigo desconhecido", () => {
    const msg = formatSupabaseAuthHashMessage({ errorCode: "unknown_x", error: "access_denied" });
    expect(msg).toMatch(/autentica|tente/i);
  });
});
