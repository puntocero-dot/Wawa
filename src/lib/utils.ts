import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const relativeFormatter = new Intl.RelativeTimeFormat("es", { numeric: "auto" });
const DAY_MS = 86_400_000;

export function formatRelativeDate(isoDate: string): string {
  const diffDays = Math.round((new Date(isoDate).getTime() - Date.now()) / DAY_MS);

  if (Math.abs(diffDays) < 1) return relativeFormatter.format(0, "day");
  if (Math.abs(diffDays) < 30) return relativeFormatter.format(diffDays, "day");
  if (Math.abs(diffDays) < 365) return relativeFormatter.format(Math.round(diffDays / 30), "month");
  return relativeFormatter.format(Math.round(diffDays / 365), "year");
}
