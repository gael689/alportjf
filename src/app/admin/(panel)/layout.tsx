import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-3 px-4 text-center">
        <h1 className="font-heading text-xl font-bold text-ink">Falta configurar Supabase</h1>
        <p className="text-sm text-ink/70">
          Seguí los pasos de <code className="rounded bg-brand-tint px-1 py-0.5">supabase/README.md</code>{" "}
          y completá las variables de entorno para poder usar el panel.
        </p>
      </div>
    );
  }

  // Defensa en profundidad: proxy.ts ya protege /admin/*, esto cubre el caso de
  // acceder a un Server Component sin pasar por el proxy (ej. llamadas directas).
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  return <AdminShell userEmail={user.email}>{children}</AdminShell>;
}
