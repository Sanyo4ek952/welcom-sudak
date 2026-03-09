import { Input } from "@/shared/ui/input";

type SearchListingsFormProps = {
  defaultValue?: string;
  actionPath?: string;
};

export function SearchListingsForm({ defaultValue = "", actionPath = "/listings" }: SearchListingsFormProps) {
  return (
    <form action={actionPath} className="w-full">
      <Input name="q" defaultValue={defaultValue} placeholder="Найти место в Судаке..." />
    </form>
  );
}
