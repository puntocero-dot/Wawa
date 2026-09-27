import { getAiClient, AI_MODEL } from "@/ai/client";

export async function suggestWisdomTags(body: string): Promise<string[]> {
  const ai = getAiClient();
  if (!ai || body.trim().length < 12) return [];

  try {
    const response = await ai.models.generateContent({
      model: AI_MODEL,
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Sugiere de 2 a 4 etiquetas cortas (una o dos palabras, en español, minúsculas, separadas por coma, sin explicación) para este consejo guardado por un padre para su hijo:\n\n"${body}"`,
            },
          ],
        },
      ],
    });

    return (response.text ?? "")
      .split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean)
      .slice(0, 4);
  } catch {
    return [];
  }
}
