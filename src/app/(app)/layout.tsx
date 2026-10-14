import type { Metadata } from "next";
import { Header } from "@/components/header";
import { BottomNav } from "@/components/bottom-nav";

// Everything under this route group is a signed-in family's private
// capsules — never indexable, whatever title/description a page sets.
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="ambient-glow relative flex min-h-dvh flex-col">
      <Header />
      <main className="mx-auto w-full max-w-md flex-1 px-4 pb-28 pt-4">{children}</main>
      <BottomNav />
    </div>
  );
}
