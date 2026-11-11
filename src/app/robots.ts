import type { MetadataRoute } from "next";
import { hasSiteUrl, isSetupMode, siteUrl } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  // Keep a half-configured site out of search results.
  if (isSetupMode) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    ...(hasSiteUrl ? { sitemap: `${siteUrl}/sitemap.xml` } : {}),
  };
}
