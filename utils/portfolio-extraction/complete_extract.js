const fs = require('fs');

// Read the HTML file
const htmlContent = fs.readFileSync('./public/v2.0/index.html', 'utf8');

// Technology tag color mapping
const tagColorMapping = {
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

console.log('🚀 Starting complete portfolio extraction...\n');

// Extract sidebar (keeping existing working code)
function extractSidebarInfo() {
  const sidebarRegex = /<aside class="sidebar"[^>]*>([\s\S]*?)<\/aside>/;
  const sidebarMatch = htmlContent.match(sidebarRegex);
  
  if (!sidebarMatch) return null;
  
  const sidebarContent = sidebarMatch[1];
  
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

// Extract all projects using regex approach
function extractAllProjects() {
  const projects = [];
  
  // Get the main project list section
  const startMarker = '<!-- Project Thumbnail -->';
  const startIndex = htmlContent.indexOf(startMarker);
  const projectListStart = htmlContent.indexOf('<ul class="project-list">', startIndex);
  const projectListEnd = htmlContent.indexOf('</ul>', projectListStart);
  
  const projectListContent = htmlContent.substring(projectListStart, projectListEnd);
  console.log('✅ Found main project list section');
  
  // Use a more robust regex to match project items
  const projectRegex = /<li class="project-item[^>]*?data-category="([^"]+)"[^>]*?>([\s\S]*?)(?=<li class="project-item|$)/g;
  
  let match;
  let projectCount = 0;
  
  while ((match = projectRegex.exec(projectListContent)) !== null) {
    projectCount++;
    const [fullMatch, category, projectContent] = match;
    
    try {
      // Extract detail category (project ID)
      const detailCategoryMatch = projectContent.match(/data-detail-category="([^"]+)"/);
      if (!detailCategoryMatch) {
        console.log(`⚠️  Project ${projectCount}: No detail category found`);
        continue;
      }
      
      const projectId = detailCategoryMatch[1];
      
      // Extract title
      const titleMatch = projectContent.match(/<h3 class="project-title"[^>]*?>([^<]+)<\/h3>/);
      if (!titleMatch) {
        console.log(`⚠️  Project ${projectCount}: No title found`);
        continue;
      }
      
      // Extract image
      const imageMatch = projectContent.match(/<img[^>]+src="([^"]+)"[^>]*?>/);
      if (!imageMatch) {
        console.log(`⚠️  Project ${projectCount}: No image found`);
        continue;
      }
      
      // Extract category tag
      const tagMatch = projectContent.match(/<p class="project-category tag">([^<]+)<\/p>/);
      const categoryName = tagMatch ? tagMatch[1] : category;
      
      // Check for SensorTower links in the opening tag
      const androidSensorMatch = fullMatch.match(/data-api-url-android="([^"]*)"/);
      const iosSensorMatch = fullMatch.match(/data-api-url-ios="([^"]*)"/);
      
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
      console.log(`📱 ${projectCount}. ${project.title} (${project.category})`);
      
    } catch (error) {
      console.log(`❌ Error processing project ${projectCount}: ${error.message}`);
    }
  }
  
  // If regex approach didn't work well, try the split approach as backup
  if (projects.length < 10) {
    console.log('\n🔄 Regex approach got few results, trying split approach...');
    return extractProjectsViaSplit();
  }
  
  return projects;
}

// Backup extraction method using split
function extractProjectsViaSplit() {
  const projects = [];
  
  const startMarker = '<!-- Project Thumbnail -->';
  const startIndex = htmlContent.indexOf(startMarker);
  const projectListStart = htmlContent.indexOf('<ul class="project-list">', startIndex);
  const projectListEnd = htmlContent.indexOf('</ul>', projectListStart);
  
  const projectListContent = htmlContent.substring(projectListStart, projectListEnd);
  
  // Split and process each part
  const parts = projectListContent.split('<li class="project-item');
  
  for (let i = 1; i < parts.length; i++) {
    try {
      const projectHtml = '<li class="project-item' + parts[i];
      
      // Extract basic info with more lenient matching
      const categoryMatch = projectHtml.match(/data-category="([^"]+)"/);
      const detailCategoryMatch = projectHtml.match(/data-detail-category="([^"]+)"/);
      const titleMatch = projectHtml.match(/<h3[^>]*class="project-title"[^>]*>([^<]+)<\/h3>/);
      const imageMatch = projectHtml.match(/<img[^>]+src="([^"]+)"/);
      
      // Only require the most essential fields
      if (detailCategoryMatch && titleMatch) {
        const categoryName = categoryMatch ? categoryMatch[1] : 'unknown';
        
        const project = {
          id: detailCategoryMatch[1],
          title: titleMatch[1].trim(),
          category: categoryName,
          image: imageMatch ? imageMatch[1] : '',
          tags: [{
            label: categoryName,
            colorClass: tagColorMapping[categoryName] || 'bg-gray-600 text-white'
          }]
        };
        
        // Check for SensorTower links
        const androidSensorMatch = projectHtml.match(/data-api-url-android="([^"]*)"/);
        const iosSensorMatch = projectHtml.match(/data-api-url-ios="([^"]*)"/);
        
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
      }
    } catch (error) {
      console.log(`⚠️  Error processing project ${i}: ${error.message}`);
    }
  }
  
  return projects;
}

