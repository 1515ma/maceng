import { createAuthLogger, hashEmail } from "@/infra/logging/auth-logger";

describe("authLogger", () => {
  // Evita: email em plaintext nos logs (violação LGPD/GDPR — PII)
  it("hashEmail retorna hash SHA-256 em hex, nunca o email original", () => {
    const digest = hashEmail("user@example.com");
    expect(digest).toMatch(/^[0-9a-f]{64}$/);
    expect(digest).not.toContain("user");
    expect(digest).not.toContain("example");
  });

  // Evita: normalizações diferentes gerarem hashes diferentes para o mesmo usuário
  it("hashEmail normaliza (lowercase + trim) antes de hashear", () => {
    expect(hashEmail("User@Example.com ")).toBe(hashEmail("user@example.com"));
  });

  // Evita: log poluindo stdout e quebrando testes — o logger aceita sink injetável
  it("emite eventos como JSON estruturado com timestamp e tipo", () => {
    const sink = jest.fn();
    const logger = createAuthLogger({ sink });

    logger.logEvent({
      type: "password_reset_requested",
      email: "user@example.com",
      ip: "1.2.3.4",
      success: true,
    });

    expect(sink).toHaveBeenCalledTimes(1);
    const record = sink.mock.calls[0][0];
    expect(record).toEqual(
      expect.objectContaining({
        type: "password_reset_requested",
        success: true,
        ip: "1.2.3.4",
        emailHash: expect.stringMatching(/^[0-9a-f]{64}$/),
        timestamp: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
      }),
    );
    // Garantia crítica: email em plaintext NUNCA vai pro sink
    expect(JSON.stringify(record)).not.toContain("user@example.com");
    expect(record).not.toHaveProperty("email");
  });

  // Evita: falhas de autenticação passarem despercebidas (DevSecOps: anomaly detection)
  it("logEvent marca falhas com severity=warn para facilitar alerting", () => {
    const sink = jest.fn();
    const logger = createAuthLogger({ sink });

    logger.logEvent({
      type: "login_failed",
      email: "bad@example.com",
      ip: "5.6.7.8",
      success: false,
      reason: "invalid_credentials",
    });

    expect(sink.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        severity: "warn",
        reason: "invalid_credentials",
      }),
    );
  });

  // Evita: sucesso ser rotulado como warn e poluir dashboards de alerta
  it("eventos de sucesso usam severity=info", () => {
    const sink = jest.fn();
    const logger = createAuthLogger({ sink });

    logger.logEvent({
      type: "password_reset_requested",
      email: "ok@example.com",
      ip: "1.1.1.1",
      success: true,
    });

    expect(sink.mock.calls[0][0]).toEqual(
      expect.objectContaining({ severity: "info" }),
    );
  });
});
