import type { NextConfig } from "next";

/**
 * Baseline security headers.
 * Note: no X-Frame-Options / frame-ancestors is set so hosted previews that embed the
 * site in a frame keep working. Add one here if you want to forbid framing in production.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
];

// Images use Next's default WebP output: AVIF is slightly smaller but several times
// slower to generate on the first request, which hurts on small self-hosted servers.
const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
