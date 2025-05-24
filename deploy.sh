#!/bin/bash

# Portfolio Deployment Script for GitHub Pages
# This script builds and prepares the portfolio for GitHub Pages deployment

set -e  # Exit on any error

echo "🚀 Building Portfolio for GitHub Pages..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf out/
rm -rf .next/

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Run linting and type checking
echo "🔍 Running quality checks..."
npm run lint
npm run type-check

# Build the Next.js application
echo "🏗️  Building Next.js application..."
npm run build

# Create .nojekyll file to prevent Jekyll processing
echo "📄 Creating .nojekyll file..."
touch out/.nojekyll

# Copy legacy versions to output directory
echo "📁 Copying legacy versions..."
cp -r v1.0 out/
cp -r v2.0 out/
cp -r assets out/

# Copy additional files
echo "📋 Copying additional files..."
cp README.md out/
cp CHANGELOG.md out/

# Create a robots.txt file
echo "🤖 Creating robots.txt..."
cat > out/robots.txt << 'EOF'
User-agent: *
Allow: /

Sitemap: https://long18.github.io/sitemap.xml
EOF

# Create a simple sitemap.xml
echo "🗺️  Creating sitemap.xml..."
cat > out/sitemap.xml << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://long18.github.io/</loc>
    <lastmod>2025-05-24</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://long18.github.io/en</loc>
    <lastmod>2025-05-24</lastmod>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://long18.github.io/vi</loc>
    <lastmod>2025-05-24</lastmod>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://long18.github.io/v2.0</loc>
    <lastmod>2025-05-24</lastmod>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://long18.github.io/v1.0</loc>
    <lastmod>2025-05-24</lastmod>
    <priority>0.5</priority>
  </url>
</urlset>
EOF

echo "✅ Build completed successfully!"
echo ""
echo "📊 Build Summary:"
echo "   📱 Next.js app: out/"
echo "   🎨 Legacy v2.0: out/v2.0/"  
echo "   📝 Legacy v1.0: out/v1.0/"
echo "   🗂️  Assets: out/assets/"
echo ""
echo "🚀 Ready for deployment!"
echo "   1. Commit your changes: git add . && git commit -m 'Deploy portfolio'"
echo "   2. Push to GitHub: git push origin main"
echo "   3. GitHub Pages will automatically deploy from the 'out' folder"
echo ""
echo "🌐 Your portfolio will be available at: https://long18.github.io"
