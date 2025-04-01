/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
      ignoreDuringBuilds: true, // ✅ ignoruj błędy ESLint w czasie builda
    },
    typescript: {
      ignoreBuildErrors: true, // ✅ ignoruj błędy TS (np. any)
    },
  }
  
  module.exports = nextConfig;
  