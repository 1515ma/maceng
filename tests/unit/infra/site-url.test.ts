/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import { resolveClientIp, resolveSiteUrl } from "@/infra/http/site-url";

describe("resolveSiteUrl", () => {
  const originalEnv = process.env.NEXT_PUBLIC_SITE_URL;

  afterEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = originalEnv;
  });

  // Evita: em dev cru, sem env, ainda funciona via origin da request
  it("usa request.nextUrl.origin quando NEXT_PUBLIC_SITE_URL não está setada", () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    const req = new NextRequest("http://localhost:3000/x");
    expect(resolveSiteUrl(req)).toBe("http://localhost:3000");
  });

  // Evita: em produção atrás de proxy, origin refletir host interno e quebrar link de email
  it("prefere NEXT_PUBLIC_SITE_URL quando setada (proxy-safe)", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://maceng.app";
    const req = new NextRequest("http://internal-host/x");
    expect(resolveSiteUrl(req)).toBe("https://maceng.app");
  });

  // Evita: barra trailing duplicada (".app//path") quebrar URLs
  it("remove barra final de NEXT_PUBLIC_SITE_URL", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://maceng.app/";
    const req = new NextRequest("http://x/y");
    expect(resolveSiteUrl(req)).toBe("https://maceng.app");
  });

  // Evita: env setada errada (sem protocolo) passar despercebida e corromper redirects
  it("ignora NEXT_PUBLIC_SITE_URL sem protocolo http(s)", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "maceng.app";
    const req = new NextRequest("http://localhost:3000/y");
    expect(resolveSiteUrl(req)).toBe("http://localhost:3000");
  });
});

describe("resolveClientIp", () => {
  // Evita: rate limit chavear por "unknown" e agrupar todos os clientes (zera proteção)
  it("usa x-forwarded-for quando presente, pegando o primeiro IP", () => {
    const req = new NextRequest("http://x/y", {
      headers: { "x-forwarded-for": "203.0.113.42, 10.0.0.1" },
    });
    expect(resolveClientIp(req)).toBe("203.0.113.42");
  });

  // Evita: ignorar x-real-ip usado por nginx/Railway, voltando a "unknown"
  it("cai em x-real-ip quando x-forwarded-for está ausente", () => {
    const req = new NextRequest("http://x/y", {
      headers: { "x-real-ip": "198.51.100.7" },
    });
    expect(resolveClientIp(req)).toBe("198.51.100.7");
  });

  // Evita: quebra quando nenhum header está presente (dev local)
  it("retorna 'unknown' quando nenhum cabeçalho fornece IP", () => {
    const req = new NextRequest("http://x/y");
    expect(resolveClientIp(req)).toBe("unknown");
  });
});
