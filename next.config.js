/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow reading from the content directory at build/runtime
  experimental: {
    serverComponentsExternalPackages: ['gray-matter'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

module.exports = nextConfig;
