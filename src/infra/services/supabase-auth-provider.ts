import type { SupabaseClient } from "@supabase/supabase-js";
import type { AuthProvider, AuthResult, GoogleAuthResult } from "@/core/ports/auth-provider";
import type { User, SubscriptionPlan } from "@/core/entities/user";

export class SupabaseAuthProvider implements AuthProvider {
  constructor(private readonly supabase: SupabaseClient) {}

  async signInWithEmail(email: string, password: string): Promise<AuthResult> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      return { success: false, error: error?.message ?? "Credenciais inválidas" };
    }

    const user = await this.resolveUser(data.user.id, data.user.email!);
    return { success: true, user };
  }

  async signUp(email: string, password: string, name: string): Promise<AuthResult> {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    });

    if (error || !data.user) {
      return { success: false, error: error?.message ?? "Erro ao criar conta" };
    }

    const user = await this.resolveUser(data.user.id, data.user.email!);
    return { success: true, user };
  }

  async signInWithGoogle(): Promise<GoogleAuthResult> {
    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/api/auth/callback`,
      },
    });

    if (error || !data.url) {
      return { success: false, error: error?.message ?? "Erro ao iniciar login com Google" };
    }

    return { success: true, redirectUrl: data.url };
  }

  async signOut(): Promise<void> {
    await this.supabase.auth.signOut();
  }

  async getUser(): Promise<User | null> {
    const { data: { user } } = await this.supabase.auth.getUser();

    if (!user) return null;

    return this.resolveUser(user.id, user.email!);
  }

  // O(1) — busca direta por PK (uuid indexado)
  private async resolveUser(authId: string, email: string): Promise<User> {
    const { data } = await this.supabase
      .from("profiles")
      .select("id, name, plan, calculations_used, created_at")
      .eq("id", authId)
      .single();

    if (data) {
      return {
        id: data.id,
        email,
        name: data.name,
        plan: data.plan as SubscriptionPlan,
        calculationsUsed: data.calculations_used,
        createdAt: new Date(data.created_at),
      };
    }

    return {
      id: authId,
      email,
      name: null,
      plan: "free",
      calculationsUsed: 0,
      createdAt: new Date(),
    };
  }
}
