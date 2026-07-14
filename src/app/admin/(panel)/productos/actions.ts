"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

export async function toggleProductStatus(id: string, field: "activo" | "destacado" | "nuevo", value: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("productos")
    .update({ [field]: value })
    .eq("id", id);
    
  if (error) {
    console.error(`Error toggling ${field} for product ${id}:`, error);
    return { success: false, error: error.message };
  }
  
  revalidatePath("/admin/productos");
  revalidatePath("/");
  revalidatePath("/productos");
  
  return { success: true };
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();

  const { data: imagenes } = await supabase
    .from("producto_imagenes")
    .select("storage_path")
    .eq("producto_id", id);

  const { error } = await supabase
    .from("productos")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(`Error deleting product ${id}:`, error);
    return { success: false, error: error.message };
  }

  const paths = (imagenes ?? []).map((img) => img.storage_path).filter(esStoragePath);
  if (paths.length > 0) {
    await supabase.storage.from("productos").remove(paths);
  }

  revalidatePath("/admin/productos");
  revalidatePath("/");
  revalidatePath("/productos");

  return { success: true };
}

// Las imágenes del catálogo de ejemplo usan rutas locales (/images/...) o URLs completas,
// no paths reales de Supabase Storage: no hay que intentar borrarlas del bucket.
function esStoragePath(path: string): boolean {
  return !path.startsWith("http") && !path.startsWith("/");
}

/**
 * Aplica un cambio porcentual al precio normal de los productos seleccionados
 * (ej. porcentaje=10 sube 10%, porcentaje=-5 baja 5%). Los productos sin precio
 * ("a consultar") se omiten porque no hay nada sobre qué calcular el porcentaje.
 * Nunca borra productos: el borrado masivo queda deliberadamente fuera de esta acción.
 */
export async function bulkUpdatePriceByPercentage(ids: string[], porcentaje: number) {
  if (ids.length === 0) return { success: false, error: "No hay productos seleccionados." };

  const supabase = await createClient();

  const { data: productos, error: fetchError } = await supabase
    .from("productos")
    .select("id, precio")
    .in("id", ids);

  if (fetchError) return { success: false, error: fetchError.message };

  const factor = 1 + porcentaje / 100;
  const conPrecio = (productos ?? []).filter(
    (p): p is { id: string; precio: number } => p.precio !== null
  );

  let actualizados = 0;
  let conError = 0;
  for (const p of conPrecio) {
    const nuevoPrecio = Math.max(0, Math.round(Number(p.precio) * factor));
    const { error } = await supabase
      .from("productos")
      .update({ precio: nuevoPrecio })
      .eq("id", p.id);
    if (error) conError++;
    else actualizados++;
  }

  revalidatePath("/admin/productos");
  revalidatePath("/");
  revalidatePath("/productos");

  return {
    success: true,
    actualizados,
    sinPrecio: ids.length - conPrecio.length,
    conError,
  };
}

function generateSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function slugDisponible(
  supabase: SupabaseServerClient,
  slug: string,
  idAExcluir?: string
): Promise<boolean> {
  let query = supabase.from("productos").select("id").eq("slug", slug);
  if (idAExcluir) query = query.neq("id", idAExcluir);
  const { data } = await query.limit(1);
  return !data || data.length === 0;
}

/**
 * El slug tiene que ser único en toda la tabla. Si el nombre ya está en uso por otro
 * producto, se antepone la categoría (ej. "hogar-pava-electrica") y si aun así choca,
 * se agrega un número al final — así el alta nunca falla por un nombre repetido.
 */
async function generarSlugUnicoProducto(
  supabase: SupabaseServerClient,
  nombre: string,
  categoriaId: string,
  idAExcluir?: string
): Promise<string> {
  const base = generateSlug(nombre);
  if (await slugDisponible(supabase, base, idAExcluir)) return base;

  const { data: categoria } = await supabase
    .from("categorias")
    .select("slug")
    .eq("id", categoriaId)
    .single();

  const conCategoria = categoria?.slug ? `${categoria.slug}-${base}` : base;
  if (conCategoria !== base && (await slugDisponible(supabase, conCategoria, idAExcluir))) {
    return conCategoria;
  }

  let intento = 2;
  let candidato = `${conCategoria}-${intento}`;
  while (!(await slugDisponible(supabase, candidato, idAExcluir))) {
    intento++;
    candidato = `${conCategoria}-${intento}`;
  }
  return candidato;
}

