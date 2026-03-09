import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Use dedicated output for production builds to avoid lock conflicts with running `next dev` on Windows.
  distDir: process.env.NODE_ENV === "production" ? ".next-build" : ".next",
};

export default nextConfig;
