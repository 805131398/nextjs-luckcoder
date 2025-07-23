import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'luckcoder.oss-cn-beijing.aliyuncs.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'luckcoder.oss-cn-beijing.aliyuncs.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
