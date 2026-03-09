import type { ListingCatalogFilters, ListingSort } from "@/entities/listing/model/types";

type RawSearchParams = Record<string, string | string[] | undefined>;

function pickValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }
  return value ?? "";
}

function parseBooleanFlag(value: string): boolean {
  return value === "1" || value === "true" || value === "yes";
}

function parseSort(value: string): ListingSort {
  return value === "alphabetical" ? "alphabetical" : "featured";
}

export function parseListingCatalogFilters(rawParams: RawSearchParams): ListingCatalogFilters {
  return {
    query: pickValue(rawParams.q).trim(),
    category: pickValue(rawParams.category).trim(),
    subcategory: pickValue(rawParams.subcategory).trim(),
    district: pickValue(rawParams.district).trim(),
    delivery: parseBooleanFlag(pickValue(rawParams.delivery)),
    takeaway: parseBooleanFlag(pickValue(rawParams.takeaway)),
    featured: parseBooleanFlag(pickValue(rawParams.featured)),
    sort: parseSort(pickValue(rawParams.sort)),
  };
}
