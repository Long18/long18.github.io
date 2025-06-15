# Troubleshooting Guide - Portfolio Website

## Overview

This guide documents common issues encountered during development of the Long18 Portfolio Website and their proven solutions. Each issue includes the root cause analysis, step-by-step resolution, and prevention strategies.

## 🚨 Critical React Errors

### React.Children.only Error

#### Problem Description
```
Error: React.Children.only expected to receive a single React element child
```

**When it occurs**: When using `@radix-ui/react-slot` with the `asChild` prop and multiple children elements.

#### Root Cause Analysis
The `asChild` prop from Radix UI's Slot component expects exactly one React element child, but the Button component was rendering multiple elements:
- Loading spinner
- Left icon (`leftIcon` prop)
- Main content (`children`)
- Right icon (`rightIcon` prop)

#### Solution Implementation
```typescript
// BEFORE (causing error)
export const Button = ({ asChild, children, leftIcon, rightIcon, loading, ...props }) => {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp {...props}>
      {loading && <Spinner />}
      {leftIcon}
      {children}
      {rightIcon}
    </Comp>
  );
};

// AFTER (fixed)
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

#### Component Usage Updates
```typescript
// BEFORE (causing error)
<Button asChild variant="gradient" leftIcon={<Download className="w-4 h-4" />}>
  <Link href="/resume.pdf">Download Resume</Link>
</Button>

// AFTER (fixed)
<Button asChild variant="gradient">
  <Link href="/resume.pdf">
    <Download className="w-4 h-4 mr-2" />
    Download Resume
  </Link>
</Button>
```

#### Prevention Strategy
- Always use conditional rendering when implementing `asChild` patterns
- Move icons and additional elements inside the child component when using `asChild`
- Test `asChild` usage with multiple children scenarios
- Document `asChild` usage patterns in component documentation

## 🎨 Color System Issues

### Inconsistent Color Usage

#### Problem Description
Different sections using incompatible color systems leading to visual inconsistency and poor readability.

#### Symptoms
- White buttons that are hard to read
- Mixed color classes (`blog-*`, `portfolio-*`, `text-white-1`)
- Inconsistent accent colors across sections
- Poor contrast ratios

#### Root Cause Analysis
Legacy color systems from different development phases:
- Blog section using `blog-*` classes
- Contact section using `portfolio-*` classes
- Resume section mixing multiple color systems
- Missing utility classes in CSS

#### Solution Implementation

**1. Blog Section Migration**
```typescript
// BEFORE
<div className="blog-text-primary">
  <h2 className="blog-heading">Blog Title</h2>
  <button className="blog-btn-primary">Read More</button>
</div>

// AFTER
<div className="text-glass-text-primary">
  <Typography variant="h2" color="glass-text-primary">Blog Title</Typography>
  <Button variant="gradient">Read More</Button>
</div>
```

**2. Contact Section Migration**
```typescript
// BEFORE
<div className="text-portfolio-accent">
  <h1 className="portfolio-heading">Contact</h1>
</div>

// AFTER
<div className="text-glass-accent">
  <Typography variant="h1" color="glass-text-primary">Contact</Typography>
</div>
```

**3. CSS Utility Classes Added**
```css
/* Added to globals.css */
.text-glass-accent { color: rgb(103, 126, 234); }
.text-glass-accent-light { color: rgba(103, 126, 234, 0.8); }
.text-glass-text-primary { color: rgba(255, 255, 255, 0.95); }
.text-glass-text-secondary { color: rgba(255, 255, 255, 0.8); }
.text-glass-text-muted { color: rgba(255, 255, 255, 0.6); }
.border-glass-border { border-color: rgba(255, 255, 255, 0.2); }
.shadow-glass-lg { box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3); }
.shadow-glass-glow { box-shadow: 0 0 20px rgba(103, 126, 234, 0.3); }
```

#### Prevention Strategy
- Use only the unified glass color system for new components
- Create a color system checklist for component development
- Regular visual consistency audits across all sections
- Document approved color classes and their usage

## 🔧 TypeScript Compilation Issues

### Strict Mode Errors

#### Problem Description
TypeScript compilation errors when enabling strict mode or adding new dependencies.

#### Common Errors
```typescript
// Error: Property 'children' is missing in type
interface ButtonProps {
  variant?: string;
  // Missing children prop
}

// Error: Type 'string | undefined' is not assignable to type 'string'
const className = props.className; // Could be undefined
```

#### Solution Patterns
```typescript
// Proper interface definition
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
}

// Safe property access
const className = props.className || '';
// Or using nullish coalescing
const className = props.className ?? '';
```

#### Prevention Strategy
- Always define complete TypeScript interfaces
- Use strict TypeScript configuration
- Handle undefined values explicitly
- Regular type checking during development

## 🎯 Component Integration Issues

### Typography Component Conflicts

#### Problem Description
Conflicts between HTML elements and Typography component props when migrating from raw HTML.

#### Example Error
```typescript
// Error: Property 'color' does not exist on type 'h1'
<h1 color="glass-text-primary">Title</h1>
```

#### Solution
```typescript
// BEFORE (HTML elements)
<h1 className="text-glass-text-primary">Title</h1>
<p className="text-glass-text-secondary">Description</p>

