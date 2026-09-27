import { cn } from "@/lib/utils";

type GlassPanelProps = React.ComponentProps<"div"> & {
  as?: "div" | "section" | "article";
  tone?: "default" | "sm";
};

/**
 * The frosted-glass surface every card, sheet and modal in Wawa is built on.
 * Kept as a single primitive so the glass recipe (blur, tint, border, shadow)
 * only ever lives in one place — see `.glass` / `.glass-sm` in globals.css.
 */
export function GlassPanel({
  as: Tag = "div",
  tone = "default",
  className,
  ...props
}: GlassPanelProps) {
  return (
    <Tag
      className={cn(
        "rounded-glass",
        tone === "default" ? "glass" : "glass-sm",
        className,
      )}
      {...props}
    />
  );
}
