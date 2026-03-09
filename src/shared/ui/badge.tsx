import { cn } from "@/shared/lib/cn";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "soft";
};

export function Badge({ className, variant = "soft", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
        variant === "default" && "bg-slate-900 text-white",
        variant === "soft" && "bg-sky-100 text-sky-700",
        className,
      )}
      {...props}
    />
  );
}
