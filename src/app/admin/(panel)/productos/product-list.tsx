"use client";

import { useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { toggleProductStatus, deleteProduct, bulkUpdatePriceByPercentage } from "./actions";
import { TrashIcon, PencilIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from "@heroicons/react/24/outline";

export type ProductListItem = {
  id: string;
  nombre: string;
  precio: number | null;
  activo: boolean;
  destacado: boolean;
  nuevo: boolean;
  categoria: string;
  imagen: string;
};

export function ProductList({ products }: { products: ProductListItem[] }) {
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [seleccionados, setSeleccionados] = useState<Set<string>>(new Set());
  const [porcentaje, setPorcentaje] = useState("10");
  const [aplicando, setAplicando] = useState(false);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.nombre.toLowerCase().includes(search.toLowerCase());
    const matchesCat = filterCat ? p.categoria === filterCat : true;
    return matchesSearch && matchesCat;
  });

  const categories = Array.from(new Set(products.map((p) => p.categoria)));

  const todosFiltradosSeleccionados =
    filteredProducts.length > 0 && filteredProducts.every((p) => seleccionados.has(p.id));

  const handleToggle = async (id: string, field: "activo" | "destacado" | "nuevo", currentValue: boolean) => {
    await toggleProductStatus(id, field, !currentValue);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      await deleteProduct(id);
    }
  };

  const toggleSeleccionado = (id: string) => {
    setSeleccionados((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSeleccionarTodos = () => {
    setSeleccionados((prev) => {
      const next = new Set(prev);
      if (todosFiltradosSeleccionados) {
        filteredProducts.forEach((p) => next.delete(p.id));
      } else {
        filteredProducts.forEach((p) => next.add(p.id));
      }
      return next;
    });
  };

  const aplicarPorcentaje = async (signo: 1 | -1) => {
    const valor = Number(porcentaje);
    if (!valor || valor <= 0) {
      alert("Ingresá un porcentaje válido mayor a 0.");
      return;
    }

    setAplicando(true);
    const result = await bulkUpdatePriceByPercentage(Array.from(seleccionados), valor * signo);
    setAplicando(false);

    if (!result.success) {
      alert("No se pudo actualizar. " + (result.error || ""));
      return;
    }

    const avisos: string[] = [`Se actualizó el precio de ${result.actualizados} producto(s).`];
    if (result.sinPrecio) avisos.push(`${result.sinPrecio} sin precio no se modificaron.`);
    if (result.conError) avisos.push(`${result.conError} no se pudieron actualizar (revisá sus ofertas).`);
    if (result.sinPrecio || result.conError) alert(avisos.join(" "));

    setSeleccionados(new Set());
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-2">
          <input
            type="text"
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className="rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">Todas las categorías</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="inline-flex h-9 items-center justify-center rounded-md bg-brand px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          Nuevo Producto
        </Link>
      </div>

      {seleccionados.size > 0 && (
        <div className="flex flex-col gap-3 rounded-md border border-brand/30 bg-brand-tint p-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-brand">
            {seleccionados.size} producto{seleccionados.size === 1 ? "" : "s"} seleccionado
            {seleccionados.size === 1 ? "" : "s"}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-1.5 text-sm text-ink">
              Ajustar precio
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={porcentaje}
                onChange={(e) => setPorcentaje(e.target.value)}
                disabled={aplicando}
                className="w-20 rounded-md border border-input px-2 py-1 text-sm"
              />
              %
            </label>
            <button
              type="button"
              disabled={aplicando}
              onClick={() => aplicarPorcentaje(1)}
              className="inline-flex items-center gap-1.5 rounded-md bg-success px-3 py-1.5 text-sm font-medium text-white hover:bg-success/90 disabled:opacity-50"
            >
              <ArrowTrendingUpIcon className="h-4 w-4" /> Subir
            </button>
            <button
              type="button"
              disabled={aplicando}
              onClick={() => aplicarPorcentaje(-1)}
              className="inline-flex items-center gap-1.5 rounded-md bg-brand px-3 py-1.5 text-sm font-medium text-white hover:bg-brand/90 disabled:opacity-50"
            >
              <ArrowTrendingDownIcon className="h-4 w-4" /> Bajar
            </button>
            <button
              type="button"
              onClick={() => setSeleccionados(new Set())}
              className="text-sm text-muted-foreground hover:text-ink"
            >
              Cancelar selección
            </button>
          </div>
        </div>
      )}

      <div className="rounded-md border bg-card text-card-foreground shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
              <tr>
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={todosFiltradosSeleccionados}
                    onChange={toggleSeleccionarTodos}
                    className="cursor-pointer"
                    aria-label="Seleccionar todos los productos filtrados"
                  />
                </th>
                <th className="px-4 py-3 font-medium">Producto</th>
                <th className="px-4 py-3 font-medium">Categoría</th>
                <th className="px-4 py-3 font-medium">Precio</th>
                <th className="px-4 py-3 font-medium">Activo</th>
                <th className="px-4 py-3 font-medium">Destacado</th>
                <th className="px-4 py-3 font-medium">Nuevo</th>
                <th className="px-4 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredProducts.map((p) => (
                <tr key={p.id} className={`hover:bg-muted/50 ${seleccionados.has(p.id) ? "bg-brand-tint/40" : ""}`}>
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={seleccionados.has(p.id)}
                      onChange={() => toggleSeleccionado(p.id)}
                      className="cursor-pointer"
                      aria-label={`Seleccionar ${p.nombre}`}
                    />
                  </td>
                  <td className="px-4 py-3 font-medium">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md border bg-white">
                        <img src={p.imagen} alt={p.nombre} className="h-full w-full object-cover" />
                      </div>
                      <span className="max-w-[200px] truncate">{p.nombre}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{p.categoria}</td>
                  <td className="px-4 py-3">
                    {p.precio === null ? (
                      <span className="text-muted-foreground italic">Sin precio</span>
                    ) : (
                      formatPrice(p.precio)
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={p.activo}
                      onChange={() => handleToggle(p.id, "activo", p.activo)}
                      className="cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={p.destacado}
                      onChange={() => handleToggle(p.id, "destacado", p.destacado)}
                      className="cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={p.nuevo}
                      onChange={() => handleToggle(p.id, "nuevo", p.nuevo)}
                      className="cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/productos/${p.id}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border bg-transparent hover:bg-muted"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                    No se encontraron productos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
