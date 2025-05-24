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
  images: {
    unoptimized: true,
  },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  async rewrites() {
    return [
      {
        source: '/assets/:path*',
        destination: '/assets/:path*',
      },
      {
        source: '/v1.0',
        destination: '/v1.0/index.html',
      },
      {
        source: '/v2.0',
        destination: '/v2.0/index.html',
      },
    ];
  },
  async redirects() {
    return [
      // No redirects for legacy versions to allow direct access
    ];
  },
};

module.exports = withMDX(nextConfig);