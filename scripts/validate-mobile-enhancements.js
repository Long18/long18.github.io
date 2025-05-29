const fs = require('fs').promises;
const path = require('path');

class MobileEnhancementValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.publicDir = './public';
    this.assetsDir = './public/assets';
  }

  async validateAll() {
    console.log('🔍 Validating mobile enhancements...\n');

    await this.validateMobileScripts();
    await this.validatePWAFiles();
    await this.validateHTMLIntegration();
    await this.validateManifest();
    await this.validateServiceWorker();
    await this.validateCSS();
    await this.validateImages();

    this.printResults();
    return this.errors.length === 0;
  }

  async validateMobileScripts() {
    console.log('📱 Validating mobile scripts...');
    
    const requiredScripts = [
      'advanced-gestures.js',
      'mobile-navigation.js',
      'mobile-accessibility.js',
      'mobile-css-optimizer.js',
      'mobile-performance.js',
      'pwa-manager.js',
      'mobile-performance-monitor.js',
      'mobile-ui-components.js'
    ];

    for (const script of requiredScripts) {
      const scriptPath = path.join(this.assetsDir, 'js', script);
      try {
        const content = await fs.readFile(scriptPath, 'utf8');
        
        // Basic validation checks
        if (content.length < 100) {
          this.warnings.push(`${script} seems too short (${content.length} chars)`);
        }
        
        // Check for critical functions
        if (script === 'pwa-manager.js' && !content.includes('registerServiceWorker')) {
          this.errors.push(`${script} missing registerServiceWorker function`);
        }
        
        if (script === 'mobile-performance-monitor.js' && !content.includes('class MobilePerformanceMonitor')) {
          this.errors.push(`${script} missing MobilePerformanceMonitor class`);
        }
        
        console.log(`  ✓ ${script}`);
      } catch (error) {
        this.errors.push(`Missing or unreadable: ${script}`);
        console.log(`  ✗ ${script} - ${error.message}`);
      }
    }
  }

  async validatePWAFiles() {
    console.log('\n🚀 Validating PWA files...');
    
    // Check manifest.json
    try {
      const manifestPath = path.join(this.publicDir, 'manifest.json');
      const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
      
      const requiredFields = ['name', 'short_name', 'start_url', 'display', 'theme_color', 'background_color', 'icons'];
      for (const field of requiredFields) {
        if (!manifest[field]) {
          this.errors.push(`manifest.json missing required field: ${field}`);
        }
      }
      
      // Validate icons
      if (manifest.icons && manifest.icons.length > 0) {
        for (const icon of manifest.icons) {
          const iconPath = path.join(this.publicDir, icon.src);
          try {
            await fs.access(iconPath);
          } catch {
            this.warnings.push(`Icon not found: ${icon.src}`);
          }
        }
      }
      
      console.log('  ✓ manifest.json');
    } catch (error) {
      this.errors.push(`manifest.json error: ${error.message}`);
      console.log(`  ✗ manifest.json - ${error.message}`);
    }

    // Check service worker
    try {
      const swPath = path.join(this.publicDir, 'sw.js');
      const swContent = await fs.readFile(swPath, 'utf8');
      
      if (!swContent.includes('install')) {
        this.errors.push('Service worker missing install event');
      }
      
      if (!swContent.includes('fetch')) {
        this.errors.push('Service worker missing fetch event');
      }
      
      console.log('  ✓ sw.js');
    } catch (error) {
      this.errors.push(`sw.js error: ${error.message}`);
      console.log(`  ✗ sw.js - ${error.message}`);
    }
  }

  async validateHTMLIntegration() {
    console.log('\n📄 Validating HTML integration...');
    
    const htmlFiles = [
      './index.html',
      './public/v2.0/index.html'
    ];

    for (const htmlFile of htmlFiles) {
      try {
        const content = await fs.readFile(htmlFile, 'utf8');
        
        // Check for PWA meta tags
        if (!content.includes('rel="manifest"')) {
          this.warnings.push(`${htmlFile} missing manifest link`);
        }
        
        if (!content.includes('apple-mobile-web-app-capable')) {
          this.warnings.push(`${htmlFile} missing Apple PWA meta tags`);
        }
        
        // Check for mobile enhancement scripts in v2.0
        if (htmlFile.includes('v2.0')) {
          const mobileScripts = [
            'pwa-manager.js',
            'mobile-performance-monitor.js',
            'mobile-ui-components.js'
          ];
          
          for (const script of mobileScripts) {
            if (!content.includes(script)) {
              this.errors.push(`${htmlFile} missing script: ${script}`);
            }
          }
        }
        
        console.log(`  ✓ ${path.basename(htmlFile)}`);
      } catch (error) {
        this.errors.push(`HTML file error ${htmlFile}: ${error.message}`);
        console.log(`  ✗ ${path.basename(htmlFile)} - ${error.message}`);
      }
    }
  }

  async validateManifest() {
    console.log('\n📋 Validating PWA manifest...');
    
    try {
      const manifestPath = path.join(this.publicDir, 'manifest.json');
      const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
      
      // Validate display modes
      const validDisplayModes = ['fullscreen', 'standalone', 'minimal-ui', 'browser'];
      if (!validDisplayModes.includes(manifest.display)) {
        this.errors.push(`Invalid display mode: ${manifest.display}`);
      }
      
      // Validate start_url
      if (!manifest.start_url || !manifest.start_url.startsWith('/')) {
        this.errors.push('start_url should be a relative path starting with /');
      }
      
      // Validate theme colors
      const colorRegex = /^#[0-9A-Fa-f]{6}$/;
      if (manifest.theme_color && !colorRegex.test(manifest.theme_color)) {
        this.warnings.push(`Invalid theme_color format: ${manifest.theme_color}`);
      }
      
      console.log('  ✓ Manifest validation complete');
    } catch (error) {
      this.errors.push(`Manifest validation error: ${error.message}`);
    }
  }

  async validateServiceWorker() {
    console.log('\n🔧 Validating service worker...');
    
    try {
      const swPath = path.join(this.publicDir, 'sw.js');
      const swContent = await fs.readFile(swPath, 'utf8');
      
      // Check for modern SW features
      const features = {
        'Cache versioning': /CACHE_VERSION\s*=|cache.*version/i,
        'Background sync': /background.*sync|sync.*event/i,
        'Push notifications': /push.*event|notification/i,
        'Offline fallback': /offline|fallback/i,
        'Cache strategies': /networkFirst|cacheFirst|staleWhileRevalidate/i
      };
      
      for (const [feature, pattern] of Object.entries(features)) {
        if (pattern.test(swContent)) {
          console.log(`  ✓ ${feature}`);
        } else {
          this.warnings.push(`Service worker missing: ${feature}`);
        }
      }
      
    } catch (error) {
      this.errors.push(`Service worker validation error: ${error.message}`);
    }
  }

  async validateCSS() {
    console.log('\n🎨 Validating mobile CSS...');
    
    const cssFiles = [
      'style.css',
      'modern-enhancements.css',
      'animations.css'
    ];

    for (const cssFile of cssFiles) {
      try {
        const cssPath = path.join(this.assetsDir, 'css', cssFile);
        const content = await fs.readFile(cssPath, 'utf8');
        
        // Check for mobile-specific features
        if (content.includes('@media') && content.includes('max-width')) {
          console.log(`  ✓ ${cssFile} - Mobile responsive`);
        } else {
          this.warnings.push(`${cssFile} may be missing mobile responsiveness`);
        }
        
        // Check for touch-friendly sizing
        if (content.includes('44px') || content.includes('48px')) {
          console.log(`  ✓ ${cssFile} - Touch-friendly sizing`);
        }
        
      } catch (error) {
        this.warnings.push(`CSS file not found or unreadable: ${cssFile}`);
      }
    }
  }

  async validateImages() {
    console.log('\n🖼️  Validating images...');
    
    try {
      const imagesDir = path.join(this.assetsDir, 'images');
      const files = await fs.readdir(imagesDir);
      
      const webpCount = files.filter(f => f.endsWith('.webp')).length;
      const totalImages = files.filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f)).length;
      
      if (webpCount > 0) {
        console.log(`  ✓ Found ${webpCount} WebP images`);
      } else {
        this.warnings.push('No WebP images found - consider optimization');
      }
      
      // Check for PWA icons
      const iconSizes = ['72x72', '96x96', '128x128', '144x144', '192x192', '512x512'];
      const iconsDir = path.join(imagesDir, 'icons');
      
      try {
        await fs.access(iconsDir);
        const iconFiles = await fs.readdir(iconsDir);
        
        for (const size of iconSizes) {
          const iconFile = `icon-${size}.png`;
          if (iconFiles.includes(iconFile)) {
            console.log(`  ✓ PWA icon: ${iconFile}`);
          } else {
            this.warnings.push(`Missing PWA icon: ${iconFile}`);
          }
        }
      } catch {
        this.warnings.push('PWA icons directory not found');
      }
      
    } catch (error) {
      this.warnings.push(`Images validation error: ${error.message}`);
    }
  }

  printResults() {
    console.log('\n' + '='.repeat(50));
    console.log('📊 VALIDATION RESULTS');
    console.log('='.repeat(50));
    
    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('🎉 All mobile enhancements validated successfully!');
      return;
    }
    
    if (this.errors.length > 0) {
      console.log('\n❌ ERRORS:');
      this.errors.forEach(error => console.log(`  • ${error}`));
    }
    
    if (this.warnings.length > 0) {
      console.log('\n⚠️  WARNINGS:');
      this.warnings.forEach(warning => console.log(`  • ${warning}`));
    }
    
    console.log(`\n📈 Summary: ${this.errors.length} errors, ${this.warnings.length} warnings`);
    
    if (this.errors.length === 0) {
      console.log('✅ Validation passed with warnings');
    } else {
      console.log('❌ Validation failed - please fix errors before deployment');
    }
  }
}

// Run validation if called directly
if (require.main === module) {
  const validator = new MobileEnhancementValidator();
  validator.validateAll().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('Validation error:', error);
    process.exit(1);
  });
}

module.exports = { MobileEnhancementValidator };
