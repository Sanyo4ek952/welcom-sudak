import { getActiveCategories } from "@/entities/category/api/get-categories";
import { getFeaturedListings } from "@/entities/listing/api/get-featured-listings";
import { SearchListingsForm } from "@/features/search-listings/ui/search-listings-form";
import { ListingCard } from "@/entities/listing/ui/listing-card";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, featuredListings] = await Promise.all([getActiveCategories(), getFeaturedListings()]);

  return (
    <main className="page-shell min-h-screen space-y-12 py-3 md:space-y-16">
      <section className="enter-rise relative overflow-hidden rounded-[2rem]">
        <div
          className="min-h-[430px] w-full bg-cover bg-center md:min-h-[560px]"
          style={{
            backgroundImage:
              "linear-gradient(103deg, rgba(9,48,73,0.7) 20%, rgba(9,68,102,0.46) 55%, rgba(10,74,112,0.26) 100%), url('https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1900&q=80')",
          }}
        >
          <div className="mx-auto flex min-h-[430px] max-w-3xl flex-col justify-center gap-6 px-6 py-10 text-slate-50 md:min-h-[560px] md:px-10">
            <span className="inline-flex w-fit rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-100">
              Welcome Sudak
            </span>
            <h1 className="display-title text-4xl leading-tight md:text-6xl">
              Путеводитель по Судаку: куда пойти, где поесть и что полезно рядом
            </h1>
            <p className="max-w-2xl text-sm text-slate-100/90 md:text-base">
              Находите проверенные места в Судаке через каталог с фильтрами и подробные карточки.
            </p>
            <div className="max-w-xl">
              <SearchListingsForm />
            </div>
            <div>
              <Link
                className="inline-flex rounded-full border border-white/45 bg-white/10 px-5 py-2 text-sm font-medium text-white transition hover:bg-white/20"
                href="/listings"
              >
                Смотреть проекты
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="enter-rise-delay space-y-5">
        <div>
          <h2 className="section-title">Категории</h2>
          <p className="section-subtitle">Только активные категории с количеством опубликованных карточек.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <article key={category.id} className="glass-card elevate rounded-2xl p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{category.slug}</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">
                <Link href={`/listings?category=${encodeURIComponent(category.slug)}`} className="hover:underline">
                  {category.title}
                </Link>
              </h3>
              <p className="mt-2 text-sm text-slate-600">{category.description ?? "Описание будет добавлено позже."}</p>
              <p className="mt-4 text-sm font-medium text-[var(--accent-strong)]">{category.listingsCount} опубликованных мест</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <h2 className="section-title">Рекомендуем посмотреть</h2>
          <p className="section-subtitle">Избранные места со статусом published.</p>
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
