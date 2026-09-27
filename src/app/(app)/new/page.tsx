import type { Metadata } from "next";
import { NewSnapshotForm } from "@/components/new-snapshot-form";

export const metadata: Metadata = { title: "Nueva cápsula" };

export default function NewCapsulePage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="px-1">
        <h1 className="font-display text-2xl text-ink-900 dark:text-cream-50">Nueva cápsula</h1>
        <p className="text-sm text-ink-700/70 dark:text-cream-200/60">
          Lo que escribas aquí puede quedarse para siempre.
        </p>
      </div>

      <NewSnapshotForm />
    </div>
  );
}
