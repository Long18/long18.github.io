/**
 * Portfolio Data Extraction Script
 * Extracts complete portfolio data from HTML file (v2.0) for Next.js implementation
 * 
 * Usage: node utils/portfolio-extraction/extract-portfolio-data.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  HTML_FILE_PATH: './public/v2.0/index.html',
  OUTPUT_FILE: './src/data/portfolio-data.json',
  BACKUP_OUTPUT: './utils/portfolio-extraction/backup-portfolio-data.json'
};

// Known project IDs from HTML analysis
const PROJECT_IDS = [
  'heroicDefense',
  'iceBreakingBattle', 
  'metameAmusementPark',
  'cryptoquest',
  'fireFireFire',
  'rpgRun',
  'betakuma',
  'mugenHorror',
  'matchingCasino',
  'pinoRacing',
  'hutingAnimal',
  'toiletTapTap',
  'doggyMovement',
  'homeWithGrandma',
  'ffats',
  'fitnessCare'
];

// Category mapping based on HTML data-category attributes
const CATEGORY_MAPPING = {
  'heroicDefense': 'unity',
  'iceBreakingBattle': 'unity',
  'metameAmusementPark': 'unreal',
  'cryptoquest': 'unity',
  'fireFireFire': 'unity',
  'rpgRun': 'unity',
  'betakuma': 'unity',
  'mugenHorror': 'unity',
  'matchingCasino': 'unity',
  'pinoRacing': 'unity',
  'hutingAnimal': 'unity',
  'toiletTapTap': 'unity',
  'doggyMovement': 'unity',
  'homeWithGrandma': 'unity',
  'ffats': 'applications',
  'fitnessCare': 'applications'
};

// Technology tag color mapping for Tailwind CSS
const TAG_COLOR_MAPPING = {
  'Unity': 'bg-gray-800 text-white',
  'Unreal Engine': 'bg-purple-700 text-white',
  'Unreal': 'bg-purple-700 text-white',
  'React': 'bg-blue-600 text-white',
  'Applications': 'bg-green-600 text-white',
  'Android Studio': 'bg-green-600 text-white',
  'AR/VR': 'bg-pink-600 text-white',
  'C++': 'bg-red-700 text-white',
  'JavaScript': 'bg-yellow-500 text-black',
  'Android': 'bg-lime-600 text-white',
  'iOS': 'bg-indigo-600 text-white'
};

/**
 * Extract sidebar information from HTML
 */
