type ListingCardProps = {
  listing: {
    title: string;
    shortDescription: string;
    district: string | null;
    address: string | null;
    phone?: string | null;
    coverImageUrl: string | null;
    category: {
      slug: string;
      title: string;
    };
  };
};

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="aspect-[16/9] bg-slate-100">
        {listing.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="h-full w-full object-cover" src={listing.coverImageUrl} alt={listing.title} />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">Фото добавляется</div>
        )}
      </div>
      <div className="space-y-3 p-4">
        <span className="inline-flex rounded-full bg-sky-100 px-2.5 py-1 text-xs font-medium text-sky-700">
          {listing.category.title}
        </span>
        <h3 className="text-lg font-semibold tracking-tight text-slate-900">{listing.title}</h3>
        <p className="line-clamp-2 text-sm text-slate-600">{listing.shortDescription}</p>
        <div className="space-y-1 text-sm text-slate-500">
          {listing.district && <p>Район: {listing.district}</p>}
          {listing.address && <p>Адрес: {listing.address}</p>}
          {listing.phone && <p>Телефон: {listing.phone}</p>}
        </div>
      </div>
    </article>
  );
}
