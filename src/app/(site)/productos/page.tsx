import { Suspense } from "react";
import type { Metadata } from "next";
import { getAllProductos } from "@/data/productos";
import { getAllCategorias, getCategoriaBySlug } from "@/data/categorias";
import { filtrarYOrdenarProductos, type CatalogSort } from "@/lib/catalog-filters";
import { ProductFilters } from "@/components/catalog/product-filters";
import { ProductCard } from "@/components/product/product-card";

export const metadata: Metadata = {
  title: "Catálogo completo",
  description:
    "Descubrí todo el catálogo de Alport JF: electrodomésticos, climatización, TV, pinturería, bazar, muebles, colchones y herramientas.",
  alternates: { canonical: "/productos" },
};

type SearchParams = Promise<{
  cat?: string;
  q?: string;
  min?: string;
  max?: string;
  sort?: string;
  destacado?: string;
  nuevo?: string;
}>;

export default async function ProductosPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const [productosDisponibles, categorias] = await Promise.all([
    getAllProductos(),
    getAllCategorias(),
  ]);
  const categoria = params.cat ? await getCategoriaBySlug(params.cat) : undefined;
  const esDestacados = params.destacado === "1";
  const esNuevos = params.nuevo === "1";

  const productos = filtrarYOrdenarProductos(productosDisponibles, {
    categoriaId: categoria?.id,
    q: params.q,
    min: params.min ? Number(params.min) : undefined,
    max: params.max ? Number(params.max) : undefined,
    sort: params.sort as CatalogSort | undefined,
    destacado: esDestacados,
    nuevo: esNuevos,
  });

  const titulo = esDestacados
    ? "Productos destacados"
    : esNuevos
      ? "Lo más nuevo"
      : categoria
        ? categoria.nombre
        : "Catálogo completo";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-bold text-ink">{titulo}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {productos.length} producto{productos.length !== 1 ? "s" : ""} encontrado
          {productos.length !== 1 ? "s" : ""}
          {params.q ? ` para "${params.q}"` : ""}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Suspense fallback={null}>
            <ProductFilters categorias={categorias} />
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
