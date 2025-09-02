'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, Calendar, Clock, Tag, Filter, ArrowRight, BookOpen, TrendingUp } from 'lucide-react'
import { BlogPost } from '@/lib/blog'



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
    <div className="relative min-h-screen w-full">
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
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold blog-text-primary mb-6">
            Technical Blog
          </h1>

          <p className="max-w-3xl mx-auto leading-relaxed blog-text-secondary mb-8 text-lg">
            Deep dives into game development, Unity optimization, and software architecture
          </p>

          {/* Blog Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="glass-secondary rounded-2xl p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <BookOpen className="w-5 h-5 blog-meta-accent" />
                <span className="text-xl font-bold blog-text-primary">{posts.length}</span>
              </div>
              <p className="blog-text-secondary text-sm">Total Articles</p>
            </div>

            <div className="glass-secondary rounded-2xl p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Tag className="w-5 h-5 blog-meta-accent" />
                <span className="text-xl font-bold blog-text-primary">{tags.length - 1}</span>
              </div>
              <p className="blog-text-secondary text-sm">Topics Covered</p>
            </div>

            <div className="glass-secondary rounded-2xl p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <TrendingUp className="w-5 h-5 blog-meta-accent" />
                <span className="text-xl font-bold blog-text-primary">Active</span>
              </div>
              <p className="blog-text-secondary text-sm">Publishing Status</p>
            </div>
          </div>
        </header>

        {/* Filters */}
        <div className="glass-secondary rounded-2xl p-8 mb-12">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 blog-text-muted w-5 h-5 z-10" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600/30 text-white placeholder:text-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all backdrop-blur-sm"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 blog-text-muted w-5 h-5 z-10" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600/30 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer backdrop-blur-sm"
              >
                {categories.map(category => (
                  <option key={category} value={category} className="bg-gray-800 text-white">
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>

            {/* Tag Filter */}
            <div className="relative">
              <Tag className="absolute left-4 top-1/2 transform -translate-y-1/2 blog-text-muted w-5 h-5 z-10" />
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600/30 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer backdrop-blur-sm"
              >
                {tags.map(tag => (
                  <option key={tag} value={tag} className="bg-gray-800 text-white">
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
              <div
                key={post.slug}
                className="glass-secondary rounded-2xl overflow-hidden group hover:scale-[1.01] transition-all duration-300"
              >
                <div className="p-6">
                  {/* Category */}
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 text-sm font-medium blog-btn-primary rounded-lg">
                      {post.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold blog-text-primary mb-3 group-hover:blog-interactive transition-colors line-clamp-2">
                    <Link href={`/blog/${post.slug}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </h3>

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

                  {/* Read More Button */}
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center justify-center w-full px-4 py-2 blog-btn-primary rounded-lg font-medium transition-colors"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Read More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="glass-secondary rounded-2xl p-12 max-w-md mx-auto">
              <div className="blog-text-secondary mb-4">
                <Search className="w-16 h-16 mx-auto animate-pulse" />
              </div>

              <h3 className="text-xl font-bold blog-text-primary mb-4">
                No articles found
              </h3>

              <p className="blog-text-secondary mb-6">
                Try adjusting your search terms or filters to find what you&apos;re looking for.
              </p>

              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('all')
                  setSelectedTag('all')
                }}
                className="px-6 py-3 blog-btn-primary rounded-lg font-medium"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  )
}
