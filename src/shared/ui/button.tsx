import { cn } from "@/shared/lib/cn";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-medium transition",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300",
        variant === "primary" && "bg-[var(--accent)] text-white shadow-[0_10px_25px_rgba(14,87,128,0.28)] hover:bg-[var(--accent-strong)]",
        variant === "secondary" && "bg-white/70 text-slate-700 ring-1 ring-[var(--line)] hover:bg-white",
        variant === "ghost" && "bg-transparent text-slate-700 hover:bg-white/60",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
