# Component Library - Portfolio Website

## Overview

This document provides comprehensive documentation for all UI components in the Long18 Portfolio Website. Each component includes usage examples, props documentation, and best practices proven through successful implementation across all sections.

## 🏗️ Core UI Components

### Button Component

#### Description
A versatile button component with multiple variants, sizes, and support for the asChild pattern for composition with other components.

#### Props Interface
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'gradient' | 'glass';
  size?: 'default' | 'sm' | 'lg' | 'xl';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  asChild?: boolean;
  className?: string;
  children: React.ReactNode;
}
```

#### Usage Examples

**Basic Button**
```tsx
<Button variant="gradient" size="lg">
  Primary Action
</Button>
```

**Button with Icons**
```tsx
<Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
  Download Resume
</Button>

<Button variant="glass" rightIcon={<ArrowRight className="w-4 h-4" />}>
  Continue
</Button>
```

**Loading State**
```tsx
<Button variant="gradient" loading>
  Submitting...
</Button>
```

**asChild Pattern (for Links)**
```tsx
<Button asChild variant="gradient">
  <Link href="/portfolio">
    <Eye className="w-4 h-4 mr-2" />
    View Portfolio
  </Link>
</Button>
```

#### Variant Styles
- **gradient**: Blue-violet gradient background for primary actions
- **glass**: Glass surface with backdrop blur for secondary actions
- **outline**: Transparent background with glass border
- **secondary**: Muted background for tertiary actions
- **ghost**: Minimal styling for subtle interactions
- **link**: Text-only styling for link-like buttons
- **destructive**: Red variant for dangerous actions
- **default**: Standard button styling

#### Best Practices
- Use `gradient` variant for primary call-to-action buttons
- Use `glass` variant for secondary actions in glass-themed sections
- Use `outline` variant for tertiary actions
- Always move icons inside child components when using `asChild`
- Test loading states for form submissions

### Typography Component

#### Description
A comprehensive typography system providing semantic HTML elements with consistent styling and responsive design.

#### Props Interface
```typescript
interface TypographyProps {
  variant: 'hero' | 'display' | 'h1' | 'h2' | 'h3' | 'h4' | 'body-lg' | 'body' | 'body-sm' | 'caption' | 'code';
  color?: 'default' | 'glass-secondary' | 'primary' | 'secondary' | 'gradient' | 'glass' | 'muted' | 'accent' | 'gradient-accent' | 'glass-gradient' | 'glass-text-primary' | 'glass-text-secondary' | 'glass-text-muted' | 'glass-accent';
  align?: 'left' | 'center' | 'right';
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  children: React.ReactNode;
}
```

#### Usage Examples

**Hero Headlines**
```tsx
<Typography variant="hero" color="gradient" align="center">
  Lê Nguyễn Thành Long
</Typography>
```

**Section Headers**
```tsx
<Typography variant="h1" color="glass-text-primary">
  About Me
</Typography>

<Typography variant="h2" color="glass-text-primary">
  Experience
</Typography>
```

**Body Content**
```tsx
<Typography variant="body" color="glass-text-secondary">
  I'm a passionate game developer with expertise in Unity, Unreal Engine,
  and modern web technologies.
</Typography>
```

**Captions and Metadata**
```tsx
<Typography variant="caption" color="glass-text-muted">
  Published on March 15, 2024
</Typography>
```

**Code Snippets**
```tsx
<Typography variant="code" color="glass-accent">
  npm install @radix-ui/react-slot
</Typography>
```

**Custom HTML Element**
```tsx
<Typography variant="h2" as="span" color="glass-accent">
  Highlighted Text
</Typography>
```

#### Variant Hierarchy
- **hero**: Largest text for main headlines (clamp(2.5rem, 5vw, 4rem))
- **display**: Large display text (clamp(2rem, 4vw, 3rem))
- **h1-h4**: Semantic heading hierarchy with responsive sizing
- **body-lg**: Large body text for emphasis
- **body**: Standard body text
- **body-sm**: Small body text
- **caption**: Small text for captions and metadata
- **code**: Monospace text for code snippets

#### Color System
- **gradient**: Blue-violet gradient for special emphasis
- **glass-text-primary**: Primary text color (highest contrast)
- **glass-text-secondary**: Secondary text color (medium contrast)
- **glass-text-muted**: Muted text color (lower contrast)
- **glass-accent**: Accent color for highlights

#### Best Practices
- Use semantic heading hierarchy (h1 → h2 → h3 → h4)
- Choose appropriate contrast levels for content importance
- Use `gradient` color sparingly for maximum impact
- Test readability on all device sizes

### Card Component

#### Description
Flexible container component with multiple variants for different content types and interaction patterns.

#### Props Interface
```typescript
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'interactive' | 'outline' | 'elevated';
  className?: string;
  children: React.ReactNode;
}

