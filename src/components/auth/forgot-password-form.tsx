"use client";

import { useState } from "react";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { PasswordResetSchema } from "@/core/schemas/password-reset-schema";
import { postPasswordReset } from "@/adapters/http/auth-client";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(undefined);

    const result = PasswordResetSchema.safeParse({ email });
    if (!result.success) {
      setError(result.error.flatten().fieldErrors.email?.[0]);
      return;
    }

    setSubmitting(true);
    const res = await postPasswordReset(result.data.email);
    setSubmitting(false);

    if (!res.success) {
      setError(res.error ?? "Não foi possível enviar. Tente novamente.");
      return;
    }

    // Anti-enumeration (OWASP A07): 200 com sucesso → mesma mensagem genérica, sem revelar
    // se o e-mail existe. Erros 429/400/ rede seguem o branch acima, sem sucesso falso.
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="w-full space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-900/20">
          <CheckCircle2 className="h-8 w-8 text-brand-600" />
        </div>
        <div>
          <p className="text-sm text-[var(--text-secondary)]">
            Se o e-mail estiver cadastrado, você receberá um link para redefinir sua senha nos próximos minutos.
          </p>
        </div>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao login
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label
            htmlFor="forgot-email"
            className="block text-sm font-medium text-[var(--text-primary)] mb-1.5"
          >
            E-mail
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
            <input
              id="forgot-email"
              type="email"
              autoComplete="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full rounded-xl border bg-[var(--bg-primary)] pl-10 pr-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors ${
                error ? "border-red-500" : "border-[var(--border-color)]"
              }`}
            />
          </div>
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-brand-600/25 hover:bg-brand-700 hover:shadow-brand-600/40 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Enviando..." : "Enviar link de recuperação"}
        </button>
      </form>

      <Link
        href="/login"
        className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-brand-600 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar ao login
      </Link>
    </div>
  );
}
