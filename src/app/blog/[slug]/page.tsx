import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllPosts, getPostBySlug } from '@/lib/blog'
import BlogPost from '@/components/blog/BlogPost'
import BlogNavigation from '@/components/blog/BlogNavigation'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: `${post.title} | Lê Nguyễn Thành Long - Game Developer`,
    description: post.excerpt,
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: ['Lê Nguyễn Thành Long'],
      tags: post.tags,
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  const allPosts = await getAllPosts()
  const currentIndex = allPosts.findIndex(p => p.slug === params.slug)
  const previousPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null

  return (
    <div className="min-h-screen bg-smoky-black">
      <div className="container mx-auto px-4 py-8">
        <BlogPost post={post} />
        <BlogNavigation
          previousPost={previousPost}
          nextPost={nextPost}
        />
      </div>
    </div>
  )
}
