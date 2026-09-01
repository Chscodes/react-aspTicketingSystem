import { cn } from "../../lib/cn";

export function Spinner({ className, label = "Loading…" }) {
  return (
    <div className={cn("flex items-center justify-center gap-3", className)}>
      <div
        className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-800"
        aria-hidden
      />
      {label && <span className="text-sm text-zinc-500">{label}</span>}
    </div>
  );
}
