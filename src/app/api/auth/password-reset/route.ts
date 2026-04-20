import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/infra/database/supabase-server";
import { SupabaseAuthProvider } from "@/infra/services/supabase-auth-provider";
import { RequestPasswordResetUseCase } from "@/core/use-cases/request-password-reset";
import { PasswordResetSchema } from "@/core/schemas/password-reset-schema";
import { firstValidationError } from "@/core/schemas/validation-helpers";

export async function POST(request: NextRequest) {
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

  // O Supabase envia um e-mail com link que volta para a aplicação com `?code=...`.
  // Roteamos esse retorno através do callback genérico, que troca o code por sessão
  // e em seguida redireciona para /redefinir-senha (onde o usuário define a nova senha).
  // URL absoluta é obrigatória (o Supabase rejeita redirectTo relativo).
  const redirectTo = `${request.nextUrl.origin}/api/auth/callback?next=/redefinir-senha`;

  const result = await useCase.execute(validation.data.email, redirectTo);

  // DevSecOps: sempre 200 para evitar user enumeration (OWASP A07)
  return NextResponse.json(result, { status: 200 });
}
