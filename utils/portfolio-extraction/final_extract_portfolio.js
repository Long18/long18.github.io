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
    birthday: birthdayMatch ? birthdayMatch[1] : '',
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

// Extract projects using a more robust approach
function extractProjects() {
  const projects = [];
  
  // Find the FIRST project list section only (the main thumbnails)
  const startMarker = '<!-- Project Thumbnail -->';
  const startIndex = htmlContent.indexOf(startMarker);
  
  if (startIndex === -1) {
    console.log('❌ Could not find project thumbnail section');
    return [];
  }
  
  const projectListStart = htmlContent.indexOf('<ul class="project-list">', startIndex);
  const projectListEnd = htmlContent.indexOf('</ul>', projectListStart);
  
  if (projectListStart === -1 || projectListEnd === -1) {
    console.log('❌ Could not find project list boundaries');
    return [];
  }
  
  const projectListContent = htmlContent.substring(projectListStart, projectListEnd);
  console.log('✅ Found main project list section');
  console.log(`📏 Content length: ${projectListContent.length} characters`);
  
  // Split by project items and process each one
  const projectChunks = projectListContent.split('<li class="project-item');
  console.log(`🔢 Found ${projectChunks.length - 1} project chunks`); // -1 because first chunk is before any project
  
  for (let i = 1; i < projectChunks.length; i++) { // Skip first chunk (before any project)
    const chunk = '<li class="project-item' + projectChunks[i];
    
    // Extract basic attributes from the opening tag
    const categoryMatch = chunk.match(/data-category="([^"]+)"/);
    const androidSensorMatch = chunk.match(/data-api-url-android="([^"]*)"/);
    const iosSensorMatch = chunk.match(/data-api-url-ios="([^"]*)"/);
    
    if (!categoryMatch) continue;
    
    const category = categoryMatch[1];
    const androidSensorTower = androidSensorMatch ? androidSensorMatch[1] : null;
    const iosSensorTower = iosSensorMatch ? iosSensorMatch[1] : null;
    
    // Extract project ID
    const projectIdMatch = chunk.match(/data-detail-category="([^"]+)"/);
    if (!projectIdMatch) {
      console.log(`⚠️  Project ${i} missing detail category`);
      continue;
    }
    
    const projectId = projectIdMatch[1];
    
    // Extract title
    const titleMatch = chunk.match(/<h3 class="project-title"[^>]*>([^<]+)<\/h3>/);
    
    // Extract image
    const imageMatch = chunk.match(/<img src="([^"]+)"[^>]*alt="([^"]*)"[^>]*>/);
    
    // Extract category tag
    const tagMatch = chunk.match(/<p class="project-category tag">([^<]+)<\/p>/);
    
    if (titleMatch && imageMatch) {
      const categoryName = tagMatch ? tagMatch[1] : category;
      
      const project = {
        id: projectId,
        title: titleMatch[1].trim(),
        category: category,
        image: imageMatch[1],
        tags: [{
          label: categoryName,
          colorClass: tagColorMapping[categoryName] || 'bg-gray-600 text-white'
        }]
      };
      
      // Add SensorTower links if present
      if (androidSensorTower || iosSensorTower) {
        project.sensorTowerLinks = {};
        if (androidSensorTower) project.sensorTowerLinks.android = androidSensorTower;
        if (iosSensorTower) project.sensorTowerLinks.ios = iosSensorTower;
      }
      
      projects.push(project);
      console.log(`📱 ${i}. ${project.title} (${project.category})`);
    } else {
      console.log(`⚠️  Project ${i} missing title or image`);
    }
  }
  
  return projects;
}

