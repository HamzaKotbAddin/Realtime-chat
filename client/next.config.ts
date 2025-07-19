import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000", // Adjust this if your dev server runs on a different port
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
