import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_HOST}/api/:path*`,
      },
      {
        source: '/file/:path*',
        destination: `${process.env.API_HOST}/file/:path*`,
      },
    ];
  },
};

export default nextConfig;