// AFTER (Typography component)
<Typography variant="h1" color="glass-text-primary">Title</Typography>
<Typography variant="body" color="glass-text-secondary">Description</Typography>
```

#### Prevention Strategy
- Use Typography component consistently for all text elements
- Avoid mixing HTML elements with component props
- Create migration checklist for HTML to component conversion

## 🚀 Performance Issues

### Large Bundle Size

#### Problem Description
Bundle size increasing due to unnecessary imports or inefficient code splitting.

#### Diagnosis Tools
```bash
# Analyze bundle size
npm run build
npm run analyze

# Check for large dependencies
npx webpack-bundle-analyzer .next/static/chunks/*.js
```

#### Solution Strategies
```typescript
// Dynamic imports for heavy components
const GameDemo = dynamic(() => import('../GameDemo'), {
  loading: () => <GameLoadingSkeleton />,
  ssr: false
});

// Tree shaking for icon libraries
import { Download, Mail, Github } from 'lucide-react';
// Instead of: import * as Icons from 'lucide-react';
```

#### Prevention Strategy
- Regular bundle size monitoring
- Use dynamic imports for heavy components
- Optimize image assets and fonts
- Monitor Lighthouse performance scores

## 🔍 Development Server Issues

### Port Conflicts

#### Problem Description
Development server fails to start due to port 3000 being in use.

#### Solution
```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process
kill -9 $(lsof -ti:3000)

# Or use different port
npm run dev -- -p 3001
```

### Hot Reload Not Working

#### Problem Description
Changes not reflecting in browser during development.

#### Solution Steps
1. Clear Next.js cache: `rm -rf .next`
2. Clear node_modules: `rm -rf node_modules && npm install`
3. Check file watching limits: `echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf`
4. Restart development server

## 📱 Responsive Design Issues

### Mobile Layout Problems

#### Problem Description
Components not displaying correctly on mobile devices.

#### Common Issues
- Text too small on mobile
- Buttons too close together
- Images not responsive
- Horizontal scrolling

#### Solution Patterns
```css
/* Mobile-first responsive design */
.component {
  /* Mobile styles (default) */
  @apply text-sm p-2 space-y-2;
}

@media (min-width: 768px) {
  .component {
    /* Tablet and desktop styles */
    @apply text-base p-4 space-y-4;
  }
}
```

#### Testing Strategy
- Test on actual mobile devices
- Use browser dev tools device simulation
- Check touch target sizes (minimum 44px)
- Verify text readability

## 🔒 Security Issues

### Environment Variable Exposure

#### Problem Description
Sensitive environment variables exposed in client-side code.

#### Prevention
```typescript
// WRONG: Server-side only variables in client code
const apiKey = process.env.SECRET_API_KEY; // Exposed to client

// CORRECT: Use NEXT_PUBLIC_ prefix for client variables
const publicKey = process.env.NEXT_PUBLIC_API_KEY; // Safe for client

// CORRECT: Keep sensitive variables server-side only
// In API routes or server components only
const secretKey = process.env.SECRET_API_KEY;
```

## 🧪 Testing Issues

### Component Testing Failures

#### Problem Description
Tests failing due to missing context providers or improper mocking.

#### Solution Patterns
```typescript
// Wrap components with necessary providers
const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};

// Mock external dependencies
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));
```

## 📋 Debugging Checklist

### When Encountering New Issues

1. **Check Console Errors**
   - Browser console for runtime errors
   - Terminal for build/compilation errors
   - Network tab for failed requests

2. **Verify Dependencies**
   - Check package.json for version conflicts
   - Run `npm audit` for security issues
   - Update dependencies if needed

3. **Review Recent Changes**
   - Check git diff for recent modifications
   - Identify potential breaking changes
   - Test with previous working commit

4. **Environment Verification**
   - Check Node.js version compatibility
   - Verify environment variables
   - Clear caches and restart services

5. **Component Isolation**
   - Test component in isolation
   - Check props and state values
   - Verify component lifecycle

## 🚀 Quick Fixes Reference

### Common Commands
```bash
# Clear all caches
rm -rf .next node_modules package-lock.json
npm install

# Fix TypeScript errors
npm run type-check

# Fix linting issues
npm run lint -- --fix

# Reset development environment
npm run clean && npm run dev

# Check bundle size
npm run build && npm run analyze
```

### Emergency Rollback
```bash
# Revert to last working commit
git reset --hard HEAD~1

# Or revert specific commit
git revert <commit-hash>

# Force push if needed (use with caution)
git push --force-with-lease
```

---

This troubleshooting guide provides proven solutions for common issues encountered during portfolio development. Keep this guide updated as new issues are discovered and resolved.
