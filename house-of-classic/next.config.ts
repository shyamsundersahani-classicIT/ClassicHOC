import type { NextConfig } from "next";

// Old WordPress URLs that no longer exist, redirected so existing Google rankings and links keep working.
const nextConfig: NextConfig = {
  // LAN addresses of developers' machines, so the dev site can be opened from a phone.
  allowedDevOrigins: ["192.168.1.134", "192.168.1.59"],
  // Admin photo uploads go through a Server Action. Photos are shrunk in the
  // browser first, but leave room for big PNGs (Vercel's own limit is 4.5 MB).
  experimental: { serverActions: { bodySizeLimit: "4.5mb" } },
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
