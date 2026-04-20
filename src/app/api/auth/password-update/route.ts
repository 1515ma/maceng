import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/infra/database/supabase-server";
import { SupabaseAuthProvider } from "@/infra/services/supabase-auth-provider";
import { UpdatePasswordUseCase } from "@/core/use-cases/update-password";
import { PasswordUpdateSchema } from "@/core/schemas/password-update-schema";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json(
      { success: false, error: "Corpo da requisição inválido" },
      { status: 400 },
    );
  }

  const validation = PasswordUpdateSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { success: false, error: validation.error.issues[0].message },
      { status: 400 },
    );
  }

  const supabase = await createSupabaseServerClient();
  const authProvider = new SupabaseAuthProvider(supabase);
  const useCase = new UpdatePasswordUseCase(authProvider);

  const result = await useCase.execute(validation.data.password, body.confirmPassword ?? validation.data.password);

  if (!result.success) {
    return NextResponse.json(result, { status: 400 });
  }

  return NextResponse.json({ success: true, user: result.user });
}
