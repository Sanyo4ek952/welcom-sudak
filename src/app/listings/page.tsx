import Link from "next/link";

import { getActiveCategoriesWithSubcategories } from "@/entities/category/api/get-categories";
import { getCatalogDistricts, getListingsCatalog } from "@/entities/listing/api/get-listings-catalog";
import { parseListingCatalogFilters } from "@/features/filter-listings/model/query-params";
import { FilterListingsForm } from "@/features/filter-listings/ui/filter-listings-form";
import { ListingsGrid } from "@/widgets/listings-grid/ui/listings-grid";

type ListingsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata = {
  title: "Каталог мест",
  description: "Каталог мест в Судаке с поиском, фильтрами и сортировкой.",
};

export const dynamic = "force-dynamic";

export default async function ListingsPage({ searchParams }: ListingsPageProps) {
  const params = await searchParams;
  const filters = parseListingCatalogFilters(params);

  const [categories, districts, listings] = await Promise.all([
    getActiveCategoriesWithSubcategories(),
    getCatalogDistricts(),
    getListingsCatalog(filters),
  ]);

  return (
    <main className="page-shell min-h-screen space-y-6 py-8">
      <div className="glass-card enter-rise space-y-2 rounded-3xl p-6">
        <Link href="/" className="text-sm text-[var(--accent-strong)] hover:text-sky-800">
          ← На главную
        </Link>
        <h1 className="section-title">Каталог мест</h1>
        <p className="section-subtitle">Поиск, фильтры и shareable URL для подбора мест в Судаке.</p>
      </div>

      <FilterListingsForm filters={filters} categories={categories} districts={districts} />

      <ListingsGrid listings={listings} />
    </main>
  );
}
