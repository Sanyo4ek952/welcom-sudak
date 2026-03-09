export type FeaturedListing = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  district: string | null;
  address: string | null;
  phone: string | null;
  coverImageUrl: string | null;
  category: {
    slug: string;
    title: string;
  };
};

export type ListingSummary = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  district: string | null;
  address: string | null;
  phone: string | null;
  coverImageUrl: string | null;
  hasDelivery: boolean;
  hasTakeaway: boolean;
  isFeatured: boolean;
  category: {
    slug: string;
    title: string;
  };
  subcategory: {
    slug: string;
    title: string;
  } | null;
};

export type ListingSort = "featured" | "alphabetical";

export type ListingCatalogFilters = {
  query: string;
  category: string;
  subcategory: string;
  district: string;
  delivery: boolean;
  takeaway: boolean;
  featured: boolean;
  sort: ListingSort;
};

export type ListingDetails = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  district: string | null;
  address: string | null;
  phone: string | null;
  whatsappUrl: string | null;
  telegramUrl: string | null;
  websiteUrl: string | null;
  instagramUrl: string | null;
  priceLabel: string | null;
  priceFrom: number | null;
  priceTo: number | null;
  workingHoursText: string | null;
  hasDelivery: boolean;
  hasTakeaway: boolean;
  coverImageUrl: string | null;
  category: {
    slug: string;
    title: string;
  };
  subcategory: {
    slug: string;
    title: string;
  } | null;
  images: Array<{
    id: string;
    url: string;
    alt: string | null;
    sortOrder: number;
  }>;
};

export type ListingCatalogItem = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  district: string | null;
  address: string | null;
  phone?: string | null;
  hasDelivery: boolean;
  hasTakeaway: boolean;
  isFeatured: boolean;
  coverImageUrl: string | null;
  category: {
    slug: string;
    title: string;
  };
  subcategory: {
    slug: string;
    title: string;
  } | null;
};
