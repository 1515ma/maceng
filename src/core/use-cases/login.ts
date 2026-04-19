import type { AuthProvider, AuthResult } from "@/core/ports/auth-provider";
import { LoginSchema } from "@/core/schemas/login-schema";

export class LoginUseCase {
  constructor(private readonly authProvider: AuthProvider) {}

  async execute(email: string, password: string): Promise<AuthResult> {
    const validation = LoginSchema.safeParse({ email, password });

    if (!validation.success) {
      const firstError = validation.error.issues[0].message;
      return { success: false, error: firstError };
    }

    try {
      return await this.authProvider.signInWithEmail(
        validation.data.email,
        validation.data.password,
      );
    } catch {
      return { success: false, error: "Erro inesperado. Tente novamente." };
    }
  }
}
