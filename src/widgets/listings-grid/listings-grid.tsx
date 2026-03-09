import { ListingCard } from "@/entities/listing/ui/listing-card";
import type { ListingCatalogItem } from "@/entities/listing/model/types";

type ListingsGridProps = {
  items: ListingCatalogItem[];
};

export function ListingsGrid({ items }: ListingsGridProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-600">
        По выбранным фильтрам ничего не найдено.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <ListingCard key={item.id} listing={item} />
      ))}
    </div>
  );
}
