import { cn } from "@/shared/lib/cn";

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return <div className={cn("glass-card rounded-2xl", className)} {...props} />;
}
