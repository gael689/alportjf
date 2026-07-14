import Link from "next/link";
import { getCategoriasDestacadas } from "@/data/categorias";
import { CategoryIcon } from "@/lib/category-icons";

export async function CategoryGrid() {
  const categorias = await getCategoriasDestacadas();
  if (categorias.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <h2 className="mb-5 font-heading text-2xl font-bold text-ink sm:text-3xl">
        Categorías
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {categorias.map((cat) => (
          <Link
            key={cat.id}
            href={`/productos?cat=${cat.slug}`}
            className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-white px-4 py-6 text-center transition-colors hover:border-brand hover:bg-brand-tint"
          >
            <span className="flex size-12 items-center justify-center rounded-full bg-brand-tint text-brand group-hover:bg-white">
              <CategoryIcon icono={cat.icono} className="size-6" />
            </span>
            <span className="text-sm font-medium text-ink">{cat.nombre}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
