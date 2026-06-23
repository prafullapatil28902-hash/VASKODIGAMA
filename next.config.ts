import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project ONLY for local dev/build. The
  // parent folder on the dev machine has a stray lockfile that otherwise
  // makes Turbopack infer the wrong root. On Vercel the repo is standalone,
  // so we must NOT override the root there — doing so desyncs the build
  // output from the serverless routes and 404s every page.
  ...(process.env.VERCEL
    ? {}
    : { turbopack: { root: path.resolve(__dirname) } }),
};

export default nextConfig;
