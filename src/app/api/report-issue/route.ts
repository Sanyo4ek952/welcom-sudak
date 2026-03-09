import { NextResponse } from "next/server";

import { createIssueReport } from "@/entities/listing/api/issue-reports";
import { reportIssueSchema } from "@/features/report-issue/model/schema";
import { checkRateLimit, readClientIp } from "@/shared/lib/rate-limit";

const ISSUE_RATE_LIMIT = {
  limit: 8,
  windowMs: 5 * 60 * 1000,
};

async function verifyCaptchaToken(token: string): Promise<boolean> {
  // Hook point for reCAPTCHA/hCaptcha verification provider integration.
  return token.trim().length > 0;
}

export async function POST(request: Request) {
  try {
    const clientIp = readClientIp(request.headers);
    const rate = checkRateLimit(`issue:${clientIp}`, ISSUE_RATE_LIMIT.limit, ISSUE_RATE_LIMIT.windowMs);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: `Слишком много обращений. Повторите через ${rate.retryAfterSeconds} сек.` },
        {
          status: 429,
          headers: {
            "Retry-After": String(rate.retryAfterSeconds),
          },
        },
      );
    }

    const payload = await request.json();
    const parsed = reportIssueSchema.safeParse(payload);

    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Некорректные данные формы";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const isCaptchaEnabled = process.env.REPORT_ISSUE_CAPTCHA_ENABLED === "true";
    if (isCaptchaEnabled) {
      const token = parsed.data.captchaToken;
      if (!token) {
        return NextResponse.json({ error: "Подтвердите CAPTCHA и повторите отправку." }, { status: 400 });
      }
      const isCaptchaValid = await verifyCaptchaToken(token);
      if (!isCaptchaValid) {
        return NextResponse.json({ error: "Не удалось проверить CAPTCHA." }, { status: 400 });
      }
    }

    await createIssueReport(parsed.data);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
  }
}