// Extract detailed project information
function addProjectDetails(projects) {
  console.log('\n🔍 Adding project details...');
  
  return projects.map((project, index) => {
    console.log(`${index + 1}. Processing ${project.title}...`);
    
    try {
      // More flexible detail section matching
      const detailPatterns = [
        new RegExp(`<section[^>]*data-detail-category="${project.id}"[^>]*>([\\s\\S]*?)<\\/section>`, 'g'),
        new RegExp(`data-detail-category="${project.id}"[^>]*>([\\s\\S]*?)<\\/section>`, 'g')
      ];
      
      let detailContent = null;
      for (const pattern of detailPatterns) {
        const match = pattern.exec(htmlContent);
        if (match) {
          detailContent = match[1];
          break;
        }
      }
      
      if (!detailContent) {
        console.log(`   ❌ No details found`);
        return { ...project, gallery: [project.image], timeline: '', description: '', responsibilities: [], achievements: [] };
      }
      
      // Extract various pieces of information
      const timelineMatch = detailContent.match(/<span[^>]*>([^<]+)<\/span>/);
      const timeline = timelineMatch ? timelineMatch[1] : '';
      
      // Extract all images for gallery
      const gallery = [];
      const imageMatches = detailContent.matchAll(/<img[^>]+src="([^"]+)"/g);
      for (const match of imageMatches) {
        if (!match[1].includes('.svg')) { // Skip icon files
          gallery.push(match[1]);
        }
      }
      
      // Extract description
      const descMatches = detailContent.match(/<p class="timeline-text description"[^>]*>([\s\S]*?)<\/p>/);
      const description = descMatches ? descMatches[1].replace(/<[^>]*>/g, '').trim() : '';
      
      // Extract responsibilities and achievements
      const responsibilities = [];
      const achievements = [];
      
      const respSection = detailContent.match(/Main responsibilit[^<]*<\/h1>\s*<ul[^>]*>([\s\S]*?)<\/ul>/i);
      if (respSection) {
        const respItems = respSection[1].matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g);
        for (const item of respItems) {
          const text = item[1].replace(/<[^>]*>/g, '').trim();
          if (text && text.length > 5) responsibilities.push(text);
        }
      }
      
      const achSection = detailContent.match(/Achievement[^<]*<\/h1>\s*<ul[^>]*>([\s\S]*?)<\/ul>/i);
      if (achSection) {
        const achItems = achSection[1].matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g);
        for (const item of achItems) {
          const text = item[1].replace(/<[^>]*>/g, '').trim();
          if (text && text.length > 5) achievements.push(text);
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

const projects = extractAllProjects();
console.log(`🎯 Projects found: ${projects.length}`);

if (projects.length > 0) {
  const detailedProjects = addProjectDetails(projects);
  
  const portfolioData = {
    sidebar,
    projects: detailedProjects
  };
  
  // Save to file
  fs.writeFileSync('./portfolio-data-complete.json', JSON.stringify(portfolioData, null, 2));
  
  console.log('\n✨ Portfolio data extraction completed!');
  console.log(`📊 Total projects: ${portfolioData.projects.length}`);
  console.log(`🖼️  Projects with SensorTower: ${portfolioData.projects.filter(p => p.sensorTowerLinks).length}`);
  console.log(`🔗 Projects with store links: ${portfolioData.projects.filter(p => p.storeLinks).length}`);
  
  // Show summary by category
  console.log('\n📋 Projects by category:');
  const categoryCount = {};
  portfolioData.projects.forEach(p => {
    categoryCount[p.category] = (categoryCount[p.category] || 0) + 1;
  });
  Object.entries(categoryCount).forEach(([cat, count]) => {
    console.log(`   ${cat}: ${count} projects`);
  });
  
  console.log('\n✅ Complete data saved to portfolio-data-complete.json');
} else {
  console.log('❌ No projects extracted!');
}

process.exit(0);
