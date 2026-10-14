import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Only "/" and "/login" are public. Everything under the (app) route group
 * is a signed-in family's private data — disallowed here as a second layer
 * on top of the per-page `robots: noindex` metadata (crawlers that ignore
 * meta robots still read this file).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/login"],
      disallow: ["/home", "/new", "/wisdom", "/moments", "/secrets", "/profile"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
