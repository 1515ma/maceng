import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/infra/database/supabase-server";

// Allowlist de rotas internas para `next` — defesa contra open redirect
// (OWASP A01). Qualquer valor fora daqui cai no default /dashboard.
const ALLOWED_NEXT: ReadonlySet<string> = new Set([
  "/dashboard",
  "/redefinir-senha",
]);

function resolveNext(raw: string | null): string {
  if (!raw) return "/dashboard";
  // Só aceitamos paths relativos absolutos começando com "/" e sem "//"
  // (previne //evil.com e URLs externas).
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/dashboard";
  if (!ALLOWED_NEXT.has(raw)) return "/dashboard";
  return raw;
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = resolveNext(searchParams.get("next"));

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=auth`);
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=auth`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
