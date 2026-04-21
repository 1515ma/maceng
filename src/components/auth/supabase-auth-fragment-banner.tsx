"use client";

import { useLayoutEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import {
  formatSupabaseAuthHashMessage,
  parseSupabaseAuthHash,
} from "@/lib/parse-supabase-auth-hash";

const FRAGMENT_MSG_KEY = "maceng:supabase-fragment-error";

/**
 * Lê o fragmento `#error=...&error_code=...` que o Supabase envia no redirect
 * quando o link falha (ex.: otp_expired). O servidor nunca vê o hash — só o browser.
 *
 * `sessionStorage` preserva a mensagem entre remounts (React 18 Strict Mode) após
 * remover o hash com `replaceState`.
 */
export function SupabaseAuthFragmentBanner() {
  const [message, setMessage] = useState<string | null>(null);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const backup = sessionStorage.getItem(FRAGMENT_MSG_KEY);
    if (backup) {
      setMessage(backup);
      sessionStorage.removeItem(FRAGMENT_MSG_KEY);
      return;
    }

    const fromHash = formatSupabaseAuthHashMessage(
      parseSupabaseAuthHash(window.location.hash),
    );

    if (fromHash) {
      sessionStorage.setItem(FRAGMENT_MSG_KEY, fromHash);
      setMessage(fromHash);
      const clean = `${window.location.pathname}${window.location.search}`;
      window.history.replaceState(null, "", clean);
      return;
    }

    if (new URLSearchParams(window.location.search).get("error") === "auth") {
      setMessage(
        "Não foi possível validar o acesso. O link pode ter expirado. Solicite um novo em \"Esqueceu a senha?\".",
      );
    }
  }, []);

  if (!message) return null;

  return (
    <div
      role="alert"
      className="mb-6 rounded-xl border border-amber-500/40 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-500/30 dark:bg-amber-950/30 dark:text-amber-100"
    >
      <div className="flex gap-3">
        <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden />
        <div className="space-y-2">
          <p>{message}</p>
          <p>
            <Link
              href="/recuperar-senha"
              className="font-semibold text-brand-600 underline underline-offset-2 hover:text-brand-700"
            >
              Ir para recuperação de senha
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
