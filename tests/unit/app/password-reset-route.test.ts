/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";

// Captura a instância do Supabase usada dentro do route, permitindo asserções
// sobre o 2º argumento (redirectTo) de resetPasswordForEmail.
const resetPasswordForEmailMock = jest.fn(async () => ({ error: null }));

jest.mock("@/infra/database/supabase-server", () => ({
  createSupabaseServerClient: jest.fn(async () => ({
    auth: {
      resetPasswordForEmail: resetPasswordForEmailMock,
    },
  })),
}));

import { POST } from "@/app/api/auth/password-reset/route";

beforeEach(() => {
  resetPasswordForEmailMock.mockClear();
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
});
