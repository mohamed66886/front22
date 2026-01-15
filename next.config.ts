import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.emaratalyoum.com',
        port: '',
        pathname: '/**',
      },
    ],
    qualities: [75, 90],
  },
};

export default nextConfig;
