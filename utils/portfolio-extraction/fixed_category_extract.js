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

console.log('🔧 Fixing category extraction...\n');

// Extract project categories from thumbnail section
function extractProjectCategories() {
  const categories = {};
  
  // Look for project items in thumbnail section
  const projectItemRegex = /<li class="project-item[^"]*"[^>]*data-category="([^"]*)"[^>]*data-detail-category="([^"]*)"[^>]*>/g;
  
  let match;
  while ((match = projectItemRegex.exec(htmlContent)) !== null) {
    const category = match[1];
    const projectId = match[2];
    
    if (projectIds.includes(projectId)) {
      categories[projectId] = category;
      console.log(`  ${projectId}: ${category}`);
    }
  }
  
  return categories;
}

console.log('📂 Extracting categories...');
const projectCategories = extractProjectCategories();

console.log(`\n✅ Found categories for ${Object.keys(projectCategories).length} projects`);

// Read existing data and update categories
const existingData = JSON.parse(fs.readFileSync('./portfolio-data-complete.json', 'utf8'));

existingData.projects.forEach(project => {
  if (projectCategories[project.id]) {
    project.category = projectCategories[project.id];
    console.log(`✅ Updated ${project.id}: ${projectCategories[project.id]}`);
  }
});

// Write updated data
fs.writeFileSync('./portfolio-data-fixed.json', JSON.stringify(existingData, null, 2));

console.log('\n🎉 Categories fixed and saved to portfolio-data-fixed.json');

// Summary
const categorySummary = {};
existingData.projects.forEach(project => {
  if (!categorySummary[project.category]) {
    categorySummary[project.category] = 0;
  }
  categorySummary[project.category]++;
});

console.log('\n📊 Category distribution:');
Object.entries(categorySummary).forEach(([category, count]) => {
  console.log(`   ${category}: ${count} projects`);
});
