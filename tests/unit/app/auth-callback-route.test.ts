/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";

const exchangeCodeForSessionMock = jest.fn(async () => ({ error: null }));

jest.mock("@/infra/database/supabase-server", () => ({
  createSupabaseServerClient: jest.fn(async () => ({
    auth: {
      exchangeCodeForSession: exchangeCodeForSessionMock,
    },
  })),
}));

import { GET } from "@/app/api/auth/callback/route";

beforeEach(() => {
  exchangeCodeForSessionMock.mockClear();
  exchangeCodeForSessionMock.mockResolvedValue({ error: null });
});

describe("GET /api/auth/callback", () => {
  // Evita: sem code o callback redirecionar como se tivesse autenticado, driblando o fluxo
  it("redireciona para /login?error=auth quando não há code", async () => {
    const req = new NextRequest("https://site.com/api/auth/callback");
    const res = await GET(req);
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("https://site.com/login?error=auth");
    expect(exchangeCodeForSessionMock).not.toHaveBeenCalled();
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
});
