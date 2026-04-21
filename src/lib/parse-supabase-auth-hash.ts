/**
 * O Supabase anexa erros de fluxo (link expirado, acesso negado) no **fragmento**
 * da URL (`#error=...&error_code=...`). Isso nunca chega ao servidor (RFC 3986).
 * Este módulo interpreta o fragmento no cliente — sem PII, só códigos.
 */

export interface ParsedSupabaseAuthHash {
  error: string | null;
  errorCode: string | null;
  errorDescription: string | null;
}

export function parseSupabaseAuthHash(hash: string): ParsedSupabaseAuthHash {
  if (!hash || hash === "#") {
    return { error: null, errorCode: null, errorDescription: null };
  }

  const raw = hash.startsWith("#") ? hash.slice(1) : hash;
  const params = new URLSearchParams(raw);

  const desc = params.get("error_description");
  let errorDescription: string | null = null;
  if (desc) {
    try {
      errorDescription = decodeURIComponent(desc.replace(/\+/g, " "));
    } catch {
      errorDescription = desc;
    }
  }

  return {
    error: params.get("error"),
    errorCode: params.get("error_code"),
    errorDescription,
  };
}

/**
 * Mensagens em português — nunca exibir `error_description` bruta em produção
 * (pode vir em inglês e expor detalhes operacionais).
 */
export function formatSupabaseAuthHashMessage(parsed: {
  error?: string | null;
  errorCode?: string | null;
  errorDescription?: string | null;
}): string | null {
  const { errorCode } = parsed;

  if (!errorCode && !parsed.error) {
    return null;
  }

  switch (errorCode) {
    case "otp_expired":
      return "O link do e-mail expirou ou já foi usado. Solicite um novo em \"Esqueceu a senha?\" e use o link o quanto antes.";
    case "otp_disabled":
      return "Confirmação por link não está disponível no momento. Entre em contato com o suporte.";
    default:
      return "Não foi possível concluir a autenticação pelo link. Peça um novo e-mail de recuperação ou tente entrar com e-mail e senha.";
  }
}
