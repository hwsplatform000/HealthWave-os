import { z } from "zod/v4";

/**
 * AI Provider Abstraction Layer
 * Supports multiple AI providers with a unified interface
 */

export type AIProvider = "gemini" | "openai" | "claude" | "grok" | "perplexity" | "openrouter";

export interface AIProviderConfig {
  provider: AIProvider;
  apiKey: string;
  baseUrl?: string;
}

export interface AIGenerationRequest {
  provider: AIProvider;
  model: string;
  systemPrompt?: string;
  userPrompt: string;
  temperature?: number;
  maxTokens?: number;
  variables?: Record<string, string>;
}

export interface AIGenerationResponse {
  content: string;
  model: string;
  provider: AIProvider;
  tokensUsed?: number;
  finishReason?: string;
}

/**
 * Provider Configuration Registry
 * Maps providers to their API endpoints and model lists
 */
export const PROVIDER_CONFIG: Record<AIProvider, {
  name: string;
  baseUrl: string;
  defaultModel: string;
  models: string[];
  supportsReasoning: boolean;
}> = {
  gemini: {
    name: "Google Gemini",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai/",
    defaultModel: "gemini-1.5-pro",
    models: [
      "gemini-1.5-pro",
      "gemini-1.5-flash",
      "gemini-2.0-flash",
      "gemini-1.5-pro-exp-0801",
    ],
    supportsReasoning: true,
  },
  openai: {
    name: "OpenAI",
    baseUrl: "https://api.openai.com/v1/",
    defaultModel: "gpt-4-turbo",
    models: [
      "gpt-4-turbo",
      "gpt-4",
      "gpt-3.5-turbo",
      "o1-preview",
      "o1-mini",
    ],
    supportsReasoning: true,
  },
  claude: {
    name: "Anthropic Claude",
    baseUrl: "https://api.anthropic.com/v1/",
    defaultModel: "claude-3-5-sonnet-20241022",
    models: [
      "claude-3-5-sonnet-20241022",
      "claude-3-opus-20240229",
      "claude-3-sonnet-20240229",
      "claude-3-haiku-20240307",
    ],
    supportsReasoning: false,
  },
  grok: {
    name: "xAI Grok",
    baseUrl: "https://api.x.ai/v1/",
    defaultModel: "grok-2-1212",
    models: [
      "grok-2-1212",
      "grok-beta",
    ],
    supportsReasoning: false,
  },
  perplexity: {
    name: "Perplexity",
    baseUrl: "https://api.perplexity.ai/",
    defaultModel: "sonar-pro",
    models: [
      "sonar-pro",
      "sonar",
      "sonar-reasoning-pro",
    ],
    supportsReasoning: true,
  },
  openrouter: {
    name: "OpenRouter",
    baseUrl: "https://openrouter.ai/api/v1/",
    defaultModel: "meta-llama/llama-3.1-405b-instruct",
    models: [
      "meta-llama/llama-3.1-405b-instruct",
      "openai/gpt-4-turbo",
      "anthropic/claude-3.5-sonnet",
      "google/gemini-2.0-flash-exp",
    ],
    supportsReasoning: false,
  },
};

/**
 * Prompt Variable Replacement
 * Replaces [VARIABLE] placeholders with actual values
 */
export function interpolatePrompt(
  prompt: string,
  variables: Record<string, string> = {}
): string {
  let result = prompt;
  Object.entries(variables).forEach(([key, value]) => {
    const placeholder = new RegExp(`\\[${key.toUpperCase()}\\]`, "g");
    result = result.replace(placeholder, value);
  });
  return result;
}

/**
 * Prompt Chaining Helper
 * Chains multiple prompts together with context
 */
export interface PromptChain {
  prompts: Array<{
    systemPrompt?: string;
    userPrompt: string;
    variables?: Record<string, string>;
  }>;
}

/**
 * Brand Voice Injection
 * Injects brand voice guidelines into system prompts
 */
export function injectBrandVoice(
  systemPrompt: string,
  brandVoice: {
    tone: string;
    vocabulary: string;
    readingLevel: string;
    ctaStyle: string;
    emojiUsage: string;
  }
): string {
  const brandGuidelines = `
You are writing in the following brand voice:
- Tone: ${brandVoice.tone}
- Vocabulary: ${brandVoice.vocabulary}
- Reading Level: ${brandVoice.readingLevel}
- CTA Style: ${brandVoice.ctaStyle}
- Emoji Usage: ${brandVoice.emojiUsage}

Maintain this voice consistently throughout your response.
`;
  return `${systemPrompt}\n\n${brandGuidelines}`;
}

/**
 * Healthcare Specialty Injection
 * Injects healthcare specialty context into system prompts
 */
export function injectSpecialty(
  systemPrompt: string,
  specialty: {
    name: string;
    keyTopics: string[];
    complianceGuidelines: string;
  }
): string {
  const specialtyGuidelines = `
You are writing for the ${specialty.name} healthcare specialty.
Key Topics: ${specialty.keyTopics.join(", ")}
Compliance Guidelines: ${specialty.complianceGuidelines}

Ensure all content is accurate, compliant, and appropriate for this specialty.
`;
  return `${systemPrompt}\n\n${specialtyGuidelines}`;
}

/**
 * AI Settings Schema
 */
export const aiSettingsSchema = z.object({
  defaultProvider: z.enum(["gemini", "openai", "claude", "grok", "perplexity", "openrouter"]),
  defaultModel: z.string(),
  temperature: z.number().min(0).max(2).default(0.7),
  maxOutputLength: z.number().min(100).max(32000).default(2048),
  creativityLevel: z.number().min(1).max(10).default(5),
  medicalAccuracyPreference: z.enum(["standard", "high", "strict"]).default("high"),
  writingStyle: z.string().default("professional"),
  enableWebSearch: z.boolean().default(true),
  enableReasoning: z.boolean().default(false),
});

export type AISettings = z.infer<typeof aiSettingsSchema>;
