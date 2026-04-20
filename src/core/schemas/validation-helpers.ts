import type { ZodError } from "zod";

type SafeParseFailure = { success: false; error: ZodError };

// Extrai a primeira mensagem de erro de um resultado safeParse do Zod.
// Centraliza o acesso a `issues[0].message` para evitar depender de detalhes internos do Zod
// em múltiplos use cases.
export function firstValidationError(result: SafeParseFailure): string {
  return result.error.issues[0]?.message ?? "Dados inválidos";
}
