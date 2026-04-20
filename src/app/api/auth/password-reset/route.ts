import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/infra/database/supabase-server";
import { SupabaseAuthProvider } from "@/infra/services/supabase-auth-provider";
import { RequestPasswordResetUseCase } from "@/core/use-cases/request-password-reset";
import { PasswordResetSchema } from "@/core/schemas/password-reset-schema";
import { firstValidationError } from "@/core/schemas/validation-helpers";
import { passwordResetLimiter } from "@/infra/security/rate-limiter";
import { authLogger } from "@/infra/logging/auth-logger";
import { resolveClientIp, resolveSiteUrl } from "@/infra/http/site-url";

export async function POST(request: NextRequest) {
  const ip = resolveClientIp(request);

  // Rate limit ANTES de qualquer trabalho caro (DevSecOps: rate limiting on auth endpoints).
  // Chave combina rota + IP para isolar reset/login/register.
  const limit = passwordResetLimiter.check(`password-reset:${ip}`);
  if (!limit.allowed) {
    authLogger.logEvent({
      type: "password_reset_rate_limited",
      email: "unknown@rate-limited",
      ip,
      success: false,
      reason: "too_many_requests",
    });
    return NextResponse.json(
      { success: false, error: "Muitas tentativas. Tente novamente mais tarde." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json(
      { success: false, error: "Corpo da requisição inválido" },
      { status: 400 },
    );
  }

  const validation = PasswordResetSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { success: false, error: firstValidationError(validation) },
      { status: 400 },
    );
  }

  const supabase = await createSupabaseServerClient();
  const authProvider = new SupabaseAuthProvider(supabase);
  const useCase = new RequestPasswordResetUseCase(authProvider);

  // URL absoluta obrigatória: prioriza NEXT_PUBLIC_SITE_URL (proxy-safe em produção).
  const siteUrl = resolveSiteUrl(request);
  const redirectTo = `${siteUrl}/api/auth/callback?next=/redefinir-senha`;

  const result = await useCase.execute(validation.data.email, redirectTo);

  authLogger.logEvent({
    type: "password_reset_requested",
    email: validation.data.email,
    ip,
    success: true,
  });

  // DevSecOps: sempre 200 para evitar user enumeration (OWASP A07)
  return NextResponse.json(result, { status: 200 });
}
