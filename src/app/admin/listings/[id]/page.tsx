import { ListingStatus } from "@prisma/client";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { AdminShell } from "@/app/admin/_components/admin-shell";
import { getActiveCategoriesWithSubcategories } from "@/entities/category/api/get-categories";
import { parseAdminListingFormData } from "@/entities/listing/model/admin-listing-schema";
import { AdminListingError, getAdminListingById, upsertAdminListing } from "@/entities/listing/api/admin-listings";
import { requireAdminSession } from "@/shared/lib/admin-auth";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";

type AdminListingEditPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function firstValue(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

export default async function AdminListingEditPage({ params, searchParams }: AdminListingEditPageProps) {
  await requireAdminSession();
  const { id } = await params;
  const query = await searchParams;
  const errorMessage = firstValue(query.error);

  const [listing, categories] = await Promise.all([getAdminListingById(id), getActiveCategoriesWithSubcategories()]);
  if (!listing) {
    notFound();
  }
  const currentListing = listing;

  async function updateListingAction(formData: FormData) {
    "use server";

    await requireAdminSession();

    const parsed = parseAdminListingFormData(formData, currentListing.status);
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Проверьте форму перед сохранением.";
      redirect(`/admin/listings/${id}?error=${encodeURIComponent(message)}`);
    }

    try {
      await upsertAdminListing({
        ...parsed.data,
        id,
      });
    } catch (error) {
      const message = error instanceof AdminListingError ? error.message : "Не удалось сохранить карточку.";
      redirect(`/admin/listings/${id}?error=${encodeURIComponent(message)}`);
    }

    revalidatePath("/admin/listings");
    revalidatePath(`/admin/listings/${id}`);
    revalidatePath("/listings");
    revalidatePath(`/listing/${parsed.data.slug}`);
    redirect("/admin/listings");
  }

  const subcategoryOptions = categories.flatMap((category) =>
    category.subcategories.map((subcategory) => ({
      value: subcategory.id,
      label: `${category.title} / ${subcategory.title}`,
    })),
  );

  return (
    <AdminShell title="Редактирование карточки">
      {errorMessage ? (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{errorMessage}</p>
      ) : null}

      <div>
        <Link href="/admin/listings" className="text-sm text-[var(--accent-strong)] hover:text-sky-800">
          ← Назад к списку
        </Link>
      </div>

      <form action={updateListingAction} className="glass-card grid gap-3 rounded-3xl p-5 md:grid-cols-2">
        <input type="hidden" name="id" value={id} />
        <Input name="title" required defaultValue={currentListing.title} />
        <Input name="slug" required defaultValue={currentListing.slug} />
        <Input name="shortDescription" required defaultValue={currentListing.shortDescription} />
        <Input name="district" defaultValue={currentListing.district ?? ""} />
        <Input name="address" defaultValue={currentListing.address ?? ""} />
        <Input name="phone" defaultValue={currentListing.phone ?? ""} />
        <Input name="workingHoursText" defaultValue={currentListing.workingHoursText ?? ""} />
        <Input name="priceLabel" defaultValue={currentListing.priceLabel ?? ""} />
        <Input name="priceFrom" type="number" defaultValue={currentListing.priceFrom ?? ""} />
        <Input name="priceTo" type="number" defaultValue={currentListing.priceTo ?? ""} />
        <Input name="latitude" type="number" step="0.000001" defaultValue={currentListing.latitude?.toString() ?? ""} />
        <Input name="longitude" type="number" step="0.000001" defaultValue={currentListing.longitude?.toString() ?? ""} />
        <Input name="websiteUrl" type="url" defaultValue={currentListing.websiteUrl ?? ""} />
        <Input name="instagramUrl" type="url" defaultValue={currentListing.instagramUrl ?? ""} />
        <Input name="telegramUrl" type="url" defaultValue={currentListing.telegramUrl ?? ""} />
        <Input name="whatsappUrl" type="url" defaultValue={currentListing.whatsappUrl ?? ""} />
        <Input name="coverImageUrl" type="url" defaultValue={currentListing.coverImageUrl ?? ""} />
        <Select
          name="categoryId"
          defaultValue={currentListing.categoryId}
          options={categories.map((category) => ({
            value: category.id,
            label: category.title,
          }))}
        />
        <Select
          name="subcategoryId"
          defaultValue={currentListing.subcategoryId ?? ""}
          placeholder="Подкатегория (опционально)"
          options={subcategoryOptions}
        />
        <Select
          name="status"
          defaultValue={currentListing.status}
          options={[
            { value: ListingStatus.draft, label: "draft" },
            { value: ListingStatus.published, label: "published" },
            { value: ListingStatus.archived, label: "archived" },
          ]}
        />
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" name="hasDelivery" value="1" defaultChecked={currentListing.hasDelivery} className="h-4 w-4 rounded border-slate-300" />
          Есть доставка
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" name="hasTakeaway" value="1" defaultChecked={currentListing.hasTakeaway} className="h-4 w-4 rounded border-slate-300" />
          Есть самовывоз
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" name="isFeatured" value="1" defaultChecked={currentListing.isFeatured} className="h-4 w-4 rounded border-slate-300" />
          Рекомендуемое место
        </label>
        <div className="md:col-span-2">
          <Textarea
            name="imageRows"
            rows={5}
            defaultValue={currentListing.images.map((image) => `${image.url}${image.alt ? ` | ${image.alt}` : ""}`).join("\n")}
            placeholder="Изображения (по строке): https://... | alt-текст (опционально)"
          />
        </div>
        <div className="md:col-span-2">
          <Textarea name="description" rows={6} required defaultValue={currentListing.description} />
        </div>
        <div className="md:col-span-2">
          <Button type="submit">Сохранить</Button>
        </div>
      </form>
    </AdminShell>
  );
}
