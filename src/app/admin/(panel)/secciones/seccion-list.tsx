"use client";

import { useState } from "react";
import Link from "next/link";
import { toggleSeccionStatus, deleteSeccion, reorderSecciones } from "./actions";
import { TrashIcon, PencilIcon, ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";

export type SeccionListItem = {
  id: string;
  nombre: string;
  subtitulo?: string;
  activo: boolean;
  orden: number;
};

export function SeccionList({ initialSecciones }: { initialSecciones: SeccionListItem[] }) {
  const [secciones, setSecciones] = useState(initialSecciones);
  const [isReordering, setIsReordering] = useState(false);

  const handleToggle = async (id: string, currentValue: boolean) => {
    setSecciones((prev) => prev.map((s) => (s.id === id ? { ...s, activo: !currentValue } : s)));
    const result = await toggleSeccionStatus(id, !currentValue);
    if (!result.success) {
      setSecciones((prev) => prev.map((s) => (s.id === id ? { ...s, activo: currentValue } : s)));
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Eliminar esta sección? Los productos no se borran, solo dejan de mostrarse ahí.")) {
      const result = await deleteSeccion(id);
      if (result.success) {
        setSecciones((prev) => prev.filter((s) => s.id !== id));
      } else {
        alert("No se pudo eliminar. " + (result.error || ""));
      }
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === secciones.length - 1) return;

    setIsReordering(true);
    const next = [...secciones];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
    setSecciones(next);

    await reorderSecciones(next.map((s) => s.id));
    setIsReordering(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Link
          href="/admin/secciones/nuevo"
          className="inline-flex h-9 items-center justify-center rounded-md bg-brand px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          Nueva Sección
        </Link>
      </div>

      <div className="rounded-md border bg-card text-card-foreground shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
              <tr>
                <th className="px-4 py-3 font-medium w-16">Orden</th>
                <th className="px-4 py-3 font-medium">Sección</th>
                <th className="px-4 py-3 font-medium text-center">Activa</th>
                <th className="px-4 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {secciones.map((s, index) => (
                <tr key={s.id} className="hover:bg-muted/50">
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1 items-center justify-center w-6">
                      <button
                        onClick={() => handleMove(index, "up")}
                        disabled={index === 0 || isReordering}
                        className="text-muted-foreground hover:text-ink disabled:opacity-30"
                      >
                        <ArrowUpIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleMove(index, "down")}
                        disabled={index === secciones.length - 1 || isReordering}
                        className="text-muted-foreground hover:text-ink disabled:opacity-30"
                      >
                        <ArrowDownIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{s.nombre}</p>
                    {s.subtitulo && <p className="text-xs text-muted-foreground">{s.subtitulo}</p>}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={s.activo}
                      onChange={() => handleToggle(s.id, s.activo)}
                      className="cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/secciones/${s.id}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border bg-transparent hover:bg-muted"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {secciones.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                    Todavía no creaste ninguna sección.
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
