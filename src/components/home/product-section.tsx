import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import type { Producto } from "@/data/types";
import { ProductCard } from "@/components/product/product-card";

export function ProductSection({
  titulo,
  subtitulo,
  productos,
  verTodoHref,
}: {
  titulo: string;
  subtitulo?: string;
  productos: Producto[];
  verTodoHref?: string;
}) {
  if (productos.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold text-ink sm:text-3xl">
            {titulo}
          </h2>
          {subtitulo && <p className="mt-1 text-sm text-muted-foreground">{subtitulo}</p>}
        </div>
        {verTodoHref && (
          <Link
            href={verTodoHref}
            className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-brand hover:underline sm:flex"
          >
            Ver todo
            <ArrowRightIcon className="size-4" />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {productos.map((producto) => (
          <ProductCard key={producto.id} producto={producto} />
        ))}
      </div>

      {verTodoHref && (
        <div className="mt-6 flex justify-center sm:hidden">
          <Link
            href={verTodoHref}
            className="flex items-center gap-1 text-sm font-semibold text-brand hover:underline"
          >
            Ver todo
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>
      )}
    </section>
  );
}
