import type { Suggestion } from "@/lib/executive/suggestion";

export type PresentedSuggestionWhy = {
  headline: string;
  supportingFacts: string[];
  rationale: string;
};

export type PresentedExecutiveSuggestion = Suggestion & {
  why: PresentedSuggestionWhy;
};

export type ExecutivePresentationInput = {
  suggestions: Suggestion[];
};
