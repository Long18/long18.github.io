// src/lib/colors.ts - Type-safe color system
export const colorSystem = {
    // Technology color mapping
    getTechColor: (technology: string): string => {
        const techColorMap: Record<string, string> = {
            'Unity': 'tech-unity',
            'Unity3D': 'tech-unity',
            'Unity2D': 'tech-unity',
            'Unreal Engine': 'tech-unreal',
            'Unreal Engine 5': 'tech-unreal',
            'UE5': 'tech-unreal',
            'C#': 'tech-csharp',
            'CSharp': 'tech-csharp',
            'C++': 'tech-cpp',
            'CPP': 'tech-cpp',
            'JavaScript': 'tech-javascript',
            'JS': 'tech-javascript',
            'TypeScript': 'tech-typescript',
            'TS': 'tech-typescript',
            'Web': 'tech-web',
            'WebGL': 'tech-web',
            'HTML': 'tech-web',
            'CSS': 'tech-web',
            'React': 'tech-web',
            'Next.js': 'tech-web',
            'Mobile': 'tech-mobile',
            'Android': 'tech-mobile',
            'iOS': 'tech-mobile',
            'Application': 'tech-application',
            'Desktop': 'tech-application',
            'Java': 'tech-application',
            'Python': 'tech-application',
        };

        return techColorMap[technology] || 'tech-default';
    },

    // Get tech color class for components
    getTechColorClass: (technology: string): string => {
        const techColor = colorSystem.getTechColor(technology);
        return `tech-tag-${techColor.replace('tech-', '')}`;
    },

    // Status color mapping
    getStatusColor: (status: 'success' | 'warning' | 'error' | 'info'): string => {
        const statusColorMap = {
            success: 'success',
            warning: 'warning',
            error: 'destructive',
            info: 'info',
        };

        return statusColorMap[status];
    },

    // Portfolio surface hierarchy
    getSurfaceColor: (level: 'primary' | 'secondary' | 'tertiary'): string => {
        return `portfolio-surface-${level}`;
    },

    // Interactive state colors
    getInteractiveColor: (state: 'default' | 'hover' | 'active' | 'disabled'): string => {
        const stateMap = {
            default: 'portfolio-interactive',
            hover: 'portfolio-interactive-hover',
            active: 'portfolio-interactive-active',
            disabled: 'portfolio-interactive-disabled',
        };

        return stateMap[state];
    },

    // Text hierarchy colors
    getTextColor: (level: 'primary' | 'secondary' | 'muted' | 'inverse'): string => {
        return `portfolio-text-${level}`;
    },

    // Brand color variants
    getBrandColor: (variant: 'primary' | 'secondary' | 'accent'): string => {
        const brandMap = {
            primary: 'primary',
            secondary: 'secondary',
            accent: 'portfolio-accent',
        };

        return brandMap[variant];
    },
} as const;

// Utility functions for common color patterns
export const colorUtils = {
    // Generate full color class names
    bg: (color: string) => `bg-${color}`,
    text: (color: string) => `text-${color}`,
    border: (color: string) => `border-${color}`,

    // Generate tech tag classes
    techTag: (technology: string) => {
        const colorClass = colorSystem.getTechColorClass(technology);
        return `tech-tag ${colorClass}`;
    },

    // Generate status classes
    status: (status: 'success' | 'warning' | 'error' | 'info') => {
        return `status-${status}`;
    },

    // Generate surface classes
    surface: (level: 'primary' | 'secondary' | 'tertiary') => {
        return `surface-${level}`;
    },

    // Generate interactive button classes
    button: (variant: 'primary' | 'secondary' = 'primary') => {
        return variant === 'primary' ? 'portfolio-button' : 'portfolio-button-secondary';
    },

    // Generate card classes
    card: () => 'portfolio-card',

    // Generate gradient text classes
    gradientText: () => 'text-portfolio-gradient',
};

// Type definitions
export type TechColor = ReturnType<typeof colorSystem.getTechColor>;
export type StatusColor = ReturnType<typeof colorSystem.getStatusColor>;
export type SurfaceColor = ReturnType<typeof colorSystem.getSurfaceColor>;
export type InteractiveColor = ReturnType<typeof colorSystem.getInteractiveColor>;
export type TextColor = ReturnType<typeof colorSystem.getTextColor>;
export type BrandColor = ReturnType<typeof colorSystem.getBrandColor>;

// Color constants for direct usage
export const colors = {
    // Brand colors
    brand: {
        primary: 'primary',
        secondary: 'secondary',
        accent: 'portfolio-accent',
    },

    // Surface colors
    surface: {
        primary: 'portfolio-surface-primary',
        secondary: 'portfolio-surface-secondary',
        tertiary: 'portfolio-surface-tertiary',
    },

    // Text colors
    text: {
        primary: 'portfolio-text-primary',
        secondary: 'portfolio-text-secondary',
        muted: 'portfolio-text-muted',
        inverse: 'portfolio-text-inverse',
    },

    // Interactive colors
    interactive: {
        default: 'portfolio-interactive',
        hover: 'portfolio-interactive-hover',
        active: 'portfolio-interactive-active',
        disabled: 'portfolio-interactive-disabled',
    },

    // Status colors
    status: {
        success: 'success',
        warning: 'warning',
        error: 'destructive',
        info: 'info',
    },

    // UI colors
    ui: {
        background: 'background',
        foreground: 'foreground',
        card: 'card',
        border: 'border',
        input: 'input',
        muted: 'muted',
        accent: 'accent',
    },

    // Technology colors
    tech: {
        unity: 'tech-unity',
        unreal: 'tech-unreal',
        csharp: 'tech-csharp',
        cpp: 'tech-cpp',
        javascript: 'tech-javascript',
        typescript: 'tech-typescript',
        web: 'tech-web',
        mobile: 'tech-mobile',
        application: 'tech-application',
        default: 'tech-default',
    },
} as const;

// Export default for convenience
export default colorSystem;
