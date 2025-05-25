# Migration Guide: Legacy to Integrated Portfolio Data

This guide helps you migrate existing Next.js components from the old scattered data structure to the new integrated portfolio system.

## Overview of Changes

### Before (Legacy System)

- Data scattered across multiple files
- Manual asset path management
- No type safety for portfolio data
- Inconsistent project structure

### After (Integrated System)

- Centralized portfolio data in JSON
- Unified asset management
- Full TypeScript support
- Consistent data structure with validation

## Key Migration Steps

### 1. Update Imports

**Before:**

```typescript
// Old imports - scattered data sources
import { projects } from '@/data/projects';
import { projectThumbnails, projectGalleries } from '@/data/assetPaths';
import { personalInfo } from '@/data/personal';
```

**After:**

```typescript
// New imports - unified data access
import {
  getProjectById,
  getProjectsByCategory,
  getAllProjects,
  searchProjects,
  getSidebarInfo,
} from '@/data/portfolioData';
import {
  getProjectThumbnail,
  getProjectImages,
  getEnhancedProjectData,
} from '@/data/assetPaths';
```

### 2. Component Migration Examples

#### Example 1: Project List Component

**Before:**

```typescript
// components/ProjectList.tsx - OLD VERSION
import React from 'react';
import { projects } from '@/data/projects';
import { projectThumbnails } from '@/data/assetPaths';

interface Project {
  id: string;
  title: string;
  category?: string;
  // ... incomplete type definition
}

const ProjectList: React.FC = () => {
  const unityProjects = projects.filter((p) => p.category === 'unity');

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {unityProjects.map((project) => (
        <div key={project.id} className="project-card">
          <img
            src={projectThumbnails[project.id] || '/default.png'}
            alt={project.title}
          />
          <h3>{project.title}</h3>
          {/* Missing: tags, timeline, achievements, etc. */}
        </div>
      ))}
    </div>
  );
};
```

**After:**

```typescript
// components/ProjectList.tsx - NEW VERSION
import React from 'react';
import { getProjectsByCategory } from '@/data/portfolioData';
import { getProjectThumbnail } from '@/data/assetPaths';
import type { Project } from '@/types/portfolio';

const ProjectList: React.FC = () => {
  const unityProjects = getProjectsByCategory('unity');

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {unityProjects.map((project: Project) => (
        <div key={project.id} className="project-card">
          <img
            src={getProjectThumbnail(project.id)}
            alt={project.title}
            className="w-full h-48 object-cover rounded-lg"
          />
          <h3 className="text-xl font-bold">{project.title}</h3>
          <p className="text-gray-600 text-sm">{project.timeline}</p>

          {/* New: Technology tags */}
          <div className="flex flex-wrap gap-2 mt-2">
            {project.tags.map((tag) => (
              <span
                key={tag.label}
                className={`px-2 py-1 rounded text-xs ${tag.colorClass}`}
              >
                {tag.label}
              </span>
            ))}
          </div>

          {/* New: Store links */}
          {project.storeLinks && (
            <div className="flex gap-2 mt-4">
              {project.storeLinks.android && (
                <a
                  href={project.storeLinks.android}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/assets/images/GooglePlay-Icon.svg"
                    alt="Google Play"
                    className="h-8"
                  />
                </a>
              )}
              {project.storeLinks.ios && (
                <a
                  href={project.storeLinks.ios}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/assets/images/AppStore-Icons.svg"
                    alt="App Store"
                    className="h-8"
                  />
                </a>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProjectList;
```

#### Example 2: Project Detail Component

**Before:**

```typescript
// components/ProjectDetail.tsx - OLD VERSION
import React from 'react';
import { projects } from '@/data/projects';
import { projectGalleries } from '@/data/assetPaths';

interface Props {
  projectId: string;
}

const ProjectDetail: React.FC<Props> = ({ projectId }) => {
  const project = projects.find((p) => p.id === projectId);
  const gallery = projectGalleries[projectId] || [];

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div>
      <h1>{project.title}</h1>
      <p>{project.description}</p>

      {/* Limited gallery display */}
      <div className="gallery">
        {gallery.map((image, index) => (
          <img key={index} src={image} alt={`${project.title} ${index + 1}`} />
        ))}
      </div>

      {/* Missing: responsibilities, achievements, timeline, etc. */}
    </div>
  );
};
```

