import { ProductoForm } from "@/components/admin/producto-form";
import { saveProduct } from "../actions";
import { createClient } from "@/lib/supabase/server";
import { CATEGORIAS_SEED } from "@/data/categorias.seed";
import { PRODUCTOS_SEED } from "@/data/productos.seed";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Editar Producto - Administrar",
};

type Params = Promise<{ id: string }>;

export default async function EditarProductoPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  let categorias: { id: string; nombre: string }[] = [];
  let producto = null;

  if (!isSupabaseConfigured()) {
    categorias = CATEGORIAS_SEED;
    const seedProd = PRODUCTOS_SEED.find((p) => p.id === id);
    if (seedProd) {
      producto = {
        ...seedProd,
        imagenes: seedProd.imagen ? [{ url: seedProd.imagen }] : [],
      };
    }
  } else {
    const supabase = await createClient();

    // Fetch categories
    const { data: catData } = await supabase.from("categorias").select("id, nombre").eq("activo", true);
    if (catData) categorias = catData;

    // Fetch product
    const { data: prodData } = await supabase
      .from("productos")
      .select("*, producto_imagenes(storage_path, orden)")
      .eq("id", id)
      .single();

    if (prodData) {
      const imgs: { storage_path: string; orden: number }[] = prodData.producto_imagenes || [];
      const imagenesFormateadas = imgs
        .sort((a, b) => a.orden - b.orden)
        .map((img) => ({ url: img.storage_path }));
        
      producto = {
        ...prodData,
        categoriaId: prodData.categoria_id,
        descripcionLarga: prodData.descripcion_larga,
        precioPromo: prodData.precio_promo,
        ofertaHasta: prodData.oferta_hasta,
        imagenes: imagenesFormateadas,
      };
    }
  }

  if (!producto) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-ink">Editar Producto</h1>
        <p className="text-sm text-muted-foreground">
          Modifica los detalles del producto.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
        <ProductoForm 
          categorias={categorias}
          initialData={producto}
          action={async (formData) => {
            "use server";
            return saveProduct(formData, id);
          }} 
        />
      </div>
    </div>
  );
}
