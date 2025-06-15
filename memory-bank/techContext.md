# Technical Context - Portfolio Website

## Technology Stack

### Core Framework
- **Next.js 14.2.29**: React framework with App Router for optimal performance
- **React 18**: Latest React with concurrent features and improved performance
- **TypeScript 5.x**: Strict type checking for enhanced development experience
- **Node.js**: Runtime environment for build processes and development

### Styling & Design Systems

#### Modern Design System (NEW)
- **Tailwind CSS 3.4.1**: Utility-first CSS framework with custom configuration
- **Shadcn/ui Components**: Modern, accessible component library
- **@radix-ui/react-slot**: Primitive for composition patterns (asChild)
- **class-variance-authority**: Type-safe component variants
- **Lucide React**: Modern icon library for consistent iconography

#### Liquid Glass Design System (Existing)
- **Custom CSS System**: 575+ lines of glassmorphism styling
- **CSS Custom Properties**: Comprehensive variable system for theming
- **Framer Motion**: Animation library for smooth transitions and interactions
- **Glass Effects**: Backdrop blur, opacity layers, and glow effects

### UI Components & Interactions
- **Framer Motion 11.x**: Advanced animations and gesture handling
- **React Icons**: Comprehensive icon library with multiple icon sets
- **Custom Components**: Atomic design pattern with reusable UI elements
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints

### Development Tools
- **ESLint**: Code linting with custom rules for code quality
- **Prettier**: Code formatting for consistent style
- **TypeScript Strict Mode**: Enhanced type safety and error detection
- **Lighthouse CI**: Performance monitoring and optimization

### Build & Deployment
- **Static Site Generation**: Next.js static export for GitHub Pages
- **Asset Optimization**: Image optimization with Next.js Image component
- **Bundle Analysis**: Code splitting and lazy loading for performance
- **GitHub Actions**: Automated CI/CD pipeline for deployment

## Component Architecture

### Modern Component System

#### Core Components
```typescript
// Button Component - 8 variants
interface ButtonProps {
  variant: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'gradient' | 'glass'
  size: 'sm' | 'lg' | 'xl'
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  asChild?: boolean
}

// Typography Component - 11 variants
interface TypographyProps {
  variant: 'hero' | 'display' | 'h1' | 'h2' | 'h3' | 'h4' | 'body-lg' | 'body' | 'body-sm' | 'caption' | 'code'
  color: 'default' | 'glass-secondary' | 'primary' | 'secondary' | 'gradient' | 'glass' | 'muted' | 'accent' | 'gradient-accent' | 'glass-gradient'
  align?: 'left' | 'center' | 'right'
  as?: keyof JSX.IntrinsicElements
}

// Card Component - 5 variants
interface CardProps {
  variant: 'default' | 'glass' | 'interactive' | 'outline' | 'elevated'
}

// Input Component - 4 variants
interface InputProps {
  variant: 'default' | 'glass' | 'outline' | 'filled'
  size: 'default' | 'sm' | 'lg' | 'xl'
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}
```

#### Design System Integration
```css
/* Modern Typography System */
:root {
  /* Font Families */
  --font-inter: 'Inter', sans-serif;
  --font-plus-jakarta: 'Plus Jakarta Sans', sans-serif;
  --font-jetbrains: 'JetBrains Mono', monospace;

  /* Modern Color Palette */
  --primary: 219 78% 61%;
  --secondary: 262 83% 58%;
  --accent: 262 83% 58%;
  --muted: 215 28% 17%;
  --border: 215 28% 17%;

  /* Responsive Typography */
  --text-hero: clamp(2.5rem, 5vw, 4rem);
  --text-display: clamp(2rem, 4vw, 3rem);
  --text-h1: clamp(1.75rem, 3vw, 2.25rem);
}
```

### Glass Component System (Existing)

#### Glass Button Component
```typescript
interface GlassButtonProps {
  variant: 'primary' | 'secondary' | 'tertiary' | 'ghost'
  size: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  glow?: boolean
  shimmer?: boolean
}
```

#### Glass CSS System
```css
/* Glass Surface Hierarchy */
.glass-primary { background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(15px); }
.glass-secondary { background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(12px); }
.glass-tertiary { background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); }

/* Glass Effects */
.glass-glow { box-shadow: 0 0 20px rgba(103, 126, 234, 0.3); }
.glass-shimmer { animation: shimmer 2s infinite; }
.glass-float { animation: float 6s ease-in-out infinite; }
```

## File Structure

### Component Organization
```
src/
├── components/
│   ├── ui/                     # Modern & Glass UI Components
│   │   ├── Button.tsx         # Modern button component
│   │   ├── Typography.tsx     # Modern typography component
│   │   ├── Card.tsx          # Modern card component
│   │   ├── Input.tsx         # Modern input component
│   │   └── GlassButton.tsx   # Glass button component
│   ├── layout/               # Layout components
│   │   ├── Header.tsx
│   │   ├── Navigation.tsx
│   │   └── Sidebar.tsx
│   ├── sections/             # Page sections
│   │   ├── Home.tsx          # Updated with modern components
│   │   ├── About.tsx         # Updated with modern components
│   │   ├── Portfolio.tsx     # Modern imports ready
│   │   ├── Contact.tsx       # Fully modernized forms
│   │   ├── Resume.tsx        # Modern typography
│   │   └── Blog.tsx          # Modern components
│   └── blog/                 # Blog components
│       ├── BlogList.tsx      # Modern search input
│       ├── BlogHeader.tsx
│       └── MarkdownRenderer.tsx
├── styles/
│   └── globals.css           # Enhanced with modern system
├── lib/
│   └── utils.ts             # Utility functions for both systems
└── types/
    └── portfolio.ts         # TypeScript definitions
```