**After:**

```typescript
// components/ProjectDetail.tsx - NEW VERSION
import React from 'react';
import { getProjectById } from '@/data/portfolioData';
import { getEnhancedProjectData } from '@/data/assetPaths';
import type { Project } from '@/types/portfolio';

interface Props {
  projectId: string;
}

const ProjectDetail: React.FC<Props> = ({ projectId }) => {
  const project = getProjectById(projectId);
  const enhancedData = getEnhancedProjectData(projectId);

  if (!project) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-gray-600">Project not found</h2>
        <p className="text-gray-500 mt-2">
          The requested project could not be found.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
        <div className="flex items-center gap-4 mb-4">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {project.category}
          </span>
          <span className="text-gray-600">{project.timeline}</span>
        </div>

        {/* Technology tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag) => (
            <span
              key={tag.label}
              className={`px-3 py-1 rounded-full text-sm ${tag.colorClass}`}
            >
              {tag.label}
            </span>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">About the Project</h2>
        <p className="text-gray-700 leading-relaxed">{project.description}</p>
      </div>

      {/* Gallery */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Gallery</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {project.gallery.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${project.title} screenshot ${index + 1}`}
              className="w-full h-48 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow"
            />
          ))}
        </div>
      </div>

      {/* Responsibilities */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">My Responsibilities</h2>
        <ul className="space-y-2">
          {project.responsibilities.map((responsibility, index) => (
            <li key={index} className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span className="text-gray-700">{responsibility}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Achievements */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Key Achievements</h2>
        <ul className="space-y-2">
          {project.achievements.map((achievement, index) => (
            <li key={index} className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700">{achievement}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Store Links */}
      {(project.storeLinks || project.website) && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Links</h2>
          <div className="flex flex-wrap gap-4">
            {project.storeLinks?.android && (
              <a
                href={project.storeLinks.android}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <img
                  src="/assets/images/GooglePlay-Icon.svg"
                  alt=""
                  className="h-5 w-5"
                />
                Google Play
              </a>
            )}
            {project.storeLinks?.ios && (
              <a
                href={project.storeLinks.ios}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <img
                  src="/assets/images/AppStore-Icons.svg"
                  alt=""
                  className="h-5 w-5"
                />
                App Store
              </a>
            )}
            {project.website && (
              <a
                href={project.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                🌐 Visit Website
              </a>
            )}
          </div>
        </div>
      )}

      {/* Enhanced data from asset integration */}
      {enhancedData?.assets?.video && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Video Demo</h2>
          <video
            controls
            poster={enhancedData.assets.video.thumbnail}
            className="w-full max-w-2xl rounded-lg"
          >
            <source src={enhancedData.assets.video.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {/* Downloads */}
      {(enhancedData?.assets?.downloads?.apk ||
        enhancedData?.assets?.downloads?.webgl) && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Downloads</h2>
          <div className="flex flex-wrap gap-4">
            {enhancedData.assets.downloads.apk && (
              <a
                href={enhancedData.assets.downloads.apk}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                📱 Download APK
              </a>
            )}
            {enhancedData.assets.downloads.webgl && (
              <a
                href={enhancedData.assets.downloads.webgl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                🎮 Play WebGL
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
```

#### Example 3: Search Component

**Before:**

```typescript
// components/ProjectSearch.tsx - OLD VERSION
import React, { useState } from 'react';
import { projects } from '@/data/projects';

const ProjectSearch: React.FC = () => {
  const [query, setQuery] = useState('');

  // Basic text matching
  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search projects..."
      />
      {/* Basic results display */}
    </div>
  );
};
```

**After:**

```typescript
// components/ProjectSearch.tsx - NEW VERSION
import React, { useState, useMemo } from 'react';
import { searchProjects, getProjectsByCategory } from '@/data/portfolioData';
import { getProjectThumbnail } from '@/data/assetPaths';
import type { Project } from '@/types/portfolio';

const ProjectSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Enhanced search with multiple criteria
  const filteredProjects = useMemo(() => {
    if (!query && selectedCategory === 'all') {
      return [];
    }

    let results: Project[] = [];

    if (query) {
      results = searchProjects(query);
    } else {
      results = getProjectsByCategory(selectedCategory as any);
    }

    return results;
  }, [query, selectedCategory]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search projects by title, description, or technology..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Categories
          </button>
          <button
            onClick={() => setSelectedCategory('unity')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === 'unity'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Unity Games
          </button>
          <button
            onClick={() => setSelectedCategory('unreal')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === 'unreal'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Unreal Engine
          </button>
          <button
            onClick={() => setSelectedCategory('applications')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === 'applications'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Applications
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {filteredProjects.length === 0 &&
          (query || selectedCategory !== 'all') && (
            <div className="text-center py-8 text-gray-500">
              No projects found matching your criteria.
            </div>
          )}

        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
          >
            <img
              src={getProjectThumbnail(project.id)}
              alt={project.title}
              className="w-24 h-24 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">{project.title}</h3>
              <p className="text-gray-600 text-sm mb-2">{project.timeline}</p>
              <p className="text-gray-700 mb-3 line-clamp-2">
                {project.description}
              </p>

              {/* Technology tags */}
              <div className="flex flex-wrap gap-1">
                {project.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag.label}
                    className={`px-2 py-1 rounded text-xs ${tag.colorClass}`}
                  >
                    {tag.label}
                  </span>
                ))}
                {project.tags.length > 4 && (
                  <span className="px-2 py-1 rounded text-xs bg-gray-200 text-gray-600">
                    +{project.tags.length - 4} more
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectSearch;
```

### 3. Type Safety Migration

**Before:** No or incomplete types

```typescript
// Weak typing
interface Project {
  id: string;
  title: string;
  category?: string;
  // Missing fields, no validation
}
```

**After:** Complete TypeScript integration

```typescript
// Strong typing with complete interface
import type { Project, TechnologyTag, StoreLinks } from '@/types/portfolio';

// All fields typed, validated, and documented
const project: Project = getProjectById('heroicDefense');
// TypeScript will catch missing fields and type mismatches
```

### 4. Asset Management Migration

**Before:** Manual asset mapping

```typescript
// Manual asset path management
const thumbnail = projectThumbnails[projectId] || '/default.png';
const gallery = projectGalleries[projectId] || [];
```

**After:** Unified asset management with fallbacks

```typescript
// Automatic fallback handling
const thumbnail = getProjectThumbnail(projectId); // Always returns valid URL
const gallery = getProjectImages(projectId); // Integrated with portfolio data
const enhanced = getEnhancedProjectData(projectId); // Combined data + assets
```

## Migration Checklist

### For Each Component:

- [ ] Update imports to use new data functions
- [ ] Replace manual filtering with `getProjectsByCategory()` or `searchProjects()`
- [ ] Use `getProjectThumbnail()` instead of manual thumbnail mapping
- [ ] Add TypeScript types for better development experience
- [ ] Utilize new fields: `tags`, `responsibilities`, `achievements`, `timeline`
- [ ] Implement proper error handling for missing projects
- [ ] Add store links and website links where applicable
- [ ] Use enhanced data for additional assets (videos, downloads)

### Testing Migration:

```bash
# Validate TypeScript
npm run type-check

# Validate portfolio data
npm run portfolio:check

# Test in development
npm run dev
```

### Common Issues & Solutions:

**Issue**: `Property 'xyz' does not exist on type 'Project'`
**Solution**: Update to use correct property names from new interface

**Issue**: Project not found errors
**Solution**: Use proper error handling and project existence checks

**Issue**: Missing images
**Solution**: Use `getProjectThumbnail()` and `getProjectImages()` with built-in fallbacks

**Issue**: Inconsistent data structure
**Solution**: Run `npm run portfolio:extract` to regenerate data from HTML

## Performance Considerations

### Before Migration

- No caching
- Manual data fetching
- Repeated filtering operations

### After Migration

- Built-in caching in data functions
- Optimized search algorithms
- Memoized results where appropriate

## Next Steps After Migration

1. **Remove Legacy Files**: Once migration is complete, remove old data files
2. **Update Tests**: Modify unit tests to use new data structure
3. **Performance Optimization**: Implement lazy loading for large galleries
4. **Enhanced Features**: Add advanced filtering, sorting, and search features
5. **Analytics**: Track which projects are viewed most frequently

---

**Note**: Take your time with migration and test each component thoroughly. The new system provides much more data and flexibility, so take advantage of the additional fields and features available.
