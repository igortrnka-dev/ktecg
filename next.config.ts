import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Keeps the Next.js dev badge out of the way when the local admin preview is shown to people.
  devIndicators: false,
};

export default nextConfig;
