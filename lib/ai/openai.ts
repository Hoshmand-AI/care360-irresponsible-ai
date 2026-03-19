/**
 * Care360 AI - OpenAI Provider Implementation
 * A Hoshmand AI Product
 */

import OpenAI from 'openai'
import {
  AIProvider,
  AIMessage,
  AIResponse,
  ChatOptions,
  SymptomAnalysisInput,
  SymptomAnalysisResult,
  UserContext,
  AIProviderError,
  AIRateLimitError,
  calculateCost,
} from './types'

// ===========================================
// SYSTEM PROMPTS
// ===========================================

const SYMPTOM_ANALYSIS_SYSTEM_PROMPT = `You are Care360 AI, a helpful health guidance assistant created by Hoshmand AI. 
You provide general wellness guidance based on symptoms, but you are NOT a doctor and do not provide medical diagnoses.

IMPORTANT RULES:
1. Always err on the side of caution
2. For serious symptoms (chest pain, difficulty breathing, severe bleeding, loss of consciousness), ALWAYS return urgency "emergency"
3. Provide clear, actionable guidance
4. Include appropriate OTC medication suggestions when relevant
5. Always include warning signs to watch for
6. Be empathetic but professional
7. Consider user's age and allergies when suggesting medications

Respond ONLY with valid JSON matching this schema:
{
  "urgencyLevel": "routine" | "soon" | "urgent" | "emergency",
  "possibleCauses": ["string array of 2-4 possible causes"],
  "recommendations": ["string array of 3-5 actionable recommendations"],
  "otcSuggestions": [
    {
      "name": "generic drug name",
      "brands": ["brand names"],
      "purpose": "what it helps with",
      "warnings": ["optional warnings"]
    }
  ],
  "warningSignsToWatch": ["signs that should prompt seeking care"],
  "disclaimers": ["important disclaimers"]
}`

const HEALTH_CHAT_SYSTEM_PROMPT = `You are Care360 AI, a friendly and knowledgeable health guidance assistant created by Hoshmand AI.

Your role:
- Answer health questions clearly and helpfully
- Provide general wellness guidance
- Suggest OTC medications when appropriate
- Help users understand when to seek professional care
- Be empathetic, warm, and professional

You are NOT a doctor and cannot:
- Diagnose conditions
- Prescribe medications
- Replace professional medical advice

Keep responses concise but thorough. Use simple language. For serious symptoms, always recommend seeking immediate medical care.`

// ===========================================
// OPENAI PROVIDER CLASS
// ===========================================

export class OpenAIProvider implements AIProvider {
  readonly name = 'openai'
  private client: OpenAI
  private defaultModel: string

  constructor(apiKey?: string, defaultModel: string = 'gpt-4o') {
    this.client = new OpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY,
    })
    this.defaultModel = defaultModel
  }

  /**
   * Send a chat completion request
   */
  async chat(messages: AIMessage[], options?: ChatOptions): Promise<AIResponse> {
    try {
      const response = await this.client.chat.completions.create({
        model: this.defaultModel,
        messages: messages.map(m => ({
          role: m.role,
          content: m.content,
        })),
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 1000,
        response_format: options?.jsonMode ? { type: 'json_object' } : undefined,
      })

      const choice = response.choices[0]
      
      return {
        content: choice.message.content || '',
        usage: response.usage ? {
          promptTokens: response.usage.prompt_tokens,
          completionTokens: response.usage.completion_tokens,
          totalTokens: response.usage.total_tokens,
        } : undefined,
        model: response.model,
        finishReason: choice.finish_reason,
      }
    } catch (error: any) {
      if (error?.status === 429) {
        throw new AIRateLimitError(this.name)
      }
      throw new AIProviderError(
        error?.message || 'OpenAI API error',
        this.name,
        error?.code,
        error?.status
      )
    }
  }

  /**
   * Analyze symptoms and return structured guidance
   */
  async analyzeSymptoms(input: SymptomAnalysisInput): Promise<SymptomAnalysisResult> {
    const userPrompt = `Analyze these symptoms and provide guidance:

Symptoms: ${input.symptoms.join(', ')}
${input.duration ? `Duration: ${input.duration}` : ''}
${input.severity ? `Severity: ${input.severity}` : ''}
${input.age ? `Age: ${input.age}` : ''}
${input.sex ? `Sex: ${input.sex}` : ''}
${input.allergies?.length ? `Known allergies: ${input.allergies.join(', ')}` : ''}
${input.additionalInfo ? `Additional info: ${input.additionalInfo}` : ''}

Provide your analysis as JSON only.`

    const response = await this.chat(
      [
        { role: 'system', content: SYMPTOM_ANALYSIS_SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      {
        temperature: 0.3,
        maxTokens: 1000,
        jsonMode: true,
      }
    )

    try {
      const result = JSON.parse(response.content) as SymptomAnalysisResult

      // Add standard disclaimers if not present
      if (!result.disclaimers || result.disclaimers.length === 0) {
        result.disclaimers = [
          'This is general wellness guidance, not medical advice.',
          'Always consult a healthcare provider for medical concerns.',
          'If symptoms worsen, seek immediate medical attention.',
        ]
      }

      return result
    } catch (parseError) {
      throw new AIProviderError(
        'Failed to parse symptom analysis response',
        this.name,
        'PARSE_ERROR'
      )
    }
  }

  /**
   * Health-focused chat with optional user context
   */
  async healthChat(messages: AIMessage[], userContext?: UserContext): Promise<string> {
    let systemPrompt = HEALTH_CHAT_SYSTEM_PROMPT

    if (userContext) {
      systemPrompt += `\n\nUser context:
- Age: ${userContext.age || 'unknown'}
- Sex: ${userContext.sex || 'unknown'}
- Known allergies: ${userContext.allergies?.join(', ') || 'none specified'}`
    }

    const response = await this.chat(
      [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      {
        temperature: 0.7,
        maxTokens: 800,
      }
    )

    return response.content
  }

  /**
   * Get estimated cost for a response
   */
  getEstimatedCost(response: AIResponse): number {
    if (!response.usage) return 0
    return calculateCost(
      response.model || this.defaultModel,
      response.usage.promptTokens,
      response.usage.completionTokens
    )
  }
}

// ===========================================
// SINGLETON INSTANCE
// ===========================================

let openaiProvider: OpenAIProvider | null = null

export function getOpenAIProvider(): OpenAIProvider {
  if (!openaiProvider) {
    openaiProvider = new OpenAIProvider()
  }
  return openaiProvider
}

export default OpenAIProvider
