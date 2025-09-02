'use client';

import React from 'react';
import Image from 'next/image';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cardVariants = cva(
  'rounded-xl border transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'bg-card text-card-foreground border-border shadow-lg hover:shadow-xl',
        elevated: 'bg-card text-card-foreground border-border shadow-xl hover:shadow-2xl',
        interactive: 'bg-card text-card-foreground border-border shadow-lg hover:shadow-xl hover:bg-accent/50 hover:border-accent cursor-pointer',
        outline: 'bg-transparent text-foreground border-border hover:bg-accent/50',
        ghost: 'bg-transparent text-foreground border-transparent hover:bg-accent/50 hover:border-border',
        modern: 'bg-gradient-to-br from-card to-muted text-card-foreground border-border shadow-modern-lg hover:shadow-modern-xl',
        gradient: 'bg-gradient-to-br from-primary/10 to-secondary/10 text-foreground border-primary/20 shadow-lg hover:shadow-xl hover:from-primary/20 hover:to-secondary/20',
      },
      size: {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
        xl: 'p-10',
      },
      rounded: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-lg',
        lg: 'rounded-xl',
        xl: 'rounded-2xl',
        '2xl': 'rounded-3xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      rounded: 'lg',
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  children: React.ReactNode;
  hoverable?: boolean;
  clickable?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, rounded, hoverable = false, clickable = false, children, ...props }, ref) => {
    const cardClasses = cn(
      cardVariants({ variant, size, rounded }),
      hoverable && 'hover:scale-102 hover:shadow-glow transition-transform duration-300',
      clickable && 'cursor-pointer select-none active:scale-98',
      className
    );

    return (
      <div className={cardClasses} ref={ref} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Card sub-components
const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 pb-4', className)}
      {...props}
    />
  )
);

CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('text-h3 font-semibold leading-none tracking-tight text-foreground', className)}
      {...props}
    />
  )
);

CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('text-body-sm text-muted-foreground', className)}
      {...props}
    />
  )
);

CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('text-body', className)} {...props} />
  )
);

CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center pt-4 border-t border-border', className)}
      {...props}
    />
  )
);

CardFooter.displayName = 'CardFooter';

// Preset card components
export const ProjectCard = React.forwardRef<HTMLDivElement, CardProps & {
  title: string;
  description?: string;
  image?: string;
  tags?: string[];
  onClick?: () => void;
}>(
  ({ title, description, image, tags, onClick, className, children, ...props }, ref) => (
    <Card
      variant="interactive"
      className={cn('group overflow-hidden', className)}
      onClick={onClick}
      clickable={!!onClick}
      ref={ref}
      {...props}
    >
      {image && (
        <div className="aspect-video w-full overflow-hidden rounded-t-lg">
          <Image
            src={image}
            alt={title}
            width={400}
            height={225}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle className="group-hover:text-primary transition-colors">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      {children && <CardContent>{children}</CardContent>}
      {tags && tags.length > 0 && (
        <CardFooter className="flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </CardFooter>
      )}
    </Card>
  )
);

ProjectCard.displayName = 'ProjectCard';

export const BlogCard = React.forwardRef<HTMLDivElement, CardProps & {
  title: string;
  excerpt?: string;
  date?: string;
  readTime?: string;
  author?: string;
  category?: string;
  onClick?: () => void;
}>(
  ({ title, excerpt, date, readTime, author, category, onClick, className, ...props }, ref) => (
    <Card
      variant="interactive"
      className={cn('group', className)}
      onClick={onClick}
      clickable={!!onClick}
      ref={ref}
      {...props}
    >
      <CardHeader>
        {category && (
          <span className="inline-flex w-fit items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            {category}
          </span>
        )}
        <CardTitle className="group-hover:text-primary transition-colors">{title}</CardTitle>
        {excerpt && <CardDescription>{excerpt}</CardDescription>}
      </CardHeader>
      <CardFooter className="justify-between text-body-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          {author && <span>{author}</span>}
          {date && <span>•</span>}
          {date && <span>{date}</span>}
        </div>
        {readTime && <span>{readTime}</span>}
      </CardFooter>
    </Card>
  )
);

BlogCard.displayName = 'BlogCard';

export const FeatureCard = React.forwardRef<HTMLDivElement, CardProps & {
  icon?: React.ReactNode;
  title: string;
  description?: string;
}>(
  ({ icon, title, description, className, children, ...props }, ref) => (
    <Card
      variant="modern"
      hoverable
      className={cn('text-center', className)}
      ref={ref}
      {...props}
    >
      {icon && (
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
      )}
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      {children && <CardContent>{children}</CardContent>}
    </Card>
  )
);

FeatureCard.displayName = 'FeatureCard';

export const StatCard = React.forwardRef<HTMLDivElement, CardProps & {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
}>(
  ({ label, value, change, trend, icon, className, ...props }, ref) => (
    <Card
      variant="elevated"
      className={cn('text-center', className)}
      ref={ref}
      {...props}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="text-left">
            <p className="text-body-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {change && (
              <p className={cn(
                'text-body-sm font-medium',
                trend === 'up' && 'text-success',
                trend === 'down' && 'text-destructive',
                trend === 'neutral' && 'text-muted-foreground'
              )}>
                {change}
              </p>
            )}
          </div>
          {icon && (
            <div className="text-3xl text-muted-foreground">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
);

StatCard.displayName = 'StatCard';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, cardVariants };
