/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";

const signUpMock = jest.fn(async () => ({
  data: { user: { id: "u-1", email: "new@example.com" } },
  error: null,
}));
const fromMock = jest.fn(() => ({
  select: () => ({
    eq: () => ({
      single: async () => ({
        data: {
          id: "u-1",
          name: "Novo",
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
  (_key: string) => ({ allowed: true, remaining: 4, retryAfterSeconds: 0 }),
);
const logEventMock: jest.Mock = jest.fn();

jest.mock("@/infra/database/supabase-server", () => ({
  createSupabaseServerClient: jest.fn(async () => ({
    auth: { signUp: signUpMock },
    from: fromMock,
  })),
}));

jest.mock("@/infra/security/rate-limiter", () => ({
  registerLimiter: { check: (key: string) => checkMock(key) },
  loginLimiter: { check: jest.fn(() => ({ allowed: true, remaining: 10, retryAfterSeconds: 0 })) },
  passwordResetIpLimiter: { check: jest.fn(() => ({ allowed: true, remaining: 30, retryAfterSeconds: 0 })) },
  passwordResetEmailLimiter: { check: jest.fn(() => ({ allowed: true, remaining: 20, retryAfterSeconds: 0 })) },
}));

jest.mock("@/infra/logging/auth-logger", () => ({
  authLogger: { logEvent: (event: unknown) => logEventMock(event) },
  hashEmail: jest.fn((e: string) => `hash(${e})`),
}));

import { POST } from "@/app/api/auth/register/route";

beforeEach(() => {
  signUpMock.mockClear();
  checkMock.mockReset();
  checkMock.mockReturnValue({ allowed: true, remaining: 4, retryAfterSeconds: 0 });
  logEventMock.mockReset();
});

describe("POST /api/auth/register", () => {
  const body = {
    name: "Novo",
    email: "new@example.com",
    password: "Senha@123",
    confirmPassword: "Senha@123",
  };

  function req(extra: Partial<typeof body> = {}, headers: Record<string, string> = {}) {
    return new NextRequest("https://maceng.app/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ ...body, ...extra }),
      headers: { "Content-Type": "application/json", ...headers },
    });
  }

  // Evita: criação em massa de contas fake (DevSecOps: rate limiting + SPAM abuse)
  it("retorna 429 quando rate limit é excedido", async () => {
    checkMock.mockReturnValueOnce({ allowed: false, remaining: 0, retryAfterSeconds: 600 });
    const res = await POST(req());
    expect(res.status).toBe(429);
    expect(signUpMock).not.toHaveBeenCalled();
  });

  // Evita: rastro ausente de cadastros (auditoria)
  it("registra register_success em sucesso", async () => {
    await POST(req({}, { "x-forwarded-for": "203.0.113.5" }));
    expect(logEventMock).toHaveBeenCalledWith(
      expect.objectContaining({ type: "register_success", success: true, ip: "203.0.113.5" }),
    );
  });
});
