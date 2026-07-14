# Setup de Supabase para Alport JF

1. Creá un proyecto en https://supabase.com (plan gratuito alcanza para empezar).
2. Andá a **SQL Editor** y ejecutá, en este orden, pegando el contenido completo de cada archivo:
   - `0001_schema.sql` — crea las tablas (categorías, productos, imágenes, banners).
   - `0002_rls_policies.sql` — reglas de seguridad: el sitio público solo ve lo activo, el panel (logueado) ve y edita todo.
   - `0003_storage.sql` — crea los buckets `productos` y `banners` para las fotos que se suben desde el panel.
   - `0004_seed.sql` — carga el catálogo de demo actual, para no arrancar con el panel vacío.
3. Andá a **Project Settings > Data API** y copiá:
   - `Project URL` → pegalo en `NEXT_PUBLIC_SUPABASE_URL` (ver `.env.local.example` en la raíz del repo).
   - `anon public key` → pegalo en `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Andá a **Authentication > Users** y creá un usuario (email + contraseña) para vos — con eso ya podés entrar a `/admin/login`. No hace falta configurar nada más de Auth: no hay auto-registro, los usuarios del panel se crean siempre a mano desde acá.
5. Reiniciá `npm run dev` (o volvé a desplegar) — apenas detecta las variables de entorno, el sitio deja de usar los datos de ejemplo (`src/data/*.seed.ts`) y pasa a leer/escribir directamente de Supabase.

No hace falta la `service_role key` en ningún lado: todo el acceso (sitio público y panel) pasa por la `anon key` + las políticas de RLS de `0002_rls_policies.sql`.
