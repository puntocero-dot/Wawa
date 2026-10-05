type FoxIntroVideoProps = {
  className?: string;
};

/**
 * The source clip sits on a flat near-white backdrop (#F6F6F6), not a
 * transparent one, and that gray is too close to the fox's own light fur
 * tones for a chroma key to cut cleanly — it eats the belly/tail highlights
 * along with the background. Rather than ship that artifact, this renders
 * the clip as a deliberate cover strip (its native background as the strip
 * color) with a soft gradient fade into the card below, instead of faking
 * transparency.
 */
export function FoxIntroVideo({ className }: FoxIntroVideoProps) {
  return (
    <div className={className} style={{ backgroundColor: "#f6f6f6" }}>
      <video className="h-full w-full object-cover" autoPlay muted playsInline aria-hidden>
        <source src="/videos/fox-intro.webm" type="video/webm" />
        <source src="/videos/fox-intro.mp4" type="video/mp4" />
      </video>
      <div
        className="pointer-events-none -mt-10 h-10 w-full"
        style={{ background: "linear-gradient(to bottom, transparent, rgb(var(--surface-tint)))" }}
      />
    </div>
  );
}
