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
      colors: {
        // === LAYER 1: FOUNDATION COLORS (Design Tokens) ===
        // Based on Tailwind's 11-step color scale (50-950)
        // Reference: https://tailwindcss.com/docs/colors

        // Semantic Base Layer (Shadcn/ui compatible)
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: 'hsl(var(--card))',
        'card-foreground': 'hsl(var(--card-foreground))',
        popover: 'hsl(var(--popover))',
        'popover-foreground': 'hsl(var(--popover-foreground))',

        // Primary Brand Colors (Portfolio Identity)
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

        // Secondary Brand Colors
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

        // === LAYER 2: SEMANTIC UI COLORS ===
        // Functional color roles with clear purpose

        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },

        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },

        // Status Colors (Following Tailwind's semantic approach)
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

        // === LAYER 3: DOMAIN-SPECIFIC COLORS ===
        // Portfolio-specific semantic colors

        portfolio: {
          // Surface hierarchy
          surface: {
            primary: 'hsl(var(--portfolio-surface-primary))',
            secondary: 'hsl(var(--portfolio-surface-secondary))',
            tertiary: 'hsl(var(--portfolio-surface-tertiary))',
          },

          // Brand accent system
          accent: {
            DEFAULT: 'hsl(var(--portfolio-accent))',
            foreground: 'hsl(var(--portfolio-accent-foreground))',
            muted: 'hsl(var(--portfolio-accent-muted))',
          },

          // Text hierarchy
          text: {
            primary: 'hsl(var(--portfolio-text-primary))',
            secondary: 'hsl(var(--portfolio-text-secondary))',
            muted: 'hsl(var(--portfolio-text-muted))',
            inverse: 'hsl(var(--portfolio-text-inverse))',
          },

          // Interactive states
          interactive: {
            DEFAULT: 'hsl(var(--portfolio-interactive))',
            hover: 'hsl(var(--portfolio-interactive-hover))',
            active: 'hsl(var(--portfolio-interactive-active))',
            disabled: 'hsl(var(--portfolio-interactive-disabled))',
          },
        },

        // === LAYER 4: TECHNOLOGY COLORS ===
        // Organized by category with consistent naming

        tech: {
          // Game Development
          unity: {
            DEFAULT: 'hsl(var(--tech-unity))',
            foreground: 'hsl(var(--tech-unity-foreground))',
          },
          unreal: {
            DEFAULT: 'hsl(var(--tech-unreal))',
            foreground: 'hsl(var(--tech-unreal-foreground))',
          },

          // Programming Languages
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

          // Development Categories
          web: {
            DEFAULT: 'hsl(var(--tech-web))',
            foreground: 'hsl(var(--tech-web-foreground))',
          },
          mobile: {
            DEFAULT: 'hsl(var(--tech-mobile))',
            foreground: 'hsl(var(--tech-mobile-foreground))',
          },
          application: {
            DEFAULT: 'hsl(var(--tech-application))',
            foreground: 'hsl(var(--tech-application-foreground))',
          },

          // Default fallback
          default: {
            DEFAULT: 'hsl(var(--tech-default))',
            foreground: 'hsl(var(--tech-default-foreground))',
          },

          // === SYNTAX HIGHLIGHTING COLORS ===
          // Professional code block syntax highlighting
          syntax: {
            // Code block background (dark theme)
            background: '#282C34',

            // Syntax highlighting colors (VS Code Dark+ theme inspired)
            keyword: '#C678DD',      // light purple for keywords (if, else, function, etc.)
            string: '#98C379',       // green for strings and literals
            comment: '#5C6370',      // gray for comments
            function: '#61AFEF',     // blue for functions and decorators
            import: '#E06C75',       // magenta for imports and built-in types
            text: '#ABB2BF',         // light gray for variable names and general text
            number: '#D19A66',       // orange for numbers
            operator: '#56B6C2',     // cyan for operators
            punctuation: '#ABB2BF',  // light gray for punctuation

            // UI elements
            border: 'rgba(255, 255, 255, 0.1)',
            scrollbar: 'rgba(255, 255, 255, 0.2)',
            scrollbarHover: 'rgba(255, 255, 255, 0.3)',

            // Copy button colors
            copyButton: 'rgba(255, 255, 255, 0.1)',
            copyButtonHover: 'rgba(255, 255, 255, 0.2)',
            copyButtonText: '#ABB2BF',
            copyButtonSuccess: '#98C379',
          },
        },

        // === LAYER 5: DATA VISUALIZATION ===
        // Chart colors following Tailwind's approach
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },

        // === LEGACY SUPPORT (Deprecated - for migration) ===
        // Keep temporarily for backward compatibility
        'smoky-black': 'hsl(var(--portfolio-surface-primary))',
        'eerie-black-1': 'hsl(var(--portfolio-surface-secondary))',
        'eerie-black-2': 'hsl(var(--portfolio-surface-tertiary))',
        'orange-yellow-crayola': 'hsl(var(--portfolio-accent))',
        'vegas-gold': 'hsl(var(--secondary))',
        'unity-tag': 'hsl(var(--tech-unity))',
        'unreal-tag': 'hsl(var(--tech-unreal))',
        'application-tag': 'hsl(var(--tech-application))',
      },

      fontFamily: {
        sans: ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },

      // === SPACING SCALE ===
      // Following Tailwind's consistent spacing system
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },

      // === ANIMATION SYSTEM ===
      // Clean, purposeful animations
      animation: {
        // Core animations
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-subtle': 'pulseSubtle 2s ease-in-out infinite',

        // Enhanced animations for portfolio
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'fade-in-down': 'fadeInDown 0.8s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.8s ease-out forwards',
        'slide-in-right': 'slideInRight 0.8s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'gradient-shift': 'gradientShift 3s ease infinite',
      },

      keyframes: {
        // Core keyframes
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },

        // Enhanced keyframes
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },

  // === PLUGINS ===
  plugins: [
    // Custom color utilities plugin
    function({ addUtilities, theme }) {
      const newUtilities = {
        // Portfolio-specific utilities
        '.text-portfolio-gradient': {
          background: `linear-gradient(135deg, ${theme('colors.portfolio.accent.DEFAULT')}, ${theme('colors.primary.DEFAULT')})`,
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },

        // Tech tag utilities
        '.tech-tag': {
          '@apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors': {},
        },
      };

      addUtilities(newUtilities);
    },

    // Touch device variants
    function({ addVariant }) {
      addVariant('touch', '@media (pointer: coarse)');
      addVariant('no-touch', '@media (pointer: fine)');
    },
  ],
};
