import { prisma } from "@/shared/lib/prisma";
import { Prisma } from "@prisma/client";

import type { ListingFilters } from "../model/listing-filters";
import type { ListingCatalogItem } from "../model/types";

type ListingCatalogResult = {
  items: ListingCatalogItem[];
  total: number;
  page: number;
  pageSize: number;
  pages: number;
};

export async function getListings(filters: ListingFilters): Promise<ListingCatalogResult> {
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = Math.max(1, Math.min(24, filters.pageSize ?? 12));

  const where: Prisma.ListingWhereInput = {
    status: "published",
    ...(filters.query
      ? {
          OR: [
            { title: { contains: filters.query, mode: "insensitive" } },
            { shortDescription: { contains: filters.query, mode: "insensitive" } },
            { description: { contains: filters.query, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(filters.categorySlug ? { category: { slug: filters.categorySlug } } : {}),
    ...(filters.subcategorySlug ? { subcategory: { slug: filters.subcategorySlug } } : {}),
    ...(filters.district ? { district: filters.district } : {}),
    ...(filters.hasDelivery ? { hasDelivery: true } : {}),
    ...(filters.hasTakeaway ? { hasTakeaway: true } : {}),
    ...(filters.isFeatured ? { isFeatured: true } : {}),
  };

  const orderBy: Prisma.ListingOrderByWithRelationInput[] =
    filters.sort === "alphabetical"
      ? [{ title: "asc" }]
      : filters.sort === "recent"
        ? [{ updatedAt: "desc" }]
        : [{ isFeatured: "desc" }, { updatedAt: "desc" }];

  const [items, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        slug: true,
        title: true,
        shortDescription: true,
        district: true,
        address: true,
        phone: true,
        hasDelivery: true,
        hasTakeaway: true,
        isFeatured: true,
        coverImageUrl: true,
        category: {
          select: {
            slug: true,
            title: true,
          },
        },
        subcategory: {
          select: {
            slug: true,
            title: true,
          },
        },
      },
    }),
    prisma.listing.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    pageSize,
    pages: Math.max(1, Math.ceil(total / pageSize)),
  };
}
