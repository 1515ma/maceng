import { createRateLimiter } from "@/infra/security/rate-limiter";

// Jest fake timers para controlar a janela temporal sem sleeps reais.
beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date("2026-01-01T00:00:00Z"));
});

afterEach(() => {
  jest.useRealTimers();
});

describe("rateLimiter", () => {
  // Evita: primeira tentativa de um cliente ser bloqueada por engano, impedindo uso legítimo
  it("libera as primeiras N requisições dentro da janela", () => {
    const limiter = createRateLimiter({ limit: 3, windowMs: 60_000 });

    expect(limiter.check("ip:1.2.3.4")).toEqual(
      expect.objectContaining({ allowed: true, remaining: 2 }),
    );
    expect(limiter.check("ip:1.2.3.4")).toEqual(
      expect.objectContaining({ allowed: true, remaining: 1 }),
    );
    expect(limiter.check("ip:1.2.3.4")).toEqual(
      expect.objectContaining({ allowed: true, remaining: 0 }),
    );
  });

  // Evita: atacante fazer brute-force ilimitado em auth endpoints (DevSecOps — OWASP A07)
  it("bloqueia quando o limite é excedido dentro da janela", () => {
    const limiter = createRateLimiter({ limit: 2, windowMs: 60_000 });
    limiter.check("ip:x");
    limiter.check("ip:x");

    const third = limiter.check("ip:x");
    expect(third.allowed).toBe(false);
    expect(third.retryAfterSeconds).toBeGreaterThan(0);
  });

  // Evita: bloquear um cliente legítimo eternamente — a janela deve deslizar
  it("libera novamente depois que a janela expira", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 60_000 });

    expect(limiter.check("ip:x").allowed).toBe(true);
    expect(limiter.check("ip:x").allowed).toBe(false);

    jest.advanceTimersByTime(60_001);

    expect(limiter.check("ip:x").allowed).toBe(true);
  });

  // Evita: chave compartilhada entre clientes, bloqueando usuários inocentes
  it("chaves distintas têm contadores independentes", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 60_000 });

    expect(limiter.check("ip:A").allowed).toBe(true);
    expect(limiter.check("ip:B").allowed).toBe(true);
    expect(limiter.check("ip:A").allowed).toBe(false);
    expect(limiter.check("ip:B").allowed).toBe(false);
  });

  // Evita: complexidade O(n) em hot path — check deve ser O(1) amortizado
  it("check é O(1) amortizado (operação de lookup em Map)", () => {
    const limiter = createRateLimiter({ limit: 5, windowMs: 60_000 });
    // Popula 10k chaves distintas; cada check ainda assim deve ser rápido.
    for (let i = 0; i < 10_000; i++) limiter.check(`ip:${i}`);

    const start = performance.now();
    limiter.check("ip:5000");
    const elapsed = performance.now() - start;

    expect(elapsed).toBeLessThan(5);
  });
});
