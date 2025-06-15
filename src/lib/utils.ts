import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// Glass design system utilities
export const glassVariants = {
    surface: {
        primary: 'glass-primary',
        secondary: 'glass-secondary',
        tertiary: 'glass-tertiary',
    },
    text: {
        primary: 'text-glass-text-primary',
        secondary: 'text-glass-text-secondary',
        tertiary: 'text-glass-text-tertiary',
        disabled: 'text-glass-text-disabled',
        gradient: 'text-glass-gradient',
    },
    border: {
        default: 'border-glass-border',
        hover: 'hover:border-glass-border-hover',
    },
    shadow: {
        sm: 'shadow-glass-sm',
        md: 'shadow-glass-md',
        lg: 'shadow-glass-lg',
        xl: 'shadow-glass-xl',
        glow: 'shadow-glass-glow',
        glowLg: 'shadow-glass-glow-lg',
    },
    blur: {
        sm: 'backdrop-blur-glass-sm',
        md: 'backdrop-blur-glass-md',
        lg: 'backdrop-blur-glass-lg',
        xl: 'backdrop-blur-glass-xl',
    },
    animation: {
        float: 'glass-float',
        shimmer: 'glass-shimmer',
        pulse: 'glass-pulse',
        glow: 'glass-glow',
    },
    interactive: {
        hover: 'glass-hover',
        active: 'glass-active',
    },
} as const;

export type GlassVariant = keyof typeof glassVariants;
export type GlassSurfaceVariant = keyof typeof glassVariants.surface;
export type GlassTextVariant = keyof typeof glassVariants.text;
export type GlassShadowVariant = keyof typeof glassVariants.shadow;
export type GlassBlurVariant = keyof typeof glassVariants.blur;
export type GlassAnimationVariant = keyof typeof glassVariants.animation;

// Helper function to get glass classes
export function getGlassClasses(
    surface?: GlassSurfaceVariant,
    text?: GlassTextVariant,
    shadow?: GlassShadowVariant,
    blur?: GlassBlurVariant,
    animation?: GlassAnimationVariant,
    interactive?: boolean
) {
    return cn(
        surface && glassVariants.surface[surface],
        text && glassVariants.text[text],
        shadow && glassVariants.shadow[shadow],
        blur && glassVariants.blur[blur],
        animation && glassVariants.animation[animation],
        interactive && [glassVariants.interactive.hover, glassVariants.interactive.active]
    );
}

// Glass color utilities
export const glassColors = {
    accent: {
        primary: 'hsl(var(--glass-accent))',
        secondary: 'hsl(var(--glass-accent-secondary))',
        light: 'hsl(var(--glass-accent-light))',
    },
    surface: {
        primary: 'hsla(var(--glass-surface-primary), var(--glass-opacity-primary))',
        secondary: 'hsla(var(--glass-surface-secondary), var(--glass-opacity-secondary))',
        tertiary: 'hsla(var(--glass-surface-tertiary), var(--glass-opacity-tertiary))',
        hover: 'hsla(var(--glass-surface-primary), var(--glass-opacity-hover))',
        active: 'hsla(var(--glass-surface-primary), var(--glass-opacity-active))',
    },
    text: {
        primary: 'hsla(var(--glass-text-primary), 1)',
        secondary: 'hsla(var(--glass-text-secondary), 0.9)',
        tertiary: 'hsla(var(--glass-text-tertiary), 0.7)',
        disabled: 'hsla(var(--glass-text-disabled), 0.6)',
    },
    border: {
        default: 'hsla(var(--glass-border), var(--glass-border-opacity))',
        hover: 'hsla(var(--glass-border), var(--glass-border-hover))',
    },
} as const;

// Performance utilities for glass effects
export function getOptimizedGlassClasses(performanceMode: 'low' | 'medium' | 'high') {
    const baseClasses = 'glass-primary';

    switch (performanceMode) {
        case 'low':
            return cn(baseClasses, 'backdrop-blur-sm');
        case 'medium':
            return cn(baseClasses, 'backdrop-blur-md', 'glass-hover');
        case 'high':
            return cn(baseClasses, 'backdrop-blur-lg', 'glass-hover', 'glass-shimmer', 'glass-glow');
        default:
            return baseClasses;
    }
}
