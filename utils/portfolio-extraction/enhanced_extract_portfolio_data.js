const fs = require('fs');

// Read the HTML file
const htmlContent = fs.readFileSync('./public/v2.0/index.html', 'utf8');

// Technology tag color mapping based on tailwind.config.js
const tagColorMapping = {
  'Unity': 'bg-gray-800 text-white',
  'Unreal Engine': 'bg-purple-700 text-white', 
  'Unreal': 'bg-purple-700 text-white',
  'React': 'bg-blue-600 text-white',
  'App Development': 'bg-green-600 text-white',
  'Applications': 'bg-green-600 text-white',
  'Android Studio': 'bg-green-600 text-white',
  'AR/VR': 'bg-pink-600 text-white',
  'C++': 'bg-red-700 text-white',
  'JavaScript': 'bg-yellow-500 text-black',
  'Android': 'bg-lime-600 text-white',
  'iOS': 'bg-indigo-600 text-white'
};

// Extract sidebar information
function extractSidebarInfo() {
  const sidebarRegex = /<aside class="sidebar"[^>]*>([\s\S]*?)<\/aside>/;
  const sidebarMatch = htmlContent.match(sidebarRegex);
  
  if (!sidebarMatch) return null;
  
  const sidebarContent = sidebarMatch[1];
  
  // Extract name and alias
  const nameMatch = sidebarContent.match(/<h1 class="realname"[^>]*>([^<]+)<\/h1>/);
  const aliasMatch = sidebarContent.match(/<h1 class="name"[^>]*>([^<]+)<\/h1>/);
  
  // Extract avatar
  const avatarMatch = sidebarContent.match(/<img src="([^"]+)" alt="[^"]*" width="80">/);
  
  // Extract contact info
  const emailMatch = sidebarContent.match(/href="mailto:([^"]+)"/);
  const phoneMatch = sidebarContent.match(/href="tel:([^"]+)"/);
  const birthdayMatch = sidebarContent.match(/<time datetime="([^"]+)">([^<]+)<\/time>/);
  const locationMatch = sidebarContent.match(/<address>([^<]+)<\/address>/);
  
  // Extract social links
  const githubMatch = sidebarContent.match(/href="(https:\/\/github\.com\/[^"]+)"/);
  const facebookMatch = sidebarContent.match(/href="(https:\/\/www\.facebook\.com\/[^"]+)"/);
  const twitterMatch = sidebarContent.match(/href="(https:\/\/twitter\.com\/[^"]+)"/);
  const linkedinMatch = sidebarContent.match(/href="(https:\/\/www\.linkedin\.com\/[^"]+)"/);
  const skypeMatch = sidebarContent.match(/href="(https:\/\/join\.skype\.com\/[^"]+)"/);
  
  return {
    name: nameMatch ? nameMatch[1] : '',
    alias: aliasMatch ? aliasMatch[1] : '',
    avatar: avatarMatch ? avatarMatch[1] : '',
    email: emailMatch ? emailMatch[1] : '',
    phone: phoneMatch ? phoneMatch[1] : '',
    birthday: birthdayMatch ? birthdayMatch[2] : '',
    location: locationMatch ? locationMatch[1] : '',
    socials: {
      github: githubMatch ? githubMatch[1] : '',
      facebook: facebookMatch ? facebookMatch[1] : '',
      twitter: twitterMatch ? twitterMatch[1] : '',
      linkedin: linkedinMatch ? linkedinMatch[1] : '',
      skype: skypeMatch ? skypeMatch[1] : ''
    }
  };
}

