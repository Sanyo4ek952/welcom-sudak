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
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="text-lg font-semibold text-slate-900">
              Welcome Sudak
            </Link>
            <nav className="flex items-center gap-3 text-sm text-slate-600">
              <Link href="/listings" className="hover:text-slate-900">
                Каталог
              </Link>
              <Link href="/admin" className="hover:text-slate-900">
                Админка
              </Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
