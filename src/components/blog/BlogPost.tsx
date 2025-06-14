'use client'

import React from 'react'
import { Calendar, Clock, User, Tag, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { BlogPost as BlogPostType } from '@/lib/blog'
import MarkdownRenderer from './MarkdownRenderer'

interface BlogPostProps {
  post: BlogPostType
}

// Note: Markdown configuration is now handled in MarkdownRenderer

export default function BlogPost({ post }: BlogPostProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <article className="max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-portfolio-muted hover:text-portfolio-accent transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        {/* Category */}
        <div className="mb-4">
                          <span className="inline-block px-3 py-1 text-sm font-medium bg-portfolio-accent text-portfolio-accent-foreground rounded">
            {post.category}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-portfolio-primary mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Meta information */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-portfolio-muted mb-6">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            {post.author}
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {formatDate(post.date)}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {post.readingTime} min read
          </div>
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-portfolio-surface border border-portfolio-border rounded-full text-portfolio-muted hover:border-portfolio-accent transition-colors"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Divider */}
        <div className="w-full h-px bg-portfolio-border mb-8"></div>
      </header>

                  {/* Content */}
      <MarkdownRenderer
        content={post.content}
        className="prose prose-invert max-w-none blog-content"
      />

      {/* Footer */}
      <footer className="mt-12 pt-8 border-t border-portfolio-border">
        <div className="text-center">
          <p className="text-portfolio-muted mb-4">
            Thanks for reading! If you found this article helpful, feel free to share it.
          </p>
          <Link
            href="/blog"
                          className="inline-flex items-center gap-2 px-6 py-3 bg-portfolio-accent text-portfolio-accent-foreground rounded-lg hover:bg-portfolio-accent/90 transition-colors font-medium"
          >
            Read More Articles
          </Link>
        </div>
      </footer>
    </article>
  )
}