// Subcomponents
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}
interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}
interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}
```

#### Usage Examples

**Basic Card Structure**
```tsx
<Card variant="glass">
  <CardHeader>
    <CardTitle>Project Title</CardTitle>
    <CardDescription>Brief project description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Main content goes here...</p>
  </CardContent>
  <CardFooter>
    <Button variant="outline">Learn More</Button>
  </CardFooter>
</Card>
```

**Interactive Project Card**
```tsx
<Card variant="interactive" className="cursor-pointer group">
  <CardHeader>
    <CardTitle className="group-hover:text-glass-accent transition-colors">
      Unity Game Project
    </CardTitle>
    <CardDescription>
      3D platformer built with Unity 2022.3
    </CardDescription>
  </CardHeader>
  <CardContent>
    <img src="/project-image.jpg" alt="Project preview" className="rounded-lg" />
  </CardContent>
  <CardFooter className="flex gap-2">
    <Button variant="gradient" size="sm">Play Demo</Button>
    <Button variant="outline" size="sm">View Code</Button>
  </CardFooter>
</Card>
```

**Elevated Card for Important Content**
```tsx
<Card variant="elevated">
  <CardHeader>
    <CardTitle>Featured Achievement</CardTitle>
  </CardHeader>
  <CardContent>
    <Typography variant="body" color="glass-text-secondary">
      Successfully led development of mobile game with 100K+ downloads
    </Typography>
  </CardContent>
</Card>
```

#### Variant Styles
- **default**: Standard card with subtle background
- **glass**: Glass surface with backdrop blur effect
- **interactive**: Enhanced hover states for clickable cards
- **outline**: Transparent background with border
- **elevated**: Enhanced shadow for important content

#### Best Practices
- Use semantic structure with Header, Content, Footer
- Apply interactive variant for clickable cards
- Use elevated variant sparingly for emphasis
- Ensure proper spacing between card elements

### Input Component

#### Description
Form input component with multiple variants and icon support for consistent form styling.

#### Props Interface
```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'glass' | 'outline' | 'filled';
  size?: 'default' | 'sm' | 'lg' | 'xl';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
}
```

#### Usage Examples

**Basic Input**
```tsx
<Input
  variant="glass"
  placeholder="Enter your name"
  className="w-full"
/>
```

**Input with Icons**
```tsx
<Input
  variant="glass"
  leftIcon={<Mail className="w-4 h-4" />}
  placeholder="your.email@example.com"
  type="email"
/>

<Input
  variant="outline"
  rightIcon={<Search className="w-4 h-4" />}
  placeholder="Search projects..."
/>
```

**Different Sizes**
```tsx
<Input variant="glass" size="sm" placeholder="Small input" />
<Input variant="glass" size="default" placeholder="Default input" />
<Input variant="glass" size="lg" placeholder="Large input" />
<Input variant="glass" size="xl" placeholder="Extra large input" />
```

**Form Integration**
```tsx
<form className="space-y-4">
  <div>
    <label className="block text-glass-text-primary mb-2">
      Name
    </label>
    <Input
      variant="glass"
      placeholder="Your full name"
      required
    />
  </div>

  <div>
    <label className="block text-glass-text-primary mb-2">
      Email
    </label>
    <Input
      variant="glass"
      type="email"
      leftIcon={<Mail className="w-4 h-4" />}
      placeholder="your.email@example.com"
      required
    />
  </div>

  <Button variant="gradient" type="submit">
    Submit
  </Button>
</form>
```

#### Variant Styles
- **default**: Standard input styling
- **glass**: Glass surface with backdrop blur
- **outline**: Transparent background with border
- **filled**: Solid background for contrast

#### Best Practices
- Use `glass` variant for consistency with design system
- Include appropriate icons for context (mail, search, etc.)
- Always provide proper labels for accessibility
- Use appropriate input types (email, password, etc.)

## 🎨 Design System Integration

### Color Usage Patterns

#### Text Hierarchy
```tsx
// Primary content
<Typography variant="h1" color="glass-text-primary">Main Heading</Typography>

// Supporting content
<Typography variant="body" color="glass-text-secondary">Description text</Typography>

// Metadata and captions
<Typography variant="caption" color="glass-text-muted">Last updated</Typography>

// Highlights and accents
<Typography variant="body" color="glass-accent">Important information</Typography>
```

#### Interactive States
```tsx
// Hover effects
<div className="hover:bg-glass-hover hover:text-glass-accent transition-colors">
  Interactive element
