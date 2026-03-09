import { ListingStatus } from "@prisma/client";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { AdminShell } from "@/app/admin/_components/admin-shell";
import { getActiveCategoriesWithSubcategories } from "@/entities/category/api/get-categories";
import { getAdminListingById, upsertAdminListing } from "@/entities/listing/api/admin-listings";
import { requireAdminSession } from "@/shared/lib/admin-auth";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";

type AdminListingEditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminListingEditPage({ params }: AdminListingEditPageProps) {
  await requireAdminSession();
  const { id } = await params;

  const [listing, categories] = await Promise.all([getAdminListingById(id), getActiveCategoriesWithSubcategories()]);
  if (!listing) {
    notFound();
  }
  const currentListing = listing;

  async function updateListingAction(formData: FormData) {
    "use server";

    await requireAdminSession();

    await upsertAdminListing({
      id,
      title: String(formData.get("title") ?? ""),
      slug: String(formData.get("slug") ?? ""),
      shortDescription: String(formData.get("shortDescription") ?? ""),
      description: String(formData.get("description") ?? ""),
      categoryId: String(formData.get("categoryId") ?? ""),
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
      status: (String(formData.get("status") ?? currentListing.status) as ListingStatus) || currentListing.status,
    });

    revalidatePath("/admin/listings");
    revalidatePath(`/admin/listings/${id}`);
    revalidatePath("/listings");
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
      <div>
        <Link href="/admin/listings" className="text-sm text-sky-700 hover:text-sky-800">
          ← Назад к списку
        </Link>
      </div>

      <form action={updateListingAction} className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2">
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
          <Textarea name="description" rows={6} required defaultValue={currentListing.description} />
        </div>
        <div className="md:col-span-2">
          <Button type="submit">Сохранить</Button>
        </div>
      </form>
    </AdminShell>
  );
}
