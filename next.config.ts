import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,  // This will disable ESLint checks during the build
  },
  // Add other config options here if needed
};

export default nextConfig;
