/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";

const resetPasswordForEmailMock = jest.fn(async () => ({ error: null }));
type CheckResult = { allowed: boolean; remaining: number; retryAfterSeconds: number };
const checkMock: jest.Mock<CheckResult, [string]> = jest.fn(
  (_key: string) => ({ allowed: true, remaining: 4, retryAfterSeconds: 0 }),
);
const logEventMock: jest.Mock = jest.fn();

jest.mock("@/infra/database/supabase-server", () => ({
  createSupabaseServerClient: jest.fn(async () => ({
    auth: {
      resetPasswordForEmail: resetPasswordForEmailMock,
    },
  })),
}));

jest.mock("@/infra/security/rate-limiter", () => ({
  passwordResetLimiter: { check: (key: string) => checkMock(key) },
  loginLimiter: { check: jest.fn(() => ({ allowed: true, remaining: 10, retryAfterSeconds: 0 })) },
  registerLimiter: { check: jest.fn(() => ({ allowed: true, remaining: 5, retryAfterSeconds: 0 })) },
}));

jest.mock("@/infra/logging/auth-logger", () => ({
  authLogger: { logEvent: (event: unknown) => logEventMock(event) },
  hashEmail: jest.fn((e: string) => `hash(${e})`),
}));

import { POST } from "@/app/api/auth/password-reset/route";

beforeEach(() => {
  resetPasswordForEmailMock.mockClear();
  checkMock.mockReset();
  checkMock.mockReturnValue({ allowed: true, remaining: 4, retryAfterSeconds: 0 });
  logEventMock.mockReset();
});

describe("POST /api/auth/password-reset", () => {
  // Evita: redirectTo relativo/undefined no link do email → Supabase rejeita ou envia link quebrado
  it("envia redirectTo absoluto apontando para /api/auth/callback?next=/redefinir-senha", async () => {
    const req = new NextRequest("https://maceng.example.com/api/auth/password-reset", {
      method: "POST",
      body: JSON.stringify({ email: "user@example.com" }),
      headers: { "Content-Type": "application/json" },
    });

    await POST(req);

    expect(resetPasswordForEmailMock).toHaveBeenCalledWith(
      "user@example.com",
      expect.objectContaining({
        redirectTo: "https://maceng.example.com/api/auth/callback?next=/redefinir-senha",
      }),
    );
  });

  // Evita: retorno diferente de 200 permitir enumeration (OWASP A07)
  it("sempre responde 200 mesmo quando provider falha", async () => {
    resetPasswordForEmailMock.mockResolvedValueOnce({ error: new Error("not found") as unknown as null });
    const req = new NextRequest("https://maceng.example.com/api/auth/password-reset", {
      method: "POST",
      body: JSON.stringify({ email: "desconhecido@example.com" }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  // Evita: email inválido passar silenciosamente (DevSecOps: input validation em todas as bordas)
  it("rejeita email inválido com 400", async () => {
    const req = new NextRequest("https://maceng.example.com/api/auth/password-reset", {
      method: "POST",
      body: JSON.stringify({ email: "nao-eh-email" }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    expect(resetPasswordForEmailMock).not.toHaveBeenCalled();
  });

  // Evita: brute-force no endpoint de reset (DevSecOps: rate limiting on auth endpoints)
  it("retorna 429 com Retry-After quando rate limit estoura", async () => {
    checkMock.mockReturnValueOnce({ allowed: false, remaining: 0, retryAfterSeconds: 300 });

    const req = new NextRequest("https://maceng.example.com/api/auth/password-reset", {
      method: "POST",
      body: JSON.stringify({ email: "user@example.com" }),
      headers: { "Content-Type": "application/json", "x-forwarded-for": "203.0.113.1" },
    });

    const res = await POST(req);
    expect(res.status).toBe(429);
    expect(res.headers.get("retry-after")).toBe("300");
    expect(resetPasswordForEmailMock).not.toHaveBeenCalled();
    expect(logEventMock).toHaveBeenCalledWith(
      expect.objectContaining({ type: "password_reset_rate_limited", success: false }),
    );
  });

  // Evita: falhas de auth passarem despercebidas (DevSecOps: anomaly detection)
  it("registra evento estruturado de sucesso no auth-logger", async () => {
    const req = new NextRequest("https://maceng.example.com/api/auth/password-reset", {
      method: "POST",
      body: JSON.stringify({ email: "user@example.com" }),
      headers: { "Content-Type": "application/json", "x-forwarded-for": "203.0.113.9" },
    });

    await POST(req);

    expect(logEventMock).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "password_reset_requested",
        email: "user@example.com",
        ip: "203.0.113.9",
        success: true,
      }),
    );
  });

  // Evita: rate limit chavear por "unknown" em produção atrás de proxy, zerando a proteção
  it("rate limit usa IP real de x-forwarded-for, não 'unknown'", async () => {
    const req = new NextRequest("https://maceng.example.com/api/auth/password-reset", {
      method: "POST",
      body: JSON.stringify({ email: "user@example.com" }),
      headers: { "Content-Type": "application/json", "x-forwarded-for": "198.51.100.42" },
    });

    await POST(req);
    expect(checkMock).toHaveBeenCalledWith(expect.stringContaining("198.51.100.42"));
  });

  // Evita: em produção, origin interno do proxy substituir a URL pública no redirectTo
  it("prioriza NEXT_PUBLIC_SITE_URL para montar o redirectTo (proxy-safe)", async () => {
    const prev = process.env.NEXT_PUBLIC_SITE_URL;
    process.env.NEXT_PUBLIC_SITE_URL = "https://maceng.app";

    const req = new NextRequest("http://internal-host/api/auth/password-reset", {
      method: "POST",
      body: JSON.stringify({ email: "user@example.com" }),
      headers: { "Content-Type": "application/json" },
    });

    await POST(req);

    expect(resetPasswordForEmailMock).toHaveBeenCalledWith(
      "user@example.com",
      expect.objectContaining({
        redirectTo: "https://maceng.app/api/auth/callback?next=/redefinir-senha",
      }),
    );

    process.env.NEXT_PUBLIC_SITE_URL = prev;
  });
});
