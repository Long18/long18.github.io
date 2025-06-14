'use client'

import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { BlogPost } from '@/lib/blog'

interface BlogNavigationProps {
  previousPost: BlogPost | null
  nextPost: BlogPost | null
}

export default function BlogNavigation({ previousPost, nextPost }: BlogNavigationProps) {
  if (!previousPost && !nextPost) {
    return null
  }

  return (
    <nav className="mt-12 pt-8 border-t border-portfolio-border">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Previous Post */}
        <div className="flex justify-start">
          {previousPost ? (
            <Link
              href={`/blog/${previousPost.slug}`}
              className="group flex items-start gap-4 p-4 bg-portfolio-surface border border-portfolio-border rounded-lg hover:border-portfolio-accent transition-colors max-w-sm"
            >
              <div className="flex-shrink-0 mt-1">
                <ChevronLeft className="w-5 h-5 text-portfolio-muted group-hover:text-portfolio-accent transition-colors" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-portfolio-muted mb-1">Previous</p>
                <h3 className="text-portfolio-primary group-hover:text-portfolio-accent transition-colors font-medium line-clamp-2">
                  {previousPost.title}
                </h3>
                <p className="text-sm text-portfolio-muted mt-1">
                  {previousPost.category}
                </p>
              </div>
            </Link>
          ) : (
            <div></div>
          )}
        </div>

        {/* Next Post */}
        <div className="flex justify-end">
          {nextPost ? (
            <Link
              href={`/blog/${nextPost.slug}`}
              className="group flex items-start gap-4 p-4 bg-portfolio-surface border border-portfolio-border rounded-lg hover:border-portfolio-accent transition-colors max-w-sm text-right"
            >
              <div className="min-w-0">
                <p className="text-sm text-portfolio-muted mb-1">Next</p>
                <h3 className="text-portfolio-primary group-hover:text-portfolio-accent transition-colors font-medium line-clamp-2">
                  {nextPost.title}
                </h3>
                <p className="text-sm text-portfolio-muted mt-1">
                  {nextPost.category}
                </p>
              </div>
              <div className="flex-shrink-0 mt-1">
                <ChevronRight className="w-5 h-5 text-portfolio-muted group-hover:text-portfolio-accent transition-colors" />
              </div>
            </Link>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </nav>
  )
}
