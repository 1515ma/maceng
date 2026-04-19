import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/infra/database/supabase-server";
import { SupabaseAuthProvider } from "@/infra/services/supabase-auth-provider";
import { LoginUseCase } from "@/core/use-cases/login";
import { LoginSchema } from "@/core/schemas/login-schema";

export async function POST(request: NextRequest) {
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
      { success: false, error: validation.error.errors[0].message },
      { status: 400 },
    );
  }

  const supabase = await createSupabaseServerClient();
  const authProvider = new SupabaseAuthProvider(supabase);
  const loginUseCase = new LoginUseCase(authProvider);

  const result = await loginUseCase.execute(validation.data.email, validation.data.password);

  if (!result.success) {
    return NextResponse.json(
      { success: false, error: result.error },
      { status: 401 },
    );
  }

  return NextResponse.json({ success: true, user: result.user });
}
