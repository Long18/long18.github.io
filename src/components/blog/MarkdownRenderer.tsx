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

  // Override inline code rendering with correct signature
  renderer.codespan = ({ text }: { text: string }) => {
    return `<code class="bg-portfolio-surface-secondary px-2 py-1 rounded text-sm font-mono text-portfolio-accent">${text}</code>`
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
