import { redirect } from "next/navigation";

import { isAdminAuthenticated, loginAdmin } from "@/shared/lib/admin-auth";
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
  const hasError = params.error === "1";

  async function loginAction(formData: FormData) {
    "use server";

    const password = String(formData.get("password") ?? "");
    const success = await loginAdmin(password);

    if (!success) {
      redirect("/admin?error=1");
    }

    redirect("/admin/listings");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6 py-10">
      <form action={loginAction} className="w-full space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Админка Welcome Sudak</h1>
        <p className="text-sm text-slate-600">Введите пароль администратора для доступа к управлению карточками.</p>

        <Input name="password" type="password" required placeholder="Пароль" />
        {hasError ? <p className="text-sm text-rose-700">Неверный пароль.</p> : null}

        <Button className="w-full" type="submit">
          Войти
        </Button>
      </form>
    </main>
  );
}
