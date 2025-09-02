import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const typographyVariants = cva("", {
  variants: {
    variant: {
      hero: "text-hero font-display font-bold tracking-tight text-gradient-primary",
      display: "text-display font-display font-bold tracking-tight",
      h1: "text-h1 font-display font-bold tracking-tight",
      h2: "text-h2 font-display font-semibold tracking-tight",
      h3: "text-h3 font-display font-semibold",
      h4: "text-h4 font-display font-semibold",
      "body-lg": "text-body-lg font-body",
      body: "text-body font-body",
      "body-sm": "text-body-sm font-body",
      caption: "text-caption font-body text-muted-foreground",
      code: "font-mono text-sm bg-muted px-1.5 py-0.5 rounded-md",
    },
    color: {
      default: "",
      primary: "text-primary",
      secondary: "text-secondary",
      muted: "text-muted-foreground",
      accent: "text-accent-foreground",
      gradient: "text-gradient-primary",
      "gradient-accent": "text-gradient-accent",
      glass: "text-glass-primary",
      "glass-secondary": "text-glass-secondary",
      "glass-gradient": "text-glass-gradient",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
      justify: "text-justify",
    },
  },
  defaultVariants: {
    variant: "body",
    color: "default",
    align: "left",
  },
})

export interface TypographyProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'color'>,
    VariantProps<typeof typographyVariants> {
  as?: keyof JSX.IntrinsicElements
  children: React.ReactNode
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant, color, align, as, children, ...props }, ref) => {
    // Determine the appropriate HTML element based on variant
    const getElement = () => {
      if (as) return as

      switch (variant) {
        case "hero":
        case "display":
        case "h1":
          return "h1"
        case "h2":
          return "h2"
        case "h3":
          return "h3"
        case "h4":
          return "h4"
        case "caption":
          return "small"
        case "code":
          return "code"
        default:
          return "p"
      }
    }

    const Element = getElement()

    // Create element with proper typing
    return React.createElement(
      Element,
      {
        ref,
        className: cn(typographyVariants({ variant, color, align, className })),
        ...props,
      },
      children
    )
  }
)
Typography.displayName = "Typography"

// Convenience components for common use cases
const Heading = React.forwardRef<
  HTMLHeadingElement,
  Omit<TypographyProps, "variant"> & { level?: 1 | 2 | 3 | 4 }
>(({ level = 1, ...props }, ref) => {
  const variant = `h${level}` as "h1" | "h2" | "h3" | "h4"
  return <Typography ref={ref} variant={variant} {...props} />
})
Heading.displayName = "Heading"

const Text = React.forwardRef<
  HTMLParagraphElement,
  Omit<TypographyProps, "variant"> & { size?: "sm" | "default" | "lg" }
>(({ size = "default", ...props }, ref) => {
  const variant = size === "sm" ? "body-sm" : size === "lg" ? "body-lg" : "body"
  return <Typography ref={ref} variant={variant} {...props} />
})
Text.displayName = "Text"

const Code = React.forwardRef<
  HTMLElement,
  Omit<TypographyProps, "variant">
>(({ ...props }, ref) => {
  return <Typography ref={ref} variant="code" {...props} />
})
Code.displayName = "Code"

export { Typography, Heading, Text, Code, typographyVariants }
