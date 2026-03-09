"use client";

import { useState } from "react";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";

type ReportIssueFormProps = {
  listingId: string;
};

export function ReportIssueForm({ listingId }: ReportIssueFormProps) {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(formData: FormData) {
    try {
      setState("loading");
      setErrorMessage("");

      const payload = {
        listingId,
        type: String(formData.get("type") ?? ""),
        message: String(formData.get("message") ?? ""),
        contact: String(formData.get("contact") ?? ""),
        captchaToken: String(formData.get("captchaToken") ?? ""),
      };

      const response = await fetch("/api/report-issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        setState("error");
        setErrorMessage(data?.error ?? "Не удалось отправить обращение.");
        return;
      }

      setState("success");
    } catch {
      setState("error");
      setErrorMessage("Не удалось отправить обращение.");
    }
  }

  return (
    <form
      action={handleSubmit}
      className="glass-card space-y-3 rounded-3xl p-5"
    >
      <h3 className="text-lg font-semibold text-slate-900">Сообщить об ошибке</h3>
      <p className="text-sm text-slate-600">Нашли неточность в карточке? Отправьте обращение, и мы проверим информацию.</p>

      <Select
        name="type"
        required
        placeholder="Тип проблемы"
        options={[
          { value: "wrong_address", label: "Неверный адрес" },
          { value: "outdated_hours", label: "Устаревшие часы работы" },
          { value: "phone_unreachable", label: "Телефон недоступен" },
          { value: "other", label: "Другое" },
        ]}
      />

      <Textarea name="message" rows={4} placeholder="Подробности (необязательно)" />
      <Input name="contact" placeholder="Контакт для связи (email/телефон, необязательно)" />
      <input type="hidden" name="captchaToken" value="" />

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={state === "loading"}>
          {state === "loading" ? "Отправляем..." : "Отправить"}
        </Button>
        {state === "success" ? <span className="text-sm text-emerald-700">Спасибо, обращение сохранено.</span> : null}
        {state === "error" ? <span className="text-sm text-rose-700">{errorMessage}</span> : null}
      </div>
    </form>
  );
}
