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
    <div className="relative">
      {/* Glass background effects */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <article className="max-w-4xl mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <header className="mb-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 blog-text-secondary hover:blog-interactive transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {/* Category */}
          <div className="mb-6">
            <span className="inline-block px-4 py-2 text-sm font-medium blog-btn-primary rounded-lg">
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold blog-text-primary mb-8 leading-tight">
            {post.title}
          </h1>

          {/* Meta information */}
          <div className="glass-secondary rounded-2xl p-6 mb-8">
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 blog-meta-accent" />
                <span className="blog-text-primary">{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 blog-meta-accent" />
                <span className="blog-text-primary">{formatDate(post.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 blog-meta-accent" />
                <span className="blog-text-primary">{post.readingTime} min read</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="glass-secondary rounded-2xl p-6">
              <div className="flex flex-wrap gap-3">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-2 text-sm blog-tag rounded-lg hover:blog-interactive transition-colors"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </header>

        {/* Content - Dark theme consistent */}
        <div className="blog-content rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="prose prose-xl max-w-none
            prose-headings:blog-text-primary prose-headings:font-bold
            prose-p:blog-text-secondary prose-p:leading-relaxed prose-p:text-lg
            prose-strong:blog-text-primary prose-strong:font-bold
            prose-em:blog-text-secondary prose-em:italic
            prose-a:blog-interactive prose-a:hover:blog-interactive-hover prose-a:underline prose-a:font-medium
            prose-ul:blog-text-secondary prose-ul:list-disc prose-ul:text-lg
            prose-ol:blog-text-secondary prose-ol:list-decimal prose-ol:text-lg
            prose-li:blog-text-secondary prose-li:leading-relaxed prose-li:text-lg
            prose-h1:text-4xl prose-h1:mb-8 prose-h1:mt-12 prose-h1:blog-text-primary
            prose-h2:text-3xl prose-h2:mb-6 prose-h2:mt-10 prose-h2:blog-text-primary
            prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-8 prose-h3:blog-text-primary
            prose-h4:text-xl prose-h4:mb-3 prose-h4:mt-6 prose-h4:blog-text-primary
            prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:blog-content-tertiary prose-blockquote:p-6 prose-blockquote:rounded-r-lg prose-blockquote:blog-text-secondary
            prose-code:blog-code prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-base prose-code:font-mono
            prose-pre:blog-code prose-pre:text-base
            prose-table:blog-text-secondary
            prose-th:blog-text-primary prose-th:font-bold prose-th:blog-content-secondary
            prose-td:blog-text-secondary">
            <MarkdownRenderer content={post.content} />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8">
          <div className="glass-secondary rounded-2xl p-6 text-center">
            <p className="blog-text-primary mb-4 text-lg">
              Thanks for reading! If you found this article helpful, feel free to share it.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank')}
                className="px-6 py-3 blog-btn-primary rounded-lg font-medium"
              >
                Share on Twitter
              </button>
              <button
                onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}
                className="px-6 py-3 blog-btn-secondary rounded-lg font-medium"
              >
                Share on LinkedIn
              </button>
            </div>
          </div>
        </footer>
      </article>
    </div>
  )
}
