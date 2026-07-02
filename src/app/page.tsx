import { Hero } from "@/components/home/hero";
import { PromoCarousel } from "@/components/home/promo-carousel";
import { ProductSection } from "@/components/home/product-section";
import { CategoryGrid } from "@/components/home/category-grid";
import { TrustStrip } from "@/components/home/trust-strip";
import { BANNERS } from "@/data/banners";
import { getDestacados, getNuevos } from "@/data/productos";

export default function HomePage() {
  return (
    <>
      <Hero />
      <PromoCarousel banners={BANNERS} />
      <ProductSection
        titulo="Productos destacados"
        subtitulo="Lo que más se vende en Alport JF"
        productos={getDestacados()}
        verTodoHref="/productos"
      />
      <ProductSection
        titulo="Lo más nuevo"
        subtitulo="Recién llegado a la tienda"
        productos={getNuevos()}
        verTodoHref="/productos?sort=nuevo"
      />
      <CategoryGrid />
      <TrustStrip />
    </>
  );
}
