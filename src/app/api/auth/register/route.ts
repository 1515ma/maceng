import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/infra/database/supabase-server";
import { SupabaseAuthProvider } from "@/infra/services/supabase-auth-provider";
import { RegisterUseCase } from "@/core/use-cases/register";
import { RegisterSchema } from "@/core/schemas/register-schema";
import { firstValidationError } from "@/core/schemas/validation-helpers";
import { registerLimiter } from "@/infra/security/rate-limiter";
import { authLogger } from "@/infra/logging/auth-logger";
import { resolveClientIp } from "@/infra/http/site-url";

export async function POST(request: NextRequest) {
  const ip = resolveClientIp(request);

  const limit = registerLimiter.check(`register:${ip}`);
  if (!limit.allowed) {
    authLogger.logEvent({
      type: "register_failed",
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

  const validation = RegisterSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { success: false, error: firstValidationError(validation) },
      { status: 400 },
    );
  }

  const supabase = await createSupabaseServerClient();
  const authProvider = new SupabaseAuthProvider(supabase);
  const registerUseCase = new RegisterUseCase(authProvider);

  const result = await registerUseCase.execute(
    body.name,
    body.email,
    body.password,
    body.confirmPassword,
  );

  if (!result.success) {
    authLogger.logEvent({
      type: "register_failed",
      email: body.email,
      ip,
      success: false,
      reason: result.error,
    });
    return NextResponse.json({ success: false, error: result.error }, { status: 400 });
  }

  authLogger.logEvent({
    type: "register_success",
    email: body.email,
    ip,
    success: true,
  });
  return NextResponse.json({ success: true, user: result.user }, { status: 201 });
}
