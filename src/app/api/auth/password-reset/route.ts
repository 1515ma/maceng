import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/infra/database/supabase-server";
import { SupabaseAuthProvider } from "@/infra/services/supabase-auth-provider";
import { RequestPasswordResetUseCase } from "@/core/use-cases/request-password-reset";
import { PasswordResetSchema } from "@/core/schemas/password-reset-schema";

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
      { success: false, error: validation.error.issues[0].message },
      { status: 400 },
    );
  }

  const supabase = await createSupabaseServerClient();
  const authProvider = new SupabaseAuthProvider(supabase);
  const useCase = new RequestPasswordResetUseCase(authProvider);

  const result = await useCase.execute(validation.data.email);

  // DevSecOps: sempre 200 para evitar user enumeration (OWASP A07)
  return NextResponse.json(result, { status: 200 });
}
