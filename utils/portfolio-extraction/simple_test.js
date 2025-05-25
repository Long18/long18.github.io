const fs = require('fs');

console.log('🚀 Starting simple extraction test...');

try {
  // Read the HTML file
  console.log('📖 Reading HTML file...');
  const htmlContent = fs.readFileSync('./public/v2.0/index.html', 'utf8');
  console.log(`📏 HTML file length: ${htmlContent.length} characters`);
  
  // Find project thumbnail marker
  console.log('🔍 Looking for project thumbnail marker...');
  const startMarker = '<!-- Project Thumbnail -->';
  const startIndex = htmlContent.indexOf(startMarker);
  console.log(`📍 Project thumbnail marker found at: ${startIndex}`);
  
  if (startIndex !== -1) {
    // Find project list start
    console.log('🔍 Looking for project list start...');
    const projectListStart = htmlContent.indexOf('<ul class="project-list">', startIndex);
    console.log(`📍 Project list start found at: ${projectListStart}`);
    
    if (projectListStart !== -1) {
      // Find project list end
      console.log('🔍 Looking for project list end...');
      const projectListEnd = htmlContent.indexOf('</ul>', projectListStart);
      console.log(`📍 Project list end found at: ${projectListEnd}`);
      
      if (projectListEnd !== -1) {
        const projectListContent = htmlContent.substring(projectListStart, projectListEnd);
        console.log(`📏 Project list content length: ${projectListContent.length} characters`);
        
        // Count project items using simple method
        const projectItemCount = (projectListContent.match(/<li class="project-item/g) || []).length;
        console.log(`🔢 Found ${projectItemCount} project items`);
        
        console.log('✅ Basic extraction test completed successfully');
      }
    }
  }
  
} catch (error) {
  console.error('❌ Error during extraction:', error.message);
}

console.log('🏁 Script finished');
process.exit(0);
