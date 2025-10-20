/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Désactive le mode strict pour éviter les warnings Swagger UI
  eslint: {
    // Ignore les erreurs ESLint pendant le build de production
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignore les erreurs TypeScript pendant le build (optionnel)
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig
