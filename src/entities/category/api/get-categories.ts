import { prisma } from "@/shared/lib/prisma";

import type { CategoryPreview, CategoryWithSubcategories } from "../model/types";

export async function getActiveCategories(): Promise<CategoryPreview[]> {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      _count: {
        select: {
          listings: {
            where: {
              status: "published",
            },
          },
        },
      },
    },
  });

  return categories.map((category) => ({
    id: category.id,
    slug: category.slug,
    title: category.title,
    description: category.description,
    listingsCount: category._count.listings,
  }));
}

export async function getActiveCategoriesWithSubcategories(): Promise<CategoryWithSubcategories[]> {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      slug: true,
      title: true,
      subcategories: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        select: {
          id: true,
          slug: true,
          title: true,
        },
      },
    },
  });

  return categories;
}
