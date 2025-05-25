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

console.log('🚀 Starting portfolio data extraction...\n');

// Extract sidebar information
function extractSidebarInfo() {
  const sidebarRegex = /<aside class="sidebar"[^>]*>([\s\S]*?)<\/aside>/;
  const sidebarMatch = htmlContent.match(sidebarRegex);
  
  if (!sidebarMatch) return null;
  
  const sidebarContent = sidebarMatch[1];
  
  // Extract all the fields
  const nameMatch = sidebarContent.match(/<h1 class="realname"[^>]*>([^<]+)<\/h1>/);
  const aliasMatch = sidebarContent.match(/<h1 class="name"[^>]*>([^<]+)<\/h1>/);
  const avatarMatch = sidebarContent.match(/<img src="([^"]+)" alt="[^"]*" width="80">/);
  const emailMatch = sidebarContent.match(/href="mailto:([^"]+)"/);
  const phoneMatch = sidebarContent.match(/href="tel:([^"]+)"/);
  const birthdayMatch = sidebarContent.match(/<time datetime="([^"]+)">([^<]+)<\/time>/);
  const locationMatch = sidebarContent.match(/<address>([^<]+)<\/address>/);
  
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

// Extract projects using the working approach
function extractProjects() {
  const projects = [];
  
  // Get the main project list section
  const startMarker = '<!-- Project Thumbnail -->';
  const startIndex = htmlContent.indexOf(startMarker);
  const projectListStart = htmlContent.indexOf('<ul class="project-list">', startIndex);
  const projectListEnd = htmlContent.indexOf('</ul>', projectListStart);
  
  const projectListContent = htmlContent.substring(projectListStart, projectListEnd);
  console.log('✅ Found main project list section');
  
  // Split by project items more carefully
  const parts = projectListContent.split('<li class="project-item');
  console.log(`🔢 Found ${parts.length - 1} project parts`);
  
  for (let i = 1; i < parts.length; i++) {
    try {
      const projectHtml = '<li class="project-item' + parts[i];
      
      // Extract attributes safely
      const categoryMatch = projectHtml.match(/data-category="([^"]+)"/);
      if (!categoryMatch) continue;
      
      const category = categoryMatch[1];
      
      // Extract IDs and data
      const detailCategoryMatch = projectHtml.match(/data-detail-category="([^"]+)"/);
      if (!detailCategoryMatch) continue;
      
      const projectId = detailCategoryMatch[1];
      
      // Extract SensorTower links if present
      const androidSensorMatch = projectHtml.match(/data-api-url-android="([^"]*)"/);
      const iosSensorMatch = projectHtml.match(/data-api-url-ios="([^"]*)"/);
      
      // Extract title
      const titleMatch = projectHtml.match(/<h3 class="project-title"[^>]*>([^<]+)<\/h3>/);
      if (!titleMatch) continue;
      
      // Extract image
      const imageMatch = projectHtml.match(/<img src="([^"]+)"[^>]*>/);
      if (!imageMatch) continue;
      
      // Extract category tag
      const tagMatch = projectHtml.match(/<p class="project-category tag">([^<]+)<\/p>/);
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
      if (androidSensorMatch || iosSensorMatch) {
        project.sensorTowerLinks = {};
        if (androidSensorMatch && androidSensorMatch[1]) {
          project.sensorTowerLinks.android = androidSensorMatch[1];
        }
        if (iosSensorMatch && iosSensorMatch[1]) {
          project.sensorTowerLinks.ios = iosSensorMatch[1];
        }
      }
      
      projects.push(project);
      console.log(`📱 ${i}. ${project.title} (${project.category})`);
      
    } catch (error) {
      console.log(`⚠️  Error processing project ${i}: ${error.message}`);
    }
  }
  
  return projects;
}

