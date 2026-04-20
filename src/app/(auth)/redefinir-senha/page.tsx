import type { Metadata } from "next";
import { Logo } from "@/components/ui/logo";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Nova senha | Maceng",
  description: "Defina uma nova senha para sua conta Maceng.",
};

export default function ResetPasswordPage() {
  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-8 shadow-lg">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>

        <h1 className="text-2xl font-bold text-center text-[var(--text-primary)] mb-2">
          Definir nova senha
        </h1>
        <p className="text-sm text-center text-[var(--text-muted)] mb-8">
          Escolha uma senha forte com pelo menos 6 caracteres.
        </p>

        <ResetPasswordForm />
      </div>
    </div>
  );
}
