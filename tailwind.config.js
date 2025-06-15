/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      '3xl': '1920px',
    },
    extend: {
      // === NEW MODERN TYPOGRAPHY SYSTEM ===
      fontFamily: {
        'display': ['Cal Sans', 'Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      fontSize: {
        // Responsive typography with clamp
        'hero': ['clamp(3rem, 8vw, 6rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display': ['clamp(2.5rem, 6vw, 4rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'h1': ['clamp(2.25rem, 5vw, 3rem)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'h2': ['clamp(1.5rem, 3vw, 1.875rem)', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'h3': ['clamp(1.25rem, 2.5vw, 1.5rem)', { lineHeight: '1.4' }],
        'h4': ['clamp(1.125rem, 2vw, 1.25rem)', { lineHeight: '1.4' }],
        'body-lg': ['1.125rem', { lineHeight: '1.7' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
        'caption': ['0.75rem', { lineHeight: '1.4' }],
      },

      // === MODERN SPACING SYSTEM ===
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },

      colors: {
        // === LIQUID GLASS DESIGN SYSTEM COLORS (PRESERVED) ===
        'glass-surface': {
          primary: 'hsla(var(--glass-surface-primary), var(--glass-opacity-primary))',
          secondary: 'hsla(var(--glass-surface-secondary), var(--glass-opacity-secondary))',
          tertiary: 'hsla(var(--glass-surface-tertiary), var(--glass-opacity-tertiary))',
          hover: 'hsla(var(--glass-surface-primary), var(--glass-opacity-hover))',
          active: 'hsla(var(--glass-surface-primary), var(--glass-opacity-active))',
        },
        'glass-accent': {
          DEFAULT: 'hsl(var(--glass-accent))',
          secondary: 'hsl(var(--glass-accent-secondary))',
          light: 'hsl(var(--glass-accent-light))',
        },
        'glass-text': {
          primary: 'hsla(var(--glass-text-primary), 1)',
          secondary: 'hsla(var(--glass-text-secondary), 0.9)',
          tertiary: 'hsla(var(--glass-text-tertiary), 0.7)',
          disabled: 'hsla(var(--glass-text-disabled), 0.6)',
        },
        'glass-border': {
          DEFAULT: 'hsla(var(--glass-border), var(--glass-border-opacity))',
          hover: 'hsla(var(--glass-border), var(--glass-border-hover))',
        },

        // === NEW MODERN COLOR SYSTEM ===
        // Semantic Base Layer (Shadcn/ui compatible)
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: 'hsl(var(--card))',
        'card-foreground': 'hsl(var(--card-foreground))',
        popover: 'hsl(var(--popover))',
        'popover-foreground': 'hsl(var(--popover-foreground))',

        // Modern Primary Brand Colors (Blue-Violet System)
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },

        // Modern Secondary Colors (Violet System)
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },

        // Modern Accent Color (Amber for highlights)
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },

        // UI Semantic Colors
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        info: {
          DEFAULT: 'hsl(var(--info))',
          foreground: 'hsl(var(--info-foreground))',
        },

        // UI Element Colors
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',

        // === PORTFOLIO-SPECIFIC COLORS (UPDATED) ===
        portfolio: {
          surface: {
            primary: 'hsl(var(--portfolio-surface-primary))',
            secondary: 'hsl(var(--portfolio-surface-secondary))',
            tertiary: 'hsl(var(--portfolio-surface-tertiary))',
          },
          accent: {
            DEFAULT: 'hsl(var(--portfolio-accent))',
            foreground: 'hsl(var(--portfolio-accent-foreground))',
            muted: 'hsl(var(--portfolio-accent-muted))',
          },
          text: {
            primary: 'hsl(var(--portfolio-text-primary))',
            secondary: 'hsl(var(--portfolio-text-secondary))',
            muted: 'hsl(var(--portfolio-text-muted))',
            inverse: 'hsl(var(--portfolio-text-inverse))',
          },
          interactive: {
            DEFAULT: 'hsl(var(--portfolio-interactive))',
            hover: 'hsl(var(--portfolio-interactive-hover))',
            active: 'hsl(var(--portfolio-interactive-active))',
            disabled: 'hsl(var(--portfolio-interactive-disabled))',
          },
        },

        // === TECHNOLOGY COLORS (PRESERVED) ===
        tech: {
          unity: {
            DEFAULT: 'hsl(var(--tech-unity))',
            foreground: 'hsl(var(--tech-unity-foreground))',
          },
          unreal: {
            DEFAULT: 'hsl(var(--tech-unreal))',
            foreground: 'hsl(var(--tech-unreal-foreground))',
          },
          csharp: {
            DEFAULT: 'hsl(var(--tech-csharp))',
            foreground: 'hsl(var(--tech-csharp-foreground))',
          },
          cpp: {
            DEFAULT: 'hsl(var(--tech-cpp))',
            foreground: 'hsl(var(--tech-cpp-foreground))',
          },
          javascript: {
            DEFAULT: 'hsl(var(--tech-javascript))',
            foreground: 'hsl(var(--tech-javascript-foreground))',
          },
          typescript: {
            DEFAULT: 'hsl(var(--tech-typescript))',
            foreground: 'hsl(var(--tech-typescript-foreground))',
          },
          react: {
            DEFAULT: 'hsl(var(--tech-react))',
            foreground: 'hsl(var(--tech-react-foreground))',
          },
          nextjs: {
            DEFAULT: 'hsl(var(--tech-nextjs))',
            foreground: 'hsl(var(--tech-nextjs-foreground))',
          },
        },
      },

      // === MODERN BLUR SYSTEM ===
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        '3xl': '40px',
      },

      // === MODERN SHADOW SYSTEM ===
      boxShadow: {
        'glass-sm': '0 2px 8px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)',
        'glass-md': '0 8px 25px rgba(0, 0, 0, 0.1), 0 4px 10px rgba(0, 0, 0, 0.05)',
        'glass-lg': '0 12px 35px rgba(0, 0, 0, 0.15), 0 8px 15px rgba(0, 0, 0, 0.1)',
        'glass-xl': '0 20px 50px rgba(0, 0, 0, 0.2), 0 12px 20px rgba(0, 0, 0, 0.15)',
        'modern-sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'modern-md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'modern-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'modern-xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        'glow-sm': '0 0 10px rgb(59 130 246 / 0.3)',
        'glow-md': '0 0 20px rgb(59 130 246 / 0.4)',
        'glow-lg': '0 0 30px rgb(59 130 246 / 0.5)',
      },

      // === MODERN ANIMATION SYSTEM ===
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in-down': 'fadeInDown 0.6s ease-out',
        'slide-in-left': 'slideInLeft 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite alternate',
        'gradient-shift': 'gradientShift 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        pulseGlow: {
          '0%': { boxShadow: '0 0 5px rgb(59 130 246 / 0.3)' },
          '100%': { boxShadow: '0 0 20px rgb(59 130 246 / 0.6)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },

      // === MODERN BORDER RADIUS SYSTEM ===
      borderRadius: {
        'xs': '0.125rem',
        'sm': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },

      // === MODERN GRID SYSTEM ===
      gridTemplateColumns: {
        'auto-fit-xs': 'repeat(auto-fit, minmax(200px, 1fr))',
        'auto-fit-sm': 'repeat(auto-fit, minmax(250px, 1fr))',
        'auto-fit-md': 'repeat(auto-fit, minmax(300px, 1fr))',
        'auto-fit-lg': 'repeat(auto-fit, minmax(350px, 1fr))',
      },
    },
  },
  plugins: [],
}
