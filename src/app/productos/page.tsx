import { Suspense } from "react";
import type { Metadata } from "next";
import { PRODUCTOS } from "@/data/productos";
import { getCategoriaBySlug } from "@/data/categorias";
import { filtrarYOrdenarProductos, type CatalogSort } from "@/lib/catalog-filters";
import { ProductFilters } from "@/components/catalog/product-filters";
import { ProductCard } from "@/components/product/product-card";

export const metadata: Metadata = {
  title: "Catálogo completo",
  description:
    "Descubrí todo el catálogo de Alport JF: electrodomésticos, climatización, TV, pinturería, bazar, muebles, colchones y herramientas.",
};

type SearchParams = Promise<{
  cat?: string;
  q?: string;
  min?: string;
  max?: string;
  sort?: string;
}>;

export default async function ProductosPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const categoria = params.cat ? getCategoriaBySlug(params.cat) : undefined;

  const productos = filtrarYOrdenarProductos(PRODUCTOS, {
    cat: params.cat,
    q: params.q,
    min: params.min ? Number(params.min) : undefined,
    max: params.max ? Number(params.max) : undefined,
    sort: params.sort as CatalogSort | undefined,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-bold text-ink">
          {categoria ? categoria.nombre : "Catálogo completo"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {productos.length} producto{productos.length !== 1 ? "s" : ""} encontrado
          {productos.length !== 1 ? "s" : ""}
          {params.q ? ` para "${params.q}"` : ""}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Suspense fallback={null}>
            <ProductFilters />
          </Suspense>
        </aside>

        <div>
          {productos.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border py-20 text-center">
              <p className="text-base font-medium text-ink">
                No encontramos productos con esos filtros.
              </p>
              <p className="text-sm text-muted-foreground">
                Probá ajustar la búsqueda o limpiar los filtros.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {productos.map((producto) => (
                <ProductCard key={producto.id} producto={producto} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
