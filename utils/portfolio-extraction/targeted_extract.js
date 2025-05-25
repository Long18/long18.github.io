const fs = require('fs');

// Read the HTML file
const htmlContent = fs.readFileSync('./public/v2.0/index.html', 'utf8');

// Known project IDs from the HTML analysis
const projectIds = [
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

console.log('🚀 Starting targeted portfolio extraction...\n');

// Extract sidebar information (known working)
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

// Extract project data for each known ID
function extractProjectByID(projectId) {
  try {
    // Find project thumbnail data
    const thumbnailRegex = new RegExp(`data-detail-category="${projectId}"[^>]*>([\\s\\S]*?)(?=<li class="project-item|</ul>)`, 'g');
    const thumbnailMatch = thumbnailRegex.exec(htmlContent);
    
    if (!thumbnailMatch) {
      console.log(`❌ ${projectId}: No thumbnail found`);
      return null;
    }
    
    const thumbnailContent = thumbnailMatch[0];
    
    // Extract basic project info from thumbnail
    const categoryMatch = thumbnailContent.match(/data-category="([^"]+)"/);
    const titleMatch = thumbnailContent.match(/<h3 class="project-title"[^>]*>([^<]+)<\/h3>/);
    const imageMatch = thumbnailContent.match(/<img[^>]+src="([^"]+)"/);
    const tagMatch = thumbnailContent.match(/<p class="project-category tag">([^<]+)<\/p>/);
    
    // Check for SensorTower links
    const androidSensorMatch = thumbnailContent.match(/data-api-url-android="([^"]*)"/);
    const iosSensorMatch = thumbnailContent.match(/data-api-url-ios="([^"]*)"/);
    
    if (!titleMatch) {
      console.log(`❌ ${projectId}: No title found`);
      return null;
    }
    
    const category = categoryMatch ? categoryMatch[1] : 'unknown';
    const categoryName = tagMatch ? tagMatch[1] : category;
    
    const project = {
      id: projectId,
      title: titleMatch[1].trim(),
      category: category,
      image: imageMatch ? imageMatch[1] : '',
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
    
    // Extract detailed information
    const detailRegex = new RegExp(`<section[^>]*data-detail-category="${projectId}"[^>]*>([\\s\\S]*?)<\\/section>`, 'g');
    const detailMatch = detailRegex.exec(htmlContent);
    
    if (detailMatch) {
      const detailContent = detailMatch[1];
      
      // Extract timeline
      const timelineMatch = detailContent.match(/<span[^>]*>([^<]+)<\/span>/);
      project.timeline = timelineMatch ? timelineMatch[1] : '';
      
      // Extract description
      const descMatch = detailContent.match(/<p class="timeline-text description"[^>]*>([\s\S]*?)<\/p>/);
      project.description = descMatch ? descMatch[1].replace(/<[^>]*>/g, '').trim() : '';
      
      // Extract gallery images
      const gallery = [];
      const imageMatches = detailContent.matchAll(/<img[^>]+src="([^"]+)"/g);
      for (const match of imageMatches) {
        if (!match[1].includes('.svg')) { // Skip icon files
          gallery.push(match[1]);
        }
      }
      project.gallery = gallery.length > 0 ? gallery : [project.image];
      
      // Extract responsibilities
      const responsibilities = [];
      const respSection = detailContent.match(/Main responsibilit[^<]*<\/h1>\s*<ul[^>]*>([\s\S]*?)<\/ul>/i);
      if (respSection) {
        const respItems = respSection[1].matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g);
        for (const item of respItems) {
          const text = item[1].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
          if (text && text.length > 5) responsibilities.push(text);
        }
      }
      project.responsibilities = responsibilities;
      
      // Extract achievements
      const achievements = [];
      const achSection = detailContent.match(/Achievement[^<]*<\/h1>\s*<ul[^>]*>([\s\S]*?)<\/ul>/i);
      if (achSection) {
        const achItems = achSection[1].matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g);
        for (const item of achItems) {
          const text = item[1].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
          if (text && text.length > 5) achievements.push(text);
        }
      }
      project.achievements = achievements;
      
      // Extract store links
      const storeLinks = {};
      const playStoreMatch = detailContent.match(/href="(https:\/\/play\.google\.com\/store\/apps\/details[^"]+)"/);
      const appStoreMatch = detailContent.match(/href="(https:\/\/apps\.apple\.com\/[^"]+)"/);
      
      if (playStoreMatch) storeLinks.android = playStoreMatch[1];
      if (appStoreMatch) storeLinks.ios = appStoreMatch[1];
      
      if (Object.keys(storeLinks).length > 0) {
        project.storeLinks = storeLinks;
      }
      
      // Extract website (non-store links)
      const websiteMatches = detailContent.matchAll(/<a class="service-item"[^>]*href="(https?:\/\/[^"]+)"/g);
      for (const match of websiteMatches) {
        const url = match[1];
        if (!url.includes('play.google.com') && !url.includes('apps.apple.com')) {
          project.website = url;
          break;
        }
      }
    } else {
      // Provide defaults if no detail section
      project.timeline = '';
      project.description = '';
      project.gallery = [project.image];
      project.responsibilities = [];
      project.achievements = [];
    }
    
    return project;
    
  } catch (error) {
    console.log(`❌ Error processing ${projectId}: ${error.message}`);
    return null;
  }
}

// Main execution
const sidebar = extractSidebarInfo();
console.log(`📁 Sidebar: ${sidebar ? '✅' : '❌'}`);

const projects = [];
console.log(`🎯 Extracting ${projectIds.length} projects...\n`);

projectIds.forEach((projectId, index) => {
  console.log(`${index + 1}. Processing ${projectId}...`);
  const project = extractProjectByID(projectId);
  if (project) {
    projects.push(project);
    const sensorTower = project.sensorTowerLinks ? ' 📊' : '';
    const storeLinks = project.storeLinks ? ' 🔗' : '';
    const website = project.website ? ' 🌐' : '';
    console.log(`   ✅ ${project.title} (${project.category})${sensorTower}${storeLinks}${website}`);
    console.log(`      Gallery: ${project.gallery?.length || 0}, Resp: ${project.responsibilities?.length || 0}, Ach: ${project.achievements?.length || 0}`);
  }
});

const portfolioData = {
  sidebar,
  projects
};

// Save to file
fs.writeFileSync('./portfolio-data-complete.json', JSON.stringify(portfolioData, null, 2));

console.log('\n✨ Portfolio data extraction completed!');
console.log(`📊 Total projects extracted: ${projects.length}/${projectIds.length}`);
console.log(`🖼️  Projects with SensorTower: ${projects.filter(p => p.sensorTowerLinks).length}`);
console.log(`🔗 Projects with store links: ${projects.filter(p => p.storeLinks).length}`);
console.log(`🌐 Projects with websites: ${projects.filter(p => p.website).length}`);

// Show summary by category
console.log('\n📋 Projects by category:');
const categoryCount = {};
projects.forEach(p => {
  categoryCount[p.category] = (categoryCount[p.category] || 0) + 1;
});
Object.entries(categoryCount).forEach(([cat, count]) => {
  console.log(`   ${cat}: ${count} projects`);
});

console.log('\n✅ Complete portfolio data saved to portfolio-data-complete.json');

process.exit(0);
