/** @type {import('next').NextConfig} */
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  images: {
    unoptimized: true,
  },
  // GitHub Pages specific configuration
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  // Note: rewrites and redirects don't work with static export
  // Legacy version access will be handled by direct folder structure
};

module.exports = withMDX(nextConfig);