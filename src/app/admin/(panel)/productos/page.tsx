import { createClient } from "@/lib/supabase/server";
import { ProductList, type ProductListItem } from "./product-list";
import { PRODUCTOS_SEED } from "@/data/productos.seed";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata = {
  title: "Administrar Productos - Alport JF",
};

export default async function AdminProductosPage() {
  let products: ProductListItem[] = [];

  if (!isSupabaseConfigured()) {
    products = PRODUCTOS_SEED.map((p) => ({
      id: p.id,
      nombre: p.nombre,
      precio: p.precio,
      activo: true,
      destacado: p.destacado,
      nuevo: p.nuevo,
      categoria: p.categoriaId,
      imagen: p.imagen,
    }));
  } else {
    const supabase = await createClient();
    const { data } = await supabase
      .from("productos")
      .select("*, categorias(nombre, slug), producto_imagenes(storage_path, orden)")
      .order("created_at", { ascending: false });

    if (data) {
      products = data.map((row) => {
        let imagen = "/images/products/bazar-hogar.svg";
        const imgs: { storage_path: string; orden: number }[] = row.producto_imagenes || [];
        const principal = [...imgs].sort((a, b) => a.orden - b.orden)[0];
        if (principal) {
          imagen = supabase.storage.from("productos").getPublicUrl(principal.storage_path).data.publicUrl;
        } else if (row.categorias?.slug) {
          imagen = `/images/products/${row.categorias.slug}.svg`;
        }
        
        return {
          id: row.id,
          nombre: row.nombre,
          precio: row.precio === null ? null : Number(row.precio),
          activo: row.activo,
          destacado: row.destacado,
          nuevo: row.nuevo,
          categoria: row.categorias?.nombre || "Sin categoría",
          imagen,
        };
      });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-ink">Productos</h1>
        <p className="text-sm text-muted-foreground">
          Gestiona el catálogo de productos de Alport JF.
        </p>
      </div>

      <ProductList products={products} />
    </div>
  );
}
