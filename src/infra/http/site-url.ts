import type { NextRequest } from "next/server";

/**
 * Resolve a URL absoluta da aplicação, privilegiando `NEXT_PUBLIC_SITE_URL`
 * quando setada. Motivação:
 *   - Atrás de proxy (Vercel, Railway, ngrok, Cloudflare), `request.nextUrl.origin`
 *     pode refletir um host interno em vez do host público, o que quebra o link
 *     do email do Supabase (rejeitado por domain mismatch).
 *   - Env var explícita força a URL correta em produção e é requerida pelo
 *     Supabase na allowlist de Redirect URLs.
 *   - Em dev, cai no origin da request → http://localhost:3000 funciona out-of-the-box.
 *
 * Sem barra final (a concatenação com o path adiciona "/...").
 */
export function resolveSiteUrl(request: NextRequest): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv && /^https?:\/\//i.test(fromEnv)) {
    return fromEnv.replace(/\/$/, "");
  }
  return request.nextUrl.origin;
}

/** Extrai o IP do cliente respeitando cabeçalhos de proxy confiáveis. */
export function resolveClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}
