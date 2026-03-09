import { prisma } from "@/shared/lib/prisma";

import type { ListingCatalogFilters, ListingSummary } from "../model/types";

export async function getListingsCatalog(filters: ListingCatalogFilters): Promise<ListingSummary[]> {
  const listings = await prisma.listing.findMany({
    where: {
      status: "published",
      category: filters.category ? { slug: filters.category } : undefined,
      subcategory: filters.subcategory ? { slug: filters.subcategory } : undefined,
      district: filters.district ? filters.district : undefined,
      hasDelivery: filters.delivery ? true : undefined,
      hasTakeaway: filters.takeaway ? true : undefined,
      isFeatured: filters.featured ? true : undefined,
      OR: filters.query
        ? [
            { title: { contains: filters.query, mode: "insensitive" } },
            { shortDescription: { contains: filters.query, mode: "insensitive" } },
            { description: { contains: filters.query, mode: "insensitive" } },
          ]
        : undefined,
    },
    orderBy:
      filters.sort === "alphabetical"
        ? [{ title: "asc" }]
        : [{ isFeatured: "desc" }, { updatedAt: "desc" }],
    select: {
      id: true,
      slug: true,
      title: true,
      shortDescription: true,
      district: true,
      address: true,
      phone: true,
      coverImageUrl: true,
      hasDelivery: true,
      hasTakeaway: true,
      isFeatured: true,
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
  });

  return listings;
}

export async function getCatalogDistricts(): Promise<string[]> {
  const districts = await prisma.listing.findMany({
    where: {
      status: "published",
      district: { not: null },
    },
    select: { district: true },
    distinct: ["district"],
    orderBy: { district: "asc" },
  });

  return districts.flatMap((item) => (item.district ? [item.district] : []));
}
