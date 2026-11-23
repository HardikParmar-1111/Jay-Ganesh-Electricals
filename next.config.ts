import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/catalog",
        destination: "/#materials",
        permanent: true,
      },
      {
        source: "/catalog/:path*",
        destination: "/#materials",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.21st.dev",
      },
    ],
  },
};

export default nextConfig;
