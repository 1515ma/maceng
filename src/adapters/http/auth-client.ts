"use client";

import type { User } from "@/core/entities/user";

export interface AuthApiResult {
  success: boolean;
  error?: string;
  user?: User;
}

// Centraliza a chamada HTTP para isolar o tratamento de erro/parse em um único ponto.
// Benefícios: DRY (reuso por 4 forms) e testabilidade (mockar 1 função de fetch).
async function postJson(url: string, body: unknown): Promise<AuthApiResult> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "same-origin",
    });

    const payload = (await res.json().catch(() => ({}))) as Partial<AuthApiResult>;

    if (!res.ok) {
      return {
        success: false,
        error: payload.error ?? "Falha na requisição",
      };
    }

    return {
      success: payload.success ?? true,
      error: payload.error,
      user: payload.user,
    };
  } catch {
    return {
      success: false,
      error: "Sem conexão com o servidor. Tente novamente.",
    };
  }
}

export function postLogin(email: string, password: string): Promise<AuthApiResult> {
  return postJson("/api/auth/login", { email, password });
}

export function postRegister(
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
): Promise<AuthApiResult> {
  return postJson("/api/auth/register", { name, email, password, confirmPassword });
}

export function postPasswordReset(email: string): Promise<AuthApiResult> {
  return postJson("/api/auth/password-reset", { email });
}

export function postPasswordUpdate(
  password: string,
  confirmPassword: string,
): Promise<AuthApiResult> {
  return postJson("/api/auth/password-update", { password, confirmPassword });
}
