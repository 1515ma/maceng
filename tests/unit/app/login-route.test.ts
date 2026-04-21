/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";

type SignInResult = {
  data: { user: { id: string; email: string } | null };
  error: { message: string } | null;
};
const signInWithPasswordMock: jest.Mock<Promise<SignInResult>> = jest.fn(async () => ({
  data: { user: { id: "u-1", email: "user@example.com" } },
  error: null,
}));
const fromMock = jest.fn(() => ({
  select: () => ({
    eq: () => ({
      single: async () => ({
        data: {
          id: "u-1",
          name: "Fulano",
          plan: "free",
          calculations_used: 0,
          created_at: new Date().toISOString(),
        },
      }),
    }),
  }),
}));
type CheckResult = { allowed: boolean; remaining: number; retryAfterSeconds: number };
const checkMock: jest.Mock<CheckResult, [string]> = jest.fn(
  (_key: string) => ({ allowed: true, remaining: 9, retryAfterSeconds: 0 }),
);
const logEventMock: jest.Mock = jest.fn();

jest.mock("@/infra/database/supabase-server", () => ({
  createSupabaseServerClient: jest.fn(async () => ({
    auth: { signInWithPassword: signInWithPasswordMock },
    from: fromMock,
  })),
}));

jest.mock("@/infra/security/rate-limiter", () => ({
  loginLimiter: { check: (key: string) => checkMock(key) },
  passwordResetIpLimiter: { check: jest.fn(() => ({ allowed: true, remaining: 30, retryAfterSeconds: 0 })) },
  passwordResetEmailLimiter: { check: jest.fn(() => ({ allowed: true, remaining: 20, retryAfterSeconds: 0 })) },
  registerLimiter: { check: jest.fn(() => ({ allowed: true, remaining: 5, retryAfterSeconds: 0 })) },
}));

jest.mock("@/infra/logging/auth-logger", () => ({
  authLogger: { logEvent: (event: unknown) => logEventMock(event) },
  hashEmail: jest.fn((e: string) => `hash(${e})`),
}));

import { POST } from "@/app/api/auth/login/route";

beforeEach(() => {
  signInWithPasswordMock.mockClear();
  signInWithPasswordMock.mockResolvedValue({
    data: { user: { id: "u-1", email: "user@example.com" } },
    error: null,
  });
  checkMock.mockReset();
  checkMock.mockReturnValue({ allowed: true, remaining: 9, retryAfterSeconds: 0 });
  logEventMock.mockReset();
});

function buildReq(body: unknown, headers: Record<string, string> = {}) {
  return new NextRequest("https://maceng.app/api/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json", ...headers },
  });
}

describe("POST /api/auth/login", () => {
  // Evita: brute-force de senha (DevSecOps: rate limiting on auth endpoints + OWASP A07)
  it("retorna 429 quando rate limit é excedido", async () => {
    checkMock.mockReturnValueOnce({ allowed: false, remaining: 0, retryAfterSeconds: 120 });
    const res = await POST(buildReq({ email: "u@e.com", password: "Senha@123" }));
    expect(res.status).toBe(429);
    expect(res.headers.get("retry-after")).toBe("120");
    expect(signInWithPasswordMock).not.toHaveBeenCalled();
  });

  // Evita: login falho não ser registrado, impedindo detecção de ataques de senha
  it("registra login_failed com reason=invalid_credentials em falha 401", async () => {
    signInWithPasswordMock.mockResolvedValueOnce({
      data: { user: null },
      error: { message: "Invalid login credentials" },
    });

    const res = await POST(buildReq({ email: "u@e.com", password: "errada" }, { "x-forwarded-for": "10.0.0.1" }));
    expect(res.status).toBe(401);
    expect(logEventMock).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "login_failed",
        email: "u@e.com",
        ip: "10.0.0.1",
        success: false,
      }),
    );
  });

  // Evita: ausência de rastro de login bem-sucedido (auditoria)
  it("registra login_success ao autenticar", async () => {
    await POST(buildReq({ email: "u@e.com", password: "Senha@123" }));
    expect(logEventMock).toHaveBeenCalledWith(
      expect.objectContaining({ type: "login_success", success: true }),
    );
  });
});
