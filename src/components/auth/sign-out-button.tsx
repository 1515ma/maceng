"use client";

import { LogOut } from "lucide-react";

interface SignOutButtonProps {
  onSignOut: () => void | Promise<void>;
}

export function SignOutButton({ onSignOut }: SignOutButtonProps) {
  return (
    <button
      type="button"
      onClick={onSignOut}
      className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-color)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-colors"
    >
      <LogOut className="h-4 w-4" />
      Sair
    </button>
  );
}
