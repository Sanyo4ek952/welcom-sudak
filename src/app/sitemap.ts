import type { MetadataRoute } from "next";

import { prisma } from "@/shared/lib/prisma";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const listings = await prisma.listing
    .findMany({
      where: { status: "published" },
      select: {
        slug: true,
        updatedAt: true,
      },
    })
    .catch(() => []);

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/listings`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  const listingPages: MetadataRoute.Sitemap = listings.map((listing) => ({
    url: `${baseUrl}/listing/${listing.slug}`,
    lastModified: listing.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticPages, ...listingPages];
}
