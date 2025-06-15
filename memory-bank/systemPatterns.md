# System Patterns

## Architecture Overview

This portfolio website follows a modern Next.js 14 architecture with App Router, designed for optimal performance, maintainability, and user experience. The system is built around static generation with a single-page application design and component-based architecture.

## Core Architectural Patterns

### Next.js App Router Structure

```
src/
├── app/                          # App Router directory
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page (redirects to MainApp)
│   ├── globals.css              # Global styles and Tailwind imports
│   └── [version]/               # Version-specific routes
├── components/                   # Reusable React components
│   ├── MainApp.tsx              # Main single-page application
│   ├── layout/                  # Layout-specific components
│   ├── providers/               # Context providers
│   ├── sections/                # Page section components (Home, About, Resume, Portfolio, Contact)
│   └── ui/                      # Basic UI components
├── data/                        # Static data and portfolio content
├── hooks/                       # Custom React hooks
├── types/                       # TypeScript definitions
├── context/                     # React context providers
└── utils/                       # Utility functions
```

### Component Architecture Pattern

#### Atomic Design Implementation

**Atoms (ui/)**
- Basic building blocks: Button, Input, Card, Badge
- No business logic, pure presentation
- Highly reusable across the application

**Molecules (components/)**
- Combinations of atoms: ContactForm, ProjectCard, SkillList
- Limited business logic, specific functionality
- Moderate reusability

**Organisms (sections/)**
- Complex UI sections: Home, About, Resume, Portfolio, Contact
- Contains business logic and state management
- Page-specific but reusable across similar contexts

**Templates (layout/)**
- Page layouts and structure: MainLayout, Sidebar
- Define overall page structure without content
- Handle responsive behavior and common patterns

#### Component Naming Conventions

```typescript
// UI Components (atoms)
export const Button = ({ variant, children, ...props }: ButtonProps) => { ... }

// Feature Components (molecules)
export const ProjectCard = ({ project }: ProjectCardProps) => { ... }

// Section Components (organisms)
export const HomeSection = ({ onNavigate }: HomeSectionProps) => { ... }

// Layout Components (templates)
export const Sidebar = ({ locale }: SidebarProps) => { ... }
```

### State Management Patterns

#### Client-Side State Architecture

- **Context Providers**: Global state management for theme and app state
- **Local State**: Component-level state for UI interactions
- **Custom Hooks**: Shared logic and state patterns
- **Section Navigation**: Centralized navigation state management

#### Local State Strategy

```typescript
// Component-level state for UI interactions
const [activeSection, setActiveSection] = useState('hero')

// Custom hooks for shared logic
const useContactForm = () => {
  const [formState, setFormState] = useState(initialState)
  // Form logic, validation, submission
  return { formState, handleSubmit, isLoading }
}

// Context for global app state
const ThemeContext = createContext<ThemeContextType>()
```

### Single-Page Application Patterns

#### Section-Based Navigation

```typescript
// Main application sections
const sections = [
  { id: 'hero', label: 'Home', component: Home },
  { id: 'about', label: 'About', component: About },
  { id: 'resume', label: 'Resume', component: Resume },
  { id: 'portfolio', label: 'Portfolio', component: Portfolio },
  { id: 'contact', label: 'Contact', component: Contact },
];

// Navigation management
const handleSectionChange = (section: string) => {
  setActiveSection(section);
  // Handle smooth scrolling and loading states
};
```

#### Content Management Strategy

```typescript
// Portfolio data structure
interface PortfolioProject {
  id: string;
  title: string;
  category: 'unity' | 'unreal' | 'applications';
  technologies: string[];
  description: string;
  gallery: string[];
  downloads?: {
    apk?: string;
    source?: string;
  };
}
```

### Performance Optimization Patterns

#### Image Optimization

```typescript
import Image from 'next/image'

// Automatic optimization and responsive loading
<Image
  src="/assets/images/project-thumbnail.jpg"
  alt="Project preview"
  width={800}
  height={600}
  priority={isAboveFold}
  className="rounded-lg"
/>
```

#### Code Splitting and Lazy Loading

```typescript
// Dynamic imports for heavy components
const GameDemo = dynamic(() => import('../GameDemo'), {
  loading: () => <GameLoadingSkeleton />,
  ssr: false // Client-side only for WebGL games
})

// Route-based code splitting (automatic with App Router)
```

#### Static Asset Management

```typescript
// Asset organization pattern
public/
├── assets/
│   ├── images/           # Optimized images
│   ├── videos/           # Game trailers and demos
│   ├── apk/              # Downloadable game files
│   ├── fonts/            # Custom web fonts
│   └── documents/        # PDFs, resumes
└── Games/                # WebGL game builds
```

### Styling Architecture

#### Tailwind CSS System

