import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getListingBySlug } from "@/entities/listing/api/get-listing-by-slug";
import { Badge } from "@/shared/ui/badge";
import { Card } from "@/shared/ui/card";
import { ReportIssueForm } from "@/features/report-issue/ui/report-issue-form";

type ListingDetailsPageProps = {
  params: Promise<{ slug: string }>;
};

function formatPriceRange(priceFrom: number | null, priceTo: number | null): string | null {
  if (priceFrom && priceTo) return `${priceFrom} - ${priceTo} RUB`;
  if (priceFrom) return `от ${priceFrom} RUB`;
  if (priceTo) return `до ${priceTo} RUB`;
  return null;
}

export async function generateMetadata({ params }: ListingDetailsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);

  if (!listing) {
    return {
      title: "Место не найдено",
      description: "Запрошенная карточка места не найдена.",
    };
  }

  return {
    title: listing.title,
    description: listing.shortDescription,
    openGraph: {
      title: listing.title,
      description: listing.shortDescription,
      images: listing.coverImageUrl ? [listing.coverImageUrl] : [],
    },
  };
}

export const dynamic = "force-dynamic";

export default async function ListingDetailsPage({ params }: ListingDetailsPageProps) {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);

  if (!listing) {
    notFound();
  }

  const price = formatPriceRange(listing.priceFrom, listing.priceTo);

  return (
    <main className="page-shell min-h-screen space-y-6 py-8">
      <div className="glass-card enter-rise space-y-2 rounded-3xl p-6">
        <Link href="/listings" className="text-sm text-[var(--accent-strong)] hover:text-sky-800">
          ← В каталог
        </Link>
        <Badge>{listing.category.title}</Badge>
        <h1 className="section-title">{listing.title}</h1>
        <p className="max-w-3xl text-slate-600">{listing.shortDescription}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <Card className="space-y-3 p-5">
            <h2 className="display-title text-3xl text-slate-900">Описание</h2>
            <p className="text-sm leading-6 text-slate-700">{listing.description || "Описание пока не заполнено."}</p>
          </Card>

          <Card className="space-y-3 p-5">
            <h2 className="display-title text-3xl text-slate-900">Галерея</h2>
            {listing.images.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {listing.images.map((image) => (
                  <div key={image.id} className="overflow-hidden rounded-xl border border-[var(--line)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="h-48 w-full object-cover" src={image.url} alt={image.alt ?? listing.title} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-[var(--line)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="h-56 w-full object-cover"
                  src="https://images.unsplash.com/photo-1540202404-a2f29016b523?auto=format&fit=crop&w=1300&q=80"
                  alt="Временное стоковое фото"
                />
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="space-y-2 p-5">
            <h2 className="display-title text-3xl text-slate-900">Ключевая информация</h2>
            <p className="text-sm text-slate-700">Подкатегория: {listing.subcategory?.title ?? "Не указана"}</p>
            <p className="text-sm text-slate-700">Район: {listing.district ?? "Не указан"}</p>
            <p className="text-sm text-slate-700">Адрес: {listing.address ?? "Не указан"}</p>
            <p className="text-sm text-slate-700">Телефон: {listing.phone ?? "Не указан"}</p>
            <p className="text-sm text-slate-700">Часы работы: {listing.workingHoursText ?? "Не указаны"}</p>
            <p className="text-sm text-slate-700">Цена: {price ?? listing.priceLabel ?? "Не указана"}</p>
            <p className="text-sm text-slate-700">Доставка: {listing.hasDelivery ? "Да" : "Нет"}</p>
            <p className="text-sm text-slate-700">Самовывоз: {listing.hasTakeaway ? "Да" : "Нет"}</p>
          </Card>

          <Card className="space-y-2 p-5">
            <h2 className="display-title text-3xl text-slate-900">Быстрые действия</h2>
            {listing.websiteUrl ? (
              <a className="block text-sm text-[var(--accent-strong)] hover:text-sky-800" href={listing.websiteUrl} target="_blank" rel="noreferrer">
                Сайт
              </a>
            ) : null}
            {listing.instagramUrl ? (
              <a className="block text-sm text-[var(--accent-strong)] hover:text-sky-800" href={listing.instagramUrl} target="_blank" rel="noreferrer">
                Instagram
              </a>
            ) : null}
            {listing.telegramUrl ? (
              <a className="block text-sm text-[var(--accent-strong)] hover:text-sky-800" href={listing.telegramUrl} target="_blank" rel="noreferrer">
                Telegram
              </a>
            ) : null}
            {listing.whatsappUrl ? (
              <a className="block text-sm text-[var(--accent-strong)] hover:text-sky-800" href={listing.whatsappUrl} target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            ) : null}
            {!listing.websiteUrl && !listing.instagramUrl && !listing.telegramUrl && !listing.whatsappUrl ? (
              <p className="text-sm text-slate-500">Ссылки пока не добавлены.</p>
            ) : null}
          </Card>

          <ReportIssueForm listingId={listing.id} />
        </div>
      </div>
    </main>
  );
}
