import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project. The parent folder also has a
  // lockfile, which otherwise makes Turbopack infer the wrong root and load
  // PostCSS/Tailwind config from the wrong directory.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
