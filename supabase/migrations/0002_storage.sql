-- Reemplazo de Firebase Storage: bucket de Supabase Storage para fotos y
-- audios de las cápsulas. Mismo proyecto, mismas credenciales
-- (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY) que ya usa
-- Auth y Postgres — no se necesita un proveedor de storage aparte.
--
-- Convención de rutas: capsule-media/{family_id}/{capsule_id}/{filename}
-- El primer segmento (family_id) es lo que las políticas usan para
-- restringir el acceso a la familia dueña del archivo.

insert into storage.buckets (id, name, public)
values ('capsule-media', 'capsule-media', true)
on conflict (id) do nothing;

create policy "capsule-media: la familia puede leer sus archivos"
  on storage.objects for select
  using (
    bucket_id = 'capsule-media'
    and (storage.foldername(name))[1]::uuid in (
      select family_id from profiles where id = auth.uid()
    )
  );

create policy "capsule-media: la familia puede subir a su carpeta"
  on storage.objects for insert
  with check (
    bucket_id = 'capsule-media'
    and (storage.foldername(name))[1]::uuid in (
      select family_id from profiles where id = auth.uid()
    )
  );

create policy "capsule-media: el autor puede borrar lo que subió"
  on storage.objects for delete
  using (
    bucket_id = 'capsule-media'
    and owner = auth.uid()
  );
