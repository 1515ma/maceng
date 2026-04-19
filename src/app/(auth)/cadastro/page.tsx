import type { Metadata } from "next";
import { Logo } from "@/components/ui/logo";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Criar conta | Maceng",
  description: "Crie sua conta gratuita no Maceng e acesse calculadoras de engenharia mecânica.",
};

export default function RegisterPage() {
  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-8 shadow-lg">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>

        <h1 className="text-2xl font-bold text-center text-[var(--text-primary)] mb-2">
          Criar sua conta
        </h1>
        <p className="text-sm text-center text-[var(--text-muted)] mb-8">
          Comece grátis com 5 cálculos por dia
        </p>

        <RegisterForm />
      </div>
    </div>
  );
}
