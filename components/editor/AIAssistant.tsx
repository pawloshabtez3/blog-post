'use client'

import { useState } from 'react'

interface AIEnhancementResult {
  refinedContent: string
  suggestedTitle: string
  keywords: string[]
  metaDescription: string
}

interface AIAssistantProps {
  content: string
  onAcceptContent: (content: string) => void
  onAcceptTitle: (title: string) => void
}

export default function AIAssistant({ content, onAcceptContent, onAcceptTitle }: AIAssistantProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSummarizing, setIsSummarizing] = useState(false)
  const [enhancement, setEnhancement] = useState<AIEnhancementResult | null>(null)
  const [summary, setSummary] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copySuccess, setCopySuccess] = useState(false)

  const handleEnhance = async () => {
    if (!content || content.trim().length === 0) {
      setError('Please write some content first')
      return
    }

    setIsLoading(true)
    setError(null)
    setEnhancement(null)

    try {
      const response = await fetch('/api/posts/enhance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        const errorMessage = errorData.error || 'Failed to enhance content'
        
        // Provide user-friendly error messages
        if (response.status === 401) {
          throw new Error('Please log in to use AI features')
        } else if (response.status === 503) {
          throw new Error('AI features are temporarily unavailable. Please try again later.')
        } else {
          throw new Error(errorMessage)
        }
      }

      const data = await response.json()
      setEnhancement(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAcceptContent = () => {
    if (enhancement) {
      onAcceptContent(enhancement.refinedContent)
      setEnhancement(null)
    }
  }

  const handleAcceptTitle = () => {
    if (enhancement) {
      onAcceptTitle(enhancement.suggestedTitle)
    }
  }

  const handleSummarize = async () => {
    if (!content || content.trim().length === 0) {
      setError('Please write some content first')
      return
    }

    setIsSummarizing(true)
    setError(null)
    setSummary(null)
    setCopySuccess(false)

    try {
      const response = await fetch('/api/posts/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        const errorMessage = errorData.error || 'Failed to generate summary'
        
        // Provide user-friendly error messages
        if (response.status === 401) {
          throw new Error('Please log in to use AI features')
        } else if (response.status === 503) {
          throw new Error('AI features are temporarily unavailable. Please try again later.')
        } else {
          throw new Error(errorMessage)
        }
      }

      const data = await response.json()
      setSummary(data.summary)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSummarizing(false)
    }
  }

  const handleCopySummary = async () => {
    if (summary) {
      try {
        await navigator.clipboard.writeText(summary)
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
      } catch (err) {
        setError('Failed to copy to clipboard')
      }
    }
  }

  const handleReject = () => {
    setEnhancement(null)
  }

  const handleCloseSummary = () => {
    setSummary(null)
    setCopySuccess(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleEnhance}
          disabled={isLoading || isSummarizing}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Enhancing...' : '✨ Improve Post'}
        </button>
        
        <button
          type="button"
          onClick={handleSummarize}
          disabled={isLoading || isSummarizing}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSummarizing ? 'Summarizing...' : '📝 Summarize'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {enhancement && (
        <div className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">AI Suggestions</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Suggested Title
              </label>
              <div className="flex gap-2">
                <p className="flex-1 p-3 bg-white rounded border border-gray-200 text-sm">
                  {enhancement.suggestedTitle}
                </p>
                <button
                  type="button"
                  onClick={handleAcceptTitle}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                >
                  Use
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Keywords
              </label>
              <div className="flex flex-wrap gap-2">
                {enhancement.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta Description
              </label>
              <p className="p-3 bg-white rounded border border-gray-200 text-sm">
                {enhancement.metaDescription}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Refined Content
              </label>
              <div className="p-3 bg-white rounded border border-gray-200 max-h-64 overflow-y-auto">
                <pre className="text-sm whitespace-pre-wrap font-mono">
                  {enhancement.refinedContent}
                </pre>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleAcceptContent}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Accept Content
            </button>
            <button
              type="button"
              onClick={handleReject}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Reject
            </button>
          </div>
        </div>
      )}

      {summary && (
        <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg space-y-4">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-900">Summary</h3>
            <button
              type="button"
              onClick={handleCloseSummary}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>
          
          <div className="p-4 bg-white rounded border border-gray-200">
            <p className="text-sm text-gray-800 leading-relaxed">{summary}</p>
          </div>

          <button
            type="button"
            onClick={handleCopySummary}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            {copySuccess ? (
              <>
                <span>✓</span>
                <span>Copied!</span>
              </>
            ) : (
              <>
                <span>📋</span>
                <span>Copy to Clipboard</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
