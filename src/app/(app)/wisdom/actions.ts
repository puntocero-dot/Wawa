"use server";

import { findRelevantWisdom, type WisdomMatch } from "@/ai/flows/find-relevant-wisdom";
import { placeholderCapsules } from "@/lib/data";

export async function searchWisdomAction(query: string): Promise<WisdomMatch[]> {
  if (!query.trim()) return [];
  const unlockedWisdom = placeholderCapsules.filter((c) => c.kind === "wisdom" && c.isUnlocked);
  return findRelevantWisdom(query, unlockedWisdom);
}
