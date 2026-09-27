import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold tracking-tight transition-all duration-200 disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.97]",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-b from-terracotta-400 to-terracotta-600 text-cream-50 shadow-[0_8px_20px_-8px_rgba(161,74,43,0.65)] hover:brightness-[1.05]",
        glass: "glass-sm text-ink-800 hover:brightness-105 dark:text-cream-100",
        ghost: "text-ink-700 hover:bg-ink-900/5 dark:text-cream-200 dark:hover:bg-cream-100/10",
        outline:
          "border border-ink-900/15 text-ink-800 hover:bg-ink-900/5 dark:border-cream-100/20 dark:text-cream-100 dark:hover:bg-cream-100/10",
      },
      size: {
        sm: "h-9 px-4 text-[13px]",
        md: "h-11 px-5",
        lg: "h-13 px-7 text-base",
        icon: "h-11 w-11 shrink-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />
  );
}

export { Button, buttonVariants };