// Extract projects with complete data
function extractProjects() {
  const projects = [];
  
  // Find the main project list section
  const projectListRegex = /<!-- Project Thumbnail -->\s*<ul class="project-list">([\s\S]*?)<\/ul>/;
  const projectListMatch = htmlContent.match(projectListRegex);
  
  if (!projectListMatch) {
    console.log('Could not find project list section');
    return [];
  }
  
  const projectListContent = projectListMatch[1];
  
  // Extract individual project items
  const projectItemRegex = /<li class="project-item[^>]*data-category="([^"]+)"[^>]*data-api-url-android="([^"]*)"[^>]*data-api-url-ios="([^"]*)"[^>]*>([\s\S]*?)<\/li>/g;
  
  let match;
  while ((match = projectItemRegex.exec(projectListContent)) !== null) {
    const [fullMatch, category, androidSensorTower, iosSensorTower, content] = match;
    
    // Extract project ID
    const projectIdMatch = content.match(/data-detail-category="([^"]+)"/);
    if (!projectIdMatch) continue;
    
    const projectId = projectIdMatch[1];
    
    // Extract title
    const titleMatch = content.match(/<h3 class="project-title"[^>]*>([^<]+)<\/h3>/);
    
    // Extract image
    const imageMatch = content.match(/<img src="([^"]+)"[^>]*alt="([^"]*)"[^>]*>/);
    
    // Extract category tag
    const tagMatch = content.match(/<p class="project-category tag">([^<]+)<\/p>/);
    
    if (titleMatch && imageMatch) {
      const categoryName = tagMatch ? tagMatch[1] : category;
      
      const project = {
        id: projectId,
        title: titleMatch[1],
        category: category,
        image: imageMatch[1],
        tags: [{
          label: categoryName,
          colorClass: tagColorMapping[categoryName] || 'bg-muted text-white'
        }]
      };
      
      // Add SensorTower links if present
      if (androidSensorTower || iosSensorTower) {
        project.sensorTowerLinks = {};
        if (androidSensorTower) project.sensorTowerLinks.android = androidSensorTower;
        if (iosSensorTower) project.sensorTowerLinks.ios = iosSensorTower;
      }
      
      projects.push(project);
    }
  }
  
  // Handle projects without SensorTower data
  const simpleProjRegex = /<li class="project-item[^>]*data-category="([^"]+)"[^>]*>((?:(?!data-api-url)[\s\S])*?)<\/li>/g;
  
  while ((match = simpleProjRegex.exec(projectListContent)) !== null) {
    const [fullMatch, category, content] = match;
    
    // Skip if already processed (has SensorTower data)
    if (content.includes('data-api-url-android') || content.includes('data-api-url-ios')) {
      continue;
    }
    
    // Extract project ID
    const projectIdMatch = content.match(/data-detail-category="([^"]+)"/);
    if (!projectIdMatch) continue;
    
    const projectId = projectIdMatch[1];
    
    // Skip if we already have this project
    if (projects.find(p => p.id === projectId)) continue;
    
    // Extract title
    const titleMatch = content.match(/<h3 class="project-title"[^>]*>([^<]+)<\/h3>/);
    
    // Extract image
    const imageMatch = content.match(/<img src="([^"]+)"[^>]*alt="([^"]*)"[^>]*>/);
    
    // Extract category tag
    const tagMatch = content.match(/<p class="project-category tag">([^<]+)<\/p>/);
    
    if (titleMatch && imageMatch) {
      const categoryName = tagMatch ? tagMatch[1] : category;
      
      const project = {
        id: projectId,
        title: titleMatch[1],
        category: category,
        image: imageMatch[1],
        tags: [{
          label: categoryName,
          colorClass: tagColorMapping[categoryName] || 'bg-muted text-white'
        }]
      };
      
      projects.push(project);
    }
  }
  
  return projects;
}

// Extract project details
function extractProjectDetails(projects) {
  return projects.map(project => {
    // Find the project detail section
    const detailRegex = new RegExp(`<section class="timeline project-item"[^>]*data-detail-category="${project.id}"[^>]*>([\\s\\S]*?)<\\/section>`, 'g');
    const detailMatch = detailRegex.exec(htmlContent);
    
    if (!detailMatch) {
      return { ...project, gallery: [project.image], timeline: '', description: '', responsibilities: [], achievements: [] };
    }
    
    const detailContent = detailMatch[1];
    
    // Extract gallery images
    const gallery = [];
    const imageRegex = /<img src="([^"]+)"[^>]*loading="lazy"[^>]*alt="([^"]*)"[^>]*\/>/g;
    let imageMatch;
    while ((imageMatch = imageRegex.exec(detailContent)) !== null) {
      gallery.push(imageMatch[1]);
    }
    
    // Extract timeline
    const timelineMatch = detailContent.match(/<span>([^<]+)<\/span>/);
    const timeline = timelineMatch ? timelineMatch[1] : '';
    
    // Extract team composition/description
    const teamCompositionMatch = detailContent.match(/Team composition[^<]*([^<]+)/);
    const description = teamCompositionMatch ? teamCompositionMatch[1] : '';
    
    // Extract responsibilities
    const responsibilities = [];
    const respSectionMatch = detailContent.match(/<h1 class="h4 timeline-item-title">Main responsibilit[^<]*<\/h1>\s*<ul class="timeline-description-list">([\s\S]*?)<\/ul>/);
    if (respSectionMatch) {
      const respItemRegex = /<p class="timeline-text description">\s*([\s\S]*?)\s*<\/p>/g;
      let respMatch;
      while ((respMatch = respItemRegex.exec(respSectionMatch[1])) !== null) {
        const cleanText = respMatch[1].replace(/<[^>]*>/g, '').trim();
        if (cleanText) {
          responsibilities.push(cleanText);
        }
      }
    }
    
    // Extract achievements
    const achievements = [];
    const achSectionMatch = detailContent.match(/<h1 class="h4 timeline-item-title">Achievements?[^<]*<\/h1>\s*<ul class="timeline-description-list">([\s\S]*?)<\/ul>/);
    if (achSectionMatch) {
      const achItemRegex = /<p class="timeline-text description">\s*([\s\S]*?)\s*<\/p>/g;
      let achMatch;
      while ((achMatch = achItemRegex.exec(achSectionMatch[1])) !== null) {
        let cleanText = achMatch[1].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
        if (cleanText) {
          achievements.push(cleanText);
        }
      }
    }
    
    // Extract store links
    const storeLinks = {};
    const googlePlayMatch = detailContent.match(/<a class="service-item" href="(https:\/\/play\.google\.com\/store\/apps\/details[^"]+)"/);
    const appStoreMatch = detailContent.match(/<a class="service-item" href="(https:\/\/apps\.apple\.com\/app\/[^"]+)"/);
    
    if (googlePlayMatch) storeLinks.android = googlePlayMatch[1];
    if (appStoreMatch) storeLinks.ios = appStoreMatch[1];
    
    // Extract website links (not app stores)
    const websiteMatches = detailContent.matchAll(/<a class="service-item" href="(https?:\/\/[^"]+)"/g);
    let website = null;
    for (const match of websiteMatches) {
      const url = match[1];
      if (!url.includes('play.google.com') && !url.includes('apps.apple.com')) {
        website = url;
        break;
      }
    }
    
    return {
      ...project,
      timeline,
      description,
      gallery: gallery.length > 0 ? gallery : [project.image],
      responsibilities,
      achievements,
      storeLinks: Object.keys(storeLinks).length > 0 ? storeLinks : undefined,
      website
    };
  });
}

