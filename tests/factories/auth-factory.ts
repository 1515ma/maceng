import type { AuthProvider, AuthResult } from "@/core/ports/auth-provider";
import type { User } from "@/core/entities/user";
import { createUser } from "./user-factory";

export function createMockAuthProvider(
  overrides: Partial<AuthProvider> = {},
  user?: User,
): AuthProvider {
  const mockUser = user ?? createUser();
  return {
    signInWithEmail: jest.fn(async (): Promise<AuthResult> => ({ success: true, user: mockUser })),
    signUp: jest.fn(async (): Promise<AuthResult> => ({ success: true, user: mockUser })),
    signInWithGoogle: jest.fn(async () => ({ success: true as const, redirectUrl: "https://google.com" })),
    signOut: jest.fn(async () => {}),
    getUser: jest.fn(async () => mockUser),
    sendPasswordResetEmail: jest.fn(async () => ({ success: true as const })),
    updatePassword: jest.fn(async (): Promise<AuthResult> => ({ success: true, user: mockUser })),
    ...overrides,
  };
}
