# Development Standards - Portfolio Website

## Overview

This document establishes comprehensive development standards for the Long18 Portfolio Website, ensuring consistent code quality, maintainable architecture, and professional presentation. These standards have been proven through the successful resolution of critical technical issues and implementation of a unified design system.

## 🎯 Core Development Principles

### 1. Technical Excellence
- **Zero Tolerance for Runtime Errors**: All React errors must be resolved before deployment
- **Type Safety First**: Strict TypeScript configuration with comprehensive type coverage
- **Performance Standards**: Maintain 90+ Lighthouse scores across all metrics
- **Accessibility Compliance**: WCAG 2.1 AA standards for all components

### 2. Professional Quality
- **Enterprise-Level Standards**: Code quality suitable for senior development positions
- **Systematic Problem Solving**: Document and resolve issues with comprehensive solutions
- **Consistent Design Language**: Unified visual presentation across all components
- **Maintainable Architecture**: Clean, scalable code patterns for long-term development

## 🏗️ Component Development Standards

### React Component Patterns

#### Component Structure
```typescript
// Standard component template
interface ComponentProps {
  // Props interface with clear documentation
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  className?: string;
}

export const Component = ({
  variant = 'primary',
  children,
  className,
  ...props
}: ComponentProps) => {
  // Component logic
  return (
    <div className={cn(baseStyles, variantStyles[variant], className)} {...props}>
      {children}
    </div>
  );
};
```

#### asChild Pattern Implementation
**Critical Standard**: When implementing asChild patterns with @radix-ui/react-slot:

```typescript
// CORRECT: Conditional rendering for asChild
export const Button = ({ asChild, children, leftIcon, rightIcon, loading, ...props }) => {
  const Comp = asChild ? Slot : 'button';

  if (asChild) {
    // When asChild is true, only render children
    return <Comp {...props}>{children}</Comp>;
  }

  // When asChild is false, render all elements
  return (
    <Comp {...props}>
      {loading && <Spinner />}
      {leftIcon}
      {children}
      {rightIcon}
    </Comp>
  );
};
```

**Avoid**: Multiple children with asChild prop - causes React.Children.only errors

### TypeScript Standards

#### Strict Configuration
```json
// tsconfig.json requirements
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

#### Interface Definitions
```typescript
// Comprehensive interface documentation
interface ProjectData {
  id: string;
  title: string;
  category: 'unity' | 'unreal' | 'applications';
  technologies: string[];
  description: string;
  gallery: string[];
  demoUrl?: string;
  downloadLinks?: {
    apk?: string;
    source?: string;
  };
}
```

## 🎨 Design System Standards

### Unified Color System

#### Glass Color Palette (Primary System)
```css
/* Core glass colors - use these consistently */
.text-glass-text-primary     /* Primary text color */
.text-glass-text-secondary   /* Secondary text color */
.text-glass-text-muted       /* Muted text color */
.text-glass-accent           /* Accent color for highlights */
.text-glass-accent-light     /* Light accent variant */

/* Background colors */
.bg-glass-surface-primary    /* Primary glass surface */
.bg-glass-surface-secondary  /* Secondary glass surface */
.bg-glass-surface-tertiary   /* Tertiary glass surface */

/* Border and effects */
.border-glass-border         /* Consistent border color */
.shadow-glass-lg             /* Large glass shadow */
.shadow-glass-glow           /* Glass glow effect */
```

#### Typography System
```typescript
// Typography component usage
<Typography variant="hero" color="gradient">
  Main Headlines
</Typography>

<Typography variant="h1" color="glass-text-primary">
  Section Headers
</Typography>

<Typography variant="body" color="glass-text-secondary">
  Body content
</Typography>

<Typography variant="caption" color="glass-text-muted">
  Supporting text
</Typography>
```

### Component Variants

#### Button Component Standards
```typescript
// Standard button usage patterns
<Button variant="gradient" size="lg">
  Primary Actions
</Button>

<Button variant="glass" size="default">
  Secondary Actions
</Button>

<Button variant="outline" size="sm">
  Tertiary Actions
</Button>

// asChild pattern for links
<Button asChild variant="gradient">
  <Link href="/download">
    <Download className="w-4 h-4 mr-2" />
    Download Resume
  </Link>
</Button>
```

## 🔧 Code Quality Standards

### ESLint Configuration
```json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended"
  ],
  "rules": {
    "max-lines-per-function": ["error", 50],
    "complexity": ["error", 10],
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn"
  }
}
```

### File Organization
```
src/
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── Button.tsx     # Core button component
│   │   ├── Typography.tsx # Typography system
│   │   ├── Card.tsx       # Card components
│   │   └── Input.tsx      # Form inputs
│   ├── sections/          # Page sections
│   │   ├── Home.tsx       # Home section
│   │   ├── About.tsx      # About section
│   │   ├── Portfolio.tsx  # Portfolio section
│   │   ├── Contact.tsx    # Contact section
│   │   ├── Resume.tsx     # Resume section
│   │   └── Blog.tsx       # Blog section
│   └── layout/            # Layout components
├── styles/
│   └── globals.css        # Global styles and utilities
├── types/
│   └── portfolio.ts       # Type definitions
└── utils/
    └── cn.ts              # Utility functions
