/**
 * Portfolio Data Validator
 * Validates and analyzes extracted portfolio data for completeness and accuracy
 * 
 * Usage: node utils/portfolio-extraction/validate-portfolio-data.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  PORTFOLIO_DATA_FILE: './src/data/portfolio-data.json',
  BACKUP_DATA_FILE: './utils/portfolio-extraction/backup-portfolio-data.json'
};

/**
 * Validate sidebar data structure
 */
function validateSidebar(sidebar) {
  const requiredFields = ['name', 'alias', 'email', 'phone', 'location', 'socials'];
  const issues = [];
  
  for (const field of requiredFields) {
    if (!sidebar[field]) {
      issues.push(`Missing sidebar field: ${field}`);
    }
  }
  
  if (sidebar.socials) {
    const socialPlatforms = ['github', 'facebook', 'twitter', 'linkedin'];
    const missingSocials = socialPlatforms.filter(platform => !sidebar.socials[platform]);
    if (missingSocials.length > 0) {
      issues.push(`Missing social platforms: ${missingSocials.join(', ')}`);
    }
  }
  
  return issues;
}

/**
 * Validate project data structure
 */
function validateProject(project, index) {
  const requiredFields = ['id', 'title', 'category', 'image', 'tags', 'timeline', 'description', 'gallery'];
  const issues = [];
  
  for (const field of requiredFields) {
    if (!project[field]) {
      issues.push(`Project ${index + 1} (${project.id || 'unknown'}): Missing field '${field}'`);
    }
  }
  
  // Validate category
  const validCategories = ['unity', 'unreal', 'applications'];
  if (project.category && !validCategories.includes(project.category)) {
    issues.push(`Project ${index + 1} (${project.id}): Invalid category '${project.category}'`);
  }
  
  // Validate arrays
  if (project.tags && !Array.isArray(project.tags)) {
    issues.push(`Project ${index + 1} (${project.id}): Tags should be an array`);
  }
  
  if (project.gallery && !Array.isArray(project.gallery)) {
    issues.push(`Project ${index + 1} (${project.id}): Gallery should be an array`);
  }
  
  if (project.responsibilities && !Array.isArray(project.responsibilities)) {
    issues.push(`Project ${index + 1} (${project.id}): Responsibilities should be an array`);
  }
  
  if (project.achievements && !Array.isArray(project.achievements)) {
    issues.push(`Project ${index + 1} (${project.id}): Achievements should be an array`);
  }
  
  // Validate URLs
  if (project.image && !isValidUrl(project.image)) {
    issues.push(`Project ${index + 1} (${project.id}): Invalid image URL`);
  }
  
  if (project.website && !isValidUrl(project.website)) {
    issues.push(`Project ${index + 1} (${project.id}): Invalid website URL`);
  }
  
  if (project.storeLinks) {
    if (project.storeLinks.android && !isValidUrl(project.storeLinks.android)) {
      issues.push(`Project ${index + 1} (${project.id}): Invalid Android store URL`);
    }
    if (project.storeLinks.ios && !isValidUrl(project.storeLinks.ios)) {
      issues.push(`Project ${index + 1} (${project.id}): Invalid iOS store URL`);
    }
  }
  
  return issues;
}

/**
 * Check if a string is a valid URL
 */
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

/**
 * Generate portfolio statistics
 */
function generateStatistics(portfolioData) {
  const stats = {
    totalProjects: portfolioData.projects.length,
    categories: {},
    projectsWithStoreLinks: 0,
    projectsWithWebsites: 0,
    projectsWithDownloadStats: 0,
    totalGalleryImages: 0,
    technologies: new Set(),
    averageResponsibilities: 0,
    averageAchievements: 0
  };
  
  let totalResponsibilities = 0;
  let totalAchievements = 0;
  
  portfolioData.projects.forEach(project => {
    // Category breakdown
    stats.categories[project.category] = (stats.categories[project.category] || 0) + 1;
    
    // Store links
    if (project.storeLinks) {
      stats.projectsWithStoreLinks++;
    }
    
    // Websites
    if (project.website) {
      stats.projectsWithWebsites++;
    }
    
    // Download stats (in achievements)
    if (project.achievements && project.achievements.some(achievement => 
      achievement.toLowerCase().includes('downloads'))) {
      stats.projectsWithDownloadStats++;
    }
    
    // Gallery images
    if (project.gallery) {
      stats.totalGalleryImages += project.gallery.length;
    }
    
    // Technologies
    if (project.tags) {
      project.tags.forEach(tag => {
        if (tag.label) {
          stats.technologies.add(tag.label);
        }
      });
    }
    
    // Responsibilities and achievements
    if (project.responsibilities) {
      totalResponsibilities += project.responsibilities.length;
    }
    if (project.achievements) {
      totalAchievements += project.achievements.length;
    }
  });
  
  stats.averageResponsibilities = totalResponsibilities / stats.totalProjects;
  stats.averageAchievements = totalAchievements / stats.totalProjects;
  stats.technologies = Array.from(stats.technologies);
  
  return stats;
}

