import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide",
  {
    variants: {
      variant: {
        amber: "bg-amber-400/20 text-amber-500 dark:text-amber-400",
        terracotta: "bg-terracotta-500/15 text-terracotta-600 dark:text-terracotta-400",
        sand: "bg-sand-300/40 text-ink-700 dark:bg-cream-100/10 dark:text-cream-200",
        locked: "bg-ink-900/10 text-ink-700 dark:bg-cream-100/10 dark:text-cream-300",
      },
    },
    defaultVariants: { variant: "sand" },
  },
);

type BadgeProps = React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>;

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}

export { Badge, badgeVariants };
