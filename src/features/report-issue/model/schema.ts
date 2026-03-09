import { z } from "zod";

export const ISSUE_REPORT_TYPES = ["wrong_address", "outdated_hours", "phone_unreachable", "other"] as const;

export const reportIssueSchema = z.object({
  listingId: z.string().cuid(),
  type: z.enum(ISSUE_REPORT_TYPES, { message: "Выберите корректный тип обращения" }),
  message: z
    .string()
    .trim()
    .max(1000, "Сообщение слишком длинное")
    .transform((value) => value || undefined)
    .optional(),
  contact: z
    .string()
    .trim()
    .max(200, "Контакт слишком длинный")
    .transform((value) => value || undefined)
    .optional(),
  captchaToken: z
    .string()
    .trim()
    .max(1000, "Некорректный captcha token")
    .transform((value) => value || undefined)
    .optional(),
});

export type ReportIssueInput = z.infer<typeof reportIssueSchema>;