function extractSidebarInfo(htmlContent) {
  console.log('📄 Extracting sidebar information...');
  
  const sidebarRegex = /<aside class="sidebar"[^>]*>([\s\S]*?)<\/aside>/;
  const sidebarMatch = htmlContent.match(sidebarRegex);
  
  if (!sidebarMatch) {
    throw new Error('Could not find sidebar section in HTML');
  }
  
  const sidebarContent = sidebarMatch[1];
  
  // Extract name and alias
  const nameMatch = sidebarContent.match(/<h1 class="realname"[^>]*>([^<]+)<\/h1>/);
  const aliasMatch = sidebarContent.match(/<h1 class="name"[^>]*>([^<]+)<\/h1>/);
  
  // Extract contact information
  const emailMatch = sidebarContent.match(/mailto:([^"]+)/);
  const phoneMatch = sidebarContent.match(/tel:([^"]+)/);
  const birthdayMatch = sidebarContent.match(/<time datetime="([^"]+)"/);
  const locationMatch = sidebarContent.match(/<address>([^<]+)<\/address>/);
  
  // Extract social links
  const socialLinks = {};
  const socialMatches = sidebarContent.match(/<a href="([^"]+)"[^>]*>\s*<ion-icon name="logo-([^"]+)"/g);
  
  if (socialMatches) {
    socialMatches.forEach(match => {
      const [, url, platform] = match.match(/<a href="([^"]+)"[^>]*>\s*<ion-icon name="logo-([^"]+)"/) || [];
      if (url && platform) {
        socialLinks[platform] = url;
      }
    });
  }
  
  return {
    name: nameMatch ? nameMatch[1].trim() : '',
    alias: aliasMatch ? aliasMatch[1].trim() : '',
    avatar: '/assets/images/avatar.png',
    email: emailMatch ? emailMatch[1] : '',
    phone: phoneMatch ? phoneMatch[1] : '',
    birthday: birthdayMatch ? birthdayMatch[1] : '',
    location: locationMatch ? locationMatch[1].trim() : '',
    socials: socialLinks
  };
}

/**
 * Extract individual project data by ID
 */
function extractProjectData(htmlContent, projectId) {
  console.log(`   Processing ${projectId}...`);
  
  // Find project detail section
  const projectDetailRegex = new RegExp(`<div[^>]*id="${projectId}"[^>]*class="project-detail"[^>]*>([\\s\\S]*?)<\/div>\\s*<\/div>\\s*$`, 'm');
  const projectMatch = htmlContent.match(projectDetailRegex);
  
  if (!projectMatch) {
    console.warn(`   ⚠️  Could not find project detail for ${projectId}`);
    return null;
  }
  
  const projectContent = projectMatch[1];
  
  // Extract basic info
  const titleMatch = projectContent.match(/<h2[^>]*class="project-title"[^>]*>([^<]+)<\/h2>/);
  const descriptionMatch = projectContent.match(/<p[^>]*class="project-description"[^>]*>([\s\S]*?)<\/p>/);
  const timelineMatch = projectContent.match(/<span[^>]*class="project-timeline"[^>]*>([^<]+)<\/span>/);
  
  // Extract main image
  const imageMatch = projectContent.match(/<img[^>]*src="([^"]+)"[^>]*alt="[^"]*"[^>]*>/);
  
  // Extract gallery images
  const gallery = [];
  const galleryMatches = projectContent.match(/<img[^>]*src="([^"]+)"[^>]*>/g);
  if (galleryMatches) {
    galleryMatches.forEach(match => {
      const srcMatch = match.match(/src="([^"]+)"/);
      if (srcMatch) {
        gallery.push(srcMatch[1]);
      }
    });
  }
  
  // Extract responsibilities
  const responsibilities = [];
  const respSection = projectContent.match(/<div[^>]*class="project-responsibilities"[^>]*>([\s\S]*?)<\/div>/);
  if (respSection) {
    const respMatches = respSection[1].match(/<li[^>]*>([^<]+)<\/li>/g);
    if (respMatches) {
      respMatches.forEach(match => {
        const textMatch = match.match(/<li[^>]*>([^<]+)<\/li>/);
        if (textMatch) {
          responsibilities.push(textMatch[1].trim());
        }
      });
    }
  }
  
  // Extract achievements
  const achievements = [];
  const achSection = projectContent.match(/<div[^>]*class="project-achievements"[^>]*>([\s\S]*?)<\/div>/);
  if (achSection) {
    const achMatches = achSection[1].match(/<li[^>]*>([^<]+)<\/li>/g);
    if (achMatches) {
      achMatches.forEach(match => {
        const textMatch = match.match(/<li[^>]*>([^<]+)<\/li>/);
        if (textMatch) {
          achievements.push(textMatch[1].trim());
        }
      });
    }
  }
  
  // Extract store links
  const storeLinks = {};
  const androidMatch = projectContent.match(/https:\/\/play\.google\.com\/store\/apps\/details\?id=([^"'\s]+)/);
  const iosMatch = projectContent.match(/https:\/\/apps\.apple\.com\/app\/[^"'\s]+/);
  
  if (androidMatch) storeLinks.android = androidMatch[0];
  if (iosMatch) storeLinks.ios = iosMatch[0];
  
  // Extract website
  const websiteMatch = projectContent.match(/https:\/\/[^"'\s]+\.(com|org|net|io|jp)[^"'\s]*/);
  const website = websiteMatch ? websiteMatch[0] : null;
  
  // Extract technology tags
  const tags = [];
  const techMatches = projectContent.match(/<span[^>]*class="[^"]*tech[^"]*"[^>]*>([^<]+)<\/span>/g);
  if (techMatches) {
    techMatches.forEach(match => {
      const tagMatch = match.match(/>([^<]+)</);
      if (tagMatch) {
        const label = tagMatch[1].trim();
        tags.push({
          label,
          colorClass: TAG_COLOR_MAPPING[label] || 'bg-gray-600 text-white'
        });
      }
    });
  }
  
  // If no tags found, infer from category
  if (tags.length === 0) {
    const category = CATEGORY_MAPPING[projectId];
    if (category === 'unity') {
      tags.push({ label: 'Unity', colorClass: TAG_COLOR_MAPPING['Unity'] });
    } else if (category === 'unreal') {
      tags.push({ label: 'Unreal Engine', colorClass: TAG_COLOR_MAPPING['Unreal Engine'] });
    } else if (category === 'applications') {
      tags.push({ label: 'Applications', colorClass: TAG_COLOR_MAPPING['Applications'] });
    }
  }
  
  const project = {
    id: projectId,
    title: titleMatch ? titleMatch[1].trim() : projectId,
    category: CATEGORY_MAPPING[projectId] || 'unknown',
    image: imageMatch ? imageMatch[1] : '',
    tags,
    timeline: timelineMatch ? timelineMatch[1].trim() : '',
    description: descriptionMatch ? descriptionMatch[1].replace(/<[^>]+>/g, '').trim() : '',
    gallery: [...new Set(gallery)], // Remove duplicates
    responsibilities,
    achievements
  };
  
  if (Object.keys(storeLinks).length > 0) {
    project.storeLinks = storeLinks;
  }
  
  if (website) {
    project.website = website;
  }
  
  return project;
}

/**
 * Main extraction function
 */
function extractPortfolioData() {
  console.log('🚀 Starting portfolio data extraction...\n');
  
  try {
    // Read HTML file
    if (!fs.existsSync(CONFIG.HTML_FILE_PATH)) {
      throw new Error(`HTML file not found: ${CONFIG.HTML_FILE_PATH}`);
    }
    
    const htmlContent = fs.readFileSync(CONFIG.HTML_FILE_PATH, 'utf8');
    console.log(`📁 Loaded HTML file: ${CONFIG.HTML_FILE_PATH}`);
    
    // Extract sidebar
    const sidebar = extractSidebarInfo(htmlContent);
    console.log('✅ Sidebar extracted successfully');
    
    // Extract projects
    console.log(`\n🎯 Extracting ${PROJECT_IDS.length} projects...`);
    const projects = [];
    
    for (const projectId of PROJECT_IDS) {
      const project = extractProjectData(htmlContent, projectId);
      if (project) {
        projects.push(project);
        const status = project.storeLinks ? '🔗' : project.website ? '🌐' : '📁';
        console.log(`   ✅ ${project.title} (${project.category}) ${status}`);
      }
    }
    
    const portfolioData = {
      sidebar,
      projects
    };
    
    // Ensure output directory exists
    const outputDir = path.dirname(CONFIG.OUTPUT_FILE);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Save to both locations
    fs.writeFileSync(CONFIG.OUTPUT_FILE, JSON.stringify(portfolioData, null, 2));
    fs.writeFileSync(CONFIG.BACKUP_OUTPUT, JSON.stringify(portfolioData, null, 2));
    
    console.log(`\n✨ Portfolio data extraction completed!`);
    console.log(`📊 Total projects extracted: ${projects.length}/${PROJECT_IDS.length}`);
    console.log(`📁 Saved to: ${CONFIG.OUTPUT_FILE}`);
    console.log(`💾 Backup saved to: ${CONFIG.BACKUP_OUTPUT}`);
    
    // Show summary
    const categoryCount = {};
    projects.forEach(project => {
      categoryCount[project.category] = (categoryCount[project.category] || 0) + 1;
    });
    
    console.log(`\n📋 Projects by category:`);
    Object.entries(categoryCount).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} projects`);
    });
    
    return portfolioData;
    
  } catch (error) {
    console.error('❌ Extraction failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  extractPortfolioData();
}

module.exports = {
  extractPortfolioData,
  CONFIG,
  PROJECT_IDS,
  CATEGORY_MAPPING,
  TAG_COLOR_MAPPING
};
