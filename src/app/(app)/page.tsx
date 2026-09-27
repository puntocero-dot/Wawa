import { SnapshotCard } from "@/components/snapshot-card";
import { placeholderCapsules } from "@/lib/data";

export default function InstantFeedPage() {
  const capsules = placeholderCapsules.filter((c) => c.kind === "instant" || c.isUnlocked);

  return (
    <div className="flex flex-col gap-4">
      <div className="px-1">
        <h1 className="font-display text-2xl text-ink-900 dark:text-cream-50">Instant</h1>
        <p className="text-sm text-ink-700/70 dark:text-cream-200/60">
          Momentos espontáneos, tal como pasaron.
        </p>
      </div>

      {capsules.length === 0 ? (
        <p className="glass-sm rounded-glass px-5 py-8 text-center text-sm text-ink-700/70 dark:text-cream-200/60">
          Todavía no hay momentos. Crea el primero desde el botón +.
        </p>
      ) : (
        capsules.map((capsule) => <SnapshotCard key={capsule.id} capsule={capsule} />)
      )}
    </div>
  );
}
