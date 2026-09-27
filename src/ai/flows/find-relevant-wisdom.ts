import { getAiClient, AI_MODEL } from "@/ai/client";
import type { Capsule } from "@/lib/types";

export type WisdomMatch = { capsule: Capsule; reason: string };

/**
 * Semantic search over a child's unlocked wisdom capsules. Kept as a plain
 * ranking prompt (no embeddings/vector DB) because a family's wisdom corpus
 * is a few hundred capsules at most — a vector index would be solving a
 * problem this app doesn't have yet. Revisit if that stops being true.
 */
export async function findRelevantWisdom(
  query: string,
  candidates: Capsule[],
): Promise<WisdomMatch[]> {
  const ai = getAiClient();
  if (!ai || candidates.length === 0) return [];

  const catalog = candidates
    .map((c, i) => `${i}. [${c.title}] ${c.body}`)
    .join("\n");

  try {
    const response = await ai.models.generateContent({
      model: AI_MODEL,
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Un joven busca consejo para esta situación: "${query}"\n\nEstos son los consejos disponibles de sus padres:\n${catalog}\n\nDevuelve SOLO un JSON array de objetos {"index": number, "reason": string} con los 3 más relevantes, ordenados por relevancia. "reason" en una frase breve en español.`,
            },
          ],
        },
      ],
    });

    const parsed = JSON.parse(response.text?.trim() ?? "[]") as { index: number; reason: string }[];
    return parsed
      .filter((item) => candidates[item.index])
      .map((item) => ({ capsule: candidates[item.index], reason: item.reason }));
  } catch {
    return [];
  }
}
