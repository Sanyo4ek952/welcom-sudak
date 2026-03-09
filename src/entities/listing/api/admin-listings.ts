import { ListingStatus, type Prisma } from "@prisma/client";

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
  hasDelivery?: boolean;
  hasTakeaway?: boolean;
  isFeatured?: boolean;
  status?: ListingStatus;
};

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
    hasDelivery: input.hasDelivery ?? false,
    hasTakeaway: input.hasTakeaway ?? false,
    isFeatured: input.isFeatured ?? false,
    status: input.status ?? ListingStatus.draft,
  };

  if (input.id) {
    await prisma.listing.update({
      where: { id: input.id },
      data: payload,
    });
    return;
  }

  await prisma.listing.create({ data: payload });
}

export async function setAdminListingStatus(id: string, status: ListingStatus): Promise<void> {
  await prisma.listing.update({
    where: { id },
    data: { status },
  });
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
      hasDelivery: true,
      hasTakeaway: true,
      isFeatured: true,
      status: true,
    },
  });
}
