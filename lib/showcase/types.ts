// lib/showcase/types.ts

export type ShowcaseStage = {
  title: string;
  headline: string;
  summary: string;
  bullets: string[];
  log: string;
};

export type ShowcaseProjection = {
  executionId: string;
  input: string;
  startedAt: string;
  completedAt: string;
  totalSteps: number;
  stages: ShowcaseStage[];
};