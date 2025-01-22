import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/api/tracks",
        destination: `https://${process.env.NEXT_PUBLIC_API}/default/tracks`,
      },
      {
        source: "/api/tracks/:path",
        destination: `https://${process.env.NEXT_PUBLIC_API}/default/tracks/:path`,
      },
    ];
  },
};

export default nextConfig;
