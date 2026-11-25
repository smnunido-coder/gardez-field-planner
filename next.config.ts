import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  allowedDevOrigins: ["*.trycloudflare.com", "*.loca.lt"],
  experimental: {
    serverActions: {
      allowedOrigins: ["*.trycloudflare.com", "*.loca.lt"],
    },
  },
  serverExternalPackages: ["@libsql/client", "libsql"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
