const fs = require('fs');

// Read the HTML file
const htmlContent = fs.readFileSync('./public/v2.0/index.html', 'utf8');

console.log('🔍 Debugging project extraction...\n');

// Check if we can find the project list section
const projectListRegex = /<!-- Project Thumbnail -->\s*<ul class="project-list">([\s\S]*?)<\/ul>/;
const projectListMatch = htmlContent.match(projectListRegex);

if (!projectListMatch) {
  console.log('❌ Could not find project list section');
  
  // Try to find any project-related sections
  const altRegex1 = /<ul class="project-list">/;
  const altMatch1 = htmlContent.match(altRegex1);
  console.log('Alt regex 1 (project-list):', !!altMatch1);
  
  const altRegex2 = /<!-- Project Thumbnail -->/;
  const altMatch2 = htmlContent.match(altRegex2);
  console.log('Alt regex 2 (Project Thumbnail comment):', !!altMatch2);
  
  // Look for any project items
  const projectItemRegex = /<li class="project-item/g;
  const projectItems = htmlContent.match(projectItemRegex);
  console.log('Found project-item elements:', projectItems ? projectItems.length : 0);
  
} else {
  console.log('✅ Found project list section');
  const projectListContent = projectListMatch[1];
  console.log('Project list content length:', projectListContent.length);
  
  // Try to extract project items
  const projectItemRegex = /<li class="project-item[^>]*data-category="([^"]+)"[^>]*>([\s\S]*?)<\/li>/g;
  const items = [];
  let match;
  while ((match = projectItemRegex.exec(projectListContent)) !== null) {
    items.push({
      category: match[1],
      content: match[2].substring(0, 200) + '...' // First 200 chars
    });
  }
  
  console.log('Extracted project items:', items.length);
  items.forEach((item, index) => {
    console.log(`${index + 1}. Category: ${item.category}`);
    console.log(`   Content preview: ${item.content.replace(/\n/g, ' ')}`);
  });
}
