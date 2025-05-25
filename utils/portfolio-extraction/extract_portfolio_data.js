const fs = require('fs');
const path = require('path');

// Read the HTML file
const htmlContent = fs.readFileSync('/Users/long.lnt/Desktop/Projects/long18.github.io/public/v2.0/index.html', 'utf-8');

// Technology tag color mapping
const tagColorMap = {
  'Unity': 'bg-gray-800 text-white',
  'Unreal Engine': 'bg-purple-700 text-white',
  'React': 'bg-blue-600 text-white',
  'App Development': 'bg-green-600 text-white',
  'AR/VR': 'bg-pink-600 text-white',
  'C++': 'bg-red-700 text-white',
  'JavaScript': 'bg-yellow-500 text-black',
  'Android': 'bg-lime-600 text-white',
  'iOS': 'bg-indigo-600 text-white',
  'Android Studio': 'bg-green-600 text-white' // Default for app development
};

// Extract sidebar information
function extractSidebarInfo() {
  const sidebar = {};
  
  // Extract name
  const nameMatch = htmlContent.match(/<h1 class="realname"[^>]*>([^<]+)<\/h1>/);
  const aliasMatch = htmlContent.match(/<h1 class="name"[^>]*>([^<]+)<\/h1>/);
  
  sidebar.name = nameMatch ? nameMatch[1] : '';
  sidebar.alias = aliasMatch ? aliasMatch[1] : '';
  
  // Extract avatar
  const avatarMatch = htmlContent.match(/<img src="([^"]*)" alt="[^"]*" width="80">/);
  sidebar.avatar = avatarMatch ? avatarMatch[1] : '';
  
  // Extract contact info
  const emailMatch = htmlContent.match(/<a href="mailto:([^"]*)"[^>]*>/);
  const phoneMatch = htmlContent.match(/<a href="tel:([^"]*)"[^>]*>/);
  const birthdayMatch = htmlContent.match(/<time datetime="([^"]*)">/);
  const locationMatch = htmlContent.match(/<address>([^<]+)<\/address>/);
  
  sidebar.email = emailMatch ? emailMatch[1] : '';
  sidebar.phone = phoneMatch ? phoneMatch[1] : '';
  sidebar.birthday = birthdayMatch ? birthdayMatch[1] : '';
  sidebar.location = locationMatch ? locationMatch[1] : '';
  
  // Extract social links
  sidebar.socials = {};
  const socialMatches = htmlContent.matchAll(/<a href="([^"]*)"[^>]*>\s*<ion-icon name="logo-([^"]*)"[^>]*><\/ion-icon>/g);
  for (const match of socialMatches) {
    const platform = match[2];
    sidebar.socials[platform] = match[1];
  }
  
  return sidebar;
}

// Extract project list
function extractProjects() {
  const projects = [];
  
  // Find all project items in the main project list - improved regex
  const projectItemRegex = /<li class="project-item[^>]*data-category="([^"]*)"[^>]*>([\s\S]*?)<\/li>/g;
  const projectMatches = htmlContent.matchAll(projectItemRegex);
  
  for (const match of projectMatches) {
    const category = match[1];
    const projectHtml = match[2];
    
    // Extract project ID from data-detail-category
    const projectIdMatch = projectHtml.match(/data-detail-category="([^"]*)"/);
    if (!projectIdMatch) continue;
    
    const projectId = projectIdMatch[1];
    const project = { id: projectId };
    
    // Extract title
    const titleMatch = projectHtml.match(/<h3 class="project-title"[^>]*>([^<]+)<\/h3>/);
    project.title = titleMatch ? titleMatch[1].trim() : '';
    
    // Extract image
    const imageMatch = projectHtml.match(/<img src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/);
    project.image = imageMatch ? imageMatch[1] : '';
    
    // Extract category from tag
    const categoryMatch = projectHtml.match(/<p class="project-category tag">([^<]+)<\/p>/);
    const categoryName = categoryMatch ? categoryMatch[1].trim() : category;
    
    // Set category
    project.category = category;
    
    // Set technology tags
    project.tags = [{
      label: categoryName,
      colorClass: tagColorMap[categoryName] || 'bg-gray-600 text-white'
    }];
    
    // Extract SensorTower links if present (from parent li element)
    const parentLiMatch = htmlContent.match(new RegExp(`<li class="project-item[^>]*data-category="${category}"[^>]*data-api-url-android="([^"]*)"[^>]*data-api-url-ios="([^"]*)"[^>]*>`, 'g'));
    
    const sensorTowerAndroidMatch = projectHtml.match(/data-api-url-android="([^"]*)"/);
    const sensorTowerIosMatch = projectHtml.match(/data-api-url-ios="([^"]*)"/);
    
    // Also check the parent element which might contain the sensor tower data
    const parentElementRegex = new RegExp(`<li[^>]*data-detail-category="${projectId}"[^>]*>(.*?)<\\/li>`, 's');
    const parentMatch = htmlContent.match(parentElementRegex);
    
    if (parentMatch) {
      const parentHtml = parentMatch[0];
      const androidApiMatch = parentHtml.match(/data-api-url-android="([^"]*)"/);
      const iosApiMatch = parentHtml.match(/data-api-url-ios="([^"]*)"/);
      
      if (androidApiMatch || iosApiMatch) {
        project.sensorTowerLinks = {};
        if (androidApiMatch) {
          project.sensorTowerLinks.android = androidApiMatch[1];
        }
        if (iosApiMatch) {
          project.sensorTowerLinks.ios = iosApiMatch[1];
        }
      }
    }
    
    projects.push(project);
  }
  
  return projects;
}

