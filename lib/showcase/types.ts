// lib/showcase/types.ts

export type ShowcaseStage = {
  title: string;
  headline: string;
  summary: string;
  bullets: string[];
  log: string;
};

export type ShowcaseUnderstandingItem = {
  id: string;
  label: string;
  summary: string;
  confidence?: number;
};

export type ShowcaseUnderstandingSection = {
  title: string;
  summary: string;
  items: ShowcaseUnderstandingItem[];
  emptyState: string;
};

export type ShowcaseUnderstanding = {
  people: ShowcaseUnderstandingSection;
  obligations: ShowcaseUnderstandingSection;
  emotions: ShowcaseUnderstandingSection;
  possibleRelations: ShowcaseUnderstandingSection;
};

export type ShowcaseProjection = {
  executionId: string;
  input: string;
  startedAt: string;
  completedAt: string;
  totalSteps: number;
  stages: ShowcaseStage[];
  understanding: ShowcaseUnderstanding;
};