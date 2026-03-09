import { cn } from "@/shared/lib/cn";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition",
        variant === "primary" && "bg-slate-900 text-white hover:bg-slate-800",
        variant === "secondary" && "bg-sky-100 text-sky-800 hover:bg-sky-200",
        variant === "ghost" && "bg-transparent text-slate-700 hover:bg-slate-100",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
