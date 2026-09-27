import type { Metadata } from "next";
import { SnapshotCard } from "@/components/snapshot-card";
import { placeholderCapsules } from "@/lib/data";

export const metadata: Metadata = { title: "Moments" };

export default function MomentsPage() {
  const moments = placeholderCapsules.filter((c) => c.kind === "moment");

  return (
    <div className="flex flex-col gap-4">
      <div className="px-1">
        <h1 className="font-display text-2xl text-ink-900 dark:text-cream-50">Moments</h1>
        <p className="text-sm text-ink-700/70 dark:text-cream-200/60">
          Mensajes guardados para hitos de vida específicos.
        </p>
      </div>

      {moments.length === 0 ? (
        <p className="glass-sm rounded-glass px-5 py-8 text-center text-sm text-ink-700/70 dark:text-cream-200/60">
          Todavía no hay moments guardados.
        </p>
      ) : (
        moments.map((capsule) => <SnapshotCard key={capsule.id} capsule={capsule} />)
      )}
    </div>
  );
}
