/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";

const exchangeCodeForSessionMock = jest.fn(async () => ({ error: null }));
const verifyOtpMock = jest.fn(async () => ({ error: null }));

jest.mock("@/infra/database/supabase-server", () => ({
  createSupabaseServerClient: jest.fn(async () => ({
    auth: {
      exchangeCodeForSession: exchangeCodeForSessionMock,
      verifyOtp: verifyOtpMock,
    },
  })),
}));

import { GET } from "@/app/api/auth/callback/route";

beforeEach(() => {
  exchangeCodeForSessionMock.mockClear();
  exchangeCodeForSessionMock.mockResolvedValue({ error: null });
  verifyOtpMock.mockClear();
  verifyOtpMock.mockResolvedValue({ error: null });
});

describe("GET /api/auth/callback", () => {
  // Evita: sem code nem token_hash o callback redirecionar como se tivesse autenticado
  it("redireciona para /login?error=auth quando não há code nem token", async () => {
    const req = new NextRequest("https://site.com/api/auth/callback");
    const res = await GET(req);
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("https://site.com/login?error=auth");
    expect(exchangeCodeForSessionMock).not.toHaveBeenCalled();
    expect(verifyOtpMock).not.toHaveBeenCalled();
  });

  // Evita: fluxo padrão (login/signup) não chegar ao dashboard após exchange bem-sucedido
  it("redireciona para /dashboard quando code é válido e next não é passado", async () => {
    const req = new NextRequest("https://site.com/api/auth/callback?code=abc");
    const res = await GET(req);
    expect(exchangeCodeForSessionMock).toHaveBeenCalledWith("abc");
    expect(res.headers.get("location")).toBe("https://site.com/dashboard");
  });

  // Evita: reset de senha ser redirecionado para /dashboard e pular a tela de nova senha
  it("respeita next query param (ex.: /redefinir-senha) para fluxos como reset de senha", async () => {
    const req = new NextRequest(
      "https://site.com/api/auth/callback?code=abc&next=%2Fredefinir-senha",
    );
    const res = await GET(req);
    expect(res.headers.get("location")).toBe("https://site.com/redefinir-senha");
  });

  // Evita: open redirect via next=http://evil.com (OWASP A01 — improper access control)
  it("rejeita next absoluto externo, caindo de volta em /dashboard", async () => {
    const req = new NextRequest(
      "https://site.com/api/auth/callback?code=abc&next=https%3A%2F%2Fevil.com%2Fpwn",
    );
    const res = await GET(req);
    expect(res.headers.get("location")).toBe("https://site.com/dashboard");
  });

  // Evita: exchange falhar e mesmo assim o usuário ser levado para /dashboard sem sessão
  it("vai para /login?error=auth quando exchangeCodeForSession retorna erro", async () => {
    exchangeCodeForSessionMock.mockResolvedValueOnce({ error: new Error("invalid") as unknown as null });
    const req = new NextRequest("https://site.com/api/auth/callback?code=abc");
    const res = await GET(req);
    expect(res.headers.get("location")).toBe("https://site.com/login?error=auth");
  });

  // Evita: email de recuperação vir com token_hash+type (PKCE docs) e cair em login por falta de ?code
  it("troca token_hash+type=recovery por sessão e respeita next=/redefinir-senha", async () => {
    const req = new NextRequest(
      "https://site.com/api/auth/callback?token_hash=th1&type=recovery&next=%2Fredefinir-senha",
    );
    const res = await GET(req);
    expect(exchangeCodeForSessionMock).not.toHaveBeenCalled();
    expect(verifyOtpMock).toHaveBeenCalledWith(
      expect.objectContaining({ token_hash: "th1", type: "recovery" }),
    );
    expect(res.headers.get("location")).toBe("https://site.com/redefinir-senha");
  });

  // Evita: atacante passar type arbitrário e abrir vetor de confusão / enum
  it("ignora verifyOtp quando type não está na allowlist de segurança", async () => {
    const req = new NextRequest(
      "https://site.com/api/auth/callback?token_hash=th1&type=arbitrary&next=%2Fredefinir-senha",
    );
    const res = await GET(req);
    expect(verifyOtpMock).not.toHaveBeenCalled();
    expect(res.headers.get("location")).toBe("https://site.com/login?error=auth");
  });

  // Evita: verifyOtp falhar e mesmo assim redirecionar como logado
  it("vai para /login?error=auth quando verifyOtp retorna erro", async () => {
    verifyOtpMock.mockResolvedValueOnce({ error: new Error("expired") as unknown as null });
    const req = new NextRequest(
      "https://site.com/api/auth/callback?token_hash=th1&type=recovery",
    );
    const res = await GET(req);
    expect(res.headers.get("location")).toBe("https://site.com/login?error=auth");
  });
});
