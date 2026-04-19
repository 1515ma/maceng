export function AuthDivider() {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-[var(--border-color)]" />
      </div>
      <div className="relative flex justify-center text-xs">
        <span className="bg-[var(--card-bg)] px-3 text-[var(--text-muted)]">
          ou continue com e-mail
        </span>
      </div>
    </div>
  );
}
