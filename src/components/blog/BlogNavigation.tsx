'use client'

import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface BlogNavigationProps {
  previousPost?: { slug: string; title: string; category: string } | null
  nextPost?: { slug: string; title: string; category: string } | null
}

export default function BlogNavigation({ previousPost, nextPost }: BlogNavigationProps) {
  if (!previousPost && !nextPost) {
    return null
  }

  return (
    <nav className="mt-12 pt-8">
      <div className="bg-white/8 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Previous Post */}
          <div className="flex justify-start">
            {previousPost ? (
              <Link
                href={`/blog/${previousPost.slug}`}
                className="group flex items-start gap-4 p-4 bg-white/10 border border-white/20 rounded-xl hover:bg-white/15 hover:border-white/30 transition-all duration-200 max-w-sm"
              >
                <div className="flex-shrink-0 mt-1">
                  <ChevronLeft className="w-5 h-5 text-white/70 group-hover:text-blue-400 transition-colors" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-white/70 mb-1">Previous</p>
                  <h3 className="text-white group-hover:text-blue-300 transition-colors font-medium line-clamp-2">
                    {previousPost.title}
                  </h3>
                  <p className="text-sm text-white/60 mt-1">
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
                className="group flex items-start gap-4 p-4 bg-white/10 border border-white/20 rounded-xl hover:bg-white/15 hover:border-white/30 transition-all duration-200 max-w-sm text-right"
              >
                <div className="min-w-0">
                  <p className="text-sm text-white/70 mb-1">Next</p>
                  <h3 className="text-white group-hover:text-blue-300 transition-colors font-medium line-clamp-2">
                    {nextPost.title}
                  </h3>
                  <p className="text-sm text-white/60 mt-1">
                    {nextPost.category}
                  </p>
                </div>
                <div className="flex-shrink-0 mt-1">
                  <ChevronRight className="w-5 h-5 text-white/70 group-hover:text-blue-400 transition-colors" />
                </div>
              </Link>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
