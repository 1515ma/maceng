import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/infra/database/supabase-server";
import { SupabaseAuthProvider } from "@/infra/services/supabase-auth-provider";
import { RequestPasswordResetUseCase } from "@/core/use-cases/request-password-reset";
import { PasswordResetSchema } from "@/core/schemas/password-reset-schema";
import { firstValidationError } from "@/core/schemas/validation-helpers";
import { passwordResetEmailLimiter, passwordResetIpLimiter } from "@/infra/security/rate-limiter";
import { authLogger, hashEmail } from "@/infra/logging/auth-logger";
import { resolveClientIp, resolveSiteUrl } from "@/infra/http/site-url";

export async function POST(request: NextRequest) {
  const ip = resolveClientIp(request);

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

  // Rate limit: só após e-mail sintaticamente válido (regra de borda, zero-trust)
  // — duas chaves, independentes: IP (anti-abuse) e hash do e-mail (anti-spam alvo, com cota de dia)
  const limitIp = passwordResetIpLimiter.check(`password-reset:ip:${ip}`);
  if (!limitIp.allowed) {
    authLogger.logEvent({
      type: "password_reset_rate_limited",
      email: validation.data.email,
      ip,
      success: false,
      reason: "per_ip",
    });
    return NextResponse.json(
      { success: false, error: "Muitas tentativas. Tente novamente mais tarde." },
      { status: 429, headers: { "Retry-After": String(limitIp.retryAfterSeconds) } },
    );
  }

  const emailKey = `password-reset:email:${hashEmail(validation.data.email)}`;
  const limitEmail = passwordResetEmailLimiter.check(emailKey);
  if (!limitEmail.allowed) {
    authLogger.logEvent({
      type: "password_reset_rate_limited",
      email: validation.data.email,
      ip,
      success: false,
      reason: "per_email",
    });
    return NextResponse.json(
      { success: false, error: "Limite de pedidos de e-mail atingido hoje. Tente amanhã ou use outro e-mail de contato." },
      { status: 429, headers: { "Retry-After": String(limitEmail.retryAfterSeconds) } },
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
