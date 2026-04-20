"use client";

import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { LoginSchema } from "@/core/schemas/login-schema";
import { GoogleSignInField } from "@/components/auth/google-sign-in-field";
import { AuthDivider } from "@/components/auth/auth-divider";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    const result = LoginSchema.safeParse({ email, password });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      return;
    }

    // TODO: chamar use case de autenticação via adapter
  }

  return (
    <div className="w-full space-y-6">
      <GoogleSignInField label="Entrar com Google" />
      <AuthDivider />

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="login-email" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
            E-mail
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full rounded-xl border bg-[var(--bg-primary)] pl-10 pr-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors ${
                errors.email ? "border-red-500" : "border-[var(--border-color)]"
              }`}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="login-password" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
            Senha
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full rounded-xl border bg-[var(--bg-primary)] pl-10 pr-12 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors ${
                errors.password ? "border-red-500" : "border-[var(--border-color)]"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
              aria-label="Mostrar senha"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">{errors.password}</p>
          )}
        </div>

        <div className="flex items-center justify-end">
          <Link
            href="/recuperar-senha"
            className="text-xs text-brand-600 hover:text-brand-700 font-medium transition-colors"
          >
            Esqueceu a senha?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-brand-600/25 hover:bg-brand-700 hover:shadow-brand-600/40 transition-all duration-300"
        >
          Entrar
        </button>
      </form>

      <p className="text-center text-sm text-[var(--text-muted)]">
        Não tem conta?{" "}
        <Link
          href="/cadastro"
          className="font-semibold text-brand-600 hover:text-brand-700 transition-colors"
        >
          Criar conta
        </Link>
      </p>
    </div>
  );
}
