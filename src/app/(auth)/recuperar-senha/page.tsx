import type { Metadata } from "next";
import { Logo } from "@/components/ui/logo";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Recuperar senha | Maceng",
  description: "Recupere o acesso à sua conta Maceng. Enviaremos um link de redefinição para seu e-mail.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-8 shadow-lg">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>

        <h1 className="text-2xl font-bold text-center text-[var(--text-primary)] mb-2">
          Recuperar senha
        </h1>
        <p className="text-sm text-center text-[var(--text-muted)] mb-8">
          Informe seu e-mail e enviaremos instruções para redefinir sua senha.
        </p>

        <ForgotPasswordForm />
      </div>
    </div>
  );
}
