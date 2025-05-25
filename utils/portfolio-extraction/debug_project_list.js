const fs = require('fs');

// Read the HTML file
const htmlContent = fs.readFileSync('./public/v2.0/index.html', 'utf8');

console.log('🔍 Debugging project list content...\n');

// Find the main project list section (first occurrence)
const projectListRegex = /<ul class="project-list">([\s\S]*?)<\/ul>/;
const projectListMatch = htmlContent.match(projectListRegex);

if (!projectListMatch) {
  console.log('❌ Could not find project list section');
} else {
  console.log('✅ Found project list section');
  const projectListContent = projectListMatch[1];
  console.log('📏 Project list content length:', projectListContent.length);
  
  // Count project items
  const projectItemMatches = projectListContent.match(/<li class="project-item[^>]*>/g);
  console.log('🔢 Number of project-item elements found:', projectItemMatches ? projectItemMatches.length : 0);
  
  // Show first few project items
  const projectItemRegex = /<li class="project-item[^>]*data-category="([^"]+)"[^>]*>([\s\S]*?)<\/li>/g;
  
  let match;
  let count = 0;
  while ((match = projectItemRegex.exec(projectListContent)) !== null && count < 5) {
    const [fullMatch, category, content] = match;
    console.log(`\n${count + 1}. Category: ${category}`);
    
    // Extract title
    const titleMatch = content.match(/<h3 class="project-title"[^>]*>([^<]+)<\/h3>/);
    console.log(`   Title: ${titleMatch ? titleMatch[1] : 'NOT FOUND'}`);
    
    // Extract project ID
    const projectIdMatch = content.match(/data-detail-category="([^"]+)"/);
    console.log(`   ID: ${projectIdMatch ? projectIdMatch[1] : 'NOT FOUND'}`);
    
    count++;
  }
  
  // Show where our regex stopped
  console.log(`\n⚠️  Processed ${count} projects out of potentially ${projectItemMatches ? projectItemMatches.length : 0}`);
}
