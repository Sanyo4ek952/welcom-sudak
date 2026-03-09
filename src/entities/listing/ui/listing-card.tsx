import Link from "next/link";

type ListingCardProps = {
  listing: {
    slug: string;
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
    <article className="glass-card elevate overflow-hidden rounded-3xl transition hover:shadow-xl">
      <Link href={`/listing/${listing.slug}`} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300">
        <div className="aspect-[16/9] bg-slate-100">
          {listing.coverImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="h-full w-full object-cover" src={listing.coverImageUrl} alt={listing.title} />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="h-full w-full object-cover"
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
              alt="Панорамный вид на море"
            />
          )}
        </div>
        <div className="space-y-3 p-5">
          <span className="inline-flex rounded-full bg-sky-100/90 px-3 py-1 text-xs font-medium text-[var(--accent-strong)] ring-1 ring-sky-200/70">
            {listing.category.title}
          </span>
          <h3 className="display-title text-2xl leading-tight text-slate-900">{listing.title}</h3>
          <p className="line-clamp-2 text-sm text-slate-600">{listing.shortDescription}</p>
          <div className="space-y-1 text-sm text-slate-500">
            {listing.district && <p>Район: {listing.district}</p>}
            {listing.address && <p>Адрес: {listing.address}</p>}
            {listing.phone && <p>Телефон: {listing.phone}</p>}
          </div>
          <span className="inline-flex text-sm font-medium text-[var(--accent-strong)]">Подробнее →</span>
        </div>
      </Link>
    </article>
  );
}
