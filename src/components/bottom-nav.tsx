"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Camera, Compass, Gift, Lock, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: typeof Camera;
  isCenter?: boolean;
};

const items: NavItem[] = [
  { href: "/home", label: "Instant", icon: Camera },
  { href: "/wisdom", label: "Wisdom", icon: Compass },
  { href: "/new", label: "Nueva cápsula", icon: Plus, isCenter: true },
  { href: "/moments", label: "Moments", icon: Gift },
  { href: "/secrets", label: "Secrets", icon: Lock },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-2">
      <div className="mx-auto flex w-full max-w-md items-center justify-between gap-1 px-6">
        {items.map(({ href, label, icon: Icon, isCenter }) => {
          const active = pathname === href;

          if (isCenter) {
            return (
              <Link
                key={href}
                href={href}
                aria-label={label}
                className="-mt-6 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-amber-400 to-terracotta-500 text-cream-50 shadow-[0_10px_24px_-6px_rgba(161,74,43,0.55)] ring-4 ring-background transition-transform active:scale-95"
              >
                <Icon className="h-6 w-6" strokeWidth={2.25} />
              </Link>
            );
          }

          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-2xl py-1.5 text-[10px] font-medium transition-colors",
                active ? "text-terracotta-600 dark:text-terracotta-400" : "text-ink-700/50 dark:text-cream-100/40",
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={active ? 2.25 : 1.75} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
