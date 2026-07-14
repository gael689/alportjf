import Link from "next/link";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
  // Dashboard con datos de stock/ofertas: siempre a tiempo de request, nunca cacheado.
  await connection();

  const supabase = await createClient();

  const [{ data: productos }, { data: categorias }, { data: banners }] = await Promise.all([
    supabase.from("productos").select("id, precio, precio_promo, oferta_hasta, activo"),
    supabase.from("categorias").select("id, activo"),
    supabase.from("banners").select("id, activo"),
  ]);

  const activos = (productos ?? []).filter((p) => p.activo);
  const sinPrecio = activos.filter((p) => p.precio === null);
  const ahora = new Date().getTime();
  const ofertasActivas = activos.filter(
    (p) =>
      p.precio_promo !== null &&
      (!p.oferta_hasta || new Date(p.oferta_hasta).getTime() > ahora)
  );
  const ofertasPorVencer = ofertasActivas.filter(
    (p) => p.oferta_hasta && new Date(p.oferta_hasta).getTime() - ahora < 24 * 60 * 60 * 1000
  );

  const stats = [
    { label: "Productos activos", valor: activos.length },
    { label: "Sin precio (a consultar)", valor: sinPrecio.length },
    { label: "Ofertas activas", valor: ofertasActivas.length },
    { label: "Ofertas por vencer hoy", valor: ofertasPorVencer.length },
    { label: "Categorías activas", valor: (categorias ?? []).filter((c) => c.activo).length },
    { label: "Banners activos", valor: (banners ?? []).filter((b) => b.activo).length },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-ink">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Resumen general del catálogo y las promociones.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-white p-4">
            <p className="text-2xl font-extrabold text-brand">{s.valor}</p>
            <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/admin/productos/nuevo"
          className="rounded-xl border border-dashed border-brand/40 bg-brand-tint p-5 text-center font-medium text-brand hover:bg-brand-tint/70"
        >
          + Cargar nuevo producto
        </Link>
        <Link
          href="/admin/promociones"
          className="rounded-xl border border-dashed border-brand/40 bg-brand-tint p-5 text-center font-medium text-brand hover:bg-brand-tint/70"
        >
          Gestionar promociones del carrousel
        </Link>
      </div>
    </div>
  );
}
