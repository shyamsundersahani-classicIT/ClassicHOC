import type { NextConfig } from "next";

// Old WordPress URLs that no longer exist, redirected so existing Google rankings and links keep working.
const nextConfig: NextConfig = {
  // LAN addresses of developers' machines, so the dev site can be opened from a phone.
  allowedDevOrigins: ["192.168.1.134", "192.168.1.59"],
  // Admin photo uploads go through a Server Action. Photos are shrunk in the
  // browser first, but leave room for big PNGs (Vercel's own limit is 4.5 MB).
  experimental: { serverActions: { bodySizeLimit: "4.5mb" } },
  poweredByHeader: false, // don't advertise what the site is built with
  async headers() {
    return [
      {
        // Basic browser protections for every page: the site can't be framed by
        // other sites (clickjacking), files are never guessed as another type,
        // and HTTPS is always used once the live site has been visited.
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
        ],
      },
      {
        // The admin page is never cached or shown in search results.
        source: "/admin",
        headers: [
          { key: "Cache-Control", value: "no-store" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: "/elementor-280", destination: "/", permanent: true },
      { source: "/elementor-280/", destination: "/", permanent: true },
      // "Our Tie-ups" page was removed
      { source: "/our-tie-ups", destination: "/", permanent: true },
      { source: "/our-tie-ups/", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
