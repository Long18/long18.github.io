'use client'

import Link from 'next/link'
import { Calendar, Clock, ArrowRight, BookOpen, Tag } from 'lucide-react'

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
    <section className="blog-section">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <header className="mb-12 text-center">
                      <h2 className="text-3xl md:text-4xl font-bold text-portfolio-text-primary mb-4">
            Technical Blog
          </h2>
          <p className="text-lg text-portfolio-text-secondary max-w-2xl mx-auto mb-6">
            Insights, tutorials, and deep dives into game development, Unity optimization, and software architecture.
          </p>

          {/* Blog Stats */}
          <div className="flex items-center justify-center gap-8 text-sm text-portfolio-text-secondary">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-portfolio-accent" />
              <span>{featuredPosts.length} Featured Articles</span>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-portfolio-accent" />
              <span>Game Development Focus</span>
            </div>
          </div>
        </header>

        {/* Featured Posts */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 mb-12">
          {featuredPosts.map((post) => (
            <article
              key={post.slug}
              className="bg-portfolio-surface-secondary border border-border rounded-xl overflow-hidden hover:border-portfolio-accent/50 transition-all duration-300 group hover:transform hover:scale-[1.02]"
            >
              <div className="p-6">
                {/* Featured Badge */}
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 text-xs font-semibold bg-portfolio-accent text-portfolio-accent-foreground rounded-full">
                    Featured
                  </span>
                </div>

                {/* Category */}
                <div className="mb-3">
                  <span className="text-sm text-portfolio-accent font-medium uppercase tracking-wide">
                    {post.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-portfolio-text-primary mb-3 group-hover:text-portfolio-accent transition-colors line-clamp-2">
                  <Link href={`/blog/${post.slug}`} className="hover:underline">
                    {post.title}
                  </Link>
                </h3>

                {/* Excerpt */}
                <p className="text-portfolio-text-secondary mb-4 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>

                {/* Meta Info */}
                <div className="flex items-center gap-4 text-sm text-portfolio-text-secondary mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(post.date)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {post.readingTime} min read
                  </div>
                </div>

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-portfolio-surface-tertiary border border-border rounded text-portfolio-text-secondary"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="text-xs text-portfolio-text-secondary">
                        +{post.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Read More Link */}
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 text-portfolio-accent hover:text-portfolio-accent/80 font-medium text-sm transition-colors group-hover:gap-3"
                >
                  Read Article
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-portfolio-accent to-portfolio-accent/80 text-portfolio-accent-foreground font-semibold rounded-xl hover:from-portfolio-accent/90 hover:to-portfolio-accent/70 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <BookOpen className="w-5 h-5" />
            View All Articles
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-portfolio-text-secondary text-sm">
            Want to stay updated? Follow me on{' '}
            <a
              href="https://www.linkedin.com/in/william186/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-portfolio-accent hover:underline"
            >
              LinkedIn
            </a>{' '}
            for the latest articles and insights.
          </p>
        </div>
      </div>
    </section>
  )
}
