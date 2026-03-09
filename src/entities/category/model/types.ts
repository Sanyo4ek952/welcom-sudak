export type CategoryPreview = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  listingsCount: number;
};

export type CategoryWithSubcategories = {
  id: string;
  slug: string;
  title: string;
  subcategories: Array<{
    id: string;
    slug: string;
    title: string;
  }>;
};
