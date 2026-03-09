import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { isAdminAuthenticated, loginAdmin } from "@/shared/lib/admin-auth";
import { readClientIp } from "@/shared/lib/rate-limit";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

type AdminLoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata = {
  title: "Admin login",
};

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const hasSession = await isAdminAuthenticated();
  if (hasSession) {
    redirect("/admin/listings");
  }

  const params = await searchParams;
  const hasError = typeof params.error === "string" && params.error.length > 0;
  const errorMessage = typeof params.error === "string" ? params.error : "";

  async function loginAction(formData: FormData) {
    "use server";

    const password = String(formData.get("password") ?? "");
    const headerStore = await headers();
    const loginResult = await loginAdmin(password, readClientIp(headerStore));

    if (!loginResult.ok) {
      redirect(`/admin?error=${encodeURIComponent(loginResult.message)}`);
    }

    redirect("/admin/listings");
  }

  return (
    <main className="page-shell flex min-h-screen max-w-md items-center py-10">
      <form action={loginAction} className="glass-card w-full space-y-4 rounded-3xl p-6">
        <h1 className="text-2xl font-semibold text-slate-900">Админка Welcome Sudak</h1>
        <p className="text-sm text-slate-600">Введите пароль администратора для доступа к управлению карточками.</p>

        <Input name="password" type="password" required placeholder="Пароль" />
        {hasError ? <p className="text-sm text-rose-700">{errorMessage}</p> : null}

        <Button className="w-full" type="submit">
          Войти
        </Button>
      </form>
    </main>
  );
}
