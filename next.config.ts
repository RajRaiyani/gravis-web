import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3007",
        pathname: "/files/**",
      },
      {
        protocol: "https",
        hostname: "server.gravisindia.com",
        pathname: "/files/**",
      }
    ],
  },
};

export default nextConfig;
