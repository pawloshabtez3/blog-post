import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getModel } from '@/lib/gemini/client'
import { getSummaryPrompt } from '@/lib/gemini/prompts'
import {
  AuthenticationError,
  ValidationError,
  ExternalServiceError,
  handleError,
} from '@/lib/utils/errors'

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      throw new AuthenticationError('Please log in to use AI features')
    }

    // Parse request body
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      throw new ValidationError('Invalid request format')
    }

    const { content } = body
    
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      throw new ValidationError('Content is required and must be a non-empty string', 'content')
    }

    if (content.length > 50000) {
      throw new ValidationError('Content is too long. Maximum 50,000 characters allowed.', 'content')
    }

    // Call Gemini API
    let summary
    try {
      const model = getModel()
      const prompt = getSummaryPrompt(content)
      const result = await model.generateContent(prompt)
      summary = result.response.text().trim()

      if (!summary || summary.length === 0) {
        throw new Error('Empty AI response')
      }
    } catch (aiError) {
      console.error('Gemini API error:', aiError)
      throw new ExternalServiceError(
        'AI Summarization',
        'AI features are temporarily unavailable. Please try again later.'
      )
    }
    
    return NextResponse.json({ summary })
  } catch (error) {
    const errorResponse = handleError(error)
    console.error('Summarization error:', {
      code: errorResponse.code,
      message: errorResponse.message,
      originalError: error,
    })
    
    return NextResponse.json(
      { 
        error: errorResponse.message,
        code: errorResponse.code,
      },
      { status: errorResponse.statusCode }
    )
  }
}
