import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Only the two public pages belong here. Authenticated routes are
 * per-family private data and must never appear in a sitemap.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/login`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];
}
