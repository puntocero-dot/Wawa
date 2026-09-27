import { Lock, Sparkles } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatRelativeDate } from "@/lib/utils";
import type { Capsule } from "@/lib/types";

const kindLabel: Record<Capsule["kind"], string> = {
  instant: "Instant",
  moment: "Moment",
  wisdom: "Wisdom",
  secret: "Secret",
};

function unlockLabel(capsule: Capsule): string | null {
  if (capsule.unlock.type === "immediate") return null;
  if (capsule.unlock.type === "date") {
    return `Se desbloquea el ${new Date(capsule.unlock.unlockAt).toLocaleDateString("es")}`;
  }
  if (capsule.unlock.type === "age") return `Se desbloquea a los ${capsule.unlock.age} años`;
  return `Se desbloquea: ${capsule.unlock.label}`;
}

export function SnapshotCard({ capsule }: { capsule: Capsule }) {
  const locked = !capsule.isUnlocked;

  return (
    <GlassPanel as="article" className="flex flex-col gap-3 p-5">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar name={capsule.authorName} src={capsule.authorAvatarUrl} size={38} />
          <div>
            <p className="text-sm font-semibold text-ink-900 dark:text-cream-50">{capsule.authorName}</p>
            <p className="text-xs text-ink-700/60 dark:text-cream-200/50">{formatRelativeDate(capsule.createdAt)}</p>
          </div>
        </div>
        <Badge variant={locked ? "locked" : "terracotta"}>{kindLabel[capsule.kind]}</Badge>
      </header>

      <div>
        <h3 className="font-display text-lg text-ink-900 dark:text-cream-50">{capsule.title}</h3>
        <p
          className={`mt-1 text-[15px] leading-relaxed text-ink-800/85 dark:text-cream-100/80 ${locked ? "line-clamp-2 blur-[3px] select-none" : ""}`}
        >
          {capsule.body}
        </p>
      </div>

      {locked ? (
        <div className="flex items-center gap-2 rounded-2xl bg-ink-900/5 px-3.5 py-2.5 text-xs font-medium text-ink-700 dark:bg-cream-100/5 dark:text-cream-200">
          <Lock className="h-3.5 w-3.5 shrink-0" />
          {unlockLabel(capsule)}
        </div>
      ) : (
        capsule.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {capsule.tags.map((tag) => (
              <Badge key={tag} variant="sand">
                <Sparkles className="h-2.5 w-2.5" />
                {tag}
              </Badge>
            ))}
          </div>
        )
      )}
    </GlassPanel>
  );
}
