import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import type { Profile } from "@/lib/types";

export function Header({ profile }: { profile?: Profile | null }) {
  return (
    <header className="sticky top-0 z-30 pt-[max(env(safe-area-inset-top),0.75rem)]">
      <div className="glass-sm mx-auto flex w-full max-w-md items-center justify-between rounded-b-glass px-5 py-3">
        <Link href="/home" className="flex items-baseline gap-1.5">
          <span className="font-display text-2xl italic text-terracotta-600 dark:text-terracotta-400">
            Wawa
          </span>
        </Link>

        <Link href="/profile" aria-label="Tu perfil">
          <Avatar name={profile?.displayName ?? "Familia"} src={profile?.avatarUrl} size={36} />
        </Link>
      </div>
    </header>
  );
}
