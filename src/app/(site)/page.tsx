import { Hero } from "@/components/home/hero";
import { PromoCarousel } from "@/components/home/promo-carousel";
import { ProductSection } from "@/components/home/product-section";
import { CategoryGrid } from "@/components/home/category-grid";
import { TrustStrip } from "@/components/home/trust-strip";
import { getAllBanners } from "@/data/banners";
import { getDestacados, getNuevos } from "@/data/productos";
import { getHomeSections } from "@/data/secciones";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export default async function HomePage() {
  const [banners, secciones] = await Promise.all([getAllBanners(), getHomeSections()]);

  // Sin Supabase configurado se usa el catálogo de ejemplo con las dos vitrinas de
  // siempre, para que el prototipo nunca se vea vacío. Con Supabase, "destacados" y
  // "lo-mas-nuevo" nacen ya seedeadas por la migración: si no aparecen es porque el
  // panel las borró a propósito, así que no hay que rellenarlas con nada.
  const seccionesAMostrar = isSupabaseConfigured()
    ? secciones
    : await (async () => {
        const [destacados, nuevos] = await Promise.all([getDestacados(), getNuevos()]);
        return [
          { seccion: { id: "destacados", slug: "destacados", nombre: "Productos destacados", subtitulo: "Lo que más se vende en Alport JF", orden: 0, activo: true }, productos: destacados },
          { seccion: { id: "lo-mas-nuevo", slug: "lo-mas-nuevo", nombre: "Lo más nuevo", subtitulo: "Recién llegado a la tienda", orden: 1, activo: true }, productos: nuevos },
        ].filter((s) => s.productos.length > 0);
      })();

  return (
    <>
      <Hero />
      <PromoCarousel banners={banners} />
      {seccionesAMostrar.map(({ seccion, productos }) => (
        <ProductSection
          key={seccion.id}
          titulo={seccion.nombre}
          subtitulo={seccion.subtitulo}
          productos={productos}
          verTodoHref={`/productos?seccion=${seccion.slug}`}
        />
      ))}
      <CategoryGrid />
      <TrustStrip />
    </>
  );
}
