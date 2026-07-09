import type { ClarificationRequest } from "@/lib/executive/clarification";
import type { Suggestion } from "@/lib/executive/suggestion";

export type ExecutiveOutputSummary = {
  suggestionCount: number;
  clarificationCount: number;
  hasActionableSuggestions: boolean;
  hasPendingClarifications: boolean;
};

export type ExecutiveOutput = {
  suggestions: Suggestion[];
  clarifications: ClarificationRequest[];
  summary: ExecutiveOutputSummary;
  generatedAt: Date;
};
