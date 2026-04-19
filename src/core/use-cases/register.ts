import type { AuthProvider, AuthResult } from "@/core/ports/auth-provider";
import { RegisterSchema } from "@/core/schemas/register-schema";

export class RegisterUseCase {
  constructor(private readonly authProvider: AuthProvider) {}

  async execute(
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
  ): Promise<AuthResult> {
    const validation = RegisterSchema.safeParse({ name, email, password, confirmPassword });

    if (!validation.success) {
      const firstError = validation.error.issues[0].message;
      return { success: false, error: firstError };
    }

    try {
      return await this.authProvider.signUp(
        validation.data.email,
        validation.data.password,
        validation.data.name,
      );
    } catch {
      return { success: false, error: "Erro inesperado. Tente novamente." };
    }
  }
}
