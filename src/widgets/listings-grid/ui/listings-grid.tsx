import { ListingCard } from "@/entities/listing/ui/listing-card";
import type { ListingSummary } from "@/entities/listing/model/types";

type ListingsGridProps = {
  listings: ListingSummary[];
};

export function ListingsGrid({ listings }: ListingsGridProps) {
  if (listings.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
        Ничего не найдено. Попробуйте убрать часть фильтров или изменить поисковый запрос.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
