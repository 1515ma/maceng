"use client";

import { useState } from "react";
import { GoogleButton } from "@/components/auth/google-button";
import { startGoogleSignIn } from "@/adapters/http/google-sign-in";

interface GoogleSignInFieldProps {
  label: string;
}

// Encapsula o estado loading/error do OAuth Google para remover duplicação
// entre LoginForm e RegisterForm (DRY).
export function GoogleSignInField({ label }: GoogleSignInFieldProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  async function handleClick() {
    setError(undefined);
    setLoading(true);
    try {
      await startGoogleSignIn();
    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err.message : "Erro ao conectar com Google");
    }
  }

  return (
    <div className="space-y-2">
      <GoogleButton label={label} onClick={handleClick} loading={loading} />
      {error && (
        <p className="text-xs text-red-500 text-center" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
