import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PRODUCTOS, getProductoBySlug } from "@/data/productos";
import { getCategoriaById } from "@/data/categorias";
import { formatPrice, calcularDescuento } from "@/lib/format";
import { whatsappConsultaProducto } from "@/lib/whatsapp";
import { OfferCountdown } from "@/components/product/offer-countdown";
import { ProductSection } from "@/components/home/product-section";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { Button } from "@/components/ui/button";
import { ProductJsonLd } from "@/components/seo/product-jsonld";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return PRODUCTOS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const producto = getProductoBySlug(slug);
  if (!producto) return {};

  return {
    title: producto.nombre,
    description: producto.descripcion,
    openGraph: {
      title: producto.nombre,
      description: producto.descripcion,
      images: [{ url: producto.imagen }],
    },
  };
}

export default async function ProductoPage({ params }: { params: Params }) {
  const { slug } = await params;
  const producto = getProductoBySlug(slug);
  if (!producto) notFound();

  const categoria = getCategoriaById(producto.categoriaId);
  const tieneOferta = !!producto.precioPromo && producto.precioPromo < producto.precio;
  const descuento = tieneOferta
    ? calcularDescuento(producto.precio, producto.precioPromo!)
    : 0;

  const relacionados = PRODUCTOS.filter(
    (p) => p.categoriaId === producto.categoriaId && p.id !== producto.id
  ).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <ProductJsonLd producto={producto} />
      <nav className="mb-6 flex items-center gap-1 text-xs text-muted-foreground">
        <Link href="/productos" className="hover:text-brand">
          Catálogo
        </Link>
        {categoria && (
          <>
            <ChevronRightIcon className="size-3" />
            <Link href={`/productos?cat=${categoria.slug}`} className="hover:text-brand">
              {categoria.nombre}
            </Link>
          </>
        )}
        <ChevronRightIcon className="size-3" />
        <span className="line-clamp-1 text-ink">{producto.nombre}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-xl border border-border bg-white lg:sticky lg:top-24 lg:self-start">
          {tieneOferta && (
            <span className="absolute left-3 top-3 z-10 rounded-md bg-brand px-3 py-1.5 text-base font-extrabold leading-none text-white shadow-sm">
              -{descuento}%
            </span>
          )}
          {producto.nuevo && !tieneOferta && (
            <span className="absolute left-3 top-3 z-10 rounded-md bg-ink px-2.5 py-1 text-sm font-bold text-white shadow-sm">
              NUEVO
            </span>
          )}
          <Image
            src={producto.imagen}
            alt={producto.nombre}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain p-10"
            priority
          />
        </div>

        <div className="flex flex-col gap-4">
          {producto.marca && (
            <span className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              {producto.marca}
            </span>
          )}
          <h1 className="font-heading text-2xl font-bold text-ink sm:text-3xl">
            {producto.nombre}
          </h1>

          <div className="flex flex-col gap-1 border-y border-border py-4">
            {tieneOferta ? (
              <>
                <span className="text-base text-muted-foreground line-through">
                  {formatPrice(producto.precio)}
                </span>
                <span className="text-4xl font-extrabold text-brand">
                  {formatPrice(producto.precioPromo!)}
                </span>
                {producto.ofertaHasta && (
                  <OfferCountdown ofertaHasta={producto.ofertaHasta} className="mt-2 w-fit" />
                )}
              </>
            ) : (
              <span className="text-4xl font-extrabold text-ink">
                {formatPrice(producto.precio)}
              </span>
            )}
          </div>

          <p className="text-base leading-relaxed text-ink/80">
            {producto.descripcionLarga ?? producto.descripcion}
          </p>

          {typeof producto.stock === "number" && (
            <p className="text-sm text-success">
              {producto.stock > 0 ? "✓ Stock disponible" : "Sin stock por el momento"}
            </p>
          )}

          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <AddToCartButton producto={producto} />
            <Button
              render={
                <a
                  href={whatsappConsultaProducto(
                    producto.nombre,
                    `https://alportjfpuan.com.ar/producto/${producto.slug}`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
              nativeButton={false}
              size="lg"
              variant="outline"
              className="h-12 flex-1 border-success text-success hover:bg-success/10"
            >
              Consultar por WhatsApp
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <ProductSection titulo="También te puede interesar" productos={relacionados} />
      </div>
    </div>
  );
}