// Simplified project detail extraction
function extractProjectDetails(projects) {
  console.log('\n🔍 Extracting project details...');
  
  return projects.map((project, index) => {
    console.log(`${index + 1}. Processing ${project.title}...`);
    
    try {
      // Find detail section
      const detailRegex = new RegExp(`data-detail-category="${project.id}"[^>]*>([\\s\\S]*?)<\\/section>`, 'g');
      const detailMatch = detailRegex.exec(htmlContent);
      
      if (!detailMatch) {
        console.log(`   ❌ No details found`);
        return { ...project, gallery: [project.image], timeline: '', description: '', responsibilities: [], achievements: [] };
      }
      
      const detailContent = detailMatch[1];
      
      // Extract timeline
      const timelineMatch = detailContent.match(/<span[^>]*>([^<]+)<\/span>/);
      const timeline = timelineMatch ? timelineMatch[1] : '';
      
      // Extract description
      const descMatches = detailContent.match(/<p class="timeline-text description"[^>]*>([\s\S]*?)<\/p>/);
      const description = descMatches ? descMatches[1].replace(/<[^>]*>/g, '').trim() : '';
      
      // Extract gallery images
      const gallery = [];
      const imageMatches = detailContent.matchAll(/<img src="([^"]+)"/g);
      for (const match of imageMatches) {
        gallery.push(match[1]);
      }
      
      // Extract responsibilities
      const responsibilities = [];
      const respSection = detailContent.match(/Main responsibilit[^<]*<\/h1>\s*<ul class="timeline-description-list">([\s\S]*?)<\/ul>/);
      if (respSection) {
        const respItems = respSection[1].matchAll(/<p class="timeline-text description"[^>]*>([\s\S]*?)<\/p>/g);
        for (const item of respItems) {
          const text = item[1].replace(/<[^>]*>/g, '').trim();
          if (text) responsibilities.push(text);
        }
      }
      
      // Extract achievements
      const achievements = [];
      const achSection = detailContent.match(/Achievement[^<]*<\/h1>\s*<ul class="timeline-description-list">([\s\S]*?)<\/ul>/);
      if (achSection) {
        const achItems = achSection[1].matchAll(/<p class="timeline-text description"[^>]*>([\s\S]*?)<\/p>/g);
        for (const item of achItems) {
          const text = item[1].replace(/<[^>]*>/g, '').trim();
          if (text) achievements.push(text);
        }
      }
      
      // Extract store links
      const storeLinks = {};
      const playStoreMatch = detailContent.match(/href="(https:\/\/play\.google\.com\/store\/apps\/details[^"]+)"/);
      const appStoreMatch = detailContent.match(/href="(https:\/\/apps\.apple\.com\/[^"]+)"/);
      
      if (playStoreMatch) storeLinks.android = playStoreMatch[1];
      if (appStoreMatch) storeLinks.ios = appStoreMatch[1];
      
      console.log(`   ✅ ${gallery.length} images, ${responsibilities.length} responsibilities, ${achievements.length} achievements`);
      
      return {
        ...project,
        timeline,
        description,
        gallery: gallery.length > 0 ? gallery : [project.image],
        responsibilities,
        achievements,
        storeLinks: Object.keys(storeLinks).length > 0 ? storeLinks : undefined
      };
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      return { ...project, gallery: [project.image], timeline: '', description: '', responsibilities: [], achievements: [] };
    }
  });
}

// Main execution
const sidebar = extractSidebarInfo();
console.log(`📁 Sidebar: ${sidebar ? '✅' : '❌'}`);

const projects = extractProjects();
console.log(`🎯 Projects: ${projects.length}`);

const detailedProjects = extractProjectDetails(projects);

const portfolioData = {
  sidebar,
  projects: detailedProjects
};

// Save to file
fs.writeFileSync('./portfolio-data-complete.json', JSON.stringify(portfolioData, null, 2));

console.log('\n✨ Portfolio data extraction completed!');
console.log(`📊 Total projects: ${portfolioData.projects.length}`);
console.log(`🖼️  Projects with SensorTower: ${portfolioData.projects.filter(p => p.sensorTowerLinks).length}`);

// Show summary
console.log('\n📋 Project Summary:');
portfolioData.projects.forEach((project, index) => {
  const sensorTower = project.sensorTowerLinks ? ' 📊' : '';
  const storeLinks = project.storeLinks ? ' 🔗' : '';
  console.log(`${index + 1}. ${project.title} (${project.category})${sensorTower}${storeLinks}`);
});

console.log('\n✅ Data saved to portfolio-data-complete.json');

process.exit(0);
