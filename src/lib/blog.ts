import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface BlogPost {
    slug: string
    title: string
    date: string
    excerpt: string
    content: string
    tags: string[]
    readingTime: number
    author: string
    category: string
    featured?: boolean
}

const postsDirectory = path.join(process.cwd(), 'content/blog')

export async function getAllPosts(): Promise<BlogPost[]> {
    // Ensure the blog directory exists
    if (!fs.existsSync(postsDirectory)) {
        fs.mkdirSync(postsDirectory, { recursive: true })
        return []
    }

    const fileNames = fs.readdirSync(postsDirectory)
    const allPostsData = fileNames
        .filter(fileName => fileName.endsWith('.mdx'))
        .map((fileName) => {
            const slug = fileName.replace(/\.mdx$/, '')
            const fullPath = path.join(postsDirectory, fileName)
            const fileContents = fs.readFileSync(fullPath, 'utf8')
            const { data, content } = matter(fileContents)

            // Calculate reading time (average 200 words per minute)
            const wordCount = content.split(/\s+/).length
            const readingTime = Math.ceil(wordCount / 200)

            return {
                slug,
                title: data.title || 'Untitled',
                date: data.date || new Date().toISOString(),
                excerpt: data.excerpt || content.substring(0, 160) + '...',
                content,
                tags: data.tags || [],
                readingTime,
                author: data.author || 'Lê Nguyễn Thành Long - William',
                category: data.category || 'General',
                featured: data.featured || false,
            } as BlogPost
        })

    // Sort posts by date (newest first)
    return allPostsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
        const fullPath = path.join(postsDirectory, `${slug}.mdx`)

        if (!fs.existsSync(fullPath)) {
            return null
        }

        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const { data, content } = matter(fileContents)

        // Calculate reading time
        const wordCount = content.split(/\s+/).length
        const readingTime = Math.ceil(wordCount / 200)

        return {
            slug,
            title: data.title || 'Untitled',
            date: data.date || new Date().toISOString(),
            excerpt: data.excerpt || content.substring(0, 160) + '...',
            content,
            tags: data.tags || [],
            readingTime,
            author: data.author || 'Lê Nguyễn Thành Long - William',
            category: data.category || 'General',
            featured: data.featured || false,
        }
    } catch (error) {
        console.error(`Error reading post ${slug}:`, error)
        return null
    }
}

export async function getFeaturedPosts(): Promise<BlogPost[]> {
    const allPosts = await getAllPosts()
    return allPosts.filter(post => post.featured).slice(0, 3)
}

export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
    const allPosts = await getAllPosts()
    return allPosts.filter(post => post.tags.includes(tag))
}

export async function getPostsByCategory(category: string): Promise<BlogPost[]> {
    const allPosts = await getAllPosts()
    return allPosts.filter(post => post.category === category)
}

export function getAllTags(): Promise<string[]> {
    return getAllPosts().then(posts => {
        const tags = new Set<string>()
        posts.forEach(post => {
            post.tags.forEach(tag => tags.add(tag))
        })
        return Array.from(tags).sort()
    })
}

export function getAllCategories(): Promise<string[]> {
    return getAllPosts().then(posts => {
        const categories = new Set<string>()
        posts.forEach(post => categories.add(post.category))
        return Array.from(categories).sort()
    })
}
