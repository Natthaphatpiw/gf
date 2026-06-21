import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    qualities: [75, 90, 100],
  },
};

export default nextConfig;
