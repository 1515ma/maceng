"use client";

import type { AuthProvider } from "@/core/ports/auth-provider";
import { createSupabaseBrowserClient } from "@/infra/database/supabase-client";
import { SupabaseAuthProvider } from "@/infra/services/supabase-auth-provider";

// Função pura testável: recebe provider e função de redirect injetados.
// Mantém o core isolado de detalhes do browser (window.location).
export async function performGoogleSignIn(
  authProvider: AuthProvider,
  redirect: (url: string) => void,
): Promise<void> {
  const result = await authProvider.signInWithGoogle();

  if (!result.success) {
    throw new Error(result.error);
  }

  redirect(result.redirectUrl);
}

// Binding do cliente: usado pelos forms de login/cadastro.
// Cria o AuthProvider na borda (browser) e redireciona via window.location.
export async function startGoogleSignIn(): Promise<void> {
  const supabase = createSupabaseBrowserClient();
  const authProvider = new SupabaseAuthProvider(supabase);
  await performGoogleSignIn(authProvider, (url) => {
    window.location.href = url;
  });
}
