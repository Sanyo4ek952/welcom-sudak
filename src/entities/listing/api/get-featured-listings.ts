import { prisma } from "@/shared/lib/prisma";

import type { FeaturedListing } from "../model/types";

export async function getFeaturedListings(limit = 6): Promise<FeaturedListing[]> {
  const listings = await prisma.listing.findMany({
    where: {
      status: "published",
      isFeatured: true,
    },
    orderBy: [{ updatedAt: "desc" }],
    take: limit,
    select: {
      id: true,
      slug: true,
      title: true,
      shortDescription: true,
      district: true,
      address: true,
      phone: true,
      coverImageUrl: true,
      category: {
        select: {
          slug: true,
          title: true,
        },
      },
    },
  });

  return listings;
}
