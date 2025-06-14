'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function BlogHeader() {
  return (
    <div className="mb-12">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-portfolio-muted hover:text-portfolio-accent transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Portfolio
      </Link>

      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-portfolio-primary mb-4">
          Technical Blog
        </h1>
        <p className="text-lg text-portfolio-muted max-w-2xl mx-auto">
          Insights, tutorials, and deep dives into game development, Unity, Unreal Engine,
          and modern web technologies. Sharing knowledge from real-world projects and experiences.
        </p>
      </div>
    </div>
  )
}
