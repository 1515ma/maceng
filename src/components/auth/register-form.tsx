"use client";

import { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { RegisterSchema } from "@/core/schemas/register-schema";
import { GoogleSignInField } from "@/components/auth/google-sign-in-field";
import { AuthDivider } from "@/components/auth/auth-divider";

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    const result = RegisterSchema.safeParse({ name, email, password, confirmPassword });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors as Record<
        string,
        string[] | undefined
      >;
      setErrors({
        name: fieldErrors.name?.[0],
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
        confirmPassword: fieldErrors.confirmPassword?.[0],
      });
      return;
    }

    // TODO: chamar API route /api/auth/register
  }

  return (
    <div className="w-full space-y-6">
      <GoogleSignInField label="Cadastrar com Google" />
      <AuthDivider />

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="register-name" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
            Nome completo
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
            <input
              id="register-name"
              type="text"
              autoComplete="name"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full rounded-xl border bg-[var(--bg-primary)] pl-10 pr-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors ${
                errors.name ? "border-red-500" : "border-[var(--border-color)]"
              }`}
            />
          </div>
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="register-email" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
            E-mail
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
            <input
              id="register-email"
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
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="register-password" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
            Senha
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
            <input
              id="register-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Mínimo 6 caracteres"
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
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
        </div>

        <div>
          <label htmlFor="register-confirm" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
            Confirmar senha
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
            <input
              id="register-confirm"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Repita a senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full rounded-xl border bg-[var(--bg-primary)] pl-10 pr-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors ${
                errors.confirmPassword ? "border-red-500" : "border-[var(--border-color)]"
              }`}
            />
          </div>
          {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-brand-600/25 hover:bg-brand-700 hover:shadow-brand-600/40 transition-all duration-300"
        >
          Criar conta
        </button>
      </form>

      <p className="text-center text-sm text-[var(--text-muted)]">
        Já tem conta?{" "}
        <Link
          href="/login"
          className="font-semibold text-brand-600 hover:text-brand-700 transition-colors"
        >
          Entrar
        </Link>
      </p>
    </div>
  );
}
