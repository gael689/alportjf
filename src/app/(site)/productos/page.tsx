import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { getAllProductos } from "@/data/productos";
import { getAllCategorias, getCategoriaBySlug } from "@/data/categorias";
import { getProductosPorSeccionSlug, getSeccionesActivas } from "@/data/secciones";
import { filtrarYOrdenarProductos, type CatalogSort } from "@/lib/catalog-filters";
import { ProductFilters } from "@/components/catalog/product-filters";
import { ProductCard } from "@/components/product/product-card";

const PRODUCTOS_POR_PAGINA = 24;

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
  seccion?: string;
  page?: string;
}>;

/** Arma el href de una página del catálogo conservando el resto de los filtros activos. */
function hrefDePagina(params: Record<string, string | undefined>, pagina: number): string {
  const usp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (key === "page" || !value) continue;
    usp.set(key, value);
  }
  if (pagina > 1) usp.set("page", String(pagina));
  const qs = usp.toString();
  return qs ? `/productos?${qs}` : "/productos";
}

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

  // "seccion" viene del "Ver todo" de una vitrina de la home (ej. "Lo último"),
  // que puede ser cualquier sección creada desde el panel, no solo destacados/nuevo.
  const seccion = params.seccion ? await getSeccionesActivas().then((s) => s.find((x) => x.slug === params.seccion)) : undefined;
  const productosBase = seccion ? await getProductosPorSeccionSlug(seccion.slug) : productosDisponibles;

  const productos = filtrarYOrdenarProductos(productosBase, {
    categoriaId: seccion ? undefined : categoria?.id,
    q: params.q,
    min: params.min ? Number(params.min) : undefined,
    max: params.max ? Number(params.max) : undefined,
    sort: params.sort as CatalogSort | undefined,
    destacado: seccion ? false : esDestacados,
    nuevo: seccion ? false : esNuevos,
  });

  const titulo = seccion
    ? seccion.nombre
    : esDestacados
      ? "Productos destacados"
      : esNuevos
        ? "Lo más nuevo"
        : categoria
          ? categoria.nombre
          : "Catálogo completo";

  const totalPaginas = Math.max(1, Math.ceil(productos.length / PRODUCTOS_POR_PAGINA));
  const paginaActual = Math.min(totalPaginas, Math.max(1, Number(params.page) || 1));
  const productosPagina = productos.slice(
    (paginaActual - 1) * PRODUCTOS_POR_PAGINA,
    paginaActual * PRODUCTOS_POR_PAGINA
  );

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
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                {productosPagina.map((producto) => (
                  <ProductCard key={producto.id} producto={producto} />
                ))}
              </div>

              {totalPaginas > 1 && (
                <nav
                  aria-label="Paginación del catálogo"
                  className="mt-8 flex items-center justify-center gap-2"
                >
                  <Link
                    href={hrefDePagina(params, paginaActual - 1)}
                    aria-disabled={paginaActual === 1}
                    className={`flex size-9 items-center justify-center rounded-md border border-border ${
                      paginaActual === 1
                        ? "pointer-events-none opacity-40"
                        : "hover:border-brand hover:text-brand"
                    }`}
                  >
                    <ChevronLeftIcon className="size-4" />
                  </Link>
                  <span className="px-2 text-sm text-muted-foreground">
                    Página {paginaActual} de {totalPaginas}
                  </span>
                  <Link
                    href={hrefDePagina(params, paginaActual + 1)}
                    aria-disabled={paginaActual === totalPaginas}
                    className={`flex size-9 items-center justify-center rounded-md border border-border ${
                      paginaActual === totalPaginas
                        ? "pointer-events-none opacity-40"
                        : "hover:border-brand hover:text-brand"
                    }`}
                  >
                    <ChevronRightIcon className="size-4" />
                  </Link>
                </nav>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
