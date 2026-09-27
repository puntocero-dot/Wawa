import Image from "next/image";
import { cn } from "@/lib/utils";

type AvatarProps = {
  src?: string | null;
  name: string;
  size?: number;
  className?: string;
};

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function Avatar({ src, name, size = 40, className }: AvatarProps) {
  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        width={size}
        height={size}
        className={cn("rounded-full object-cover ring-2 ring-cream-50/70 dark:ring-espresso-950/70", className)}
      />
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      className={cn(
        "flex items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-terracotta-500 text-sm font-semibold text-cream-50 ring-2 ring-cream-50/70 dark:ring-espresso-950/70",
        className,
      )}
    >
      {initials(name)}
    </div>
  );
}