// Extract detailed project information
function extractProjectDetails(projects) {
  const detailedProjects = projects.map(project => {
    // Find the project detail section
    const detailRegex = new RegExp(`<section[^>]*data-detail-category="${project.id}"[^>]*>(.*?)<\/section>`, 's');
    const detailMatch = htmlContent.match(detailRegex);
    
    if (!detailMatch) {
      return project;
    }
    
    const detailHtml = detailMatch[1];
    
    // Extract gallery images
    const galleryImages = [];
    const imageMatches = detailHtml.matchAll(/<img src="([^"]*)"[^>]*loading="lazy"[^>]*alt="([^"]*)"[^>]*\/>/g);
    for (const match of imageMatches) {
      galleryImages.push(match[1]);
    }
    project.gallery = galleryImages;
    
    // Extract timeline
    const timelineMatch = detailHtml.match(/<span>([^<]+)<\/span>/);
    project.timeline = timelineMatch ? timelineMatch[1].trim() : '';
    
    // Extract description (team composition and main description)
    const descriptions = [];
    const descriptionMatches = detailHtml.matchAll(/<p class="timeline-text description">\s*(.*?)\s*<\/p>/gs);
    for (const match of descriptionMatches) {
      const desc = match[1].replace(/<[^>]*>/g, '').trim();
      if (desc && !desc.includes('Task Management:') && !desc.includes('Agile Process:')) {
        descriptions.push(desc);
      }
    }
    project.description = descriptions.join(' ');
    
    // Extract responsibilities
    const responsibilities = [];
    let inResponsibilities = false;
    const responsibilityMatches = detailHtml.matchAll(/<li class="timeline-description">\s*<p class="timeline-text description">\s*(.*?)\s*<\/p>\s*<\/li>/gs);
    
    // Look for "Main responsibilities:" section
    const responsibilitySection = detailHtml.match(/<h1 class="h4 timeline-item-title">Main responsibilities:<\/h1>\s*<ul class="timeline-description-list">(.*?)<\/ul>/s);
    if (responsibilitySection) {
      const respMatches = responsibilitySection[1].matchAll(/<p class="timeline-text description">\s*(.*?)\s*<\/p>/gs);
      for (const match of respMatches) {
        const resp = match[1].replace(/<[^>]*>/g, '').trim();
        if (resp) {
          responsibilities.push(resp);
        }
      }
    }
    project.responsibilities = responsibilities;
    
    // Extract achievements
    const achievements = [];
    const achievementSection = detailHtml.match(/<h1 class="h4 timeline-item-title">Achievements:<\/h1>\s*<ul class="timeline-description-list">(.*?)<\/ul>/s);
    if (achievementSection) {
      const achMatches = achievementSection[1].matchAll(/<p class="timeline-text description">\s*(.*?)\s*<\/p>/gs);
      for (const match of achMatches) {
        const ach = match[1].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
        if (ach) {
          achievements.push(ach);
        }
      }
    }
    project.achievements = achievements;
    
    // Extract store links
    const storeLinks = {};
    const googlePlayMatch = detailHtml.match(/<a class="service-item" href="(https:\/\/play\.google\.com[^"]*)"[^>]*>/);
    const appStoreMatch = detailHtml.match(/<a class="service-item" href="(https:\/\/apps\.apple\.com[^"]*)"[^>]*>/);
    
    if (googlePlayMatch) {
      storeLinks.android = googlePlayMatch[1];
    }
    if (appStoreMatch) {
      storeLinks.ios = appStoreMatch[1];
    }
    
    if (Object.keys(storeLinks).length > 0) {
      project.storeLinks = storeLinks;
    }
    
    return project;
  });
  
  return detailedProjects;
}

// Main execution
function main() {
  console.log('Extracting portfolio data from HTML...\n');
  
  const sidebar = extractSidebarInfo();
  const projects = extractProjects();
  const detailedProjects = extractProjectDetails(projects);
  
  const portfolioData = {
    sidebar,
    projects: detailedProjects
  };
  
  // Output the structured data
  console.log('=== EXTRACTED PORTFOLIO DATA ===\n');
  console.log(JSON.stringify(portfolioData, null, 2));
  
  // Save to file
  fs.writeFileSync('/Users/long.lnt/Desktop/Projects/long18.github.io/extracted_portfolio_data.json', JSON.stringify(portfolioData, null, 2));
  console.log('\n=== Data saved to extracted_portfolio_data.json ===');
}

main();
