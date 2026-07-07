// lib/demo/scenario/types.ts
export type DemoScenarioId =
  | "full-lifecycle"
  | "cognitive-output";

export type DemoScenario = {
  id: DemoScenarioId;
  title: string;
  description: string;
  input: string;
};