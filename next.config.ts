import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  allowedDevOrigins: ["127.0.0.1", "localhost", "*.trycloudflare.com", "*.loca.lt", "*.lhr.life", "*.pinggy.link"],
  experimental: {
    serverActions: {
      allowedOrigins: ["127.0.0.1", "localhost", "*.trycloudflare.com", "*.loca.lt", "*.lhr.life", "*.pinggy.link"],
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
