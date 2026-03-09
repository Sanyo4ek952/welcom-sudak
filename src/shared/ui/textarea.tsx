import { cn } from "@/shared/lib/cn";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "w-full rounded-xl border border-[var(--line)] bg-white/75 px-3.5 py-2.5 text-sm text-slate-900",
        "placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200",
        className,
      )}
      {...props}
    />
  );
}
