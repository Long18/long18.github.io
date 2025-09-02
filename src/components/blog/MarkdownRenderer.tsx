'use client'

import React, { useMemo } from 'react'
import { marked } from 'marked'
import CodeBlock from './CodeBlock'

interface MarkdownRendererProps {
  content: string
  className?: string
}

// Custom renderer for marked
const createCustomRenderer = () => {
  const renderer = new marked.Renderer()

  // Override code block rendering with correct signature
  renderer.code = ({ text, lang }: { text: string; lang?: string; escaped?: boolean }) => {
    // Generate a unique ID for React rendering
    const id = Math.random().toString(36).substr(2, 9)

    // Return a placeholder that we'll replace with React component
    return `<div data-code-block="${id}" data-language="${lang || 'text'}" data-code="${encodeURIComponent(text)}"></div>`
  }

  // Override inline code rendering - dark theme
  renderer.codespan = ({ text }: { text: string }) => {
    return `<code class="bg-glass-surface-secondary/50 text-glass-accent px-2 py-1 rounded text-base font-mono border border-glass-surface-tertiary/30">${text}</code>`
  }

  // Override blockquote rendering - glass theme
  renderer.blockquote = ({ text }: { text: string }) => {
    return `<blockquote class="bg-glass-surface-secondary/30 border-l-4 border-glass-accent pl-6 py-4 my-6 rounded-r-lg text-glass-text-secondary">${text}</blockquote>`
  }

  // Override table rendering - glass theme
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderer.table = (token: any) => {
    const { header, body } = token
    return `<div class="bg-glass-surface-secondary/30 rounded-xl border border-glass-surface-tertiary/30 overflow-hidden my-6">
      <table class="w-full">
        <thead class="bg-glass-surface-tertiary/20 border-b border-glass-surface-tertiary/30">${header}</thead>
        <tbody>${body}</tbody>
      </table>
    </div>`
  }

  return renderer
}

