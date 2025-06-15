import { Metadata } from 'next'
import { getAllPosts } from '@/lib/blog'
import BlogList from '@/components/blog/BlogList'
import BlogHeader from '@/components/blog/BlogHeader'

export const metadata: Metadata = {
  title: 'Technical Blog | Lê Nguyễn Thành Long - Game Developer',
  description: 'Technical articles, tutorials, and insights about game development, Unity, Unreal Engine, and modern web technologies.',
  keywords: ['game development', 'Unity', 'Unreal Engine', 'technical blog', 'programming tutorials'],
  openGraph: {
    title: 'Technical Blog | Lê Nguyễn Thành Long - Game Developer',
    description: 'Technical articles and insights about game development',
    type: 'website',
  },
}

export default async function BlogPage() {
  const posts = await getAllPosts()

  return (
    <div className="min-h-screen bg-smoky-black">
      <div className="container mx-auto px-4 py-8">
        <BlogHeader />
        <BlogList posts={posts} locale="en" />
      </div>
    </div>
  )
}
