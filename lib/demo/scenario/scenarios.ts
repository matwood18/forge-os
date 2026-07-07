// lib/demo/scenario/scenarios.ts
import type { DemoScenario } from "./types";

export const FULL_LIFECYCLE_DEMO_SCENARIO: DemoScenario = {
  id: "full-lifecycle",
  title: "Missing Cognitive Output",
  description:
    "Demonstrates Forge detecting insufficient cognitive output, recommending investigation, authorizing safe intended work, and materializing an investigation action.",
  input: "",
};

export const COGNITIVE_OUTPUT_DEMO_SCENARIO: DemoScenario = {
  id: "cognitive-output",
  title: "Cognitive Output",
  description:
    "Demonstrates Forge completing cognition and reflecting on the resulting execution.",
  input: "Jess helped redesign the memory engine.",
};

export const DEMO_SCENARIOS: DemoScenario[] = [
  FULL_LIFECYCLE_DEMO_SCENARIO,
  COGNITIVE_OUTPUT_DEMO_SCENARIO,
];