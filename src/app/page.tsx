import { getActiveCategories } from "@/entities/category/api/get-categories";
import { getFeaturedListings } from "@/entities/listing/api/get-featured-listings";
import { SearchListingsForm } from "@/features/search-listings/ui/search-listings-form";
import { ListingCard } from "@/entities/listing/ui/listing-card";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, featuredListings] = await Promise.all([getActiveCategories(), getFeaturedListings()]);

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl space-y-10 px-6 py-10">
      <section className="space-y-3">
        <span className="inline-flex rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white">
          Welcome Sudak
        </span>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
          Путеводитель по Судаку: куда пойти, где поесть и что полезно рядом
        </h1>
        <p className="max-w-3xl text-slate-600">
          Находите проверенные места в Судаке через каталог с фильтрами и подробные карточки.
        </p>
        <div className="max-w-xl">
          <SearchListingsForm />
        </div>
        <Link className="inline-flex text-sm font-medium text-sky-700 hover:text-sky-800" href="/listings">
          Открыть полный каталог →
        </Link>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Категории</h2>
          <p className="text-sm text-slate-600">Только активные категории с количеством опубликованных карточек.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <article key={category.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-slate-500">{category.slug}</p>
              <h3 className="mt-1 text-lg font-semibold text-slate-900">
                <Link href={`/listings?category=${encodeURIComponent(category.slug)}`} className="hover:underline">
                  {category.title}
                </Link>
              </h3>
              <p className="mt-2 text-sm text-slate-600">{category.description ?? "Описание будет добавлено позже."}</p>
              <p className="mt-3 text-sm font-medium text-sky-700">{category.listingsCount} опубликованных мест</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Рекомендуем посмотреть</h2>
          <p className="text-sm text-slate-600">Избранные места со статусом published.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featuredListings.length > 0 ? (
            featuredListings.map((listing) => <ListingCard key={listing.id} listing={listing} />)
          ) : (
            <p className="text-sm text-slate-500">Пока нет избранных мест. Добавьте `isFeatured` в админке или seed.</p>
          )}
        </div>
      </section>
    </main>
  );
}
