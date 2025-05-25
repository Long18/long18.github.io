const fs = require('fs');

// Read the extracted portfolio data
const portfolioData = JSON.parse(fs.readFileSync('./portfolio-data-complete.json', 'utf8'));

console.log('🔍 PORTFOLIO DATA VALIDATION & SUMMARY\n');
console.log('=' .repeat(50));

// Validate sidebar data
console.log('📄 SIDEBAR INFORMATION:');
console.log(`   Name: ${portfolioData.sidebar.name}`);
console.log(`   Alias: ${portfolioData.sidebar.alias}`);
console.log(`   Email: ${portfolioData.sidebar.email}`);
console.log(`   Phone: ${portfolioData.sidebar.phone}`);
console.log(`   Location: ${portfolioData.sidebar.location}`);
console.log(`   Social Links: ${Object.keys(portfolioData.sidebar.socials).length} platforms`);

console.log('\n📊 PROJECT STATISTICS:');
console.log(`   Total Projects: ${portfolioData.projects.length}`);

// Category breakdown
const categoryCount = {};
portfolioData.projects.forEach(project => {
  categoryCount[project.category] = (categoryCount[project.category] || 0) + 1;
});

console.log('   Category Distribution:');
Object.entries(categoryCount).forEach(([category, count]) => {
  const percentage = ((count / portfolioData.projects.length) * 100).toFixed(1);
  console.log(`     ${category}: ${count} projects (${percentage}%)`);
});

// Projects with store links
const projectsWithStoreLinks = portfolioData.projects.filter(p => p.storeLinks);
console.log(`   Projects with Store Links: ${projectsWithStoreLinks.length}`);

// Projects with websites  
const projectsWithWebsites = portfolioData.projects.filter(p => p.website);
console.log(`   Projects with Websites: ${projectsWithWebsites.length}`);

// Gallery image count
const totalImages = portfolioData.projects.reduce((sum, project) => sum + project.gallery.length, 0);
console.log(`   Total Gallery Images: ${totalImages}`);

// Projects with SensorTower data (download stats in achievements)
const projectsWithDownloads = portfolioData.projects.filter(p => 
  p.achievements.some(achievement => achievement.toLowerCase().includes('downloads'))
);
console.log(`   Projects with Download Stats: ${projectsWithDownloads.length}`);

console.log('\n🎯 FEATURED PROJECTS (with store links):');
projectsWithStoreLinks.forEach(project => {
  console.log(`   ${project.title} (${project.category})`);
  if (project.storeLinks.android) console.log(`     Android: ✅`);
  if (project.storeLinks.ios) console.log(`     iOS: ✅`);
  
  // Check for download stats
  const downloadAchievements = project.achievements.filter(a => 
    a.toLowerCase().includes('downloads')
  );
  if (downloadAchievements.length > 0) {
    console.log(`     Download Stats: ${downloadAchievements.length} milestone(s)`);
  }
});

console.log('\n🏷️ TECHNOLOGY TAGS:');
const allTags = new Set();
portfolioData.projects.forEach(project => {
  project.tags.forEach(tag => allTags.add(tag.label));
});
console.log(`   Unique Technologies: ${allTags.size}`);
Array.from(allTags).sort().forEach(tag => {
  console.log(`     ${tag}`);
});

console.log('\n📈 PROJECT COMPLEXITY:');
portfolioData.projects.forEach(project => {
  console.log(`   ${project.title}:`);
  console.log(`     Gallery: ${project.gallery.length} images`);
  console.log(`     Responsibilities: ${project.responsibilities.length} items`);
  console.log(`     Achievements: ${project.achievements.length} items`);
});

console.log('\n✅ VALIDATION COMPLETE');
console.log('📁 Data ready for Next.js implementation');
console.log(`📊 File size: ${(fs.statSync('./portfolio-data-complete.json').size / 1024).toFixed(1)}KB`);
