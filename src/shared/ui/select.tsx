import { cn } from "@/shared/lib/cn";

type Option = {
  value: string;
  label: string;
};

type SelectProps = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "children"> & {
  options: Option[];
  placeholder?: string;
};

export function Select({ className, options, placeholder, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        "w-full rounded-xl border border-[var(--line)] bg-white/75 px-3.5 py-2.5 text-sm text-slate-900",
        "focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200",
        className,
      )}
      {...props}
    >
      {placeholder ? <option value="">{placeholder}</option> : null}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
