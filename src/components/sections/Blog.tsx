'use client'

import Link from 'next/link'
import { Calendar, Clock, ArrowRight, BookOpen, Tag, TrendingUp, Users, Eye } from 'lucide-react'
import { AnimatedButton, AnimatedCard, AnimatedText } from '../ui'

interface BlogProps {
  locale?: string
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

export default function Blog({ locale = 'en' }: BlogProps) {
  const formatDate = (dateString: string) => {
    const localeCode = locale === 'vi' ? 'vi-VN' : 'en-US'
    return new Date(dateString).toLocaleDateString(localeCode, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <section className="blog-section relative min-h-screen w-full">
      {/* Full-screen Glass background effects */}
      <div className="fixed inset-0 pointer-events-none opacity-10 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20" />

        {/* Left side decorative elements */}
        <div className="absolute top-20 left-4 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl animate-pulse" />
        <div className="absolute top-1/3 left-8 w-48 h-48 bg-cyan-500/8 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-32 left-12 w-24 h-24 bg-indigo-500/12 rounded-full blur-xl animate-pulse delay-3000" />

        {/* Right side decorative elements */}
        <div className="absolute top-32 right-4 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl animate-pulse delay-500" />
        <div className="absolute top-2/3 right-8 w-56 h-56 bg-violet-500/8 rounded-full blur-3xl animate-pulse delay-1500" />
        <div className="absolute bottom-20 right-6 w-32 h-32 bg-pink-500/10 rounded-full blur-xl animate-pulse delay-2500" />

        {/* Center large background */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[900px] bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-2000" />

        {/* Additional ambient lighting */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl animate-pulse delay-4000" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl animate-pulse delay-5000" />
      </div>

      {/* Side gradient overlays for visual flow */}
      <div className="fixed left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black/20 to-transparent pointer-events-none z-5"></div>
      <div className="fixed right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black/20 to-transparent pointer-events-none z-5"></div>

      {/* Full-width container with proper content width */}
      <div className="relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-12 lg:py-16">
        {/* Section Header */}
        <header className="mb-16 text-center pt-16">
          <h1 className="text-4xl md:text-5xl font-bold blog-text-primary mb-6">
            Technical Blog
          </h1>

          <p className="max-w-3xl mx-auto mb-8 leading-relaxed blog-text-secondary text-lg">
            Insights, tutorials, and deep dives into game development, Unity optimization, and software architecture.
          </p>

                    {/* Enhanced Blog Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <AnimatedCard
              variant="glass"
              spotlight={false}
              className="p-6 text-center"
            >
              <div className="flex items-center justify-center gap-3 mb-2">
                <BookOpen className="w-6 h-6 text-glass-accent" />
                <span className="text-2xl font-bold text-glass-text-primary">{featuredPosts.length}</span>
              </div>
              <p className="text-glass-text-secondary font-medium">Featured Articles</p>
            </AnimatedCard>

            <AnimatedCard
              variant="glass"
              spotlight={false}
              className="p-6 text-center"
            >
              <div className="flex items-center justify-center gap-3 mb-2">
                <TrendingUp className="w-6 h-6 text-glass-accent-secondary" />
                <span className="text-2xl font-bold text-glass-text-primary">15K+</span>
              </div>
              <p className="text-glass-text-secondary font-medium">Monthly Readers</p>
            </AnimatedCard>

            <AnimatedCard
              variant="glass"
              spotlight={false}
              className="p-6 text-center"
            >
              <div className="flex items-center justify-center gap-3 mb-2">
                <Tag className="w-6 h-6 text-glass-accent-light" />
                <span className="text-2xl font-bold text-glass-text-primary">Game Dev</span>
              </div>
              <p className="text-glass-text-secondary font-medium">Primary Focus</p>
            </AnimatedCard>
          </div>
        </header>

        {/* Enhanced Featured Posts */}
        <div className="grid gap-8 md:grid-cols-2 mb-16">
          {featuredPosts.map((post) => (
            <AnimatedCard
              key={post.slug}
              variant="glass"
              spotlight={false}
              shimmer={false}
              className="overflow-hidden group hover:scale-[1.01] transition-all duration-300"
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

                {/* Enhanced Title */}
                <AnimatedText
                  as="h2"
                  variant="gradient"
                  size="xl"
                  weight="bold"
                  animation="slideUp"
                  className="mb-4 group-hover:text-glass-accent transition-colors line-clamp-2"
                >
                  <Link href={`/blog/${post.slug}`} className="hover:underline">
                    {post.title}
                  </Link>
                </AnimatedText>

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

                {/* Enhanced Read More Button */}
                                  <AnimatedButton
                    variant="glass"
                    size="default"
                    ripple={false}
                    glow={false}
                    onClick={() => window.location.href = `/blog/${post.slug}`}
                    className="w-full text-glass-accent hover:text-glass-accent-light"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Read Article
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </AnimatedButton>
              </div>
            </AnimatedCard>
          ))}
        </div>

        {/* Enhanced Call to Action */}
        <div className="text-center">
          <AnimatedButton
            variant="gradient"
            size="lg"
            ripple={false}
            glow={false}
            onClick={() => window.location.href = '/blog'}
            className="px-8 py-4"
          >
            <BookOpen className="w-6 h-6 mr-3" />
            View All Articles
            <ArrowRight className="w-6 h-6 ml-3" />
          </AnimatedButton>
        </div>

        {/* Enhanced Additional Info */}
        <div className="mt-16 text-center">
          <AnimatedCard
            variant="glass"
            spotlight={false}
            className="p-8 max-w-2xl mx-auto"
          >
            <AnimatedText
              as="p"
              variant="default"
              size="lg"
              weight="normal"
              animation="fadeIn"
              className="text-glass-text-primary mb-6"
            >
              Want to stay updated? Follow me for the latest articles and insights.
            </AnimatedText>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <AnimatedButton
                variant="glass"
                size="default"
                ripple={false}
                onClick={() => window.open('https://www.linkedin.com/in/william186/', '_blank')}
                className="text-glass-accent hover:text-glass-accent-light"
              >
                <Users className="w-4 h-4 mr-2" />
                Follow on LinkedIn
              </AnimatedButton>

              <AnimatedButton
                variant="glass"
                size="default"
                ripple={false}
                onClick={() => window.open('https://github.com/Long18', '_blank')}
                className="text-glass-accent hover:text-glass-accent-light"
              >
                <Eye className="w-4 h-4 mr-2" />
                Watch on GitHub
              </AnimatedButton>
            </div>
          </AnimatedCard>
        </div>
        </div>
      </div>
    </section>
  )
}