// Extract project details
function extractProjectDetails(projects) {
  return projects.map(project => {
    console.log(`🔍 Processing details for: ${project.title}`);
    
    // Find the project detail section
    const detailRegex = new RegExp(`<section class="timeline project-item"[^>]*data-detail-category="${project.id}"[^>]*>([\\s\\S]*?)<\\/section>`, 'g');
    const detailMatch = detailRegex.exec(htmlContent);
    
    if (!detailMatch) {
      console.log(`   ❌ No detail section found for ${project.id}`);
      return { ...project, gallery: [project.image], timeline: '', description: '', responsibilities: [], achievements: [], technologies: [] };
    }
    
    const detailContent = detailMatch[1];
    console.log(`   ✅ Found detail section (${detailContent.length} chars)`);
    
    // Extract gallery images
    const gallery = [];
    const imageRegex = /<img src="([^"]+)"[^>]*(?:loading="lazy")?[^>]*alt="([^"]*)"[^>]*\/?>/g;
    let imageMatch;
    while ((imageMatch = imageRegex.exec(detailContent)) !== null) {
      gallery.push(imageMatch[1]);
    }
    
    // Extract timeline
    const timelineMatch = detailContent.match(/<span[^>]*>([^<]+)<\/span>/);
    const timeline = timelineMatch ? timelineMatch[1] : '';
    
    // Extract description from team composition or other descriptive text
    const descMatch = detailContent.match(/<p class="timeline-text description"[^>]*>([\s\S]*?)<\/p>/);
    const description = descMatch ? descMatch[1].replace(/<[^>]*>/g, '').trim() : '';
    
    // Extract responsibilities
    const responsibilities = [];
    const respSectionMatch = detailContent.match(/<h1 class="h4 timeline-item-title"[^>]*>Main responsibilit[^<]*<\/h1>\s*<ul class="timeline-description-list">([\s\S]*?)<\/ul>/);
    if (respSectionMatch) {
      const respItemRegex = /<li[^>]*>\s*<p class="timeline-text description"[^>]*>\s*([\s\S]*?)\s*<\/p>\s*<\/li>/g;
      let respMatch;
      while ((respMatch = respItemRegex.exec(respSectionMatch[1])) !== null) {
        const cleanText = respMatch[1].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
        if (cleanText) {
          responsibilities.push(cleanText);
        }
      }
    }
    
    // Extract achievements
    const achievements = [];
    const achSectionMatch = detailContent.match(/<h1 class="h4 timeline-item-title"[^>]*>Achievements?[^<]*<\/h1>\s*<ul class="timeline-description-list">([\s\S]*?)<\/ul>/);
    if (achSectionMatch) {
      const achItemRegex = /<li[^>]*>\s*<p class="timeline-text description"[^>]*>\s*([\s\S]*?)\s*<\/p>\s*<\/li>/g;
      let achMatch;
      while ((achMatch = achItemRegex.exec(achSectionMatch[1])) !== null) {
        let cleanText = achMatch[1].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
        if (cleanText) {
          achievements.push(cleanText);
        }
      }
    }
    
    // Extract technologies from any tech tags
    const technologies = [];
    const techRegex = /<span class="tag[^"]*"[^>]*>([^<]+)<\/span>/g;
    let techMatch;
    while ((techMatch = techRegex.exec(detailContent)) !== null) {
      const tech = techMatch[1].trim();
      if (tech && !technologies.find(t => t.label === tech)) {
        technologies.push({
          label: tech,
          colorClass: tagColorMapping[tech] || 'bg-gray-600 text-white'
        });
      }
    }
    
    // Extract store links
    const storeLinks = {};
    const googlePlayMatch = detailContent.match(/<a class="service-item"[^>]*href="(https:\/\/play\.google\.com\/store\/apps\/details[^"]+)"/);
    const appStoreMatch = detailContent.match(/<a class="service-item"[^>]*href="(https:\/\/apps\.apple\.com\/[^"]+)"/);
    
    if (googlePlayMatch) storeLinks.android = googlePlayMatch[1];
    if (appStoreMatch) storeLinks.ios = appStoreMatch[1];
    
    // Extract website links (not app stores)
    const websiteMatches = detailContent.matchAll(/<a class="service-item"[^>]*href="(https?:\/\/[^"]+)"/g);
    let website = null;
    for (const match of websiteMatches) {
      const url = match[1];
      if (!url.includes('play.google.com') && !url.includes('apps.apple.com')) {
        website = url;
        break;
      }
    }
    
    console.log(`   📊 Gallery: ${gallery.length} images, Responsibilities: ${responsibilities.length}, Achievements: ${achievements.length}, Technologies: ${technologies.length}`);
    
    return {
      ...project,
      timeline,
      description,
      gallery: gallery.length > 0 ? gallery : [project.image],
      responsibilities,
      achievements,
      technologies,
      storeLinks: Object.keys(storeLinks).length > 0 ? storeLinks : undefined,
      website
    };
  });
}

// Main execution
console.log('🚀 Starting portfolio data extraction...\n');

const sidebar = extractSidebarInfo();
console.log(`📁 Sidebar extracted: ${sidebar ? '✅' : '❌'}`);

const projects = extractProjects();
console.log(`🎯 Found ${projects.length} projects\n`);

if (projects.length > 0) {
  const detailedProjects = extractProjectDetails(projects);

  const portfolioData = {
    sidebar,
    projects: detailedProjects
  };

  console.log('\n📊 Extraction Summary:');
  console.log(`📁 Sidebar Info: ${sidebar ? '✅' : '❌'}`);
  console.log(`🎯 Total Projects: ${projects.length}`);
  console.log(`🖼️  Projects with SensorTower: ${projects.filter(p => p.sensorTowerLinks).length}`);

  // Write to JSON file
  fs.writeFileSync('./portfolio-data-complete.json', JSON.stringify(portfolioData, null, 2));

  console.log('\n✨ Data saved to portfolio-data-complete.json');
  console.log('\n📋 Project List:');
  portfolioData.projects.forEach((project, index) => {
    console.log(`${index + 1}. ${project.title}`);
    console.log(`   📂 Category: ${project.category}`);
    console.log(`   🖼️  Gallery: ${project.gallery?.length || 0} images`);
    console.log(`   🎯 Responsibilities: ${project.responsibilities?.length || 0}`);
    console.log(`   🏆 Achievements: ${project.achievements?.length || 0}`);
    console.log(`   🏷️  Technologies: ${project.technologies?.length || 0}`);
    if (project.sensorTowerLinks) {
      console.log(`   📊 SensorTower: ${Object.keys(project.sensorTowerLinks).join(', ')}`);
    }
    if (project.storeLinks) {
      console.log(`   🔗 Store Links: ${Object.keys(project.storeLinks).join(', ')}`);
    }
    console.log('');
  });

  console.log('🏷️  Projects by category:');
  const categoryCount = {};
  portfolioData.projects.forEach(p => {
    categoryCount[p.category] = (categoryCount[p.category] || 0) + 1;
  });
  Object.entries(categoryCount).forEach(([cat, count]) => {
    console.log(`   ${cat}: ${count} projects`);
  });
} else {
  console.log('❌ No projects found - check the extraction logic');
}
