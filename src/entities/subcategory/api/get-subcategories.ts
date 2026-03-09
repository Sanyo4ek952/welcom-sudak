import { prisma } from "@/shared/lib/prisma";

import type { SubcategoryOption } from "../model/types";

export async function getActiveSubcategories(): Promise<SubcategoryOption[]> {
  return prisma.subcategory.findMany({
    where: { isActive: true },
    orderBy: [{ category: { sortOrder: "asc" } }, { sortOrder: "asc" }],
    select: {
      id: true,
      categoryId: true,
      slug: true,
      title: true,
    },
  });
}
