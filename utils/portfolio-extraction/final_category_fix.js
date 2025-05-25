const fs = require('fs');

// Read existing data
const existingData = JSON.parse(fs.readFileSync('./portfolio-data-complete.json', 'utf8'));

console.log('🔧 Manually fixing project categories based on HTML analysis...\n');

// Based on the grep search results and HTML analysis, here are the correct mappings:
const categoryMapping = {
  'heroicDefense': 'unity',
  'iceBreakingBattle': 'unity',
  'metameAmusementPark': 'unreal',
  'cryptoquest': 'unity',
  'fireFireFire': 'unity',
  'rpgRun': 'unity',
  'betakuma': 'unity',
  'mugenHorror': 'unity',
  'matchingCasino': 'unity',
  'pinoRacing': 'unity',
  'hutingAnimal': 'unity',
  'toiletTapTap': 'unity',
  'doggyMovement': 'unity',
  'homeWithGrandma': 'unity',
  'ffats': 'applications',
  'fitnessCare': 'applications'
};

// Update existing data
existingData.projects.forEach(project => {
  if (categoryMapping[project.id]) {
    project.category = categoryMapping[project.id];
    console.log(`✅ Updated ${project.id}: ${categoryMapping[project.id]}`);
  } else {
    console.log(`❌ No category mapping for ${project.id}`);
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

console.log(`\n🎯 Total projects: ${existingData.projects.length}`);
console.log(`📊 Unity projects: ${categorySummary.unity || 0}`);
console.log(`🎮 Unreal projects: ${categorySummary.unreal || 0}`);
console.log(`📱 Application projects: ${categorySummary.applications || 0}`);
