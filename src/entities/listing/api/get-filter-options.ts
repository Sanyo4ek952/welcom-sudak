import { prisma } from "@/shared/lib/prisma";

export async function getListingFilterOptions() {
  const [categories, subcategories, districts] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      select: { id: true, slug: true, title: true },
    }),
    prisma.subcategory.findMany({
      where: { isActive: true },
      orderBy: [{ category: { sortOrder: "asc" } }, { sortOrder: "asc" }],
      select: {
        id: true,
        categoryId: true,
        slug: true,
        title: true,
      },
    }),
    prisma.listing.findMany({
      where: { status: "published", district: { not: null } },
      distinct: ["district"],
      select: { district: true },
      orderBy: { district: "asc" },
    }),
  ]);

  return {
    categories,
    subcategories,
    districts: districts.map((item) => item.district).filter((district): district is string => Boolean(district)),
  };
}
