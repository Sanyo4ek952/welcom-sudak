import { ListingStatus, type Prisma } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

import { prisma } from "@/shared/lib/prisma";

export type AdminListingRow = {
  id: string;
  slug: string;
  title: string;
  status: ListingStatus;
  isFeatured: boolean;
  categoryTitle: string;
  updatedAt: Date;
};

export async function getAdminListings(): Promise<AdminListingRow[]> {
  const listings = await prisma.listing.findMany({
    orderBy: [{ updatedAt: "desc" }],
    select: {
      id: true,
      slug: true,
      title: true,
      status: true,
      isFeatured: true,
      updatedAt: true,
      category: {
        select: {
          title: true,
        },
      },
    },
  });

  return listings.map((item) => ({
    id: item.id,
    slug: item.slug,
    title: item.title,
    status: item.status,
    isFeatured: item.isFeatured,
    categoryTitle: item.category.title,
    updatedAt: item.updatedAt,
  }));
}

export type UpsertListingInput = {
  id?: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  categoryId: string;
  subcategoryId?: string | null;
  district?: string | null;
  address?: string | null;
  phone?: string | null;
  workingHoursText?: string | null;
  priceLabel?: string | null;
  priceFrom?: number | null;
  priceTo?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  hasDelivery?: boolean;
  hasTakeaway?: boolean;
  isFeatured?: boolean;
  status?: ListingStatus;
  websiteUrl?: string | null;
  instagramUrl?: string | null;
  telegramUrl?: string | null;
  whatsappUrl?: string | null;
  coverImageUrl?: string | null;
  images?: Array<{
    url: string;
    alt?: string | null;
    sortOrder: number;
  }>;
};

export class AdminListingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AdminListingError";
  }
}

export async function upsertAdminListing(input: UpsertListingInput): Promise<void> {
  const payload: Prisma.ListingUncheckedCreateInput = {
    title: input.title,
    slug: input.slug,
    shortDescription: input.shortDescription,
    description: input.description,
    categoryId: input.categoryId,
    subcategoryId: input.subcategoryId ?? null,
    district: input.district ?? null,
    address: input.address ?? null,
    phone: input.phone ?? null,
    workingHoursText: input.workingHoursText ?? null,
    priceLabel: input.priceLabel ?? null,
    priceFrom: input.priceFrom ?? null,
    priceTo: input.priceTo ?? null,
    latitude: input.latitude ?? null,
    longitude: input.longitude ?? null,
    websiteUrl: input.websiteUrl ?? null,
    instagramUrl: input.instagramUrl ?? null,
    telegramUrl: input.telegramUrl ?? null,
    whatsappUrl: input.whatsappUrl ?? null,
    coverImageUrl: input.coverImageUrl ?? null,
    hasDelivery: input.hasDelivery ?? false,
    hasTakeaway: input.hasTakeaway ?? false,
    isFeatured: input.isFeatured ?? false,
    status: input.status ?? ListingStatus.draft,
  };

  if (input.id) {
    try {
      await prisma.listing.update({
        where: { id: input.id },
        data: {
          ...payload,
          images: input.images
            ? {
                deleteMany: {},
                create: input.images.map((image) => ({
                  url: image.url,
                  alt: image.alt ?? null,
                  sortOrder: image.sortOrder,
                })),
              }
            : undefined,
        },
      });
      return;
    } catch (error) {
      throw toAdminListingError(error);
    }
  }

  try {
    await prisma.listing.create({
      data: {
        ...payload,
        images: input.images
          ? {
              create: input.images.map((image) => ({
                url: image.url,
                alt: image.alt ?? null,
                sortOrder: image.sortOrder,
              })),
            }
          : undefined,
      },
    });
  } catch (error) {
    throw toAdminListingError(error);
  }
}

export async function setAdminListingStatus(id: string, status: ListingStatus): Promise<void> {
  try {
    await prisma.listing.update({
      where: { id },
      data: { status },
    });
  } catch (error) {
    throw toAdminListingError(error);
  }
}

export async function deleteAdminListing(id: string): Promise<void> {
  try {
    await prisma.listing.delete({
      where: { id },
    });
  } catch (error) {
    throw toAdminListingError(error);
  }
}

export async function getAdminListingById(id: string) {
  return prisma.listing.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      slug: true,
      shortDescription: true,
      description: true,
      categoryId: true,
      subcategoryId: true,
      district: true,
      address: true,
      phone: true,
      workingHoursText: true,
      priceLabel: true,
      priceFrom: true,
      priceTo: true,
      latitude: true,
      longitude: true,
      websiteUrl: true,
      instagramUrl: true,
      telegramUrl: true,
      whatsappUrl: true,
      coverImageUrl: true,
      hasDelivery: true,
      hasTakeaway: true,
      isFeatured: true,
      status: true,
      images: {
        select: {
          id: true,
          url: true,
          alt: true,
          sortOrder: true,
        },
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });
}

function toAdminListingError(error: unknown): AdminListingError {
  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      const targets = Array.isArray(error.meta?.target) ? error.meta.target.join(", ") : String(error.meta?.target ?? "");
      if (targets.includes("slug")) {
        return new AdminListingError("Карточка с таким slug уже существует.");
      }
      return new AdminListingError("Нарушение уникальности данных. Проверьте форму и попробуйте снова.");
    }

    if (error.code === "P2025") {
      return new AdminListingError("Карточка не найдена или уже была удалена.");
    }
  }

  return new AdminListingError("Не удалось сохранить карточку. Попробуйте снова.");
}
