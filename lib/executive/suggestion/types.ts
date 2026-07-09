import type { ExecutiveReasoningEvidence } from "@/lib/executive/reasoning";

export type SuggestionStatus =
  | "pending"
  | "accepted"
  | "dismissed";

export type SuggestionEvidence = ExecutiveReasoningEvidence;

export type Suggestion = {
  id: string;
  title: string;
  whyItMatters: string;
  suggestedNextStep: string;
  evidence: SuggestionEvidence[];
  confidence: number;
  status: SuggestionStatus;
  createdAt: Date;
};
