/**
 * Rate limiter por chave, janela deslizante simples (fixed-window por chave).
 *
 * Por que esta implementação:
 *   - Cobre a regra DevSecOps "Implement rate limiting on auth endpoints".
 *   - In-memory, single-process. Para escala horizontal (multi-replica),
 *     substituir o Map por um store compartilhado (Redis/Upstash). A interface
 *     pública (`check`) permanece estável — troca pontual no adapter.
 *   - Complexidade: check() é O(1) amortizado (Map.get/set).
 */

export interface RateLimiterOptions {
  /** Máximo de eventos permitidos na janela. */
  limit: number;
  /** Tamanho da janela em milissegundos. */
  windowMs: number;
}

export interface RateLimitCheck {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

interface Bucket {
  count: number;
  resetAt: number;
}

export interface RateLimiter {
  check(key: string): RateLimitCheck;
}

export function createRateLimiter(options: RateLimiterOptions): RateLimiter {
  const buckets = new Map<string, Bucket>();

  return {
    check(key: string): RateLimitCheck {
      const now = Date.now();
      const bucket = buckets.get(key);

      if (!bucket || bucket.resetAt <= now) {
        buckets.set(key, { count: 1, resetAt: now + options.windowMs });
        return {
          allowed: true,
          remaining: options.limit - 1,
          retryAfterSeconds: 0,
        };
      }

      if (bucket.count >= options.limit) {
        return {
          allowed: false,
          remaining: 0,
          retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000),
        };
      }

      bucket.count += 1;
      return {
        allowed: true,
        remaining: options.limit - bucket.count,
        retryAfterSeconds: 0,
      };
    },
  };
}

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Recuperação de senha: dois contadores (DevSecOps + UX).
 * - **Por e-mail** (chave = hash): evita engembarcar um alvo, mas deixa o dia à vontade para teste (20/dia).
 * - **Por IP**: anti-abuse distribuído (30/dia).
 * Nota: o Supabase com SMTP padrão ainda aplica cota **própria** (tipic. ~2–4 e-mails/hora no free).
 * Para mais e-mails, use SMTP custom no painel do Supabase.
 */
export const passwordResetIpLimiter = createRateLimiter({
  limit: 30,
  windowMs: ONE_DAY_MS,
});

export const passwordResetEmailLimiter = createRateLimiter({
  limit: 20,
  windowMs: ONE_DAY_MS,
});

export const loginLimiter = createRateLimiter({
  limit: 10,
  windowMs: 15 * 60 * 1000, // 15 minutos
});

export const registerLimiter = createRateLimiter({
  limit: 5,
  windowMs: 60 * 60 * 1000,
});
