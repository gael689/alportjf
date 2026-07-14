"use client";

import { useState } from "react";
import Link from "next/link";
import { toggleCategoryStatus, deleteCategory, reorderCategories } from "./actions";
import { TrashIcon, PencilIcon, ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";
import * as OutlineIcons from "@heroicons/react/24/outline";

export type CategoryListItem = {
  id: string;
  nombre: string;
  icono: string;
  activo: boolean;
  destacada: boolean;
  orden: number;
};

type HeroIcon = React.ForwardRefExoticComponent<
  React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> & {
    title?: string;
    titleId?: string;
  } & React.RefAttributes<SVGSVGElement>
>;

const Icons = OutlineIcons as unknown as Record<string, HeroIcon>;

export function CategoryList({ initialCategories }: { initialCategories: CategoryListItem[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [isReordering, setIsReordering] = useState(false);

  const handleToggle = async (id: string, field: "activo" | "destacada", currentValue: boolean) => {
    // Optimistic UI update
    setCategories((prev) => 
      prev.map((c) => c.id === id ? { ...c, [field]: !currentValue } : c)
    );
    const result = await toggleCategoryStatus(id, field, !currentValue);
    if (!result.success) {
      // Revert if failed
      setCategories((prev) => 
        prev.map((c) => c.id === id ? { ...c, [field]: currentValue } : c)
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta categoría? Si tiene productos asociados, no se podrá eliminar.")) {
      const result = await deleteCategory(id);
      if (result.success) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
      } else {
        alert("No se pudo eliminar. " + (result.error || ""));
      }
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === categories.length - 1) return;

    setIsReordering(true);
    
    const newCats = [...categories];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    
    // Swap
    const temp = newCats[index];
    newCats[index] = newCats[swapIndex];
    newCats[swapIndex] = temp;
    
    setCategories(newCats);
    
    const orderedIds = newCats.map(c => c.id);
    await reorderCategories(orderedIds);
    
    setIsReordering(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Link
          href="/admin/categorias/nuevo"
          className="inline-flex h-9 items-center justify-center rounded-md bg-brand px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          Nueva Categoría
        </Link>
      </div>

      <div className="rounded-md border bg-card text-card-foreground shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
              <tr>
                <th className="px-4 py-3 font-medium w-16">Orden</th>
                <th className="px-4 py-3 font-medium">Categoría</th>
                <th className="px-4 py-3 font-medium text-center">Ícono</th>
                <th className="px-4 py-3 font-medium text-center">Activa</th>
                <th className="px-4 py-3 font-medium text-center">Destacada</th>
                <th className="px-4 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {categories.map((c, index) => {
                const IconComponent = Icons[c.icono] || OutlineIcons.HomeIcon;
                
                return (
                  <tr key={c.id} className="hover:bg-muted/50">
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
                          disabled={index === categories.length - 1 || isReordering}
                          className="text-muted-foreground hover:text-ink disabled:opacity-30"
                        >
                          <ArrowDownIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium">{c.nombre}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center">
                        <IconComponent className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={c.activo}
                        onChange={() => handleToggle(c.id, "activo", c.activo)}
                        className="cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={c.destacada}
                        onChange={() => handleToggle(c.id, "destacada", c.destacada)}
                        className="cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/categorias/${c.id}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border bg-transparent hover:bg-muted"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    No se encontraron categorías.
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
