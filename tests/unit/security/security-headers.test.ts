import nextConfig from "../../../next.config";

type Header = { key: string; value: string };
type HeaderEntry = { source: string; headers: Header[] };

async function resolveConfig() {
  return typeof nextConfig === "function" ? await (nextConfig as () => Promise<Record<string, unknown>>)() : nextConfig;
}

async function resolveHeaders(): Promise<HeaderEntry[]> {
  const config = await resolveConfig() as { headers?: () => Promise<HeaderEntry[]> };
  if (!config.headers) throw new Error("headers() not defined in next.config.ts");
  return config.headers();
}

describe("Security Headers", () => {
  let headers: Header[];

  beforeAll(async () => {
    const result = await resolveHeaders();
    headers = result[0].headers;
  });

  // Evita: reativar o header X-Powered-By que expõe qual framework está em uso, facilitando ataques direcionados
  it("disables X-Powered-By to prevent framework fingerprinting", async () => {
    const config = await resolveConfig() as { poweredByHeader?: boolean };
    expect(config.poweredByHeader).toBe(false);
  });

  // Evita: remover proteção contra clickjacking — atacante embute a página em iframe e captura cliques do usuário
  it("sets X-Frame-Options to DENY to prevent clickjacking", () => {
    const h = headers.find((h) => h.key === "X-Frame-Options");
    expect(h).toBeDefined();
    expect(h!.value).toBe("DENY");
  });

  // Evita: navegador interpretar arquivos enviados com MIME type errado, permitindo execução de scripts disfarçados
  it("sets X-Content-Type-Options to nosniff", () => {
    const h = headers.find((h) => h.key === "X-Content-Type-Options");
    expect(h).toBeDefined();
    expect(h!.value).toBe("nosniff");
  });

  // Evita: remover HSTS, permitindo downgrade de HTTPS para HTTP e ataques man-in-the-middle
  it("sets Strict-Transport-Security with long max-age", () => {
    const h = headers.find((h) => h.key === "Strict-Transport-Security");
    expect(h).toBeDefined();
    expect(h!.value).toContain("max-age=");
    const maxAge = parseInt(h!.value.match(/max-age=(\d+)/)![1]);
    expect(maxAge).toBeGreaterThanOrEqual(31536000);
    expect(h!.value).toContain("includeSubDomains");
  });

  // Evita: vazar URL completa de origem no header Referer ao navegar para sites externos
  it("sets Referrer-Policy to strict-origin-when-cross-origin", () => {
    const h = headers.find((h) => h.key === "Referrer-Policy");
    expect(h).toBeDefined();
    expect(h!.value).toBe("strict-origin-when-cross-origin");
  });

  // Evita: CSP sem frame-ancestors permitindo que outros sites incorporem a aplicação em iframe (clickjacking)
  it("sets Content-Security-Policy with frame-ancestors none", () => {
    const h = headers.find((h) => h.key === "Content-Security-Policy");
    expect(h).toBeDefined();
    expect(h!.value).toContain("frame-ancestors 'none'");
    expect(h!.value).toContain("default-src 'self'");
  });

  // Evita: reintroduzir unsafe-eval que permite eval() em produção — vetor crítico de XSS (OWASP A05)
  it("does not include unsafe-eval in script-src outside development (OWASP A05)", () => {
    const h = headers.find((h) => h.key === "Content-Security-Policy");
    expect(h).toBeDefined();
    expect(h!.value).not.toContain("'unsafe-eval'");
  });

  // Evita: acessar câmera, microfone ou localização sem consentimento explícito do usuário (OWASP A01)
  it("sets Permissions-Policy blocking camera, microphone, geolocation", () => {
    const h = headers.find((h) => h.key === "Permissions-Policy");
    expect(h).toBeDefined();
    expect(h!.value).toContain("camera=()");
    expect(h!.value).toContain("microphone=()");
    expect(h!.value).toContain("geolocation=()");
  });

  // Evita: headers serem aplicados apenas em rotas específicas — deve proteger toda a aplicação
  it("applies headers to all routes via /(.*)", async () => {
    const result = await resolveHeaders();
    expect(result[0].source).toBe("/(.*)")
  });
});
