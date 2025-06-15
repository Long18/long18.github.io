'use client'

import Link from 'next/link'
import { Calendar, Clock, ArrowRight, BookOpen, Tag } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Typography } from '@/components/ui/Typography'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

interface BlogProps {
  locale: string
}

// Static featured posts data for the portfolio preview
const featuredPosts = [
  {
    slug: 'unity-webgl-optimization-techniques',
    title: 'Unity WebGL Optimization: Techniques for Better Performance',
    date: '2024-01-15',
    excerpt: 'Learn advanced techniques to optimize Unity WebGL builds for better performance, faster loading times, and improved user experience in web browsers.',
    category: 'Game Development',
    tags: ['Unity', 'WebGL', 'Performance', 'Optimization', 'Game Development'],
    readingTime: 8,
    featured: true
  },
  {
    slug: 'building-scalable-game-architecture',
    title: 'Building Scalable Game Architecture: Lessons from Crypto Quest',
    date: '2024-01-10',
    excerpt: 'Insights from developing Crypto Quest with a 14-member team, covering scalable architecture patterns, team collaboration, and technical challenges in blockchain gaming.',
    category: 'Game Development',
    tags: ['Game Architecture', 'Unity', 'Team Development', 'RPG', 'Blockchain', 'Agile'],
    readingTime: 12,
    featured: true
  }
]

export default function Blog({ locale }: BlogProps) {
  const formatDate = (dateString: string) => {
    const localeCode = locale === 'vi' ? 'vi-VN' : 'en-US'
    return new Date(dateString).toLocaleDateString(localeCode, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <section className="blog-section relative">
      {/* Glass background effects */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <header className="mb-16 text-center">
          <Typography variant="hero" color="glass" className="mb-6">
            Technical Blog
          </Typography>
          <Typography variant="body-lg" color="glass-secondary" className="max-w-3xl mx-auto mb-8 leading-relaxed">
            Insights, tutorials, and deep dives into game development, Unity optimization, and software architecture.
          </Typography>

          {/* Blog Stats */}
          <div className="flex items-center justify-center gap-8">
            <div className="flex items-center gap-3 glass-secondary px-6 py-3 rounded-xl border border-glass-border">
              <BookOpen className="w-5 h-5 text-glass-accent" />
              <span className="text-glass-text-primary font-medium">{featuredPosts.length} Featured Articles</span>
            </div>
            <div className="flex items-center gap-3 glass-secondary px-6 py-3 rounded-xl border border-glass-border">
              <Tag className="w-5 h-5 text-glass-accent" />
              <span className="text-glass-text-primary font-medium">Game Development Focus</span>
            </div>
          </div>
        </header>

        {/* Featured Posts */}
        <div className="grid gap-8 md:grid-cols-2 mb-16">
          {featuredPosts.map((post) => (
            <article
              key={post.slug}
              className="glass-secondary glass-hover rounded-3xl overflow-hidden shadow-glass-lg hover:shadow-glass-glow transition-all duration-300 group border border-glass-border"
            >
              <div className="p-8">
                {/* Featured Badge */}
                <div className="mb-4">
                  <span className="inline-block px-4 py-2 text-sm font-semibold bg-gradient-to-r from-glass-accent to-glass-accent-secondary text-white rounded-lg">
                    Featured
                  </span>
                </div>

                {/* Category */}
                <div className="mb-4">
                  <span className="text-sm text-glass-accent font-medium uppercase tracking-wide">
                    {post.category}
                  </span>
                </div>

                {/* Title */}
                <Typography variant="h2" color="glass" className="mb-4 group-hover:text-glass-accent transition-colors line-clamp-2">
                  <Link href={`/blog/${post.slug}`} className="hover:underline">
                    {post.title}
                  </Link>
                </Typography>

                {/* Excerpt */}
                <p className="text-glass-text-secondary mb-6 line-clamp-3 leading-relaxed text-lg">
                  {post.excerpt}
                </p>

                {/* Meta Info */}
                <div className="flex items-center gap-6 text-sm text-glass-text-muted mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-glass-accent" />
                    <span className="text-glass-text-primary font-medium">{formatDate(post.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-glass-accent" />
                    <span className="text-glass-text-primary font-medium">{post.readingTime} min read</span>
                  </div>
                </div>

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1 text-sm glass-tertiary border border-glass-border rounded-lg hover:text-glass-accent transition-colors"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="text-sm text-glass-text-muted">
                        +{post.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Read More Link */}
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 text-glass-accent hover:text-glass-accent-light font-semibold text-lg transition-colors"
                >
                  Read Article
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Button
            variant="gradient"
            size="xl"
            asChild
          >
            <Link href="/blog" className="inline-flex items-center gap-3">
              <BookOpen className="w-6 h-6" />
              View All Articles
              <ArrowRight className="w-6 h-6" />
            </Link>
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="glass-secondary rounded-2xl p-8 max-w-2xl mx-auto border border-glass-border">
            <p className="text-glass-text-primary text-lg">
              Want to stay updated? Follow me on{' '}
              <a
                href="https://www.linkedin.com/in/william186/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-glass-accent hover:text-glass-accent-light hover:underline transition-colors font-medium"
              >
                LinkedIn
              </a>{' '}
              for the latest articles and insights.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
