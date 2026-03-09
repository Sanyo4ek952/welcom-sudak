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
    <main className="page-shell min-h-screen space-y-6 py-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="glass-card rounded-3xl px-5 py-4">
          <p className="text-sm text-slate-500">Admin</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{title}</h1>
        </div>

        <div className="glass-card flex items-center gap-2 rounded-full px-3 py-2">
          <Link className="rounded-full px-3 py-2 text-sm text-slate-700 hover:bg-white/70" href="/admin/listings">
            Карточки
          </Link>
          <Link className="rounded-full px-3 py-2 text-sm text-slate-700 hover:bg-white/70" href="/admin/issues">
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
