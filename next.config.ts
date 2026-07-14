import type { NextConfig } from "next";

const apiOrigin = process.env.API_URL;

const allowedDevOrigins = (process.env.ALLOWED_DEV_ORIGINS ?? "10.210.10.45")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  allowedDevOrigins,
  async rewrites() {
    if (!apiOrigin) {
      return [];
    }

    return [
      {
        source: "/api/backend/:path*",
        destination: `${apiOrigin}/:path*`,
      },
    ];
  },
};

export default nextConfig;