/**
 * Main validation function
 */
function validatePortfolioData() {
  console.log('🔍 PORTFOLIO DATA VALIDATION\n');
  console.log('='.repeat(50));
  
  try {
    // Find data file
    let dataFile = CONFIG.PORTFOLIO_DATA_FILE;
    if (!fs.existsSync(dataFile)) {
      console.log(`⚠️  Primary data file not found: ${dataFile}`);
      dataFile = CONFIG.BACKUP_DATA_FILE;
      if (!fs.existsSync(dataFile)) {
        throw new Error(`No portfolio data file found. Please run extraction first.`);
      }
      console.log(`📁 Using backup file: ${dataFile}`);
    } else {
      console.log(`📁 Using primary file: ${dataFile}`);
    }
    
    // Load and parse data
    const portfolioData = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    console.log('✅ Portfolio data loaded successfully\n');
    
    // Validate structure
    const issues = [];
    
    // Validate sidebar
    if (!portfolioData.sidebar) {
      issues.push('Missing sidebar data');
    } else {
      issues.push(...validateSidebar(portfolioData.sidebar));
    }
    
    // Validate projects
    if (!portfolioData.projects || !Array.isArray(portfolioData.projects)) {
      issues.push('Missing or invalid projects array');
    } else {
      portfolioData.projects.forEach((project, index) => {
        issues.push(...validateProject(project, index));
      });
    }
    
    // Report validation results
    if (issues.length === 0) {
      console.log('✅ VALIDATION PASSED - No issues found!\n');
    } else {
      console.log(`❌ VALIDATION ISSUES FOUND (${issues.length}):\n`);
      issues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue}`);
      });
      console.log('');
    }
    
    // Generate and display statistics
    const stats = generateStatistics(portfolioData);
    
    console.log('📊 PORTFOLIO STATISTICS:\n');
    console.log(`📄 Sidebar Information: ${portfolioData.sidebar ? '✅' : '❌'}`);
    if (portfolioData.sidebar) {
      console.log(`   Name: ${portfolioData.sidebar.name}`);
      console.log(`   Alias: ${portfolioData.sidebar.alias}`);
      console.log(`   Email: ${portfolioData.sidebar.email}`);
      console.log(`   Social Links: ${Object.keys(portfolioData.sidebar.socials || {}).length} platforms`);
    }
    
    console.log(`\n📊 Projects: ${stats.totalProjects}`);
    console.log('   Category Distribution:');
    Object.entries(stats.categories).forEach(([category, count]) => {
      const percentage = ((count / stats.totalProjects) * 100).toFixed(1);
      console.log(`     ${category}: ${count} projects (${percentage}%)`);
    });
    
    console.log(`\n📱 Store Presence:`);
    console.log(`   Projects with Store Links: ${stats.projectsWithStoreLinks}`);
    console.log(`   Projects with Websites: ${stats.projectsWithWebsites}`);
    console.log(`   Projects with Download Stats: ${stats.projectsWithDownloadStats}`);
    
    console.log(`\n🎨 Content:`);
    console.log(`   Total Gallery Images: ${stats.totalGalleryImages}`);
    console.log(`   Unique Technologies: ${stats.technologies.length}`);
    console.log(`   Average Responsibilities per Project: ${stats.averageResponsibilities.toFixed(1)}`);
    console.log(`   Average Achievements per Project: ${stats.averageAchievements.toFixed(1)}`);
    
    console.log(`\n🏷️  Technologies Used:`);
    stats.technologies.sort().forEach(tech => {
      console.log(`     ${tech}`);
    });
    
    console.log(`\n📁 Data File Size: ${(fs.statSync(dataFile).size / 1024).toFixed(1)}KB`);
    
    if (issues.length === 0) {
      console.log('\n🎉 Portfolio data is ready for Next.js implementation!');
    } else {
      console.log('\n⚠️  Please fix the validation issues before using the data.');
    }
    
    return {
      isValid: issues.length === 0,
      issues,
      stats,
      portfolioData
    };
    
  } catch (error) {
    console.error('❌ Validation failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  validatePortfolioData();
}

module.exports = {
  validatePortfolioData,
  validateSidebar,
  validateProject,
  generateStatistics,
  CONFIG
};
