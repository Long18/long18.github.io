const fs = require('fs');

// Read files
const htmlContent = fs.readFileSync('./public/v2.0/index.html', 'utf8');

console.log('🔍 Debugging category extraction...\n');

// Let's search for specific patterns around heroicDefense
const heroicDefenseMatch = htmlContent.match(/data-category="[^"]*"[\s\S]*?data-detail-category="heroicDefense"/);
if (heroicDefenseMatch) {
  console.log('✅ Found heroicDefense pattern:');
  console.log(heroicDefenseMatch[0]);
} else {
  console.log('❌ Could not find heroicDefense pattern');
}

// Let's try a different approach - search for the specific line patterns
const lines = htmlContent.split('\n');
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('data-category=') && line.includes('data-detail-category=')) {
    console.log(`\nLine ${i + 1}:`);
    console.log(line.trim());
    
    // Extract category and project ID from this line
    const categoryMatch = line.match(/data-category="([^"]*)"/);
    const projectMatch = line.match(/data-detail-category="([^"]*)"/);
    
    if (categoryMatch && projectMatch) {
      console.log(`  Category: ${categoryMatch[1]}`);
      console.log(`  Project: ${projectMatch[1]}`);
    }
  }
}
