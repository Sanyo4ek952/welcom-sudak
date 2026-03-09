import { NextResponse } from "next/server";

import { createIssueReport } from "@/entities/listing/api/issue-reports";
import { reportIssueSchema } from "@/features/report-issue/model/schema";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parsed = reportIssueSchema.safeParse(payload);

    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Некорректные данные формы";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    await createIssueReport(parsed.data);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
  }
}
