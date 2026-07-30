import { z } from "zod/v4";

/**
 * Research Provider Abstraction Layer
 * Supports multiple research/search providers with a unified interface
 */

export type ResearchProvider = "google" | "gemini" | "perplexity" | "tavily" | "serpapi";
export type ResearchType = "healthcare" | "news" | "trends" | "competitor" | "seo" | "patient_questions" | "market" | "social";

export interface ResearchRequest {
  provider: ResearchProvider;
  query: string;
  researchType: ResearchType;
  limit?: number;
  specialty?: string;
  location?: string;
}

export interface ResearchResult {
  title: string;
  description: string;
  url: string;
  source: string;
  relevance: number; // 0-100
  publishedAt?: string;
}

export interface ResearchResponse {
  provider: ResearchProvider;
  query: string;
  results: ResearchResult[];
  totalResults: number;
  executedAt: string;
}

/**
 * Provider Configuration Registry
 */
export const RESEARCH_PROVIDER_CONFIG: Record<ResearchProvider, {
  name: string;
  baseUrl: string;
  supportsFiltering: boolean;
  supportsLocation: boolean;
  rateLimit: number; // requests per minute
}> = {
  google: {
    name: "Google Search",
    baseUrl: "https://www.google.com/search",
    supportsFiltering: true,
    supportsLocation: true,
    rateLimit: 100,
  },
  gemini: {
    name: "Gemini Search",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/",
    supportsFiltering: true,
    supportsLocation: false,
    rateLimit: 60,
  },
  perplexity: {
    name: "Perplexity",
    baseUrl: "https://api.perplexity.ai/",
    supportsFiltering: true,
    supportsLocation: true,
    rateLimit: 50,
  },
  tavily: {
    name: "Tavily",
    baseUrl: "https://api.tavily.com/",
    supportsFiltering: true,
    supportsLocation: false,
    rateLimit: 100,
  },
  serpapi: {
    name: "SerpAPI",
    baseUrl: "https://serpapi.com/",
    supportsFiltering: true,
    supportsLocation: true,
    rateLimit: 100,
  },
};

/**
 * Medical Verification Engine
 */
export interface MedicalClaim {
  text: string;
  type: "medical_claim" | "statistic" | "recommendation";
  status: "verified" | "unverified" | "flagged";
  confidence: number; // 0-100
  sources?: string[];
}

export interface VerificationResult {
  claims: MedicalClaim[];
  overallConfidence: number;
  verificationStatus: "verified" | "needs_review" | "flagged";
  recommendations: string[];
}

/**
 * Medical Claim Detection
 */
export function detectMedicalClaims(content: string): string[] {
  // Pattern matching for medical claims
  const patterns = [
    /(?:treatment|cure|therapy|medication|drug|vaccine)\s+(?:for|against|treats?)\s+\w+/gi,
    /\d+%\s+(?:of|reduction|improvement|increase)/gi,
    /(?:studies?|research|evidence)\s+(?:show|indicate|suggest|prove)/gi,
    /(?:should|must|must not|don't|do not)\s+(?:take|use|eat|avoid|consume)/gi,
  ];

  const claims: string[] = [];
  patterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      claims.push(...matches);
    }
  });

  return [...new Set(claims)];
}

/**
 * Research Type Categorization
 */
export function categorizeResearchType(query: string): ResearchType {
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.match(/competitor|rival|alternative|similar/)) return "competitor";
  if (lowerQuery.match(/seo|keyword|ranking|search engine|backlink/)) return "seo";
  if (lowerQuery.match(/trend|trending|popular|viral|emerging/)) return "trends";
  if (lowerQuery.match(/news|latest|breaking|update|announcement/)) return "news";
  if (lowerQuery.match(/patient|question|faq|common|ask/)) return "patient_questions";
  if (lowerQuery.match(/market|industry|economic|financial|business/)) return "market";
  if (lowerQuery.match(/social|twitter|facebook|instagram|tiktok|reddit/)) return "social";

  return "healthcare";
}

/**
 * Research Settings Schema
 */
export const researchSettingsSchema = z.object({
  defaultProvider: z.enum(["google", "gemini", "perplexity", "tavily", "serpapi"]),
  enableMedicalVerification: z.boolean().default(true),
  verificationSeverity: z.enum(["low", "medium", "high"]).default("medium"),
  resultsLimit: z.number().min(5).max(50).default(10),
  includeSourceCitations: z.boolean().default(true),
  autoTagResults: z.boolean().default(true),
});

export type ResearchSettings = z.infer<typeof researchSettingsSchema>;
