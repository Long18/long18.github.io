# Color System Unification Plan

## Current Issues

- Mix of custom colors (eerie-black-\*, orange-yellow-crayola) and shadcn/ui theme colors
- Some components use raw gray-\* colors instead of theme variables
- Tech tag colors are inconsistent across components

## Recommended Solution

1. **Standardize on shadcn/ui color system** as the primary system
2. **Map custom portfolio colors to CSS custom properties**
3. **Create semantic color aliases** for portfolio-specific use cases

## Implementation

```css
/* Add to globals.css */
:root {
  /* Portfolio semantic colors */
  --portfolio-background: var(--background);
  --portfolio-surface: var(--card);
  --portfolio-primary: var(--primary);
  --portfolio-accent: 45 100% 72%; /* orange-yellow-crayola */
  --portfolio-muted: var(--muted);
}

.dark {
  --portfolio-background: 222.2 84% 4.9%; /* eerie-black equivalent */
  --portfolio-surface: 217.2 32.6% 17.5%; /* eerie-black-2 equivalent */
}
```

## Usage in Components

```tsx
// Instead of: bg-eerie-black-2
className = 'bg-[hsl(var(--portfolio-surface))]';

// Instead of: text-orange-yellow-crayola
className = 'text-[hsl(var(--portfolio-accent))]';
```
