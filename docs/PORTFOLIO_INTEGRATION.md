# Portfolio Data Integration Guide

## Overview

This document provides comprehensive instructions for working with the integrated portfolio data system. The portfolio data has been extracted from the HTML v2.0 file and integrated into the Next.js project structure with TypeScript support.

## Architecture

### Data Flow

```
HTML v2.0 → Extract Script → JSON Data → TypeScript Service → Next.js Components
```

### Key Files

- **Data Source**: `/src/data/portfolio-data.json` - Complete extracted portfolio data (35.6KB)
- **Type Definitions**: `/src/types/portfolio.ts` - TypeScript interfaces
- **Data Service**: `/src/data/portfolioData.ts` - Data access functions
- **Asset Integration**: `/src/data/assetPaths.ts` - Unified asset management
- **Extraction Tools**: `/utils/portfolio-extraction/` - Utility scripts

## Data Structure

### Portfolio Data Schema

```typescript
interface PortfolioData {
  sidebar: SidebarInfo; // Personal information
  projects: Project[]; // All 16 projects
}

interface Project {
  id: string; // Unique identifier
  title: string; // Project name
  category: 'unity' | 'unreal' | 'applications';
  image: string; // Main thumbnail URL
  tags: TechnologyTag[]; // Technology stack
  timeline: string; // Development period
  description: string; // Project description
  gallery: string[]; // Image gallery URLs
  responsibilities: string[]; // Your role/tasks
  achievements: string[]; // Key accomplishments
  storeLinks?: StoreLinks; // App store links
  website?: string; // Project website
}
```

### Project Categories Distribution

- **Unity Games**: 13 projects
- **Unreal Engine**: 1 project
- **Applications**: 2 projects

## Usage Guide

### 1. Accessing Portfolio Data

```typescript
import {
  getProjectById,
  getProjectsByCategory,
  getAllProjects,
  searchProjects,
  getFeaturedProjects,
} from '@/data/portfolioData';

// Get a specific project
const project = getProjectById('heroicDefense');

// Get projects by category
const unityGames = getProjectsByCategory('unity');

// Search projects
const results = searchProjects('tower defense');

// Get featured projects (first 6)
const featured = getFeaturedProjects();
```

### 2. Asset Management

```typescript
import {
  getProjectThumbnail,
  getProjectImages,
  getProjectStoreLinks,
  getEnhancedProjectData,
} from '@/data/assetPaths';

// Get project thumbnail with fallback
const thumbnail = getProjectThumbnail('heroicDefense');

// Get all project images
const gallery = getProjectImages('heroicDefense');

// Get enhanced project data with assets
const enhanced = getEnhancedProjectData('heroicDefense');
```

### 3. Component Integration Example

```tsx
import React from 'react';
import { getProjectsByCategory } from '@/data/portfolioData';
import { getProjectThumbnail } from '@/data/assetPaths';

const ProjectGrid: React.FC = () => {
  const unityProjects = getProjectsByCategory('unity');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {unityProjects.map((project) => (
        <div key={project.id} className="project-card">
          <img
            src={getProjectThumbnail(project.id)}
            alt={project.title}
            className="w-full h-48 object-cover rounded-lg"
          />
          <h3 className="text-xl font-bold mt-4">{project.title}</h3>
          <p className="text-gray-600 mt-2">{project.description}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            {project.tags.map((tag) => (
              <span
                key={tag.label}
                className={`px-2 py-1 rounded text-sm ${tag.colorClass}`}
              >
                {tag.label}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectGrid;
```

## Available Scripts

### Validation & Extraction

```bash
# Validate current portfolio data
npm run portfolio:check

# Extract fresh data from HTML and validate
npm run portfolio:extract

# Run individual scripts
npm run validate-portfolio
npm run extract-portfolio
```

### Development Scripts

```bash
# Start development server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint
```

## Data Validation

The validation script checks:

- **Data Integrity**: All required fields present
- **URL Validation**: Image and store links are accessible
- **Type Safety**: Data matches TypeScript interfaces
- **Statistics**: Project counts, category distribution

### Validation Output Example

```
✅ Portfolio Data Validation Complete
📊 Statistics:
   - Total Projects: 16
   - Unity Games: 13
   - Unreal Games: 1
   - Applications: 2
   - Projects with Store Links: 2
   - Projects with Websites: 3
```

## Migration from Legacy Data

### Before (Old Structure)

```typescript
// Old way - scattered data
import { projects } from './projects';
import { projectGalleries } from './assetPaths';

const project = projects.find((p) => p.id === 'heroicDefense');
const gallery = projectGalleries.heroicDefense;
```

### After (New Integrated Structure)

```typescript
// New way - unified access
import { getProjectById } from '@/data/portfolioData';
import { getEnhancedProjectData } from '@/data/assetPaths';

const project = getProjectById('heroicDefense');
const enhanced = getEnhancedProjectData('heroicDefense');
```

## Adding New Projects

### 1. Update HTML Source

1. Add project to `/public/v2.0/index.html`
2. Follow existing HTML structure
3. Include all required fields

### 2. Re-extract Data

```bash
npm run portfolio:extract
```

### 3. Verify Integration

```bash
npm run portfolio:check
npm run type-check
```

### 4. Update Assets (if needed)

Add new asset paths to `/src/data/assetPaths.ts`:

```typescript
export const projectThumbnails = {
  // ...existing projects...
  newProject: 'https://github.com/user-attachments/assets/...',
};
```

## Best Practices

### 1. Type Safety

- Always use TypeScript interfaces
- Leverage IDE autocomplete
- Handle undefined/null cases

### 2. Performance

- Use `getFeaturedProjects()` for homepage
- Implement lazy loading for large galleries
- Cache search results when possible

### 3. Error Handling

```typescript
const project = getProjectById(id);
if (!project) {
  return <div>Project not found</div>;
}
```

### 4. Asset Management

- Use `getProjectThumbnail()` for consistent fallbacks
- Prefer portfolio data over legacy asset mappings
- Always provide alt text for images

## Troubleshooting

### Common Issues

**1. Project Not Found**

```typescript
// Check if using correct ID format
const project = getProjectById('heroicDefense'); // camelCase
```

**2. Missing Images**

```typescript
// Use fallback system
const thumbnail =
  getProjectThumbnail(projectId) || '/assets/images/placeholder.png';
```

**3. Type Errors**

```bash
# Run type checking
npm run type-check
```

### Debug Commands

```bash
# Validate data integrity
npm run validate-portfolio

# Check for TypeScript errors
npm run type-check

# View project structure
node -e "console.log(JSON.stringify(require('./src/data/portfolio-data.json').projects.map(p => ({id: p.id, title: p.title})), null, 2))"
```

## File Organization

```
src/
├── data/
│   ├── portfolio-data.json      # Main data source
│   ├── portfolioData.ts         # Data access layer
│   └── assetPaths.ts           # Asset management
├── types/
│   └── portfolio.ts            # TypeScript definitions
utils/
└── portfolio-extraction/
    ├── extract-portfolio-data.js  # Extraction script
    ├── validate-portfolio-data.js # Validation script
    └── backup/                    # Backup files
```

## Next Steps

1. **Component Integration**: Update existing components to use new data structure
2. **Performance Optimization**: Implement caching and lazy loading
3. **Search Enhancement**: Add advanced filtering and sorting
4. **Analytics Integration**: Track project views and interactions
5. **Content Management**: Consider headless CMS integration for easier updates

---

**Last Updated**: May 25, 2025  
**Version**: 2.0  
**Maintainer**: Long18
