import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente de Supabase para lecturas públicas (home, catálogo, ficha de producto).
 * A diferencia de lib/supabase/server.ts, no depende de cookies(): eso es lo que
 * permite que estas páginas se cacheen (unstable_cache + ISR) en vez de quedar
 * forzadas a "dynamic" y golpear la base en cada request.
 */
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}
