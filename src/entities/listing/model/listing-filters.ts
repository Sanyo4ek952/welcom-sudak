export type ListingSort = "featured" | "alphabetical" | "recent";

export type ListingFilters = {
  query?: string;
  categorySlug?: string;
  subcategorySlug?: string;
  district?: string;
  hasDelivery?: boolean;
  hasTakeaway?: boolean;
  isFeatured?: boolean;
  sort?: ListingSort;
  page?: number;
  pageSize?: number;
};
