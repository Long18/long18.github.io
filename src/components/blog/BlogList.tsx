'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, Calendar, Clock, Tag, Filter, ArrowRight } from 'lucide-react'
import { BlogPost } from '@/lib/blog'
// import { Button } from '@/components/ui/Button'
import { Typography } from '@/components/ui/Typography'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'

interface BlogListProps {
  posts: BlogPost[]
  locale: string
}

export default function BlogList({ posts, locale }: BlogListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedTag, setSelectedTag] = useState<string>('all')

  // Get unique categories and tags
  const categories = useMemo(() => {
    const cats = Array.from(new Set(posts.map(post => post.category)))
    return ['all', ...cats]
  }, [posts])

  const tags = useMemo(() => {
    const allTags = posts.flatMap(post => post.tags || [])
    const uniqueTags = Array.from(new Set(allTags))
    return ['all', ...uniqueTags]
  }, [posts])

  // Filter posts
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory
      const matchesTags = selectedTag === 'all' || (post.tags && post.tags.includes(selectedTag))

      return matchesSearch && matchesCategory && matchesTags
    })
  }, [posts, searchTerm, selectedCategory, selectedTag])

  const formatDate = (dateString: string) => {
    const localeCode = locale === 'vi' ? 'vi-VN' : 'en-US'
    return new Date(dateString).toLocaleDateString(localeCode, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="relative">
      {/* Glass background effects */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Header */}
        <header className="mb-12 text-center">
          <Typography variant="hero" color="glass" className="mb-6">
            Technical Blog
          </Typography>
          <Typography variant="body-lg" color="glass-secondary" className="max-w-3xl mx-auto leading-relaxed">
            Deep dives into game development, Unity optimization, and software architecture
          </Typography>
        </header>

        {/* Filters */}
        <div className="blog-content-secondary rounded-3xl p-8 mb-12 shadow-2xl">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Search */}
            <div className="relative">
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search className="w-5 h-5" />}
                variant="glass"
                className="w-full"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 blog-text-muted w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-12 pr-4 py-3 blog-filter rounded-xl focus:outline-none focus:ring-2 focus:ring-blog-interactive focus:border-transparent transition-all appearance-none cursor-pointer"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>

            {/* Tag Filter */}
            <div className="relative">
              <Tag className="absolute left-4 top-1/2 transform -translate-y-1/2 blog-text-muted w-5 h-5" />
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full pl-12 pr-4 py-3 blog-filter rounded-xl focus:outline-none focus:ring-2 focus:ring-blog-interactive focus:border-transparent transition-all appearance-none cursor-pointer"
              >
                {tags.map(tag => (
                  <option key={tag} value={tag}>
                    {tag === 'all' ? 'All Tags' : tag}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-6 pt-6 border-t blog-border">
            <p className="blog-text-muted text-center">
              Showing <span className="font-semibold blog-text-primary">{filteredPosts.length}</span> of{' '}
              <span className="font-semibold blog-text-primary">{posts.length}</span> articles
            </p>
          </div>
        </div>

        {/* Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <article
                key={post.slug}
                className="blog-card rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 group"
              >
                <div className="p-6">
                  {/* Category */}
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 text-sm font-medium blog-btn-primary rounded-lg">
                      {post.category}
                    </span>
                  </div>

                  {/* Title */}
                  <Typography variant="h3" color="glass" className="mb-3 group-hover:blog-interactive transition-colors line-clamp-2">
                    <Link href={`/blog/${post.slug}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </Typography>

                  {/* Excerpt */}
                  <p className="blog-text-secondary mb-4 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-sm blog-text-muted mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 blog-meta-accent" />
                      <span className="blog-text-primary">{formatDate(post.date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 blog-meta-accent" />
                      <span className="blog-text-primary">{post.readingTime} min</span>
                    </div>
                  </div>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-2 py-1 text-xs blog-tag rounded-lg hover:blog-interactive transition-colors cursor-pointer"
                          onClick={() => setSelectedTag(tag)}
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                      {post.tags.length > 3 && (
                        <span className="text-xs blog-text-muted">
                          +{post.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Read More */}
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 blog-interactive hover:blog-interactive-hover font-semibold transition-colors"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="blog-content-secondary rounded-3xl p-12 shadow-2xl max-w-md mx-auto">
              <div className="blog-text-muted mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-2xl font-bold blog-text-primary mb-4">No articles found</h3>
              <p className="blog-text-secondary mb-6">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('all')
                  setSelectedTag('all')
                }}
                className="px-6 py-3 blog-btn-primary text-white font-semibold rounded-xl transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