export async function saveProduct(formData: FormData, id?: string) {
  const supabase = await createClient();
  
  const nombre = formData.get("nombre") as string;
  const marca = (formData.get("marca") as string) || null;
  const categoria_id = formData.get("categoriaId") as string;
  const descripcion = formData.get("descripcion") as string;
  const descripcion_larga = (formData.get("descripcionLarga") as string) || null;
  const sinPrecio = formData.get("sinPrecio") === "on";
  
  const precioRaw = formData.get("precio") as string;
  const precio = sinPrecio || !precioRaw ? null : parseFloat(precioRaw);
  
  const precioPromoRaw = formData.get("precioPromo") as string;
  const precio_promo = sinPrecio || !precioPromoRaw ? null : parseFloat(precioPromoRaw);
  
  const ofertaHastaRaw = formData.get("ofertaHasta") as string;
  const oferta_hasta = ofertaHastaRaw ? new Date(ofertaHastaRaw).toISOString() : null;
  
  const stockRaw = formData.get("stock") as string;
  const stock = stockRaw ? parseInt(stockRaw, 10) : null;
  
  const destacado = formData.get("destacado") === "on";
  const nuevo = formData.get("nuevo") === "on";
  
  const imagenesJson = formData.get("imagenes") as string;
  let imagenes: string[] = [];
  try {
    if (imagenesJson) imagenes = JSON.parse(imagenesJson);
  } catch {
    // JSON inválido: se guarda el producto sin imágenes en vez de romper el submit.
  }

  const slug = await generarSlugUnicoProducto(supabase, nombre, categoria_id, id);

  const productData = {
    nombre,
    slug,
    marca,
    categoria_id,
    descripcion,
    descripcion_larga,
    precio,
    precio_promo,
    oferta_hasta,
    stock,
    destacado,
    nuevo,
    activo: true,
  };

  let productId = id;

  if (id) {
    const { error: updateError } = await supabase
      .from("productos")
      .update(productData)
      .eq("id", id);
      
    if (updateError) return { success: false, error: updateError.message };
  } else {
    const { data: newData, error: insertError } = await supabase
      .from("productos")
      .insert([productData])
      .select("id")
      .single();
      
    if (insertError) return { success: false, error: insertError.message };
    productId = newData.id;
  }

  if (productId) {
    // Imágenes que se sacaron del uploader (o se reemplazaron): se borran del bucket
    // para no ir acumulando archivos huérfanos en Supabase Storage.
    const { data: imagenesPrevias } = await supabase
      .from("producto_imagenes")
      .select("storage_path")
      .eq("producto_id", productId);

    const pathsNuevos = new Set(imagenes);
    const pathsABorrar = (imagenesPrevias ?? [])
      .map((img) => img.storage_path)
      .filter((path) => esStoragePath(path) && !pathsNuevos.has(path));

    if (pathsABorrar.length > 0) {
      await supabase.storage.from("productos").remove(pathsABorrar);
    }

    // Delete existing images
    await supabase.from("producto_imagenes").delete().eq("producto_id", productId);

    // Insert new images
    if (imagenes.length > 0) {
      const imageRecords = imagenes.map((img, index) => ({
        producto_id: productId,
        storage_path: img,
        orden: index,
      }));
      
      const { error: imagesError } = await supabase
        .from("producto_imagenes")
        .insert(imageRecords);
        
      if (imagesError) {
        console.error("Error saving images:", imagesError);
        // We still succeed the product creation/update, but log the error
      }
    }
  }

  revalidatePath("/admin/productos");
  revalidatePath("/");
  revalidatePath("/productos");
  
  return { success: true };
}
