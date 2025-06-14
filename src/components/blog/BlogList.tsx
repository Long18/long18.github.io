'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, Calendar, Clock, Tag } from 'lucide-react'
import { BlogPost } from '@/lib/blog'

interface BlogListProps {
  posts: BlogPost[]
}

export default function BlogList({ posts }: BlogListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedTag, setSelectedTag] = useState('all')

  // Get unique categories and tags
  const categories = useMemo(() => {
    const cats = new Set(posts.map(post => post.category))
    return ['all', ...Array.from(cats)]
  }, [posts])

  const tags = useMemo(() => {
    const allTags = new Set<string>()
    posts.forEach(post => post.tags.forEach(tag => allTags.add(tag)))
    return ['all', ...Array.from(allTags)]
  }, [posts])

  // Filter posts
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory
      const matchesTag = selectedTag === 'all' || post.tags.includes(selectedTag)

      return matchesSearch && matchesCategory && matchesTag
    })
  }, [posts, searchTerm, selectedCategory, selectedTag])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-portfolio-muted mb-4">
          No blog posts yet
        </h2>
        <p className="text-portfolio-muted">
          Check back soon for technical articles and insights!
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-portfolio-muted w-5 h-5" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-portfolio-surface border border-portfolio-border rounded-lg text-portfolio-primary placeholder-portfolio-muted focus:outline-none focus:border-portfolio-accent transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-portfolio-surface border border-portfolio-border rounded-lg text-portfolio-primary focus:outline-none focus:border-portfolio-accent transition-colors"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>

          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="px-4 py-2 bg-portfolio-surface border border-portfolio-border rounded-lg text-portfolio-primary focus:outline-none focus:border-portfolio-accent transition-colors"
          >
            {tags.map(tag => (
              <option key={tag} value={tag}>
                {tag === 'all' ? 'All Tags' : tag}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-6">
        <p className="text-portfolio-muted">
          {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'} found
        </p>
      </div>

      {/* Posts Grid */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-portfolio-muted">No articles match your search criteria.</p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <article
              key={post.slug}
              className="bg-portfolio-surface border border-portfolio-border rounded-lg overflow-hidden hover:border-portfolio-accent transition-colors group"
            >
              <div className="p-6">
                {/* Featured badge */}
                {post.featured && (
                  <div className="mb-3">
                    <span className="inline-block px-2 py-1 text-xs font-semibold bg-portfolio-accent text-portfolio-accent-foreground rounded">
                      Featured
                    </span>
                  </div>
                )}

                {/* Category */}
                <div className="mb-3">
                  <span className="text-sm text-portfolio-accent font-medium">
                    {post.category}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-xl font-semibold text-portfolio-primary mb-3 group-hover:text-portfolio-accent transition-colors">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h2>

                {/* Excerpt */}
                <p className="text-portfolio-muted mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Meta info */}
                <div className="flex items-center gap-4 text-sm text-portfolio-muted mb-4">
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
                  <div className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-portfolio-surface-secondary border border-portfolio-border rounded text-portfolio-muted"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="text-xs text-portfolio-muted">
                        +{post.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
