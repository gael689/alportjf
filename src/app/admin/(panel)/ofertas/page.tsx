import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { PRODUCTOS_SEED } from "@/data/productos.seed";
import { OfferCountdown } from "@/components/product/offer-countdown";
import { formatPrice } from "@/lib/format";
import Link from "next/link";
import { PencilIcon } from "@heroicons/react/24/outline";

export const metadata = {
  title: "Análisis de Ofertas - Administrar",
};

type OfertaRow = {
  id: string;
  nombre: string;
  precio: number | null;
  precio_promo: number | null;
  oferta_hasta: string | null;
  activo: boolean;
};

export default async function AdminOfertasPage() {
  // Vencimientos de ofertas: siempre a tiempo de request, nunca cacheado.
  await connection();

  let ofertas: OfertaRow[] = [];

  if (!isSupabaseConfigured()) {
    ofertas = PRODUCTOS_SEED.filter((p) => p.precioPromo != null)
      .map((p) => ({
        id: p.id,
        nombre: p.nombre,
        precio: p.precio,
        precio_promo: p.precioPromo ?? null,
        oferta_hasta: p.ofertaHasta ?? null,
        activo: true,
      }));
  } else {
    const supabase = await createClient();
    const { data } = await supabase
      .from("productos")
      .select("id, nombre, precio, precio_promo, oferta_hasta, activo")
      .not("precio_promo", "is", null);

    if (data) {
      ofertas = data;
    }
  }

  // Sort by expiration date (closest first)
  const ahora = new Date().getTime();
  
  const ofertasActivas = ofertas.filter(
    (o) => o.oferta_hasta && new Date(o.oferta_hasta).getTime() > ahora
  ).sort((a, b) => new Date(a.oferta_hasta!).getTime() - new Date(b.oferta_hasta!).getTime());
  
  const ofertasVencidas = ofertas.filter(
    (o) => !o.oferta_hasta || new Date(o.oferta_hasta).getTime() <= ahora
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-ink">Análisis de Ofertas</h1>
        <p className="text-sm text-muted-foreground">
          Seguimiento de los productos con precios promocionales y su vencimiento.
        </p>
      </div>

      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-ink">Ofertas Activas</h2>
        {ofertasActivas.length === 0 ? (
          <div className="rounded-xl border border-dashed p-12 text-center bg-card">
            <p className="text-muted-foreground">No hay ofertas activas en este momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ofertasActivas.map((oferta) => {
              const descuento = Math.round(
                (1 - (Number(oferta.precio_promo) / Number(oferta.precio))) * 100
              );

              return (
                <div key={oferta.id} className="flex flex-col rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-medium leading-tight line-clamp-2 max-w-[85%]">{oferta.nombre}</h3>
                    <Link
                      href={`/admin/productos/${oferta.id}`}
                      className="text-muted-foreground hover:text-ink"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Link>
                  </div>
                  
                  <div className="mt-auto space-y-4">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground line-through">
                          {oferta.precio ? formatPrice(oferta.precio) : "Sin precio"}
                        </p>
                        <p className="text-2xl font-extrabold text-success">
                          {formatPrice(oferta.precio_promo)}
                        </p>
                      </div>
                      {descuento > 0 && (
                        <span className="rounded-md bg-offer px-2.5 py-1 text-sm font-bold text-offer-ink">
                          -{descuento}%
                        </span>
                      )}
                    </div>
                    
                    <div className="pt-2 border-t">
                      <p className="text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">
                        Vence en:
                      </p>
                      <OfferCountdown ofertaHasta={oferta.oferta_hasta!} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {ofertasVencidas.length > 0 && (
          <div className="pt-8">
            <h2 className="text-lg font-semibold text-ink mb-4">Ofertas Vencidas o Sin Fecha</h2>
            <div className="rounded-md border bg-card overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 border-b text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Producto</th>
                    <th className="px-4 py-3 font-medium">Precio</th>
                    <th className="px-4 py-3 font-medium">Promo (vencida)</th>
                    <th className="px-4 py-3 font-medium text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {ofertasVencidas.map((oferta) => (
                    <tr key={oferta.id} className="hover:bg-muted/50">
                      <td className="px-4 py-3 font-medium">{oferta.nombre}</td>
                      <td className="px-4 py-3 text-muted-foreground">{oferta.precio ? formatPrice(oferta.precio) : "-"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{formatPrice(oferta.precio_promo)}</td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/productos/${oferta.id}`}
                          className="text-brand hover:underline text-xs font-medium"
                        >
                          Actualizar
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
