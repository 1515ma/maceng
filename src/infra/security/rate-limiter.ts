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

/**
 * Instâncias compartilhadas por endpoint, cada uma com seu próprio limite.
 * O módulo é carregado uma única vez pelo Next.js por processo, então o Map
 * persiste entre requisições (comportamento desejado).
 */
export const passwordResetLimiter = createRateLimiter({
  limit: 5,
  windowMs: 60 * 60 * 1000, // 1 hora
});

export const loginLimiter = createRateLimiter({
  limit: 10,
  windowMs: 15 * 60 * 1000, // 15 minutos
});

export const registerLimiter = createRateLimiter({
  limit: 5,
  windowMs: 60 * 60 * 1000,
});
