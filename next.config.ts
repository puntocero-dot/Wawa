import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(self), geolocation=()" },
          // Browsers only honor HSTS over an actual HTTPS connection, so this
          // is a no-op on http://localhost — safe to ship before a domain exists.
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
      {
        // Avoids re-fetching the ~1-3MB fox clip on every visit to /login.
        // Not `immutable`/a year-long max-age: the file is served from a
        // fixed path (not content-hashed), so it can still be swapped in
        // place later — a day-long cache keeps that update reachable
        // quickly instead of being masked by stale browser caches.
        source: "/videos/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, must-revalidate" }],
      },
    ];
  },
};

export default nextConfig;
