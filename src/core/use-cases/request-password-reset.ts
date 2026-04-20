import type { AuthProvider, PasswordResetEmailResult } from "@/core/ports/auth-provider";
import { PasswordResetSchema } from "@/core/schemas/password-reset-schema";
import { firstValidationError } from "@/core/schemas/validation-helpers";

export class RequestPasswordResetUseCase {
  constructor(private readonly authProvider: AuthProvider) {}

  // DevSecOps (OWASP A07): após validação de formato, a resposta é sempre success=true
  // para prevenir user enumeration via erro/sucesso distintos.
  async execute(
    email: string,
    redirectTo: string,
  ): Promise<PasswordResetEmailResult> {
    const validation = PasswordResetSchema.safeParse({ email });

    if (!validation.success) {
      return { success: false, error: firstValidationError(validation) };
    }

    try {
      await this.authProvider.sendPasswordResetEmail(
        validation.data.email,
        redirectTo,
      );
    } catch {
      // Silencia falhas internas (SMTP, rede) para não vazar informação operacional
    }

    return { success: true };
  }
}
