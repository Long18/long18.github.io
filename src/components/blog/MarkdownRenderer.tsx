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
    return `<code class="blog-code px-2 py-1 rounded text-base font-mono">${text}</code>`
  }

  // Override blockquote rendering - dark theme
  renderer.blockquote = ({ text }: { text: string }) => {
    return `<blockquote class="blog-content-tertiary border-l-4 border-blue-500 pl-6 py-4 my-6 rounded-r-lg blog-text-secondary">${text}</blockquote>`
  }

  // Override table rendering - dark theme
  renderer.table = (token: any) => {
    const { header, body } = token
    return `<div class="blog-content-secondary rounded-xl border blog-border overflow-hidden my-6">
      <table class="w-full">
        <thead class="blog-content-tertiary border-b blog-border">${header}</thead>
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
            className="prose prose-xl max-w-none
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
              prose-blockquote:blog-text-secondary
              prose-table:blog-text-secondary
              prose-th:blog-text-primary prose-th:font-bold
              prose-td:blog-text-secondary"
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
          className="prose prose-xl max-w-none
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
            prose-blockquote:blog-text-secondary
            prose-table:blog-text-secondary
            prose-th:blog-text-primary prose-th:font-bold
            prose-td:blog-text-secondary"
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
        className="prose prose-xl max-w-none
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
          prose-blockquote:blog-text-secondary
          prose-table:blog-text-secondary
          prose-th:blog-text-primary prose-th:font-bold
          prose-td:blog-text-secondary"
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
