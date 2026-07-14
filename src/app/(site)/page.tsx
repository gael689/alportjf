import { Hero } from "@/components/home/hero";
import { PromoCarousel } from "@/components/home/promo-carousel";
import { ProductSection } from "@/components/home/product-section";
import { CategoryGrid } from "@/components/home/category-grid";
import { TrustStrip } from "@/components/home/trust-strip";
import { getAllBanners } from "@/data/banners";
import { getDestacados, getNuevos } from "@/data/productos";

export default async function HomePage() {
  const [banners, destacados, nuevos] = await Promise.all([
    getAllBanners(),
    getDestacados(),
    getNuevos(),
  ]);

  return (
    <>
      <Hero />
      <PromoCarousel banners={banners} />
      <ProductSection
        titulo="Productos destacados"
        subtitulo="Lo que más se vende en Alport JF"
        productos={destacados}
        verTodoHref="/productos?destacado=1"
      />
      <ProductSection
        titulo="Lo más nuevo"
        subtitulo="Recién llegado a la tienda"
        productos={nuevos}
        verTodoHref="/productos?nuevo=1"
      />
      <CategoryGrid />
      <TrustStrip />
    </>
  );
}
