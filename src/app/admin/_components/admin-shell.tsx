import Link from "next/link";
import { redirect } from "next/navigation";

import { logoutAdmin } from "@/shared/lib/admin-auth";
import { Button } from "@/shared/ui/button";

type AdminShellProps = {
  title: string;
  children: React.ReactNode;
};

export function AdminShell({ title, children }: AdminShellProps) {
  async function logoutAction() {
    "use server";
    await logoutAdmin();
    redirect("/admin");
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl space-y-6 px-6 py-10">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">Admin</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{title}</h1>
        </div>

        <div className="flex items-center gap-2">
          <Link className="rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100" href="/admin/listings">
            Карточки
          </Link>
          <Link className="rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100" href="/admin/issues">
            Issue reports
          </Link>
          <form action={logoutAction}>
            <Button type="submit" variant="ghost">
              Выйти
            </Button>
          </form>
        </div>
      </header>

      {children}
    </main>
  );
}
