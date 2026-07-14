import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductoBySlug, getRecomendados } from "@/data/productos";
import { PRODUCTOS_SEED } from "@/data/productos.seed";
import { getCategoriaById } from "@/data/categorias";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { formatPrice, calcularDescuento } from "@/lib/format";
import { whatsappConsultaProducto } from "@/lib/whatsapp";
import { OfferCountdown } from "@/components/product/offer-countdown";
import { PromoPrice } from "@/components/product/promo-price";
import { ProductSection } from "@/components/home/product-section";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { Button } from "@/components/ui/button";
import { ProductJsonLd } from "@/components/seo/product-jsonld";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";
import { SITE } from "@/lib/site-config";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  // Con Supabase configurado el catálogo cambia sin rebuild: no pre-generamos nada
  // y cada producto se renderiza on-demand (dynamicParams por defecto de Next.js).
  if (isSupabaseConfigured()) return [];
  return PRODUCTOS_SEED.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const producto = await getProductoBySlug(slug);
  if (!producto) return {};

  return {
    title: producto.nombre,
    description: producto.descripcion,
    alternates: {
      canonical: `/producto/${producto.slug}`,
    },
    openGraph: {
      title: producto.nombre,
      description: producto.descripcion,
      images: [{ url: producto.imagen, width: 800, height: 800, alt: producto.nombre }],
    },
  };
}

export default async function ProductoPage({ params }: { params: Params }) {
  const { slug } = await params;
  const producto = await getProductoBySlug(slug);
  if (!producto) notFound();

  const [categoria, relacionados] = await Promise.all([
    getCategoriaById(producto.categoriaId),
    getRecomendados(producto),
  ]);
  const tienePrecio = producto.precio !== null;
  const tieneOferta =
    tienePrecio && !!producto.precioPromo && producto.precioPromo < producto.precio!;
  const descuento = tieneOferta
    ? calcularDescuento(producto.precio!, producto.precioPromo!)
    : 0;

  const base = `https://${SITE.dominio}`;
  const breadcrumbItems = [
    { name: "Inicio", url: `${base}/` },
    { name: "Catálogo", url: `${base}/productos` },
    ...(categoria
      ? [{ name: categoria.nombre, url: `${base}/productos?cat=${categoria.slug}` }]
      : []),
    { name: producto.nombre, url: `${base}/producto/${producto.slug}` },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <ProductJsonLd producto={producto} />
      <BreadcrumbJsonLd items={breadcrumbItems} />
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
                <PromoPrice precio={producto.precio!} precioPromo={producto.precioPromo!} size="lg" />
                {producto.ofertaHasta && (
                  <OfferCountdown ofertaHasta={producto.ofertaHasta} className="mt-2 w-fit" />
                )}
              </>
            ) : tienePrecio ? (
              <span className="text-4xl font-extrabold text-ink">{formatPrice(producto.precio)}</span>
            ) : (
              <div className="rounded-lg bg-muted/60 px-4 py-3">
                <p className="font-semibold text-ink">Producto sin precio publicado</p>
                <p className="text-sm text-muted-foreground">
                  Si querés saber más, consultanos por WhatsApp o agregalo al carrito para coordinar el precio y la entrega.
                </p>
              </div>
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
              {tienePrecio ? "Consultar por WhatsApp" : "Consultar Precio"}
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <ProductSection titulo="También podría interesarte" productos={relacionados} />
      </div>
    </div>
  );
}
