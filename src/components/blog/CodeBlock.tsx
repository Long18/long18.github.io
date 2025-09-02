'use client'

import React, { useState, useCallback } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { Copy, Check, Code } from 'lucide-react'
import { cn } from '@/utils'
import { AnimatedButton } from '../ui'

// Custom dark theme matching the specified colors
const customDarkTheme = {
  'code[class*="language-"]': {
    color: '#ABB2BF',
    background: 'none',
    fontFamily: 'JetBrains Mono, Fira Code, Consolas, Monaco, "Courier New", monospace',
    fontSize: '14px',
    lineHeight: '1.5',
    direction: 'ltr' as const,
    textAlign: 'left' as const,
    whiteSpace: 'pre' as const,
    wordSpacing: 'normal',
    wordBreak: 'normal' as const,
    tabSize: 4,
    hyphens: 'none' as const,
  },
  'pre[class*="language-"]': {
    color: '#ABB2BF',
    background: '#282C34',
    fontFamily: 'JetBrains Mono, Fira Code, Consolas, Monaco, "Courier New", monospace',
    fontSize: '14px',
    lineHeight: '1.5',
    direction: 'ltr' as const,
    textAlign: 'left' as const,
    whiteSpace: 'pre' as const,
    wordSpacing: 'normal',
    wordBreak: 'normal' as const,
    tabSize: 4,
    hyphens: 'none' as const,
    padding: '20px',
    margin: '0',
    overflow: 'auto' as const,
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  'comment': { color: '#5C6370', fontStyle: 'italic' },
  'prolog': { color: '#5C6370', fontStyle: 'italic' },
  'doctype': { color: '#5C6370', fontStyle: 'italic' },
  'cdata': { color: '#5C6370', fontStyle: 'italic' },
  'punctuation': { color: '#ABB2BF' },
  'property': { color: '#E06C75' },
  'tag': { color: '#E06C75' },
  'constant': { color: '#D19A66' },
  'symbol': { color: '#D19A66' },
  'deleted': { color: '#E06C75' },
  'boolean': { color: '#D19A66' },
  'number': { color: '#D19A66' },
  'selector': { color: '#98C379' },
  'attr-name': { color: '#D19A66' },
  'string': { color: '#98C379' },
  'char': { color: '#98C379' },
  'builtin': { color: '#E06C75' },
  'inserted': { color: '#98C379' },
  'operator': { color: '#56B6C2' },
  'entity': { color: '#56B6C2' },
  'url': { color: '#56B6C2' },
  'atrule': { color: '#C678DD' },
  'attr-value': { color: '#98C379' },
  'keyword': { color: '#C678DD', fontWeight: 'bold' },
  'function': { color: '#61AFEF' },
  'class-name': { color: '#E5C07B' },
  'regex': { color: '#98C379' },
  'important': { color: '#C678DD', fontWeight: 'bold' },
  'variable': { color: '#E06C75' },
  'namespace': { color: '#E06C75' },
}

interface CodeBlockProps {
  children: string
  language?: string
  filename?: string
  showLineNumbers?: boolean
  highlightLines?: number[]
  className?: string
}

export default function CodeBlock({
  children,
  language = 'text',
  filename,
  showLineNumbers = false,
  highlightLines = [],
  className
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(children.trim())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }, [children])

  // Detect language from className if not provided
  const detectedLanguage = language || 'text'

  // Language display name mapping
  const languageNames: Record<string, string> = {
    javascript: 'JavaScript',
    typescript: 'TypeScript',
    jsx: 'React JSX',
    tsx: 'React TSX',
    python: 'Python',
    java: 'Java',
    csharp: 'C#',
    cpp: 'C++',
    c: 'C',
    css: 'CSS',
    html: 'HTML',
    json: 'JSON',
    yaml: 'YAML',
    markdown: 'Markdown',
    bash: 'Bash',
    shell: 'Shell',
    sql: 'SQL',
    php: 'PHP',
    go: 'Go',
    rust: 'Rust',
    swift: 'Swift',
    kotlin: 'Kotlin',
    dart: 'Dart',
    text: 'Text',
  }

  const displayLanguage = languageNames[detectedLanguage] || detectedLanguage.toUpperCase()

  return (
    <div className={cn('relative group my-10 overflow-hidden bg-gray-900 border border-gray-700 rounded-xl shadow-2xl', className)}>
      {/* Enhanced Header with language and filename */}
              <div className="flex items-center justify-between bg-gradient-to-r from-gray-800 to-gray-700 px-6 py-4 border-b border-gray-600">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <Code className="w-4 h-4 text-orange-400" />
          <span className="text-sm font-bold text-white uppercase tracking-widest">
            {filename || displayLanguage}
          </span>
        </div>

        {/* Enhanced Copy Button */}
        <AnimatedButton
          variant={copied ? "neon" : "glass"}
          size="sm"
          ripple={true}
          glow={copied}
          onClick={handleCopy}
          disabled={copied}
          className={cn(
            "text-sm font-bold uppercase tracking-wide transition-all duration-300",
            copied
              ? "text-green-400 border-green-400"
              : "text-orange-400 hover:text-orange-300 border-orange-400/50 hover:border-orange-400"
          )}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              COPIED!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              COPY
            </>
          )}
        </AnimatedButton>
      </div>

      {/* Enhanced Code Content */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#282C34] to-[#21252B]">
        <SyntaxHighlighter
          language={detectedLanguage}
          style={customDarkTheme}
          showLineNumbers={showLineNumbers}
          wrapLines={highlightLines.length > 0}
          lineProps={(lineNumber: number) => ({
            style: {
              backgroundColor: highlightLines.includes(lineNumber)
                ? 'rgba(255, 255, 255, 0.1)'
                : 'transparent',
              display: 'block',
              width: '100%',
            },
          })}
          customStyle={{
            margin: 0,
            borderRadius: '0',
            border: 'none',
            background: 'transparent',
            fontSize: '14px',
            lineHeight: '1.5',
          }}
          codeTagProps={{
            style: {
              fontFamily: 'JetBrains Mono, Fira Code, Consolas, Monaco, "Courier New", monospace',
            },
          }}
        >
          {children.trim()}
        </SyntaxHighlighter>

        {/* Custom Scrollbar Styles */}
        <style jsx>{`
          .code-block-container ::-webkit-scrollbar {
            height: 8px;
            width: 8px;
          }

          .code-block-container ::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 4px;
          }

          .code-block-container ::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 4px;
            transition: background 0.2s ease;
          }

          .code-block-container ::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.3);
          }

          .code-block-container ::-webkit-scrollbar-corner {
            background: transparent;
          }
        `}</style>
              </div>
      </div>
  )
}
