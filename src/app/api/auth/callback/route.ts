import { NextRequest, NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/infra/database/supabase-server";

// Allowlist de rotas internas para `next` — defesa contra open redirect
// (OWASP A01). Qualquer valor fora daqui cai no default /dashboard.
const ALLOWED_NEXT: ReadonlySet<string> = new Set([
  "/dashboard",
  "/redefinir-senha",
]);

/** Tipos de OTP aceitos em verifyOtp com token_hash (fluxo PKCE por e-mail). */
const ALLOWED_OTP_TYPES: ReadonlySet<string> = new Set([
  "recovery",
  "signup",
  "invite",
  "email_change",
  "email",
  "magiclink",
]);

function resolveNext(raw: string | null): string {
  if (!raw) return "/dashboard";
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/dashboard";
  if (!ALLOWED_NEXT.has(raw)) return "/dashboard";
  return raw;
}

function isAllowedOtpType(raw: string | null): boolean {
  return raw !== null && ALLOWED_OTP_TYPES.has(raw);
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const next = resolveNext(searchParams.get("next"));
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const typeRaw = searchParams.get("type");

  const supabase = await createSupabaseServerClient();

  // 1) PKCE OAuth / alguns fluxos de redirect com `code` (Google, confirm email moderno)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(`${origin}/login?error=auth`);
    }
    return NextResponse.redirect(`${origin}${next}`);
  }

  // 2) Link de e-mail com token_hash + type (documentação Supabase PKCE para reset/recovery)
  //    Sem isso, links sem `?code=` caem em /login?error=auth — usuário nunca vê a tela de nova senha.
  if (token_hash && isAllowedOtpType(typeRaw)) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: typeRaw as EmailOtpType,
    });

    if (error) {
      return NextResponse.redirect(`${origin}/login?error=auth`);
    }

    return NextResponse.redirect(`${origin}${next}`);
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
