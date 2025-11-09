'use client'

import ReactMarkdown from 'react-markdown'

interface PostContentProps {
  content: string
}

export default function PostContent({ content }: PostContentProps) {
  return (
    <div className="prose prose-lg max-w-none">
      <ReactMarkdown
        components={{
          // Customize heading styles
          h1: ({ node, ...props }) => (
            <h1 className="text-4xl font-bold text-gray-900 mt-8 mb-4" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-3xl font-bold text-gray-900 mt-6 mb-3" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-2xl font-bold text-gray-900 mt-5 mb-2" {...props} />
          ),
          // Customize paragraph styles
          p: ({ node, ...props }) => (
            <p className="text-gray-700 leading-relaxed mb-4" {...props} />
          ),
          // Customize link styles
          a: ({ node, ...props }) => (
            <a 
              className="text-blue-600 hover:text-blue-800 underline" 
              target="_blank" 
              rel="noopener noreferrer" 
              {...props} 
            />
          ),
          // Customize list styles
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-inside mb-4 space-y-2" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="text-gray-700" {...props} />
          ),
          // Customize code styles
          code: ({ node, className, children, ...props }) => {
            const isInline = !className
            return isInline ? (
              <code 
                className="bg-gray-100 text-red-600 px-1.5 py-0.5 rounded text-sm font-mono" 
                {...props}
              >
                {children}
              </code>
            ) : (
              <code 
                className={`block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto ${className}`}
                {...props}
              >
                {children}
              </code>
            )
          },
          // Customize blockquote styles
          blockquote: ({ node, ...props }) => (
            <blockquote 
              className="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-4" 
              {...props} 
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
