import { ListingStatus } from "@prisma/client";
import { z } from "zod";

const MAX_IMAGE_ITEMS = 20;

const nullableText = z
  .string()
  .trim()
  .transform((value) => (value.length === 0 ? null : value));

const nullableUrl = z
  .string()
  .trim()
  .transform((value) => (value.length === 0 ? null : value))
  .refine((value) => value === null || z.string().url().safeParse(value).success, "Укажите корректный URL");

const nullableInt = z
  .union([z.number(), z.nan()])
  .transform((value) => (Number.isFinite(value) ? value : null))
  .refine((value) => value === null || Number.isInteger(value), "Значение должно быть целым числом")
  .refine((value) => value === null || value >= 0, "Значение не может быть отрицательным");

const nullableCoordinate = z
  .union([z.number(), z.nan()])
  .transform((value) => (Number.isFinite(value) ? value : null));

function parseCheckbox(rawValue: FormDataEntryValue | null): boolean {
  return rawValue === "1" || rawValue === "true" || rawValue === "on";
}

function parseNumber(rawValue: FormDataEntryValue | null): number {
  if (rawValue === null) {
    return Number.NaN;
  }
  const parsed = Number(String(rawValue).trim());
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

function parseImageRows(rawValue: FormDataEntryValue | null): Array<{ url: string; alt: string | null; sortOrder: number }> {
  const lines = String(rawValue ?? "")
    .split(/\r?\n/g)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, MAX_IMAGE_ITEMS);

  return lines.map((line, index) => {
    const [urlPart, altPart] = line.split("|");
    return {
      url: (urlPart ?? "").trim(),
      alt: altPart?.trim() ? altPart.trim() : null,
      sortOrder: index,
    };
  });
}

export const adminListingInputSchema = z
  .object({
    id: z.string().cuid().optional(),
    title: z.string().trim().min(2, "Название должно быть не короче 2 символов").max(140, "Название слишком длинное"),
    slug: z
      .string()
      .trim()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug должен быть в формате kebab-case"),
    shortDescription: z.string().trim().min(8, "Короткое описание слишком короткое").max(220, "Короткое описание слишком длинное"),
    description: z.string().trim().min(20, "Полное описание слишком короткое"),
    categoryId: z.string().cuid("Выберите категорию"),
    subcategoryId: nullableText,
    district: nullableText,
    address: nullableText,
    phone: nullableText,
    workingHoursText: nullableText,
    priceLabel: nullableText,
    websiteUrl: nullableUrl,
    instagramUrl: nullableUrl,
    telegramUrl: nullableUrl,
    whatsappUrl: nullableUrl,
    coverImageUrl: nullableUrl,
    priceFrom: nullableInt,
    priceTo: nullableInt,
    latitude: nullableCoordinate.refine((value) => value === null || (value >= -90 && value <= 90), "Широта должна быть в диапазоне -90..90"),
    longitude: nullableCoordinate.refine((value) => value === null || (value >= -180 && value <= 180), "Долгота должна быть в диапазоне -180..180"),
    hasDelivery: z.boolean(),
    hasTakeaway: z.boolean(),
    isFeatured: z.boolean(),
    status: z.nativeEnum(ListingStatus),
    images: z
      .array(
        z.object({
          url: z.string().url("Каждая строка в изображениях должна начинаться с валидного URL"),
          alt: z.string().max(180, "Alt-текст слишком длинный").nullable(),
          sortOrder: z.number().int().nonnegative(),
        }),
      )
      .max(MAX_IMAGE_ITEMS, `Максимум ${MAX_IMAGE_ITEMS} изображений`),
  })
  .refine(
    (value) => value.priceFrom === null || value.priceTo === null || value.priceFrom <= value.priceTo,
    {
      message: "Цена 'от' не может быть больше цены 'до'",
      path: ["priceTo"],
    },
  )
  .transform((value) => ({
    ...value,
    subcategoryId: value.subcategoryId ?? null,
  }));

export function parseAdminListingFormData(formData: FormData, currentStatus: ListingStatus = ListingStatus.draft) {
  return adminListingInputSchema.safeParse({
    id: String(formData.get("id") ?? "").trim() || undefined,
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    shortDescription: String(formData.get("shortDescription") ?? ""),
    description: String(formData.get("description") ?? ""),
    categoryId: String(formData.get("categoryId") ?? ""),
    subcategoryId: String(formData.get("subcategoryId") ?? ""),
    district: String(formData.get("district") ?? ""),
    address: String(formData.get("address") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    workingHoursText: String(formData.get("workingHoursText") ?? ""),
    priceLabel: String(formData.get("priceLabel") ?? ""),
    websiteUrl: String(formData.get("websiteUrl") ?? ""),
    instagramUrl: String(formData.get("instagramUrl") ?? ""),
    telegramUrl: String(formData.get("telegramUrl") ?? ""),
    whatsappUrl: String(formData.get("whatsappUrl") ?? ""),
    coverImageUrl: String(formData.get("coverImageUrl") ?? ""),
    priceFrom: parseNumber(formData.get("priceFrom")),
    priceTo: parseNumber(formData.get("priceTo")),
    latitude: parseNumber(formData.get("latitude")),
    longitude: parseNumber(formData.get("longitude")),
    hasDelivery: parseCheckbox(formData.get("hasDelivery")),
    hasTakeaway: parseCheckbox(formData.get("hasTakeaway")),
    isFeatured: parseCheckbox(formData.get("isFeatured")),
    status: (String(formData.get("status") ?? currentStatus) as ListingStatus) ?? currentStatus,
    images: parseImageRows(formData.get("imageRows")),
  });
}

export type AdminListingInput = z.infer<typeof adminListingInputSchema>;
