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

        // === MUTED PASTELS CORE COLORS ===
        'muted-slate': {
          50: 'hsl(var(--muted-slate-50))',
          100: 'hsl(var(--muted-slate-100))',
          200: 'hsl(var(--muted-slate-200))',
          300: 'hsl(var(--muted-slate-300))',
          400: 'hsl(var(--muted-slate-400))',
          500: 'hsl(var(--muted-slate-500))',
          600: 'hsl(var(--muted-slate-600))',
          700: 'hsl(var(--muted-slate-700))',
          800: 'hsl(var(--muted-slate-800))',
          900: 'hsl(var(--muted-slate-900))',
          DEFAULT: 'hsl(var(--muted-slate))',
        },
        'muted-text': 'hsl(var(--muted-text))',
        'muted-cyan': {
          50: 'hsl(var(--muted-cyan-50))',
          100: 'hsl(var(--muted-cyan-100))',
          200: 'hsl(var(--muted-cyan-200))',
          300: 'hsl(var(--muted-cyan-300))',
          400: 'hsl(var(--muted-cyan-400))',
          500: 'hsl(var(--muted-cyan-500))',
          600: 'hsl(var(--muted-cyan-600))',
          700: 'hsl(var(--muted-cyan-700))',
          800: 'hsl(var(--muted-cyan-800))',
          900: 'hsl(var(--muted-cyan-900))',
          DEFAULT: 'hsl(var(--muted-cyan))',
        },
        'muted-pink': {
          50: 'hsl(var(--muted-pink-50))',
          100: 'hsl(var(--muted-pink-100))',
          200: 'hsl(var(--muted-pink-200))',
          300: 'hsl(var(--muted-pink-300))',
          400: 'hsl(var(--muted-pink-400))',
          500: 'hsl(var(--muted-pink-500))',
          600: 'hsl(var(--muted-pink-600))',
          700: 'hsl(var(--muted-pink-700))',
          800: 'hsl(var(--muted-pink-800))',
          900: 'hsl(var(--muted-pink-900))',
          DEFAULT: 'hsl(var(--muted-pink))',
        },
        'muted-lavender': {
          50: 'hsl(var(--muted-lavender-50))',
          100: 'hsl(var(--muted-lavender-100))',
          200: 'hsl(var(--muted-lavender-200))',
          300: 'hsl(var(--muted-lavender-300))',
          400: 'hsl(var(--muted-lavender-400))',
          500: 'hsl(var(--muted-lavender-500))',
          600: 'hsl(var(--muted-lavender-600))',
          700: 'hsl(var(--muted-lavender-700))',
          800: 'hsl(var(--muted-lavender-800))',
          900: 'hsl(var(--muted-lavender-900))',
          DEFAULT: 'hsl(var(--muted-lavender))',
        },

        // === SEMANTIC COLOR SYSTEM ===
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          50: 'hsl(var(--primary-50))',
          100: 'hsl(var(--primary-100))',
          200: 'hsl(var(--primary-200))',
          300: 'hsl(var(--primary-300))',
          400: 'hsl(var(--primary-400))',
          500: 'hsl(var(--primary-500))',
          600: 'hsl(var(--primary-600))',
          700: 'hsl(var(--primary-700))',
          800: 'hsl(var(--primary-800))',
          900: 'hsl(var(--primary-900))',
          950: 'hsl(var(--primary-950))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
          50: 'hsl(var(--secondary-50))',
          100: 'hsl(var(--secondary-100))',
          200: 'hsl(var(--secondary-200))',
          300: 'hsl(var(--secondary-300))',
          400: 'hsl(var(--secondary-400))',
          500: 'hsl(var(--secondary-500))',
          600: 'hsl(var(--secondary-600))',
          700: 'hsl(var(--secondary-700))',
          800: 'hsl(var(--secondary-800))',
          900: 'hsl(var(--secondary-900))',
          950: 'hsl(var(--secondary-950))',
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
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },

        // === PORTFOLIO SEMANTIC COLORS ===
        'portfolio-surface': {
          primary: 'hsl(var(--portfolio-surface-primary))',
          secondary: 'hsl(var(--portfolio-surface-secondary))',
          tertiary: 'hsl(var(--portfolio-surface-tertiary))',
        },
        'portfolio-accent': {
          DEFAULT: 'hsl(var(--portfolio-accent))',
          foreground: 'hsl(var(--portfolio-accent-foreground))',
          muted: 'hsl(var(--portfolio-accent-muted))',
        },
        'portfolio-text': {
          primary: 'hsl(var(--portfolio-text-primary))',
          secondary: 'hsl(var(--portfolio-text-secondary))',
          muted: 'hsl(var(--portfolio-text-muted))',
          inverse: 'hsl(var(--portfolio-text-inverse))',
        },
        'portfolio-interactive': {
          DEFAULT: 'hsl(var(--portfolio-interactive))',
          hover: 'hsl(var(--portfolio-interactive-hover))',
          active: 'hsl(var(--portfolio-interactive-active))',
          disabled: 'hsl(var(--portfolio-interactive-disabled))',
        },

        // === TECHNOLOGY COLORS ===
        'tech-unity': {
          DEFAULT: 'hsl(var(--tech-unity))',
          foreground: 'hsl(var(--tech-unity-foreground))',
        },
        'tech-unreal': {
          DEFAULT: 'hsl(var(--tech-unreal))',
          foreground: 'hsl(var(--tech-unreal-foreground))',
        },
        'tech-csharp': {
          DEFAULT: 'hsl(var(--tech-csharp))',
          foreground: 'hsl(var(--tech-csharp-foreground))',
        },
        'tech-cpp': {
          DEFAULT: 'hsl(var(--tech-cpp))',
          foreground: 'hsl(var(--tech-cpp-foreground))',
        },
        'tech-javascript': {
          DEFAULT: 'hsl(var(--tech-javascript))',
          foreground: 'hsl(var(--tech-javascript-foreground))',
        },
        'tech-typescript': {
          DEFAULT: 'hsl(var(--tech-typescript))',
          foreground: 'hsl(var(--tech-typescript-foreground))',
        },
        'tech-web': {
          DEFAULT: 'hsl(var(--tech-web))',
          foreground: 'hsl(var(--tech-web-foreground))',
        },
        'tech-mobile': {
          DEFAULT: 'hsl(var(--tech-mobile))',
          foreground: 'hsl(var(--tech-mobile-foreground))',
        },
        'tech-application': {
          DEFAULT: 'hsl(var(--tech-application))',
          foreground: 'hsl(var(--tech-application-foreground))',
        },
        'tech-default': {
          DEFAULT: 'hsl(var(--tech-default))',
          foreground: 'hsl(var(--tech-default-foreground))',
        },

        // === CHART COLORS ===
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },

        // === LEGACY COMPATIBILITY ===
        // Keep some legacy color names for backward compatibility
        'orange-yellow-crayola': 'hsl(var(--primary))',
        'vegas-gold': 'hsl(var(--secondary))',
        'eerie-black': 'hsl(var(--background))',
        'smoky-black': 'hsl(var(--muted))',
        'white-1': 'hsl(var(--foreground))',
        'white-2': 'hsl(var(--muted-foreground))',

        // Color system with the new blue palette
        blue: {
          50: '#e3e7f6',
          100: '#b3bee8',
          200: '#8196da',
          300: '#5271C0',
          400: '#384f89',
          500: '#202f56',
          600: '#0a1226',
        },
        // Secondary Blue Scale
        'blue-secondary': {
          50: '#cfdafc',
          100: '#95B2F8',
          200: '#4b8bf4',
          300: '#2667c2',
          400: '#174686',
          500: '#09274f',
          600: '#021028',
        },
        // Neutral Scale
        neutral: {
          50: '#d1d7ec',
          100: '#a0b0d8',
          200: '#6f8ac5',
          300: '#506695',
          400: '#354466',
          500: '#1b253a',
          600: '#0b111d',
        },
        // Additional Variants
        'blue-variant': {
          50: '#e6eafb',
          100: '#B5C0F3',
          200: '#8198eb',
          300: '#4470e1',
          400: '#2d4fa3',
          500: '#1a3068',
          600: '#081433',
        },
        // Focus Colors
        focus: {
          primary: '#5271C0',
          secondary: '#95B2F8',
          accent: '#B5C0F3',
          interactive: '#506695',
          dark: '#283B60',
          border: '#28254F',
        },
        // Technology-specific colors
        tech: {
          unity: '#5271C0',
          unreal: '#95B2F8',
          csharp: '#B5C0F3',
          cpp: '#384f89',
          javascript: '#4b8bf4',
          typescript: '#2667c2',
          web: '#95B2F8',
          mobile: '#B5C0F3',
          application: '#506695',
        },
        // Base semantic colors using CSS variables for theme switching
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          50: 'hsl(var(--primary-50))',
          100: 'hsl(var(--primary-100))',
          200: 'hsl(var(--primary-200))',
          300: 'hsl(var(--primary-300))',
          400: 'hsl(var(--primary-400))',
          500: 'hsl(var(--primary-500))',
          600: 'hsl(var(--primary-600))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
          50: 'hsl(var(--secondary-50))',
          100: 'hsl(var(--secondary-100))',
          200: 'hsl(var(--secondary-200))',
          300: 'hsl(var(--secondary-300))',
          400: 'hsl(var(--secondary-400))',
          500: 'hsl(var(--secondary-500))',
          600: 'hsl(var(--secondary-600))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
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
        // React Bits style animations
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'tilt': 'tilt 10s infinite linear',
        'background-shine': 'background-shine 2s linear infinite',
        'border-beam': 'border-beam 1.5s linear infinite',
        'meteor': 'meteor 5s linear infinite',
        'ripple': 'ripple 0.6s linear',
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
        // React Bits style keyframes
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(251, 146, 60, 0.2), 0 0 10px rgba(251, 146, 60, 0.2), 0 0 15px rgba(251, 146, 60, 0.2)' },
          '100%': { boxShadow: '0 0 10px rgba(251, 146, 60, 0.4), 0 0 20px rgba(251, 146, 60, 0.4), 0 0 30px rgba(251, 146, 60, 0.4)' },
        },
        tilt: {
          '0%, 50%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(1deg)' },
          '75%': { transform: 'rotate(-1deg)' },
        },
        'background-shine': {
          'from': { backgroundPosition: '0 0' },
          'to': { backgroundPosition: '-200% 0' },
        },
        'border-beam': {
          '100%': { 'offset-distance': '100%' },
        },
        meteor: {
          '0%': { transform: 'rotate(215deg) translateX(0)', opacity: '1' },
          '70%': { opacity: '1' },
          '100%': { transform: 'rotate(215deg) translateX(-500px)', opacity: '0' },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(4)', opacity: '0' },
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
