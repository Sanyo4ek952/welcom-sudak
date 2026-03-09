import { ListingStatus } from "@prisma/client";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { AdminShell } from "@/app/admin/_components/admin-shell";
import { getActiveCategoriesWithSubcategories } from "@/entities/category/api/get-categories";
import { parseAdminListingFormData } from "@/entities/listing/model/admin-listing-schema";
import { AdminListingError, deleteAdminListing, getAdminListings, setAdminListingStatus, upsertAdminListing } from "@/entities/listing/api/admin-listings";
import { requireAdminSession } from "@/shared/lib/admin-auth";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";

export const metadata = {
  title: "Admin listings",
};

type AdminListingsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function firstValue(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

export default async function AdminListingsPage({ searchParams }: AdminListingsPageProps) {
  await requireAdminSession();
  const params = await searchParams;
  const errorMessage = firstValue(params.error);
  const successMessage = firstValue(params.success);

  const [listings, categories] = await Promise.all([getAdminListings(), getActiveCategoriesWithSubcategories()]);

  async function createListingAction(formData: FormData) {
    "use server";

    await requireAdminSession();

    const parsed = parseAdminListingFormData(formData, ListingStatus.draft);
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Проверьте заполнение формы.";
      redirect(`/admin/listings?error=${encodeURIComponent(message)}`);
    }

    try {
      await upsertAdminListing(parsed.data);
    } catch (error) {
      const message = error instanceof AdminListingError ? error.message : "Не удалось создать карточку.";
      redirect(`/admin/listings?error=${encodeURIComponent(message)}`);
    }

    revalidatePath("/admin/listings");
    revalidatePath("/listings");
    redirect("/admin/listings?success=Карточка создана");
  }

  async function updateStatusAction(formData: FormData) {
    "use server";

    await requireAdminSession();
    const id = String(formData.get("id") ?? "");
    const status = String(formData.get("status") ?? "draft") as ListingStatus;

    if (!id) {
      return;
    }

    try {
      await setAdminListingStatus(id, status);
    } catch (error) {
      const message = error instanceof AdminListingError ? error.message : "Не удалось обновить статус.";
      redirect(`/admin/listings?error=${encodeURIComponent(message)}`);
    }
    revalidatePath("/admin/listings");
    revalidatePath("/listings");
    redirect("/admin/listings?success=Статус обновлен");
  }

  async function archiveListingAction(formData: FormData) {
    "use server";

    await requireAdminSession();
    const id = String(formData.get("id") ?? "");
    if (!id) {
      return;
    }

    try {
      await setAdminListingStatus(id, ListingStatus.archived);
    } catch (error) {
      const message = error instanceof AdminListingError ? error.message : "Не удалось архивировать карточку.";
      redirect(`/admin/listings?error=${encodeURIComponent(message)}`);
    }
    revalidatePath("/admin/listings");
    revalidatePath("/listings");
    redirect("/admin/listings?success=Карточка архивирована");
  }

  async function deleteListingAction(formData: FormData) {
    "use server";

    await requireAdminSession();
    const id = String(formData.get("id") ?? "");
    const slug = String(formData.get("slug") ?? "");
    const confirmSlug = String(formData.get("confirmSlug") ?? "").trim();
    if (!id) {
      return;
    }
    if (!slug || confirmSlug !== slug) {
      redirect("/admin/listings?error=Для удаления введите точный slug карточки.");
    }

    try {
      await deleteAdminListing(id);
    } catch (error) {
      const message = error instanceof AdminListingError ? error.message : "Не удалось удалить карточку.";
      redirect(`/admin/listings?error=${encodeURIComponent(message)}`);
    }
    revalidatePath("/admin/listings");
    revalidatePath("/listings");
    if (slug) {
      revalidatePath(`/listing/${slug}`);
    }
    redirect("/admin/listings?success=Карточка удалена");
  }

  const subcategoryOptions = categories.flatMap((category) =>
    category.subcategories.map((subcategory) => ({
      value: subcategory.id,
      label: `${category.title} / ${subcategory.title}`,
    })),
  );

  return (
    <AdminShell title="Карточки мест">
      {errorMessage ? (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{errorMessage}</p>
      ) : null}
      {successMessage ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{successMessage}</p>
      ) : null}

      <section className="glass-card space-y-3 rounded-3xl p-5">
        <h2 className="text-xl font-semibold text-slate-900">Создать карточку</h2>
        <form action={createListingAction} className="grid gap-3 md:grid-cols-2">
          <Input name="title" required placeholder="Название" />
          <Input name="slug" required placeholder="slug (latin-kebab-case)" />
          <Input name="shortDescription" required placeholder="Короткое описание" />
          <Input name="district" placeholder="Район" />
          <Input name="address" placeholder="Адрес" />
          <Input name="phone" placeholder="Телефон" />
          <Input name="workingHoursText" placeholder="Часы работы" />
          <Input name="priceLabel" placeholder="Ценовая метка (напр. Средний чек)" />
          <Input name="priceFrom" type="number" placeholder="Цена от" />
          <Input name="priceTo" type="number" placeholder="Цена до" />
          <Input name="latitude" type="number" step="0.000001" placeholder="Широта" />
          <Input name="longitude" type="number" step="0.000001" placeholder="Долгота" />
          <Input name="websiteUrl" type="url" placeholder="Сайт (URL)" />
          <Input name="instagramUrl" type="url" placeholder="Instagram URL" />
          <Input name="telegramUrl" type="url" placeholder="Telegram URL" />
          <Input name="whatsappUrl" type="url" placeholder="WhatsApp URL" />
          <Input name="coverImageUrl" type="url" placeholder="Cover image URL" />
          <Select
            name="categoryId"
            options={categories.map((category) => ({
              value: category.id,
              label: category.title,
            }))}
          />
          <Select name="subcategoryId" placeholder="Подкатегория (опционально)" options={subcategoryOptions} />
          <Select
            name="status"
            options={[
              { value: ListingStatus.draft, label: "draft" },
              { value: ListingStatus.published, label: "published" },
              { value: ListingStatus.archived, label: "archived" },
            ]}
          />
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" name="hasDelivery" value="1" className="h-4 w-4 rounded border-slate-300" />
            Есть доставка
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" name="hasTakeaway" value="1" className="h-4 w-4 rounded border-slate-300" />
            Есть самовывоз
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" name="isFeatured" value="1" className="h-4 w-4 rounded border-slate-300" />
            Рекомендуемое место
          </label>
          <div className="md:col-span-2">
            <Textarea name="imageRows" rows={4} placeholder="Изображения (по строке): https://... | alt-текст (опционально)" />
          </div>
          <div className="md:col-span-2">
            <Textarea name="description" rows={5} required placeholder="Полное описание" />
          </div>
          <div className="md:col-span-2">
            <Button type="submit">Создать</Button>
          </div>
        </form>
      </section>

      <section className="glass-card space-y-3 rounded-3xl p-5">
        <h2 className="text-xl font-semibold text-slate-900">Список карточек</h2>
        <div className="space-y-2">
          {listings.map((listing) => (
            <article key={listing.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--line)] bg-white/55 p-4">
              <div>
                <p className="font-medium text-slate-900">{listing.title}</p>
                <p className="text-sm text-slate-600">
                  {listing.slug} · {listing.categoryTitle} · {listing.isFeatured ? "featured" : "regular"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <form action={updateStatusAction} className="flex items-center gap-2">
                  <input type="hidden" name="id" value={listing.id} />
                  <Select
                    name="status"
                    defaultValue={listing.status}
                    options={[
                      { value: ListingStatus.draft, label: "draft" },
                      { value: ListingStatus.published, label: "published" },
                      { value: ListingStatus.archived, label: "archived" },
                    ]}
                  />
                  <Button type="submit" variant="secondary">
                    Обновить статус
                  </Button>
                </form>

                <Link className="rounded-full px-3 py-2 text-sm text-[var(--accent-strong)] hover:bg-white/70" href={`/admin/listings/${listing.id}`}>
                  Редактировать
                </Link>
                <form action={archiveListingAction}>
                  <input type="hidden" name="id" value={listing.id} />
                  <Button type="submit" variant="secondary">
                    Архивировать
                  </Button>
                </form>
                <form action={deleteListingAction}>
                  <input type="hidden" name="id" value={listing.id} />
                  <input type="hidden" name="slug" value={listing.slug} />
                  <Input
                    name="confirmSlug"
                    placeholder="slug для удаления"
                    className="w-40"
                    aria-label={`Подтверждение удаления ${listing.slug}`}
                  />
                  <Button type="submit" variant="ghost">
                    Удалить
                  </Button>
                </form>
              </div>
            </article>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}