// Main execution
console.log('🚀 Extracting portfolio data from HTML...\n');

const sidebar = extractSidebarInfo();
const projects = extractProjects();
const detailedProjects = extractProjectDetails(projects);

const portfolioData = {
  sidebar,
  projects: detailedProjects
};

console.log('📊 Portfolio Data Extraction Complete!');
console.log(`📁 Sidebar Info: ${sidebar ? '✅' : '❌'}`);
console.log(`🎯 Projects Found: ${projects.length}`);
console.log(`🖼️  Projects with SensorTower: ${projects.filter(p => p.sensorTowerLinks).length}`);

// Write to JSON file
fs.writeFileSync('./portfolio-data-complete.json', JSON.stringify(portfolioData, null, 2));

console.log('\n✨ Data saved to portfolio-data-complete.json');
console.log('\n📋 Project Summary:');
portfolioData.projects.forEach((project, index) => {
  console.log(`${index + 1}. ${project.title} (${project.category}) - ${project.gallery?.length || 0} images`);
  if (project.sensorTowerLinks) {
    console.log(`   📊 SensorTower: Android=${!!project.sensorTowerLinks.android}, iOS=${!!project.sensorTowerLinks.ios}`);
  }
  if (project.storeLinks) {
    console.log(`   🔗 Store Links: Android=${!!project.storeLinks.android}, iOS=${!!project.storeLinks.ios}`);
  }
});

console.log(`\n🏷️  Total projects by category:`);
const categoryCount = {};
portfolioData.projects.forEach(p => {
  categoryCount[p.category] = (categoryCount[p.category] || 0) + 1;
});
Object.entries(categoryCount).forEach(([cat, count]) => {
  console.log(`   ${cat}: ${count} projects`);
});
