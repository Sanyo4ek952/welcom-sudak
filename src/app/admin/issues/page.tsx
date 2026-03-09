import { IssueReportStatus } from "@prisma/client";
import Link from "next/link";
import { revalidatePath } from "next/cache";

import { AdminShell } from "@/app/admin/_components/admin-shell";
import { getAdminIssueReports, setIssueReportStatus } from "@/entities/listing/api/issue-reports";
import { requireAdminSession } from "@/shared/lib/admin-auth";
import { Button } from "@/shared/ui/button";
import { Select } from "@/shared/ui/select";

export const metadata = {
  title: "Admin issues",
};

export default async function AdminIssuesPage() {
  await requireAdminSession();
  const issues = await getAdminIssueReports();

  async function updateIssueStatusAction(formData: FormData) {
    "use server";

    await requireAdminSession();

    const id = String(formData.get("id") ?? "");
    const status = String(formData.get("status") ?? IssueReportStatus.new) as IssueReportStatus;
    if (!id) {
      return;
    }

    await setIssueReportStatus(id, status);
    revalidatePath("/admin/issues");
  }

  return (
    <AdminShell title="Issue reports">
      <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        {issues.length === 0 ? <p className="text-sm text-slate-600">Обращений пока нет.</p> : null}

        {issues.map((issue) => (
          <article key={issue.id} className="space-y-2 rounded-lg border border-slate-200 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-medium text-slate-900">{issue.type}</p>
                <p className="text-sm text-slate-600">
                  По карточке{" "}
                  <Link href={`/listing/${issue.listing.slug}`} className="text-sky-700 hover:text-sky-800">
                    {issue.listing.title}
                  </Link>
                </p>
              </div>

              <form action={updateIssueStatusAction} className="flex items-center gap-2">
                <input type="hidden" name="id" value={issue.id} />
                <Select
                  name="status"
                  defaultValue={issue.status}
                  options={[
                    { value: IssueReportStatus.new, label: "new" },
                    { value: IssueReportStatus.reviewed, label: "reviewed" },
                    { value: IssueReportStatus.resolved, label: "resolved" },
                  ]}
                />
                <Button type="submit" variant="secondary">
                  Сохранить
                </Button>
              </form>
            </div>

            <p className="text-sm text-slate-700">{issue.message ?? "Комментарий не указан."}</p>
            <p className="text-xs text-slate-500">Контакт: {issue.contact ?? "не указан"}</p>
          </article>
        ))}
      </section>
    </AdminShell>
  );
}
