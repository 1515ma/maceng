import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/infra/database/supabase-server";
import { SupabaseAuthProvider } from "@/infra/services/supabase-auth-provider";
import { LoginUseCase } from "@/core/use-cases/login";
import { LoginSchema } from "@/core/schemas/login-schema";
import { firstValidationError } from "@/core/schemas/validation-helpers";
import { loginLimiter } from "@/infra/security/rate-limiter";
import { authLogger } from "@/infra/logging/auth-logger";
import { resolveClientIp } from "@/infra/http/site-url";

export async function POST(request: NextRequest) {
  const ip = resolveClientIp(request);

  const limit = loginLimiter.check(`login:${ip}`);
  if (!limit.allowed) {
    authLogger.logEvent({
      type: "login_failed",
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

  const validation = LoginSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { success: false, error: firstValidationError(validation) },
      { status: 400 },
    );
  }

  const supabase = await createSupabaseServerClient();
  const authProvider = new SupabaseAuthProvider(supabase);
  const loginUseCase = new LoginUseCase(authProvider);

  const result = await loginUseCase.execute(validation.data.email, validation.data.password);

  if (!result.success) {
    authLogger.logEvent({
      type: "login_failed",
      email: validation.data.email,
      ip,
      success: false,
      reason: "invalid_credentials",
    });
    return NextResponse.json({ success: false, error: result.error }, { status: 401 });
  }

  authLogger.logEvent({
    type: "login_success",
    email: validation.data.email,
    ip,
    success: true,
  });
  return NextResponse.json({ success: true, user: result.user });
}
