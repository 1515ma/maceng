import type { AuthProvider, AuthResult } from "@/core/ports/auth-provider";
import { PasswordUpdateSchema } from "@/core/schemas/password-update-schema";
import { firstValidationError } from "@/core/schemas/validation-helpers";

export class UpdatePasswordUseCase {
  constructor(private readonly authProvider: AuthProvider) {}

  async execute(password: string, confirmPassword: string): Promise<AuthResult> {
    const validation = PasswordUpdateSchema.safeParse({ password, confirmPassword });

    if (!validation.success) {
      return { success: false, error: firstValidationError(validation) };
    }

    try {
      return await this.authProvider.updatePassword(validation.data.password);
    } catch {
      return { success: false, error: "Erro inesperado. Tente novamente." };
    }
  }
}