</div>

// Focus states
<Input className="focus:ring-glass-accent focus:border-glass-accent" />

// Active states
<Button className="active:bg-glass-active">Click me</Button>
```

### Responsive Design Patterns

#### Mobile-First Approach
```tsx
<div className="
  grid grid-cols-1 gap-4        // Mobile: single column
  md:grid-cols-2 md:gap-6       // Tablet: two columns
  lg:grid-cols-3 lg:gap-8       // Desktop: three columns
">
  <Card variant="glass">Content</Card>
  <Card variant="glass">Content</Card>
  <Card variant="glass">Content</Card>
</div>
```

#### Typography Scaling
```tsx
<Typography
  variant="hero"
  className="
    text-2xl md:text-4xl lg:text-5xl  // Responsive sizing
    leading-tight md:leading-none     // Responsive line height
  "
>
  Responsive Headline
</Typography>
```

## 🔧 Advanced Usage Patterns

### Component Composition

#### Button with Complex Content
```tsx
<Button asChild variant="gradient">
  <Link href="/project" className="flex items-center gap-2">
    <Image src="/icon.png" width={20} height={20} alt="" />
    <span>View Project</span>
    <ArrowRight className="w-4 h-4" />
  </Link>
</Button>
```

#### Card with Interactive Elements
```tsx
<Card variant="interactive" className="group">
  <CardHeader>
    <div className="flex items-center justify-between">
      <CardTitle className="group-hover:text-glass-accent">
        Project Title
      </CardTitle>
      <Button variant="ghost" size="sm">
        <MoreHorizontal className="w-4 h-4" />
      </Button>
    </div>
  </CardHeader>
  <CardContent>
    <Typography variant="body" color="glass-text-secondary">
      Project description with interactive hover effects
    </Typography>
  </CardContent>
</Card>
```

### Form Patterns

#### Contact Form Example
```tsx
<Card variant="glass">
  <CardHeader>
    <CardTitle>Get In Touch</CardTitle>
    <CardDescription>
      Send me a message and I'll get back to you soon.
    </CardDescription>
  </CardHeader>
  <CardContent>
    <form className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          variant="glass"
          placeholder="First Name"
          required
        />
        <Input
          variant="glass"
          placeholder="Last Name"
          required
        />
      </div>

      <Input
        variant="glass"
        type="email"
        leftIcon={<Mail className="w-4 h-4" />}
        placeholder="your.email@example.com"
        required
      />

      <textarea
        className="w-full p-3 bg-glass-surface-primary border border-glass-border rounded-lg"
        rows={4}
        placeholder="Your message..."
        required
      />
    </form>
  </CardContent>
  <CardFooter>
    <Button variant="gradient" className="w-full">
      Send Message
    </Button>
  </CardFooter>
</Card>
```

## 🧪 Testing Patterns

### Component Testing Examples

#### Button Component Tests
```typescript
describe('Button Component', () => {
  it('renders with correct variant styles', () => {
    render(<Button variant="gradient">Test Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-gradient-to-r');
  });

  it('handles asChild prop correctly', () => {
    render(
      <Button asChild variant="outline">
        <Link href="/test">Link Button</Link>
      </Button>
    );
    expect(screen.getByRole('link')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<Button loading>Loading Button</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

#### Typography Component Tests
```typescript
describe('Typography Component', () => {
  it('renders correct semantic element', () => {
    render(<Typography variant="h1">Heading</Typography>);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('applies custom element with as prop', () => {
    render(<Typography variant="h2" as="span">Span Text</Typography>);
    const element = screen.getByText('Span Text');
    expect(element.tagName).toBe('SPAN');
  });
});
```

## 📋 Component Checklist

### Before Creating New Components
- [ ] Check if existing components can be extended
- [ ] Define clear props interface with TypeScript
- [ ] Include proper accessibility attributes
- [ ] Support responsive design patterns
- [ ] Follow glass color system guidelines
- [ ] Include loading and error states where applicable

### Component Quality Standards
- [ ] TypeScript interfaces with proper documentation
- [ ] Responsive design with mobile-first approach
- [ ] Accessibility compliance (WCAG 2.1 AA)
- [ ] Consistent with design system colors
- [ ] Performance optimized (no unnecessary re-renders)
- [ ] Comprehensive test coverage

### Documentation Requirements
- [ ] Props interface documentation
- [ ] Usage examples for all variants
- [ ] Best practices and anti-patterns
- [ ] Integration examples with other components
- [ ] Accessibility considerations

---

This component library documentation ensures consistent usage patterns and maintains high quality standards across the entire portfolio website. Keep this documentation updated as components evolve and new patterns emerge.
