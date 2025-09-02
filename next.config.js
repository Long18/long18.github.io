/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  images: {
    unoptimized: true,
  },
  // GitHub Pages specific configuration
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Note: rewrites and redirects don't work with static export
  // Legacy version access will be handled by direct folder structure
};

module.exports = nextConfig;