import { z } from "zod";

export const reportIssueSchema = z.object({
  listingId: z.string().cuid(),
  type: z.string().min(3, "Выберите тип обращения"),
  message: z.string().max(1000, "Сообщение слишком длинное").optional(),
  contact: z.string().max(200, "Контакт слишком длинный").optional(),
});

export type ReportIssueInput = z.infer<typeof reportIssueSchema>;
