const fs = require('fs');

// Read files
const htmlContent = fs.readFileSync('./public/v2.0/index.html', 'utf8');
const existingData = JSON.parse(fs.readFileSync('./portfolio-data-complete.json', 'utf8'));

console.log('🔧 Fixing project categories...\n');

// Extract categories by finding project-item elements with data-category and data-detail-category
const projectCategoryRegex = /data-category="([^"]*)"[\s\S]*?data-detail-category="([^"]*)"/g;
const categories = {};

let match;
while ((match = projectCategoryRegex.exec(htmlContent)) !== null) {
  const category = match[1];
  const projectId = match[2];
  categories[projectId] = category;
  console.log(`✅ ${projectId}: ${category}`);
}

console.log(`\n📊 Found ${Object.keys(categories).length} project categories`);

// Update existing data
existingData.projects.forEach(project => {
  if (categories[project.id]) {
    project.category = categories[project.id];
    console.log(`🔄 Updated ${project.id}: ${categories[project.id]}`);
  } else {
    console.log(`❌ No category found for ${project.id}`);
  }
});

// Write updated data
fs.writeFileSync('./portfolio-data-final.json', JSON.stringify(existingData, null, 2));

console.log('\n✨ Categories updated and saved to portfolio-data-final.json');

// Show final category summary
const categorySummary = {};
existingData.projects.forEach(project => {
  if (!categorySummary[project.category]) {
    categorySummary[project.category] = 0;
  }
  categorySummary[project.category]++;
});

console.log('\n📋 Final category distribution:');
Object.entries(categorySummary).forEach(([category, count]) => {
  console.log(`   ${category}: ${count} projects`);
});
