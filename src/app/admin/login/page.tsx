import Image from "next/image";
import { SITE } from "@/lib/site-config";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { LoginForm } from "@/app/admin/login/login-form";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <Image
            src="/images/alport-logo-light.png"
            alt={SITE.nombre}
            width={140}
            height={50}
            className="h-10 w-auto"
          />
          <h1 className="font-heading text-lg font-semibold text-ink">Panel de administración</h1>
        </div>

        {isSupabaseConfigured() ? (
          <LoginForm />
        ) : (
          <div className="rounded-lg bg-brand-tint p-4 text-sm text-ink/80">
            Todavía no configuraste Supabase. Seguí los pasos de{" "}
            <code className="rounded bg-white px-1 py-0.5">supabase/README.md</code> y completá
            las variables de entorno para poder entrar al panel.
          </div>
        )}
      </div>
    </div>
  );
}
