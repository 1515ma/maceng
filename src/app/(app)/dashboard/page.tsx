import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/infra/database/supabase-server";
import { SupabaseAuthProvider } from "@/infra/services/supabase-auth-provider";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export const metadata: Metadata = {
  title: "Dashboard | Maceng",
  description: "Painel do usuário Maceng — acesso às calculadoras e gestão do plano.",
};

// Server Component: valida sessão no servidor antes de expor qualquer dado.
// DevSecOps: rota privada por default (redireciona para /login se não autenticado).
export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const authProvider = new SupabaseAuthProvider(supabase);
  const user = await authProvider.getUser();

  if (!user) {
    redirect("/login");
  }

  return <DashboardContent user={user} />;
}
