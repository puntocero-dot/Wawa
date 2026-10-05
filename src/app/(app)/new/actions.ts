"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { createCapsule } from "@/lib/repositories/capsules";
import type { CapsuleKind, UnlockCondition } from "@/lib/types";

export type NewCapsuleFormState = { error: string | null };

function parseUnlock(formData: FormData): UnlockCondition {
  const type = String(formData.get("unlockType") ?? "immediate");

  if (type === "date") {
    return { type: "date", unlockAt: String(formData.get("unlockAt")) };
  }
  if (type === "age") {
    return { type: "age", age: Number(formData.get("unlockAge")) };
  }
  if (type === "milestone") {
    return { type: "milestone", label: String(formData.get("unlockMilestone") ?? "") };
  }
  return { type: "immediate" };
}

export async function createCapsuleAction(
  _prevState: NewCapsuleFormState,
  formData: FormData,
): Promise<NewCapsuleFormState> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase no está conectado todavía. Revisa .env.example para configurarlo." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Necesitas iniciar sesión para guardar una cápsula." };
  }

  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const kind = String(formData.get("kind") ?? "instant") as CapsuleKind;
  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  if (!title || !body) {
    return { error: "Escribe un título y un mensaje antes de guardar." };
  }

  try {
    await createCapsule({
      authorId: user.id,
      kind,
      title,
      body,
      tags,
      unlock: parseUnlock(formData),
    });
  } catch (error) {
    return { error: error instanceof Error ? error.message : "No se pudo guardar la cápsula." };
  }

  revalidatePath("/home");
  revalidatePath("/wisdom");
  revalidatePath("/moments");
  return { error: null };
}
