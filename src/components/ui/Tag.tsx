import { cn } from "@/lib/utils";

export function Tag({ children, className, active }: { children: React.ReactNode; className?: string; active?: boolean }) {
  return (
    <span
      className={cn(
        "label inline-flex h-8 items-center rounded-sm border px-2.5 text-[0.6875rem] text-fg-muted",
        active ? "border-accent bg-accent text-accent-fg" : "border-border bg-surface-1",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function TagList({ items, className }: { items: readonly string[]; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {items.map((t) => (
        <li key={t}>
          <Tag>{t}</Tag>
        </li>
      ))}
    </ul>
  );
}
