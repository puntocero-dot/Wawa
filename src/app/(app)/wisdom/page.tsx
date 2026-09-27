import type { Metadata } from "next";
import { SnapshotCard } from "@/components/snapshot-card";
import { WisdomSearch } from "@/components/wisdom-search";
import { placeholderCapsules } from "@/lib/data";

export const metadata: Metadata = { title: "Wisdom" };

export default function WisdomPage() {
  const wisdom = placeholderCapsules.filter((c) => c.kind === "wisdom");

  return (
    <div className="flex flex-col gap-5">
      <div className="px-1">
        <h1 className="font-display text-2xl text-ink-900 dark:text-cream-50">Wisdom</h1>
        <p className="text-sm text-ink-700/70 dark:text-cream-200/60">
          Busca el consejo que tus padres guardaron para un momento como este.
        </p>
      </div>

      <WisdomSearch />

      <div className="flex flex-col gap-3">
        {wisdom.map((capsule) => (
          <SnapshotCard key={capsule.id} capsule={capsule} />
        ))}
      </div>
    </div>
  );
}