// Component to replace code block placeholders with React components
const processCodeBlocks = (html: string): React.ReactNode[] => {
  const parts: React.ReactNode[] = []
  const codeBlockRegex = /<div data-code-block="([^"]*)" data-language="([^"]*)" data-code="([^"]*)"><\/div>/g

  let lastIndex = 0
  let match

  while ((match = codeBlockRegex.exec(html)) !== null) {
    const [fullMatch, id, language, encodedCode] = match
    const code = decodeURIComponent(encodedCode)

    // Add HTML before this code block
    if (match.index > lastIndex) {
      const htmlBefore = html.slice(lastIndex, match.index)
      if (htmlBefore.trim()) {
        parts.push(
          <div
            key={`html-${lastIndex}`}
            className="prose prose-lg max-w-none prose-invert
              prose-headings:text-white prose-headings:font-bold prose-headings:leading-tight prose-headings:tracking-wide prose-headings:uppercase prose-headings:letter-spacing-wider
              prose-p:text-gray-300 prose-p:leading-relaxed prose-p:text-lg prose-p:mb-8 prose-p:font-normal
              prose-strong:text-white prose-strong:font-bold prose-strong:uppercase prose-strong:tracking-wide
              prose-em:text-orange-400 prose-em:italic prose-em:font-medium
              prose-a:text-orange-400 prose-a:hover:text-orange-300 prose-a:underline prose-a:font-medium prose-a:decoration-2 prose-a:underline-offset-4
              prose-ul:text-gray-300 prose-ul:list-disc prose-ul:text-lg prose-ul:pl-8 prose-ul:my-8 prose-ul:space-y-4
              prose-ol:text-gray-300 prose-ol:list-decimal prose-ol:text-lg prose-ol:pl-8 prose-ol:my-8 prose-ol:space-y-4
              prose-li:text-gray-300 prose-li:leading-relaxed prose-li:marker:text-orange-400 prose-li:mb-3
              prose-h1:text-5xl prose-h1:mb-12 prose-h1:mt-16 prose-h1:text-white prose-h1:font-black prose-h1:border-b-2 prose-h1:border-orange-400 prose-h1:pb-6 prose-h1:uppercase prose-h1:tracking-widest
              prose-h2:text-4xl prose-h2:mb-10 prose-h2:mt-16 prose-h2:text-white prose-h2:font-bold prose-h2:border-b prose-h2:border-orange-400/60 prose-h2:pb-4 prose-h2:uppercase prose-h2:tracking-wider
              prose-h3:text-3xl prose-h3:mb-8 prose-h3:mt-12 prose-h3:text-orange-300 prose-h3:font-semibold prose-h3:uppercase prose-h3:tracking-wide
              prose-h4:text-2xl prose-h4:mb-6 prose-h4:mt-10 prose-h4:text-orange-300 prose-h4:font-semibold prose-h4:uppercase prose-h4:tracking-wide
              prose-h5:text-xl prose-h5:mb-4 prose-h5:mt-8 prose-h5:text-orange-300 prose-h5:font-medium prose-h5:uppercase
              prose-h6:text-lg prose-h6:mb-3 prose-h6:mt-6 prose-h6:text-orange-300 prose-h6:font-medium prose-h6:uppercase
              prose-blockquote:text-gray-400 prose-blockquote:border-l-4 prose-blockquote:border-orange-400 prose-blockquote:bg-orange-400/10 prose-blockquote:italic prose-blockquote:pl-8 prose-blockquote:py-6 prose-blockquote:my-10 prose-blockquote:rounded-r-lg
              prose-table:text-gray-300 prose-table:border-collapse prose-table:my-10
              prose-th:text-white prose-th:font-bold prose-th:bg-gray-800 prose-th:border prose-th:border-gray-600 prose-th:px-6 prose-th:py-4 prose-th:uppercase prose-th:tracking-wide
              prose-td:text-gray-300 prose-td:border prose-td:border-gray-600 prose-td:px-6 prose-td:py-4
              prose-hr:border-orange-400/40 prose-hr:my-12
              prose-img:rounded-xl prose-img:shadow-2xl prose-img:my-10 prose-img:border prose-img:border-gray-600
              prose-video:rounded-xl prose-video:shadow-2xl prose-video:my-10
              prose-figure:my-10
              prose-figcaption:text-gray-500 prose-figcaption:text-center prose-figcaption:mt-4 prose-figcaption:text-sm prose-figcaption:italic prose-figcaption:uppercase prose-figcaption:tracking-wide"
            dangerouslySetInnerHTML={{ __html: htmlBefore }}
          />
        )
      }
    }

    // Add the CodeBlock component
    parts.push(
      <CodeBlock
        key={`code-${id}`}
        language={language}
        showLineNumbers={code.split('\n').length > 10} // Show line numbers for longer code blocks
      >
        {code}
      </CodeBlock>
    )

    lastIndex = match.index + fullMatch.length
  }

  // Add remaining HTML after the last code block
  if (lastIndex < html.length) {
    const htmlAfter = html.slice(lastIndex)
    if (htmlAfter.trim()) {
      parts.push(
        <div
          key={`html-${lastIndex}`}
          className="prose prose-lg max-w-none prose-invert
            prose-headings:text-white prose-headings:font-bold prose-headings:leading-tight prose-headings:tracking-wide prose-headings:uppercase prose-headings:letter-spacing-wider
            prose-p:text-gray-300 prose-p:leading-relaxed prose-p:text-lg prose-p:mb-8 prose-p:font-normal
            prose-strong:text-white prose-strong:font-bold prose-strong:uppercase prose-strong:tracking-wide
            prose-em:text-orange-400 prose-em:italic prose-em:font-medium
            prose-a:text-orange-400 prose-a:hover:text-orange-300 prose-a:underline prose-a:font-medium prose-a:decoration-2 prose-a:underline-offset-4
            prose-ul:text-gray-300 prose-ul:list-disc prose-ul:text-lg prose-ul:pl-8 prose-ul:my-8 prose-ul:space-y-4
            prose-ol:text-gray-300 prose-ol:list-decimal prose-ol:text-lg prose-ol:pl-8 prose-ol:my-8 prose-ol:space-y-4
            prose-li:text-gray-300 prose-li:leading-relaxed prose-li:marker:text-orange-400 prose-li:mb-3
            prose-h1:text-5xl prose-h1:mb-12 prose-h1:mt-16 prose-h1:text-white prose-h1:font-black prose-h1:border-b-2 prose-h1:border-orange-400 prose-h1:pb-6 prose-h1:uppercase prose-h1:tracking-widest
            prose-h2:text-4xl prose-h2:mb-10 prose-h2:mt-16 prose-h2:text-white prose-h2:font-bold prose-h2:border-b prose-h2:border-orange-400/60 prose-h2:pb-4 prose-h2:uppercase prose-h2:tracking-wider
            prose-h3:text-3xl prose-h3:mb-8 prose-h3:mt-12 prose-h3:text-orange-300 prose-h3:font-semibold prose-h3:uppercase prose-h3:tracking-wide
            prose-h4:text-2xl prose-h4:mb-6 prose-h4:mt-10 prose-h4:text-orange-300 prose-h4:font-semibold prose-h4:uppercase prose-h4:tracking-wide
            prose-h5:text-xl prose-h5:mb-4 prose-h5:mt-8 prose-h5:text-orange-300 prose-h5:font-medium prose-h5:uppercase
            prose-h6:text-lg prose-h6:mb-3 prose-h6:mt-6 prose-h6:text-orange-300 prose-h6:font-medium prose-h6:uppercase
            prose-blockquote:text-gray-400 prose-blockquote:border-l-4 prose-blockquote:border-orange-400 prose-blockquote:bg-orange-400/10 prose-blockquote:italic prose-blockquote:pl-8 prose-blockquote:py-6 prose-blockquote:my-10 prose-blockquote:rounded-r-lg
            prose-table:text-gray-300 prose-table:border-collapse prose-table:my-10
            prose-th:text-white prose-th:font-bold prose-th:bg-gray-800 prose-th:border prose-th:border-gray-600 prose-th:px-6 prose-th:py-4 prose-th:uppercase prose-th:tracking-wide
            prose-td:text-gray-300 prose-td:border prose-td:border-gray-600 prose-td:px-6 prose-td:py-4
            prose-hr:border-orange-400/40 prose-hr:my-12
            prose-img:rounded-xl prose-img:shadow-2xl prose-img:my-10 prose-img:border prose-img:border-gray-600
            prose-video:rounded-xl prose-video:shadow-2xl prose-video:my-10
            prose-figure:my-10
            prose-figcaption:text-gray-500 prose-figcaption:text-center prose-figcaption:mt-4 prose-figcaption:text-sm prose-figcaption:italic prose-figcaption:uppercase prose-figcaption:tracking-wide"
          dangerouslySetInnerHTML={{ __html: htmlAfter }}
        />
      )
    }
  }

  // If no code blocks were found, return the original HTML
  if (parts.length === 0) {
    parts.push(
      <div
        key="original"
        className="prose prose-lg max-w-none prose-invert
          prose-headings:text-white prose-headings:font-bold prose-headings:leading-tight prose-headings:tracking-wide prose-headings:uppercase prose-headings:letter-spacing-wider
          prose-p:text-gray-300 prose-p:leading-relaxed prose-p:text-lg prose-p:mb-8 prose-p:font-normal
          prose-strong:text-white prose-strong:font-bold prose-strong:uppercase prose-strong:tracking-wide
          prose-em:text-orange-400 prose-em:italic prose-em:font-medium
          prose-a:text-orange-400 prose-a:hover:text-orange-300 prose-a:underline prose-a:font-medium prose-a:decoration-2 prose-a:underline-offset-4
          prose-ul:text-gray-300 prose-ul:list-disc prose-ul:text-lg prose-ul:pl-8 prose-ul:my-8 prose-ul:space-y-4
          prose-ol:text-gray-300 prose-ol:list-decimal prose-ol:text-lg prose-ol:pl-8 prose-ol:my-8 prose-ol:space-y-4
          prose-li:text-gray-300 prose-li:leading-relaxed prose-li:marker:text-orange-400 prose-li:mb-3
          prose-h1:text-5xl prose-h1:mb-12 prose-h1:mt-16 prose-h1:text-white prose-h1:font-black prose-h1:border-b-2 prose-h1:border-orange-400 prose-h1:pb-6 prose-h1:uppercase prose-h1:tracking-widest
          prose-h2:text-4xl prose-h2:mb-10 prose-h2:mt-16 prose-h2:text-white prose-h2:font-bold prose-h2:border-b prose-h2:border-orange-400/60 prose-h2:pb-4 prose-h2:uppercase prose-h2:tracking-wider
          prose-h3:text-3xl prose-h3:mb-8 prose-h3:mt-12 prose-h3:text-orange-300 prose-h3:font-semibold prose-h3:uppercase prose-h3:tracking-wide
          prose-h4:text-2xl prose-h4:mb-6 prose-h4:mt-10 prose-h4:text-orange-300 prose-h4:font-semibold prose-h4:uppercase prose-h4:tracking-wide
          prose-h5:text-xl prose-h5:mb-4 prose-h5:mt-8 prose-h5:text-orange-300 prose-h5:font-medium prose-h5:uppercase
          prose-h6:text-lg prose-h6:mb-3 prose-h6:mt-6 prose-h6:text-orange-300 prose-h6:font-medium prose-h6:uppercase
          prose-blockquote:text-gray-400 prose-blockquote:border-l-4 prose-blockquote:border-orange-400 prose-blockquote:bg-orange-400/10 prose-blockquote:italic prose-blockquote:pl-8 prose-blockquote:py-6 prose-blockquote:my-10 prose-blockquote:rounded-r-lg
          prose-table:text-gray-300 prose-table:border-collapse prose-table:my-10
          prose-th:text-white prose-th:font-bold prose-th:bg-gray-800 prose-th:border prose-th:border-gray-600 prose-th:px-6 prose-th:py-4 prose-th:uppercase prose-th:tracking-wide
          prose-td:text-gray-300 prose-td:border prose-td:border-gray-600 prose-td:px-6 prose-td:py-4
          prose-hr:border-orange-400/40 prose-hr:my-12
          prose-img:rounded-xl prose-img:shadow-2xl prose-img:my-10 prose-img:border prose-img:border-gray-600
          prose-video:rounded-xl prose-video:shadow-2xl prose-video:my-10
          prose-figure:my-10
          prose-figcaption:text-gray-500 prose-figcaption:text-center prose-figcaption:mt-4 prose-figcaption:text-sm prose-figcaption:italic prose-figcaption:uppercase prose-figcaption:tracking-wide"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    )
  }

  return parts
}

export default function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  // Memoize the processed content to avoid re-processing on every render
  const processedContent = useMemo(() => {
    // Configure marked with custom renderer
    const customRenderer = createCustomRenderer()

    marked.setOptions({
      renderer: customRenderer,
      breaks: true,
      gfm: true,
    })

    // Convert markdown to HTML (marked is now synchronous by default)
    const html = marked.parse(content) as string

    // Process the HTML to replace code block placeholders with React components
    return processCodeBlocks(html)
  }, [content])

  return (
    <div className={className}>
      {processedContent}
    </div>
  )
}