```typescript
// Design system tokens
const colors = {
  'smoky-black': 'hsl(0, 0%, 7%)',
  'eerie-black-1': 'hsl(240, 2%, 13%)',
  'eerie-black-2': 'hsl(240, 2%, 12%)',
  'orange-yellow-crayola': 'hsl(45, 100%, 72%)',
}

// Component styling pattern
const buttonVariants = {
  primary: 'bg-orange-yellow-crayola hover:bg-orange-yellow-crayola/80 text-smoky-black',
  secondary: 'bg-eerie-black-2 hover:bg-jet text-white-1'
}
```

#### Responsive Design Strategy

```typescript
// Mobile-first responsive design
className="
  grid grid-cols-1      // Mobile: single column
  md:grid-cols-2        // Tablet: two columns
  lg:grid-cols-3        // Desktop: three columns
  gap-4 md:gap-6 lg:gap-8
"
```

### Animation and Interaction Patterns

#### Framer Motion Integration

```typescript
import { motion } from 'framer-motion'

// Section transitions
const sectionVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
}

// Component animations
<motion.div
  variants={sectionVariants}
  initial="initial"
  animate="in"
  exit="out"
  transition={{ duration: 0.3 }}
>
```

## Data Flow Patterns

### Portfolio Data Loading Strategy

```typescript
// Static data loading
import portfolioDataJson from './portfolio-data.json';
import { PortfolioData } from '../types/portfolio';

// Type-safe portfolio data
export const portfolioData: PortfolioData = portfolioDataJson as PortfolioData;
```

### Error Handling Patterns

```typescript
// Component-level error boundaries
const ErrorBoundary = ({ children, fallback }: ErrorBoundaryProps) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return fallback || <div>Something went wrong!</div>;
  }

  return children;
};

// Error handling in custom hooks
const useAsyncData = (fetcher: () => Promise<T>) => {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  // Error handling logic
}
```

### SEO and Meta Management

```typescript
// Dynamic metadata generation
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Lê Nguyễn Thành Long - Game Engineer',
    description: 'Game developer specializing in modern web technologies and game development frameworks.',
    openGraph: {
      title: 'Lê Nguyễn Thành Long - Game Engineer',
      description: 'Game developer specializing in modern web technologies and game development frameworks.',
      images: ['/assets/images/og-image.jpg']
    }
  }
}
```

## Integration Patterns

### Game Integration Strategy

```typescript
// Unity WebGL embedding
const GameEmbed = ({ gameId }: { gameId: string }) => {
  useEffect(() => {
    // Initialize Unity game instance
    const unityInstance = UnityLoader.instantiate(
      gameContainer.current,
      `/Games/${gameId}/Build/${gameId}.json`
    )
  }, [gameId])
}
```

### Contact Form Integration

```typescript
// EmailJS integration for contact forms
const handleSubmit = async (formData: ContactFormData) => {
  try {
    await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
      formData
    )
  } catch (error) {
    // Error handling
  }
}
```

### Analytics Integration

```typescript
// Google Analytics with Next.js
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html>
      <body>{children}</body>
      <GoogleAnalytics gaId="GA_MEASUREMENT_ID" />
    </html>
  )
}
```

## Development Workflow Patterns

### Build and Deployment

```bash
# Development workflow
npm run dev              # Local development server
npm run type-check       # TypeScript validation
npm run lint            # ESLint checking
npm run build           # Production build
npm run start           # Production server

# Deployment workflow
npm run build           # Static generation
./deploy.sh             # Custom deployment script
```

### Version Management

```typescript
// Legacy version compatibility
public/
├── v1.0/              # Original HTML portfolio
├── v2.0/              # Updated HTML/CSS portfolio
└── [current]          # Next.js application (default)

// Routing for legacy versions
/v1.0/* -> public/v1.0/*
/v2.0/* -> public/v2.0/*
/* -> Next.js app routes
```

## Portfolio-Specific Patterns

### Project Data Management

```typescript
// Portfolio project interface
interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  technologies: string[];
  description: string;
  gallery: string[];
  demoUrl?: string;
  downloadLinks?: {
    apk?: string;
    source?: string;
  };
}

// Project filtering and categorization
const filterProjects = (projects: Project[], category?: string) => {
  if (!category || category === 'all') return projects;
  return projects.filter(project => project.category === category);
};
```

### Responsive Game Embedding

```typescript
// Responsive Unity WebGL container
const GameContainer = ({ gameId, aspectRatio = "16/9" }: GameContainerProps) => {
  return (
    <div
      className="relative w-full overflow-hidden rounded-lg"
      style={{ aspectRatio }}
    >
      <iframe
        src={`/Games/${gameId}/index.html`}
        className="absolute inset-0 w-full h-full border-0"
        loading="lazy"
      />
    </div>
  );
};
```

### Navigation State Management

```typescript
// Section navigation with smooth transitions
const useSectionNavigation = () => {
  const [activeSection, setActiveSection] = useState('hero');

  const navigateToSection = useCallback((sectionId: string) => {
    // Handle loading states
    setActiveSection(sectionId);

    // Smooth scroll implementation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return { activeSection, navigateToSection };
};
```
