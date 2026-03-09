import { describe, expect, it } from "vitest";

import { parseListingCatalogFilters } from "./query-params";

describe("parseListingCatalogFilters", () => {
  it("normalizes raw query values", () => {
    const parsed = parseListingCatalogFilters({
      q: " beach ",
      category: "food",
      subcategory: "cafes",
      district: " center ",
      delivery: "1",
      takeaway: "yes",
      featured: "true",
      sort: "alphabetical",
    });

    expect(parsed).toEqual({
      query: "beach",
      category: "food",
      subcategory: "cafes",
      district: "center",
      delivery: true,
      takeaway: true,
      featured: true,
      sort: "alphabetical",
    });
  });

  it("falls back to defaults", () => {
    const parsed = parseListingCatalogFilters({});
    expect(parsed.sort).toBe("featured");
    expect(parsed.delivery).toBe(false);
    expect(parsed.query).toBe("");
  });
});
