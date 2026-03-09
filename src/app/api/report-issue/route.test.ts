import { beforeEach, describe, expect, it, vi } from "vitest";

const createIssueReportMock = vi.fn();

vi.mock("@/entities/listing/api/issue-reports", () => ({
  createIssueReport: createIssueReportMock,
}));

describe("POST /api/report-issue", () => {
  beforeEach(() => {
    createIssueReportMock.mockReset();
    createIssueReportMock.mockResolvedValue(undefined);
  });

  it("returns 400 for invalid payload", async () => {
    const { POST } = await import("./route");
    const request = new Request("http://localhost/api/report-issue", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ listingId: "bad", type: "other" }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it("returns 200 and persists issue", async () => {
    const { POST } = await import("./route");
    const request = new Request("http://localhost/api/report-issue", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": "127.0.0.1",
      },
      body: JSON.stringify({
        listingId: "ckh6x9m6j0000s8l4c5f0abcd",
        type: "wrong_address",
        message: "Address changed",
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    expect(createIssueReportMock).toHaveBeenCalledTimes(1);
  });
});
