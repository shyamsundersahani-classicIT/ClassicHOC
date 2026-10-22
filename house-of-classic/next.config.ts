import type { NextConfig } from "next";

// Old WordPress URLs that no longer exist, redirected so existing Google rankings and links keep working.
const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.134"],
  async redirects() {
    return [
      { source: "/product/hoc-booking", destination: "/contact", permanent: true },
      { source: "/product/hoc-booking/", destination: "/contact", permanent: true },
      { source: "/elementor-280", destination: "/", permanent: true },
      { source: "/elementor-280/", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
