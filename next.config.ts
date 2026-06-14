import type { NextConfig } from "next";

const apiOrigin = process.env.API_URL ?? "http://localhost:5005";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/backend/:path*",
        destination: `${apiOrigin}/:path*`,
      },
    ];
  },
};

export default nextConfig;
