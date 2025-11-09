'use client'

import { useState, useEffect } from 'react'

interface MarkdownEditorProps {
  initialContent?: string
  onChange: (content: string) => void
  placeholder?: string
}

export default function MarkdownEditor({
  initialContent = '',
  onChange,
  placeholder = 'Write your post content in Markdown...',
}: MarkdownEditorProps) {
  const [content, setContent] = useState(initialContent)
  const [charCount, setCharCount] = useState(initialContent.length)

  useEffect(() => {
    setContent(initialContent)
    setCharCount(initialContent.length)
  }, [initialContent])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setContent(newContent)
    setCharCount(newContent.length)
    onChange(newContent)
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          Content
        </label>
        <span className="text-sm text-gray-500">
          {charCount.toLocaleString()} characters
        </span>
      </div>
      <textarea
        id="content"
        name="content"
        value={content}
        onChange={handleChange}
        placeholder={placeholder}
        rows={20}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
      />
      <p className="text-xs text-gray-500">
        Supports Markdown formatting
      </p>
    </div>
  )
}
