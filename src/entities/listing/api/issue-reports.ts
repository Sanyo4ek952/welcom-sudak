import { IssueReportStatus } from "@prisma/client";

import { prisma } from "@/shared/lib/prisma";

export async function createIssueReport(input: {
  listingId: string;
  type: string;
  message?: string;
  contact?: string;
}): Promise<void> {
  await prisma.issueReport.create({
    data: {
      listingId: input.listingId,
      type: input.type,
      message: input.message ?? null,
      contact: input.contact ?? null,
      status: IssueReportStatus.new,
    },
  });
}

export type AdminIssueRow = {
  id: string;
  status: IssueReportStatus;
  type: string;
  message: string | null;
  contact: string | null;
  createdAt: Date;
  listing: {
    id: string;
    title: string;
    slug: string;
  };
};

export async function getAdminIssueReports(): Promise<AdminIssueRow[]> {
  return prisma.issueReport.findMany({
    orderBy: [{ createdAt: "desc" }],
    select: {
      id: true,
      status: true,
      type: true,
      message: true,
      contact: true,
      createdAt: true,
      listing: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
    },
  });
}

export async function setIssueReportStatus(id: string, status: IssueReportStatus): Promise<void> {
  await prisma.issueReport.update({
    where: { id },
    data: { status },
  });
}
