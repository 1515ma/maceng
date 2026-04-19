import { Cog } from "lucide-react";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white shadow-md">
        <Cog className="h-5 w-5" />
      </div>
      <span className="text-xl font-bold tracking-tight">
        <span className="text-brand-600">Mac</span>
        <span className="text-[var(--text-primary)]">eng</span>
      </span>
    </Link>
  );
}
