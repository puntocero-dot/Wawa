import { createClient } from "@/lib/supabase/client";

const BUCKET = "capsule-media";

/**
 * Sustituto directo de Firebase Storage: mismo proyecto de Supabase que ya
 * usan Auth y Postgres, sin credenciales ni proveedor aparte. La ruta
 * empieza siempre por `familyId` porque las políticas RLS del bucket
 * (`supabase/migrations/0002_storage.sql`) restringen lectura/escritura a
 * esa carpeta.
 */
export async function uploadCapsuleMedia(params: {
  familyId: string;
  capsuleId: string;
  file: Blob;
  fileName: string;
}): Promise<string> {
  const { familyId, capsuleId, file, fileName } = params;
  const supabase = createClient();
  const path = `${familyId}/${capsuleId}/${fileName}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    upsert: true,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
