import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/infra/database/supabase-server";
import { SupabaseAuthProvider } from "@/infra/services/supabase-auth-provider";
import { RegisterUseCase } from "@/core/use-cases/register";
import { RegisterSchema } from "@/core/schemas/register-schema";

export async function POST(request: NextRequest) {
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
      { success: false, error: validation.error.issues[0].message },
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
    return NextResponse.json(
      { success: false, error: result.error },
      { status: 400 },
    );
  }

  return NextResponse.json({ success: true, user: result.user }, { status: 201 });
}
