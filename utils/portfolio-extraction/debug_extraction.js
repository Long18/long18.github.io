const fs = require('fs');

// Read the HTML file
const htmlContent = fs.readFileSync('./public/v2.0/index.html', 'utf8');

console.log('🔍 Debugging project extraction...\n');

// Get the main project list section
const startMarker = '<!-- Project Thumbnail -->';
const startIndex = htmlContent.indexOf(startMarker);
const projectListStart = htmlContent.indexOf('<ul class="project-list">', startIndex);
const projectListEnd = htmlContent.indexOf('</ul>', projectListStart);

const projectListContent = htmlContent.substring(projectListStart, projectListEnd);
console.log('✅ Found main project list section');

// Split by project items
const parts = projectListContent.split('<li class="project-item');
console.log(`🔢 Found ${parts.length - 1} project parts`);

for (let i = 1; i <= Math.min(5, parts.length - 1); i++) {
  console.log(`\n--- Processing Project ${i} ---`);
  const projectHtml = '<li class="project-item' + parts[i];
  
  // Show first 200 chars of the project HTML
  console.log('HTML Preview:', projectHtml.substring(0, 200) + '...');
  
  // Check for required attributes
  const categoryMatch = projectHtml.match(/data-category="([^"]+)"/);
  console.log('Category:', categoryMatch ? categoryMatch[1] : 'NOT FOUND');
  
  const detailCategoryMatch = projectHtml.match(/data-detail-category="([^"]+)"/);
  console.log('Detail Category:', detailCategoryMatch ? detailCategoryMatch[1] : 'NOT FOUND');
  
  const titleMatch = projectHtml.match(/<h3 class="project-title"[^>]*>([^<]+)<\/h3>/);
  console.log('Title:', titleMatch ? titleMatch[1] : 'NOT FOUND');
  
  const imageMatch = projectHtml.match(/<img src="([^"]+)"[^>]*>/);
  console.log('Image:', imageMatch ? imageMatch[1].substring(0, 50) + '...' : 'NOT FOUND');
  
  // Check if all required fields are present
  const hasRequired = categoryMatch && detailCategoryMatch && titleMatch && imageMatch;
  console.log('Has All Required Fields:', hasRequired ? 'YES' : 'NO');
}
