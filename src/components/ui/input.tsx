import { cn } from "@/lib/utils";

function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "glass-sm h-12 w-full rounded-2xl px-4 text-[15px] text-ink-900 placeholder:text-ink-700/50 outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-amber-400/60 dark:text-cream-50 dark:placeholder:text-cream-100/40",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
