import type { Metadata } from 'next';
import Link from "next/link";
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: "Welcome Sudak",
    template: "%s | Welcome Sudak",
  },
  description: "Путеводитель по Судаку: каталог мест, карточки и быстрый доступ к полезной информации.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <header className="page-shell sticky top-0 z-40 py-4">
          <div className="glass-card flex items-center justify-between rounded-full px-5 py-3">
            <Link href="/" className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-700 sm:text-base">
              Welcome Sudak
            </Link>
            <nav className="hidden items-center gap-4 text-sm text-slate-600 md:flex">
              <Link href="/" className="hover:text-slate-900">
                Главная
              </Link>
              <Link href="/listings" className="hover:text-slate-900">
                Каталог
              </Link>
              <Link href="/admin" className="rounded-full border border-[var(--line)] px-4 py-1.5 hover:text-slate-900">
                Админка
              </Link>
            </nav>
            <details className="relative md:hidden">
              <summary className="cursor-pointer list-none rounded-full border border-[var(--line)] px-3 py-1 text-sm text-slate-700">
                Меню
              </summary>
              <div className="glass-card absolute right-0 mt-2 w-44 rounded-2xl p-2 text-sm text-slate-700">
                <Link href="/" className="block rounded-xl px-3 py-2 hover:bg-white/60">
                  Главная
                </Link>
                <Link href="/listings" className="block rounded-xl px-3 py-2 hover:bg-white/60">
                  Каталог
                </Link>
                <Link href="/admin" className="block rounded-xl px-3 py-2 hover:bg-white/60">
                  Админка
                </Link>
              </div>
            </details>
          </div>
        </header>
        <div className="pb-12">{children}</div>
      </body>
    </html>
  );
}
