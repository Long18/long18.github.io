# Project Templates

This document provides templates for adding new projects to the portfolio. Use these templates to maintain consistency across all project entries.

## HTML Template for New Projects

Add this structure to `/public/v2.0/index.html` in the projects section:

```html
<!-- Project Template - Copy and modify for new projects -->
<div class="project-item" data-category="unity" data-id="newProjectId">
  <div class="project-sidebar">
    <div class="project-thumbnail">
      <img
        src="https://github.com/user-attachments/assets/your-thumbnail-url"
        alt="Project Name"
      />
    </div>
    <div class="project-meta">
      <h3>Project Name</h3>
      <p class="project-category">Unity Game</p>
      <p class="project-timeline">Jan 2025 - Mar 2025</p>

      <!-- Technology Tags -->
      <div class="tech-tags">
        <span class="tag unity">Unity</span>
        <span class="tag csharp">C#</span>
        <span class="tag mobile">Mobile</span>
        <!-- Add more relevant tags -->
      </div>

      <!-- Store Links (if applicable) -->
      <div class="store-links">
        <a
          href="https://play.google.com/store/apps/details?id=com.yourapp"
          class="store-link android"
        >
          <img src="/assets/images/GooglePlay-Icon.svg" alt="Google Play" />
          Google Play
        </a>
        <a
          href="https://apps.apple.com/app/yourapp/id123456789"
          class="store-link ios"
        >
          <img src="/assets/images/AppStore-Icons.svg" alt="App Store" />
          App Store
        </a>
      </div>

      <!-- Website Link (if applicable) -->
      <div class="website-link">
        <a href="https://yourproject.com" target="_blank"> Visit Website </a>
      </div>
    </div>
  </div>

  <div class="project-content">
    <div class="project-description">
      <p>
        Detailed description of your project. Explain what it is, its main
        features, target audience, and what makes it unique. Include gameplay
        mechanics, user experience highlights, and technical achievements.
      </p>
    </div>

    <div class="project-gallery">
      <img
        src="https://github.com/user-attachments/assets/screenshot1-url"
        alt="Project Screenshot 1"
      />
      <img
        src="https://github.com/user-attachments/assets/screenshot2-url"
        alt="Project Screenshot 2"
      />
      <img
        src="https://github.com/user-attachments/assets/screenshot3-url"
        alt="Project Screenshot 3"
      />
      <!-- Add more screenshots as needed -->
    </div>

    <div class="project-responsibilities">
      <h4>Responsibilities</h4>
      <ul>
        <li>Game design and mechanics implementation</li>
        <li>UI/UX design and development</li>
        <li>Performance optimization</li>
        <li>Platform integration (iOS/Android)</li>
        <!-- Add your specific responsibilities -->
      </ul>
    </div>

    <div class="project-achievements">
      <h4>Key Achievements</h4>
      <ul>
        <li>Successfully launched on multiple platforms</li>
        <li>Achieved X downloads in first month</li>
        <li>Implemented innovative gameplay feature</li>
        <li>Optimized performance for older devices</li>
        <!-- Add your specific achievements -->
      </ul>
    </div>

    <!-- SensorTower Stats (if applicable) -->
    <div class="sensortower-stats">
      <p><strong>Download Stats:</strong></p>
      <ul>
        <li>iOS Downloads: X,XXX</li>
        <li>Android Downloads: X,XXX</li>
        <li>Total Downloads: X,XXX</li>
      </ul>
    </div>
  </div>
</div>
```

## TypeScript Interface Template

When adding new fields to projects, update `/src/types/portfolio.ts`:

```typescript
export interface Project {
  id: string; // camelCase, unique identifier
  title: string; // Display name
  category: 'unity' | 'unreal' | 'applications' | 'web'; // Add new categories as needed
  image: string; // Main thumbnail URL
  tags: TechnologyTag[]; // Technology stack
  timeline: string; // Development period
  description: string; // Project description
  gallery: string[]; // Image gallery URLs
  responsibilities: string[]; // Your role/tasks
  achievements: string[]; // Key accomplishments
  storeLinks?: StoreLinks; // App store links
  website?: string; // Project website
  // Add new fields here as needed
  downloadStats?: {
    // Example new field
    ios?: number;
    android?: number;
    total?: number;
  };
}
```

## Asset Path Template

Add new project assets to `/src/data/assetPaths.ts`:

```typescript
// Add to projectThumbnails
export const projectThumbnails = {
  // ...existing projects...
  newProjectId: 'https://github.com/user-attachments/assets/your-thumbnail-url',
};

// Add to projectGalleries
export const projectGalleries = {
  // ...existing projects...
  newProjectId: [
    'https://github.com/user-attachments/assets/screenshot1-url',
    'https://github.com/user-attachments/assets/screenshot2-url',
    'https://github.com/user-attachments/assets/screenshot3-url',
  ],
};

// Add to externalLinks (if applicable)
export const externalLinks = {
  playStore: {
    // ...existing projects...
    newProjectId: 'https://play.google.com/store/apps/details?id=com.yourapp',
  },
  appStore: {
    // ...existing projects...
    newProjectId: 'https://apps.apple.com/app/yourapp/id123456789',
  },
  websites: {
    // ...existing projects...
    newProjectId: 'https://yourproject.com',
  },
};
```

