import { describe, expect, it } from "vitest";

import { reportIssueSchema } from "./schema";

describe("reportIssueSchema", () => {
  it("accepts valid payload and trims optional fields", () => {
    const parsed = reportIssueSchema.safeParse({
      listingId: "ckh6x9m6j0000s8l4c5f0abcd",
      type: "wrong_address",
      message: "  needs update  ",
      contact: "  demo@example.com  ",
    });

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.message).toBe("needs update");
      expect(parsed.data.contact).toBe("demo@example.com");
    }
  });

  it("rejects unsupported issue type", () => {
    const parsed = reportIssueSchema.safeParse({
      listingId: "ckh6x9m6j0000s8l4c5f0abcd",
      type: "bad_type",
    });
    expect(parsed.success).toBe(false);
  });
});
