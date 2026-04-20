import { z } from "zod";
import { firstValidationError } from "@/core/schemas/validation-helpers";

describe("firstValidationError", () => {
  const schema = z.object({
    email: z.string().min(1, "E-mail obrigatório").email("E-mail inválido"),
    age: z.number().min(18, "Idade mínima é 18"),
  });

  // Evita: múltiplos use cases dependerem do formato interno `issues[0].message` do Zod
  it("returns the first error message from a failed safeParse", () => {
    const result = schema.safeParse({ email: "", age: 10 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(firstValidationError(result)).toBe("E-mail obrigatório");
    }
  });

  // Evita: retornar "undefined" caso o array de issues venha vazio (defensive)
  it("falls back to generic message when issues array is empty", () => {
    const fakeResult = {
      success: false as const,
      error: { issues: [] } as unknown as z.ZodError,
    };
    expect(firstValidationError(fakeResult)).toBe("Dados inválidos");
  });
});
