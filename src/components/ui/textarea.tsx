import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "glass-sm min-h-32 w-full resize-none rounded-2xl px-4 py-3 text-[15px] leading-relaxed text-ink-900 placeholder:text-ink-700/50 outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-amber-400/60 dark:text-cream-50 dark:placeholder:text-cream-100/40",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
