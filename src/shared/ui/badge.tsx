import { cn } from "@/shared/lib/cn";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "soft";
};

export function Badge({ className, variant = "soft", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-medium",
        variant === "default" && "bg-[var(--accent)] text-white",
        variant === "soft" && "bg-sky-100/80 text-[var(--accent-strong)] ring-1 ring-sky-200/70",
        className,
      )}
      {...props}
    />
  );
}
