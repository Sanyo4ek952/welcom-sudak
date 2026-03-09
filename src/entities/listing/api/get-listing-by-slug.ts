import { prisma } from "@/shared/lib/prisma";

import type { ListingDetails } from "../model/types";

export async function getListingBySlug(slug: string): Promise<ListingDetails | null> {
  const listing = await prisma.listing.findFirst({
    where: {
      slug,
      status: "published",
    },
    select: {
      id: true,
      slug: true,
      title: true,
      shortDescription: true,
      description: true,
      district: true,
      address: true,
      phone: true,
      whatsappUrl: true,
      telegramUrl: true,
      websiteUrl: true,
      instagramUrl: true,
      priceLabel: true,
      priceFrom: true,
      priceTo: true,
      workingHoursText: true,
      hasDelivery: true,
      hasTakeaway: true,
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
      images: {
        select: {
          id: true,
          url: true,
          alt: true,
          sortOrder: true,
        },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  return listing;
}
