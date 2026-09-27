import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Capsule, CapsuleKind, UnlockCondition } from "@/lib/types";
import type { Database } from "@/lib/supabase/database.types";

/**
 * The only place in the app allowed to know that "capsules" live in
 * Supabase/Postgres. Every Server Component and Server Action reads/writes
 * capsules through here — never through `createClient()` directly — so the
 * storage backend can change later (a queue-backed write path, a different
 * database, a dedicated feed service) without touching a single page or
 * component.
 */

type CapsuleRow = Database["public"]["Tables"]["capsules"]["Row"];

function toUnlockCondition(row: CapsuleRow): UnlockCondition {
  switch (row.unlock_type) {
    case "date":
      return { type: "date", unlockAt: row.unlock_at! };
    case "age":
      return { type: "age", age: row.unlock_age! };
    case "milestone":
      return { type: "milestone", label: row.unlock_milestone! };
    default:
      return { type: "immediate" };
  }
}

function toCapsule(
  row: CapsuleRow,
  author: { displayName: string; avatarUrl: string | null },
): Capsule {
  const unlock = toUnlockCondition(row);
  return {
    id: row.id,
    authorId: row.author_id,
    authorName: author.displayName,
    authorAvatarUrl: author.avatarUrl,
    kind: row.kind,
    title: row.title,
    body: row.body,
    mediaUrl: row.media_url,
    audioUrl: row.audio_url,
    tags: row.tags ?? [],
    unlock,
    createdAt: row.created_at,
    isUnlocked: unlock.type === "immediate",
  };
}

export async function listCapsulesByKind(kind: CapsuleKind): Promise<Capsule[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("capsules")
    .select("*, profiles!capsules_author_id_fkey(display_name, avatar_url)")
    .eq("kind", kind)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row) => {
    const profile = (row as unknown as { profiles: { display_name: string; avatar_url: string | null } }).profiles;
    return toCapsule(row as CapsuleRow, {
      displayName: profile?.display_name ?? "Familia",
      avatarUrl: profile?.avatar_url ?? null,
    });
  });
}

export type NewCapsuleInput = {
  authorId: string;
  kind: CapsuleKind;
  title: string;
  body: string;
  mediaUrl?: string;
  audioUrl?: string;
  tags: string[];
  unlock: UnlockCondition;
};

export async function createCapsule(input: NewCapsuleInput) {
  const supabase = await createClient();
  const { error } = await supabase.from("capsules").insert({
    author_id: input.authorId,
    kind: input.kind,
    title: input.title,
    body: input.body,
    media_url: input.mediaUrl ?? null,
    audio_url: input.audioUrl ?? null,
    tags: input.tags,
    unlock_type: input.unlock.type,
    unlock_at: input.unlock.type === "date" ? input.unlock.unlockAt : null,
    unlock_age: input.unlock.type === "age" ? input.unlock.age : null,
    unlock_milestone: input.unlock.type === "milestone" ? input.unlock.label : null,
  });

  if (error) throw error;
}
