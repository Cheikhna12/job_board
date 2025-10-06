/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Configuration expérimentale si nécessaire
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig
