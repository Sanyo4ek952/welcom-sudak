import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-4 px-6 py-10 text-center">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Страница не найдена</h1>
      <p className="text-sm text-slate-600">Проверьте адрес или перейдите в каталог мест.</p>
      <Link href="/listings" className="text-sm font-medium text-sky-700 hover:text-sky-800">
        Перейти в каталог
      </Link>
    </main>
  );
}
