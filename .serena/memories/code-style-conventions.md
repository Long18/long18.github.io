# Code Style and Conventions

## TypeScript Configuration
- **Strict Mode**: Enabled for type safety
- **Path Mapping**: @/* aliases for clean imports
- **Module Resolution**: Bundler mode for modern imports
- **JSX**: Preserve mode for Next.js compatibility

## Naming Conventions
- **Components**: PascalCase (e.g., `MainApp.tsx`, `ProjectCard.tsx`)
- **Files**: kebab-case for utilities, PascalCase for components
- **Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **CSS Classes**: kebab-case (Tailwind conventions)

## File Organization
```
src/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Internationalized routes
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── layout/           # Layout components
│   ├── providers/        # Context providers
│   ├── sections/         # Page sections
│   └── ui/               # Reusable UI components
├── data/                 # Static data and content
├── hooks/                # Custom React hooks
├── i18n/                 # Internationalization
├── types/                # TypeScript definitions
└── utils/                # Utility functions
```

## Import Conventions
- **Absolute Imports**: Use @/ aliases for internal imports
- **External Libraries**: Import at the top
- **Internal Components**: Group by type
- **Type Imports**: Use `import type` for types

## Component Structure
- **Functional Components**: Use React.FC or explicit typing
- **Props Interface**: Define in same file or types/
- **Default Exports**: For main component
- **Named Exports**: For utilities and types

## Styling Conventions
- **Tailwind CSS**: Utility-first approach
- **Custom Classes**: Use CSS modules for complex styles
- **Responsive Design**: Mobile-first breakpoints
- **Dark Mode**: Class-based dark mode support
- **Animations**: Centralized in Tailwind config