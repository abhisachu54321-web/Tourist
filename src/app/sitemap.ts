import type { MetadataRoute } from "next";
import { hasSiteUrl, isSetupMode, siteUrl } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  // Nothing is listed until the business details and the public address are in place.
  if (isSetupMode || !hasSiteUrl) return [];

  return [
    { url: `${siteUrl}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/privacy`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
