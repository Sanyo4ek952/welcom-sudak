import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";

type SearchListingsFormProps = {
  defaultValue?: string;
  actionPath?: string;
};

export function SearchListingsForm({ defaultValue = "", actionPath = "/listings" }: SearchListingsFormProps) {
  return (
    <form action={actionPath} className="flex w-full items-center gap-2 rounded-full bg-white/15 p-1 ring-1 ring-white/25 backdrop-blur-sm">
      <Input
        name="q"
        defaultValue={defaultValue}
        placeholder="Найти место в Судаке..."
        className="border-transparent bg-white/90 shadow-none focus:border-white/80 focus:ring-white/60"
      />
      <Button type="submit" className="shrink-0 bg-white text-slate-800 hover:bg-slate-100">
        Найти
      </Button>
    </form>
  );
}
