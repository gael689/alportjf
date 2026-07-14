"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Bars3Icon,
  HomeIcon,
  CubeIcon,
  TagIcon,
  Squares2X2Icon,
  MegaphoneIcon,
  ArrowTrendingUpIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SITE } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { logout } from "@/app/admin/login/actions";

const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard", icono: HomeIcon },
  { href: "/admin/productos", label: "Productos", icono: CubeIcon },
  { href: "/admin/categorias", label: "Categorías", icono: TagIcon },
  { href: "/admin/secciones", label: "Secciones home", icono: Squares2X2Icon },
  { href: "/admin/promociones", label: "Promociones", icono: MegaphoneIcon },
  { href: "/admin/ofertas", label: "Ofertas", icono: ArrowTrendingUpIcon },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {ADMIN_NAV.map((item) => {
        const activo =
          item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
              activo ? "bg-brand text-white" : "text-ink/80 hover:bg-brand-tint hover:text-brand"
            )}
          >
            <item.icono className="size-5 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function LogoutButton({ className }: { className?: string }) {
  return (
    <form action={logout}>
      <button
        type="submit"
        className={cn(
          "flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium text-ink/70 hover:bg-brand-tint hover:text-brand",
          className
        )}
      >
        <ArrowRightStartOnRectangleIcon className="size-5 shrink-0" />
        Cerrar sesión
      </button>
    </form>
  );
}

export function AdminShell({
  children,
  userEmail,
}: {
  children: React.ReactNode;
  userEmail?: string;
}) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Sidebar desktop */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-white p-4 lg:flex">
        <Link href="/admin" className="mb-6 flex items-center gap-2 px-2">
          <Image
            src="/images/alport-logo-light.png"
            alt={SITE.nombre}
            width={140}
            height={50}
            className="h-9 w-auto"
          />
        </Link>
        <div className="flex-1">
          <NavLinks />
        </div>
        <div className="border-t border-border pt-3">
          {userEmail && <p className="truncate px-3 pb-2 text-xs text-muted-foreground">{userEmail}</p>}
          <LogoutButton />
        </div>
      </aside>

      {/* Topbar mobile */}
      <header className="flex items-center justify-between border-b border-border bg-white px-4 py-3 lg:hidden">
        <Link href="/admin" className="flex items-center gap-2">
          <Image
            src="/images/alport-logo-light.png"
            alt={SITE.nombre}
            width={120}
            height={43}
            className="h-8 w-auto"
          />
          <span className="font-heading text-sm font-semibold text-ink">Panel</span>
        </Link>
        <Sheet>
          <SheetTrigger
            aria-label="Abrir menú del panel"
            className="flex size-10 items-center justify-center rounded-full text-ink hover:bg-brand-tint"
          >
            <Bars3Icon className="size-6" />
          </SheetTrigger>
          <SheetContent side="left" className="flex w-72 flex-col">
            <SheetHeader className="border-b border-border">
              <SheetTitle>Panel Alport JF</SheetTitle>
            </SheetHeader>
            <div className="flex-1 px-3 py-2">
              <NavLinks />
            </div>
            <div className="border-t border-border p-3">
              {userEmail && <p className="truncate px-3 pb-2 text-xs text-muted-foreground">{userEmail}</p>}
              <LogoutButton />
            </div>
          </SheetContent>
        </Sheet>
      </header>

      <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}
