import { ListingStatus } from "@prisma/client";
import Link from "next/link";
import { revalidatePath } from "next/cache";

import { AdminShell } from "@/app/admin/_components/admin-shell";
import { getActiveCategoriesWithSubcategories } from "@/entities/category/api/get-categories";
import { getAdminListings, setAdminListingStatus, upsertAdminListing } from "@/entities/listing/api/admin-listings";
import { requireAdminSession } from "@/shared/lib/admin-auth";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";

export const metadata = {
  title: "Admin listings",
};

export default async function AdminListingsPage() {
  await requireAdminSession();

  const [listings, categories] = await Promise.all([getAdminListings(), getActiveCategoriesWithSubcategories()]);

  async function createListingAction(formData: FormData) {
    "use server";

    await requireAdminSession();

    const categoryId = String(formData.get("categoryId") ?? "");
    if (!categoryId) {
      return;
    }

    await upsertAdminListing({
      title: String(formData.get("title") ?? ""),
      slug: String(formData.get("slug") ?? ""),
      shortDescription: String(formData.get("shortDescription") ?? ""),
      description: String(formData.get("description") ?? ""),
      categoryId,
      subcategoryId: String(formData.get("subcategoryId") ?? "") || null,
      district: String(formData.get("district") ?? "") || null,
      address: String(formData.get("address") ?? "") || null,
      phone: String(formData.get("phone") ?? "") || null,
      workingHoursText: String(formData.get("workingHoursText") ?? "") || null,
      priceLabel: String(formData.get("priceLabel") ?? "") || null,
      priceFrom: Number(formData.get("priceFrom") || 0) || null,
      priceTo: Number(formData.get("priceTo") || 0) || null,
      hasDelivery: Boolean(formData.get("hasDelivery")),
      hasTakeaway: Boolean(formData.get("hasTakeaway")),
      isFeatured: Boolean(formData.get("isFeatured")),
      status: (String(formData.get("status") ?? "draft") as ListingStatus) || ListingStatus.draft,
    });

    revalidatePath("/admin/listings");
    revalidatePath("/listings");
  }

  async function updateStatusAction(formData: FormData) {
    "use server";

    await requireAdminSession();
    const id = String(formData.get("id") ?? "");
    const status = String(formData.get("status") ?? "draft") as ListingStatus;

    if (!id) {
      return;
    }

    await setAdminListingStatus(id, status);
    revalidatePath("/admin/listings");
    revalidatePath("/listings");
  }

  const subcategoryOptions = categories.flatMap((category) =>
    category.subcategories.map((subcategory) => ({
      value: subcategory.id,
      label: `${category.title} / ${subcategory.title}`,
    })),
  );

  return (
    <AdminShell title="Карточки мест">
      <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
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
            <Textarea name="description" rows={5} required placeholder="Полное описание" />
          </div>
          <div className="md:col-span-2">
            <Button type="submit">Создать</Button>
          </div>
        </form>
      </section>

      <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Список карточек</h2>
        <div className="space-y-2">
          {listings.map((listing) => (
            <article key={listing.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 p-3">
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

                <Link className="rounded-lg px-3 py-2 text-sm text-sky-700 hover:bg-sky-50" href={`/admin/listings/${listing.id}`}>
                  Редактировать
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}