```

## 🚀 Performance Standards

### Lighthouse Requirements
- **Performance**: 90+ (required)
- **Accessibility**: 95+ (required)
- **Best Practices**: 100 (required)
- **SEO**: 100 (required)

### Optimization Techniques
```typescript
// Image optimization
import Image from 'next/image';

<Image
  src="/assets/images/project.jpg"
  alt="Project description"
  width={800}
  height={600}
  priority={isAboveFold}
  className="rounded-lg"
/>

// Dynamic imports for heavy components
const GameDemo = dynamic(() => import('../GameDemo'), {
  loading: () => <GameLoadingSkeleton />,
  ssr: false
});
```

## 🧪 Testing Standards

### Component Testing
```typescript
// Test structure for components
describe('Button Component', () => {
  it('renders correctly with default props', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('handles asChild prop correctly', () => {
    render(
      <Button asChild>
        <Link href="/test">Link Button</Link>
      </Button>
    );
    expect(screen.getByRole('link')).toBeInTheDocument();
  });
});
```

### Error Handling
```typescript
// Error boundary implementation
const ErrorBoundary = ({ children, fallback }: ErrorBoundaryProps) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return fallback || <div>Something went wrong!</div>;
  }

  return children;
};
```

## 📱 Responsive Design Standards

### Breakpoint Strategy
```css
/* Mobile-first responsive design */
.component {
  /* Mobile styles (default) */
  @apply grid grid-cols-1 gap-4;
}

@media (min-width: 768px) {
  .component {
    /* Tablet styles */
    @apply grid-cols-2 gap-6;
  }
}

@media (min-width: 1024px) {
  .component {
    /* Desktop styles */
    @apply grid-cols-3 gap-8;
  }
}
```

### Mobile Optimization
- **Touch Targets**: Minimum 44px for interactive elements
- **Performance**: Reduced animations on mobile devices
- **Content**: Prioritize above-the-fold content
- **Navigation**: Mobile-friendly navigation patterns

## 🔒 Security Standards

### Content Security
- **Static Site**: No server-side vulnerabilities
- **Asset Integrity**: Verify all external resources
- **HTTPS**: Secure connections for all assets
- **Privacy**: No tracking without explicit consent

### Development Security
```typescript
// Environment variable handling
const config = {
  emailjs: {
    serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
    templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
  }
};

// Input validation
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
```

## 🚀 Deployment Standards

### Build Process
```bash
# Required build steps
npm run type-check    # TypeScript validation
npm run lint         # ESLint checking
npm run build        # Production build
npm run test         # Test suite
```

### Quality Gates
- **Zero TypeScript Errors**: All compilation errors must be resolved
- **Zero ESLint Errors**: All linting issues must be fixed
- **Performance Tests**: Lighthouse scores must meet requirements
- **Accessibility Tests**: WCAG compliance verification

## 📚 Documentation Standards

### Component Documentation
```typescript
/**
 * Button component with multiple variants and asChild support
 *
 * @param variant - Button style variant
 * @param size - Button size
 * @param asChild - Render as child element (use with Link components)
 * @param loading - Show loading state
 * @param leftIcon - Icon to display on the left
 * @param rightIcon - Icon to display on the right
 *
 * @example
 * // Standard button
 * <Button variant="gradient" size="lg">Click me</Button>
 *
 * // As link with icon
 * <Button asChild variant="outline">
 *   <Link href="/download">
 *     <Download className="w-4 h-4 mr-2" />
 *     Download
 *   </Link>
 * </Button>
 */
```

### Code Comments
```typescript
// Explain complex logic
if (asChild) {
  // When asChild is true, only render children to avoid React.Children.only error
  // This allows the component to be used with Link or other components
  return <Comp {...props}>{children}</Comp>;
}
```

## 🔄 Maintenance Standards

### Regular Reviews
- **Weekly**: Performance metrics and error monitoring
- **Monthly**: Dependency updates and security patches
- **Quarterly**: Comprehensive code review and refactoring

### Version Control
```bash
# Commit message format
feat: add new component feature
fix: resolve React.Children.only error
docs: update component documentation
style: improve color system consistency
refactor: optimize component performance
test: add component test coverage
```

## 🎯 Success Criteria

### Technical Excellence
- ✅ Zero runtime errors in development and production
- ✅ 90+ Lighthouse scores across all metrics
- ✅ 100% TypeScript coverage with strict mode
- ✅ WCAG 2.1 AA accessibility compliance

### Professional Quality
- ✅ Enterprise-level code quality and architecture
- ✅ Consistent design system implementation
- ✅ Comprehensive documentation and comments
- ✅ Scalable and maintainable codebase

### User Experience
- ✅ Fast loading times (< 2 seconds FCP)
- ✅ Smooth animations and interactions
- ✅ Mobile-optimized responsive design
- ✅ Professional visual presentation

---

These development standards ensure the portfolio maintains the highest quality while demonstrating advanced technical capabilities suitable for senior-level positions in the game development industry.
