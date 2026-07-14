import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { updateSession } from "@/lib/supabase/session";

// En Next.js 16 el archivo "middleware" se renombró a "proxy" (mismo comportamiento).
export async function proxy(request: NextRequest) {
  // Sin Supabase configurado no hay sesiones que proteger: se deja pasar
  // (el propio /admin muestra un aviso de "falta configurar Supabase").
  if (!isSupabaseConfigured()) return NextResponse.next();

  const { pathname } = request.nextUrl;
  const { response, user } = await updateSession(request);

  const esLogin = pathname === "/admin/login";

  if (!esLogin && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  if (esLogin && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
