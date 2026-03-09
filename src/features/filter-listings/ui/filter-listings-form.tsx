import type { CategoryWithSubcategories } from "@/entities/category/model/types";
import type { ListingCatalogFilters } from "@/entities/listing/model/types";
import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";

type FilterListingsFormProps = {
  filters: ListingCatalogFilters;
  categories: CategoryWithSubcategories[];
  districts: string[];
};

export function FilterListingsForm({ filters, categories, districts }: FilterListingsFormProps) {
  const subcategoryOptions = categories.flatMap((category) =>
    category.subcategories.map((subcategory) => ({
      value: subcategory.slug,
      label: `${category.title} / ${subcategory.title}`,
    })),
  );

  return (
    <form className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2 lg:grid-cols-4">
      <Input name="q" defaultValue={filters.query} placeholder="Поиск по названию или описанию" />

      <Select
        name="category"
        defaultValue={filters.category}
        placeholder="Все категории"
        options={categories.map((category) => ({
          value: category.slug,
          label: category.title,
        }))}
      />

      <Select
        name="subcategory"
        defaultValue={filters.subcategory}
        placeholder="Все подкатегории"
        options={subcategoryOptions}
      />

      <Select
        name="district"
        defaultValue={filters.district}
        placeholder="Все районы"
        options={districts.map((district) => ({ value: district, label: district }))}
      />

      <Select
        name="sort"
        defaultValue={filters.sort}
        options={[
          { value: "featured", label: "Сначала рекомендуемые" },
          { value: "alphabetical", label: "По алфавиту" },
        ]}
      />

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input className="h-4 w-4 rounded border-slate-300" type="checkbox" name="delivery" value="1" defaultChecked={filters.delivery} />
        Есть доставка
      </label>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input className="h-4 w-4 rounded border-slate-300" type="checkbox" name="takeaway" value="1" defaultChecked={filters.takeaway} />
        Есть самовывоз
      </label>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input className="h-4 w-4 rounded border-slate-300" type="checkbox" name="featured" value="1" defaultChecked={filters.featured} />
        Только рекомендуемые
      </label>

      <div className="flex items-center gap-2">
        <Button type="submit">Применить</Button>
        <Link className="inline-flex rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100" href="/listings">
          Сбросить
        </Link>
      </div>
    </form>
  );
}
