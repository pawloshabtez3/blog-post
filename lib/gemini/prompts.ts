export function getEnhancementPrompt(draft: string): string {
  return `You are a professional blog editor and writing coach.
Given this user's draft:

${draft}

Please provide your response in the following JSON format:
{
  "refinedContent": "The improved version of the content",
  "suggestedTitle": "A catchy and SEO-friendly title",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "metaDescription": "A one-sentence meta description for SEO"
}

Keep the tone professional yet conversational.`
}

export function getSummaryPrompt(content: string): string {
  return `Summarize this blog post in 2-3 sentences that capture its main idea and tone:

${content}

Provide only the summary text without any additional formatting.`
}
