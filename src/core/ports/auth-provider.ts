import type { User } from "@/core/entities/user";

export type AuthResult =
  | { success: true; user: User }
  | { success: false; error: string };

export type GoogleAuthResult =
  | { success: true; redirectUrl: string }
  | { success: false; error: string };

export type PasswordResetEmailResult =
  | { success: true }
  | { success: false; error: string };

export interface AuthProvider {
  signInWithEmail(email: string, password: string): Promise<AuthResult>;
  signUp(email: string, password: string, name: string): Promise<AuthResult>;
  signInWithGoogle(): Promise<GoogleAuthResult>;
  signOut(): Promise<void>;
  getUser(): Promise<User | null>;
  sendPasswordResetEmail(email: string): Promise<PasswordResetEmailResult>;
  updatePassword(newPassword: string): Promise<AuthResult>;
}
