"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

type Season = "spring" | "summer" | "autumn" | "winter";

function currentSeason(): Season {
  const month = new Date().getMonth(); // 0 = enero
  if (month <= 1 || month === 11) return "winter";
  if (month <= 4) return "spring";
  if (month <= 7) return "summer";
  return "autumn";
}

const palettes: Record<Season, string[]> = {
  spring: ["#f3c98b", "#e6a37a", "#cfe1a8"],
  summer: ["#e3a857", "#d97f56", "#f3d38a"],
  autumn: ["#c1613b", "#a14a2b", "#d6ab72"],
  winter: ["#d6ab72", "#e6cca3", "#bfa6c9"],
};

/**
 * Soft floating shapes whose palette shifts with the current season —
 * a quiet nod to "the app changes as time passes", which is the whole
 * premise of Wawa. Deliberately not literal (no snowflake/leaf emoji):
 * blurred circles keep it feeling premium instead of like a seasonal
 * marketing banner.
 */
export function SeasonalAmbient() {
  const season = currentSeason();
  const colors = palettes[season];

  const shapes = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        id: i,
        size: 120 + ((i * 47) % 160),
        left: (i * 137) % 100,
        top: (i * 71) % 100,
        color: colors[i % colors.length],
        duration: 14 + (i % 4) * 4,
        delay: i * 0.8,
      })),
    [colors],
  );

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className="absolute rounded-full opacity-30 blur-3xl"
          style={{
            width: shape.size,
            height: shape.size,
            left: `${shape.left}%`,
            top: `${shape.top}%`,
            background: shape.color,
          }}
          animate={{
            y: [0, -24, 0],
            x: [0, 12, 0],
          }}
          transition={{
            duration: shape.duration,
            delay: shape.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