## Technology Tag Reference

Use these predefined tags for consistency:

### Game Engines

- `unity` - Unity Engine
- `unreal` - Unreal Engine
- `godot` - Godot Engine

### Programming Languages

- `csharp` - C#
- `cpp` - C++
- `javascript` - JavaScript
- `typescript` - TypeScript
- `python` - Python
- `java` - Java
- `kotlin` - Kotlin
- `swift` - Swift

### Platforms

- `mobile` - Mobile Platforms
- `ios` - iOS
- `android` - Android
- `windows` - Windows
- `macos` - macOS
- `linux` - Linux
- `web` - Web Browser
- `webgl` - WebGL

### Technologies

- `react` - React
- `nextjs` - Next.js
- `nodejs` - Node.js
- `firebase` - Firebase
- `mongodb` - MongoDB
- `postgresql` - PostgreSQL
- `docker` - Docker
- `aws` - Amazon Web Services

### Game Genres

- `tower-defense` - Tower Defense
- `puzzle` - Puzzle Game
- `action` - Action Game
- `adventure` - Adventure Game
- `simulation` - Simulation
- `strategy` - Strategy Game
- `casual` - Casual Game
- `racing` - Racing Game
- `rpg` - Role-Playing Game

## Project Category Guidelines

### Unity Projects

- Use `category: "unity"`
- Include Unity-specific tags
- Mention C# scripting
- Highlight mobile optimization if applicable

### Unreal Projects

- Use `category: "unreal"`
- Include Unreal Engine tags
- Mention Blueprint/C++ usage
- Highlight rendering features

### Application Projects

- Use `category: "applications"`
- Focus on user experience
- Mention frameworks used
- Highlight practical utility

## Image Guidelines

### Thumbnails

- **Size**: 800x600px minimum
- **Format**: PNG or JPG
- **Quality**: High quality, well-lit
- **Content**: Show main UI or gameplay

### Gallery Images

- **Variety**: Show different aspects of the project
- **Quality**: High resolution
- **Context**: Include UI, gameplay, features
- **Count**: 3-8 images recommended

### Upload Process

1. Upload images to GitHub repository
2. Use GitHub's attachment URLs
3. Test all URLs before committing
4. Provide meaningful alt text

## Validation Checklist

Before adding a new project, ensure:

- [ ] Unique project ID (camelCase)
- [ ] All required fields filled
- [ ] Valid image URLs
- [ ] Consistent technology tags
- [ ] Proper category assignment
- [ ] Meaningful descriptions
- [ ] Working store/website links
- [ ] Proper HTML structure
- [ ] TypeScript interfaces updated

## Testing New Projects

After adding a new project:

```bash
# Extract and validate data
npm run portfolio:extract

# Check for TypeScript errors
npm run type-check

# Validate all data
npm run portfolio:check

# Test in development
npm run dev
```

## Example Complete Project Entry

```html
<div class="project-item" data-category="unity" data-id="myNewGame">
  <div class="project-sidebar">
    <div class="project-thumbnail">
      <img
        src="https://github.com/user-attachments/assets/abc123-thumbnail"
        alt="My New Game"
      />
    </div>
    <div class="project-meta">
      <h3>My New Game</h3>
      <p class="project-category">Unity Game</p>
      <p class="project-timeline">Jan 2025 - Mar 2025</p>

      <div class="tech-tags">
        <span class="tag unity">Unity</span>
        <span class="tag csharp">C#</span>
        <span class="tag mobile">Mobile</span>
        <span class="tag puzzle">Puzzle</span>
      </div>

      <div class="store-links">
        <a
          href="https://play.google.com/store/apps/details?id=com.mynewgame"
          class="store-link android"
        >
          <img src="/assets/images/GooglePlay-Icon.svg" alt="Google Play" />
          Google Play
        </a>
      </div>
    </div>
  </div>

  <div class="project-content">
    <div class="project-description">
      <p>
        An innovative puzzle game that challenges players with unique mechanics
        and beautiful visuals. Features progressive difficulty, achievements
        system, and social sharing capabilities.
      </p>
    </div>

    <div class="project-gallery">
      <img
        src="https://github.com/user-attachments/assets/abc123-screenshot1"
        alt="Gameplay Screenshot"
      />
      <img
        src="https://github.com/user-attachments/assets/abc123-screenshot2"
        alt="Menu Interface"
      />
      <img
        src="https://github.com/user-attachments/assets/abc123-screenshot3"
        alt="Achievement System"
      />
    </div>

    <div class="project-responsibilities">
      <h4>Responsibilities</h4>
      <ul>
        <li>Game design and puzzle mechanics</li>
        <li>UI/UX implementation</li>
        <li>Performance optimization</li>
        <li>Google Play Store integration</li>
      </ul>
    </div>

    <div class="project-achievements">
      <h4>Key Achievements</h4>
      <ul>
        <li>Launched successfully on Google Play</li>
        <li>Achieved 5,000+ downloads in first month</li>
        <li>Implemented innovative puzzle mechanics</li>
        <li>Optimized for 60 FPS on mid-range devices</li>
      </ul>
    </div>
  </div>
</div>
```

---

**Note**: Always run the extraction and validation scripts after adding new projects to ensure data integrity and proper integration with the Next.js application.
