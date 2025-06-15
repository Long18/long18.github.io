'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function BlogHeader() {
  return (
    <div className="mb-12 relative">
      {/* Simplified background */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
      </div>

      <div className="relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/70 hover:text-blue-400 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Portfolio
        </Link>

        <div className="text-center">
          <div className="bg-white/8 backdrop-blur-md rounded-3xl p-8 border border-white/20">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Technical Blog
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Insights, tutorials, and deep dives into game development, Unity, Unreal Engine,
              and modern web technologies. Sharing knowledge from real-world projects and experiences.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