### Configuration Files
```
├── tailwind.config.js       # Enhanced with modern design tokens
├── next.config.js          # Static export configuration
├── tsconfig.json           # Strict TypeScript configuration
├── package.json            # Dependencies and scripts
└── lighthouserc.json       # Performance monitoring
```

## Dependencies

### Core Dependencies
```json
{
  "next": "14.2.29",
  "react": "^18",
  "react-dom": "^18",
  "typescript": "^5",
  "tailwindcss": "^3.4.1",
  "framer-motion": "^11",
  "@radix-ui/react-slot": "^1.0.2",
  "class-variance-authority": "^0.7.0",
  "lucide-react": "^0.263.1",
  "clsx": "^2.0.0",
  "tailwind-merge": "^2.0.0"
}
```

### Development Dependencies
```json
{
  "@types/node": "^20",
  "@types/react": "^18",
  "@types/react-dom": "^18",
  "eslint": "^8",
  "eslint-config-next": "14.2.29",
  "prettier": "^3.0.0",
  "@typescript-eslint/eslint-plugin": "^6.0.0",
  "@typescript-eslint/parser": "^6.0.0"
}
```

## Build Configuration

### Next.js Configuration
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  experimental: {
    optimizeCss: true
  }
}
```

### Tailwind Configuration (Enhanced)
```javascript
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      // Modern Design System
      colors: {
        primary: 'hsl(var(--primary))',
        secondary: 'hsl(var(--secondary))',
        accent: 'hsl(var(--accent))',
        muted: 'hsl(var(--muted))',
        border: 'hsl(var(--border))',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-plus-jakarta)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'Consolas', 'monospace'],
      },
      fontSize: {
        'hero': 'var(--text-hero)',
        'display': 'var(--text-display)',
        'h1': 'var(--text-h1)',
      },
      // Glass Design System (Existing)
      colors: {
        'glass-surface-primary': 'rgba(var(--glass-surface-primary), var(--glass-opacity-primary))',
        'glass-surface-secondary': 'rgba(var(--glass-surface-secondary), var(--glass-opacity-secondary))',
        'glass-accent': 'rgb(var(--glass-accent))',
      },
      backdropBlur: {
        'glass-sm': 'var(--glass-blur-sm)',
        'glass-md': 'var(--glass-blur-md)',
        'glass-lg': 'var(--glass-blur-lg)',
        'glass-xl': 'var(--glass-blur-xl)',
      }
    }
  }
}
```

## Performance Optimization

### Build Optimization
- **Code Splitting**: Automatic route-based splitting with Next.js
- **Tree Shaking**: Unused code elimination in production builds
- **Bundle Analysis**: Regular analysis to identify optimization opportunities
- **Static Generation**: Pre-rendered pages for optimal loading performance

### Runtime Performance
- **Image Optimization**: Next.js Image component with lazy loading
- **Font Optimization**: Self-hosted fonts with proper loading strategies
- **Animation Performance**: Framer Motion with reduced motion support
- **Mobile Optimization**: Reduced glass effects on mobile devices

### Lighthouse Targets
- **Performance**: 90+ (currently achieved)
- **Accessibility**: 95+ (currently achieved)
- **Best Practices**: 100 (currently achieved)
- **SEO**: 100 (currently achieved)

## Development Workflow

### Code Quality
- **TypeScript Strict Mode**: Enhanced type safety and error detection
- **ESLint Rules**: Custom rules for function length and complexity
- **Prettier Integration**: Consistent code formatting
- **Pre-commit Hooks**: Automated linting and formatting

### Component Development
- **Atomic Design**: Consistent component hierarchy and organization
- **Storybook Ready**: Components designed for isolated development
- **Type Safety**: Comprehensive TypeScript interfaces
- **Accessibility**: WCAG 2.1 AA compliance built-in

### Testing Strategy
- **Unit Testing**: Jest and React Testing Library setup
- **Component Testing**: Isolated component testing
- **Integration Testing**: End-to-end user flow testing
- **Performance Testing**: Lighthouse CI integration

## Deployment Strategy

### GitHub Pages
- **Static Export**: Next.js static site generation
- **Asset Optimization**: Optimized images, fonts, and CSS
- **Legacy Support**: v1.0 and v2.0 versions maintained
- **Custom Domain**: Professional domain configuration

### CI/CD Pipeline
- **Automated Builds**: GitHub Actions for build and deployment
- **Quality Gates**: Linting, type checking, and testing
- **Performance Monitoring**: Lighthouse CI integration
- **Deployment Verification**: Automated deployment testing

## Security Considerations

### Content Security
- **Static Site**: No server-side vulnerabilities
- **Asset Integrity**: Subresource integrity for external assets
- **HTTPS**: Secure connection for all resources
- **Privacy**: No tracking or analytics without consent

### Development Security
- **Dependency Scanning**: Regular security audits
- **Type Safety**: TypeScript for runtime error prevention
- **Code Quality**: ESLint rules for security best practices
- **Build Security**: Secure build and deployment pipeline

## Future Technical Considerations

### Scalability
- **Component Library**: Expandable with additional Shadcn/ui components
- **Design System**: Both glass and modern systems can grow independently
- **Performance**: Optimized for additional content and features
- **Maintainability**: Clean architecture for long-term development

### Technology Evolution
- **React 19**: Ready for future React updates
- **Next.js 15**: Prepared for framework updates
- **Modern CSS**: CSS Container Queries and other modern features
- **Web Standards**: Progressive enhancement with modern web APIs

The technical foundation provides a robust, scalable, and maintainable platform for continued development with both cutting-edge visual design (glass system) and professional business presentation (modern system).
