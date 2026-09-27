import type { Capsule } from "@/lib/types";

/**
 * Placeholder data so the UI is real to look at before Supabase is wired up.
 * Swapped for `src/lib/repositories/capsules.ts` once a project is connected —
 * nothing in the components below should need to change when that happens.
 */
export const placeholderCapsules: Capsule[] = [
  {
    id: "1",
    authorId: "u1",
    authorName: "Mamá",
    authorAvatarUrl: null,
    kind: "instant",
    title: "Domingo de panqueques quemados",
    body: "Hoy intenté hacer panqueques con forma de dinosaurio y todos terminaron pareciendo continentes. Te reíste tanto que se te salió la leche por la nariz. Momentos así son los que quiero que veas tal cual fueron: imperfectos y felices.",
    mediaUrl: null,
    tags: ["cotidiano", "risas"],
    unlock: { type: "immediate" },
    createdAt: "2026-09-21T09:12:00.000Z",
    isUnlocked: true,
  },
  {
    id: "2",
    authorId: "u1",
    authorName: "Papá",
    authorAvatarUrl: null,
    kind: "wisdom",
    title: "Sobre tu primer fracaso",
    body: "Vas a fallar en algo que te importa muchísimo. Va a doler más de lo que esperas. Quiero que sepas que a mí también me pasó, y que no te define — te construye.",
    mediaUrl: null,
    tags: ["consejo", "resiliencia"],
    unlock: { type: "milestone", label: "Primer fracaso importante" },
    createdAt: "2026-08-02T18:40:00.000Z",
    isUnlocked: false,
  },
  {
    id: "3",
    authorId: "u1",
    authorName: "Mamá",
    authorAvatarUrl: null,
    kind: "moment",
    title: "Para tus 15 años",
    body: "No sé quién serás para cuando leas esto, pero sé que quien seas, va a estar bien. Aquí va un consejo que a mí me hubiera gustado escuchar a tu edad...",
    mediaUrl: null,
    tags: ["hito", "quinceañera"],
    unlock: { type: "age", age: 15 },
    createdAt: "2026-05-14T12:00:00.000Z",
    isUnlocked: false,
  },
];
